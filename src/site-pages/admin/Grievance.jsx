import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import {
  Modal,
  Button,
  Spinner,
} from "react-bootstrap";

import { FaArrowLeft } from "react-icons/fa6";

import "../../site-components/admin/assets/css/FacultyList.css";
import {
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { formatDate } from "../../site-components/Helper/HelperFunction";

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
          {props.selectedGrievance?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive d-flex flex-wrap">
          {props.selectedGrievance?.message}
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

const Grievance = () => {
  const [grievanceList, setGrievanceList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStartDate = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 7);
    return start.toISOString().split("T")[0];
  };
  
  const getEndDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  
  const [formData, setFormData] = useState({
    startDate: getStartDate(),
    endDate: getEndDate()
  });
 

  useEffect(() => {
    loadGrievanceData();
  }, []);

  useEffect(() => {
    if (selectedGrievance != null) {
      setModalShow(true);
    }
  }, [selectedGrievance]);

  const viewAllImages = (index) => {
    const currentSetGrievance = grievanceList[index];
    setSelectedGrievance(currentSetGrievance);
  };

  const loadGrievanceData = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("startDate",formData?.startDate);
      bformData.append("endDate",formData?.endDate);
      const response = await axios.post(
        `${NODE_API_URL}/api/grievance/list`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setGrievanceList(response.data.data);
    } catch (error) {
      setGrievanceList([])
    } finally {
      setLoading(false);
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

                <span className="breadcrumb-item active">Inquiry</span>

                <span className="breadcrumb-item active">Grievance</span>
              </nav>
            </div>

            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Grievance</h5>
                <div className="ml-auto">
                  <Button
                    variant="light"
                    onClick={() => window.history.back()}
                    className=" mb-md-0"
                  >
                    <i className="fas">
                      <FaArrowLeft />
                    </i>{" "}
                    Go Back
                  </Button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="row d-flex align-items-end">
                  <div className="col-md-6 col-lg-6 col-12 col-sm-12 p-input-icon-left  d-flex justify-content-start align-items-center">
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
                  <div className="col-md-3 col-lg-3 col-12 col-sm-12 mt-2 ">
                    <label htmlFor="start-date" className="mr-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      value={formData?.startDate}
                      className="form-control"
                      onChange={(e) => setFormData((prev)=>({...prev,startDate:e.target.value}))}
                    />
                  </div>

                  <div className="col-md-3 col-lg-3 col-12 col-sm-12  mt-2">
                    <label htmlFor="end-date" className="mr-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      value={formData?.endDate}
                      className="form-control"
                      onChange={(e) => setFormData((prev)=>({...prev,endDate:e.target.value}))}
                    />
                  </div>
                  <div className="col-md-3 col-lg-3 col-12 col-sm-12 mr-3 mt-2">
                    <button className="btn btn-secondary" onClick={loadGrievanceData}>
                      Fetch
                    </button>
                    </div>

                </div>

                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <div className="table-responsive mt-3">
                    <DataTable
                      value={grievanceList}
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
                      <Column
                        field="year_semester"
                        header="Semester"
                        sortable
                      />
                      <Column field="phone" header="Contact" sortable />
                      <Column
                        field="created_at"
                        header="Date"
                        sortable
                        body={(rowData) => `${formatDate(rowData.created_at)}`}
                      />

                      <Column
                        header="Action"
                        body={(rowData, { rowIndex }) => (
                          <div className="d-flex ">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">
                                  View Grievance
                                </Tooltip>
                              }
                            >
                              <div className="avatar avatar-icon avatar-md avatar-orange mr-2">
                                <i
                                  className="fa-solid fa-eye"
                                  onClick={() => viewAllImages(rowIndex)}
                                ></i>
                              </div>
                            </OverlayTrigger>

                            {rowData?.pdf_file && (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="button-tooltip-2">
                                    View File
                                  </Tooltip>
                                }
                              >
                                <Link
                                  className="avatar avatar-icon avatar-md avatar-orange"
                                  to={`${NODE_API_URL}/public/upload/${rowData?.pdf_file}`}
                                  target="_blank"
                                >
                                  <i className="fa-solid fa-file"></i>
                                </Link>
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
        selectedGrievance={selectedGrievance}
      />
    </>
  );
};

export default Grievance;
