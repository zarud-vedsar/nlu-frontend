import { React, useState,useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  Table,
  Spinner,
  Col,
  Row,
  InputGroup,
} from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { InputText } from "primereact/inputtext";
import { IoSearch } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { NODE_API_URL} from "../../site-components/Helper/Constant";
import axios from "axios";
import { FILE_API_URL } from "../../site-components/Helper/Constant";
import BookImage from './assets/img/dummy.avif';
import { FaFilter } from "react-icons/fa";
import Select from "react-select";

function MyVerticallyCenteredModal(props) {
    console.log(props);
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props?.selectedInternship?.internship_title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="table-responsive d-flex flex-wrap"
            dangerouslySetInnerHTML={{
              __html: props?.selectedInternship?.description,
            }}
          ></div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide} className="mx-auto">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
const BookCatalogue = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [book, setBook] = useState([]);
  const [filters, setFilters] = useState({
    book_name: "",
    author: "",
    publisher: "",
    language: "",
  });
  const [show, setShow] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalShow, setModalShow] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type == "number" && value.length > 10) {
      return;
    }

    setFilters((filters) => ({
      ...filters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
        book_name: "",
        author: "",
        publisher: "",
        language: "",
    });
    fetchData({
        book_name: "",
        author: "",
        publisher: "",
        language: "",
    });
    handleClose();
  };

  const applyFilters = () => {
    fetchData(filters)
    handleClose();
  };
 



  
    const fetchData = async (filter={}) => {

      try {
        filter.student_id = 'dilsad';
        const response = await axios.post(
          `${NODE_API_URL}/api/student-library/fetchBookCatalogue`,
          filter
        );
        
        if (response.data.success) {
          setBook(response.data.data);
          console.log(response);
        }
      } catch (error) {
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
                        Book Catalogue
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light "
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Button
                variant="primary"
                className="ml-2 mb-2 mb-md-0"
                onClick={handleShow}
              >
                <i className="fas">
                  <FaFilter />
                </i>
              </Button>
                </div>
              </div>
            </div>
       

          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12 col-lg-12 col-12 col-sm-12 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                  <div className="search-icon">
                    <IoSearch />
                  </div>
                  <InputText
                    type="search"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search"
                    className="form-control dtsearch-input"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {book.map((book,index)=>(
                 <div className="col-md-6 col-lg-6 col-12 col-sm-12 mb-4" key={index}>
                 <div className="d-flex position-relative" style={{backgroundColor:"white",padding:"14px",gap:"40px",minHeight:"200px", borderRadius:"7px"}}>
                   <div className="id-book-img">
                   <img src={book.image ? `${FILE_API_URL}/books/${book.image}` : `${BookImage}`} className="card-img-top" alt="..." style={{height:"200px"}}/>
                   </div>
                   <div className="px-3">
                     <h5 className="card-title mb-1">{book.book_name}</h5>
                     <p className="card-text mb-1">{book.author}</p>
                     <Link to={`/student/book-catalogue-detail/${book.id}`} className="ml-auto btn-md btn border-0 btn-light "
                     style={{position:"absolute",
                       bottom:"14px",
                       right:"13px"
                     }}>
                       View Details
                       &nbsp; 
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

      <Modal show={show} onHide={handleClose} className="modal-right">
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="filteruserlist">
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="cateId">
                  <Form.Label>Book Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="book_name"
                    value={filters.book_name}
                    onChange={handleChange}
                    placeholder="Book Name"

                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="jobType">
                  <Form.Label>Author Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={filters.author}
                    onChange={handleChange}
                    placeholder="Author Name"

                  />
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Publisher</Form.Label>
                  <Form.Control
                    type="text"
                    name="publisher"
                    value={filters.publisher}
                    onChange={handleChange}
                    placeholder="Publisher"

                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    type="text"
                    name="language"
                    value={filters.language}
                    onChange={handleChange}
                    placeholder="Book Name"

                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="w-50" onClick={resetFilters}>
            Reset
          </Button>
          <Button variant="primary" className="w-50" onClick={applyFilters}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>
        {`
          .modal-right .modal-dialog {
            position: absolute;
            top: 0;
            right: 0;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
          }

          .modal-right.show .modal-dialog {
            transform: translateX(0);
          }
        `}
      </style>
      {/* modal to view description */}
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedInternship={selectedInternship}
      />
    </>
  );
};

export default BookCatalogue;
