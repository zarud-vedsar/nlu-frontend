// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingDelete,
  dataFetchingPatch,
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DeleteSweetAlert } from "../../../site-components/Helper/DeleteSweetAlert";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import axios from "axios";
import useRolePermission from "../../../site-components/admin/useRolePermission";

function QuizList() {
  const [SemesterSubjectListing, setSemesterSubjectListing] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  // for filter
  const [filters, setFilters] = useState({
    status: null,
    courseid: null,
    semesterid: null,
    subject: null,
    quizid: null,
    session: localStorage.getItem("session"),
  });
  const [show, setShow] = useState(false);
  const [filterStatus, setFilterStatus] = useState();
  const navigate = useNavigate();
  /**
 * ROLE & PERMISSION
 */
  const { RolePermission, hasPermission } = useRolePermission();
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Quiz", "list")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */

  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [subjectListing, setSubjectListing] = useState([]);
  const [quizListing, setQuizListing] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFilters = () => {
    setFilters({
      status: null,
      courseid: null,
      semesterid: null,
      subject: null,
      quizid: null,
      
    });
    fetchQuizListing({});
    setFilterStatus(null);
    handleClose();
  };

  const applyFilters = () => {
    fetchQuizListing(filters);
  };
  const [session,setSession] = useState([]);
  const sessionListDropdown = async () => {
    try {
      const { data } = await axios.post(`${NODE_API_URL}/api/session/fetch`, {
        status: 1,
        column: "id, dtitle",
      });
      data?.statusCode === 200 && data.data.length
        ? setSession(data.data) // Populate session list
        : (toast.error("Session not found."), setSession([])); // Error handling
    } catch {
      setSession([]); // Clear list on failure
    }
  };

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
    sessionListDropdown();
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
  const fetchTopicBasedOnCourseSemeterAndSubject = async (
    courseid,
    semesterid,
    subject
  ) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/quiz/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          subject: subject,
          column: "id, quiz_title",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setQuizListing(response.data);
      } else {
        toast.error("Quiz not found.");
        setQuizListing([]);
      }
    } catch (error) {
      setQuizListing([]);
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

  const fetchQuizListing = async (filters = {}, deleteStatus = 0) => {
    setIsFetching(true);
    const { status, courseid, semesterid, subject, quizid, session } = filters;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/quiz/fetch`,
        {
          status,
          courseid,
          semesterid,
          subject,
          quizid,
          deleteStatus,
          session,
          listing: "yes",
        }
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
    fetchQuizListing(filters);
  }, []);
  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    resetFilters();
    fetchQuizListing({}, recycleTitle === "Show Recycle Bin" ? 1 : 0);
  };

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
      const response = await dataFetchingPatch(
        `${NODE_API_URL}/api/quiz/status/${dbId}/${loguserid}/${login_type}`
      );
      if (response?.statusCode === 200) {
        toast.success(response.message);
        // Update the notice list to reflect the status change
        setSemesterSubjectListing((prevList) =>
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
  const deleteStatus = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    try {
      const deleteAlert = await DeleteSweetAlert(" ");
      if (deleteAlert) {
        const loguserid = secureLocalStorage.getItem("login_id");
        const login_type = secureLocalStorage.getItem("loginType");
        const response = await dataFetchingDelete(
          `${NODE_API_URL}/api/quiz/deleteStatus/${dbId}/${loguserid}/${login_type}`
        );
        if (response?.statusCode === 200) {
          toast.success(response.message);
          if (response.data == 1) {
            fetchQuizListing(filters, 1);
          } else {
            fetchQuizListing(filters, 0);
          }
          showRecyleBin();
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
  };
  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/edit-quiz/${dbId}`, { replace: false });
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                <a href="/admin/" className="breadcrumb-item">
                                     <i className="fas fa-home m-r-5" />
                                    Dashboard
                                   </a>
                                   <span className="breadcrumb-item active">
                                   Exam Management
                                   </span>
                  <span className="breadcrumb-item">Quiz</span>
                 
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Quiz List </h5>
                <div className="ml-auto">
                  <button
                    className="btn goback mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleShow}
                    >
                      <span>
                        <FaFilter /> 
                      </span>
                    </button>
                  {
                    hasPermission("Quiz", "create") && (
                      <Link
                        to={"/admin/quiz/add-new"}
                        className="ml-2 btn-md btn border-0 btn-secondary"
                      >
                        <i className="fas fa-plus" /> Add New
                      </Link>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* Search Box */}
                <div className="row">
                  <div className="col-md-7 col-lg-7 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                    {
                      hasPermission("Quiz", "recycle bin") && (
                        <button
                          className={`btn ${recycleTitle === "Show Recycle Bin"
                            ? "btn-secondary"
                            : "btn-danger"
                            }`}
                          onClick={showRecyleBin}
                        >
                          {recycleTitle} <i className="fa fa-recycle"></i>
                        </button>
                      )
                    }
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
                    <Column
                      body={(row) =>
                        capitalizeFirstLetter(row.quiz_title)
                      }
                      header="Quiz Name"
                      sortable
                      field="quiz_title"
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row.subjectname)}
                      header="Subject"
                      sortable
                      field="subjectname"
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row.semtitle)}
                      header="Semester"
                      sortable
                      field="semtitle"
                    />

                    <Column field="coursename" header="Course" sortable />
                    <Column
                      field="marks_per_question"
                      header="Marks Per Question"
                      sortable
                    />

                    <Column
                      field="number_of_question"
                      header="No. Of Question"
                      sortable
                    />
                    <Column field="total_marks" header="Total Marks" sortable />
                    <Column
                      field="duration_in_min"
                      body={(row) => parseInt(row.duration_in_min)}
                      header="Duration"
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
                    {
                      hasPermission("Quiz", "add question") && (
                        <Column
                          body={(row) => (
                            <Link
                              to={`/admin/quiz/add-question/${row.id}`}
                              className="btn btn-warning"
                              style={{ height: "auto", width: "130px" }}
                            >
                              Add Question
                            </Link>
                          )}
                          header="Add Question"
                        />
                      )
                    }
                    <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          {
                            hasPermission("Quiz", "status") && (
                              <div className="switch mt-1 w-auto">
                                <input
                                  type="checkbox"
                                  checked={rowData.status === 1} // This ensures the checkbox reflects the correct status
                                  onChange={() =>
                                    handleToggleStatus(rowData.id, rowData.status)
                                  } // Pass the id and current status
                                  className="facultydepartment-checkbox"
                                  id={`switch${rowData.id}`}
                                />
                                <label
                                  className="mt-0"
                                  htmlFor={`switch${rowData.id}`}
                                ></label>
                              </div>
                            )
                          }
                          {
                            hasPermission("Quiz", "update") && (
                              <div
                                onClick={() => updateDataFetch(rowData.id)}
                                className="avatar avatar-icon avatar-md avatar-orange"
                              >
                                <i className="fas fa-edit"></i>
                              </div>
                            )
                          }
                          {
                            (rowData.deleteStatus === 0 ?
                              hasPermission("Quiz", "delete") :
                              hasPermission("Quiz", "recycle bin")
                            ) && (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="button-tooltip-2">
                                    {rowData.deleteStatus === 0 ? 'Delete' : 'Restore'}
                                  </Tooltip>
                                }
                              >
                                <div className={`avatar ml-2 avatar-icon avatar-md ${rowData.deleteStatus === 0 ? 'avatar-red' : 'avatar-lime'}`}>
                                  <i
                                    className={rowData.deleteStatus === 0 ? 'fas fa-trash-alt' : 'fas fa-recycle'}
                                    onClick={() => deleteStatus(rowData.id)}
                                  ></i>
                                </div>
                              </OverlayTrigger>
                            )
                          }

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
            <div className="col-md-12 col-12 form-group">
                          <label className="font-weight-semibold">
                            Session 
                          </label>
                          <Select
                            options={session?.map(({ id, dtitle }) => ({
                              value: id,
                              label: dtitle,
                            }))}
                            onChange={({ value }) => {
                              setFilters({ ...filters, session: value });
                            }}
                            value={
                              session.find(
                                ({ id }) => id === +filters.session
                              )
                                ? {
                                    value: +filters.session,
                                    label: session.find(
                                      ({ id }) => id === +filters.session
                                    ).dtitle,
                                  }
                                : { value: filters.session, label: "Select" }
                            }
                          />
                        </div>
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
                      setFilters({
                        ...filters,
                        subject: selectedOption.value,
                      });
                      fetchTopicBasedOnCourseSemeterAndSubject(
                        filters.courseid,
                        filters.semesterid,
                        selectedOption.value
                      );
                    }}
                    value={
                      subjectListing.find((item) => item.id === filters.subject)
                        ? {
                          value: filters.subject,
                          label: capitalizeFirstLetter(
                            subjectListing.find(
                              (item) => item.id === filters.subject
                            ).subject
                          ),
                        }
                        : { value: filters.subject, label: "Select" }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Quiz</Form.Label>
                  <Select
                    options={quizListing.map((item) => ({
                      value: item.id,
                      label: capitalizeFirstLetter(item.quiz_title),
                    }))}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        quizid: selectedOption.value,
                      });
                    }}
                    value={
                      quizListing.find(
                        (item) => item.id === filters.quizid
                      )
                        ? {
                          value: filters.quizid,
                          label: capitalizeFirstLetter(
                            quizListing.find(
                              (item) => item.id === filters.quizid
                            ).quiz_title
                          ),
                        }
                        : { value: filters.quizid, label: "Select" }
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Status:</Form.Label>
                  <Select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e);
                      setFilters((prevState) => ({
                        ...prevState,
                        status: e.value,
                      }));
                    }}
                    options={[
                      { value: 1, label: "Active" },
                      { value: 0, label: "Inactive" },
                    ]}
                    placeholder="Select Status"
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
export default QuizList;
