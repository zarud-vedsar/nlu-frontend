import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { Link } from "react-router-dom";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

const formatDate = (date) => {
  console.log(date);
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};


const Contact = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  const [filters, setFilters] = useState({
      email: "",
      from_date: "",
      to_date: "",
    });

    const handleChange = (e) => {
      const { name, value, type } = e.target;
  
      setFilters((filters) => ({
        ...filters,
        [name]: value,
      }));
    };
    const applyFilters = () => {
      console.log(filters)
      load_vendor(filters);
      handleClose();
    };
  
    const resetFilters = () => {
      setFilters({
        email: "",
        from_date: "",
        to_date: "",
      });
      load_vendor();
    };

  useEffect(() => {
    load_vendor();
  }, []);

  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin" ? getDeletedUserList() : load_vendor();
  };
  const getDeletedUserList = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_contact");
      bformData.append("delete_status", 1);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/front.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setMessages(response.data.data);
    } catch (error) {
      setMessages([]);
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const load_vendor = async (filter = {}) => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_contact");

      if (filter) {
        Object.keys(filter).forEach((key) => {
          const value = filter[key];
          if (value !== "") {
            bformData.append(key, value);
          }
        });
      }
     
      const response = await axios.post(
        `${PHP_API_URL}/front.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if(response?.data?.status===200){
      setMessages(response.data.data);
      }
    } catch (error) {
      setMessages([])
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const editDetail = (id) => {
    navigate(`/admin/contact/${id}`);
  };

  const deleteMessage = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_contact");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert(" ");
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/front.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == "200") {
          toast.success(response.data.msg);
          recycleTitle === "Show Recycle Bin"
            ? load_vendor()
            : getDeletedUserList();
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
    }
  };
 

  return (
    <>
      <div className="page-container">
        <div className="main-content">
        <div className="container-fluid">
          <div className="">
            <nav className="breadcrumb">
              <a href="/" className="breadcrumb-item">
                Inquery
              </a>

              <span className="breadcrumb-item active">Contact</span>
            </nav>
          </div>
          <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Contact List</h5>
                <div className="ml-auto">
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
                <div className="col-md-8 col-lg-8 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                  <div className="search-icon">
                    <i className="pi pi-search" />
                  </div>
                  <InputText
                    type="search"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search"
                    className="form-control dtsearch-input"
                  />
                </div>
                <div className="col-md-4 col-lg-4 col-8 col-sm-2">
                  <button
                    className={`btn ${
                      recycleTitle === "Show Recycle Bin"
                        ? "btn-secondary"
                        : "btn-danger"
                    }`}
                    onClick={showRecyleBin}
                  >
                    {recycleTitle} <i className="fa fa-recycle"></i>
                  </button>
                </div>

                
              </div>

              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <DataTable
                    value={messages}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    globalFilter={globalFilter}
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column
                      body={(rowData, { rowIndex }) => rowIndex + 1}
                      header="#"
                      sortable
                    />

              
                    <Column field="name" header="Name" sortable />

                    <Column field="email" header="Email" sortable />
                    <Column field="number" header="Phone Number" sortable />
                    <Column field="subject" header="Subject" sortable />
                    <Column
                      field="created_at"
                      header="Created At"
                      sortable
                      body={(rowData) => formatDate(rowData.date)}
                    />
                    <Column
                      style={{ width: "10%" }}
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex justify-content-around">
                     
                          <div
                            onClick={() => editDetail(rowData.id)}
                            className="avatar avatar-icon avatar-md avatar-orange"
                          >
                            <i className="fas fa-eye"></i>
                          </div>
                          {rowData.delete_status == 0 ? (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">Delete</Tooltip>
                              }
                            >
                              <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                                <i
                                  className="fas fa-trash-alt"
                                  onClick={() => deleteMessage(rowData.id)}
                                ></i>
                              </div>
                            </OverlayTrigger>
                          ) : (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">Restore</Tooltip>
                              }
                            >
                              <div className="avatar ml-2 avatar-icon avatar-md avatar-lime">
                                <i
                                  className="fas fa-recycle"
                                  onClick={() => deleteMessage(rowData.id)}
                                ></i>
                              </div>
                            </OverlayTrigger>
                          )}
                        </div>
                      )}
                      sortable
                    />
                  </DataTable>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

       
      </div>

      {/* Filter Modal */}
      <Modal
          show={show}
          onHide={handleClose}
          className="modal-right" // Apply the custom CSS class for right-side opening
        >
          <Modal.Header closeButton>
            <Modal.Title>Filter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="filteruserlist">
              <Row>
                

                <Col md={12} className="mb-3">
                  <Form.Group controlId="email">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={filters.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                

                {/* Date range selection */}
                <Col md={6} className="mb-3">
                  <Form.Group controlId="from_date">
                    <Form.Label>By Date:</Form.Label>
                    <Form.Control
                      type="date"
                      name="from_date"
                      value={filters.from_date}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group controlId="to_date">
                    <Form.Label>To:</Form.Label>
                    <Form.Control
                      type="date"
                      name="to_date"
                      value={filters.to_date}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary w-50" onClick={resetFilters}>
              Reset
            </Button>
            <Button variant="primary w-50" onClick={applyFilters}>
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
    </>
  );
};

export default Contact;
