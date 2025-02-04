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
  FILE_API_URL,
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

const FacultyList = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectGender] = useState();

  const [facultyList, setFacultyList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [filters, setFilters] = useState({
    page_no: "",
    duid: "",
    duname: "",
    duemail: "",
    dphone: "",
    ddistrict: "",
    dstate: "",
    dgender: "",
    dfromdate: "",
    dtodate: "",
    c_type: "",
  });

  const [districtOptions, setDistrictOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    loadFacultyData();
    // getDistinctDistrict();
    // getDistinctState();
  }, []);

  const getDistinctState = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getDistinctState");
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setStateOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDistinctDistrict = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getDistinctDistrict");
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setDistrictOptions(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };
  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin"
      ? getDeletedUserList()
      : loadFacultyData();
  };
  const getDeletedUserList = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "trashed_userPage");

      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFacultyList(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFacultyData = async (filter = {}) => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_userPage");

      if (filter) {
        Object.keys(filter).forEach((key) => {
          const value = filter[key];
          if (value !== "") {
            bformData.append(key, value);
          }
        });
      }
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
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
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    loadFacultyData(filters);
    handleClose();
  };

  const resetFilters = () => {
    setFilters({
      page_no: "",
      duid: "",
      duname: "",
      duemail: "",
      dphone: "",
      ddistrict: "",
      dstate: "",
      dgender: "",
      dfromdate: "",
      dtodate: "",
      c_type: "",
    });
    loadFacultyData();
  };

  const handleChangeDistrict = (e) => {
    console.log(e);
    setFilters((filters) => ({
      ...filters,
      ddistrict: e.value,
    }));
  };

  const handleChangeState = (e) => {
    console.log(e);
    setFilters((filters) => ({
      ...filters,
      dstate: e.value,
    }));
  };

  const handleChangeKeyValue = (e) => {
    setSelectGender(e);
    setFilters((prevState) => ({
      ...prevState,
      dgender: e.value,
    }));
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

  const editDetail = (id) => {
    navigate(`/admin/editDetail/${id}`);
  };

  const deleteFaculty = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_faculty");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/faculty.php`,
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
            ? loadFacultyData()
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
  const updateStatus = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "toggle_status");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == "200") {
        const updatedFaculty = facultyList?.map((faculty) =>
          faculty.id === id ? { ...faculty, status: !faculty.status } : faculty
        );
        toast.success(response.data.msg);

        setFacultyList(updatedFaculty);
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
                Department
              </a>

              <span className="breadcrumb-item active">Faculty</span>
            </nav>
          </div>
          <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Faculty List</h5>
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
              <Link
                className="ml-2 mb-2 mb-md-0 btn btn-secondary"
                to="/admin/faculty-form"
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
                <div className="col-md-4 col-lg-4 col-10 col-sm-4">
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

                    <Column field="uid" header="Faculty ID" sortable />
                    <Column
                      header="Info"
                      body={(rowData) => (
                        <div
                          className="info-column d-flex align-items-center
"
                        >
                          <div className="info-image mr-4">
                            {rowData.avtar ? (
                              <img
                                src={`${FILE_API_URL}/user/${rowData.uid}/${rowData.avtar}`}
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
                                {rowData?.first_name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="info-name">
                              <span>{`${rowData.first_name} ${rowData.middle_name} ${rowData.last_name}`}</span>
                            </div>

                            <div className="info-email">
                              <span>{rowData.u_email}</span>
                            </div>
                            <div className="info-phone">
                              <span>{rowData.u_phone}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      sortable
                    />
                    <Column field="p_district" header="District" sortable />
                    <Column field="p_state" header="State" sortable />
                    <Column field="gender" header="Gender" sortable />

                    <Column
                      field="reg_date"
                      body={(row) => formatDate(row.reg_date)}
                      header="Reg Data"
                      sortable
                    />


                    <Column
                      header="Action"
                      body={(rowData) => (
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
                                  onClick={() => deleteFaculty(rowData.id)}
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
                                  onClick={() => deleteFaculty(rowData.id)}
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
                  <Form.Group controlId="duid">
                    <Form.Label>Faculty User ID:</Form.Label>
                    <Form.Control
                      type="text"
                      name="duid"
                      value={filters.duid}
                      placeholder="Faculty User ID"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group controlId="duname">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="duname"
                      placeholder="Name"
                      value={filters.duname}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group controlId="duemail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      type="email"
                      name="duemail"
                      placeholder="Email"
                      value={filters.duemail}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group controlId="dphone">
                    <Form.Label>Phone No:</Form.Label>
                    <Form.Control
                      type="number"
                      name="dphone"
                      placeholder="Phone No"
                      value={filters.dphone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                {/* Gender selection */}
                <Col md={12} className="mb-3">
                  <Form.Group controlId="dgender">
                    <Form.Label>Gender:</Form.Label>
                    <Select
                      value={selectedGender}
                      onChange={handleChangeKeyValue}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ]}
                      placeholder="Select Gender"
                    />
                  </Form.Group>
                </Col>

                {/* Date range selection */}
                <Col md={6} className="mb-3">
                  <Form.Group controlId="dfromdate">
                    <Form.Label>By Registration Date:</Form.Label>
                    <Form.Control
                      type="date"
                      name="dfromdate"
                      value={filters.dfromdate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group controlId="dtodate">
                    <Form.Label>To:</Form.Label>
                    <Form.Control
                      type="date"
                      name="dtodate"
                      value={filters.dtodate}
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
      </div>
    </>
  );
};

export default FacultyList;
