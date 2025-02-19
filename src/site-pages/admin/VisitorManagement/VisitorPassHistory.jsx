import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  formatDate,
  goBack,
  dataFetchingDelete,
  dataFetchingPatch,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { CancelSweetAlert } from '../../../site-components/Helper/DeleteSweetAlert';
import { Column } from "primereact/Column";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import { FormField } from "../../../site-components/admin/assets/FormField";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";
import secureLocalStorage from 'react-secure-storage';
function VisitorRegistrationHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitorHistory, setVisitorHistory] = useState([]);
  const initialData = {
    deleteStatus: 0,
    status: 1,
  };
  const [formData, setFormData] = useState(initialData);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [isFetching, setIsFetching] = useState(false);

  //for filter
  const handleChange = (e) => {
    let { name, value } = e.target;

    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const initializeFilter = {
    visitorId: "",
    passId: "",
    fromDate: "",
    toDate: "",
    startDateFrom: "",
    endDateFrom: "",
    startDateTo: "",
    endDateTo: "",
    visitorPhone: "",
    visitorName: "",
    hostDetails: "",
  };

  const [filters, setFilters] = useState(initializeFilter);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFilters = () => {
    setFilters(initializeFilter);
    handleSubmit();
    handleClose();
  };

  const applyFilters = () => {
    handleSubmit(true, false);
  };

  const visitorType = [
    {
      value: "Prospective Students",
      label: "Prospective Students",
    },
    {
      value: "Parents/Guardians",
      label: "Parents/Guardians",
    },
    { value: "Alumni", label: "Alumni" },
    { value: "Vendors", label: "Vendors" },
    { value: "Contractors", label: "Contractors" },
    {
      value: "Guest Lecturers",
      label: "Guest Lecturers",
    },
    { value: "Researchers", label: "Researchers" },
    {
      value: "Event Attendees",
      label: "Event Attendees",
    },
    { value: "Job Recruiters", label: "Job Recruiters" },
    {
      value: "Government Officials",
      label: "Government Officials",
    },
    {
      value: "Media Personnel",
      label: "Media Personnel",
    },
    { value: "Collaborators", label: "Collaborators" },
    {
      value: "Friends/Family of Students/Staff",
      label: "Friends/Family of Students/Staff",
    },
    {
      value: "Emergency Responders",
      label: "Emergency Responders",
    },
    {
      value: "General Visitors",
      label: "General Visitors",
    },
    {
      value: "Admissions Interviewees",
      label: "Admissions Interviewees",
    },
    {
      value: "Research Participants",
      label: "Research Participants",
    },
    { value: "Auditors", label: "Auditors" },
    { value: "Donors", label: "Donors" },
    {
      value: "Event Organizers",
      label: "Event Organizers",
    },
    { value: "Sponsors", label: "Sponsors" },
    {
      value: "Delivery Personnel",
      label: "Delivery Personnel",
    },
    {
      value: "International Delegates",
      label: "International Delegates",
    },
    {
      value: "Exchange Students",
      label: "Exchange Students",
    },
    {
      value: "Facility Inspectors",
      label: "Facility Inspectors",
    },
    {
      value: "Internship Supervisors",
      label: "Internship Supervisors",
    },
    {
      value: "Non-Profit Representatives",
      label: "Non-Profit Representatives",
    },
    {
      value: "Campus Tour Groups",
      label: "Campus Tour Groups",
    },
    {
      value: "Retired Staff or Faculty",
      label: "Retired Staff or Faculty",
    },
    {
      value: "Technology Vendors",
      label: "Technology Vendors",
    },
    {
      value: "Academic Advisors",
      label: "Academic Advisors",
    },
    {
      value: "Career Counselors",
      label: "Career Counselors",
    },
    {
      value: "Community Members",
      label: "Community Members",
    },
    {
      value: "Health and Wellness Providers",
      label: "Health and Wellness Providers",
    },
    { value: "Legal Advisors", label: "Legal Advisors" },
    {
      value: "Student Organization Guests",
      label: "Student Organization Guests",
    },
    {
      value: "Conference Speakers",
      label: "Conference Speakers",
    },
    {
      value: "Performers/Artists",
      label: "Performers/Artists",
    },
    {
      value: "Sports Teams (Visiting Teams)",
      label: "Sports Teams (Visiting Teams)",
    },
    {
      value: "Academic Accreditation Teams",
      label: "Academic Accreditation Teams",
    },
  ];

  // const updateDataFetch = async (dbId) => {
  //   if (
  //     !dbId ||
  //     !Number.isInteger(parseInt(dbId, 10)) ||
  //     parseInt(dbId, 10) <= 0
  //   )
  //     return toast.error("Invalid ID.");
  //   navigate(`/admin/add-genrate-pass/${dbId}`, { replace: true });
  // };

  const handleToggleStatus = async (dbId, currentStatus) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    // Toggle the status (currentStatus is the current checkbox state)
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const loguserid = secureLocalStorage.getItem("login_id");
      const login_type = secureLocalStorage.getItem("loginType");
      const response = await axios.post(
        `${NODE_API_URL}/api/campus/visitor/campus-pass-cancel`,{passId:dbId,loguserid,login_type}
      );
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        
        // Update the notice list to reflect the status change
        setVisitorHistory((prevList) =>
          prevList.map((item) =>
            item.id === dbId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  // pass cancel 
   const passCancel = async (dbId) => {
    if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
    try {
        const cancelAlert = await CancelSweetAlert();
        if (cancelAlert) {
            const loguserid = secureLocalStorage.getItem('login_id');
            const login_type = secureLocalStorage.getItem('loginType');
            const response = await dataFetchingDelete(`${NODE_API_URL}api/campus/visitor/campus-pass-cancel${dbId}/${loguserid}/${login_type}`);
            if (response?.statusCode === 200) {
                toast.success(response.message);
                setVisitorHistory(prevList => prevList.filter(item => item.id !== dbId));
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    } catch (error) {
        const statusCode = error.response?.data?.statusCode;

        if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
            toast.error(error.response.message || "A server error occurred.");
        } else {
            toast.error(
                "An error occurred. Please check your connection or try again."
            );
        }
    }
   }

  const handleSubmit = async (applyFilter = false, e = false) => {
    if (e) e.preventDefault();
    let bformData = { visitorId: id };
    if (applyFilter) {
      bformData = filters;
    }
    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/campus/visitor/campus-pass-list`,
        {
          ...bformData,
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {

        setVisitorHistory(response.data.data);
      } else {
        setVisitorHistory([]);
      }
      setIsFetching(false);
    } catch (error) {
      setVisitorHistory([]);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Dashboard
                  </a>
                  <span className="breadcrumb-item">Visitor Management</span>
                  <span className="breadcrumb-item active">
                    Visitor Pass History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Visitor Pass History</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* Search Box */}
                <div className="row">
                  <div className="col-md-10 col-lg-10 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                  <div className="">
                    <Button
                      variant="primary"
                      className=" mb-2 mb-md-0"
                      onClick={handleShow}
                    >
                      <span>
                        <FaFilter /> Filter
                      </span>
                    </Button>
                  </div>
                </div>
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={visitorHistory}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    globalFilter={globalFilter} // Bind global filter
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column
                      body={(row) => validator.unescape(row.visitorType)}
                      header="Visitor Type"
                      sortable
                    />
                    <Column
                      body={(row) => validator.unescape(row.passType)}
                      header="Pass Type"
                      sortable
                    />

                    <Column
                      body={(row) => validator.unescape(row.visitorPhone)}
                      header="Phone No"
                      sortable
                    />
                    <Column
                      body={(row) => validator.unescape(row.hostDetails)}
                      header="Host Details"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.fromDate)}
                      header="From date"
                      sortable
                    />
                    <Column
                      body={(row) =>
                        row.toDate ? formatDate(row.toDate) : row.toDate
                      }
                      header="To date"
                      field="toDate"
                      sortable
                    />

                    <Column
                      field="created_at"
                      body={(row) => formatDate(row.created_at)}
                      header="Created At"
                      sortable
                    />
                     <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          <div className="switch mt-1 w-auto">
                            <input
                              type="checkbox"
                              checked={rowData.status === 1} // This ensures the checkbox reflects the correct status
                              onChange={() =>
                                handleToggleStatus(rowData.id, rowData.status)
                              } // Pass the id and current status
                              className="facultydepartment-checkbox"
                              id={`switch${rowData.status}`}
                            />
                            <label
                              className="mt-0"
                              htmlFor={`switch${rowData.status}`}
                            ></label>
                          </div>
                          <Link to={`/admin/visitor-pass/${rowData.id}`}>
                            <button className="ml-2 btn-md btn border-0 btn-secondary">
                              Print Pass
                            </button>
                          </Link>
                          {/* <div
                            onClick={() => updateDataFetch(rowData.id)}
                            className="avatar avatar-icon avatar-md avatar-orange"
                          >
                            <i className="fas fa-edit"></i>
                          </div> */}
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
                                  onClick={() => deleteStatus(rowData.id)}
                                ></i>
                              </div>
                            </OverlayTrigger>
                          ) : (
                            ''
                          )}
                        </div>
                      )}
                    />

                    {/* <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          <div
                            onClick={() => passCancel(rowData.visitorId)}
                            className="ml-2 btn-md btn border-0 btn-secondary"
                          >
                            Cancel
                          </div>

                          <Link to={`/admin/visitor-pass/${rowData.visitorId}`}>
                            <button className="ml-2 btn-md btn border-0 btn-secondary">
                              Cancel
                            </button>
                          </Link>
                          <Link to={`/admin/visitor-pass/${rowData.visitorId}`}>
                            <button className="ml-2 btn-md btn border-0 btn-secondary">
                              Print Pass
                            </button>
                          </Link>
                        </div>
                      )}
                    /> */}
                  </DataTable>
                </div>
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
              <FormField
                label="Visitor Id"
                name="visitorId"
                id="visitorId"
                value={filters.visitorId}
                onChange={handleChange}
                column="col-md-6"
              />
              <FormField
                label="Pass Id"
                name="passId"
                id="passId"
                value={filters.passId}
                onChange={handleChange}
                column="col-md-6"
              />
              <FormField
                label="Visitor Name"
                name="visitorName"
                id="visitorName"
                value={filters.visitorName}
                onChange={handleChange}
                column="col-md-6"
              />

              {/* Contact No */}
              <FormField
                label="Phone No"
                name="visitorPhone"
                id="visitorPhone"
                value={filters.visitorPhone}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Date */}
              <FormField
                label="From date"
                name="fromDate"
                id="fromDate"
                type="date"
                value={filters.fromDate}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="To Date"
                name="toDate"
                id="toDate"
                type="date"
                value={filters.toDate}
                onChange={handleChange}
                column="col-md-6"
              />
              <FormField
                label="Host Details"
                name="hostDetails"
                id="hostDetails"
                value={filters.hostDetails}
                onChange={handleChange}
                column="col-md-12"
              />

              {/* Visit Date */}
              <FormField
                label="Start Date From"
                name="startDateFrom"
                id="startDateFrom"
                type="date"
                value={filters.startDateFrom}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="End Date From"
                name="endDateFrom"
                id="endDateFrom"
                type="date"
                value={filters.endDateFrom}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Date */}
              <FormField
                label="Start Date To"
                name="startDateTo"
                id="startDateTo"
                type="date"
                value={filters.startDateTo}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="End Date To"
                name="endDateTo"
                id="endDateTo"
                type="date"
                value={filters.endDateTo}
                onChange={handleChange}
                column="col-md-6"
              />
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
    </>
  );
}
export default VisitorRegistrationHistory;
