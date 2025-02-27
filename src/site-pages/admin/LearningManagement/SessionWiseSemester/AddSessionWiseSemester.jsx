import React, { useEffect, useState } from "react";
import { NODE_API_URL, PHP_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  goBack,
} from "../../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { FormField } from "../../../../site-components/admin/assets/FormField";
function AddSessionWiseSemester() {
  // Initial form state
  const initialForm = {
    session: localStorage.getItem("session"),
    course: "",
    semester: "",
    startdate: "",
  };
  const { id } = useParams();
  const [formData, setFormData] = useState(initialForm); // Form state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [semesterList, setSemesterList] = useState([]);
  const [sessionList, setSessionList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

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
    fetchSessionList();
  }, []);

  const updateFetchData = async (id) => {
    if (
      !id ||
      !Number.isInteger(parseInt(id, 10)) ||
      parseInt(id, 10) <= 0
    )
      return toast.error("Invalid ID.");
    try {
      const bformData = new FormData();
      bformData.append("data","get_session_semester");
      bformData.append("id",id);
      const response = await axios.post(
        `${PHP_API_URL}/semester.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200 && response?.data?.data.length > 0) {
        setFormData((prev)=>({
          ...prev,
          updateid:id,
          session: response?.data?.data[0]?.session,
          course: response?.data?.data[0]?.course,
          semester: response?.data?.data[0]?.semester,
          startdate: response?.data?.data[0]?.start_date,
          enddate: response?.data?.data[0]?.end_date ?? response?.data?.data[0]?.end_date ,
        }));
        fetchSemesterBasedOnCourse(response?.data?.data[0]?.course)
      } else {
        toast.error("Data not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      const status = error.response?.data?.status;

      if (status === 400 || status === 401 || status === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  useEffect(() => {
    if (id) {
      updateFetchData(id);
    }
  }, [id]);
  // Handle input field change
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    errorMsg("", "");
    if (!formData.course) {
      errorMsg("course", "Course is required.");
      toast.error("Course is required.");
      return setIsSubmit(false);
    }

    if (!formData.semester) {
      errorMsg("semester", "Semester is required.");
      toast.error("Semester is required.");
      return setIsSubmit(false);
    }
    if (!formData.session) {
      errorMsg("session", "Session is required.");
      toast.error("Session is required.");
      return setIsSubmit(false);
    }
    if (!formData.startdate) {
      errorMsg("startdate", "Start Date is required.");
      toast.error("Start Date Title is required.");
      return setIsSubmit(false);
    }
   

    try {

        const bformData = new FormData();
        Object.keys(formData).forEach((key)=>{
            bformData.append(key,formData[key])
        })
        bformData.append("data","add_session_semester")
        bformData.append("loguserid",secureLocalStorage.getItem("login_id"))
        bformData.append("login_type",secureLocalStorage.getItem("loginType"))

        
      
      const response = await axios.post(
        `${PHP_API_URL}/semester.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        response.data?.status === 200 ||
        response.data?.status === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      const errorField = error.response?.data?.errorField;

      if (status === 400 || status === 401 || status === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.msg);
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };
  const fetchSemesterBasedOnCourse = async (course) => {
    if (
      !course ||
      !Number.isInteger(parseInt(course, 10)) ||
      parseInt(course, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          courseid: course,
          column: "id, semtitle",
        }
      );
      
      if (response?.statusCode === 200 && response.data.length > 0) {
        toast.success(response?.message);
        setSemesterList(response.data);
      } else {
        toast.error("Semester not found.");
        setSemesterList([]);
      }
    } catch (error) {
      setSemesterList([]);
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

  const fetchSessionList = async (deleteStatus = 0) => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/session/fetch`,
        {
          deleteStatus,
          column: "id, dtitle, created_at, status, deleted_at, deleteStatus",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSessionList(response.data);
      } else {
        toast.error("Data not found.");
        setSessionList([]);
      }
    } catch (error) {
      setSessionList([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        setTitleError(error.response.message);
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

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                <a href="/admin/" className="breadcrumb-item">
                                     <i className="fas fa-home m-r-5" />
                                    Dashboard
                                   </a>
                                   <span className="breadcrumb-item active">
                                   Learning Management
                                   </span>
                  
                  <a href="./" className="breadcrumb-item">
                    Session Wise Semester Class
                  </a>
                  
                  <span className="breadcrumb-item active">
                  {id
                        ? "Update Session Wise Semester Class"
                        : "Add Session Wise Semester Class"}
                  </span>
                </nav>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mx-auto">
                <div className="card border-0 bg-transparent mb-2">
                  <div className="card-header border-0 bg-transparent py-1 id-pc-divices-header px-0 id-mobile-divice-d-block">
                    <h5 className="card-title h6_new">
                      {id
                        ? "Update Session Wise Semester Class"
                        : "Add Session Wise Semester Class"}
                    </h5>
                    <div className="ml-auto id-mobile-go-back">
                      <button
                        className="mr-auto btn-md btn border-0 btn-light mr-2"
                        onClick={() => goBack()}
                      >
                        <i className="fas fa-arrow-left" /> Go Back
                      </button>
                       <Link to="/admin/learning-management/session-wise-semester/list">
                                                          <button className="ml-2 btn-md btn border-0 btn-secondary">
                                                            <i className="fas fa-list"></i> Class List
                                                          </button>
                                                        </Link>
                      
                    </div>
                  </div>
                </div>
                <div className="card border-0">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12 form-group">
                          <label className="font-weight-semibold">
                            Course <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={courseListing.map((item) => ({
                              value: item.id,
                              label: item.coursename,
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                course: selectedOption.value,
                              });
                              fetchSemesterBasedOnCourse(selectedOption.value);
                            }}
                            value={
                              courseListing.find(
                                (page) =>
                                  page.id === parseInt(formData.course)
                              )
                                ? {
                                    value: parseInt(formData.course),
                                    label: courseListing.find(
                                      (page) =>
                                        page.id === parseInt(formData.course)
                                    ).coursename,
                                  }
                                : { value: formData.course, label: "Select" }
                            }
                          />
                          {error.field === "course" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-12 col-12 form-group">
                          <label className="font-weight-semibold">
                            Semester <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={semesterList.map((item) => ({
                              value: item.id,
                              label: capitalizeFirstLetter(item.semtitle),
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                semester: selectedOption.value,
                              });
                            }}
                            value={
                              semesterList.find(
                                (item) => item.id === formData.semester
                              )
                                ? {
                                    value: formData.semester,
                                    label: capitalizeFirstLetter(
                                      semesterList.find(
                                        (item) =>
                                          item.id === formData.semester
                                      ).semtitle
                                    ),
                                  }
                                : {
                                    value: formData.semester,
                                    label: "Select",
                                  }
                            }
                          />
                          {error.field === "semester" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        <div className="col-md-12 col-12 form-group">
                          <label className="font-weight-semibold">
                            Session <span className="text-danger">*</span>
                          </label>
                            
                          <Select
                            options={sessionList.map((item) => ({
                              value: item.id,
                              label: capitalizeFirstLetter(item.dtitle),
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                session: selectedOption.value,
                              });
                            }}
                            value={
                              sessionList.find(
                                (item) => item.id === +formData.session
                              )
                                ? {
                                    value: +formData.session,
                                    label: capitalizeFirstLetter(
                                      sessionList.find(
                                        (item) => item.id === +formData.session
                                      ).dtitle
                                    ),
                                  }
                                : {
                                    value: +formData.session,
                                    label: "Select",
                                  }
                            }
                          />
                          {error.field === "session" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                           <FormField
                                              borderError={error.field === "startdate"}
                                              errorMessage={error.field === "startdate" && error.msg}
                                              label="Start Date"
                                              name="startdate"
                                              id="startdate"
                                              type="date"
                                              value={formData.startdate}
                                              onChange={(e)=>{
                                                setFormData((prev)=>({...prev,startdate:e.target.value}))
                                              }}
                                              column="col-md-6"
                                              required
                                            />
                           <FormField
                                             
                                              label="End Date"
                                              name="enddate"
                                              id="enddate"
                                              type="date"
                                              value={formData.enddate}
                                              onChange={(e)=>{
                                                setFormData((prev)=>({...prev,enddate:e.target.value}))
                                              }}
                                              column="col-md-6"
                                              
                                            />
                                            
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
export default AddSessionWiseSemester;
