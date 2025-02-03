import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { FormField,TextareaField } from "../../../site-components/admin/assets/FormField";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import axios from "axios";
function ViewAndResponseComplain() {
  const {studentId, complainId: dbId } = useParams();
  const initialData = {
    dbId: "",
    courseid: "",
    semesterid: "",
    studentId: "",
    message: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [currentCourse, setCurrentCourse] = useState(initialData);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state

  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!formData.message) {
      errorMsg("message", "Remark is required.");
      toast.error("Remark is required.");
      return setIsSubmit(false);
    }
    errorMsg("", "");

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/admin-response-to-complaint`,
        {
          dbId: dbId,
          message: formData?.message,
        }
      );
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        toast.success(response?.data?.message);
        setFormData((prev)=>({...prev,message:""}))
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
  useEffect(() => {
    getStudentSelectedCourse();
    getStudentSelectedCourseIds();
    setFormData((prev) => ({
      ...prev,
      studentId: studentId,
    }));
  }, []);

  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = studentId;
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetchCurrentCourse`,
        formData
      );

      if (response.data?.statusCode === 200) {
        if (response?.data?.data?.approved === 1) {
          setCurrentCourse((prev) => ({
            ...prev,
            coursename: response?.data?.data?.coursename,
            semtitle: response?.data?.data?.semtitle,
          }));
        }
      }
    } catch (error) {
      if (
        error?.response.data?.statusCode === 400 ||
        error?.response.data?.statusCode === 500
      ) {
        toast.error(error?.response.data?.message);
      }
    }
  };
  const getStudentSelectedCourseIds = async () => {
    try {
      let formData = {};
      formData.studentId = studentId;
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetch`,
        formData
      );
      if (response.data?.statusCode === 200) {
        if (response?.data?.data[0]?.approved === 1) {
          setCurrentCourse((prev) => ({
            ...prev,
            courseid: response?.data?.data[0]?.courseid,
            semesterid: response?.data?.data[0]?.semesterid,
          }));
        }
      }
    } catch (error) {
      if (
        error?.response.data?.statusCode === 400 ||
        error?.response.data?.statusCode === 500
      ) {
        toast.error(error?.response.data?.message);
      }
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
                  <a href="./" className="breadcrumb-item">
                    Hostel Management
                  </a>
                  <span className="breadcrumb-item active">
                     View Complain
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                View Complain
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/raised-room-complains">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      Room Complains <i className="fas fa-list"></i>
                    </button>
                  </Link>
                  
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <FormField
                      label="Course"
                      name="courseid"
                      id="courseid"
                      type="text"
                      value={currentCourse.coursename}
                      column="col-md-4 col-lg-4"
                      readOnly
                    />
                    <FormField
                      label="Semester"
                      name="semesterid"
                      id="semesterid"
                      type="text"
                      value={currentCourse.semtitle}
                      column="col-md-4 col-lg-4"
                      readOnly
                    />
                    <FormField
                      label="Student ID"
                      name="studentId"
                      id="studentId"
                      type="text"
                      value={formData.studentId}
                      column="col-md-4 col-lg-4"
                      readOnly
                    />
                    <TextareaField
                      borderError={error.field === "message"}
                      errorMessage={error.field === "message" && error.msg}
                      label="Remark"
                      name="message"
                      id="message"
                      type="text"
                      value={formData.message}
                      onChange={handleChange}
                      column="col-md-12 col-lg-12"
                      required
                    />

                    <div className="col-md-12 col-lg-12 col-12">
                      <button
                        disabled={isSubmit}
                        className="btn btn-dark col-12 d-flex justify-content-center"
                        type="submit"
                      >
                        Submit{" "}
                        {isSubmit && (
                          <div className="d-flex justify-content-center">
                            &nbsp; <div className="loader-circle"></div>
                          </div>
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

export default ViewAndResponseComplain;
