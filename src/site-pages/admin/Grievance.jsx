import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
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

import { FaArrowLeft } from "react-icons/fa6";

import "../../site-components/admin/assets/css/FacultyList.css";
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
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { formatDate } from "../../site-components/Helper/HelperFunction";
import { end } from "@popperjs/core";

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
  const [allGrievanceList, setAllGrievanceList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [loading, setLoading] = useState(false);

  const filterByDateRange = (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Stripping time part from the start and end date (set hours to 00:00:00)
    if (start) {
      start.setHours(0, 0, 0, 0);
    }
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    console.log(allGrievanceList);

    let data = allGrievanceList.filter((item) => {
      const createdAtDate = new Date(item.created_at);
      createdAtDate.setHours(0, 0, 0, 0);
      console.log(createdAtDate);
      if (start && end) {
        return createdAtDate >= start && createdAtDate <= end;
      }
      if (start) {
        return createdAtDate >= start;
      }
      if (end) {
        return createdAtDate <= end;
      }
      return true;
    });

    console.log(data);

    setGrievanceList(data);
  };

  useEffect(() => {
    filterByDateRange(startDate, endDate);
  }, [startDate, endDate]);

  const initializeDate = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 7);

    const formattedStartDate = start.toISOString().split("T")[0];
    const formattedEndDate = today.toISOString().split("T")[0];

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  };

  useEffect(() => {
    loadGrievanceData();

    initializeDate();
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
      setAllGrievanceList(response.data.data);
    } catch (error) {
      console.error("Error fetching grievance data:", error);
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
              <a href="/" className="breadcrumb-item">
                CMS
              </a>

              <span className="breadcrumb-item active">Grievance</span>
            </nav>
          </div>

          <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Course List</h5>
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
              <div className="row">
                <div className="col-md-7 col-lg-7 col-7 col-sm-7 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                <div className="col-md-2 col-lg-2 col-10 col-sm-4 mr-3 d-flex align-items-center">
                  <label htmlFor="start-date" className="mr-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    className="form-control"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="col-md-2 col-lg-2 col-10 col-sm-4 d-flex align-items-center">
                  <label htmlFor="end-date" className="mr-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    className="form-control"
                    onChange={(e) => setEndDate(e.target.value)}
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
                    <Column field="year_semester" header="Semester" sortable />
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
                        <div className="d-flex justify-content-around">
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="button-tooltip-2">
                                View Grievance
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
