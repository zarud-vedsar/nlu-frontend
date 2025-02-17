import React, { useCallback, useEffect, useState } from "react";
import { NODE_API_URL, CKEDITOR_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  dataFetchingPost,
  goBack,
} from "../../site-components/Helper/HelperFunction";
import Select from "react-select";
import {
  FormField,
  TextareaField,
} from "../../site-components/admin/assets/FormField";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor

function CourseAdd() {
  // Initial form state
  const initialForm = {
    dbId: "",
    department_id: "",
    coursecode: "",
    coursename: "",
    qualification: "",
    duration: [],
    medium: "",
    level: "",
    description: "",
    short_description: "",
    pdf_file: "",
    thumbnail: "",
  };
  const { courseId } = useParams();
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState(initialForm); // Form state
  const [department, setDepartment] = useState([]); // Department list
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [error, setError] = useState({ field: "", msg: "" }); // Error state

  const qualifications = [
    "High School",
    "Intermediate",
    "Diploma",
    "Graduation",
    "Post-graduation",
  ];
  const courseDuration = [1, 2, 3, 4, 5, 6];
  const courseMedium = ["Hindi", "English", "Hindi + English"];
  const [previewPdf, setPreviewPdf] = useState(null);
  // Jodit editor configuration
  const config = {
    readonly: false,
    placeholder: '',
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
  // Fetch department list
  const fetchDepartmentList = async (deleteStatus = 0) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/department/fetch`,
        {
          deleteStatus,
          column: "id, dtitle",
          status: 1,
        }
      );
      if (response.statusCode === 200) {
        setDepartment(response.data || []);
      } else {
        toast.error("No department data found.");
      }
    } catch (error) {
      toast.error("Error fetching departments. Check your connection.");
    }
  };

  useEffect(() => {
    fetchDepartmentList(); // Load departments on mount
  }, []);
  const updateFetchData = async (courseId) => {
    if (
      !courseId ||
      !Number.isInteger(parseInt(courseId, 10)) ||
      parseInt(courseId, 10) <= 0
    )
      return toast.error("Invalid ID.");

    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/course/fetch`,
        { dbId: courseId }
      );
      
      if (response?.statusCode === 200 && response.data.length > 0) {
        toast.success(response.message);
        setFormData((prev) => ({
          ...prev,
          dbId: response.data[0].id,
          department_id: response.data[0].department_id,
          short_description: validator.unescape(
            response.data[0].short_description
          ),
          coursename: response.data[0].coursename,
          coursecode: response.data[0].coursecode,
          qualification: response.data[0].qualification,
          duration: response.data[0].duration
            ? response.data[0].duration.split(",")
            : [response.data[0].duration],
          medium: response.data[0].medium,
          level: response.data[0].level,
          description: validator.unescape(response.data[0].description),
          pdf_file: validator.unescape(response.data[0].pdf_file),
          thumbnail: validator.unescape(response.data[0].thumbnail),
        }));
        setPreviewPdf(validator.unescape(response.data[0].pdf_file));
        setPreviewImage(validator.unescape(response.data[0].thumbnail));
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
  useEffect(() => {
    if (courseId) {
      updateFetchData(courseId);
    }
  }, [courseId]);
  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;
    if (id === "pdf_file") {
      if (file.type === "application/pdf") {
        setPreviewPdf(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, pdf_file: file }));
      } else {
        toast.error("Invalid PDF format. Only .pdf and .pdfx are allowed.");
      }
    }
    if (id === "thumbnail") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, thumbnail: file }));
      } else {
        toast.error(
          "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
        );
      }
    }
  };
  // Duration (multi-select) handler
  const handleDurationChange = (selectedOption) => {
    setFormData({
      ...formData,
      duration: selectedOption
        ? selectedOption.map((option) => option.value)
        : [],
    });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setError((prev) => ({
      ...prev,
      field: "",
      msg: "",
    }));

    if (!formData.department_id) {
      toast.error("Department is required.");
      errorMsg("department_id", "Department is required.");
      return setIsSubmit(false);
    }
    if (!formData.coursename) {
      toast.error("Course Name is required.");
      errorMsg("coursename", "Course name is required.");
      return setIsSubmit(false);
    }
    if (!formData.qualification) {
      toast.error("Qualification is required.");
      errorMsg("qualification", "Qualification is required.");
      return setIsSubmit(false);
    }
    if (!formData.duration || formData.duration.length === 0) {
      toast.error("Duration is required.");
      errorMsg("duration", "Duration is required.");
      return setIsSubmit(false);
    }
    if (!formData.medium) {
      toast.error("Medium is required.");
      errorMsg("medium", "Medium is required.");
      return setIsSubmit(false);
    }
    if (!formData.level) {
      toast.error("Level is required.");
      errorMsg("level", "Level is required.");
      return setIsSubmit(false);
    }
    if (!formData.short_description) {
      toast.error("Short Description is required.");
      errorMsg("short_description", "Short Description is required.");
      return setIsSubmit(false);
    }
    const highLevelData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "pdf_file") highLevelData.append(key, value);
    });
    highLevelData.append("pdf_file", formData.pdf_file);
    highLevelData.append("loguserid", secureLocalStorage.getItem("login_id"));
    highLevelData.append("login_type", secureLocalStorage.getItem("loginType"));

    try {
      // submit to the API here
      const response = await axios.post(
        `${NODE_API_URL}/api/course/register`,
        highLevelData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        if (response.data?.statusCode === 201) {
          // Reset form data to initial state
          setFormData({ ...initialForm });
        }
        else if (response.data?.statusCode === 200) {
          // Reset form data to initial state
          setFormData({ ...initialForm });
          goBack();
        }
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

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      description: newContent
    }))
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
                    <i className="fas fa-home m-r-5" /> Learning Management
                  </a>

                  <span className="breadcrumb-item">Course</span>
                  <span className="breadcrumb-item active">{courseId ? "Update Course" : "Add Course"}</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {courseId ? "Update Course" : "Add Course"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link
                    to="/admin/course"
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-list" /> Course List
                  </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Department Selector */}
                    <div className="col-md-4 form-group">
                      <label className="font-weight-semibold">
                        Department <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={department.map((item) => ({
                          value: item.id,
                          label: item.dtitle,
                        }))}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            department_id: selectedOption.value,
                          })
                        }
                        value={
                          department.find(
                            (page) =>
                              page.id === parseInt(formData.department_id)
                          )
                            ? {
                              value: parseInt(formData.department_id),
                              label: department.find(
                                (page) =>
                                  page.id === parseInt(formData.department_id)
                              ).dtitle,
                            }
                            : { value: formData.department_id, label: "Select" }
                        }
                      />
                      {error.field === "department_id" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>

                    {/* Course Code */}
                    <FormField
                      borderError={error.field === "coursecode"}
                      errorMessage={error.field === "coursecode" && error.msg}
                      label="Course Code"
                      name="coursecode"
                      id="coursecode"
                      value={formData.coursecode}
                      onChange={handleChange}
                      column="col-md-4"
                    />

                    {/* Course Name */}
                    <FormField
                      borderError={error.field === "coursename"}
                      errorMessage={error.field === "coursename" && error.msg}
                      label="Course Name"
                      name="coursename"
                      id="coursename"
                      value={formData.coursename}
                      onChange={handleChange}
                      column="col-md-4"
                      required
                    />

                    {/* Qualification */}
                    <div className="col-md-3 form-group">
                      <label className="font-weight-semibold">
                        Qualification <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={qualifications.map((item) => ({
                          value: item,
                          label: item,
                        }))}
                        value={
                          qualifications.find(
                            (item) => item == formData.qualification
                          )
                            ? {
                              value: formData.qualification,
                              label: formData.qualification,
                            }
                            : { value: formData.qualification, label: "Select" }
                        }
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            qualification: selectedOption.value,
                          })
                        }
                      />
                      {error.field === "qualification" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>

                    {/* Other Fields */}
                    {/* Course Duration */}
                    <div className="col-md-3 form-group">
                      <label className="font-weight-semibold">
                        Duration (Years) <span className="text-danger">*</span>
                      </label>
                      <Select
                        isMulti
                        options={courseDuration.map((item) => ({
                          value: item,
                          label: `${item} year(s)`,
                        }))}
                        onChange={handleDurationChange} // Handle multi-select change
                        value={formData.duration.map((duration) => ({
                          value: duration,
                          label: `${duration} year(s)`,
                        }))}
                      />
                      {error.field === "duration" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>

                    {/* Medium */}
                    <div className="col-md-3 form-group">
                      <label className="font-weight-semibold">
                        Medium <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={courseMedium.map((item) => ({
                          value: item,
                          label: item,
                        }))}
                        value={
                          courseMedium.find((item) => item == formData.medium)
                            ? {
                              value: formData.medium,
                              label: formData.medium,
                            }
                            : { value: formData.medium, label: "Select" }
                        }
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            medium: selectedOption.value,
                          })
                        }
                      />
                      {error.field === "medium" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>

                    {/* Level */}
                    <div className="col-md-3 form-group">
                      <label className="font-weight-semibold">
                        Level <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={[
                          { value: "UG", label: "Undergraduate (UG)" },
                          { value: "PG", label: "Postgraduate (PG)" },
                        ]}
                        value={
                          formData.level
                            ? {
                              value: formData.level,
                              label: formData.level,
                            }
                            : { value: formData.level, label: "Select" }
                        }
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            level: selectedOption.value,
                          })
                        }
                      />
                      {error.field === "level" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>
                    <div className="form-group col-md-12">
                      <label>Choose Thumbnail</label>
                      <input
                        type="file"
                        id="thumbnail"
                        accept=".png, .jpg, .jpeg, .webp"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="img-fluid mt-3"
                          style={{ maxHeight: 300 }}
                        />
                      )}
                    </div>
                    <div className="col-md-12 form-group">
                      <label>Upload Pdf</label>
                      <input
                        type="file"
                        id="pdf_file"
                        accept=".pdf"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    {previewPdf && (
                      <div className="col-md-12 form-group">
                        <iframe
                          src={previewPdf}
                          title="PDF Preview"
                          className="mt-3"
                          style={{ width: "100%", height: 300 }}
                        ></iframe>
                      </div>
                    )}

                    <TextareaField
                      borderError={error.field === "short_description"}
                      errorMessage={
                        error.field === "short_description" && error.msg
                      }
                      label="Short Description (Max 15 words)"
                      name="short_description"
                      id="short_description"
                      required={true}
                      value={formData.short_description}
                      onChange={handleChange}
                      column="col-md-12 form-group"
                    />

                    <div className='col-md-12 '>
                      {/* JoditEditor component */}
                      <label className='font-weight-semibold'>Description</label>
                      <JoditEditor
                        value={formData?.description || ''}
                        config={config}
                        onBlur={handleEditorChange}
                      />
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
    </>
  );
}
export default CourseAdd;
