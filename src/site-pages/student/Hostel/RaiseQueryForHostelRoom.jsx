import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { FormField,TextareaField } from "../../../site-components/admin/assets/FormField";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
function RaiseQueryForHostelRoom() {
  const { id: dbId } = useParams();
  const initialData = {
    dbId: "",
    courseid: "",
    semesterid: "",
    studentId: "",
    message: "",
    coursename:"",
    semtitle:"",
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
      errorMsg("message", "Message is required.");
      toast.error("Message is required.");
      return setIsSubmit(false);
    }
    errorMsg("", "");

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/raised-query-for-hostel-room`,
        {
          courseid: currentCourse?.courseid,
          semesterid: currentCourse?.semesterid,
          studentId: formData?.studentId,
          message: formData?.message,
        }
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);
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
      studentId: secureLocalStorage.getItem("studentId"),
    }));
  }, []);

  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = secureLocalStorage.getItem("studentId");
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
      formData.studentId = secureLocalStorage.getItem("studentId");
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
                     Allot Room
                  </a>
                  <span className="breadcrumb-item active">
                     Raise Query For Room
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                Raise Query For Room
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/student/alloted-room-history">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      Alloted History <i className="fas fa-list"></i>
                    </button>
                  </Link>
                  <Link to="/student/raised-room-queries">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      Raised Room Queries <i className="fas fa-list"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card ">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    
                    
                    <TextareaField
                      borderError={error.field === "message"}
                      errorMessage={error.field === "message" && error.msg}
                      label="Message"
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

export default RaiseQueryForHostelRoom;
