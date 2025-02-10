// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  FILE_API_URL,
  NODE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
  capitalizeEachLetter,
} from "../../site-components/Helper/HelperFunction";
import "../../../node_modules/primeicons/primeicons.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import secureLocalStorage from "react-secure-storage";
import { FormField } from "../../site-components/admin/assets/FormField";

function UserLogList() {
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
      const bformData = new FormData();
      bformData.append("data", "load_log");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      const response = await axios.post(`${PHP_API_URL}/log.php`, bformData);
      console.log(response);
      if (response.data?.status === 200 && response.data.data.length > 0) {
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
                  <span className="breadcrumb-item active">User Log</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new"> User Log</h5>
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
                <h6 className="h6_new card-title">Filter Record</h6>
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
                                      label: `${student.sname} (${student.registrationNo})`,
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
                    <div className="col-md-3 col-lg-3 col-12 form-group">
                      <label className="font-weight-semibold">Log Type</label>

                      <Select
                        options={[
                          "login",
                          "create",
                          "update",
                          "delete",
                          "status",
                          "failed",
                        ].map((log) => ({
                          value: log,
                          label: capitalizeEachLetter(log),
                        }))}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            log: e.value,
                          }))
                        }
                        value={
                          formData.log
                            ? {
                                value: formData.log,
                                label:
                                  
                                  [
                                    "login",
                                    "create",
                                    "update",
                                    "delete",
                                    "status",
                                    "failed",
                                  ].find(
                                    (log) =>
                                      log === formData.log
                                  ).log
                                    ? `${
                                        [
                                            "login",
                                            "create",
                                            "update",
                                            "delete",
                                            "status",
                                            "failed",
                                          ].find(
                                          (log) =>
                                            log ===
                                            formData.log
                                        ).log
                                      }`
                                    : "Select",
                              }
                            : { value: "", label: "Select" }
                        }
                      />
                    </div>

                    <FormField
                      label="From Date"
                      name="start_date"
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      column="col-md-2 col-lg-2"
                      disabled={true}
                    />
                    <FormField
                      label="To Date"
                      name="end_date"
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      column="col-md-2 col-lg-2"
                      disabled={true}
                    />

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
                        body={(row) => capitalizeFirstLetter(row.username)}
                        header="User"
                        sortable
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.user_type)}
                        header="User Type"
                        sortable
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.log_type)}
                        header="Log Type"
                        sortable
                      />
                      <Column
                        body={(row) => row.ip_address}
                        header="IP Address"
                        sortable
                      />
                      <Column
                        header="Log Detail"
                        body={(row) => capitalizeFirstLetter(row.log_details)}
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
export default UserLogList;
