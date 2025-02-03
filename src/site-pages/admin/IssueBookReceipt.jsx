import React, { useState, useEffect } from "react";
import axios from "axios";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { formatDate } from "../../site-components/Helper/HelperFunction";
const IssueBookReceipt = () => {
  const [loading, setLoading] = useState();
  const { id } = useParams();
  const [issue, setIssue] = useState({});
  const [issueBookList, setIssueBookList] = useState([]);
  const [totalBooksPrice, setTotalBooksPrice] = useState(0);

  useEffect(() => {
    if (id) {
      getIssuedBookDetail(id);
    }
  }, []);

  const getIssuedBookDetail = async (id) => {
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
      console.log(response)
      if (response?.data?.status === 200) {
        setIssue((pre) => ({
          ...pre,
          issue_books_no: response?.data?.data?.issueData[0]?.issue_books_no,
          student_id: response?.data?.data?.issueData[0]?.student_id,
          issue_books_date:
            response?.data?.data?.issueData[0]?.issue_books_date,
          return_books_date: response?.data?.data?.issueData[0]?.return_books_date,
          hidden_id: id,
          payable_amount: 0,
          total_amount: 0,
          total_lost_books_amount: 0,
          payment_method: 0,
        }));

        let totalPrice=0;
        response?.data?.data?.booksData?.map((bookDetail) => {
            totalPrice = Number(totalPrice) + Number(bookDetail?.price)
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
              lost_book_price: 0,
              total_books_price: 0,
            },
          ]);
        });
        setTotalBooksPrice(totalPrice);
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

  const printDiv = (divId) => {
    const content = document.getElementById(divId).innerHTML;
    const printWindow = window.open('', '', 'height=800, width=800');

    // Get the external stylesheets (CSS) or include inline styles
    const styles = document.querySelectorAll('link[rel="stylesheet"], style');
    const styleSheets = Array.from(styles).map(style => style.outerHTML).join('');
    
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Issued Books Receipt</title>
          ${styleSheets} <!-- Include external styles -->
          <style>
            /* Optional: Additional CSS styles for the print window */
            .receipt_card {
              width: 350px;
              background-color: #fff;
              margin: 0 auto;
              padding: 10px;
            }
            /* Ensure the printed content looks exactly as on screen */
            body {
              font-family: Arial, sans-serif;
            }
            .invoice-table th, .invoice-table td {
              padding: 5px;
              text-align: left;
            }
          </style>
        </head>
        <body onload="window.print()">
          <center>${content}</center>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="main-content">
    <div>
      <div className="row">
        <div className="col-6 d-flex align-items-center justify-content-start my-3 px-3 px-md-5">
          <button className="btn btn-primary" onClick={()=>(window.history.back())}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>

        <div className="col-6 d-flex align-items-center justify-content-end my-3 px-3 px-md-5">
          <button
            className="btn btn-primary"
            onClick={() => printDiv("foam_print")}
          >
            <i className="fas fa-print"></i> Print Issue Books
          </button>
        </div>
      </div>

      <div id="foam_print">
        <div className="receipt_card">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card invoice-info-card">
                <div className="card-body p-2">
                  <div className="invoice-item invoice-item-one border p-1">
                    <div className="d-flex justify-content-between">
                      <div className="invoice-head">
                        <strong className="customer-text-one">
                          Issued No :{" "}
                          <span className="invoice-details">
                            {issue?.issue_books_no}
                          </span>
                        </strong>
                      </div>
                      <div className="invoice-head">
                        <strong className="customer-text-one">
                          Issued To :{" "}
                          <span className="invoice-details">
                            {issue?.student_id}
                          </span>
                        </strong>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="invoice-head">
                        <strong className="customer-text-one">
                          Issued Date :{" "}
                          <span className="invoice-details">
                            {formatDate(issue?.issue_books_date)}
                          </span>
                        </strong>
                      </div>
                      {issue.return_books_date && (
                        <div className="invoice-head">
                          <strong className="customer-text-one">
                            Return Date :{" "}
                            <span className="invoice-details">
                              {formatDate(issue?.return_books_date)}
                            </span>
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* <div className="row">
                    <div className="col-12 text-center">
                      <div className="invoice-head">
                        <strong className="customer-text-one">{adminData.name}</strong>
                      </div>
                    </div>
                    <div className="col-12 text-center">
                      <div className="invoice-head">
                        <strong className="customer-text-one">
                          {adminData.address} {adminData.city}, {adminData.stateTitle}.
                        </strong>
                      </div>
                    </div>
                  </div> */}
                  </div>

                  {/* Invoice Item */}
                  <div className="invoice-item invoice-table-wrap">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive border">
                          <table className="invoice-table table table-center mb-0">
                            <thead>
                              <tr>
                                <th>SN.</th>
                                <th>Books</th>
                                <th>ISBN</th>
                                <th className="text-end">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {issueBookList?.map((book, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{book.books_name}</td>
                                  <td>{book.isbn_no}</td>
                                  <td className="text-end">
                                    ₹ {book.price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center justify-content-center">
                    <div className="col-12">
                      <div className="invoice-total-card">
                        <div className="invoice-total-box p-1">
                          <div className="invoice-terms px-1 pt-2 m-0">
                            <h6>Terms and Conditions:</h6>
                            <p className="mb-0">
                              If a book is lost, you will be responsible for
                              paying its replacement cost.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-1">
                      <div className="invoice-total-card">
                        <div className="invoice-total-box">
                          <div className="invoice-total-footer">
                            <h4>
                              GRAND TOTAL <span>₹ {totalBooksPrice}</span>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="invoice-sign text-center pt-0">
                    <span className="d-block mt-1">
                      Software By{" "}
                      <a
                        href="www.vedsar.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Vedsar India Pvt Ltd.
                      </a>{" "}
                      +91 9856893658
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>

  );
};

export default IssueBookReceipt;
