// Import the usual suspects (like a hacker assembling a team for a heist)
import React, { useCallback, useEffect, useState } from 'react'; // React is life; state is chaos.
import { Link, useLocation, useNavigate } from 'react-router-dom'; // For navigating the matrix.
import { capitalizeFirstLetter, dataFetchingPost, goBack } from '../../../site-components/Helper/HelperFunction'; // Escape hatch in case things go south.
import { FormField } from '../../../site-components/admin/assets/FormField'; // The sacred field for all inputs.
import {
  NODE_API_URL,
  CKEDITOR_URL,
} from "../../../site-components/Helper/Constant"; // The secret base URL we talk to.
import validator from 'validator'; // Validating like a pro, no shady inputs allowed.
import { toast } from 'react-toastify'; // Toasts: because why suffer in silence when you can pop a notification?
import secureLocalStorage from 'react-secure-storage'; // Encryption? Check. Security? Double-check.
import axios from 'axios'; // Axios is like the courier for your HTTP requests.
import Select from 'react-select'; // React Select
import Swal from 'sweetalert2';
import useRolePermission from '../../../site-components/admin/useRolePermission';
import JoditEditor from "jodit-react"; // Import Jodit editor

function AddExam() {
  const location = useLocation();
  const dbId = location?.state?.dbId; // Destructure dbId from the state
  /**
* ROLE & PERMISSION
*/
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {

      if (dbId && hasPermission("Add Exam Paper", "update")) { /* empty */ }
      else if (hasPermission("Add Exam Paper", "create")) { /* empty */ }
      else {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission, dbId]);
  /**
   * THE END OF ROLE & PERMISSION
   */

  // Default section: The template for every exam section. Use, reuse, dominate.
  const defaultSection = {
    title: "", // No title? No glory.
    marksPerQuestion: 0, // Zero marks = zero regrets.
    totalQuestion: 0, // How many questions can you handle, mortal?
    attemptQuestion: 0, // Questions you must attempt—or else.
  };

  // Initial state of the form: the blank canvas before the chaos.
  const initialFormData = {
    examDate: "", // examDate
    sessionId: "", // Session of the all-powerful exam.
    examType: "", // What kind of torture is this? Midterm? Final? Surprise?
    courseId: "", // The course in question. Literally.
    semesterId: "", // Which semester will remember this?
    subjectId: "", // Subject: because you must have one.
    startTime: "",
    endTime: "",
    venue: "",
    paperCode: "", // Code: for the hardcore exam nerds.
    timeDuration: "", // Clock's ticking. Plan your escape.
    maxMarks: "", // What's the max damage this exam can do?
    password: "", // Password
    instruction: "", // Instruction
    section: [defaultSection], // A container of sections: the real MVPs.
    pass: 0,
  };
  // Jodit editor configuration
  const config = {
    readonly: false, // set to true if you want readonly mode
  };
  // State variables: The true chaos handlers.
  const [formData, setFormData] = useState(initialFormData); // For holding all the exam data.
  const [error, setError] = useState({ field: "", msg: "" }); // For pointing fingers at mistakes.
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [session, setSession] = useState([]); // Session data: the fuel for exams.
  const [courseList, setCourseList] = useState([]); // Courses: pick your poison.
  const [semesterList, setSemesterList] = useState([]); // Semesters: time is a flat circle.
  const [subjectList, setSubjectList] = useState([]); // Subjects: the reason we're here.
  const [sections, setSections] = useState([defaultSection]); // Start with one default section

  /**
   * Helper function
   */
  // Handle input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Error message handler for fields
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
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

  const addSection = () => {
    setSections([...sections, { ...defaultSection }]); // Adds a new section with default values
  };
  // Fetch the data for the list
  const fetchDataForUpdate = async (dbId) => {
    if (!dbId || parseInt(dbId, 10) < 1) {
      toast.error("Invalid exam id");
      return false;
    }
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/exam/paper/list`,
        { dbId }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          dbId: response.data[0].id,
          examDate: response.data[0].examDate
            ? response.data[0].examDate.split("T")[0]
            : response.data[0].examDate,
          sessionId: response.data[0].sessionId,
          examType: response.data[0].examType,
          courseId: response.data[0].courseId,
          semesterId: response.data[0].semesterId,
          startTime: response.data[0].startTime,
          subjectId: response.data[0].subjectId,
          endTime: response.data[0].endTime,
          venue: response.data[0].venue,
          paperCode: response.data[0].paperCode,
          timeDuration: response.data[0].timeDuration,
          maxMarks: response.data[0].maxMarks,
          instruction: validator.unescape(response.data[0].instruction || ""),
          section: JSON.parse(response.data[0].section), // A container of sections: the real MVPs.
          pass: 1,
        }));
        setSections(JSON.parse(response.data[0].section));
      } else {
        toast.error("Data not found.");
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
  const handleSectionChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSections = [...sections];
    updatedSections[index][name] = value; // Dynamically update the correct field
    setSections(updatedSections);
  };
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
          fetchDataForUpdate(dbId);
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
  useEffect(() => {
    if (dbId && parseInt(dbId, 10) > 0) {
      handleUpdate(dbId);
    }
  }, [dbId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    // Define all required fields and their corresponding error messages
    const requiredFields = [
      { field: "sessionId", message: "Please select a session." },
      { field: "examType", message: "Please select an exam type." },
      { field: "courseId", message: "Please select a course." },
      { field: "semesterId", message: "Please select a semester." },
      { field: "subjectId", message: "Please select a subject." },
      { field: "paperCode", message: "Please provide a paper code." },
      { field: "timeDuration", message: "Please specify the time duration." },
      { field: "maxMarks", message: "Please specify the maximum marks." },
      { field: "password", message: "Please provide a password." },
    ];

    // Loop through each required field and validate
    for (let { field, message } of requiredFields) {
      if (field === 'password' && !formData[field] && !dbId) {
        toast.error(message);
        errorMsg(field, message);
        setIsSubmit(false);
        return;
      } else {
        if (!formData[field] && field != "password") {
          toast.error(message);
          errorMsg(field, message);
          setIsSubmit(false);
          return;
        }
      }
    }

    try {
      formData.section = [...sections];
      // Prepare form data
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");

      // Submit data to API
      const { data } = await axios.post(
        `${NODE_API_URL}/api/exam/paper/add-update-exam`,
        formData
      );
      // Handle success or failure
      if ([200, 201].includes(data?.statusCode)) {
        if (data?.statusCode === 201) {
          setFormData(initialFormData);
          setSections(sections);
        }
        toast.success(data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || "A server error occurred.";
      const errorField = error?.response?.data?.errorField;
      if (errorField) errorMsg(errorField, errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmit(false);
    }
  };
  const handleEditorChange = useCallback((newContent) => {
    setFormData((prev) => ({
      ...prev,
      instruction: newContent,
    }));
  }, []);
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
                    Announcement
                  </Link>
                  <span className="breadcrumb-item">Exam Management</span>
                  <span className="breadcrumb-item active">
                    {dbId ? "Update Exam Details" : "Add New Exam"}
                  </span>
                </nav>
              </div>
            </div>
            {/* Main Content Starts Here */}
            <div className="card border-0 bg-transparent mb-0">
              <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title h6_new font-16">
                  {dbId ? "Update Exam Details" : "Add New Exam"}
                </h5>
                {/* The almighty 'Go Back' button */}
                <button className="btn goback" onClick={goBack}>
                  <i className="fas fa-arrow-left"></i> Go Back
                </button>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body px-3">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3 col-12 form-group">
                      <label className="font-weight-semibold">
                        Session <span className="text-danger">*</span>
                      </label>
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
                      {error.field === "sessionId" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>
                    <div className="col-md-3 col-12 form-group">
                      <label
                        htmlFor="examType"
                        className="font-weight-semibold"
                      >
                        Exam Type <span className="text-danger">*</span>
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
                      {error.field === "examType" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>
                    <div className="col-md-3 col-12 form-group">
                      <label className="font-weight-semibold">
                        Course <span className="text-danger">*</span>
                      </label>
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
                      {error.field === "courseId" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>
                    <div className="col-md-3 col-12 form-group">
                      <label className="font-weight-semibold">
                        Semester <span className="text-danger">*</span>
                      </label>
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
                          semesterList.find(
                            ({ id }) => id === formData.semesterId
                          )
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
                      {error.field === "semesterId" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>
                    <div className="col-md-6 col-12 form-group">
                      <label className="font-weight-semibold">
                        Subject <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={subjectList.map(({ id, subject }) => ({
                          value: id,
                          label: capitalizeFirstLetter(subject),
                        }))}
                        onChange={({ value }) =>
                          setFormData({ ...formData, subjectId: value })
                        }
                        value={
                          subjectList.find(
                            ({ id }) => id === formData.subjectId
                          )
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
                      {error.field === "subjectId" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>
                    <FormField
                      borderError={error.field === "examDate"}
                      errorMessage={error.field === "examDate" && error.msg}
                      label="Exam Date"
                      name="examDate"
                      id="examDate"
                      type="date"
                      value={formData.examDate}
                      column="col-md-3 col-12 form-group"
                      onChange={handleInputChange}
                    />
                    <FormField
                      borderError={error.field === "paperCode"}
                      errorMessage={error.field === "paperCode" && error.msg}
                      label="Paper Code"
                      name="paperCode"
                      id="paperCode"
                      required={true}
                      value={formData.paperCode}
                      column="col-md-3 col-12 form-group"
                      onChange={handleInputChange}
                      placeholder="ABC1232"
                    />
                    <FormField
                      borderError={error.field === "startTime"}
                      errorMessage={error.field === "startTime" && error.msg}
                      label="Exam Start Time"
                      name="startTime"
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      column="col-md-3 col-12 form-group"
                      onChange={handleInputChange}
                    />
                    <FormField
                      borderError={error.field === "endTime"}
                      errorMessage={error.field === "endTime" && error.msg}
                      label="Exam End Time"
                      name="endTime"
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      column="col-md-3 col-12 form-group"
                      onChange={handleInputChange}
                    />
                    <FormField
                      borderError={error.field === "venue"}
                      errorMessage={error.field === "venue" && error.msg}
                      label="Venue"
                      name="venue"
                      id="venue"
                      value={formData.venue}
                      column="col-md-6 col-12 form-group"
                      onChange={handleInputChange}
                      placeholder='Academic Block'
                    />
                    <FormField
                      borderError={error.field === "timeDuration"}
                      errorMessage={error.field === "timeDuration" && error.msg}
                      label="Time Duration"
                      name="timeDuration"
                      id="timeDuration"
                      required={true}
                      value={formData.timeDuration}
                      column="col-md-4 col-12 form-group"
                      onChange={handleInputChange}
                      placeholder="03 hours"
                    />
                    <FormField
                      borderError={error.field === "maxMarks"}
                      errorMessage={error.field === "maxMarks" && error.msg}
                      label="Max Marks"
                      name="maxMarks"
                      id="maxMarks"
                      required={true}
                      type="number"
                      value={formData.maxMarks}
                      column="col-md-4 col-12 form-group"
                      onChange={handleInputChange}
                      placeholder="50"
                    />
                    <FormField
                      borderError={error.field === "password"}
                      errorMessage={error.field === "password" && error.msg}
                      label="Password (For Exam Paper Access)"
                      name="password"
                      id="password"
                      required={true}
                      type="password"
                      value={formData.password}
                      column="col-md-4 col-12 form-group"
                      onChange={handleInputChange}
                    />
                    <div className="col-md-12 form-group mt-3">
                      <h6 className="custom">
                        <span className="custo-head">Section</span>
                      </h6>
                    </div>
                    {sections.map((section, index) => (
                      <div className="col-md-12 form-group" key={index}>
                        <div
                          className="row border mx-auto"
                          style={{ width: "99.8%" }}
                        >
                          <FormField
                            label="Title"
                            name="title" // Remove index here
                            id={`title-${index}`} // Keep unique IDs for accessibility
                            required={true}
                            value={section.title}
                            column="col-md-12 col-12 form-group"
                            onChange={(e) => handleSectionChange(e, index)}
                            placeholder="A"
                          />
                          <FormField
                            label="Marks/Question"
                            name="marksPerQuestion" // Remove index here
                            id={`marksPerQuestion-${index}`}
                            required={true}
                            type="number"
                            value={section.marksPerQuestion}
                            column="col-md-4 col-12 form-group"
                            onChange={(e) => handleSectionChange(e, index)}
                            placeholder="4"
                          />
                          <FormField
                            label="Total Question"
                            name="totalQuestion" // Remove index here
                            id={`totalQuestion-${index}`}
                            required={true}
                            type="number"
                            value={section.totalQuestion}
                            column="col-md-4 col-12 form-group"
                            onChange={(e) => handleSectionChange(e, index)}
                            placeholder="5"
                          />
                          <FormField
                            label="Attempt Question"
                            name="attemptQuestion" // Remove index here
                            id={`attemptQuestion-${index}`}
                            required={true}
                            type="number"
                            value={section.attemptQuestion}
                            column="col-md-4 col-12 form-group"
                            onChange={(e) => handleSectionChange(e, index)}
                            placeholder="4"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="col-md-12 form-group">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addSection}
                      >
                        <i className="fas fa-plus"></i> Add Section
                      </button>
                    </div>
                    <div className="col-md-12">
                      <label className="font-weight-semibold">
                        Instruction
                      </label>
                      <JoditEditor
                        value={formData.instruction || ""}
                        config={config}
                        onChange={handleEditorChange}
                      />
                    </div>
                    <div className="col-md-12 col-12">
                      <button
                        className="btn btn-dark d-flex justify-content-center align-items-center"
                        type="submit"
                      >
                        Save{" "}
                        {isSubmit && (
                          <>
                            &nbsp;<div className="loader-circle"></div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddExam;