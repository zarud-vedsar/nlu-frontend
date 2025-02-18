// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useRolePermission from "../../../../site-components/admin/useRolePermission";

function MarkAttendanceForm() {
  const initialForm = {
    course_id: "",
    semester_id: "",
    subject_id: "",
    session: localStorage.getItem("session"),
    date: new Date().toISOString().split("T")[0],
  };
  const [session, setSession] = useState([]); // Session data: the fuel for exams.
  const [filter, setFilter] = useState();
  const [formData, setFormData] = useState(initialForm); // Form state
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [subjectListing, setSubjectListing] = useState([]);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [studentListWithAttendance, setStudentListWithAttendance] = useState(
    []
  );
  /**
   * ROLE & PERMISSION
   */
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Mark Class Attendance", "mark attendance")) {
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

  useEffect(() => {
    sessionListDropdown(); // Fetch session list
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

  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  // Handle form submission
  const loadAttendanceList = async (e) => {
   if(e) e.preventDefault();
    setIsFetching(true);
    errorMsg("", "");

    if (!formData.course_id) {
      errorMsg("course_id", "Course is required.");
      toast.error("Course is required.");
      return setIsFetching(false);
    }

    if (!formData.semester_id) {
      errorMsg("semester_id", "Semester is required.");
      toast.error("Semester is required.");
      return setIsFetching(false);
    }

    if (!formData.subject_id) {
      errorMsg("subject_id", "Subject is required.");
      toast.error("Subject is required.");
      return setIsFetching(false);
    }
    if (!formData.date) {
      errorMsg("date", "Date is required.");
      toast.error("Date is required.");
      return setIsFetching(false);
    }

    try {
      let bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "get_student_list_by_semester_subject");
      bformData.append("course_id", formData?.course_id);
      bformData.append("semester_id", formData?.semester_id);
      bformData.append("subject_id", formData?.subject_id);
      bformData.append("session", formData?.session);
      bformData.append("date", formData?.date);

      const response = await axios.post(
        `${PHP_API_URL}/student_attendance.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200) {
        errorMsg("", "");
        setFilter({ ...formData });

        toast.success(response.data.msg);

        setStudentListWithAttendance(response?.data?.data);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      setStudentListWithAttendance([]);
      const status = error.response?.data?.status;
      const errorField = error.response?.data?.errorField;

      if (
        status === 400 ||
        status === 404 ||
        status === 500 ||
        status === 403
      ) {
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

  const convertToStructuredArray = (attendanceList) => {
    const result = {};

    const keys = Object.keys(attendanceList[0]);

    keys.forEach((key) => {
      result[key] = attendanceList.map((book) => book[key]);
    });

    return result;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    errorMsg("", "");

    if (!formData.course_id) {
      errorMsg("course_id", "Course is required.");
      toast.error("Course is required.");
      return setIsSubmit(false);
    }

    if (!formData.semester_id) {
      errorMsg("semester_id", "Semester is required.");
      toast.error("Semester is required.");
      return setIsSubmit(false);
    }

    if (!formData.subject_id) {
      errorMsg("subject_id", "Subject is required.");
      toast.error("Subject is required.");
      return setIsSubmit(false);
    }
    if (!formData.date) {
      errorMsg("date", "Date is required.");
      toast.error("Date is required.");
      return setIsSubmit(false);
    }

    if (studentListWithAttendance.length === 0) return;

    const updatedList = studentListWithAttendance.map((student) => ({
      ...student,
      attendance: student.attendance ?? "A",
      sessionsemester: student.sessionsemester,
    }));

    try {
      let bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "add_student_attendence");
      bformData.append("sessionsemester", updatedList[0].sessionsemester);

      Object.keys(formData).map((key) => {
        bformData.append(`${key}`, `${formData[key]}`);
      });

      const resArray = convertToStructuredArray(updatedList);

      const studentIdList = resArray["id"];
      studentIdList?.map((ele) => {
        bformData.append(`student_id[]`, ele);
      });

      const student_attencance = resArray["attendance"];
      student_attencance?.map((ele) => {
        bformData.append(`student_attencance[]`, ele);
      });

      const response = await axios.post(
        `${PHP_API_URL}/student_attendance.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200) {
        errorMsg("", "");
        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      const errorField = error.response?.data?.errorField;

      if (status === 400 || status === 404 || status === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.msg);
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };

 

  const markAll = (value) => {
    const updatedAttendanceList = studentListWithAttendance.map((student) => ({
      ...student,
      attendance: value,
    }));
    setStudentListWithAttendance(updatedAttendanceList);
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
                                   Attendance Management
                                   </span>
                  <span className="breadcrumb-item">Mark Class Attendance</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Mark Class Attendance</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/student-management/attendance-history">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-list"></i> Attendance History
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={loadAttendanceList}>
                      <div className="row">
                        <div className="col-md-4 col-12 form-group">
                          <label className="font-weight-semibold">
                            Session <span className="text-danger">*</span>
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
                        <div className="col-md-4 col-12 form-group">
                          <label
                            className="font-weight-semibold"
                            htmlFor="course_id"
                          >
                            Course <span className="text-danger">*</span>
                          </label>
                          <Select
                            id="course_id"
                            options={courseListing.map((item) => ({
                              value: item.id,
                              label: item.coursename,
                              year: item.duration,
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                course_id: selectedOption.value,
                              });
                              fetchSemesterBasedOnCourse(selectedOption.value);
                            }}
                            value={
                              courseListing.find(
                                (item) =>
                                  item.id === parseInt(formData.course_id)
                              )
                                ? {
                                    value: parseInt(formData.course_id),
                                    label: courseListing.find(
                                      (item) =>
                                        item.id === parseInt(formData.course_id)
                                    ).coursename,
                                  }
                                : { value: formData.course_id, label: "Select" }
                            }
                          />

                          {error.field === "course_id" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-4 col-12 form-group">
                          <label
                            className="font-weight-semibold"
                            htmlFor="semesterid"
                          >
                            Semester <span className="text-danger">*</span>
                          </label>
                          <Select
                            id="semester_id"
                            options={semesterListing.map((item) => ({
                              value: item.id,
                              label: capitalizeFirstLetter(item.semtitle),
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                semester_id: selectedOption.value,
                                subject_id: "",
                              });
                              fetchSubjectBasedOnCourseAndSemeter(
                                formData.course_id,
                                selectedOption.value
                              );
                            }}
                            value={
                              semesterListing.find(
                                (item) => item.id === formData.semester_id
                              )
                                ? {
                                    value: formData.semester_id,
                                    label: capitalizeFirstLetter(
                                      semesterListing.find(
                                        (item) =>
                                          item.id === formData.semester_id
                                      ).semtitle
                                    ),
                                  }
                                : {
                                    value: formData.semester_id,
                                    label: "Select",
                                  }
                            }
                          />
                          {error.field === "semester_id" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-3 col-12 form-group">
                          <label
                            className="font-weight-semibold"
                            htmlFor="subject_id"
                          >
                            Subject <span className="text-danger">*</span>
                          </label>
                          <Select
                            id="subject_id"
                            options={subjectListing.map((item) => ({
                              value: item.id,
                              label: capitalizeFirstLetter(item.subject),
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                subject_id: selectedOption.value,
                              });
                            }}
                            value={
                              subjectListing.find(
                                (item) => item.id === formData.subject_id
                              )
                                ? {
                                    value: formData.subject_id,
                                    label: capitalizeFirstLetter(
                                      subjectListing.find(
                                        (item) =>
                                          item.id === formData.subject_id
                                      ).subject
                                    ),
                                  }
                                : {
                                    value: formData.subject_id,
                                    label: "Select",
                                  }
                            }
                          />
                          {error.field === "subject_id" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="form-group col-md-3 col-12">
                          <label htmlFor="date">
                            Date <span className="text-danger">*</span>
                          </label>
                          <input
                            id="date"
                            type="date"
                            className="form-control"
                            name="date"
                            value={
                              formData.date
                                ? new Date(formData.date)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {

                              const selectedDate = e.target.value;

                        const today = new Date();
                        const yesterday = new Date();

                        yesterday.setDate(yesterday.getDate() - 1);

                        const minDate = yesterday.toISOString().split("T")[0];
                        const maxDate = today.toISOString().split("T")[0];

                        const validDate =
                          selectedDate >= minDate && selectedDate <= maxDate
                            ? selectedDate
                            : maxDate;

                              setFormData({
                                ...formData,
                                date: validDate,
                              });
                            }}
                          />
                          {error.field === "date" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-12 col-lg-12 col-12">
                          {!isFetching ? (
                            <button
                              className="btn btn-dark  d-flex justify-content-center align-items-center"
                              type="submit"
                            >
                              Fetch{" "}
                            </button>
                          ) : (
                            <button
                              className="btn btn-dark  d-flex justify-content-center align-items-center"
                              type="submit"
                              disabled
                            >
                              Loading &nbsp;{" "}
                              <div className="loader-circle"></div>
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className={` ${isFetching ? "form" : ""}`}>
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Enrollment No.</th>
                            <th>Name</th>
                            
                            <th>Attendance</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentListWithAttendance.length > 0 ? (
                            studentListWithAttendance.map((row, index) => (
                              <tr key={row.id}>
                                <td>{index + 1}</td>
                                <td>
                                  {capitalizeFirstLetter(row?.enrollmentNo)}
                                </td>
                                <td>{capitalizeFirstLetter(row?.sname)}</td>
                                
                                <td>
                                  <Select
                                  isDisabled={row.attendance==="CC"}
                                    value={
                                      [
                                        { value: "P", label: "Present" },
                                        { value: "A", label: "Absent" },
                                        { value: "OD", label: "On Duty" },
                                        { value: "CC", label: "Class Cancel" },
                                      ].find(
                                        (item) => item.value === row.attendance
                                      ) || {
                                        value: "select",
                                        label: "Select Status",
                                      }
                                    }
                                    onChange={(selectedOption) => {
                                      const updatedAttendanceList =
                                        studentListWithAttendance.map(
                                          (student) =>
                                            student.id === row.id
                                              ? {
                                                  ...student,
                                                  attendance:
                                                    selectedOption.value,
                                                  sessionsemester:
                                                    row.sessionsemester,
                                                }
                                              : student
                                        );
                                      setStudentListWithAttendance(
                                        updatedAttendanceList
                                      );
                                    }}
                                    options={[
                                      { value: "P", label: "Present" },
                                      { value: "A", label: "Absent" },
                                      { value: "OD", label: "On Duty" },
                                      
                                    ]}
                                    placeholder="Select Status"
                                  />
                                </td>
                                <td>
                                  {row?.attendance === "P" ? (
                                    <div className="badge badge-success">
                                      Present
                                    </div>
                                  ) : row?.attendance === "A" ? (
                                    <div className="badge badge-danger">
                                      Absent
                                    </div>
                                  ) : row?.attendance === "OD" ? (
                                    <div className="badge badge-warning">
                                      Warning
                                    </div>
                                  ) : row?.attendance === "CC" ? (
                                    <div className="badge badge-secondary">
                                      Class Cancel
                                    </div>
                                  ) : (
                                    <div className="badge badge-light">
                                      Not Marked
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center">
                                No records found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="row ">
                        {studentListWithAttendance.length > 0 && (
                          <div className="col-12 d-flex justify-content-between">
                            <div>
                              <button
                                className="btn btn-success mr-2"
                                onClick={() => markAll("P")}
                              >
                                Mark All Present
                              </button>

                              <button
                                className="btn btn-danger mr-2"
                                onClick={() => markAll("A")}
                              >
                                Mark All Absent
                              </button>

                              <button
                                className="btn btn-warning mr-2"
                                onClick={() => markAll("OD")}
                              >
                                Mark All On Duty
                              </button>
                              <button
                                className="btn btn-secondary mr-2"
                                onClick={() => markAll("CC")}
                              >
                                Mark Class Cancel
                              </button>
                            </div>
                            <div className="d-flex">
                            {!isFetching ? (
                            <button
                              className="btn btn-primary   mr-2"
                              onClick={loadAttendanceList}
                            >
                              Reset{" "}
                            </button>
                          ) : (
                            <button
                              className="btn btn-dark  "
                              type="submit"
                              disabled
                            >
                              Loading &nbsp;{" "}
                              <div className="loader-circle"></div>
                            </button>
                          )}
                              {!isSubmit ? (
                                <button
                                  className="btn btn-secondary d-flex justify-content-center align-items-center mr-2"
                                  onClick={handleSubmit}
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  className="btn btn-secondary d-flex justify-content-center align-items-center mr-2"
                                  disabled
                                >
                                  Saving &nbsp;
                                  <div className="loader-circle"></div>
                                </button>
                              )}{" "}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default MarkAttendanceForm;
