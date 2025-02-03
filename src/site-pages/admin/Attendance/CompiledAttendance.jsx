// Import the usual suspects (like a hacker assembling a team for a heist)
import React, { useEffect, useState } from "react"; // React is life; state is chaos.
import { Link, useLocation, useNavigate } from "react-router-dom"; // For navigating the matrix.
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction"; // Escape hatch in case things go south.
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../site-components/Helper/Constant"; // The secret base URL we talk to.
import { toast } from "react-toastify"; // Toasts: because why suffer in silence when you can pop a notification?
import secureLocalStorage from "react-secure-storage"; // Encryption? Check. Security? Double-check.
import axios from "axios"; // Axios is like the courier for your HTTP requests.
import Select from "react-select"; // React Select
import useRolePermission from "../../../site-components/admin/useRolePermission";
function AddExam() {
  const location = useLocation();
  const dbId = location?.state?.dbId; // Destructure dbId from the state
  const [session, setSession] = useState([]); // Session data: the fuel for exams.
  const [courseList, setCourseList] = useState([]); // Courses: pick your poison.
  const [semesterList, setSemesterList] = useState([]); // Semesters: time is a flat circle.
  const [subjectList, setSubjectList] = useState([]); // Subjects: the reason we're here.
  const [admitForm, setAdmitForm] = useState({
    session: "",
    course_id: "",
    semester_id: "",
    subject_id: "",
  });
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  /**
 * ROLE & PERMISSION
 */
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Compile Class Attendance", "create")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */

  /**
   * API Fetching Functions
   */
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
  // Fetch and set the course list for the dropdown
  const courseListDropdown = async () => {
    try {
      const { data } = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
      data?.statusCode === 200 && data.data.length
        ? setCourseList(data.data) // Populate course list
        : (toast.error("Course not found."), setCourseList([])); // Error handling
    } catch {
      setCourseList([]); // Clear list on failure
    }
  };
  useEffect(() => {
    sessionListDropdown(); // Fetch session list
    courseListDropdown(); // Fetch course list
  }, []);
  useEffect(() => {
    if (admitForm.course_id) fetchSemesterBasedOnCourse(admitForm.course_id); // Fetch semester list on course change
  }, [admitForm.course_id]);
  // Fetch and set the semester list based on the selected course
  const fetchSemesterBasedOnCourse = async (courseid) => {
    if (!+courseid || +courseid <= 0) return toast.error("Invalid course ID."); // Validate course ID

    try {
      const { data, statusCode } = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          courseid,
          column: "id, semtitle",
        }
      );

      statusCode === 200 && data.length
        ? setSemesterList(data) // Populate semester list
        : (toast.error("Semester not found."), setSemesterList([])); // Error handling
    } catch ({ response }) {
      setSemesterList([]); // Clear list on error
      const { statusCode, message } = response?.data || {};
      toast.error(
        [400, 401, 500].includes(statusCode)
          ? message || "Server error."
          : "Connection error."
      );
    }
  };
  // Fetch subjects based on course and semester
  const fetchSubjectBasedOnCourseAndSemester = async (courseid, semesterid) => {
    if (!+courseid || +courseid <= 0) return toast.error("Invalid course ID."); // Validate course ID

    try {
      const { data, statusCode } = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        { courseid, semesterid, column: "id, subject" }
      );

      statusCode === 200 && data.length
        ? setSubjectList(data) // Populate subject list
        : (toast.error("Subjects not found."), setSubjectList([])); // Handle empty result
    } catch ({ response }) {
      setSubjectList([]); // Clear list on error
      toast.error(
        [400, 401, 500].includes(response?.data?.statusCode)
          ? response?.data?.message || "Server error."
          : "Connection error. Please try again."
      );
    }
  };
  useEffect(() => {
    if (admitForm.course_id && admitForm.semester_id)
      fetchSubjectBasedOnCourseAndSemester(
        admitForm.course_id,
        admitForm.semester_id
      ); // Fetch subject list on course and semester change
  }, [admitForm.course_id, admitForm.semester_id]);
  const compileAttendanceSubmit = async () => {
    setIsSubmit(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "compile_attendance");
      bformData.append("session", admitForm.session);
      bformData.append("course_id", admitForm.course_id);
      bformData.append("semester_id", admitForm.semester_id);
      bformData.append("subject_id", admitForm.subject_id);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/student_attendance.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
        if (response.data.status === 201) {
          setAdmitForm({
            session: "",
            course_id: "",
            semester_id: "",
            subject_id: "",
          });
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
      setIsSubmit(false);
    } finally {
      setIsSubmit(false);
    }
  };
  return (
    <>
      {/* HTML Skeleton of Doom */}
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                {/* Breadcrumbs: because getting lost is easy */}
                <nav className="breadcrumb breadcrumb-dash">
                  <Link to="/admin/" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </Link>
                  <span className="breadcrumb-item">Attendance Management</span>
                  <span className="breadcrumb-item active">
                    Compiled Attendance
                  </span>
                </nav>
              </div>
            </div>
            {/* Main Content Starts Here */}
            <div className="card border-0 bg-transparent mb-0">
              <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title h6_new font-16">
                  Compiled Attendance
                </h5>
                <div className="ml-auto">
                  {/* The almighty 'Go Back' button */}
                  <button className="btn goback" onClick={goBack}>
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 col-12 form-group">
                        <label className="font-weight-semibold">
                          Session <span className="text-danger">*</span>
                        </label>
                        <Select
                          options={session.map(({ id, dtitle }) => ({
                            value: id,
                            label: dtitle,
                          }))}
                          onChange={({ value }) => {
                            setAdmitForm({ ...admitForm, session: value });
                            fetchSemesterBasedOnCourse(value);
                          }}
                          value={
                            session.find(({ id }) => id === +admitForm.session)
                              ? {
                                value: +admitForm.session,
                                label: session.find(
                                  ({ id }) => id === +admitForm.session
                                ).dtitle,
                              }
                              : { value: admitForm.session, label: "Select" }
                          }
                        />
                      </div>
                      <div className="col-md-12 col-12 form-group">
                        <label className="font-weight-semibold">
                          Course <span className="text-danger">*</span>
                        </label>
                        <Select
                          options={courseList.map(({ id, coursename }) => ({
                            value: id,
                            label: coursename,
                          }))}
                          onChange={({ value }) => {
                            setAdmitForm({ ...admitForm, course_id: value });
                            fetchSemesterBasedOnCourse(value);
                          }}
                          value={
                            courseList.find(
                              ({ id }) => id === +admitForm.course_id
                            )
                              ? {
                                value: +admitForm.course_id,
                                label: courseList.find(
                                  ({ id }) => id === +admitForm.course_id
                                ).coursename,
                              }
                              : { value: admitForm.course_id, label: "Select" }
                          }
                        />
                      </div>
                      <div className="col-md-12 col-12 form-group">
                        <label className="font-weight-semibold">
                          Semester <span className="text-danger">*</span>
                        </label>
                        <Select
                          options={semesterList.map(({ id, semtitle }) => ({
                            value: id,
                            label: capitalizeFirstLetter(semtitle),
                          }))}
                          onChange={({ value }) => {
                            setAdmitForm({ ...admitForm, semester_id: value });
                            fetchSubjectBasedOnCourseAndSemester(
                              admitForm.course_id,
                              value
                            );
                          }}
                          value={
                            semesterList.find(
                              ({ id }) => id === admitForm.semester_id
                            )
                              ? {
                                value: admitForm.semester_id,
                                label: capitalizeFirstLetter(
                                  semesterList.find(
                                    ({ id }) => id === admitForm.semester_id
                                  ).semtitle
                                ),
                              }
                              : {
                                value: admitForm.semester_id,
                                label: "Select",
                              }
                          }
                        />
                      </div>
                      <div className="col-md-12 col-12 form-group">
                        <label className="font-weight-semibold">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <Select
                          options={subjectList.map(({ id, subject }) => ({
                            value: id,
                            label: capitalizeFirstLetter(subject),
                          }))}
                          onChange={({ value }) =>
                            setAdmitForm({ ...admitForm, subject_id: value })
                          }
                          value={
                            subjectList.find(
                              ({ id }) => id === admitForm.subject_id
                            )
                              ? {
                                value: admitForm.subject_id,
                                label: capitalizeFirstLetter(
                                  subjectList.find(
                                    ({ id }) => id === admitForm.subject_id
                                  ).subject
                                ),
                              }
                              : { value: admitForm.subject_id, label: "Select" }
                          }
                        />
                      </div>
                      <div className="col-md-12 col-12">
                        <button
                          onClick={compileAttendanceSubmit}
                          className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                          type="submit"
                        >
                          Compile {" "}
                          {isSubmit && (
                            <>
                              &nbsp;<div className="loader-circle"></div>
                            </>
                          )}
                        </button>
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

export default AddExam;
