import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Spinner
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
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.selectedtestimonial?.test_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive d-flex flex-wrap">
          {props.selectedtestimonial?.test_content}
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

const StudentTestimonial = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [selectedtestimonial, setselectedtestimonial] = useState(null);

  const viewAllImages = (index) => {
    const currentSetTestimonial = messages[index];
    setselectedtestimonial(currentSetTestimonial);
    setModalShow(true);
  };

  useEffect(() => {
    load_message();
  }, []);

  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin" ? getDeletedUserList() : load_message();
  };
  const getDeletedUserList = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_testimonial");
      bformData.append("delete_status", 1);

      const response = await axios.post(
        `${PHP_API_URL}/std_testimonial.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const load_message = async (filter = {}) => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_testimonial");

      if (filter) {
        Object.keys(filter).forEach((key) => {
          const value = filter[key];
          if (value !== "") {
            bformData.append(key, value);
          }
        });
      }
      const response = await axios.post(
        `${PHP_API_URL}/std_testimonial.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const editDetail = (id) => {
    navigate(`/admin/edit-student-testimonial-detail/${id}`);
  };

  const deleteMessage = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_testimonial");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/std_testimonial.php`,
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
            ? load_message()
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
        `${PHP_API_URL}/std_testimonial.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == "200") {
        const updatedFaculty = messages?.map((faculty) =>
          faculty.id === id ? { ...faculty, status: !faculty.status } : faculty
        );
        toast.success(response.data.msg);

        setMessages(updatedFaculty);
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
              <a href="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>

              <span className="breadcrumb-item active">Student Corner</span>

                <span className="breadcrumb-item active">
                  Student Testimonial
                </span>
              </nav>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new">Student Testimonial List</h5>
                <div className="ml-auto id-mobile-go-back">
                  <Button
                    variant="light"
                    onClick={() => window.history.back()}
                    className="mr-2 mb-md-0 goback btn"
                  >
                    <i className="fas">
                      <FaArrowLeft />
                    </i>{" "}
                    Go Back
                  </Button>

                  <Link
                    to="/admin/add-student-testimonial"
                    className="btn btn-secondary"
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

                      <Column field="test_name" header="Name" sortable />
                      <Column
                        header="Photo"
                        body={(rowData) => (
                          <div
                            className="info-column d-flex align-items-center
"
                          >
                            <div className="info-image mr-4 px-2 py-3 ">
                              <img
                                src={`${FILE_API_URL}/testimonial/${rowData.test_photo}`}
                                alt=""
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  backgroundColor: "#e6fff3",
                                  fontSize: "20px",
                                  color: "#00a158",
                                }}
                                className=" d-flex justify-content-center align-items-center"
                              />
                            </div>
                          </div>
                        )}
                        sortable
                      />
                      <Column field="email" header="Email" sortable />
                      <Column field="phone" header="Phone" sortable />
                      <Column field="test_company" header="Company" sortable />
                      <Column
                        field="test_occupation"
                        header="Occupation"
                        sortable
                      />

                      <Column
                        style={{ width: "10%" }}
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
                            <div className="">
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="button-tooltip-2">
                                    View Content
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
                                  <Tooltip id="button-tooltip-2">
                                    Delete
                                  </Tooltip>
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
                                  <Tooltip id="button-tooltip-2">
                                    Restore
                                  </Tooltip>
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

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          selectedtestimonial={selectedtestimonial}
        />
      </div>
    </>
  );
};

export default StudentTestimonial;
