import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../../node_modules/primeicons/primeicons.css";
import { toast } from "react-toastify";
import { Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import secureLocalStorage from "react-secure-storage";
import validator from "validator";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Swal from "sweetalert2";
import axios from "axios";
import { FormField } from "../../../site-components/admin/assets/FormField";
import useRolePermission from "../../../site-components/admin/useRolePermission";
function ExamList() {
  const [ExamList, setExamList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  /**
 * ROLE & PERMISSION
 */
  const { RolePermission, hasPermission } = useRolePermission();
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Exam Paper List", "list")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */
  const closeModal = () => setIsModalVisible(false);
  const openModal = () => setIsModalVisible(true);
  const [loadOtp, setloadOtp] = useState(false);
  const [session, setSession] = useState([]); // Session data: the fuel for exams.
  const [courseList, setCourseList] = useState([]); // Courses: pick your poison.
  const [semesterList, setSemesterList] = useState([]); // Semesters: time is a flat circle.
  const [subjectList, setSubjectList] = useState([]); // Subjects: the reason we're here.
  // initialize form fields
  const initialData = {
    dbId: "",
    sessionId: "",
    examType: "",
    courseId: "",
    semesterId: "",
    subjectId: "",
    facultyId: "",
    examDate: "",
    paperCode: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [isSubmit, setIsSubmit] = useState(false);
  const [changePassword, setChangePassword] = useState({
    dbId: "",
    newPassword: "",
    otpSent: false,
    otp: "",
  });
  // Fetch the data for the list
  const fetchList = async () => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/exam/paper/list`,
        formData
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setExamList(response.data);
      } else {
        toast.error("Data not found.");
        setExamList([]);
      }
    } catch (error) {
      setExamList([]);
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

  // UseEffect to handle login data and set facultyId
  useEffect(() => {
    const loguserid = secureLocalStorage.getItem("login_id");
    const login_type = secureLocalStorage.getItem("loginType");

    if (loguserid && login_type === "faculty") {
      setFormData((prev) => ({
        ...prev,
        facultyId: loguserid,
      }));
    }
  }, []); // Run once on mount
  // UseEffect to fetch list after formData changes
  useEffect(() => {
    if (formData.facultyId) {
      fetchList(); // Fetch the list when facultyId is set
    }
    // Ensure that the fetch is triggered after facultyId has been set
  }, [formData.facultyId]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchList();
  };
  const handleRedirectToMarksPage = async (dbId, examType) => {
    if (!dbId || parseInt(dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    if (!examType || (examType && !['end-term', 'mid-term'].includes(examType))) {
      toast.error("Invalid exam type");
      return false;
    }
    try {
      const { value: password } = await Swal.fire({
        title: "Enter Password to upload marks of student",
        input: "password", // Updated input type to "password"
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        showCancelButton: true, // Optionally allow the user to cancel the action
      });

      if (password) {
        const { data } = await axios.post(
          `${NODE_API_URL}/api/exam/paper/checkpass`,
          {
            dbId,
            password,
            loguserid: secureLocalStorage.getItem("login_id"),
            login_type: secureLocalStorage.getItem("loginType"),
          }
        );
        // Handle success or failure
        if ([200].includes(data?.statusCode)) {
          toast.success(data.message);
          setTimeout(() => {
            // Navigate and pass the dbId as part of the state
            navigate(`/admin/exam-paper/upload-marks`, {
              replace: false,
              state: { dbId, examType },
            });
          }, 300);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        Swal.fire("Password is required to proceed.");
      }
    } catch (error) {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || "A server error occurred.";
      toast.error(errorMessage);
      Swal.fire(errorMessage);
    }
  }
  const handleUpdate = async (dbId) => {
    if (!dbId || parseInt(dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    try {
      const { value: password } = await Swal.fire({
        title: "Enter Password to Edit Exam Details",
        input: "password", // Updated input type to "password"
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        showCancelButton: true, // Optionally allow the user to cancel the action
      });

      if (password) {
        const { data } = await axios.post(
          `${NODE_API_URL}/api/exam/paper/checkpass`,
          {
            dbId,
            password,
            loguserid: secureLocalStorage.getItem("login_id"),
            login_type: secureLocalStorage.getItem("loginType"),
          }
        );
        // Handle success or failure
        if ([200].includes(data?.statusCode)) {
          toast.success(data.message);
          setTimeout(() => {
            // Navigate and pass the dbId as part of the state
            navigate(`/admin/exam-paper/add-update`, {
              replace: false,
              state: { dbId },
            });
          }, 300);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        Swal.fire("Password is required to proceed.");
      }
    } catch (error) {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || "A server error occurred.";
      toast.error(errorMessage);
      Swal.fire(errorMessage);
    }
  };

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
      let loguserid = secureLocalStorage.getItem("login_id");
      const { data, statusCode } = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        { courseid, semesterid, column: "id, subject", loguserid }
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
    if (formData.courseId) fetchSemesterBasedOnCourse(formData.courseId); // Fetch semester list on course change
  }, [formData.courseId]);
  useEffect(() => {
    if (formData.courseId && formData.semesterId)
      fetchSubjectBasedOnCourseAndSemester(
        formData.courseId,
        formData.semesterId
      ); // Fetch subject list on course and semester change
  }, [formData.courseId, formData.semesterId]);

  const handleChangePassword = (dbId) => {
    if (!dbId || parseInt(dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    setChangePassword((prev) => ({
      ...prev,
      dbId: dbId,
    }));
    openModal();
  };
  const viewExamPaper = async (dbId) => {
    if (!dbId || parseInt(dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    try {
      // Show SweetAlert with radio options for Paper Set
      const { value: result } = await Swal.fire({
        title: "Enter Password to add questions into paper",
        input: "password", // Password input
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        showCancelButton: true, // Allow the user to cancel
        html: `
        <div>
          <label for="paperSet">Choose Paper Set:</label>
          <div>
            <input type="radio" id="paperSet1" name="paperSet" value="A">
            <label for="paperSet1">Paper Set A</label>
          </div>
          <div>
            <input type="radio" id="paperSet2" name="paperSet" value="B">
            <label for="paperSet2">Paper Set B</label>
          </div>
          <div>
            <input type="radio" id="paperSet3" name="paperSet" value="C">
            <label for="paperSet3">Paper Set C</label>
          </div>
        </div>
      `,
        preConfirm: () => {
          const popup = Swal.getPopup(); // Get the popup element

          // Check if the popup is available
          if (!popup) {
            return Swal.fire("Error: Unable to access the modal.");
          }

          const password = popup.querySelector('input[type="password"]').value;
          const paperSet = popup.querySelector('input[name="paperSet"]:checked');

          // Check if the paperSet is selected
          if (!paperSet) {
            return Swal.fire("Please select a paper set.");
          }
          return {
            password,
            paperSet: paperSet.value, // Return the selected paper set value
          };
        }
      });
      if (result) {
        const { password, paperSet } = result;
        if (password) {
          const { data } = await axios.post(
            `${NODE_API_URL}/api/exam/paper/checkpass`,
            {
              dbId,
              password,
              loguserid: secureLocalStorage.getItem("login_id"),
              login_type: secureLocalStorage.getItem("loginType"),
            }
          );
          // Handle success or failure
          if ([200].includes(data?.statusCode)) {
            toast.success(data.message);
            setTimeout(() => {
              // Navigate and pass the dbId as part of the state
              navigate(`/admin/exam-paper/view-paper`, {
                replace: false,
                state: { dbId, paper_set: paperSet },
              });
            }, 300);
          } else {
            toast.error("An error occurred. Please try again.");
          }
        } else {
          toast.error("Both password and paper set are required to proceed.");
        }
      } else {
        toast.error("Both password and paper set are required to proceed.");
      }
    } catch (error) {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || "A server error occurred.";
      toast.error(errorMessage);
      Swal.fire(errorMessage);
    }
  }

  const viewMarks = async (dbId, examType) => {
    if (!dbId || parseInt(dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    if (!examType || (examType && !['end-term', 'mid-term'].includes(examType))) {
      toast.error("Invalid exam type");
      return false;
    }
    try {
      const { value: password } = await Swal.fire({
        title: "Enter Password to upload marks of student",
        input: "password", // Updated input type to "password"
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        showCancelButton: true, // Optionally allow the user to cancel the action
      });

      if (password) {
        const { data } = await axios.post(
          `${NODE_API_URL}/api/exam/paper/checkpass`,
          {
            dbId,
            password,
            loguserid: secureLocalStorage.getItem("login_id"),
            login_type: secureLocalStorage.getItem("loginType"),
          }
        );
        // Handle success or failure
        if ([200].includes(data?.statusCode)) {
          toast.success(data.message);
          setTimeout(() => {
            // Navigate and pass the dbId as part of the state
            navigate(`/admin/exam-paper/view-marks`, {
              replace: false,
              state: { dbId, examType },
            });
          }, 300);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        Swal.fire("Password is required to proceed.");
      }
    } catch (error) {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || "A server error occurred.";
      toast.error(errorMessage);
      Swal.fire(errorMessage);
    }
  }


  const addQuestion = async (dbId) => {
    if (!dbId || parseInt(dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    try {
      // Show SweetAlert with radio options for Paper Set
      const { value: result } = await Swal.fire({
        title: "Enter Password to add questions into paper",
        input: "password", // Password input
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        showCancelButton: true, // Allow the user to cancel
        html: `
        <div>
          <label for="paperSet">Choose Paper Set:</label>
          <div>
            <input type="radio" id="paperSet1" name="paperSet" value="A">
            <label for="paperSet1">Paper Set A</label>
          </div>
          <div>
            <input type="radio" id="paperSet2" name="paperSet" value="B">
            <label for="paperSet2">Paper Set B</label>
          </div>
          <div>
            <input type="radio" id="paperSet3" name="paperSet" value="C">
            <label for="paperSet3">Paper Set C</label>
          </div>
        </div>
      `,
        preConfirm: () => {
          const popup = Swal.getPopup(); // Get the popup element

          // Check if the popup is available
          if (!popup) {
            return Swal.fire("Error: Unable to access the modal.");
          }

          const password = popup.querySelector('input[type="password"]').value;
          const paperSet = popup.querySelector('input[name="paperSet"]:checked');

          // Check if the paperSet is selected
          if (!paperSet) {
            return Swal.fire("Please select a paper set.");
          }

          return {
            password,
            paperSet: paperSet.value, // Return the selected paper set value
          };
        }
      });

      if (result) {
        const { password, paperSet } = result;

        if (password && paperSet) {
          const { data } = await axios.post(
            `${NODE_API_URL}/api/exam/paper/checkpass`,
            {
              dbId,
              password,
              loguserid: secureLocalStorage.getItem("login_id"),
              login_type: secureLocalStorage.getItem("loginType"),
              paperSet, // Send the selected paper set
            }
          );

          // Handle success or failure
          if ([200].includes(data?.statusCode)) {
            toast.success(data.message);
            setTimeout(() => {
              // Navigate and pass the dbId and paperSet as part of the state
              navigate(`/admin/exam-paper/add-question`, {
                replace: false,
                state: { dbId, paper_set: paperSet },
              });
            }, 300);
          } else {
            toast.error("An error occurred. Please try again.");
          }
        } else {
          toast.error("Both password and paper set are required to proceed.");
        }
      } else {
        toast.error("Both password and paper set are required to proceed.");
      }
    } catch (error) {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || "A server error occurred.";
      toast.error(errorMessage);
      Swal.fire(errorMessage);
    }
  };

  const submitIdForPasschange = async () => {
    if (!changePassword.dbId || parseInt(changePassword.dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    setloadOtp(true);
    try {
      let formData = {
        dbId: changePassword.dbId,
      };
      // Prepare form data
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      if (changePassword.otpSent) {
        formData.otpSent = changePassword.otpSent;
        formData.otp = changePassword.otp;
        formData.newPassword = changePassword.newPassword;
      }

      // Submit data to API
      const response = await axios.post(
        `${NODE_API_URL}/api/exam/paper/change-password`,
        formData
      );
      // Handle success or failure
      if (response.status === 200) {
        if (response.data.statusCode === 105) {
          setChangePassword((prev) => ({
            ...prev,
            otpSent: 1,
          }));
        } else {
          setChangePassword({
            dbId: "",
            newPassword: "",
            otpSent: "",
            otp: "",
          });
          toast.success(response.data.message);
          closeModal();
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || "A server error occurred.";
      toast.error(errorMessage);
    } finally {
      setloadOtp(false);
    }
  };
  const isBeforeEndDate = (endDate) => {
    let currentDate = new Date();
    return currentDate < new Date(endDate);
  };
  const deleteExam = async (dbId) => {
    if (!dbId || parseInt(dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    try {
      const { value: password } = await Swal.fire({
        title: "Enter Password to Delete Exam",
        input: "password", // Updated input type to "password"
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        showCancelButton: true, // Optionally allow the user to cancel the action
      });

      if (password) {
        let formData = {
          dbId: dbId,
        };
        formData.loguserid = secureLocalStorage.getItem("login_id");
        formData.login_type = secureLocalStorage.getItem("loginType");
        formData.password = password;

        // Submit data to API
        const { data } = await axios.post(
          `${NODE_API_URL}/api/exam/paper/delete`,
          formData
        );
        // Handle success or failure
        if ([200].includes(data?.statusCode)) {
          toast.success(data.message);
          // Remove the deleted exam from the list
          setExamList((prevList) =>
            prevList.filter((item) => item.id !== dbId)
          );
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || "A server error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsSubmit(false);
    }
  };
  // Handle input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                 <Link to="/admin/" className="breadcrumb-item">
                                    <i className="fas fa-home m-r-5" />
                                   Dashboard
                                  </Link>
                                  <span className="breadcrumb-item active">
                                  Exam Management
                                  </span>
                  <span className="breadcrumb-item active">Exam Paper List</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-0">
              <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title h6_new font-16">Exam Paper List</h5>
                <div className="ml-auto">
                  <button className="btn goback" onClick={goBack}>
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {
                    hasPermission("Add Exam Paper", "create") && (
                      <Link to={"/admin/exam-paper/add-update"}>
                        <button className="btn btn-primary ml-2">
                          <i className="fas fa-plus"></i> Add New
                        </button>
                      </Link>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-11 col-lg-11 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                  <div className="col-md-1 col-lg-1 col-10 mb-3 col-sm-4 d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-info text-white"
                      onClick={handleShow}
                    >
                      <i className="fa fa-filter"></i>
                    </button>
                  </div>
                </div>
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={ExamList}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    globalFilter={globalFilter}
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column
                      header="Created By"
                      sortable
                      body={(rowData) =>
                        rowData.full_name
                          ? validator.unescape(rowData.full_name)
                          : rowData.full_name
                      }
                    />
                    <Column
                      header="Course Name"
                      sortable
                      body={(rowData) =>
                        rowData.coursename
                          ? validator.unescape(rowData.coursename)
                          : rowData.coursename
                      }
                    />
                    <Column
                      header="Semester"
                      sortable
                      body={(rowData) =>
                        rowData.semtitle
                          ? capitalizeFirstLetter(
                            validator.unescape(rowData.semtitle)
                          )
                          : rowData.semtitle
                      }
                    />
                    <Column
                      header="Subject"
                      sortable
                      body={(rowData) =>
                        rowData.subject
                          ? capitalizeFirstLetter(
                            validator.unescape(rowData.subject)
                          )
                          : rowData.subject
                      }
                    />
                    <Column
                      header="Exam Type"
                      sortable
                      body={(rowData) =>
                        rowData.examType
                          ? capitalizeFirstLetter(
                            validator.unescape(
                              rowData.examType.replace("-", " ")
                            )
                          )
                          : rowData.examType
                      }
                    />
                    <Column
                      header="Paper Code"
                      sortable
                      body={(rowData) =>
                        rowData.paperCode
                          ? validator.unescape(rowData.paperCode)
                          : rowData.paperCode
                      }
                    />
                    <Column
                      header="Max Marks"
                      sortable
                      body={(rowData) => rowData.maxMarks}
                    />
                    <Column
                      header="Time Duration"
                      sortable
                      body={(rowData) => rowData.timeDuration}
                    />
                    <Column
                      header="Exam Date"
                      sortable
                      body={(rowData) =>
                        rowData.examDate ? formatDate(rowData.examDate) : ""
                      }
                    />
                    <Column
                      header="Created At"
                      sortable
                      body={(rowData) =>
                        rowData.created_at ? formatDate(rowData.created_at) : ""
                      }
                    />
                    <Column
                      header="Action"
                      sortable
                      body={(rowData) => (
                        <div className="d-flex">
                          {
                            hasPermission("Exam Paper List", "change password") && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="button-tooltip-1">
                                    Change Password
                                  </Tooltip>
                                }
                              >
                                <button
                                  onClick={() => handleChangePassword(rowData.id)}
                                  className="btn btn-sm btn-warning"
                                >
                                  <i className="fas fa-key"></i>
                                </button>
                              </OverlayTrigger>

                            )
                          }
                          {
                            hasPermission("Exam Paper List", "add question") && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="button-tooltip-2">
                                    Add Question
                                  </Tooltip>
                                }
                              >
                                <button
                                  onClick={() => addQuestion(rowData.id)}
                                  className="btn btn-sm ml-1 btn-success"
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </OverlayTrigger>
                            )
                          }
                          {
                            hasPermission("Exam Paper List", "update") && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="button-tooltip-2">Edit</Tooltip>
                                }
                              >
                                <button
                                  onClick={() => handleUpdate(rowData.id)}
                                  className="btn btn-sm ml-1 btn-primary"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                              </OverlayTrigger>
                            )
                          }
                          {
                            hasPermission("Exam Paper List", "marks upload") && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="button-tooltip-2">
                                    <i className="fas fa-upload"></i> Upload Marks
                                  </Tooltip>
                                }
                              >
                                <button
                                  onClick={() => handleRedirectToMarksPage(rowData.id, rowData.examType)}
                                  className="btn btn-sm ml-1 btn-success"  // Updated button color
                                >
                                  <i className="fas fa-upload"></i>  {/* Icon for the button */}
                                </button>
                              </OverlayTrigger>
                            )
                          }
                          {
                            hasPermission("Exam Paper List", "view exam paper") && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="button-tooltip-3">
                                    View Exam Paper
                                  </Tooltip>
                                }
                              >
                                <button
                                  onClick={() => viewExamPaper(rowData.id)}
                                  className="btn btn-sm ml-1 btn-info">
                                  <i className="fas fa-eye"></i>
                                </button>
                              </OverlayTrigger>
                            )
                          }

                          {
                            hasPermission("Exam Paper List", "marks upload") && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="button-tooltip-2">
                                    View Marks
                                  </Tooltip>
                                }
                              >
                                <button
                                  onClick={() => viewMarks(rowData.id, rowData.examType)}
                                  className="btn btn-sm ml-1 btn-warning"  // Updated button color
                                >
                                  <i className="fa-regular fa-rectangle-list"></i>  {/* Icon for the button */}
                                </button>
                              </OverlayTrigger>
                            )
                          }


                          {isBeforeEndDate(rowData.examDate) && hasPermission("Exam Paper List", "delete") && (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id="button-tooltip-4">Delete Exam</Tooltip>}
                            >
                              <button
                                onClick={() => deleteExam(rowData.id)}
                                className="btn btn-sm ml-1 btn-danger"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </OverlayTrigger>
                          )}


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
      <Modal show={isModalVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="h6_new">Change Password</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {changePassword.otpSent && (
              <>
                <FormField
                  label="Enter OTP"
                  name="otp"
                  id="otp"
                  type="text"
                  required={true}
                  value={changePassword.otp}
                  column="col-md-12 col-12 form-group"
                  onChange={(e) => {
                    setChangePassword((prev) => ({
                      ...prev,
                      otp: e.target.value,
                    }));
                  }}
                />
                <FormField
                  label="Enter New password"
                  name="newPassword"
                  id="newPassword"
                  type="newPassword"
                  required={true}
                  value={changePassword.newPassword}
                  column="col-md-12 col-12 form-group"
                  onChange={(e) => {
                    setChangePassword((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }));
                  }}
                />
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button
            variant="primary"
            type="button"
            disabled={loadOtp}
            onClick={submitIdForPasschange}
            className="d-flex justify-content-center align-items-center"
          >
            {changePassword.otpSent
              ? "Verify OTP & Change Password"
              : "Request OTP"}
            {loadOtp && (
              <>
                &nbsp; <div className="loader-circle"></div>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Records</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleFilter}>
            <div className="row">
              <div className="col-md-12 col-12 form-group">
                <label className="font-weight-semibold">Session</label>
                <Select
                  options={session.map(({ id, dtitle }) => ({
                    value: id,
                    label: dtitle,
                  }))}
                  onChange={({ value }) => {
                    setFormData({ ...formData, sessionId: value });
                    fetchSemesterBasedOnCourse(value);
                  }}
                  value={
                    session.find(({ id }) => id === +formData.sessionId)
                      ? {
                        value: +formData.sessionId,
                        label: session.find(
                          ({ id }) => id === +formData.sessionId
                        ).dtitle,
                      }
                      : { value: formData.sessionId, label: "Select" }
                  }
                />
              </div>
              <div className="col-md-12 col-12 form-group">
                <label htmlFor="examType" className="font-weight-semibold">
                  Exam Type
                </label>
                <select
                  className="form-control"
                  value={formData.examType}
                  name="examType"
                  id="examType"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="mid-term">Mid Term</option>
                  <option value="end-term">End Term</option>
                </select>
              </div>
              <div className="col-md-12 col-12 form-group">
                <label className="font-weight-semibold">Course</label>
                <Select
                  options={courseList.map(({ id, coursename }) => ({
                    value: id,
                    label: coursename,
                  }))}
                  onChange={({ value }) => {
                    setFormData({ ...formData, courseId: value });
                    fetchSemesterBasedOnCourse(value);
                  }}
                  value={
                    courseList.find(({ id }) => id === +formData.courseId)
                      ? {
                        value: +formData.courseId,
                        label: courseList.find(
                          ({ id }) => id === +formData.courseId
                        ).coursename,
                      }
                      : { value: formData.courseId, label: "Select" }
                  }
                />
              </div>
              <div className="col-md-12 col-12 form-group">
                <label className="font-weight-semibold">Semester</label>
                <Select
                  options={semesterList.map(({ id, semtitle }) => ({
                    value: id,
                    label: capitalizeFirstLetter(semtitle),
                  }))}
                  onChange={({ value }) => {
                    setFormData({ ...formData, semesterId: value });
                    fetchSubjectBasedOnCourseAndSemester(
                      formData.courseId,
                      value
                    );
                  }}
                  value={
                    semesterList.find(({ id }) => id === formData.semesterId)
                      ? {
                        value: formData.semesterId,
                        label: capitalizeFirstLetter(
                          semesterList.find(
                            ({ id }) => id === formData.semesterId
                          ).semtitle
                        ),
                      }
                      : { value: formData.semesterId, label: "Select" }
                  }
                />
              </div>
              <div className="col-md-12 col-12 form-group">
                <label className="font-weight-semibold">Subject</label>
                <Select
                  options={subjectList.map(({ id, subject }) => ({
                    value: id,
                    label: capitalizeFirstLetter(subject),
                  }))}
                  onChange={({ value }) =>
                    setFormData({ ...formData, subjectId: value })
                  }
                  value={
                    subjectList.find(({ id }) => id === formData.subjectId)
                      ? {
                        value: formData.subjectId,
                        label: capitalizeFirstLetter(
                          subjectList.find(
                            ({ id }) => id === formData.subjectId
                          ).subject
                        ),
                      }
                      : { value: formData.subjectId, label: "Select" }
                  }
                />
              </div>
              <FormField
                label="Exam Date"
                name="examDate"
                id="examDate"
                type="date"
                value={formData.examDate}
                column="col-md-12 col-12 form-group"
                onChange={handleInputChange}
              />
              <FormField
                label="Paper Code"
                name="paperCode"
                id="paperCode"
                value={formData.paperCode}
                column="col-md-12 col-12 form-group"
                onChange={handleInputChange}
                placeholder="ABC1232"
              />
              <div className="col-md-12 col-lg-12 col-12 d-flex align-items-center justify-content-center">
                <button
                  onClick={() => setFormData(initialData)}
                  className="mt-2 btn btn-secondary btn-block d-flex justify-content-center align-items-center"
                  type="button"
                >
                  Reset
                </button>
                <button
                  className="btn btn-primary ml-2 btn-block d-flex justify-content-center align-items-center"
                  type="submit"
                >
                  Apply Filter{" "}
                  {isSubmit && (
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

export default ExamList;