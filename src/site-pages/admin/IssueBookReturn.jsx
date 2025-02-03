import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import { useParams } from "react-router-dom";

const IssueBookReturn = () => {
  const [errorKey, setErrorKey] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState();
  const { id } = useParams();
  const [issue, setIssue] = useState({});
  const [issueBookList, setIssueBookList] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const convertToStructuredArray = (finalbooks) => {
    const result = {};

    const keys = Object.keys(finalbooks[0]);

    keys.forEach((key) => {
      result[key] = finalbooks.map((book) => book[key]);
    });

    return result;
  };

  useEffect(() => {
    if (id) {
      getDetail(new Date().toISOString().split("T")[0]);
    }
  }, []);

  useEffect(() => {
    calculatePayableAmount(issueBookList);
  }, [issueBookList]);

  const getIssuedBookDetail = async (id, fineData, return_date) => {
    setLoading(true);
    setIssueBookList([]);
    console.log(fineData);
    console.log(issue);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_issued_books");
      bformData.append("delete_status", 0);
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIssueBookList([]);

      console.log(response);
      if (response?.data?.status === 200) {
        setIssue((pre) => ({
          ...pre,
          
          sname: response?.data?.data?.issueData[0]?.sname,
          enrollmentNo: response?.data?.data?.issueData[0]?.enrollmentNo,
          issue_books_no: response?.data?.data?.issueData[0]?.issue_books_no,
          student_id: response?.data?.data?.issueData[0]?.student_id,
          issue_books_date:
            response?.data?.data?.issueData[0]?.issue_books_date,
          return_books_date:
            return_date || new Date().toISOString().split("T")[0],
          hidden_id: id,
          payable_amount:
            response?.data?.data?.issueData[0]?.payable_amount || 0,
          total_amount: 0,
          total_lost_books_amount:
            response?.data?.data?.issueData[0]?.total_lost_books_amount || 0,
          payment_method: response?.data?.data?.issueData[0]?.payment_method,
          fine_amount: fineData?.fine_amount,
          fine_days: fineData?.fine_days,
          fine_perday: fineData?.fine_perday,
          payable_amount:
            response?.data?.data?.booksData.length * fineData?.fine_amount,
          total_amount:
            response?.data?.data?.booksData.length * fineData?.fine_amount,
          singleBookFine: fineData?.fine_amount * fineData?.fine_perday || 0,
          total_fine: 0,
        }));

        response?.data?.data?.booksData?.map((bookDetail) => {
          if (bookDetail?.status === 1) {
            setIssueBookList((pre) => [
              ...pre,
              {
                books_id: bookDetail?.books_id,
                books_name: bookDetail?.books_name,
                author: bookDetail?.author,
                isbn_no: bookDetail?.isbn_no,
                publisher: bookDetail?.publisher,
                language: bookDetail?.language,
                price: bookDetail?.price,
                qty: bookDetail?.qty,
                total_books_price: 0,
                lost_book_price: bookDetail?.lost_book_price || 0,
                late_fine: fineData?.fine_amount * fineData?.fine_perday || 0,
              },
            ]);
          }
        });
      }
    } catch (error) {
      if (
        error?.response?.data?.status === 400 ||
        error?.response?.data?.status === 500
      ) {
        toast.success(error?.response?.data?.msg);
      }

      console.error("Error fetching internships data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value, type } = e.target;
    if (issue.issue_books_date > value) return;
    console.log(name, value);
    setIssue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name == "return_books_date") {
      await getDetail(value);
    }
  };

  const getDetail = async (return_date) => {
    await getLateFine(return_date).then(
      async (response) =>
        await getIssuedBookDetail(id, response?.data?.data, return_date)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(issue, issueBookList);
    setIsSubmit(true);
    try {
      let isValid = true;
      const booklist = issueBookList;

      if (!issue?.return_books_date) {
        setErrorMessage("Please pick return date ");
        toast.error("Please pick return date");
        setErrorKey(".return_books_date");

        isValid = false;
      } else if (booklist.length < 1) {
        toast.error("Please enter atleast one book detail");
        isValid = false;
      }
  
      
      

      if (!isValid) {
        console.log("Form contains errors. Please correct them and try again.");
      } else {
        setErrorMessage("");
        setErrorKey("");
      }
      if (isValid) {
        const bformData = new FormData();

        bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
        bformData.append("login_type", secureLocalStorage.getItem("loginType"));
        bformData.append("data", "return_book");

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

        for (let [key, value] of bformData) {
          console.log(key, value);
        }

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
          console.log(response)
          toast.success(response.data.msg);

          if (response.data.status === 200) {
            window.history.back();
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
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


  const handleInputChange = (index, event) => {
    
    if (event.target.value && (!/^\d+$/.test(event.target.value) || parseInt(event.target.value) < 1)) {
      return
    } 
    
    const inputLostBookAmount = parseFloat(event.target.value);
    let tempissueData = { ...issue };
    let valuesBookList = [...issueBookList];
    console.log(tempissueData);

    let currentBookDetail = valuesBookList[index];

    if (currentBookDetail) {
      if (inputLostBookAmount > 0) {
        currentBookDetail.lost_book_price = inputLostBookAmount;
        currentBookDetail.late_fine = 0;
      } else {
        currentBookDetail.lost_book_price = 0;
        currentBookDetail.late_fine = tempissueData?.singleBookFine || 0;
      }
      console.log(currentBookDetail);
      valuesBookList[index][event.target.name] = event.target.value;

      calculatePayableAmount(valuesBookList);
      setIssueBookList(valuesBookList);
    }
  };

  const calculatePayableAmount = (valuesBookList) => {
    let tempissueData = { ...issue };
    let payable_amount = 0;
    let total_lost_books_amount = 0;
    let total_fine = 0;
  
    valuesBookList.map((book) => {
      payable_amount +=
        Number(book.lost_book_price || 0) + Number(book?.late_fine || 0);
      total_lost_books_amount += Number(book.lost_book_price || 0);
      total_fine += Number(book.late_fine || 0);
    });
  
    tempissueData.payable_amount = payable_amount;
    tempissueData.total_books_price = total_lost_books_amount;
    tempissueData.total_fine = total_fine;
    tempissueData.total_amount = payable_amount;
  
    setIssue(tempissueData);
  };
  

  const getLateFine = async (value) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "lib_fine_calculation");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("issue_id", id);
      bformData.append("return_date", value);

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response;
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

  const removeField = (index) => {

    const values = [...issueBookList];
    if(values.length==1){
      toast.error("Minimum 1 book is required")
      return;
    }
    values.splice(index, 1);
    setIssueBookList(values);
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="">
            <nav className="breadcrumb">
              <a href="/" className="breadcrumb-item">
                Library
              </a>

              <span className="breadcrumb-item active">Return Book</span>
            </nav>
          </div>

          <div className="card bg-transparent mb-2">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h2 className="card-title col-12 col-md-auto">Return Book</h2>{" "}
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

          {!loading && (
            <div className="card">
              <div className="">
                <form>
                  <div className="modal-body">
                    <div className="row mb-3  border-bottom ">
                      <div className="form-group col-md-2">
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
                          readOnly
                        />
                        {errorKey === ".issue_books_no" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-3">
                        <label
                          className="font-weight-semibold"
                          htmlFor="student_id"
                        >
                          Student Name 
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="sname"
                          value={issue.sname}
                          readOnly
                        />
                        {errorKey === ".sname" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-3">
                        <label
                          className="font-weight-semibold"
                          htmlFor="student_id"
                        >
                          Enrollment No. 
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="enrollmentNo"
                          value={issue.enrollmentNo}
                          readOnly
                        />
                        {errorKey === ".enrollmentNo" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>

                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="issue_books_date"
                        >
                          Issue Book Date 
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="issue_books_date"
                          value={issue.issue_books_date}
                          readOnly
                        />
                        {errorKey === ".issue_books_date" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="return_books_date"
                        >
                          Return Date <span className="text-danger">*</span>
                        </label>
                        <input
                          id="return_books_date"
                          type="date"
                          className="form-control"
                          name="return_books_date"
                          value={issue.return_books_date}
                          min={issue.issue_books_date}
                          onChange={handleChange}
                        />
                        {errorKey === ".return_books_date" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
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
                            readOnly
                          />
                        </div>

                        <div className="form-group col-md-2">
                          <label
                            className="font-weight-semibold"
                            htmlFor="isbn_no"
                          >
                            ISBN
                          </label>
                          <input
                            id="isbn_no"
                            type="text"
                            className="form-control"
                            name="isbn_no"
                            value={formData.isbn_no}
                            readOnly
                          />
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
                            id="books_name"
                            type="text"
                            className="form-control"
                            name="books_name"
                            value={formData.books_name}
                            readOnly
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
                            id="author"
                            type="text"
                            className="form-control"
                            name="author"
                            value={formData.author}
                            readOnly
                          />
                          {errorKey === ".author" && (
                            <span className="text-danger">{errorMessage}</span>
                          )}
                        </div>

                        <div className="form-group col-md-1">
                          <label
                            className="font-weight-semibold"
                            htmlFor="price"
                          >
                            Price
                          </label>
                          <input
                            id="price"
                            type="number"
                            className="form-control"
                            name="price"
                            value={formData.price}
                            readOnly
                          />
                          {errorKey === ".price" && (
                            <span className="text-danger">{errorMessage}</span>
                          )}
                        </div>
                        <div className="form-group col-md-1">
                          <label
                            className="font-weight-semibold"
                            htmlFor="late_fine"
                          >
                            Late Fine
                          </label>
                          <input
                            id="late_fine"
                            type="text"
                            className="form-control"
                            name="late_fine"
                            value={formData.late_fine}
                            readOnly
                          />
                          {errorKey === ".late_fine" && (
                            <span className="text-danger">{errorMessage}</span>
                          )}
                        </div>
                        <div className="form-group col-md-2">
                          <label
                            className="font-weight-semibold"
                            htmlFor={index}
                          >
                            Lost Price
                          </label>
                          <input
                            id={index}
                            type="number"
                            className="form-control"
                            name="lost_book_price"
                            value={formData.lost_book_price}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                          />
                          {errorKey === ".lost_book_price" && (
                            <span className="text-danger">{errorMessage}</span>
                          )}
                        </div>
                        <div className="col-md-1 me-auto d-flex justify-content-between align-items-center">
                          <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                            <i
                              className="fas fa-trash-alt"
                              onClick={() => removeField(index)}
                            ></i>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="row ">
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="payable_amount"
                        >
                          Payable Amount
                        </label>
                        <input
                          id="payable_amount"
                          type="text"
                          className="form-control"
                          name="payable_amount"
                          value={issue.payable_amount}
                          readOnly
                        />
                        {errorKey === ".payable_amount" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-2">
                        <label className="font-weight-semibold">
                          Payment Method
                        </label>
                        <div className="d-flex">
                          {/* Cash Radio Button */}
                          <label
                            htmlFor="cash"
                            className="d-flex align-items-center mr-2"
                          >
                            <input
                              id="cash"
                              type="radio"
                              className="form-control"
                              name="payment_method"
                              value="cash" // Set specific value for the "Cash" option
                              checked={issue?.payment_method === "cash"} // Check if the payment method is cash
                              onChange={handleChange}
                            />
                            <span className="font-weight-semibold ml-1">
                              Cash
                            </span>
                          </label>

                          {/* Online Radio Button */}
                          <label
                            htmlFor="online"
                            className="d-flex align-items-center"
                          >
                            <input
                              id="online"
                              type="radio"
                              className="form-control"
                              name="payment_method"
                              value="online" // Set specific value for the "Online" option
                              checked={issue?.payment_method === "online"} // Check if the payment method is online
                              onChange={handleChange}
                            />
                            <span className="font-weight-semibold ml-1">
                              Online
                            </span>
                          </label>
                        </div>

                        {errorKey === ".payment_method" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                    </div>

                    <div className="row ">
                      <div className="col-md-12 me-auto d-flex justify-content-between align-items-center">
                        <button
                          className="btn btn-dark btn-block"
                          onClick={handleSubmit}
                          disabled={isSubmit}
                        >
                          Save{" "}
                          {isSubmit && (
                            <>
                              &nbsp; <div className="loader-circle "></div>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueBookReturn;
