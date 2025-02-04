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
import { formatDate } from "../../site-components/Helper/HelperFunction";

import { Link } from "react-router-dom";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext";
import "../../../node_modules/primeicons/primeicons.css";

import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const JobApplication = () => {
  const navigate = useNavigate();
  const [selectedJobCategory, setSelectedJobCategory] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedApplicationStatus, setSelectedApplicationStatus] = useState();

  const [facultyList, setFacultyList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [filters, setFilters] = useState({
    email: "",
    job_cat: "",
    application_status: 0,
    status: 0,
    from: "",
    to: "",
  });

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    loadFacultyData();
    loadCategory();
  }, []);

  const loadFacultyData = async (filter = {}) => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_job_application");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      if (filter) {
        Object.keys(filter).forEach((key) => {
          const value = filter[key];
          if (value !== "") {
            bformData.append(key, value);
          }
        });
      }
      const response = await axios.post(
        `${PHP_API_URL}/jobApplication.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setFacultyList(response.data.data);
    } catch (error) {
      setFacultyList([]);
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log(filters);
    loadFacultyData(filters);
    handleClose();
  };

  const resetFilters = () => {
    setFilters({
      email: "",
      job_cat: "",
      application_status: 0,
      status: 0,
      from: "",
      to: "",
    });
    loadFacultyData();
  };

  const loadCategory = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_jobCategory");

      const response = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const tempCat = response.data.data.map((dep) => ({
        value: dep.id,
        label: dep.cat_title,
      }));
      console.log(tempCat);
      setCategory(tempCat);
    } catch (error) {
      setCategory([]);
      console.error("Error fetching  data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeKeyValue = (option, e) => {
    if (option == "status") {
      setSelectedStatus(e);
    } else if (option == "application_status") {
      setSelectedApplicationStatus(e);
    } else if (option == "job_cat") {
      setSelectedJobCategory(e);
    }
    setFilters((prevState) => ({
      ...prevState,
      [option]: e.value,
    }));
  };
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFilters((filters) => ({
      ...filters,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="">
              <nav className="breadcrumb breadcrumb-dash">
                <a href="/" className="breadcrumb-item">
                  Recruitment
                </a>

                <span className="breadcrumb-item active">Job Applications</span>
              </nav>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Application List</h5>
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
                </div>

                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <DataTable
                      value={facultyList}
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

                      <Column
                        header="Info"
                        body={(rowData) => (
                          <div
                            className="info-column d-flex align-items-center
"
                          >
                            <div className="info-image mr-4">
                              {rowData?.photo ? (
                                <img
                                  src={`${FILE_API_URL}/resume/${rowData?.photo}`}
                                  alt=""
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className="rounded-circle d-flex justify-content-center align-items-center"
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className="rounded-circle d-flex justify-content-center align-items-center"
                                >
                                  {rowData?.name[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="info-name">
                                <span>{`${rowData?.title} ${rowData?.name}`}</span>
                              </div>

                              <div className="info-email">
                                <span>{rowData?.email}</span>
                              </div>
                              <div className="info-phone">
                                <span>{rowData?.phone}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        sortable
                      />
                      <Column field="position" header="Position" sortable />
                      <Column field="job_type" header="Job Type" sortable />
                      <Column field="cat_title" header="Category" sortable />

                      <Column
                        field="created_at"
                        body={(row) => formatDate(row.created_at)}
                        header="Apply Date"
                        sortable
                      />
                      <Column
                        field="post_date"
                        body={(row) => formatDate(row.post_date)}
                        header="Post Date"
                        sortable
                      />
                      <Column
                        field="post_last_date"
                        body={(row) => formatDate(row.post_last_date)}
                        header="Last Date To Apply"
                        sortable
                      />
                      <Column
                        field="application_status"
                        body={(row) => (
                          <>
                            <div className="d-flex justify-content-around">
                              {row?.application_status === 0 && (
                                <div className="badge badge-warning">
                                  Pending
                                </div>
                              )}
                              {row?.application_status === 1 && (
                                <div className="badge badge-success">
                                  Accepted
                                </div>
                              )}
                              {row?.application_status === 2 && (
                                <div className="badge badge-danger">
                                  Rejected
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        header="Last Date To Apply"
                        sortable
                      />

                      <Column
                        header="Action"
                        body={(rowData) => (
                          <div className="d-flex justify-content-around">
                            <div
                              onClick={() =>
                                navigate(
                                  `/admin/job-application/${rowData?.id}`
                                )
                              }
                              className="avatar avatar-icon avatar-md avatar-orange"
                            >
                              <i className="fas fa-eye"></i>
                            </div>
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

                {/* Gender selection */}
                <Col md={12} className="mb-3">
                  <Form.Group controlId="job_cat">
                    <Form.Label>Category</Form.Label>
                    <Select
                      value={selectedJobCategory}
                      onChange={(e) => handleChangeKeyValue("job_cat", e)}
                      options={category}
                      placeholder="Select Category"
                    />
                  </Form.Group>
                </Col>

                {/* Date range selection */}
                <Col md={6} className="mb-3">
                  <Form.Group controlId="dfromdate">
                    <Form.Label>By Date:</Form.Label>
                    <Form.Control
                      type="date"
                      name="from"
                      value={filters.from}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group controlId="dtodate">
                    <Form.Label>To:</Form.Label>
                    <Form.Control
                      type="date"
                      name="to"
                      value={filters.to}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="dgender">
                    <Form.Label>Status</Form.Label>
                    <Select
                      value={selectedStatus}
                      onChange={(e) => handleChangeKeyValue("status", e)}
                      options={[
                        { value: "0", label: "New" },
                        { value: "1", label: "Viewed" },
                      ]}
                      placeholder="Select Status"
                    />
                  </Form.Group>
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="dgender">
                    <Form.Label>Applicatioin Status</Form.Label>
                    <Select
                      value={selectedApplicationStatus}
                      onChange={(e) =>
                        handleChangeKeyValue("application_status", e)
                      }
                      options={[
                        { value: "0", label: "Pending" },
                        { value: "1", label: "Shortlisted" },
                        { value: "2", label: "Rejected" },
                      ]}
                      placeholder="Select Application Status"
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
      </div>
    </>
  );
};

export default JobApplication;
