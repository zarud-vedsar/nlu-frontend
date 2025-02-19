import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { toast, ToastContainer } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../site-components/Helper/HelperFunction";
const IssuedBookStatus = () => {
  const [loading, setLoading] = useState();
  const { id } = useParams();
  const [issue, setIssue] = useState({});
  const [issueBookList, setIssueBookList] = useState([]);

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

      if (response?.data?.status === 200) {
        setIssue((pre) => ({
          ...pre,
          issue_books_no: response?.data?.data?.issueData[0]?.issue_books_no,
          student_id: response?.data?.data?.issueData[0]?.student_id,
          issue_books_date:
            response?.data?.data?.issueData[0]?.issue_books_date,
          return_books_date:
            return_date || new Date().toISOString().split("T")[0],
          hidden_id: id,
          // payable_amount:response?.data?.data?.issueData[0]?.payable_amount || 0,
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
          if (bookDetail?.status == 1) {
            setIssueBookList((pre) => [
              ...pre,
              {
                books_id: bookDetail?.books_id,
                status: bookDetail?.status,
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
                return_date: bookDetail?.return_book_date,
              },
            ]);
          } else {
            setIssueBookList((pre) => [
              ...pre,
              {
                books_id: bookDetail?.books_id,
                status: bookDetail?.status,
                books_name: bookDetail?.books_name,
                author: bookDetail?.author,
                isbn_no: bookDetail?.isbn_no,
                publisher: bookDetail?.publisher,
                language: bookDetail?.language,
                price: bookDetail?.price,
                qty: bookDetail?.qty,
                total_books_price: 0,
                lost_book_price: bookDetail?.lost_book_price || 0,
                late_fine: bookDetail?.late_fine || 0,
                return_date: bookDetail?.return_book_date,
                payment_method: bookDetail?.payment_method,
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

    } finally {
      setLoading(false);
    }
  };

  const getDetail = async (return_date) => {
    await getLateFine(return_date).then(
      async (response) =>
        await getIssuedBookDetail(id, response?.data?.data, return_date)
    );
  };

  const calculatePayableAmount = (valuesBookList) => {
    let tempissueData = { ...issue };
    let payable_amount = 0;
    let total_lost_books_amount = 0;
    let total_fine = 0;

    valuesBookList.map((book) => {
      if (book.status == 0) {
        payable_amount +=
          Number(book.lost_book_price || 0) + Number(book?.late_fine || 0);

        total_lost_books_amount += Number(book.lost_book_price || 0);
        total_fine += Number(book.late_fine || 0);
      }
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

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="">
              <nav className="breadcrumb">
              <a href="/admin/" className="breadcrumb-item">
                                     <i className="fas fa-home m-r-5" />
                                    Dashboard
                                   </a>
                                   <span className="breadcrumb-item active">
                                   Library Management
                                   </span>

                <span className="breadcrumb-item active">Book Status</span>
              </nav>
            </div>

            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h2 className="card-title col-12 col-md-auto">Book Status</h2>{" "}
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
              <div className="">
                <div className="card">
                  <div className="card-body">
                    <div className="row ">
                      <div className="col-md-4">
                        <span className="fw-semibold text-dark">
                          Issue Book No.:{" "}
                          <span className="text-primary">
                            {issue.issue_books_no}
                          </span>
                        </span>
                      </div>
                      <div className="col-md-4">
                        <span className="fw-semibold text-dark">
                          Student Name:{" "}
                          <span className="text-primary">
                            {issue.student_id}
                          </span>
                        </span>
                      </div>
                      <div className="col-md-4">
                        <span className="fw-semibold text-dark">
                          Issue Book Date:{" "}
                          <span className="text-primary">
                            {issue.issue_books_date}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="row ">
                      <div className="col-md-4">
                        <span className="fw-semibold text-dark">
                          Total Amount Paid:{" "}
                          <span className="text-primary">
                            {issue.payable_amount}
                          </span>
                        </span>
                      </div>
                      <div className="col-md-4">
                        <span className="fw-semibold text-dark">
                          Total Fine Paid:{" "}
                          <span className="text-primary">
                            {issue.total_fine}
                          </span>
                        </span>
                      </div>

                      <div className="col-md-4">
                        <span className="fw-semibold text-dark">
                          Total Lost Book Charge Paid:{" "}
                          <span className="text-primary">
                            {issue.total_books_price}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container-fluid d-flex flex-wrap">
                  {issueBookList.map((formData, index) => (
                    <div
                      className="card mr-4 mb-4"
                      key={index}
                      style={{ width: "350px" }}
                    >
                      <div className="card-body">
                        <div className="">
                          <div className="row">
                            <div className="col-8 card-title">
                              {" "}
                              <div>{formData?.books_name} </div>
                              <h5>ISBN : {formData?.isbn_no}</h5>
                            </div>

                            <div className="col-4">
                              {formData?.status ? (
                                <span className="badge badge-warning">
                                  Pending
                                </span>
                              ) : (
                                <span className="badge badge-success">
                                  Returned
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="row">
                            <div className="col-6"> Author Name:</div>
                            <div className="col-6"> {formData?.author}</div>
                            <div className="col-6"> Publisher Name:</div>

                            <div className="col-6"> {formData?.publisher}</div>
                            <div className="col-6"> Language :</div>

                            <div className="col-6"> {formData?.language}</div>
                            <div className="col-6"> Price:</div>

                            <div className="col-6"> {formData?.price}</div>

                            <div className="col-6"> Lost Price:</div>

                            <div className="col-6 text-danger">
                              {" "}
                              {formData?.lost_book_price}
                            </div>
                            <div className="col-6"> Late Fine:</div>

                            <div className="col-6 text-danger">
                              {" "}
                              {formData?.late_fine}
                            </div>

                            <div className="col-6"> Return Date:</div>

                            <div className="col-6 text-success">
                              {" "}
                              {formData?.return_date}
                            </div>
                            <div className="col-6"> Payment Method:</div>

                            <div className="col-6 text-warning">
                              {" "}

                              {capitalizeFirstLetter(formData?.payment_method)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IssuedBookStatus;
