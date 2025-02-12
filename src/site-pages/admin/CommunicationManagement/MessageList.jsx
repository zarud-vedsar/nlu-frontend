import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { formatDate, goBack } from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext";
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import secureLocalStorage from "react-secure-storage";
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from "react-select";
import { FormField } from "../../../site-components/admin/assets/FormField";

function MessageList() {
  const navigate = useNavigate();
  const [messageListing, setMessageListing] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(""); // Search filter
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const initialData = {
    studentId: '',
    facultyId: '',
    seenStatus: '',
    startDate: '',
    endDate: '',
    all: '',
    replyId: '',
    forListing: true
  }
  const [formData, setFormData] = useState(initialData);
  const [studentList, setStudentList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const fetchAllMessage = async () => {
    try {
      const response = await axios.post(`${NODE_API_URL}/api/communication/fetch-all-message`, formData);
      if (response?.data?.statusCode === 200 && response?.data?.data.length > 0) {
        setMessageListing(response?.data?.data);
      } else {
        toast.error("No data found.");
        setMessageListing([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch data. Please try again later.");
      setMessageListing([]);
    }
  };
  const fetchUniqueStudent = async () => {
    try {
      const response = await axios.post(`${NODE_API_URL}/api/communication/uniqueStudent`);
      if (response?.data?.statusCode === 200 && response?.data?.data.length > 0) {
        setStudentList(response?.data?.data);
      } else {
        setStudentList([]);
      }
    } catch (error) {
      setStudentList([]);
    }
  };
  useEffect(() => {
    fetchUniqueStudent();
  }, []);
  const fetchUniqueFaculty = async () => {
    try {
      const response = await axios.post(`${NODE_API_URL}/api/communication/uniqueFaculty`);
      if (response?.data?.statusCode === 200 && response?.data?.data.length > 0) {
        setFacultyList(response?.data?.data);
      } else {
        setFacultyList([]);
      }
    } catch (error) {
      setFacultyList([]);
    }
  };
  useEffect(() => {
    fetchUniqueStudent();
    fetchUniqueFaculty();
    fetchAllMessage();
  }, []);
  const handleFilter = (e) => {
    e.preventDefault();
    fetchAllMessage();
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }
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
                  <span className="breadcrumb-item">Communication Management</span>
                  <span className="breadcrumb-item active">Message List</span>
                </nav>
              </div>
            </div>

            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title">Message List</h5>
                <div className="ml-auto">
                  <button className="btn btn-secondary mr-2" onClick={goBack}>
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/cmn-mng-message">
                    <button className="btn btn-secondary">
                      <i className="fas fa-plus"></i> Add New
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="card border-0">
              <div className="card-body">
                {/* Search Box */}
                <div className="row mb-3">
                  <div className="col-md-11 col-lg-11 col-10 col-sm-10 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                  <div className='search-icon'><i className="pi pi-search" /></div>
                    <InputText
                      type="search"
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      placeholder="Search"
                      className="form-control"
                    />
                  </div>
                  <div className='col-md-1 col-lg-1 col-2 mb-3 col-sm-2 d-flex justify-content-between align-items-center'>
                    <button className="btn btn-info text-white" onClick={handleShow}><i className="fa fa-filter"></i></button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="table-responsive">
                  <DataTable
                    value={messageListing}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    globalFilter={globalFilter}
                    emptyMessage="No records found"
                    sortMode="multiple"
                  >
                    <Column
                      field="facultyName"
                      header="Faculty"
                      body={(row) => validator.unescape(row.facultyName)}
                      sortable
                    />
                    <Column
                      field="sname"
                      header="Student"
                      body={(row) => (
                        <div>
                          {validator.unescape(row.sname)}
                          {
                            row.FacultySeen > 0 && (
                              <span className="badge badge-danger">{row.FacultySeen}</span>
                            )
                          }
                        </div>
                      )}

                      sortable
                    />
                    <Column
                      header="Course"
                      body={(row) => validator.unescape(row.coursename)}
                      sortable
                    />
                    <Column
                      header="Semester"
                      body={(row) => validator.unescape(row.semtitle)}
                      sortable
                    />
                    <Column
                      header="Sender Type"
                      body={(row) =>
                        row.sentBy === "student" ? (
                          <span className="badge badge-info">Received</span>
                        ) : (
                          <span className="badge badge-success">Sent</span>
                        )
                      }
                      sortable
                    />
                    <Column
                      field="created_at"
                      header="Created At"
                      body={(row) => formatDate(row.created_at)}
                      sortable
                    />
                    <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          <button
                            className="btn btn-primary btn-sm mr-2"
                            onClick={() => navigate(`/admin/message-list/view/${rowData.id}`)}
                          >
                            View
                          </button>
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
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Records</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleFilter}>
            <div className="row">
              <div className="col-md-12 col-lg-12 form-group">
                <label className="font-weight-semibold">Student</label>
                <Select
                  options={studentList.map((item) => ({
                    value: item.id,
                    label: item.sname,
                  }))}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      studentId: selectedOption.value,
                    });
                  }}
                  value={
                    studentList.find(
                      (item) =>
                        item.id === parseInt(formData.studentId)
                    )
                      ? {
                        value: parseInt(formData.studentId),
                        label: studentList.find(
                          (item) =>
                            item.id === parseInt(formData.studentId)
                        ).sname,
                      }
                      : { value: formData.studentId, label: "Select" }
                  }
                />
              </div>
              <div className="col-md-12 col-lg-12 form-group">
                <label className="font-weight-semibold">Faculty</label>
                <Select
                  options={facultyList.map((item) => ({
                    value: item.id,
                    label: item.facultyName,
                  }))}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      facultyId: selectedOption.value,
                    });
                  }}
                  value={
                    facultyList.find(
                      (item) =>
                        item.id === parseInt(formData.facultyId)
                    )
                      ? {
                        value: parseInt(formData.facultyId),
                        label: facultyList.find(
                          (item) =>
                            item.id === parseInt(formData.facultyId)
                        ).facultyName,
                      }
                      : { value: formData.facultyId, label: "Select" }
                  }
                />
              </div>
              <FormField
                label="From Date"
                name="startDate"
                id="startDate"
                type='date'
                value={formData.startDate}
                onChange={handleChange}
                column="col-md-6 col-lg-6"
              />
              <FormField
                label="To Date"
                name="endDate"
                id="endDate"
                type='date'
                value={formData.endDate}
                onChange={handleChange}
                column="col-md-6 col-lg-6"
              />
              <div className="col-md-12 col-lg-12 col-12 d-flex align-items-center justify-content-center">
                <button onClick={() => setFormData(initialData)} className='mt-2 btn btn-secondary btn-block d-flex justify-content-center align-items-center' type='button'>
                  Reset
                </button>
                <button className='btn btn-primary ml-2 btn-block d-flex justify-content-center align-items-center' type='submit'>
                  Apply Filter{" "} {isSubmit && (
                    <>
                      &nbsp; <div className="loader-circle"></div>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MessageList;
