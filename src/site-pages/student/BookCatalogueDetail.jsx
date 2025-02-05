import {React,useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PHP_API_URL } from '../../site-components/Helper/Constant';
import { FILE_API_URL } from '../../site-components/Helper/Constant';
import { useParams } from 'react-router-dom';
import BookImage from './assets/img/dummy.avif'



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
            console.log(response.data.data[0]);
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
        <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="" className="breadcrumb-item">
                     Library
                  </a>
                  <span className="breadcrumb-item">Book Catalogue</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                        Book Catalogue Details
                </h5>
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
                <div className="col-md-5 col-lg-5 col-12 col-sm-12 p-input-icon-left mb-3 ">
                <img src={book.image ? `${FILE_API_URL}/books/${book.image}` : `${BookImage}`} alt=".." style={{height:"300px", width:"auto"}}
                 />
                </div>
                <div className="col-md-7 col-lg-7 col-12 col-sm-12 p-input-icon-left mb-3 ">
                    <div className='details'>
                    <h5 className="card-title mb-1"> <strong style={{width:"110px",display:"inline-block"}}>Book Name: </strong> {book.book_name}</h5>
                    <p className="card-text mb-1"><strong style={{width:"110px",display:"inline-block"}}>Author Name: </strong>  {book.author}</p>
                    <p> <strong style={{width:"110px", display:"inline-block"}}>publisher: </strong> {book.publisher}</p>
                    <p><strong style={{width:"110px", display:"inline-block"}}>Language: </strong>  {book.language}</p>
                    <p><strong style={{width:"110px", display:"inline-block"}}>Edition: </strong>  {book.edition}</p>
                    </div>
                
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12 col-lg-12 col-12 col-sm-12 p-input-icon-left mb-3 ">
                <p>{book.des}</p>
                </div>
             
              </div>
            </div>
          </div>
         
        </div>
        </div>
       
      </div>
    </>
  )
}

export default BookCatalogueDetail