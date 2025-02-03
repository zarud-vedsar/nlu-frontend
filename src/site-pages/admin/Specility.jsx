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
import { dataFetchingPost } from "../../site-components/Helper/HelperFunction";
import validator from "validator";

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
          {props?.selectedInternship?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive d-flex flex-wrap">
          
        {validator.unescape(props?.selectedInternship?.description || " ")}

          
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


const Specility = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
  const [loading, setLoading] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const viewAllImages = (index) => {
    const currentLob = messages[index];
    console.log(currentLob);
    setSelectedInternship(currentLob);
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
    recycleTitle === "Show Recycle Bin" ? fetchSpeciality(1) : fetchSpeciality();
  };
 

  const fetchSpeciality = async (deleteStatus = 0) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/speciality/fetch`,{
            listing: 'yes',
            deleteStatus,
          }
        
      );
      console.log(response)
      if (response?.statusCode === 200 && response.data.length > 0) {
        console.log(response);
        setMessages(response.data)
      } else {
        toast.error("Data not found.");
      }
    } catch (error) {
      console.log(error)
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
    }
  };

 

  const editDetail = (id) => {
    navigate(`/admin/edit-specility-detail/${id}`);
  };

  const deleteMessage = async (id) => {
    try {

      const loginid = secureLocalStorage.getItem("login_id");
      const logintype = secureLocalStorage.getItem("loginType");
    

      const deleteAlert = await DeleteSweetAlert(" ");
      if (deleteAlert) {
        const response = await axios.delete(
          `${NODE_API_URL}/api/speciality/deleteStatus/${id}/${loginid}/${logintype}`
        );
        console.log(response)
        if (response.status == "200") {
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
      const loginid = secureLocalStorage.getItem("login_id");
      const logintype = secureLocalStorage.getItem("loginType");
     

      const response = await axios.patch(
          `${NODE_API_URL}/api/speciality/status/${id}/${loginid}/${logintype}`
        );
        console.log(response)
        
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
              <a href="/" className="breadcrumb-item">
                Library
              </a>

              <span className="breadcrumb-item active">Speciality</span>
            </nav>
          </div>
            <div className="card bg-transparent mb-2">
                        <div className="card-header d-flex justify-content-between align-items-center px-0">
                          <h5 className="card-title h6_new">Speciality List</h5>
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

              <Link variant="dark" className="ml-2 mb-2 mb-md-0 btn btn-secondary" to='/admin/add-specility'>
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
                            {rowData.image ? (
                              <img
                                src={rowData.image}
                                alt=""
                                style={{
                                  width: "40px",
                                  height: "60px",
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

                    <Column field="title" header="Title" sortable />
                    
                    

                    <Column
                      style={{ width: "20%" }}
                      header="Action"
                      body={(rowData,{rowIndex}) => (
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
                          {rowData.deleteStatus == 0 ? (
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
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedInternship={selectedInternship}
      />
    </>
  );
};

export default Specility;
