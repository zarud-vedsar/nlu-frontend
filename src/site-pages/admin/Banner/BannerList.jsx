import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";

import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";

import { Link } from "react-router-dom";
import {
  FILE_API_URL,
  PHP_API_URL,
} from "../../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { DeleteSweetAlert } from "../../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
} from "../../../site-components/Helper/HelperFunction";

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
          {capitalizeFirstLetter(props?.selectedInternship?.btitle)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <img
            src={`${FILE_API_URL}/banner/${props?.selectedInternship?.banner}`}
            alt=""
            style={{
              width: "350px",
              height: "auto",
              backgroundColor: "#e6fff3",
            }}
          />
        </div>
        <div className="table-responsive d-flex flex-wrap">
          {capitalizeFirstLetter(props?.selectedInternship?.bshort)}
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

const BannerList = () => {

  const [messages, setMessages] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
  const [loading, setLoading] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const viewAllImages = (data) => {
    setSelectedInternship(data);
  };
  useEffect(() => {
    if (selectedInternship != null) {
      setModalShow(true);
    }
  }, [selectedInternship]);

  useEffect(() => {
    fetchSpeciality();
  }, []);

  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin"
      ? fetchSpeciality(1)
      : fetchSpeciality();
  };

  const fetchSpeciality = async (delete_status = 0) => {
    try {
      const sendFormData = new FormData();

      sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
      sendFormData.append(
        "login_type",
        secureLocalStorage.getItem("loginType")
      );
      sendFormData.append("delete_status", delete_status);

      sendFormData.append("data", "load_banner");

      const response = await dataFetchingPost(
        `${PHP_API_URL}/banner.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.status === 200 && response.data.length > 0) {
        setMessages(response?.data);
      } else {
        setMessages([]);
        toast.error("Data not found.");
      }
    } catch (error) {
      setMessages([]);

      const statusCode = error.response?.data?.status;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
    }
  };

  const deleteMessage = async (id) => {
    try {
      const deleteAlert = await DeleteSweetAlert(" ");
      if (deleteAlert) {
        const bformData = new FormData();
        bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
        bformData.append("login_type", secureLocalStorage.getItem("loginType"));
        bformData.append("data", "delete_banner");
        bformData.append("id", id);

        const response = await axios.post(
          `${PHP_API_URL}/banner.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == 200) {
          toast.success(response.data.msg);
          recycleTitle === "Show Recycle Bin"
            ? fetchSpeciality()
            : fetchSpeciality(1);
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
        `${PHP_API_URL}/banner.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.msg);
        const updateList = messages?.map((data) =>
          data.id === id ? { ...data, status: !data.status } : data
        );

        setMessages(updateList);
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

                <span className="breadcrumb-item active">CMS</span>
                <span className="breadcrumb-item active">Banner</span>
              </nav>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Banner List</h5>
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
                    variant="dark"
                    className="ml-2 mb-2 mb-md-0 btn btn-secondary"
                    to="/admin/cms/banner/add-new"
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
                  <div className="col-md-4 col-lg-4 col-5 col-sm-2">
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

                      <Column
                        header="Image"
                        body={(rowData) => (
                          <div
                            className="info-column d-flex align-items-center
"
                          >
                            <div className="info-image mr-4 d-flex justify-content-center align-items-center">
                              {rowData.banner ? (
                                <img
                                  src={`${FILE_API_URL}/banner/${rowData.banner}`}
                                  alt=""
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className=" d-flex justify-content-center align-items-center "
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "40px",
                                    height: "60px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className=" d-flex justify-content-center align-items-center"
                                >
                                  {rowData?.title[0].toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        sortable
                      />

                      <Column
                        field="btitle"
                        header="Title"
                        body={(row) => capitalizeFirstLetter(row?.btitle)}
                        sortable
                      />

                      <Column
                        style={{ width: "20%" }}
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
                                    View Detail
                                  </Tooltip>
                                }
                              >
                                <div className="avatar avatar-icon avatar-md avatar-orange">
                                  <i
                                    className="fa-solid fa-eye"
                                    onClick={() => viewAllImages(rowData)}
                                  ></i>
                                </div>
                              </OverlayTrigger>
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
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setSelectedInternship(null);
        }}
        selectedInternship={selectedInternship}
      />
    </>
  );
};

export default BannerList;
