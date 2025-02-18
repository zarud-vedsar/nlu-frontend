import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { FILE_API_URL } from "../../site-components/Helper/Constant";
import { useParams } from "react-router-dom";
import BookImage from "./assets/img/dummy.avif";

const BookCatalogueDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState([]);

  const getBookById = async (bookId) => {
    try {
      const formData = new FormData();
      formData.append("data", "getBookById");
      formData.append("id", bookId);
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
        setBook(response?.data?.data[0]);
      }
    } catch (error) {
      setBook([]);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      await getBookById(id);
    };
    loadData();
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
                <a href="/student/book-catalogue" className="breadcrumb-item">
                  Book Catalogue
                </a>

                <span className="breadcrumb-item active">Book Detail</span>
              </nav>
            </div>

            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Book Catalogue Details</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 skybluesbackground "
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body hovershadows">
                <div className="row ">
                  <div className="col-md-5 col-lg-5 col-12 col-sm-12 p-input-icon-left mb-3 ">
                    <div className="id-book-img">
                       <img
                      src={
                        book.image
                          ? `${FILE_API_URL}/books/${book.image}`
                          : `${BookImage}`
                      }
                      alt=".."
                      style={{ height: "300px", width: "100%" }}
                    />
                    </div>
                   
                  </div>
                  <div className="col-md-4 col-lg-4 col-12 col-sm-12 p-input-icon-left mb-3 ">
                    <div className="details">
                      <h5 className="card-title ">
                        {" "}
                        <strong
                         
                        >
                        Book Name:{" "}
                        </strong>{" "}
                        {book.book_name}
                      </h5>
                      {book?.author && (
                        <p >
                          {" "}
                          <strong
                            style={{
                              width: "110px",
                              display: "inline-block",
                              margin: "0px",
                            }}
                          >
                           <span className="booktexts">Author Name:{" "}</span> 
                          </strong>{" "}
                          {book.author}
                        </p>
                      )}
                      {book?.publisher && (
                        <p>
                          {" "}
                          <strong
                            style={{
                              width: "110px",
                              display: "inline-block",
                              margin: "0px",
                            }}
                          >
                            <span className="booktexts">Publisher:{" "}</span>
                          </strong>{" "}
                          {book.publisher}
                        </p>
                      )}
                      {book?.language && (
                        <p>
                          <strong
                            style={{
                              width: "110px",
                              display: "inline-block",
                              margin: "0px",
                            }}
                          >
                          <span className="booktexts">Language:{" "}</span>  
                          </strong>{" "}
                          {book.language}
                        </p>
                      )}
                      {book?.edition && (
                        <p>
                          <strong
                            style={{
                              width: "110px",
                              display: "inline-block",
                              margin: "0px",
                            }}
                          >
                         <span className="booktexts">Edition:{" "}</span>   
                          </strong>{" "}
                          {book.edition}
                        </p>
                      )}
                      
                    </div>
                  </div>
                  <div className="col-md-3 col-lg-3 col-12 col-sm-12 p-input-icon-left mb-3 ">
                    <div className="details">
                      <h5 className="card-title ">
                        {" "}
                        <strong
                          style={{  display: "inline-block" }}
                        >
                          Book Cell Location{" "}
                        </strong>{" "}
                        
                      </h5>
                     
                      {book?.block && (
                        <p>
                          <strong
                            style={{
                              width: "110px",
                              display: "inline-block",
                              margin: "0px",
                            }}
                          >
                          <span className="booktexts">Block:{" "}</span>  
                          </strong>{" "}
                          {book.block}
                        </p>
                      )}
                      {book?.section && (
                        <p>
                          <strong
                            style={{
                              width: "110px",
                              display: "inline-block",
                              margin: "0px",
                            }}
                          >
                         <span className="booktexts"> Section:{" "}</span>  
                          </strong>{" "}
                          {book.section}
                        </p>
                      )}
                      {book?.row && (
                        <p>
                          <strong
                            style={{
                              width: "110px",
                              display: "inline-block",
                              margin: "0px",
                            }}
                          >
                          <span className="booktexts">Row:{" "}</span>  
                          </strong>{" "}
                          {book.row}
                        </p>
                      )}
                    </div>
                  </div>
                   {book.des && (
              <div className="mt-2">
                <div className="">
                  <div className="">
                    <div className="col-md-12 col-lg-12 col-12 col-sm-12 p-input-icon-left mb-3 ">
                      <p>{book.des}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
                </div>
              </div>
            </div>
           
          </div>
        </div>
        <style jsx>
        {`
            /* books page css  before https://prnt.sc/hAro1S1EbQkN */
//  .card-title {
//     font-weight: 600;
//     font-size: 20px;
//     color: #2a2a2a;
//     margin-top: 0px;
//     margin-bottom: 15px;
// }
    .booktexts{
    color:#2e3e50;
     font-weight: 500;
     font-size:14px;
    }
  
      .hovershadows {
  transition: box-shadow 0.3s ease-in-out;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.01); /* Normal shadow */
}

.hovershadows:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); /* Stronger shadow on hover */
}
   .id-book-img img {
  transition: transform 0.3s ease-in-out;
}

.hovershadows:hover .id-book-img img {
  transform: scale(1.05); /* Slight zoom out effect */
}
     
        .skybluesbackground{
      background: #30a4dc !important;
      margin-bottom:10px;
          font-size: 14px !important;
          color:white;
        }
      .skybluesbackground:hover{
       color:white;
        }
          `}
        </style>
      </div>
    </>
  );
};

export default BookCatalogueDetail;
