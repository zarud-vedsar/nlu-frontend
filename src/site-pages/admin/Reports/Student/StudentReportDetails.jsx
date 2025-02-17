// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  goBack,
  
} from "../../../../site-components/Helper/HelperFunction";
import "../../../../../node_modules/primeicons/primeicons.css";
import secureLocalStorage from "react-secure-storage";
import { PHP_API_URL } from "../../../../site-components/Helper/Constant";
import axios from "axios";
import Select from "react-select";
function StudentReportDetails() {
  const [showFilter, setShowFilter] = useState(true);
  const [session, setSession] = useState([]); // Session data: the fuel for exams.
  const [applicationList, setApplicationListing] = useState([]);
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [isFetching, setIsFetching] = useState(false);

  const initialData = {
    session: null,
    courseid: null,
    semesterid: null,
  };
  const [formData, setFormData] = useState(initialData);

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
    sessionListDropdown(); // Fetch session list
    courseListDropdown();
   // handleSubmit();
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
  const resetFilter = () => {
    setFormData(initialData);
    setSemesterListing([])
   // handleSubmit();
  };

  // get the data form api ------------------------------------------------------------------------------------------
  const exportExcelFile = async (e) => {
    if (e) e.preventDefault();
    setIsFetching(true);
    try {
      // Create a new form element
      const form = document.createElement("form");
      form.action = `${PHP_API_URL}/report.php`;
      form.method = "POST";
      form.target = "hidden_iframe";  // Target the hidden iframe for submission
  
      // Append hidden input fields to the form
      const formDataEntries = [
        { name: "loguserid", value: secureLocalStorage.getItem("login_id") },
        { name: "login_type", value: secureLocalStorage.getItem("loginType") },
        { name: "session", value: formData?.session },
        { name: "data", value: "student_by_course_sem" },
        { name: "courseid", value: formData?.courseid },
        { name: "semesterid", value: formData?.semesterid }
      ];

      formDataEntries.forEach((entry) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = entry.name;
        input.value = entry.value;
        form.appendChild(input);
      });
  
      // Create a hidden iframe
      const iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe";  // The iframe name must match the form's target
      iframe.style.display = "none";  // Hide the iframe from view
      document.body.appendChild(iframe);
  
      // Handle the iframe's onload event
      iframe.onload = function () {
        try {
          // Parse the iframe response (assuming the response is JSON)
          const iframeContent = iframe.contentWindow.document.body.innerText; // Get iframe body content
          const responseData = JSON.parse(iframeContent); // Parse JSON response
  
          // Handle different statuses based on responseData
          if (responseData?.statusCode === 200 || responseData?.statusCode === 201) {
            toast.success(responseData.msg);  // Success message
            if (responseData.statusCode === 201) {
              setFormData({
                session: "",
                course_id: "",
                semester_id: "",
              });
            }
          } else if (responseData?.statusCode === 400) {
            toast.error("Student not found");
          } else if (responseData?.statusCode === 500) {
            toast.error("Internal server error. Please try again.");
          } else {
            toast.error("Data not found");
          }
        } catch (error) {
          console.error("Error parsing iframe response:", error);
          toast.error("An error occurred while processing the response.");
        } finally {
          // Clean up the iframe after processing
          document.body.removeChild(iframe);
        }
      };
      // Append the form to the body
      document.body.appendChild(form);
      // Submit the form to the hidden iframe (no page reload)
      form.submit();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsFetching(false);  // Reset the fetching state after completion
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
                  <span className="breadcrumb-item">Report</span>
                  
                  <span className="breadcrumb-item active">
                    Student Report 
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Student Report</h5>
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
               
              </div>
              <div className={`card-body px-3 ${showFilter ? "" : "d-none"}`}>
                <form >
                  <div className="row">
                  <div className="col-md-4 col-lg-4 col-12 form-group">
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
                            session.find(({ id }) => id === formData.session)
                              ? {
                                  value: formData.session,
                                  label: session.find(
                                    ({ id }) => id === formData.session
                                  ).dtitle,
                                }
                              : { value: formData.session, label: "Select" }
                          }
                        />
                      </div>
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
                   
                    <div className="col-12 d-flex  mt-2">
                      <button
                        className="btn btn-dark mr-2"
                        onClick={exportExcelFile}
                      >
                        Export
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
            
          </div>
        </div>
      </div>
    </>
  );
}
export default StudentReportDetails;
