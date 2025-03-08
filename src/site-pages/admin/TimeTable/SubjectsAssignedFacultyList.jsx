// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { PHP_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
// import "../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import axios from "axios";
function SemesterSubjectList() {
  const [SemesterSubjectListing, setSemesterSubjectListing] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
  const [loading, setLoading] = useState(false);


  // for filter
  const [filters, setFilters] = useState({
    facultyId: null,
    courseid: null,
    semesterid: null,
    subjectId: null,
    all: false, // Default to false for filtered data
  });

  const [show, setShow] = useState(false);
  const [filterStatus, setFilterStatus] = useState();
  const navigate = useNavigate();

  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [subjectListing, setSubjectListing] = useState([]);
  const [facultyListing, setFacultyListing] = useState([]); // fetch faculty data


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFilters = () => {
    setFilters({
      facultyId: null,
      courseid: null,
      semesterid: null,
      subjectId: null,
      all: false, // Fetch all records
    });
    fetchSemesterSubjectListing(); // Reset and fetch all records
    setFilterStatus(null);
    handleClose();
  };

  const applyFilters = () => {
    setFilters((prev) => ({ ...prev, all: false }));
    fetchSemesterSubjectListing(filters);
  };

  const loadFacultyData = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_userPage");
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Assuming response.data.data contains the faculty data
      setFacultyListing(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacultyData();
  }, []);

  const courseListDropdown = async () => {
    try {
      const response = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setCourseListing(response.data.data);
      } else {
        toast.error("Course not found.");
        setCourseListing([]);
      }
    } catch (error) {
      setCourseListing([]);
    }
  };

  useEffect(() => {
    courseListDropdown();
  }, []);

  const fetchSemesterBasedOnCourse = async (courseid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          courseid: courseid,
          column: "id, semtitle",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSemesterListing(response.data);
      } else {
        toast.error("Semester not found.");
        setSemesterListing([]);
      }
    } catch (error) {
      setSemesterListing([]);
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

  const fetchSubjectBasedOnCourseAndSemeter = async (courseid, semesterid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          column: "id, subject",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSubjectListing(response.data);
      } else {
        toast.error("Semester not found.");
        setSubjectListing([]);
      }
    } catch (error) {
      setSubjectListing([]);
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

  const fetchSemesterSubjectListing = async (
    filters = {},
    deleteStatus = 0
  ) => {
    setIsFetching(true);
    const { facultyId, courseid, semesterid, subjectId, all } = filters;

    const fetchAllRecords = all === true;

    // Prepare payload for the request
    const payload = {
      facultyId,
      courseid,
      semesterid,
      subjectId,
      all,
    };

    if (!fetchAllRecords && (!courseid || !semesterid || !subjectId)) {
      toast.error(
        "Course, Semester, and Subject are required when 'all' is false."
      );
      setIsFetching(false);
      return;
    }

    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/time-table/table-chart/assigned-faculty-list`,
        payload
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSemesterSubjectListing(response.data);
      } else {
        toast.error("Data not found.");
        setSemesterSubjectListing([]);
      }
    } catch (error) {
      setSemesterSubjectListing([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSemesterSubjectListing({ all: true }); // Fetch all data initially
  }, []);

  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/subjects-assinged-faculty/${dbId}`, { replace: false });
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </a>
                  <span className="breadcrumb-item">Time Table Management</span>
                  <span className="breadcrumb-item active">
                    Subjects Assigned Faculty List
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new pt-2">
                  Subjects Assigned Faculty List
                </h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 goback"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                    <Button
                      variant="primary"
                      className="mb-md-0 ml-2"
                      onClick={handleShow}
                    >
                      <span>
                        <FaFilter /> 
                      </span>
                    </Button>
                  <Link
                    to={"/admin/subjects-assinged-faculty"}
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-plus" /> Add New
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
                 
                </div>
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={SemesterSubjectListing}
                    removableSort
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    globalFilter={globalFilter} // Bind global filter
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column field="coursename" header="Course" sortable />
                    <Column
                    field="semtitle"
                      body={(row) => capitalizeFirstLetter(row.semtitle)}
                      header="Semester"
                      sortable
                    />
                    <Column
                    field="subject"
                      body={(row) =>
                        // Map through subjectList and join subjects with commas
                        row.subjectList.map((subject, index) => (
                          <>
                            {capitalizeFirstLetter(subject.subject)}
                            {index < row.subjectList.length - 1 && ", "}{" "}
                            {/* Add comma except for the last subject */}
                          </>
                        ))
                      }
                      header="Subjects"
                      sortable
                    />

                    <Column
                    field="first_name"
                      body={(row) =>
                        capitalizeFirstLetter(
                          `${row.first_name} ${row.last_name}`
                        )
                      } // Combine first_name and last_name
                      header="Faculty"
                      sortable
                    />

                    <Column
                    field="u_phone"
                      body={(row) => row.u_phone}
                      header="Phone"
                      sortable
                    />
                    <Column
                      field="created_at"
                      body={(row) => formatDate(row.created_at)}
                      header="Created At"
                      sortable
                    />
                    {recycleTitle !== "Show Recycle Bin" && (
                      <Column
                        field="deleted_at"
                        body={(row) =>
                          row.deleted_at &&
                          row.deleted_at != "0000-00-00" &&
                          formatDate(row.deleted_at)
                        }
                        header="Deleted At"
                        sortable
                      />
                    )}
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
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* filter modal */}
      <Modal show={show} onHide={handleClose} className="modal-right">
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="filteruserlist">
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Faculty</Form.Label>
                  <Select
                            options={facultyListing.map((faculty) => ({
                              value: faculty.id, // Use faculty id as the value
                              label: `${faculty.first_name} ${faculty.last_name}`, // Assuming faculty has first_name and last_name fields
                            }))}
                            onChange={(selectedOption) => {
                              setFilters({
                                ...filters,
                                facultyId: selectedOption.value, // Save selected faculty id
                              });
                            }}
                            value={
                              facultyListing.find(
                                (faculty) => faculty.id === filters.facultyId
                              )
                                ? {
                                    value: filters.facultyId,
                                    label: `${
                                      facultyListing.find(
                                        (faculty) =>
                                          faculty.id === filters.facultyId
                                      ).first_name
                                    } ${
                                      facultyListing.find(
                                        (faculty) =>
                                          faculty.id === filters.facultyId
                                      ).last_name
                                    }`,
                                  }
                                : {
                                    value: filters.facultyId,
                                    label: "Select",
                                  }
                            }
                          />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Course</Form.Label>
                  <Select
                    options={courseListing.map((item) => ({
                      value: item.id,
                      label: item.coursename,
                    }))}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        courseid: selectedOption.value,
                      });

                      fetchSemesterBasedOnCourse(selectedOption.value);
                    }}
                    value={
                      courseListing.find(
                        (item) => item.id === parseInt(filters.courseid)
                      )
                        ? {
                            value: parseInt(filters.courseid),
                            label: courseListing.find(
                              (item) => item.id === parseInt(filters.courseid)
                            ).coursename,
                          }
                        : { value: filters.courseid, label: "Select" }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Semester</Form.Label>
                  <Select
                    options={semesterListing.map((item) => ({
                      value: item.id,
                      label: capitalizeFirstLetter(item.semtitle),
                    }))}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        semesterid: selectedOption.value,
                      });
                      fetchSubjectBasedOnCourseAndSemeter(
                        filters.courseid,
                        selectedOption.value
                      );
                    }}
                    value={
                      semesterListing.find(
                        (item) => item.id === filters.semesterid
                      )
                        ? {
                            value: filters.semesterid,
                            label: capitalizeFirstLetter(
                              semesterListing.find(
                                (item) => item.id === filters.semesterid
                              ).semtitle
                            ),
                          }
                        : {
                            value: filters.semesterid,
                            label: "Select",
                          }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Subject</Form.Label>
                  <Select
                    options={subjectListing.map((item) => ({
                      value: item.id,
                      label: capitalizeFirstLetter(item.subject),
                    }))}
                    onChange={(selectedOption) => {
                      const selectedSubjectId = selectedOption
                        ? selectedOption.value
                        : null;

                      // Update filters for a single selected subject
                      setFilters({
                        ...filters,
                        subject: selectedSubjectId, // Only one subject will be selected
                      });

                      // Fetch semester subject listing with the selected subject filter
                      fetchSemesterSubjectListing({
                        ...filters,
                        subject: selectedSubjectId, // Apply the single subject filter
                      });
                    }}
                    value={
                      subjectListing.find((item) => item.id === filters.subject) // Find the selected subject
                        ? {
                            value: filters.subject,
                            label: capitalizeFirstLetter(
                              subjectListing.find(
                                (item) => item.id === filters.subject
                              )?.subject
                            ),
                          }
                        : null // If no subject is selected, set value as null
                    }
                    placeholder="Select Subject"
                  />
                </Form.Group>
              </Col>
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
export default SemesterSubjectList;
