// Import the usual suspects (like a hacker assembling a team for a heist)
import React, { useEffect, useState } from "react"; // React is life; state is chaos.
import { Link, useNavigate } from "react-router-dom"; // For navigating the matrix.
import { capitalizeAllLetters, capitalizeFirstLetter, dataFetchingPost, formatDate, goBack } from "../../../site-components/Helper/HelperFunction"; // Escape hatch in case things go south.
import {
  NODE_API_URL,
  PHP_API_URL,
  FILE_API_URL
} from "../../../site-components/Helper/Constant"; // The secret base URL we talk to.
import rpnl_logo from "../../../site-components/website/assets/Images/rpnl_logo.png";

import { toast } from "react-toastify"; // Toasts: because why suffer in silence when you can pop a notification?
import secureLocalStorage from "react-secure-storage"; // Encryption? Check. Security? Double-check.
import axios from "axios"; // Axios is like the courier for your HTTP requests.
import Select from 'react-select'; // React Select
import { FormField } from "../../../site-components/admin/assets/FormField";
import './admit.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useRolePermission from "../../../site-components/admin/useRolePermission";
function AddExam() {
  const [session, setSession] = useState([]); // Session data: the fuel for exams.
  const [courseList, setCourseList] = useState([]); // Courses: pick your poison.
  const [semesterList, setSemesterList] = useState([]); // Semesters: time is a flat circle.

  const [admitForm, setAdmitForm] = useState({
    session: "",
    course_id: "",
    semester_id: "",
    exam_type: "",
    title: '',
  });
  const [admitData, setAdmitData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  /**
   * API Fetching Functions
   */

  /**
* ROLE & PERMISSION
*/
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      const showSubMenu = hasPermission("Admit Card", "list");
      if (!showSubMenu) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
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
  const fetchAdmitCardTitle = async (session, course_id, semester_id, exam_type) => {

    if (session && course_id && semester_id && exam_type) {
      try {
        const response = await axios.post(`${NODE_API_URL}/api/exam/admit/fetch-title`, {
          session,
          course_id,
          semester_id,
          exam_type,
        });
        console.log(response);

        if (response?.data?.statusCode === 200 && response.data.data?.length) {
          const title = response.data.data[0].title; // Adjust based on API response structure
          setAdmitForm((prev) => ({
            ...prev,
            title,
          }));
        } else {
          console.error("Failed to fetch admit card title: Invalid response or empty data");
        }
      } catch (error) {
        console.error("Error fetching admit card title:", error);
      }
    } else {
      console.warn("Missing parameters for fetching admit card title");
    }
  };
  useEffect(() => {
    fetchAdmitCardTitle(
      admitForm.session,
      admitForm.course_id,
      admitForm.semester_id,
      admitForm.exam_type,
      setAdmitForm
    );
  }, [admitForm.session, admitForm.course_id, admitForm.semester_id, admitForm.exam_type]);
  const fetchAdmitCard = async () => {
    if (!admitForm.session) {
      toast.error("Session is required");
      return false;
    }
    if (!admitForm.exam_type) {
      toast.error("Exam type is required");
      return false;
    }
    if (!admitForm.course_id) {
      toast.error("Course is required");
      return false;
    }

    try {
      if (!admitForm.semester_id) {
        toast.error("Semester is required");
        return false;
      }
      if (!admitForm.title) {
        toast.error("Title is required");
        return false;
      }
      admitForm.loguserid = secureLocalStorage.getItem("login_id");
      admitForm.login_type = secureLocalStorage.getItem("loginType");
      // Submit data to API
      const { data } = await axios.post(
        `${NODE_API_URL}/api/exam/admit/add-title`,
        admitForm
      );
      // Handle success or failure
      if ([200, 201].includes(data?.statusCode)) {
        toast.success(data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
      const bformData = new FormData();
      bformData.append("data", "print_admit_card");
      bformData.append("session", admitForm.session);
      bformData.append("course_id", admitForm.course_id);
      bformData.append("semester_id", admitForm.semester_id);
      bformData.append("exam_type", admitForm.exam_type);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const res = await axios.post(`${PHP_API_URL}/admitcard.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = res.data.data;
      setAdmitData(result);
      if (res?.data?.status == 200) {
      } else {
        toast.error("An error occurred or admit card not found.");
      }
    } catch (error) {
      toast.error("An error occurred or admit card not found.");
    }
  };
  const [loading, setLoading] = useState(false); // State for managing loader visibility
  const [totalFiles, setTotalFiles] = useState(0);
  const [downloaded, setDownloaded] = useState(0);

  const handleDownload = async () => {
    setLoading(true); // Show loader
    try {
      const elements = document.querySelectorAll("[data-jsx-template]");
      const pdf = new jsPDF("portrait", "mm", "a4");

      // Set the total number of files
      setTotalFiles(elements.length);
      setDownloaded(0); // Reset downloaded count

      for (const [index, element] of elements.entries()) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true, // Attempt to bypass CORS for images
          allowTaint: false, // Prevent loading tainted images
        });

        const imgData = canvas.toDataURL("image/png");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        if (index > 0) {
          pdf.addPage(); // Add a new page for every additional element
        }
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

        // Update downloaded count
        setDownloaded((prev) => prev + 1);
      }

      pdf.save("document.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };
  function convertTo12Hour(time) {
    // Assume time is in "HH:MM" format
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }


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
                    Exam Management
                  </Link>
                  
                  <span className="breadcrumb-item active">Admit Card</span>
                </nav>
              </div>
            </div>
            {/* Main Content Starts Here */}
            <div className="card border-0 bg-transparent mb-0">
              <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title h6_new font-16">Admit Card</h5>
                {/* The almighty 'Go Back' button */}
                <button className="btn goback" onClick={goBack}>
                  <i className="fas fa-arrow-left"></i> Go Back
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {
                  hasPermission("Admit Card", "create") && (
                    <>
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
                        <div className="col-md-3 col-12 form-group">
                          <label htmlFor="examType" className="font-weight-semibold">
                            Exam Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-control"
                            value={admitForm.exam_type}
                            name="examType"
                            id="examType"
                            onChange={(e) => {
                              setAdmitForm({
                                ...admitForm,
                                exam_type: e.target.value,
                              });
                            }}
                          >
                            <option value="">Select</option>
                            {/* <option value="mid-term">Mid Term</option> */}
                            <option value="end-term">End Term</option>
                          </select>
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
                              setAdmitForm({ ...admitForm, course_id: value });
                              fetchSemesterBasedOnCourse(value);
                            }}
                            value={
                              courseList.find(({ id }) => id === +admitForm.course_id)
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
                                : { value: admitForm.semester_id, label: "Select" }
                            }
                          />
                        </div>
                        <FormField
                          label="Exam Title"
                          name="paperCode"
                          id="paperCode"
                          required={true}
                          value={admitForm.title}
                          column="col-md-12 col-12 form-group"
                          onChange={(e) => {
                            setAdmitForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }));
                          }}
                          placeholder="END-TERM EXAMINATION NOVEMBER-DECEMBER, 2024"
                        />
                        <div className="col-md-12">
                          <p>Example: END-TERM EXAMINATION NOVEMBER-DECEMBER, 2024</p>
                        </div>
                        <div className="col-md-12 col-12">
                          <button
                            onClick={fetchAdmitCard}
                            className="btn btn-dark d-flex justify-content-center align-items-center"
                            type="submit"
                          >
                            Submit{" "}
                            {isSubmit && (
                              <>
                                &nbsp;<div className="loader-circle"></div>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {
                  hasPermission("Admit Card", "download") && (
                    <button
                      onClick={handleDownload}
                      className="btn border-0 btn-primary d-flex justify-content-center align-items-center"
                      disabled={loading} // Disable button while loading
                    >
                      <i className="fas fa-download"></i> &nbsp; Download {loading && (
                        <div className="loader-circle"></div>
                      )}
                    </button>
                  )
                }
                <div className="mt-3">Total Files: {totalFiles}</div>
                <div className="mt-3">Total Downloaded: {downloaded}</div>
              </div>
              <div className="col-md-12">
                {
                  admitData && admitData.length > 0 && admitData.map((item, index) => (
                    <div className="container-main" key={index} data-jsx-template={index}>
                      <div className="inner-container">
                        <div className="id-header-wrapper">
                          <div><img src={rpnl_logo} alt="" className="id-header-img" /></div>
                          <div className="id-header-content">
                            <h4>Dr. Rajendra Prasad</h4>
                            <h3>National Law University, Prayagraj</h3>
                            <hr />
                          </div>
                        </div>
                        <p className="id-head-content">
                          {admitForm.title}
                          <br />
                          ADMIT CARD
                        </p>
                        <div className="id-personal-details-wrapper">
                          <div className="id-personal-details">
                            <p className="id-padd-p">
                              <span className="id-text-bold">Roll No.</span>:
                              <span className="id-text-light">{item?.roll_no}</span>
                            </p>
                            <p className="id-padd-p">
                              <span className="id-text-bold">Candidate Name</span>:{" "}
                              <span className="id-text-light">{item?.candidate_name}</span>
                            </p>
                            <p className="id-padd-p">
                              <span className="id-text-bold">Semester</span>:
                              <span className="id-text-light">{item?.semester}</span>
                            </p>
                            <p className="id-padd-p">
                              <span className="id-text-bold">Program</span>:
                              <span className="id-text-light">{item?.program}</span>
                            </p>
                            <p className="id-padd-p">
                              <span className="id-text-bold">Examination Type</span>:
                              <span className="id-text-light">{item?.exam_type}</span>
                            </p>
                            <p className="id-padd-p">
                              <span className="id-text-bold">Status (Eligible/Debarred)</span>:
                              <span className="id-text-light">{item?.status ? capitalizeAllLetters(item?.status) : item?.status}</span>
                            </p>
                          </div>
                          <div className="id-candidate-photo-wrapper">
                            <div className="id-candidate-photo">
                              <img src={`${FILE_API_URL}/${item?.pic}`} />
                            </div>
                            <div className="id-candidate-sign">
                              <img src={`${FILE_API_URL}/${item?.sign}`} />
                            </div>
                            <span className="id-cendidate-sign-text">(Candidate's Signature)</span>
                          </div>
                        </div>
                        <div className="details">
                          <table>
                            <tbody>
                              <tr>
                                <th>Date</th>
                                <th>Timing</th>
                                <th>Paper Code</th>
                                <th>Subject</th>
                                <th>Venue</th>
                              </tr>
                              {
                                item?.papers.map((paper, index) => (
                                  <tr key={index}>
                                    <td>
                                      {paper.examDate
                                        ? `${formatDate(paper.examDate)}, ${new Date(paper.examDate).toLocaleDateString('en-US', { weekday: 'long' })}`
                                        : paper.examDate}
                                    </td>

                                    <td>
                                      {paper.startTime ? convertTo12Hour(paper.startTime) : ""} - {paper.endTime ? convertTo12Hour(paper.endTime) : ""}
                                    </td>
                                    <td>{paper.paperCode}</td>
                                    <td>{paper.subject}</td>
                                    <td>{paper.venue}</td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                        <div className="instructions">
                          <h3>Important Instructions:</h3>
                          <ul>
                            <li>
                              It is mandatory for the candidates to carry their admit card during
                              the course of the examination.
                            </li>
                            <li>
                              Candidates need to put their signature in the space provided below the
                              photograph.
                            </li>
                            <li>
                              Each candidate shall show his or her 'Admit Card' to the
                              Superintendent of Examination at the time of examination and is
                              required to produce the same to the invigilator during the course of
                              the examination.
                            </li>
                            <li>
                              The candidates are directed to occupy their respective seats 30
                              minutes before the commencement of the examination.
                            </li>
                            <li>
                              Candidates shall not be allowed 30 minutes after the commencement of
                              the examination.
                            </li>
                            <li>
                              Candidates are not allowed to take with them any unauthorized
                              material, including mobile phones, smartwatches, pen drives, books,
                              notes, Bluetooth devices, etc., to the examination center.
                            </li>
                            <li>
                              The Superintendent of Examination, the invigilator, and the
                              Examination team can do the physical search of the candidates at any
                              time during the course of the examination to ensure that they do not
                              have any unauthorized material in their possession.
                            </li>
                          </ul>
                          <p className="id-dean-examination">Dean Examination</p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddExam;
