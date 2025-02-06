import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import {
  PHP_API_URL,
  FILE_API_URL,
} from "../../../site-components/Helper/Constant";
import "../assets/custom.css";
import "../assets/CustomNavTab.css";
import { capitalizeAllLetters } from "../../../site-components/Helper/HelperFunction";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import BookImage from "../assets/img/dummy.avif";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
function BookPdfViewer() {
  const sid = secureLocalStorage.getItem("studentId"); // Retrieve student ID from secure local storage.
  const location = useLocation();
  const { dbId } = location.state;
  const [apiHit, setApiHit] = useState(false);

  const [numPages, setNumPages] = useState(null); // numPages is initially null
  const [pageNumber, setPageNumber] = useState(1);
  // Function to handle document load success
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  // Function to go to the next page
  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Function to go to the previous page
  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };
  const [pdfs, setPdfs] = useState([]);

  const FetchPdfById = async () => {
    setApiHit(true);
    try {
      const formData = new FormData();
      formData.append("data", "getBookById");
      formData.append("id", dbId);
      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response?.data?.data && response?.data?.data?.length > 0) {
        setPdfs(response.data.data);
      } else {
        setPdfs([]);
      }
      setApiHit(false);
    } catch (error) {
      setApiHit(false);
      setPdfs([]);
    }
  };

  useEffect(() => {
    FetchPdfById(dbId);
  }, [dbId]);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb">
                  <a href="/student" className="breadcrumb-item">
                    Home
                  </a>
                  <a href="/student" className="breadcrumb-item">
                    Library
                  </a>
                  <span className="breadcrumb-item active">Book</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Book</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light "
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="row">
                    <div className="col ">
                      <img
                        src={
                          pdfs[0]?.image
                            ? `${FILE_API_URL}/books/${pdfs[0]?.image}`
                            : `${BookImage}`
                        }
                        alt=".."
                        style={{ height: "200px", width: "auto" }}
                      />
                    </div>
                    <div className="col ">
                      <div className="details">
                        <h5 className="card-title mb-2">
                          {" "}
                          <strong>Book Name: </strong>{" "}
                          {capitalizeAllLetters(pdfs[0]?.book_name)}
                        </h5>
                        <p>
                          <strong>Author Name: </strong> {pdfs[0]?.author}
                        </p>
                        <p>
                          {" "}
                          <strong>Publisher: </strong> {pdfs[0]?.publisher}
                        </p>
                        <p>
                          <strong>Language: </strong> {pdfs[0]?.language}
                        </p>
                        <p>
                          <strong>Edition: </strong> {pdfs[0]?.edition}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {apiHit ? (
                <div className="col-md-12 text-center">
                  <div className="loader-fetch mx-auto"></div>
                </div>
              ) : (
                ""
              )}
              <div className="col-md-12 text-center">
                <h2 className="font-16 h6_new">
                  {capitalizeAllLetters(pdfs?.[0]?.book_name) ||
                    "No Book available"}
                </h2>
                {pdfs.length > 0 ? (
                  <>
                    <Document
                      file={
                        pdfs[0]?.pdf_file
                          ? `${FILE_API_URL}/lib_books/${pdfs[0]?.pdf_file}`
                          : ""
                      }
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={(error) =>
                        console.error("Error loading PDF:", error)
                      }
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                    <div className="mt-3">
                      <button
                        onClick={goToPrevPage}
                        className="btn btn-primary"
                        disabled={pageNumber === 1 || numPages === null}
                      >
                        <i className="fas fa-arrow-left"></i> Previous
                      </button>
                      <button
                        onClick={goToNextPage}
                        className="btn btn-primary ml-3"
                        disabled={pageNumber === numPages || numPages === null}
                      >
                        Next <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>

                    <p className="fw-bold font-14 mt-2">
                      Page {pageNumber} of {numPages || "Loading..."}
                    </p>
                  </>
                ) : (
                  <p>No PDF available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default BookPdfViewer;
