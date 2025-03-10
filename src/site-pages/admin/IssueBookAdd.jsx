import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import {
  PHP_API_URL,
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import Select from "react-select";
import { Link } from "react-router-dom";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";

const IssueBookAdd = () => {
  const [errorKey, setErrorKey] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [isSubmit, setIsSubmit] = useState(false);
  const [studentListing, setStudentListing] = useState([]);
  const [FetchBook, setFetchBook] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const convertToStructuredArray = (finalbooks) => {
    const result = {};

    const keys = Object.keys(finalbooks[0]);

    keys.forEach((key) => {
      result[key] = finalbooks.map((book) => book[key]);
    });

    return result;
  };
  const fetchStudent = async () => {
    try {
      let session = localStorage.getItem("session");
      const response = await axios.post(
        `${NODE_API_URL}/api/student-detail/get-student`,
        { session: session }
      );

      if (
        response?.data?.statusCode === 200 &&
        response?.data?.data.length > 0
      ) {
        setStudentListing(response?.data?.data);
      } else {
        toast.error("Data not found.");
        
        setStudentListing([]);
      }
    } catch (error) {
      setStudentListing([]);
    }
  };

  const initialization = {
    isbn_no: "",
    books_id: "",
    books_name: "",
    author: "",
    publisher: "",
    language: "",
    price: "",
    qty: 1,
  };
  const studentDataInit = {
    issue_books_no: "",
    student_id: "",
    issue_books_date: new Date().toISOString().split("T")[0],
  };
  const [issue, setIssue] = useState(studentDataInit);
  const [issueBookList, setIssueBookList] = useState([]);
  const [librarySetting, setLibrarySetting] = useState();
  const [notissuablebooks, setNotissuablebooks] = useState([]);
  const [stdBookIssueCount, setStdBookIssueCount] = useState();
  const [isStudentId, setIsStudentId] = useState(false);

  const handleChange = async (e) => {
    const { name, value, type } = e.target;

    setIssue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChange = (index, event) => {
    const values = [...issueBookList];
    values[index][event.target.name] = event.target.value;
    setIssueBookList(values);
  };

  const autoFillBookDetail = (index, data) => {
    const values = [...issueBookList];
    values[index]["books_id"] = data?.id;
    values[index]["books_name"] = data?.book_name;
    values[index]["author"] = data?.author;
    values[index]["publisher"] = data?.publisher;
    values[index]["language"] = data?.language;
    values[index]["price"] = data?.price;
    values[index]["qty"] = 1;
    setIssueBookList(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmit(true);

      let isValid = true;
      const booklist = issueBookList;

      if (!issue.student_id) {
        setErrorMessage("Please select student");
        toast.error("Please select student");
        setErrorKey(".student_id");

        isValid = false;
      } else if (!issue.issue_books_date) {
        setErrorMessage("Please pick date");
        toast.error("Please pick date");
        setErrorKey(".issue_books_date");

        isValid = false;
      } else if (booklist.length < 1) {
        toast.error("Please enter atleast one book detail");
        isValid = false;
      } else if (booklist.length > 0) {
        issueBookList.map((bookData, index) => {
          if (!bookData?.books_id) {
            toast.error(
              `Please enter valid ISBN Number of Serial Number ${index + 1}`
            );
            
            isValid = false;
          }
        });
      }

      if (isValid) {
        setErrorMessage("");
        setErrorKey("");
      }

      if (isValid) {
        const deleteAlert = await DeleteSweetAlert(" ");
        if (!deleteAlert) {
          return;
        }

        const bformData = new FormData();

        bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
        bformData.append("login_type", secureLocalStorage.getItem("loginType"));
        bformData.append("data", "add_book_issue");
        bformData.append("duration", librarySetting?.issue_duration);

        const resArray = convertToStructuredArray(issueBookList);

        Object.keys(resArray).forEach((key) => {
          const value = resArray[key];
          value?.map((ele) => {
            bformData.append(`${key}[]`, ele);
          });
        });

        Object.keys(issue).forEach((key) => {
          const value = issue[key];
          bformData.append(key, value);
        });

        const response = await axios.post(
          `${PHP_API_URL}/lib_books.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data?.status === 200 || response.data?.status === 201) {
          toast.success(response.data.msg);
          setIssue(studentDataInit);
          setIssueBookList([initialization]);
          gen_issue_no();
          if (response.data.status === 200) {
            window.history.back();
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      const status = error.response?.data?.status;
      if (status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else if (status == 400) {
        toast.error(error.response.data.msg);
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };

  const getLibrarySetting = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_library_sett");

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setLibrarySetting(response.data?.data[0]);
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const getnotissuablebooks = async (studentId) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getnotissuablebooks");
      bformData.append("student_id", studentId);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setNotissuablebooks(response.data.data);
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const getStdBookIssueCount = async (studentId) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getStdBookIssueCount");
      bformData.append("student_id", studentId);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setStdBookIssueCount(response.data?.data?.issuedBookCount);
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  const addMoreField = (e) => {
    e.preventDefault();
    if (issueBookList.length + stdBookIssueCount >= librarySetting?.max_issue) {
      toast.error("Max limit allowed cross");
      return;
    }
    setIssueBookList([...issueBookList, initialization]);
  };

  const removeField = async (index) => {
    const deleteAlert = await DeleteSweetAlert(" ");
    if (!deleteAlert) {
      return;
    }
    const values = [...issueBookList];
    values.splice(index, 1);
    setIssueBookList(values);
  };

  const handleBlur = async (isbn_no) => {
    if (isbn_no.trim()) {
      const existingBook = issueBookList.filter(
        (bookData) => bookData.isbn_no === isbn_no
      );
      const data = {
        id: "",
        book_name: "",
        author: "",
        publisher: "",
        language: "",
        price: "",
        qty: 1,
      };
      if (notissuablebooks.includes(isbn_no)) {
        toast.error("This book with the same ISBN recently issued!");
        return data;
      }
      if (existingBook.length > 1) {
        toast.error("This book with the same ISBN already exists!");
        return data;
      }
      return await getBookByIsbn(isbn_no);
    }
  };
  const getStudentDetail = async (studentId) => {
    if (studentId) {
      setIsStudentId(true);
      await getLibrarySetting();
      await getnotissuablebooks(studentId);
      await getStdBookIssueCount(studentId);
    } else {
      setIsStudentId(false);
    }
  };

  const gen_issue_no = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "gen_issue_no");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        let issue_no = response.data?.data?.issue_no;
        setIssue((prevState) => ({
          ...prevState,
          issue_books_no: issue_no,
        }));
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  useEffect(() => {
    gen_issue_no();
    fetchStudent();
  }, []);

  const getBookByIsbn = async (isbn_no) => {
    const data = {
      id: "",
      book_name: "",
      author: "",
      publisher: "",
      language: "",
      price: "",
      qty: 1,
    };
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
      if (res?.data?.status == 200) {
        if (res?.data?.data[0]?.stock < 1) {
          toast.error("Book stock not available");
          return data;
        }
        return res?.data?.data[0];
      }
    } catch (error) {
      return data;
    } finally {
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="">
            <nav className="breadcrumb">
              <a href="/admin/" className="breadcrumb-item">
                <i className="fas fa-home m-r-5" />
                Dashboard
              </a>
              <span className="breadcrumb-item active">Library Management</span>
              <span className="breadcrumb-item active">Add Issue Book</span>
            </nav>
          </div>
          <div className="card bg-transparent mb-2">
            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
              <h2 className="card-title col-12 col-md-auto">
                {"Add Issue Book"}{" "}
              </h2>
              <div className="ml-auto id-mobile-go-back">
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
                <Link
                  to="/admin/issue-book"
                  className="ml-2 btn-md btn border-0 btn-secondary"
                >
                  <i className="fas fa-list" /> Issued List
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="">
              <form>
                <div className="modal-body">
                  <div className="row mb-3  border-bottom ">
                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="issue_books_no"
                      >
                        Issue Book No.
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="issue_books_no"
                        value={issue.issue_books_no}
                        disabled
                      />
                      {errorKey === ".issue_books_no" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="student_id"
                      >
                        Select Student <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={
                          studentListing?.map((student) => ({
                            value: student.id,
                            label: `${student.sname} (${student.enrollmentNo})`,
                          })) || []
                        }
                        onChange={(selectedOption) => {
                          setIssue({
                            ...issue,
                            student_id: selectedOption.value,
                          });
                          getStudentDetail(selectedOption.value);
                        }}
                        value={
                          issue.student_id
                            ? {
                                value: issue.student_id,
                                label: studentListing?.find(
                                  (student) => student.id === issue.student_id
                                )
                                  ? `${
                                      studentListing.find(
                                        (student) =>
                                          student.id === issue.student_id
                                      )?.sname
                                    } (${
                                      studentListing.find(
                                        (student) =>
                                          student.id === issue.student_id
                                      )?.enrollmentNo
                                    })`
                                  : "Select",
                              }
                            : { value: "", label: "Select" }
                        }
                      />

                      {errorKey === ".student_id" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="issue_books_date"
                      >
                        Date of Issue <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="issue_books_date"
                        value={issue.issue_books_date}
                        onChange={handleChange}
                      />
                      {errorKey === ".issue_books_date" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                    {/* <div className="form-group col-md-2">
                    <label className="font-weight-semibold" htmlFor="duration">
                      Duration <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration"
                      value={issue.duration}
                      onChange={handleChange}
                    />
                    {errorKey === ".duration" && (
                      <span className="text-danger">{errorMessage}</span>
                    )}
                  </div> */}
                  </div>

                  {issueBookList.map((formData, index) => (
                    <div className="row  mb-3  border-bottom " key={index}>
                      <div className="form-group col-md-1">
                        <label className="font-weight-semibold" htmlFor="">
                          Sr no.
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={index + 1}
                          disabled
                        />
                      </div>

                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="isbn_no"
                        >
                          ISBN <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex justify-content-between align-items-center">
                          <input
                            type="text"
                            className="form-control"
                            name="isbn_no"
                            value={formData.isbn_no}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault(); // Prevent Enter key inside the form
                              }
                            }}
                            onBlur={async () => {
                              setFetchBook(true);
                              await handleBlur(formData.isbn_no).then((res) => {
                                autoFillBookDetail(index, res);
                              });
                              setFetchBook(false);
                            }}
                          />
                          {FetchBook && <div className="loader-circle"></div>}
                        </div>
                        {errorKey === ".isbn_no" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>

                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="books_name"
                        >
                          Book Name
                        </label>
                        <input
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent Enter key inside the form
                            }
                          }}
                          type="text"
                          className="form-control"
                          name="books_name"
                          value={formData.books_name}
                          disabled
                        />
                        {errorKey === ".books_name" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-2">
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
                          disabled
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent Enter key inside the form
                            }
                          }}
                        />
                        {errorKey === ".author" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-2">
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
                          disabled
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent Enter key inside the form
                            }
                          }}
                        />
                        {errorKey === ".publisher" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-1">
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
                          disabled
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent Enter key inside the form
                            }
                          }}
                        />
                        {errorKey === ".language" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-1">
                        <label className="font-weight-semibold" htmlFor="price">
                          Price
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          disabled
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent Enter key inside the form
                            }
                          }}
                        />
                        {errorKey === ".price" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      {isMobile ? (
                        <div className="col-12 ">
                          <div className="btn btn-danger btn-block">
                            <i
                              className="fas fa-trash-alt"
                              onClick={() => removeField(index)}
                            ></i>
                          </div>
                        </div>
                      ) : (
                        <div className="col-md-1 me-auto d-flex justify-content-between align-items-center">
                          <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                            <i
                              className="fas fa-trash-alt"
                              onClick={() => removeField(index)}
                            ></i>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="row">
                    <div className="col-md-2 mb-2 me-auto d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-primary btn-block"
                        onClick={addMoreField}
                        type="button"
                        disabled={!isStudentId}
                      >
                        + Add More
                      </button>
                    </div>
                    <div className="col-md-12 me-auto d-flex justify-content-between align-items-center">
                      {isSubmit ? (
                        <div className="btn btn-dark btn-block">Saving</div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-dark btn-block"
                          onClick={handleSubmit}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBookAdd;
