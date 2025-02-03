// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter, dataFetchingPost, goBack } from "../../../site-components/Helper/HelperFunction";
import { FormField, TextareaField } from "../../../site-components/admin/assets/FormField";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

function Message() {
  // Initial form state
  const initialForm = {
    loguserid: "",
    login_type: "",
    facultyId: "",
    subjectId: "",
    message: "",
    mailSubject: "",
  };
  const [formData, setFormData] = useState(initialForm); // Form state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [studentListing, setStudentListing] = useState([]);
  const [mailsent, setMailsent] = useState(false);

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
        toast.success(response.message);
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
  const fetchStudentBasedOnBlock = async (courseid, semesterid) => {
    console.log(courseid, semesterid);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/student-detail/get-student-based-on-course-and-semester`,
        {
          courseid,
          semesterid,
          approved: 1,
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setStudentListing(response?.data);
      } else {
        toast.error("Data not found.");
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  // Handle input field change
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };

  const selectedStudent = studentListing?.find(
    (student) => student.id === formData?.studentId
  );

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    errorMsg("", "");
    console.log(formData);
    if (!formData.courseid) {
      errorMsg("courseid", "Course is required.");
      toast.error("Course is required.");
      return setIsSubmit(false);
    }

    if (!formData.semesterid) {
      errorMsg("semesterid", "Semester is required.");
      toast.error("Semester is required.");
      return setIsSubmit(false);
    }

    if (!formData.studentId) {
      errorMsg("studentId", "Student Id is required.");
      toast.error("Student Id is required.");
      return setIsSubmit(false);
    }

    if (!formData.message) {
      errorMsg("message", "Message is required.");
      toast.error("Message is required.");
      return setIsSubmit(false);
    }

    if (!formData.mailSubject && mailsent) {
      errorMsg("mailSubject", "Mail Subject is required.");
      toast.error("facultyId is required.");
      return setIsSubmit(false);
    }

    try {
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.facultyId = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      formData.mailsent = mailsent;
      // submit to the API here
      const response = await axios.post(
        `${NODE_API_URL}/api/communication/send-message-by-faculty`,
        formData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
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
                  <span className="breadcrumb-item">
                    Communication Management
                  </span>
                  <span className="breadcrumb-item">Message</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  Send Message
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <a href="/admin/cmn-mng-message-list">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-list"></i> Message List
                    </button>
                  </a>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-7 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12 col-12 form-group">
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
                                (item) =>
                                  item.id === parseInt(formData.courseid)
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

                          {error.field === "courseid" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-12 col-12 form-group">
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
                              fetchStudentBasedOnBlock(
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
                                      (item) =>
                                        item.id === formData.semesterid
                                    ).semtitle
                                  ),
                                }
                                : {
                                  value: formData.semesterid,
                                  label: "Select",
                                }
                            }
                          />
                          {error.field === "semesterid" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-12 form-group">
                          <label className="font-weight-semibold">
                            Select Student <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={studentListing?.map((student) => ({
                              value: student?.id,
                              label: ` ${student?.sname} (${student?.enrollmentNo})`,
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                studentId: selectedOption.value,
                              });
                            }}
                            value={
                              selectedStudent
                                ? {
                                  value: selectedStudent.id,
                                  label: `${selectedStudent.sname} (${selectedStudent.enrollmentNo})`,
                                }
                                : { value: "", label: "Select" }
                            }
                          />
                        </div>
                        <TextareaField
                          borderError={error.field === "message"}
                          errorMessage={error.field === "message" && error.msg}
                          label="Message"
                          name="message"
                          id="message"
                          value={formData.message}
                          onChange={handleChange}
                          column="col-md-12"
                          required
                        />
                        <div className="form-group col-md-12 col-12 d-flex">
                          <input
                            name="mailsend"
                            id="mailsend"
                            checked={mailsent}
                            type="checkbox"
                            onChange={() => setMailsent(!mailsent)}
                          />
                          <label htmlFor="mailsend" className="font-weight-semibold pl-1">
                            Send On Mail
                          </label>
                        </div>

                        {mailsent && (
                          <FormField
                            borderError={error.field === "mailSubject"}
                            errorMessage={
                              error.field === "mailSubject" && error.msg
                            }
                            label="Subject Mail"
                            name="mailSubject"
                            id="mailSubject"
                            value={formData.mailSubject}
                            onChange={handleChange}
                            column="col-md-12 col-lg-12"
                          />
                        )}

                        <div className="col-md-12 col-lg-12 col-12">
                          <button
                            className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                            type="submit"
                          >
                            Save{" "}
                            {isSubmit && (
                              <>
                                &nbsp; <div className="loader-circle"></div>
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
        </div>
      </div>
    </>
  );
}
export default Message;
