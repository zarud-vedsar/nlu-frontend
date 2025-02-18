// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useState } from "react";
import {
  NODE_API_URL,
  CKEDITOR_URL,
} from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { Link } from "react-router-dom";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor

function TopicAddNew() {
  const initialForm = {
    dbId: "",
    courseid: "",
    semesterid: "",
    subject: "",
    topic_name: "",
    image: "",
    description: ""
  };
  const { topicId } = useParams();
  const [formData, setFormData] = useState(initialForm); // Form state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [subjectListing, setSubjectListing] = useState([]);
  const [previewimage, setPreviewimage] = useState(null);

  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  // Jodit editor configuration
  const config = {
    readonly: false,
    placeholder: 'Enter your description here...',
    spellcheck: true,
    language: 'pt_br',
    defaultMode: '1',
    minHeight: 400,
    maxHeight: -1,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
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
    courseListDropdown();
  }, []);

  const fetchSemesterBasedOnCourse = async (courseid) => {
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
  const updateFetchData = async (topicId) => {
    if (
      !topicId ||
      !Number.isInteger(parseInt(topicId, 10)) ||
      parseInt(topicId, 10) <= 0
    ) {
      toast.error("Invalid ID.");
      return null;
    }
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/topic/fetch`,
        { dbId: topicId }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        toast.success(response.message);
        const data = response.data[0];
        setFormData((prev) => ({
          ...prev,
          dbId: data.id,
          courseid: data.courseid,
          semesterid: data.semesterid,
          subject: data.subject,
          topic_name: data.topic_name,
          description: validator.unescape(data.description || ""),
        }));
        if (data?.image) {
          setFormData((prev) => ({ ...prev, image: data.thumbnail }));
        }
        if (data?.thumbnail) {
          setPreviewimage(data.thumbnail);
        }
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

    if (!formData.subject) {
      errorMsg("subject", "Subject is required.");
      toast.error("Subject is required.");
      return setIsSubmit(false);
    }

    if (!formData.topic_name) {
      errorMsg("topic_name", "Topic Name is required.");
      toast.error("Topic Name is required.");
      return setIsSubmit(false);
    }

    try {
      // submit to the API here

      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      Object.keys(formData).forEach((key) => {
        bformData.append(key, formData[key]);
      });

      const response = await axios.post(
        `${NODE_API_URL}/api/topic/register`,
        bformData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);

        if (response?.data?.statusCode === 201) {
          setFormData({ ...formData, topic_name: "" });
        }
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
    if (topicId) {
      updateFetchData(topicId).then((response) => {
        if (response?.statusCode === 200 && response.data.length > 0) {
          const { courseid, semesterid } = response.data[0];
          fetchSemesterBasedOnCourse(courseid);
          fetchSubjectBasedOnCourseAndSemeter(courseid, semesterid);
        }
      });
    }
  }, [topicId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;
    if (id === "image") {
      if (file.type.startsWith("image/")) {
        setPreviewimage(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, image: file }));
      } else {
        toast.error(
          "Invalid thumbnail format. Only png, jpeg, jpg, and webp are allowed."
        );
      }
    }
  };
  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      description: newContent,
    }));
  }
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

                  <span className="breadcrumb-item">Topic</span>
                  <span className="breadcrumb-item active">
                    {topicId ? "Update Topic" : "Add New Topic"}
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2 col-md-10 m-auto">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {topicId ? "Update Topic" : "Add New Topic"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/topic">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-list"></i> Topic List
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-10 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-3 col-12 form-group">
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
                              const year = selectedOption.year
                                ? selectedOption.year.split(",")
                                : [];
                              fetchSemesterBasedOnCourse(selectedOption.value);
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

                        <div className="col-md-3 col-12 form-group">
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
                                subject: "",
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

                        <div className="col-md-6 col-12 form-group">
                          <label className="font-weight-semibold">
                            Subject <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={subjectListing.map((item) => ({
                              value: item.id,
                              label: capitalizeFirstLetter(item.subject),
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                subject: selectedOption.value,
                              });
                            }}
                            value={
                              subjectListing.find(
                                (item) => item.id === formData.subject
                              )
                                ? {
                                  value: formData.subject,
                                  label: capitalizeFirstLetter(
                                    subjectListing.find(
                                      (item) => item.id === formData.subject
                                    ).subject
                                  ),
                                }
                                : { value: formData.subject, label: "Select" }
                            }
                          />
                          {error.field === "subject" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="form-group col-md-12 col-12">
                          <label>
                            Topic Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={formData.topic_name}
                            placeholder="Enter Topic Name"
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                topic_name: e.target.value,
                              });
                            }}
                          />
                          {error.field === "topic_name" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="form-group col-md-12">
                          <label>Choose Thumbnail</label>
                          <input
                            type="file"
                            id="image"
                            accept=".png, .jpg, .jpeg, .webp"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                          {previewimage && (
                            <img
                              src={previewimage}
                              alt="Preview"
                              className="img-fluid mt-3"
                              style={{ maxHeight: 300 }}
                            />
                          )}
                        </div>

                        <div className="col-md-12 col-lg-12">
                          <label className="font-weight-semibold">
                            Description <span className="text-danger">*</span>
                          </label>
                          <JoditEditor
                            value={formData?.description ? validator.unescape(formData.description) : ""}
                            config={config}
                            
                            onBlur={handleEditorChange}
                          />
                        </div>

                        <div className="col-md-12 col-lg-12 col-12">
                          {!isSubmit ? (
                            <button
                              className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                              type="submit"
                            >
                              Save{" "}
                            </button>
                          ) : (
                            <button
                              className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                              type="submit"
                              disabled
                            >
                              Saving &nbsp;{" "}
                              <div className="loader-circle"></div>
                            </button>
                          )}
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
export default TopicAddNew;
