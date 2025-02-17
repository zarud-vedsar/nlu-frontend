import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { formatDate } from "../../site-components/Helper/HelperFunction";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { FaLongArrowAltRight } from "react-icons/fa";
import "../../../node_modules/primeicons/primeicons.css";
import { useParams } from "react-router-dom";
import BookImage from "./assets/img/dummy.avif";
import { useNavigate } from "react-router-dom";

const IssueDetail = () => {
  const [loading, setLoading] = useState(true);
  const [issuedBookList, setIssuedBookList] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      await loadIssueBookList(id);
    };
    loadData();
  }, []);

  const loadIssueBookList = async (issuedId) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("data", "load_issued_books");
      formData.append("id", issuedId);
      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200) {
        setIssuedBookList(response?.data?.data);
      }
    } catch (error) {
      setIssuedBookList([]);
    } finally {
      setLoading(false);
    }
  };

  const redirectToPdfViewer = (dbId) => {
    navigate(`/student/book-viewer`, {
      state: { dbId }, // Passing dbId in state
      replace: false, // This will replace the current entry in the history stack
    });
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className=" mb-3 mt-0">
            <nav className="breadcrumb">
              <a href="/" className="breadcrumb-item">
                Library
              </a>

              <span className="breadcrumb-item active">Issued List</span>
            </nav>
          </div>
          <div className="card-header d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h2 className="card-title col-6">Issued List</h2>
            <div className="col-6 col-md-auto d-flex justify-content-start">
              <Button
                variant="light"
                onClick={() => window.history.back()}
                className="mb-2 mb-md-0"
              >
                <i className="fas">
                  <FaArrowLeft />
                </i>{" "}
                Go Back
              </Button>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 col-12">
                      {issuedBookList?.issueData[0]?.issue_books_no ? (
                        <div className="col-md-6 col-12 d-flex">
                          <h6>Issued No : </h6> &nbsp;
                          {issuedBookList?.issueData[0]?.issue_books_no}
                        </div>
                      ) : null}

                      {issuedBookList?.issueData[0]?.duration ? (
                        <div className="col-md-6 col-12 d-flex">
                          <h6>Duration :</h6> &nbsp;
                          {`${issuedBookList?.issueData[0]?.duration} day`}
                        </div>
                      ) : null}

                      {issuedBookList?.booksData?.length > 0 ? (
                        <div className="col-md-6 col-12 d-flex">
                          <h6>Number of books : </h6>&nbsp;
                          {issuedBookList?.booksData?.length}
                        </div>
                      ) : null}

                      {issuedBookList?.issueData[0]?.late_fine ? (
                        <div className="col-md-6 col-12 d-flex">
                          <h6> Late Fine : </h6>&nbsp;
                          {issuedBookList?.issueData[0]?.late_fine}
                        </div>
                      ) : null}

                      {issuedBookList?.issueData[0]?.issue_books_date ? (
                        <div className="col-md-6 col-12 d-flex">
                          <h6>Issued Date: </h6>&nbsp;
                          {formatDate(
                            issuedBookList?.issueData[0]?.issue_books_date
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="col-md-6 col-12">
                      <div className="col-md-6 col-12 d-flex">
                        <h6>Return Date : </h6>&nbsp;{" "}
                        {issuedBookList?.issueData[0]?.return_books_date ? (
                          <div className="text-success">
                            {formatDate(
                              issuedBookList?.issueData[0]?.return_books_date
                            )}{" "}
                          </div>
                        ) : (
                          <div className="text-danger">Not Return Yet</div>
                        )}
                      </div>

                      {issuedBookList?.issueData[0]?.total_lost_books_amount ? (
                        <div className="col-md-6 col-12 d-flex">
                          <h6>Total Lost Charge : </h6>&nbsp;
                          {
                            issuedBookList?.issueData[0]
                              ?.total_lost_books_amount
                          }
                        </div>
                      ) : null}

                      {issuedBookList?.issueData[0]?.payment_method ? (
                        <div className="col-md-6 col-12 d-flex">
                          <h6>Payment Method : </h6>&nbsp;
                          {issuedBookList?.issueData[0]?.payment_method}
                        </div>
                      ) : null}

                      {issuedBookList?.issueData[0]?.payable_amount ? (
                        <div className="col-md-6 col-12 d-flex">
                          <h6>Paid Amount : </h6>&nbsp;
                          {issuedBookList?.issueData[0]?.payable_amount}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                {issuedBookList?.booksData &&
                  issuedBookList?.booksData?.map((book, index) => (
                    <div
                      className="col-md-6 col-lg-6 col-12 col-sm-12 mb-4"
                      key={index}
                    >
                      <div
                        className="d-flex position-relative"
                        style={{
                          backgroundColor: "white",
                          padding: "14px",
                          gap: "40px",
                          minHeight: "200px",
                          borderRadius: "7px",
                        }}
                      >
                        <div className="id-book-img">
                          <img
                            src={BookImage}
                            className="card-img-top"
                            alt="..."
                            style={{ height: "200px" }}
                          />
                        </div>
                        <div className="px-3">
                          <h5 className="card-title mb-1">
                            {" "}
                            <strong
                              style={{
                                width: "110px",
                                display: "inline-block",
                              }}
                            >
                              ISBN:{" "}
                            </strong>{" "}
                            {book.isbn_no}
                          </h5>
                          <p className="card-text mb-1">
                            <strong
                              style={{
                                width: "110px",
                                display: "inline-block",
                              }}
                            >
                              Book Name:{" "}
                            </strong>{" "}
                            {book.books_name}
                          </p>
                          <p className="card-text mb-1">
                            <strong
                              style={{
                                width: "110px",
                                display: "inline-block",
                              }}
                            >
                              Author Name:{" "}
                            </strong>{" "}
                            {book.author}
                          </p>
                          <p className="card-text mb-1">
                            {" "}
                            <strong
                              style={{
                                width: "110px",
                                display: "inline-block",
                              }}
                            >
                              publisher:{" "}
                            </strong>{" "}
                            {book.publisher}
                          </p>
                          <p className="card-text mb-1">
                            <strong
                              style={{
                                width: "110px",
                                display: "inline-block",
                              }}
                            >
                              Language:{" "}
                            </strong>{" "}
                            {book.language}
                          </p>
                          <p className="card-text mb-1">
                            <strong
                              style={{
                                width: "110px",
                                display: "inline-block",
                              }}
                            >
                              Price:{" "}
                            </strong>{" "}
                            {book.price}
                          </p>
                          <button
                            onClick={() => redirectToPdfViewer(book?.id)}
                            className="float-right btn btn-success"
                            style={{
                              position: "absolute",
                              bottom: "14px",
                              right: "13px",
                            }}
                          >
                            View PDF <FaLongArrowAltRight />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IssueDetail;
