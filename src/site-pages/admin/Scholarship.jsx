import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Spinner,
 
} from "react-bootstrap";

import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";

import { Link } from "react-router-dom";
import {
  FILE_API_URL,
  NODE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { formatDate } from "../../site-components/Helper/HelperFunction";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props?.selectedscholarship?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <iframe
            src={`${FILE_API_URL}/scholarship/${props?.selectedscholarship?.upload_file}`}
            style={{ width: "100%", height: "80vh" }}
          ></iframe>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="mx-auto">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const Scholarship = () => {
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [loading, setLoading] = useState(false);

  const [modalShow, setModalShow] = useState(false);

  const [selectedscholarship, setSelectedScholarship] = useState(null);

  useEffect(() => {
    loadScholarships();
  }, []);

  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin"
      ? getDeletedScholarshipList()
      : loadScholarships();
  };
  const getDeletedScholarshipList = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_scholarship");
      bformData.append("delete_status", 1);

      const response = await axios.post(
        `${PHP_API_URL}/scholarship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setScholarships(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadScholarships = async (filter = {}) => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_scholarship");

      const response = await axios.post(
        `${PHP_API_URL}/scholarship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setScholarships(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const editDetail = (id) => {
    navigate(`/admin/edit-scholarship/${id}`);
  };

  const deleteScholarship = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_scholarship");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/scholarship.php`,
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
            ? loadScholarships()
            : getDeletedScholarshipList();
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
        `${PHP_API_URL}/scholarship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == "200") {
        const updatedFaculty = scholarships?.map((faculty) =>
          faculty.id === id ? { ...faculty, status: !faculty.status } : faculty
        );
        toast.success(response.data.msg);

        setScholarships(updatedFaculty);
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

  useEffect(() => {
    if (selectedscholarship != null) {
      setModalShow(true);
    }
  }, [selectedscholarship]);

  const viewFile = (index) => {
    const currentScholarship = scholarships[index];
    setSelectedScholarship(currentScholarship);
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
        <div className="container-fluid">
          <div className=" mt-0">
            <nav className="breadcrumb">
            <a href="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>

              <span className="breadcrumb-item active">Student Corner</span>
              <span className="breadcrumb-item active">Scholarship</span>
            </nav>
          </div>
          <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new"> Scholarships List</h5>
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

              <Link
                className="ml-2 mb-2 mb-md-0 btn btn-secondary"
                to="/admin/add-scholarship"
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
                    value={scholarships}
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

                    <Column field="title" header="Title" sortable />

                    <Column field="eligibility" header="Eligibility" sortable />
                    <Column
                      field="application_link"
                      header="Apply link"
                      sortable
                    />
                    <Column
                      field="deadline_date"
                      header="Deadline"
                      sortable
                      body={(rowData) => formatDate(rowData.deadline_date)}
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
                          <div className="d-flex">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">
                                  View File
                                </Tooltip>
                              }
                            >
                              <div className="avatar avatar-icon avatar-md avatar-orange">
                                <i
                                  className="fa-solid fa-eye"
                                  onClick={() => viewFile(rowIndex)}
                                ></i>
                              </div>
                            </OverlayTrigger>
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
                                  onClick={() => deleteScholarship(rowData.id)}
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
                                  onClick={() => deleteScholarship(rowData.id)}
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
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedscholarship={selectedscholarship}
      />
    </>
  );
};

export default Scholarship;
