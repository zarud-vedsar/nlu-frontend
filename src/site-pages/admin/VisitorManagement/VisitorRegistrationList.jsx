import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
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

function VisitorRegistrationHistory() {
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
  //   const [block, setBlock] = useState([]);
  //   const [blockRoomNo, setBlockRoomNo] = useState([]);
  const handleChange = (e) => {
    let { name, value } = e.target;

    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const initializeFilter = {
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    visitorType: '',
    dateOfArrival: '',
    dateOfDeparture: '',
    hostDetails: '',
    governmentIdProofNo: '',
    startDateArrival: '',
    endDateArrival: '',
    startDateDeparture: '',
    endDateDeparture: '',
    visitorId: "",
    passId: "",
    fromDate: "",
    toDate: "",
    startDateFrom: "",
    endDateFrom: "",
    startDateTo: "",
    endDateTo: "",
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

  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/visitor-registration/${dbId}`, { replace: false });
  };
  const handleSubmit = async (applyFilter = false, e = false) => {
    if (e) e.preventDefault();
    let bformData = { listing: "yes" };
    if (applyFilter) {
      bformData = filters;
    }
    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/campus/visitor/campus-visitor-list`,
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
                    Visitor Registration History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  Visitor Registration History
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/visitor-registration">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus"></i> Add New Registration
                    </button>
                  </Link>
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
                      body={(row) => validator.unescape(row.visitorName)}
                      header="Name"
                      sortable
                    />
                    <Column
                      body={(row) => validator.unescape(row.visitorPhone)}
                      header="Phone No"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.dateOfArrival)}
                      header="Date of Arrival"
                      sortable
                    />
                    <Column
                      body={(row) =>
                        row.dateOfDeparture
                          ? formatDate(row.dateOfDeparture)
                          : row.dateOfDeparture
                      }
                      header="Date Of Departure"
                      sortable
                    />
                    <Column
                      body={(row) => row.timeOfArrival}
                      header="Time of Arrival"
                      sortable
                    />
                    <Column
                      body={(row) => row.timeOfDeparture}
                      header="Time of Departure"
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
                          <div
                            onClick={() => updateDataFetch(rowData.id)}
                            className="avatar avatar-icon avatar-md avatar-orange"
                          >
                            <i className="fas fa-edit"></i>
                          </div>
                        </div>
                      )}
                    />
                    <Column
                      header="New Tab"
                      body={(rowData) => (
                        <div className="d-flex justify-content-around">
                          <Link to={`/admin/add-genrate-pass/${rowData.id}`}>
                            <button
                              className="ml-2 btn-md btn border-0 btn-secondary"
                              style={{ fontSize: "12px" }}
                            >
                              New Pass
                            </button>
                          </Link>

                        <Link to={`/admin/visitor-pass-history/${rowData.id}`}>
                          <button className="ml-2 btn-md btn border-0 btn-secondary">
                           Pass History
                          </button>
                        </Link>
                       
                        </div>
                      )}
                    />
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
              <div className="col-6 form-group">
                <label className="font-weight-semibold">Visitor Type</label>
                <Select
                  options={visitorType.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      visitorType: selectedOption.value,
                    });
                  }}
                  value={
                    visitorType.find(
                      (item) => item.value === filters.visitorType
                    )
                      ? {
                        value: filters.visitorType,
                        label: visitorType.find(
                          (item) => item.value === filters.visitorType
                        ).label,
                      }
                      : { value: filters.visitorType, label: "Select" }
                  }
                />
              </div>
              <FormField
                label="Visitor Name"
                name="visitorName"
                id="visitorName"
                value={filters.visitorName}
                onChange={handleChange}
                column="col-md-6"
              />

              <FormField
                label="Visitor Email"
                name="visitorEmail"
                id="visitorEmail"
                value={filters.visitorEmail}
                onChange={handleChange}
                column="col-md-12"
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
              <FormField
                label="Id Proof No"
                name="governmentIdProofNo"
                id="governmentIdProofNo"
                value={filters.governmentIdProofNo}
                onChange={handleChange}
                column="col-md-6"
              />

              {/* Visit Date */}
              <FormField
                label="Visit Date From"
                name="dateOfArrival"
                id="dateOfArrival"
                type="date"
                value={filters.dateOfArrival}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="Visit Date To"
                name="dateOfDeparture"
                id="dateOfDeparture"
                type="date"
                value={filters.dateOfDeparture}
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
                label="Start Date Arrival"
                name="startDateArrival"
                id="startDateArrival"
                type="date"
                value={filters.startDateArrival}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="End  Date Arrival"
                name="endDateArrival"
                id="endDateArrival"
                type="date"
                value={filters.endDateArrival}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Date */}
              <FormField
                label="Start Date Departure"
                name="startDateDeparture"
                id="startDateDeparture"
                type="date"
                value={filters.startDateDeparture}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="End Date Departure"
                name="endDateDeparture"
                id="endDateDeparture"
                type="date"
                value={filters.endDateDeparture}
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


    </>
  );
}
export default VisitorRegistrationHistory;
