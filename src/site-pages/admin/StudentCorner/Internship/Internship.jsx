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
import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";

import { FaFilter } from "react-icons/fa";

import { formatDate } from "../../../../site-components/Helper/HelperFunction";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import { DeleteSweetAlert } from "../../../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const decodeHtml = async (html) => {
  try {
    const response = await axios.post(
      `${PHP_API_URL}/page.php`,
      {
        data: "decodeData",
        html,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {}
};

function MyVerticallyCenteredModal(props) {
  const [description,setDescription] = useState();
  
  useEffect(()=>{
    const decode = async ()=>{
      await decodeHtml(props?.selectedInternship?.description).then((res)=>{
        setDescription(res);
      })
    };
    decode()
  },[props?.selectedInternship?.description])
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props?.selectedInternship?.position}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
       {description &&  <div
          className="table-responsive d-flex flex-wrap"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        ></div>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="mx-auto">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const Internship = () => {
  const navigate = useNavigate();

  const [internshipList, setInternshipList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [loading, setLoading] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  
  const [filters, setFilters] = useState({
    status: "",
    postDateStart: "",
    postDateEnd: "",
    postLastDateStart: "",
    postLastDateEnd: "",
  });
  const [show, setShow] = useState(false);
  const [filterStatus, setFilterStatus] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const viewAllImages = (index) => {
    const currentLob = internshipList[index];
    setSelectedInternship(currentLob);
  };
  useEffect(() => {
    if (selectedInternship != null) {
      setModalShow(true);
    }
  }, [selectedInternship]);

  useEffect(() => {
    loadInternshipsData();
  }, []);

  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin"
      ? getDeletedInternshipList()
      : loadInternshipsData();
  };

  const getDeletedInternshipList = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_internship");
      bformData.append("delete_status", 1);

      const response = await axios.post(
        `${PHP_API_URL}/internship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setInternshipList(response.data.data);
    } catch (error) {
      setInternshipList([]);
      console.error("Error fetching internships data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    loadInternshipsData(filters);
    handleClose();
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      postDateStart: "",
      postDateEnd: "",
      postLastDateStart: "",
      postLastDateEnd: "",
    });
    setFilterStatus(null);
    loadInternshipsData();
  };
  

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

  const loadInternshipsData = async (filter = {}) => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_internship");
      bformData.append("delete_status", 0);

      if (filter) {
        Object.keys(filter).forEach((key) => {
          const value = filter[key];
          if (value !== "") {
            bformData.append(key, value);
          }
        });
      }
     

      const response = await axios.post(
        `${PHP_API_URL}/internship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setInternshipList(response.data.data);
    } catch (error) {
      setInternshipList([]);
      console.error("Error fetching internships data:", error);
    } finally {
      setLoading(false);
    }
  };

  const editDetail = (id) => {
    navigate(`/admin/edit-internship/${id}`);
  };

  const deleteInternship = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_internship");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/internship.php`,
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
            ? loadInternshipsData()
            : getDeletedInternshipList();
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
  const updateStatus = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "toggle_status");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/internship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == "200") {
        const updatedInternships = internshipList?.map((internship) =>
          internship.id === id
            ? { ...internship, status: !internship.status }
            : internship
        );
        toast.success(response.data.msg);

        setInternshipList(updatedInternships);
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
            <nav className="breadcrumb breadcrumb-dash">
            <a href="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>

              <span className="breadcrumb-item active">Student Corner</span>

              <span className="breadcrumb-item active"> Internship</span>
            </nav>
          </div>
          <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new">Internship List</h5>
                <div className="ml-auto id-mobile-go-back">
                <Button
                variant="light"
                onClick={() => window.history.back()}
                className="mb-2 mb-md-0 mr-2"
              >
                <i className="fas">
                  <FaArrowLeft />
                </i>{" "}
                Go Back
              </Button>
              <Button
                variant="primary"
                className="ml-auto mb-2 mb-md-0"
                onClick={handleShow}
              >
                <i className="fas">
                  <FaFilter />
                </i>
              </Button>

              <Link
                className="ml-2 mb-2 mb-md-0 btn btn-secondary"
                to="/admin/add-internship"
              >
                <i className="fas">
                  <IoMdAdd />
                </i>{" "}
                Add New
              </Link>
                </div>
              </div>
            </div>
          
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-9 col-lg-9 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                <div className="col-md-3 col-lg-3 col-10 col-sm-4 mb-3">
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
                    value={internshipList}
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

                    <Column field="position" header="Position" sortable />
                    <Column field="vacancy" header="Vacancy" sortable />
                    <Column field="education_level" header="Education Level" sortable />
                    <Column field="gender" header="Gender" sortable />
                    <Column field="state" header="State" sortable />
                    <Column field="city" header="City" sortable />
                    <Column field="address" header="Address" sortable style={{ width: "30%" }} />
                    

                    <Column
                      field="post_date"
                      header="Post Date"
                      sortable
                      body={(rowData) => formatDate(rowData.post_date)}
                    />
                    <Column
                      field="post_last_date"
                      header="Last Date To Apply"
                      sortable
                      body={(rowData) => formatDate(rowData.post_last_date)}
                    />

                    <Column
                      header="Action"
                      body={(rowData, { rowIndex }) => (
                        <div className="d-flex justify-content-around">
                          <div className="switch mt-1 w-auto">
                            <input
                              type="checkbox"
                              checked={rowData.status == 1 ? true : false}
                              onChange={() => updateStatus(rowData.id)}
                              className="facultydepartment-checkbox"
                              id={`switch${rowData.id}`}
                            />
                            <label
                              className="mt-0"
                              htmlFor={`switch${rowData.id}`}
                            ></label>
                          </div>
                          <div
                            onClick={() => editDetail(rowData.id)}
                            className="avatar avatar-icon avatar-md avatar-orange"
                          >
                            <i className="fas fa-edit"></i>
                          </div>
                          <div className="d-flex">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">
                                  View Description
                                </Tooltip>
                              }
                            >
                              <div className="avatar avatar-icon avatar-md avatar-orange">
                                <i
                                  className="fa-solid fa-eye"
                                  onClick={() => viewAllImages(rowIndex)}
                                ></i>
                              </div>
                            </OverlayTrigger>
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
                                  onClick={() => deleteInternship(rowData.id)}
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
                                  onClick={() => deleteInternship(rowData.id)}
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

      <Modal show={show} onHide={handleClose} className="modal-right">
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="filteruserlist">
            <Row>
             
              

              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Status:</Form.Label>
                  <Select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e);
                      setFilters((prevState) => ({
                        ...prevState,
                        status: e.value,
                      }));
                    }}
                    options={[
                      { value: "1", label: "Active" },
                      { value: "0", label: "Inactive" },
                    ]}
                    placeholder="Select Status"
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="postDateStart">
                  <Form.Label>Post Date From:</Form.Label>
                  <Form.Control
                    type="date"
                    name="postDateStart"
                    value={filters.postDateStart}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="postDateEnd">
                  <Form.Label>To:</Form.Label>
                  <Form.Control
                    type="date"
                    name="postDateEnd"
                    value={filters.postDateEnd}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="postLastDateStart">
                  <Form.Label>Post Last Date From:</Form.Label>
                  <Form.Control
                    type="date"
                    name="postLastDateStart"
                    value={filters.postLastDateStart}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="postLastDateEnd">
                  <Form.Label>To:</Form.Label>
                  <Form.Control
                    type="date"
                    name="postLastDateEnd"
                    value={filters.postLastDateEnd}
                    onChange={handleChange}
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

export default Internship;
