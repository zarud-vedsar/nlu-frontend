// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { PHP_API_URL } from "../../../site-components/Helper/Constant";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

function SubjectsAssignedFaculty() {
  // Initial form state
  const initialForm = {
    loguserid: "",
    login_type: "",
    dbId: "",
    courseid: "",
    semesterid: "",
    subjects: "",
    facultyId: "",
  };
  const { dbId } = useParams();
  console.log(dbId);
  const [formData, setFormData] = useState(initialForm); // Form state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [facultyListing, setFacultyListing] = useState([]); // fetch faculty data
  const [subjectListing, setSubjectListing] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state

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
  
  const fetchSubjectBasedOnCourseAndSemeter = async (courseid, semesterid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          column: "id, subject",
        }
      );
      console.log(response)
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSubjectListing(response.data);
      } else {
        toast.error("Semester not found.");
        setSubjectListing([]);
      }
    } catch (error) {
      setSubjectListing([]);
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

  const updateFetchData = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    ) {
      toast.error("Invalid ID.");
      return null;
    }
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/time-table/table-chart/assigned-faculty-list`,
        { dbId , all: true}
      );
       console.log(response)
      if (response?.statusCode === 200 && response.data.length > 0) {
        toast.success(response.message);
        const data = response.data[0];
        setFormData((prev) => ({
          ...prev,
          dbId: data.id,
          courseid: data.courseid,
          semesterid: data.semesterid,
          subjects: data.subjectList?.map((subject)=>subject.id),
          facultyId: data.facultyId,
        }));
        console.log(data)
        return response;
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {

      console.error("Error:", error);
      return null;
    }
  };

  const loadFacultyData = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_userPage");
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      // Assuming response.data.data contains the faculty data
      setFacultyListing(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacultyData();
  }, []);

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

    if (!formData.subjects) {
      errorMsg("subjects", "Subjects is required.");
      toast.error("Subjects is required.");
      return setIsSubmit(false);
    }
    if (!formData.facultyId) {
      errorMsg("facultyId", "Faculty is required.");
      toast.error("facultyId is required.");
      return setIsSubmit(false);
    }

    try {
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      // submit to the API here
      const response = await axios.post(
        `${NODE_API_URL}/api/time-table/table-chart/assigned-faculty`,
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
  useEffect(() => {
    if (dbId) {
      updateFetchData(dbId).then((response) => {
        if (response?.statusCode === 200 && response.data.length > 0) {
          const { courseid,semesterid } = response.data[0];
          console.log(response?.data[0])
          fetchSemesterBasedOnCourseAndYear(courseid);
          fetchSubjectBasedOnCourseAndSemeter(
            courseid,
            semesterid
          );
        }
      });
    }
  }, [dbId]);


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
                  <span className="breadcrumb-item">Time Table Management</span>
                  <span className="breadcrumb-item">Assigned Subject To Faculty</span>
                  <span className="breadcrumb-item active">
                  Add Subject To Faculty
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {dbId ? "Update Subjects " : " Add Subject To Faculty"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <a href="/admin/subjects-assinged-faculty-list">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-list"></i> Subject List
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
                        {/* faculty data */}
                        <div className="form-group col-md-12 col-12">
                          <label>
                            Faculty <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={facultyListing.map((faculty) => ({
                              value: faculty.id, // Use faculty id as the value
                              label: `${faculty.first_name} ${faculty.last_name}`, // Assuming faculty has first_name and last_name fields
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                facultyId: selectedOption.value, // Save selected faculty id
                              });
                            }}
                            value={
                              facultyListing.find(
                                (faculty) => faculty.id === formData.facultyId
                              )
                                ? {
                                    value: formData.facultyId,
                                    label: `${
                                      facultyListing.find(
                                        (faculty) =>
                                          faculty.id === formData.facultyId
                                      ).first_name
                                    } ${
                                      facultyListing.find(
                                        (faculty) =>
                                          faculty.id === formData.facultyId
                                      ).last_name
                                    }`,
                                  }
                                : {
                                    value: formData.facultyId,
                                    label: "Select",
                                  }
                            }
                          />
                          {error.field === "facultyId" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
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
                              fetchSubjectBasedOnCourseAndSemeter(
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

                          
                        <div className="form-group col-md-12 col-12">
                          <label>
                            Subjects <span className="text-danger">*</span>
                          </label>
                          {console.log(formData?.subjects)}
                          {console.log(subjectListing)}
                          <Select
                            isMulti
                            options={subjectListing.map((item) => ({
                              value: item.id,
                              label: capitalizeFirstLetter(item.subject),
                            }))}
                            onChange={(selectedOptions) => {
                                                const updatedData = {
                                                  ...formData,
                                                  subjects: selectedOptions.map((option) => option.value),
                                                };
                                                setFormData(updatedData);
                                              }}
                                              value={
                                                formData?.subjects && subjectListing?.length && 
                                                formData.subjects?.length
                                                  ? formData.subjects.map((value) => ({
                                                      value,
                                                      label: capitalizeFirstLetter(subjectListing?.find((subject)=>subject?.id==value).subject),
                                                    }))
                                                  : []
                                              }
                            
                          />
                          {error.field === "subject" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        
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
export default SubjectsAssignedFaculty;
