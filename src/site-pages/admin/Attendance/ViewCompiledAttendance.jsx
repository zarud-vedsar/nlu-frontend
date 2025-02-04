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
import { Modal, Button } from "react-bootstrap";
import useRolePermission from "../../../site-components/admin/useRolePermission";

const ExemptModal = (props = {}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const initializationForm = {
    sessionsemester: null,
    student_id: null,
    remark: null,
    exam_term: "mid_term",
  };
  const [detail, setDetail] = useState(initializationForm);

  useEffect(() => {
    setDetail((prev) => ({
      ...prev,
      student_id: props?.selectedStudentDetail?.student_id,
      sessionsemester: props?.selectedStudentDetail?.session_semester,
    }));
  }, [props?.selectedStudentDetail]);
  const exemptStudentSubmit = async () => {
    setIsSubmit(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "exempt_attendance");

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("sessionsemester", detail?.sessionsemester);
      bformData.append("student_id", detail?.student_id);
      bformData.append("exam_term", detail?.exam_term);
      if (detail?.remark) {
        bformData.append("remark", detail?.remark);
      }

      const response = await axios.post(
        `${PHP_API_URL}/student_attendance.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
        setDetail(initializationForm);
        props?.close();
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
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add New</Modal.Title>
      </Modal.Header> */}
        <Modal.Body>
          <div className="form-group col-md-12">
            <label className="font-weight-semibold">
              Exam Term <span className="text-danger">*</span>
            </label>
            <select
              name="exam_term"
              id="exam_term"
              className="form-control"
              value={detail?.exam_term}
              onChange={(e) =>
                setDetail((prev) => ({ ...prev, exam_term: e.target.value }))
              }
            >
              <option value="mid_term">Mid Term</option>
              <option value="end_term">End Term</option>
            </select>
          </div>
          <div className="form-group col-md-12">
            <label className="font-weight-semibold">Remark</label>
            <textarea
              name="remark"
              id="remark"
              className="form-control"
              value={detail?.remark}
              onChange={(e) =>
                setDetail((prev) => ({ ...prev, remark: e.target.value }))
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="mx-auto">
            <Button
              onClick={props.close}
              className="btn btn-outline-dark"
              disabled={isSubmit}
            >
              Cancel
            </Button>{" "}
            <Button
              onClick={exemptStudentSubmit}
              className="btn btn-danger"
              disabled={isSubmit}
            >
              Exempt
            </Button>{" "}
          </div>
        </Modal.Footer>
      </Modal>
      <style jsx>{`
        .id-width {
          display: inline-block;
          width: 70px;
        }
      `}</style>
    </>
  );
};

function ViewCompiledAttendance() {
  const location = useLocation();
  const dbId = location?.state?.dbId; // Destructure dbId from the state
  const [session, setSession] = useState([]); // Session data: the fuel for exams.
  const [courseList, setCourseList] = useState([]); // Courses: pick your poison.
  const [semesterList, setSemesterList] = useState([]); // Semesters: time is a flat circle.
  const [compiledData, setCompiledData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState();
  const [admitForm, setAdmitForm] = useState({
    session: "",
    course_id: "",
    semester_id: "",
  });
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  /**
 * ROLE & PERMISSION
 */
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("View Compile Attendance", "list")) {
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
    fetchSemesterSubjectListing();
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

  const [subjectlist, setSubjectlist] = useState({});

  const fetchSemesterSubjectListing = async (deleteStatus = 0) => {
    setIsSubmit(true);

    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          listing: "yes",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        let subjectMap = {};

        response?.data?.forEach((subject) => {
          subjectMap[subject?.id] = subject?.subject;
        });
        setSubjectlist(subjectMap);
      } else {
        toast.error("Data not found.");
        setSubjectlist({});
      }
    } catch (error) {
      setSubjectlist({});
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };

  const compileAttendanceSubmit = async () => {
    setIsSubmit(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "view_compiled_attendance");
      bformData.append("session", admitForm.session);
      bformData.append("course_id", admitForm.course_id);
      bformData.append("semester_id", admitForm.semester_id);
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

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);

        const computedStudentAttendance = response?.data?.data?.map((data) => {
          let total_days = 0;
          let total_present = 0;
          data?.total_attendance?.forEach((subjectAttendance) => {
            total_days += subjectAttendance?.total_days || 0;
            total_present += subjectAttendance?.total_present || 0;
          });

          return {
            ...data,
            attendancePercentage:
              total_days > 0
                ? ((total_present * 100) / total_days).toFixed(3)
                : "0.000",
          };
        });
        setCompiledData(computedStudentAttendance);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      setCompiledData([]);

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
  const exemptStudent = (data) => {
    setSelectedStudentDetail(data);
    setModalShow(true);
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
                    View Compiled Attendance
                  </span>
                </nav>
              </div>
            </div>
            {/* Main Content Starts Here */}
            <div className="card border-0 bg-transparent mb-0">
              <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title h6_new font-16">
                  View Compiled Attendance
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
              <div className="col-md-12 mx-auto">
                <div className="card">
                  <div className="card-body">
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
                      <div className="col-md-4 col-12 form-group">
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
                      <div className="col-md-4 col-12 form-group">
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

                      <div className="col">
                        <button
                          onClick={compileAttendanceSubmit}
                          className="btn btn-dark  d-flex justify-content-center align-items-center"
                          type="submit"
                        >
                          Load{" "}
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
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <table class="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Info</th>
                            <th scope="col">Attendance Detail</th>
                            <th scope="col">Attendance Percentage</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {compiledData &&
                            compiledData?.length > 0 &&
                            compiledData?.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div
                                    className="info-column d-flex align-items-center
                                                        "
                                  >
                                    <div className="info-image mr-4">
                                      {data.spic ? (
                                        <img
                                          src={`${FILE_API_URL}/student/${data?.student_id}${data.registrationNo}/${data.spic}`}
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
                                          {data?.sname[0]}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="info-name">
                                        <span>{`${data.sname}`}</span>
                                      </div>

                                      <div className="info-email">
                                        <span>{data.semail}</span>
                                      </div>
                                      <div className="info-phone">
                                        <span>{data.sphone}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: 0, margin: 0 }}>
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">Subject</th>
                                        <th scope="col">Total Days</th>
                                        <th scope="col">Total Present</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data?.total_attendance?.map(
                                        (attendanceData, index) => (
                                          <tr key={index}>
                                            <td>{capitalizeFirstLetter(subjectlist[attendanceData?.subject])}</td>
                                            <td>
                                              {attendanceData?.total_days}
                                            </td>
                                            <td>
                                              {attendanceData?.total_present}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                                <td>{data?.attendancePercentage} %</td>
                                <td>
                                  {parseInt(data?.attendancePercentage) <
                                    80 && (
                                      <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                          exemptStudent(data);
                                        }}
                                      >
                                        Exempt Student
                                      </button>
                                    )}
                                </td>
                              </tr>
                            ))}
                          {compiledData?.length < 1 && (
                            <td
                              colspan={4}
                              style={{ textAlign: "center" }}
                              className="text-danger"
                            >
                              No Data Found
                            </td>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExemptModal
        show={modalShow}
        close={() => {
          setModalShow(false);
          setSelectedStudentDetail(null);
        }}
        selectedStudentDetail={selectedStudentDetail}
      />

      <style jsx>
        {`
          td {
            text-align: center;
          }
          th {
            text-align: center;
          }
        `}
      </style>
    </>
  );
}

export default ViewCompiledAttendance;
