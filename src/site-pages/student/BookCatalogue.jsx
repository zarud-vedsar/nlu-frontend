import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { IoSearch } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import axios from "axios";
import {
  FILE_API_URL,
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
import BookImage from "./assets/img/dummy.avif";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";


const BookCatalogue = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [book, setBook] = useState([]);

  const fetchData = async () => {
    try {
      let filter = { student_id: secureLocalStorage.getItem("studentId") };
      if (globalFilter) {
        filter.data = globalFilter;
      }
      const response = await axios.post(
        `${NODE_API_URL}/api/student-library/fetchBookCatalogue`,
        filter
      );

      if (response.data.statusCode === 200) {
        toast.success(response?.data?.message);
        setBook(response.data.data);
      }
    } catch (error) {
      setBook([]);
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className=" mb-3 mt-0">
              <nav className="breadcrumb">
                <a href="/" className="breadcrumb-item">
                  Library
                </a>

                <span className="breadcrumb-item active">Book Catalogue</span>
              </nav>
            </div>

            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Book Catalogue</h5>
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
                  <div className="col-md-12 col-lg-12 col-12 col-sm-12 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                    <InputText
                      type="search"
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      placeholder="Search"
                      className="form-control dtsearch-input"
                    />
                    <button className="btn btn-secondary" onClick={fetchData}>
                      <IoSearch  />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {book.map((book, index) => (
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
                        src={
                          book.image
                            ? `${FILE_API_URL}/books/${book.image}`
                            : `${BookImage}`
                        }
                        className="card-img-top"
                        alt="..."
                        style={{ height: "200px" }}
                      />
                    </div>
                    <div className="px-3">
                      <h5 className="card-title mb-1">{book?.book_name}</h5>
                     {book?.author && <p className="card-text mb-1">Author : {book?.author}</p> }
                     {book?.edition && <p className="card-text mb-1">Edition : {book?.edition}</p>}
                     {book?.language && <p className="card-text mb-1">Language : {book?.language}</p>}
                     {book?.publisher && <p className="card-text mb-1">Publisher : {book?.publisher}</p>}
                      <Link
                        to={`/student/book-catalogue-detail/${book.id}`}
                        className="ml-auto btn-md btn border-0 btn-light "
                        style={{
                          position: "absolute",
                          bottom: "14px",
                          right: "13px",
                        }}
                      >
                        View Details &nbsp;
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookCatalogue;
