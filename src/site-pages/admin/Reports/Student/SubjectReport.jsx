// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
  
  capitalizeEachLetter,
} from "../../../../site-components/Helper/HelperFunction";
import "../../../../../node_modules/primeicons/primeicons.css";
import secureLocalStorage from "react-secure-storage";
import { PHP_API_URL } from "../../../../site-components/Helper/Constant";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
function SubjectReport() {
  const [showFilter, setShowFilter] = useState(true);
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [isFetching, setIsFetching] = useState(false);

  const initialData = {
    status: null,
    courseid: null,
    semesterid: null,
    subjectType: null,
    practNonPract: null,
  };
  const [formData, setFormData] = useState(initialData);
  const [filterStatus, setFilterStatus] = useState();
  const practNonPract = ["Yes", "No"];
  const isGroup = ["Yes", "No"];
  const subjectType = ["Compulsory", "Optional", "Elective", "Seminar", "optional-paper"];

 

  const courseListDropdown = async () => {
    try {
      const response = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
      console.log(response,"res")
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
    // if(!formData.courseid){
      
    // }
  
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
        { name: "data", value: "subjects" },
        { name: "courseid", value: formData?.courseid },
        { name: "semesterid", value: formData?.semesterid },
        { name: "subjectType", value: formData?.subjectType },
        { name: "practNonPract", value: formData?.practNonPract },
        { name: "status", value: formData?.status },
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
          console.log(responseData);
  
          // Handle different statuses based on responseData
          if (responseData?.statusCode === 200 || responseData?.statusCode === 201) {
            toast.success(responseData.msg);  // Success message
            if (responseData.statusCode === 201) {
              setFormData({
                course_id: "",
                semester_id: "",
              });
            }
          } else if (responseData?.statusCode === 400) {
            toast.error("Student not found");
          } else if (responseData?.statusCode === 500) {
            toast.error("Internal server error. Please try again.");
          } else {
            toast.error("An unexpected error occurred. Please try again.");
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
      console.log(error);
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsFetching(false); // Reset the fetching state
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
                    Subject Report 
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Subject Report</h5>
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
                    <div className="col-md-6 col-lg-6 col-12 form-group">
                      <label className="font-weight-semibold">
                        Course 
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

                    <div className="col-md-6 col-lg-6 col-12 form-group">
                      <label className="font-weight-semibold">
                        Semester 
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
                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Subject Type 
                      </label>
                     
                  <Select
                    options={subjectType.map((item) => ({
                      value: item,
                      label: capitalizeFirstLetter(item),
                    }))}
                    onChange={(selectedOption) => {
                      setFormData({
                        ...formData,
                        subjectType: selectedOption.value,
                      });
                    }}
                    value={
                      subjectType.find((item) => item === formData.subjectType)
                        ? {
                          value: formData.subjectType,
                          label: capitalizeFirstLetter(formData.subjectType),
                        }
                        : {
                          value: formData.subjectType,
                          label: "Select",
                        }
                    }
                  />
                    </div>
                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">
                      Practical 
                      </label>
                     
                      <Select options={practNonPract.map((item) => ({
                      value: item,
                      label: capitalizeFirstLetter(item),
                    }))}
                    onChange={(selectedOption) => {
                      setFormData({
                        ...formData,
                        practNonPract: selectedOption.value,
                      });
                    }}
                    value={
                      practNonPract.find(
                        (item) => item === formData.practNonPract
                      )
                        ? {
                          value: formData.practNonPract,
                          label: capitalizeFirstLetter(formData.practNonPract),
                        }
                        : {
                          value: formData.practNonPract,
                          label: "Select",
                        }
                    }
                  />
                    </div>

                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">
                      Status 
                      </label>
                     
                      <Select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e);
                      setFormData((prevState) => ({
                        ...prevState,
                        status: e.value,
                      }));
                    }}
                    options={[
                      { value: 1, label: "Active" },
                      { value: 0, label: "Inactive" },
                    ]}
                    placeholder="Select Status"
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
export default SubjectReport;
