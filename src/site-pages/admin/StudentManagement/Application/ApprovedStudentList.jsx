// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { FILE_API_URL, NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
  capitalizeEachLetter,
} from "../../../../site-components/Helper/HelperFunction";
import "../../../../../node_modules/primeicons/primeicons.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";

function ApprovedStudentList() {
  const [showFilter, setShowFilter] = useState(true);
  const [applicationList, setApplicationListing] = useState([]);
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [isFetching, setIsFetching] = useState(false);

  const initialData = {
    courseid: null,
    semesterid: null,
    studentId: null,
    session: localStorage.getItem("session"),
  };

  const [formData, setFormData] = useState(initialData);

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
    handleSubmit();
    sessionListDropdown();
  }, []);

  const fetchSemesterBasedOnCourseAndYear = async (courseid) => {
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

  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();
    setApplicationListing([]);
    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/getAllAprovedStudent`,
        {
          ...formData,
        }
      );
      console.log(response);
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setApplicationListing(response?.data?.data);
      } else {
        setApplicationListing([]);
      }
    } catch (error) {
      setApplicationListing([]);
    } finally {
      setIsFetching(false);
    }
  };

  const resetFilter = () => {
    setFormData(initialData);
    setSemesterListing([]);
    handleSubmit();
  };

  const [session, setSession] = useState([]);
  // Fetch and set the session list for the dropdown
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
                  <span className="breadcrumb-item">Student Management</span>
                  <span className="breadcrumb-item active">
                    Approved Student List
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new"> Approved Student List</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center position-relative py-0 px-3">
                <h6 className="h6_new card-title">Filter Records</h6>
                <button
                  className="btn btn-info"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  {showFilter ? (
                    <i className="fas fa-times" />
                  ) : (
                    <i className="fas fa-filter" />
                  )}
                </button>
              </div>
              <div className={`card-body px-3 ${showFilter ? "" : "d-none"}`}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3 col-12 form-group">
                      <label className="font-weight-semibold">
                        Session 
                      </label>
                      <Select
                        options={session.map(({ id, dtitle }) => ({
                          value: id,
                          label: dtitle,
                        }))}
                        onChange={({ value }) => {
                          setFormData({ ...formData, session: value });
                        }}
                        value={
                          session.find(({ id }) => id === +formData.session)
                            ? {
                                value: +formData.session,
                                label: session.find(
                                  ({ id }) => id === +formData.session
                                ).dtitle,
                              }
                            : { value: formData.session, label: "Select" }
                        }
                      />
                    </div>

                    <div className="col-md-3 col-lg-3 col-12 form-group">
                      <label className="font-weight-semibold">Course</label>
                      <Select
                        options={courseListing.map((item) => ({
                          value: item.id,
                          label: item.coursename,
                          year: item.duration,
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            courseid: selectedOption.value,
                          });
                          fetchSemesterBasedOnCourseAndYear(
                            selectedOption.value
                          );
                        }}
                        value={
                          courseListing.find(
                            (item) => item.id === parseInt(formData.courseid)
                          )
                            ? {
                                value: parseInt(formData.courseid),
                                label: courseListing.find(
                                  (item) =>
                                    item.id === parseInt(formData.courseid)
                                ).coursename,
                              }
                            : { value: formData.courseid, label: "Select" }
                        }
                      />
                    </div>

                    <div className="col-md-3 col-lg-3 col-12 form-group">
                      <label className="font-weight-semibold">Semester</label>
                      <Select
                        options={semesterListing.map((item) => ({
                          value: item.id,
                          label: capitalizeFirstLetter(item.semtitle),
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            semesterid: selectedOption.value,
                          });
                        }}
                        value={
                          semesterListing.find(
                            (item) => item.id === formData.semesterid
                          )
                            ? {
                                value: formData.semesterid,
                                label: capitalizeFirstLetter(
                                  semesterListing.find(
                                    (item) => item.id === formData.semesterid
                                  ).semtitle
                                ),
                              }
                            : {
                                value: formData.semesterid,
                                label: "Select",
                              }
                        }
                      />
                    </div>

                    <div className="col-md-3 col-lg-3 col-12 form-group">
                      <label className="font-weight-semibold">
                        Select Student
                      </label>

                      <Select
                        options={
                          applicationList
                            ? [
                                ...new Map(
                                  applicationList.map((student) => [
                                    student.studentId,
                                    {
                                      value: student.studentId,
                                      label: `${student.sname} (${student.enrollmentNo})`,
                                    },
                                  ])
                                ).values(),
                              ]
                            : []
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            studentId: e.value,
                          }))
                        }
                        value={
                          formData.studentId
                            ? {
                                value: formData.studentId,
                                label:
                                  applicationList &&
                                  applicationList.find(
                                    (student) =>
                                      student.studentId === formData.studentId
                                  )
                                    ? `${
                                        applicationList.find(
                                          (student) =>
                                            student.studentId ===
                                            formData.studentId
                                        ).sname
                                      } (${
                                        applicationList.find(
                                          (student) =>
                                            student.studentId ===
                                            formData.studentId
                                        ).enrollmentNo
                                      })`
                                    : "Select",
                              }
                            : { value: "", label: "Select" }
                        }
                      />
                    </div>

                    <div className="col-12 d-flex  mt-2">
                      <button
                        disabled={isFetching}
                        className="btn btn-dark mr-2"
                        type="submit"
                      >
                        Search{" "}
                        {isFetching && (
                          <>
                            &nbsp; <div className="loader-circle"></div>
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-secondary "
                        onClick={resetFilter}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* Search Box */}

                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  {applicationList.length > 0 ? (
                    <DataTable
                      value={applicationList}
                      removableSort
                      paginator
                      rows={10}
                      rowsPerPageOptions={[10, 25, 50]}
                      emptyMessage="No records found"
                      className="p-datatable-custom"
                      tableStyle={{ minWidth: "50rem" }}
                      sortMode="multiple"
                    >
                      <Column
                        body={(row, { rowIndex }) => rowIndex + 1}
                        header="#"
                        sortable
                      />
                      <Column
                        body={(row) =>
                          capitalizeFirstLetter(row.registrationNo)
                        }
                        header="Reg. No."
                        sortable
                      />

                      <Column
                        header="Student"
                        body={(rowData) => (
                          <div
                            className="info-column d-flex align-items-center
                    "
                          >
                            <div className="info-image mr-4">
                              {rowData.avtar ? (
                                <img
                                  src={`${FILE_API_URL}/student/${rowData.registrationNo}/${rowData.spic}`}
                                  alt=""
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className="rounded-circle d-flex justify-content-center align-items-center"
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className="rounded-circle d-flex justify-content-center align-items-center"
                                >
                                  {rowData?.sname[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="info-name">
                                <span>{`${rowData.sname}`}</span>
                              </div>

                              <div className="info-email">
                                <span>{rowData.semail}</span>
                              </div>
                              <div className="info-phone">
                                <span>{rowData.sphone}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        sortable
                      />
                      <Column
                        body={(row) => formatDate(row.sdob)}
                        header="DOB"
                        sortable
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.sgender)}
                        header="Gender"
                        sortable
                      />
                      <Column
                        header="Category"
                        body={(row) => capitalizeEachLetter(row.scategory)}
                        sortable
                      />
                      <Column
                        header="Reg Date"
                        body={(row) => formatDate(row.created_at)}
                        sortable
                      />

                      <Column
                        body={(row) => capitalizeFirstLetter(row.coursename)}
                        header="Course"
                        sortable
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.semtitle)}
                        header="Semester"
                        sortable
                      />
                      <Column
                        body={(row) => (
                          <>
                            {row.approved === 0 && (
                              <div className="badge badge-warning">Pending</div>
                            )}
                            {row.approved === 1 && (
                              <div className="badge badge-success">
                                Accepted
                              </div>
                            )}
                            {row.approved === 2 && (
                              <div className="badge badge-danger">Rejected</div>
                            )}
                          </>
                        )}
                        header="Status"
                        sortable
                      />

                      <Column
                        header="Action"
                        body={(rowData) => (
                          <div className="d-flex justify-content-center">
                            <Link
                              to={`/admin/view-addmission-application/${rowData.studentId}`}
                              className="avatar avatar-icon avatar-md avatar-orange"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                          </div>
                        )}
                      />
                    </DataTable>
                  ) : (
                    <>
                      <div className="col-md-12 alert alert-danger">
                        Data not available
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ApprovedStudentList;
