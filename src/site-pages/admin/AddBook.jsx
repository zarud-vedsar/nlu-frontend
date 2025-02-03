import React, { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { PHP_API_URL , CKEDITOR_URL} from "../../site-components/Helper/Constant";
import Select from "react-select";
import { toast,  } from "react-toastify";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { dataFetchingPost } from "../../site-components/Helper/HelperFunction";
import validator from "validator";

const AddBook = () => {

  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState();

  const [errorKey, setErrorKey] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const [isSubmit, setIsSubmit] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [subject, setSubject] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isbnValid, setIsbnValid] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = CKEDITOR_URL;
    script.async = true;
    script.onload = () => {
        // Initialize CKEditor instance
        window.CKEDITOR.replace('editor1', {
            versionCheck: false, // Disable security warnings
        });

        // Update the formData when the editor content changes
        window.CKEDITOR.instances['editor1'].on('change', () => {
            const data = window.CKEDITOR.instances['editor1'].getData();
            setFormData((prevState) => ({
                ...prevState,
                des: data, // Update description in formData
            }));
        });
    };
    document.body.appendChild(script);

    // Cleanup CKEditor instance on component unmount
    return () => {
        if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
            window.CKEDITOR.instances['editor1'].destroy();
        }
    };
}, []);

  useEffect(() => {
    fetchSubject();
    if (id) {
      getFacultyDetail();
    }
  }, []);

  const fetchSubject = async (deleteStatus = 0) => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/subject/fetch`,
        {
          deleteStatus,
          column:
            "id, subname, subcode, created_at, status, deleted_at, deleteStatus",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        console.log(response);
        const tempSubjectList = response.data.map((subject) => ({
          value: subject.id,
          label: subject.subname,
        }));
        setSubjectList(tempSubjectList);
      } else {
        toast.error("Data not found.");
        setSubjectList([]);
      }
    } catch (error) {
      setSubjectList([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        setTitleError(error.response.message);
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsFetching(false);
    }
  };

  const initialization = {
    user_update_id: "",
    user_updateu_id: "",
    image: "",
    des: "",
    qty: "",
    price: "",
    language: "",
    number_of_pages: "",
    edition: "",
    publisher: "",
    publishing_date: "",
    subject_id: "",
    author: "",
    isbn_no: "",
    book_name: "",
    vendor: "",
  };
  const [formData, setFormData] = useState(initialization);

  const handleBlur = () => {
    if (formData?.isbn_no.trim()) {
      getBookByIsbn(formData?.isbn_no);
    }
  };

  const getBookByIsbn = async (isbn_no) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getBookByIsbn");
      bformData.append("isbn_no", isbn_no);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const res = await axios.post(`${PHP_API_URL}/lib_books.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = res.data.data;
      console.log(result);
      console.log(res);
      if (res?.data?.status == 200) {
        setFormData({
          user_update_id: result[0].id,
          user_updateu_id: result[0]?.uid,
          image: result[0]?.image,
          des: result[0]?.des,
          qty: result[0]?.qty,
          price: result[0]?.price,
          language: result[0]?.language,
          number_of_pages: result[0]?.number_of_pages,
          edition: result[0]?.edition,
          publisher: result[0]?.publisher,
          publishing_date: result[0]?.publishing_date,
          subject_id: result[0]?.subject_id,
          author: result[0]?.author,
          isbn_no: result[0]?.isbn_no,
          book_name: result[0]?.book_name,
          vendor: result[0]?.vendor,
          unlink_image: result[0]?.image,
        });

        console.log(formData);
        setPreviewImage(
          `${NODE_API_URL}/public/upload/books/${result[0].image}`
        );
        if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
          window.CKEDITOR.instances['editor1'].setData(
              validator.unescape(validator.unescape(result[0].des)) 
          );
      }

        const selSubject = subjectList?.find(
          (sub) => sub.value === result[0].subject_id
        );
        if (selSubject) {
          setSubject(selSubject);
        }
        setIsbnValid(true);
      }
    } catch (error) {
      setFormData((pre) => ({
        ...pre,
        ...initialization,
        isbn_no: isbn_no,
      }));
      setSubject(null);

      setIsbnValid(false);

      console.log(error);
    } finally {
    }
  };

  const getFacultyDetail = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getBookById");
      bformData.append("id", id);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const res = await axios.post(`${PHP_API_URL}/lib_books.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = res.data.data;
      console.log(result);
      setFormData({
        user_update_id: result[0].id,
        user_updateu_id: result[0]?.uid,
        image: result[0]?.image,
        des: result[0]?.des,
        qty: result[0]?.qty,
        price: result[0]?.price,
        language: result[0]?.language,
        number_of_pages: result[0]?.number_of_pages,
        edition: result[0]?.edition,
        publisher: result[0]?.publisher,
        publishing_date: result[0]?.publishing_date,
        subject_id: result[0]?.subject_id,
        author: result[0]?.author,
        isbn_no: result[0]?.isbn_no,
        book_name: result[0]?.book_name,
        vendor: result[0]?.vendor,
        unlink_image: result[0]?.image,
      });
      console.log(formData);
      setPreviewImage(`${NODE_API_URL}/public/upload/books/${result[0].image}`);
      if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
        window.CKEDITOR.instances['editor1'].setData(
            validator.unescape(validator.unescape(result[0]?.des)) // Ensure content is unescaped properly
        );
    }

      const selSubject = subjectList?.find(
        (sub) => sub.value === result[0].subject_id
      );
      if (selSubject) {
        setSubject(selSubject);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleChange = async (e) => {
    const { name, value, type } = e.target;

    if (type == "number" && value.length > 10) {
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    console.log(formData);

    if (formData.isbn_no == "") {
      console.log("error");

      setErrorMessage("Please enter ISBN number");
      setErrorKey(".isbn_no");
      isValid = false;
    } else if (formData.book_name == "") {
      console.log("error");

      setErrorMessage("Please enter book name");
      setErrorKey(".book_name");
      isValid = false;
    } else if (formData.qty == "" || formData.qty < 1) {
      console.log("error");
      setErrorMessage("Quantity must be greater than and equal to 1");
      setErrorKey(".qty");
      isValid = false;
    } else if (formData.price == "" || formData.price < 0) {
      console.log("error");
      setErrorMessage("Price valid price");
      setErrorKey(".price");
      isValid = false;
    }

    if (!isValid) {
      console.log("Form contains errors. Please correct them and try again.");
    } else {
      setErrorMessage("");
      setErrorKey("");
    }

    if (isValid) {
      console.log("submit");
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "book_add");

      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        bformData.append(key, value);
        console.log(key, value);
      });

      if (id) {
        bformData.append("update_id", id);
      }

      try {
        const response = await axios.post(
          `${PHP_API_URL}/lib_books.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        if (response.data?.status === 200 || response.data?.status === 201) {
          toast.success(response.data.msg);
          setFormData(initialization);
          if (response.data?.status === 200) {
            window.history.back();
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        const status = error.response?.data?.status;

        if (status === 500) {
          toast.error(error.response.data.msg || "A server error occurred.");
        } else if (status == 400) {
          setErrorKey(error.response.data.key);
          setErrorMessage(error.response.data.msg);
          toast.error(error.response.data.msg);
        } else {
          toast.error(
            "An error occurred. Please check your connection or try again."
          );
        }
      } finally {
      }
    }
  };

  const updateSubject = (e) => {
    setSubject(e);
    setFormData((prevState) => ({
      ...prevState,
      subject_id: e.value,
    }));
  };

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="page-container ">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    Library
                  </a>

                  <span className="breadcrumb-item active">Add Book</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {id ? "Update Book Detail" : "Add New Book"}
                </h5>
                <div className="ml-auto">
                  <Button
                    variant="light"
                    className="mb-2 mb-md-0"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas">
                      <FaArrowLeft />
                    </i>{" "}
                    Go Back
                  </Button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="">
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-12 mt-2 mb-3">
                        <h6 className="custom">
                          <span className="custo-head">Book Details</span>
                        </h6>
                      </div>

                      {/* Avatar */}

                      <div className="form-group col-md-12">
                        <div
                          style={{
                            width: "110px",
                            height: "100px",
                            position: "relative",
                          }}
                          className="mx-auto"
                        >
                          {formData.image ? (
                            <img
                              src={previewImage}
                              alt="Uploaded Preview"
                              style={{
                                width: "110px",
                                height: "100px",
                                position: "relative",
                              }}
                              className=""
                            />
                          ) : (
                            <div
                              className=""
                              style={{
                                width: "110px",
                                height: "100px",
                                position: "relative",
                                background: "#efeff6",
                              }}
                            >
                              {" "}
                            </div>
                          )}
                          <label
                            htmlFor="avatar-input"
                            onClick={triggerFileInput}
                            className="rounded-circle d-flex justify-content-center  align-items-center"
                            style={{
                              position: "absolute",
                              bottom: "-7px",
                              right: "6px",
                              backgroundColor: "#1ad1ff",
                              width: "30px",
                              height: "30px",
                            }}
                          >
                            <FaRegEdit />
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                          />{" "}
                          <span className="mt-1 avtar_user"></span>
                        </div>
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="isbn_no"
                        >
                          ISBN Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="isbn_no"
                          value={formData.isbn_no}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errorKey === ".isbn_no" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="book_name"
                        >
                          Book Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="book_name"
                          value={formData.book_name}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />
                        {errorKey === ".book_name" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="edition"
                        >
                          Edition
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="edition"
                          value={formData.edition}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />
                        {errorKey === ".edition" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="publisher"
                        >
                          Publisher
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="publisher"
                          value={formData.publisher}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />
                        {errorKey === ".publisher" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="author"
                        >
                          Author
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="author"
                          value={formData.author}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />
                        {errorKey === ".author" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>

                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="language"
                        >
                          Language
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />
                        {errorKey === ".language" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-2">
                        <label className="font-weight-semibold" htmlFor="qty">
                          Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                          disabled={id ? true : false}
                          type="number"
                          className="form-control"
                          name="qty"
                          value={formData.qty}
                          onChange={handleChange}
                        />
                        {errorKey === ".qty" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-2">
                        <label className="font-weight-semibold" htmlFor="price">
                          Price <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />
                        {errorKey === ".price" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="number_of_pages"
                        >
                          Number Of Pages
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="number_of_pages"
                          value={formData.number_of_pages}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />
                        {errorKey === ".number_of_pages" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="publishing_date"
                        >
                          Publishing Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="publishing_date"
                          value={formData.publishing_date}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />
                        {errorKey === ".publishing_date" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-3">
                        <label
                          className="font-weight-semibold"
                          htmlFor="vendor"
                        >
                          Vendor
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="vendor"
                          value={formData.vendor}
                          onChange={handleChange}
                          disabled={isbnValid}
                        />

                        {errorKey === ".vendor" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-3">
                        <label
                          className="font-weight-semibold"
                          htmlFor="vendor"
                        >
                          Subject ID
                        </label>
                        <Select
                          value={subject}
                          options={subjectList}
                          onChange={updateSubject}
                          disabled={isbnValid}
                        />

                        {errorKey === ".subject_id" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>

                        <div className='col-md-12 px-0'>
                                        <label className='font-weight-semibold'>Description</label>
                                        <textarea id="editor1" name="description">{formData.des && validator.unescape(formData.des)}</textarea>
                                    </div>

                      <div className="col-md-12 me-auto d-flex justify-content-between align-items-center">
                        <button
                          type="submit"
                          className="btn btn-dark btn-block"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBook;
