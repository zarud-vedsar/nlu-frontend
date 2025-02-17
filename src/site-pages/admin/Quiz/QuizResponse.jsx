// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { FILE_API_URL, NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,

} from "../../../site-components/Helper/HelperFunction";
import "../../../../node_modules/primeicons/primeicons.css";
import secureLocalStorage from "react-secure-storage";
import { PHP_API_URL } from "../../../site-components/Helper/Constant";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import useRolePermission from "../../../site-components/admin/useRolePermission";
function QuizResponse() {
  const [showFilter, setShowFilter] = useState(true);
  const [applicationList, setQuizResponseList] = useState([]);
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [isFetching, setIsFetching] = useState(false);
  const [subjectListing, setSubjectListing] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state

  const initialData = {
    courseid: null,
    semesterid: null,
    enrollment_no: null,
  };
  const [formData, setFormData] = useState(initialData);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  /**
 * ROLE & PERMISSION
 */
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Quiz Response", "list")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */

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

  const fetchAllQuizusingResponsePhp = async () => {
    setIsFetching(true);
    if (!formData?.courseid) {
      toast.error("Please select course");
      return setIsFetching(false);
    }
    if (!formData?.semesterid) {
      toast.error("Please select semester");
      return setIsFetching(false);
    }
    if (!formData?.subject) {
      toast.error("Please select subject");
      return setIsFetching(false);
    }
    try {
      let bformData = new FormData();

      bformData.append("data", "quiz_response_load");
      bformData.append("courseid", formData?.courseid);
      bformData.append("semesterid", formData?.semesterid);
      bformData.append("subject", formData?.subject);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      

      const response = await axios.post(
        `${PHP_API_URL}/quiz.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200 && response.data.data.length > 0) {
        // toast.success(response?.data?.msg);
        setQuizResponseList(response?.data?.data);
      } else {
        setQuizResponseList([]);
      }
    } catch (error) {
      setQuizResponseList([]);
      if (
        error?.response?.data?.status === 400 ||
        error?.response?.data?.status === 404 ||
        error?.response?.data?.status === 500
      ) {
        toast.error(error?.response?.data?.msg);
      }
    } finally {
      setIsFetching(false);
    }
  };

  const resetFilter = () => {
    setFormData(initialData);
    setSemesterListing([]);
    setQuizResponseList([]);
  };
  const exportExcelFile = async () => {
    setIsFetching(true);
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "student_by_course_sem");
      bformData.append("courseid", formData?.courseid);
      bformData.append("semesterid", formData?.semesterid);

      

      const response = await axios.post(
        `${PHP_API_URL}/report.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);

        if (response?.data?.status === 201) {
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      const errorField = error.response?.data?.errorField;

      if (status === 400 || status === 401 || status === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.msg);
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsFetching(false);
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
                    <i className="fas fa-home m-r-5" /> Exam Management
                  </a>
                  <span className="breadcrumb-item active">
                    Quiz Response
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Quiz Response</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                </div>
                <button
                  className="btn btn-secondary "
                  onClick={exportExcelFile}
                >
                  Export
                </button>
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
                <div className="row">
                  <div className="col-md-4 col-lg-4 col-12 form-group">
                    <label className="font-weight-semibold">
                      Course <span className="text-danger">*</span>
                    </label>
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
                        fetchSemesterBasedOnCourseAndYear(selectedOption.value);
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

                  <div className="col-md-4 col-lg-4 col-12 form-group">
                    <label className="font-weight-semibold">
                      Semester <span className="text-danger">*</span>
                    </label>
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
                        fetchSubjectBasedOnCourseAndSemeter(
                          formData.courseid,
                          selectedOption.value
                        );
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
                  <div className="form-group col-md-4 col-lg-4 col-12">
                    <label>
                      Subject <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={subjectListing.map((item) => ({
                        value: item.id,
                        label: capitalizeFirstLetter(item.subject),
                      }))}
                      onChange={(selectedOption) => {
                        // Handle single selection for subject
                        setFormData({
                          ...formData,
                          subject: selectedOption ? selectedOption.value : null,
                        });
                      }}
                      value={
                        subjectListing
                          .filter((item) => item.id === formData.subject)
                          .map((item) => ({
                            value: item.id,
                            label: capitalizeFirstLetter(item.subject),
                          }))[0] || null
                      }
                    />
                    {error.field === "subject" && (
                      <span className="text-danger">{error.msg}</span>
                    )}
                  </div>

                  <div className="col-12 d-flex  mt-2">
                    <button
                      disabled={isFetching}
                      className="btn btn-dark mr-2"
                      type="submit"
                      onClick={fetchAllQuizusingResponsePhp}
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
              </div>
            </div>
            <div className="card">
              <div className="card-body">
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
                      globalFilter={globalFilter}
                    >
                      <Column
                        body={(row, { rowIndex }) => rowIndex + 1}
                        header="#"
                        sortable
                      />
                      <Column
                        body={(row) =>
                          capitalizeFirstLetter(
                            row.enrollmentNo || "enrollmentNo"
                          )
                        }
                        header="Enrollment No."
                        sortable
                      />

                      <Column
                        header="Student Info"
                        body={(rowData) => (
                          <div
                            className="info-column d-flex align-items-center
                    "
                          >
                            <div className="info-image mr-4">
                              {rowData.spic ? (
                                <img
                                  src={`${FILE_API_URL}/student/${rowData?.sid}${rowData.registrationNo}/${rowData.spic}`}
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
                                  {rowData?.sname ? rowData?.sname[0] : "n"}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="info-name">
                                <span>{`${rowData.sname || "data"}`}</span>
                              </div>

                              <div className="info-email">
                                <span>{rowData.semail || "email"}</span>
                              </div>
                              <div className="info-phone">
                                <span>{rowData.sphone || "data"}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        sortable
                      />

                      <Column
                        body={(row) =>
                          capitalizeFirstLetter(row.quiz_title)
                        }
                        header="Assingment Title"
                        sortable
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.question_type)}
                        header="Assingment Type"
                        sortable
                      />

                      <Column
                        header="Submission Date"
                        body={(row) => formatDate(row.submission_date)}
                        sortable
                      />
                      <Column
                        body={(row) => parseInt(row.marks)}
                        header="Marks"
                        sortable
                      />

                      <Column
                        header="Action"
                        body={(rowData) => (
                          <div className="d-flex justify-content-center">
                            <Link
                              to={`/admin/quiz-response-view/${rowData.id}`}
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
export default QuizResponse;
