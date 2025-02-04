import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEducation, Step } from "../../site-components/student/GetData"; // Importing components and data-fetching functions.
import "../../site-components/student/assets/css/custom.css"; // Importing custom CSS for styling.
import { FormField } from "../../site-components/admin/assets/FormField";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import axios from "axios";
import {
  PHP_API_URL,
  FILE_API_URL,
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
function Qualification() {
  // initial data
  const initialData = {
    sid: "",
    hroll: "",
    htotal_marks: "",
    hmarks_obtained: "",
    hpercent: "",
    hboard: "",
    hcollege: "",
    hpassing_year: "",
    hmarksheet: "",
    hhmarksheet: "",
    iroll: "",
    itotal_marks: "",
    imarks_obtained: "",
    ipercent: "",
    iboard: "",
    icollege: "",
    ipassing_year: "",
    imarksheet: "",
    himarksheet: "",
    plroll: "",
    pltotal_marks: "",
    plmarks_obtained: "",
    plpercent: "",
    plboard: "",
    plpassing_year: "",
    plmarksheet: "",
    hplmarksheet: "",
    groll: "",
    gtotal_marks: "",
    gmarks_obtained: "",
    gpercent: "",
    gcollege: "",
    gpassing_year: "",
    gmarksheet: "",
    hgmarksheet: "",
  };
  // State declarations
  const sid = secureLocalStorage.getItem("studentId"); // Retrieving student ID from secure local storage.
  const registrationNo = secureLocalStorage.getItem("registrationNo"); // Retrieving student ID from secure local storage.
  const [formData, setFormData] = useState(initialData); // State for form data.
  const [errors, setErrors] = useState({ field: "", msg: "" }); // For handling and displaying field errors.
  const [previewPdfHigh, setPreviewPdfHigh] = useState(null);
  const [previewPdfInter, setPreviewPdfInter] = useState(null);
  const [previewPdfGraduation, setPreviewPdfGraduation] = useState(null);
  const [previewPdfPostGraduation, setPreviewPdfPostGraduation] =
    useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [document, setDocument] = useState(false);
  const currentYear = new Date().getFullYear() - 3;
  const [level, setLevel] = useState();
  const [notAllowedToEditInformation, setNotAllowedToEditInformation] =
    useState(false);
  const [allowToUploadDocument, setAllowToUploadDocument] = useState();
  const calculatePercentage = (marksObtained, totalMarks) => {
    const percent = (marksObtained / totalMarks) * 100;
    return percent % 1 === 0
      ? percent >= 0
        ? percent
        : 0
      : percent.toFixed(2);
  };
  // Generate years from 2000 to current year
  const years = Array.from(
    { length: currentYear - 1999 + 1 },
    (_, i) => 2000 + i
  );
  const yearsInter = Array.from(
    { length: currentYear + 2 - 1999 + 1 },
    (_, i) => 2000 + i
  );
  const handleChange = (e) => {
    let { name, value } = e.target;
    const checkArray = [
      "hmarks_obtained",
      "htotal_marks",
      "imarks_obtained",
      "itotal_marks",
      "gmarks_obtained",
      "gtotal_marks",
      "plmarks_obtained",
      "pltotal_marks",
    ];
    if (checkArray.some((item) => name.includes(item))) {
      value = value.replace(/[^0-9.]/g, ""); // Allow only numbers and a dot
      if ((value.match(/\./g) || []).length > 1) {
        value = value.slice(0, value.lastIndexOf(".")); // Remove extra dots if any
      }
    }
    setFormData({
      ...formData,
      [name]: value, // Updating formData state dynamically based on input name.
    });
    if (name == "hmarks_obtained" || name === "htotal_marks") {
      setFormData((formData) => ({
        ...formData,
        hpercent: calculatePercentage(
          parseFloat(formData.hmarks_obtained) || 0,
          parseFloat(formData.htotal_marks) || 0
        ),
      }));
    }
    if (name == "imarks_obtained" || name === "itotal_marks") {
      setFormData((formData) => ({
        ...formData,
        ipercent: calculatePercentage(
          parseFloat(formData.imarks_obtained) || 0,
          parseFloat(formData.itotal_marks) || 0
        ),
      }));
    }
    if (name == "gmarks_obtained" || name === "gtotal_marks") {
      setFormData((formData) => ({
        ...formData,
        gpercent: calculatePercentage(
          parseFloat(formData.gmarks_obtained) || 0,
          parseFloat(formData.gtotal_marks) || 0
        ),
      }));
    }
    if (name == "plmarks_obtained" || name === "pltotal_marks") {
      setFormData((formData) => ({
        ...formData,
        plpercent: calculatePercentage(
          parseFloat(formData.plmarks_obtained) || 0,
          parseFloat(formData.pltotal_marks) || 0
        ),
      }));
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;
    if (file.type === "application/pdf") {
      if (id === "hmarksheet") {
        setPreviewPdfHigh(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, hmarksheet: file }));
      }
      if (id === "imarksheet") {
        setPreviewPdfInter(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, imarksheet: file }));
      }
      if (id === "plmarksheet") {
        setPreviewPdfGraduation(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, plmarksheet: file }));
      }
      if (id === "gmarksheet") {
        setPreviewPdfPostGraduation(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, gmarksheet: file }));
      }
    } else {
      toast.error("Invalid PDF format. Only .pdf and .pdfx are allowed.");
    }
  };
  const errorMsg = (field, value) => {
    setErrors((prev) => ({ ...prev, field: field, msg: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    errorMsg("", "");
    setIsSubmit(true);
    const requiredFields = [
      { key: "hroll", message: "High school roll number is required." },
      { key: "htotal_marks", message: "Total marks are required." },
      { key: "hmarks_obtained", message: "Marks obtained are required." },
      { key: "hpercent", message: "Percentage is required." },
      { key: "hboard", message: "Board name is required." },
      { key: "hcollege", message: "School/college name is required." },
      { key: "hpassing_year", message: "Passing year is required." },
      { key: "hmarksheet", message: "Marksheet is required." },
      { key: "iroll", message: "Intermediate roll number is required." },
      { key: "itotal_marks", message: "Total marks are required." },
      { key: "imarks_obtained", message: "Marks obtained are required." },
      { key: "ipercent", message: "Percentage is required." },
      { key: "iboard", message: "Board name is required." },
      { key: "icollege", message: "School/college name is required." },
      { key: "ipassing_year", message: "Passing year is required." },
      { key: "imarksheet", message: "Marksheet is required." },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key]) {
        toast.error(field.message);
        errorMsg(field.key, field.message);
        setIsSubmit(false);
        return;
      }
    }

    if (level?.semtitle !== "semester 1") {
      if (
        !formData?.plroll ||
        !formData?.pltotal_marks ||
        !formData?.plmarks_obtained ||
        !formData?.plpercent ||
        !formData?.plboard ||
        !formData?.plpassing_year ||
        !formData?.plmarksheet
      ) {
        toast.error("Previous semester detail is required");
        setIsSubmit(false);
        return;
      }
    }

    const sendFormData = new FormData();
    for (let key in formData) {
      sendFormData.append(key, formData[key]);
    }
    sendFormData.append("data", "saveeducationaldetails");
    sendFormData.append("hmarksheet", formData.hmarksheet);
    sendFormData.append("imarksheet", formData.imarksheet);
    sendFormData.append("plmarksheet", formData.plmarksheet);
    sendFormData.append("gmarksheet", formData.gmarksheet);
    sendFormData.append("level", level.level);
    sendFormData.append("semtitle", level.semtitle);
    sendFormData.append("selectedcourse", level.id);
    sendFormData.append("sid", sid);

    try {
      const response = await axios.post(
        `${PHP_API_URL}/StudentSet.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 200) {
        toast.success(response.data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      errorMsg("", "");
      setIsSubmit(false);
      if (status === 400 || status === 401 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
        if (error.response.data.key) {
          errorMsg(error.response.data.key, error.response.data.msg);
        }
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };
  const getEducationDetail = (selectedcourse, sid) => {
    getEducation(selectedcourse, sid).then((res) => {
      if (res.length > 0) {
        setFormData((prev) => ({
          ...prev,
          sid: res[0].sid,
          hroll: res[0].hroll,
          htotal_marks: res[0].htotal_marks,
          hmarks_obtained: res[0].hmarks_obtained,
          hpercent: res[0].hpercent,
          hboard: res[0].hboard,
          hcollege: res[0].hcollege,
          hpassing_year: res[0].hpassing_year,
          hmarksheet: res[0].hmarksheet,
          hhmarksheet: res[0].hmarksheet,
          iroll: res[0].iroll,
          itotal_marks: res[0].itotal_marks,
          imarks_obtained: res[0].imarks_obtained,
          ipercent: res[0].ipercent,
          iboard: res[0].iboard,
          icollege: res[0].icollege,
          ipassing_year: res[0].ipassing_year,
          imarksheet: res[0].imarksheet,
          himarksheet: res[0].imarksheet,
          plroll: res[0].plroll,
          pltotal_marks: res[0].pltotal_marks,
          plmarks_obtained: res[0].plmarks_obtained,
          plpercent: res[0].plpercent,
          plboard: res[0].plboard,
          plcollege: res[0].plcollege,
          plpassing_year: res[0].plpassing_year,
          plmarksheet: res[0].plmarksheet,
          hplmarksheet: res[0].plmarksheet,
          groll: res[0].groll,
          gtotal_marks: res[0].gtotal_marks,
          gmarks_obtained: res[0].gmarks_obtained,
          gpercent: res[0].gpercent,
          gcollege: res[0].gcollege,
          gpassing_year: res[0].gpassing_year,
          gmarksheet: res[0].gmarksheet,
          hgmarksheet: res[0].gmarksheet,
          dtc: res[0].dtc ? res[0].dtc : null,
          character_certificate: res[0].character_certificate
            ? res[0].character_certificate
            : null,
          caste_certificate: res[0].caste_certificate
            ? res[0].caste_certificate
            : null,
        }));

        if (
          (res[0].plroll && level?.semtitle !== "semester 1") ||
          (level?.semtitle === "semester 1" &&
            level?.level == "UG" &&
            res[0]?.hroll) ||
          (level?.semtitle === "semester 1" &&
            level?.level == "PG" &&
            res[0]?.groll)
        ) {
          setAllowToUploadDocument(true);
        }
        if (res[0].hroll) {
          setDocument(true);
        }
        if (res[0].imarksheet) {
          setPreviewPdfHigh(
            `${NODE_API_URL}/public/upload/student/${sid}${registrationNo}/${res[0].imarksheet}`
          );
        }
        if (res[0].imarksheet) {
          setPreviewPdfInter(
            `${NODE_API_URL}/public/upload/student/${sid}${registrationNo}/${res[0].imarksheet}`
          );
        }
        if (res[0].plmarksheet) {
          setPreviewPdfGraduation(
            `${NODE_API_URL}/public/upload/student/${sid}${registrationNo}/${res[0].plmarksheet}`
          );
        }
        if (res[0].gmarksheet) {
          setPreviewPdfPostGraduation(
            `${NODE_API_URL}/public/upload/student/${sid}${registrationNo}/${res[0].gmarksheet}`
          );
        }
      }
    });
  };

  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = secureLocalStorage.getItem("studentId");
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/courseType`,
        formData
      );
      if (response?.data?.statusCode === 200) {
        setLevel(response?.data?.data[0]);
        if (response?.data?.data[0]?.semtitle.toLowerCase() !== "semester 1") {
          setNotAllowedToEditInformation(true);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (level?.id) {
      getEducationDetail(level?.id, sid);
    }
  }, [level?.id]);

  useEffect(() => {
    getStudentSelectedCourse();
  }, []);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 text-center">
                <Step /> {/* Step component rendering */}
              </div>
            </div>
            <div className="card bg-transparent">
              <div className="card-header px-0 mb-0 d-flex justify-content-between align-items-center">
                <div>
                  <Link
                    to="/student/course-selection"
                    className="btn btn-primary"
                  >
                    <i className="fas fa-arrow-left"></i> Previous
                  </Link>
                </div>
                <div>
                  {document && allowToUploadDocument && (
                    <Link
                      to="/student/document-upload"
                      className="btn btn-secondary"
                    >
                      Upload Document <i className="fas fa-arrow-right"></i>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title h6_new">Educational Details</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12 mt-2 mb-3">
                      <h6 className="custom">
                        <span className="custo-head">High School Details</span>
                      </h6>
                    </div>
                    {/* Roll No Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "hroll"} // Highlight border if there's an error.
                      errorMessage={errors.field === "hroll" && errors.msg} // Display error message if applicable.
                      label="Roll No"
                      required={true}
                      name="hroll"
                      id="hroll"
                      value={formData.hroll}
                      column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                      readOnly={notAllowedToEditInformation}
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                    />
                    {/* Total Marks Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "htotal_marks"} // Highlight border if there's an error.
                      errorMessage={
                        errors.field === "htotal_marks" && errors.msg
                      } // Display error message if applicable.
                      label="Total Marks"
                      required={true}
                      name="htotal_marks"
                      id="htotal_marks"
                      value={formData.htotal_marks}
                      column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                      readOnly={notAllowedToEditInformation}
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                    />
                    {/* Marks Obtained Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "hmarks_obtained"} // Highlight border if there's an error.
                      errorMessage={
                        errors.field === "hmarks_obtained" && errors.msg
                      } // Display error message if applicable.
                      label="Marks Obtained"
                      required={true}
                      name="hmarks_obtained"
                      id="hmarks_obtained"
                      value={formData.hmarks_obtained}
                      column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                      readOnly={notAllowedToEditInformation}
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                    />
                    {/* Percentage (%) Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "hpercent"} // Highlight border if there's an error.
                      errorMessage={errors.field === "hpercent" && errors.msg} // Display error message if applicable.
                      label="Percentage (%)"
                      readOnly={true}
                      required={true}
                      name="hpercent"
                      id="hpercent"
                      value={formData.hpercent}
                      column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                      onChange={handleChange} // Handle input change.
                    />
                    {/* Board Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "hboard"} // Highlight border if there's an error.
                      errorMessage={errors.field === "hboard" && errors.msg} // Display error message if applicable.
                      label="Board"
                      required={true}
                      name="hboard"
                      id="hboard"
                      value={formData.hboard}
                      column="col-md-4 col-lg-4 col-sm-12 col-12 form-group mb-3"
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                      readOnly={notAllowedToEditInformation}
                    />
                    {/* School/College/Institution Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "hcollege"} // Highlight border if there's an error.
                      errorMessage={errors.field === "hcollege" && errors.msg} // Display error message if applicable.
                      label="School/College/Institution"
                      required={true}
                      name="hcollege"
                      id="hcollege"
                      value={formData.hcollege}
                      column="col-md-5 col-lg-5 col-sm-12 col-12 form-group mb-3"
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                      readOnly={notAllowedToEditInformation}
                    />
                    <div className="col-md-2 form-group">
                      <label
                        htmlFor="hpassing_year"
                        className="font-weight-semibold"
                      >
                        Passing year <strong className="text-danger">*</strong>
                      </label>
                      <select
                        name="hpassing_year"
                        id="hpassing_year"
                        className="form-control select2"
                        value={formData.hpassing_year}
                        onChange={(e) => {
                          if (!notAllowedToEditInformation) {
                            handleChange(e);
                          }
                        }}
                        disabled={notAllowedToEditInformation}
                      >
                        <option value="">Select</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <span className="text-danger">
                        {errors.field === "hpassing_year" && errors.msg}
                      </span>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-9 col-9 form-group mb-3">
                      <label>Upload Marksheet/Certificate</label>
                      <input
                        type="file"
                        id="hmarksheet"
                        name="hmarksheet"
                        accept=".pdf, .pdfx"
                        className="form-control"
                        onChange={(e) => {
                          if (!notAllowedToEditInformation) {
                            handleFileChange(e);
                          }
                        }}
                        disabled={notAllowedToEditInformation}
                      />
                      <p className="text-danger mb-0">
                        {errors.field === "hmarksheet" && errors.msg}
                      </p>
                    </div>
                    <div className="col-md-1 col-lg-1 col-sm-3 col-3 form-group mb-3 d-flex justify-content-start align-items-center">
                      {previewPdfHigh && (
                        <Link target="_blank" to={previewPdfHigh}>
                          <button
                            type="button"
                            className="btn btn-secondary text-white mt-4"
                          >
                            {" "}
                            <i className="fas fa-eye text-white"></i>{" "}
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-2 mb-3">
                      <h6 className="custom">
                        <span className="custo-head">Intermediate Details</span>
                      </h6>
                    </div>
                    {/* Roll No Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "iroll"} // Highlight border if there's an error.
                      errorMessage={errors.field === "iroll" && errors.msg} // Display error message if applicable.
                      label="Roll No"
                      required={true}
                      name="iroll"
                      id="iroll"
                      value={formData.iroll}
                      column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                      readOnly={notAllowedToEditInformation}
                    />
                    {/* Total Marks Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "itotal_marks"} // Highlight border if there's an error.
                      errorMessage={
                        errors.field === "itotal_marks" && errors.msg
                      } // Display error message if applicable.
                      label="Total Marks"
                      required={true}
                      name="itotal_marks"
                      id="itotal_marks"
                      value={formData.itotal_marks}
                      column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                      readOnly={notAllowedToEditInformation}
                    />
                    {/* Marks Obtained Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "imarks_obtained"} // Highlight border if there's an error.
                      errorMessage={
                        errors.field === "imarks_obtained" && errors.msg
                      } // Display error message if applicable.
                      label="Marks Obtained"
                      required={true}
                      name="imarks_obtained"
                      id="imarks_obtained"
                      value={formData.imarks_obtained}
                      column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                      readOnly={notAllowedToEditInformation}
                    />
                    {/* Percentage (%) Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "ipercent"} // Highlight border if there's an error.
                      errorMessage={errors.field === "ipercent" && errors.msg} // Display error message if applicable.
                      label="Percentage (%)"
                      readOnly={true}
                      required={true}
                      name="ipercent"
                      id="ipercent"
                      value={formData.ipercent}
                      column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                      onChange={handleChange} // Handle input change.
                    />
                    {/* Board Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "iboard"} // Highlight border if there's an error.
                      errorMessage={errors.field === "iboard" && errors.msg} // Display error message if applicable.
                      label="Board"
                      required={true}
                      name="iboard"
                      id="iboard"
                      value={formData.iboard}
                      column="col-md-4 col-lg-4 col-sm-12 col-12 form-group mb-3"
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                      readOnly={notAllowedToEditInformation}
                    />
                    {/* School/College/Institution Input Field */}
                    <FormField
                      bottom={true}
                      borderError={errors.field === "icollege"} // Highlight border if there's an error.
                      errorMessage={errors.field === "icollege" && errors.msg} // Display error message if applicable.
                      label="School/College/Institution"
                      required={true}
                      name="icollege"
                      id="icollege"
                      value={formData.icollege}
                      column="col-md-5 col-lg-5 col-sm-12 col-12 form-group mb-3"
                      onChange={(e) => {
                        if (!notAllowedToEditInformation) {
                          handleChange(e);
                        }
                      }}
                      readOnly={notAllowedToEditInformation}
                    />
                    <div className="col-md-2 form-group">
                      <label
                        htmlFor="ipassing_year"
                        className="font-weight-semibold"
                      >
                        Passing year <strong className="text-danger">*</strong>
                      </label>
                      <select
                        name="ipassing_year"
                        id="ipassing_year"
                        className="form-control select2"
                        value={formData.ipassing_year}
                        onChange={(e) => {
                          if (!notAllowedToEditInformation) {
                            handleChange(e);
                          }
                        }}
                        disabled={notAllowedToEditInformation}
                      >
                        <option value="">Select</option>
                        {yearsInter.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <span className="text-danger">
                        {errors.field === "ipassing_year" && errors.msg}
                      </span>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-9 col-9 form-group mb-3">
                      <label>Upload Marksheet/Certificate</label>
                      <input
                        type="file"
                        id="imarksheet"
                        name="imarksheet"
                        accept=".pdf, .pdfx"
                        className="form-control"
                        onChange={(e) => {
                          if (!notAllowedToEditInformation) {
                            handleFileChange(e);
                          }
                        }}
                        disabled={notAllowedToEditInformation}
                      />
                      <p className="text-danger mb-0">
                        {errors.field === "imarksheet" && errors.msg}
                      </p>
                    </div>
                    <div className="col-md-1 col-lg-1 col-sm-3 col-3 form-group mb-3 d-flex justify-content-start align-items-center">
                      {previewPdfInter && (
                        <Link target="_blank" to={previewPdfInter}>
                          <button
                            type="button"
                            className="btn btn-secondary text-white mt-4"
                          >
                            {" "}
                            <i className="fas fa-eye text-white"></i>{" "}
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                  {level?.semtitle !== "semester 1" && (
                    <div className="row">
                      <div className="col-md-12 mt-2 mb-3">
                        <h6 className="custom font-12 mt-2">
                          <span className="custo-head">
                            Previous Passing Semester/Year Details
                          </span>
                        </h6>
                        <p>
                          <strong>Note:</strong>{" "}
                          <span className="text-danger">
                            All students are required to fill in the details
                            provided below, except for the 1st semester.
                          </span>
                        </p>
                        <p>
                          <strong>नोट:</strong>{" "}
                          <span className="text-danger">
                            1st सेमेस्टर के अलावा सभी विद्यार्थियों को नीचे दिए
                            गए विवरण भरना अनिवार्य है।
                          </span>
                        </p>
                      </div>
                      {/* Roll No Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "plroll"} // Highlight border if there's an error.
                        errorMessage={errors.field === "plroll" && errors.msg} // Display error message if applicable.
                        label="Roll No"
                        required={true}
                        name="plroll"
                        id="plroll"
                        value={formData.plroll}
                        column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                        onChange={handleChange} // Handle input change.
                      />
                      {/* Total Marks Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "pltotal_marks"} // Highlight border if there's an error.
                        errorMessage={
                          errors.field === "pltotal_marks" && errors.msg
                        } // Display error message if applicable.
                        label="Total Marks"
                        required={true}
                        name="pltotal_marks"
                        id="pltotal_marks"
                        value={formData.pltotal_marks}
                        column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                        onChange={handleChange} // Handle input change.
                      />
                      {/* Marks Obtained Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "plmarks_obtained"} // Highlight border if there's an error.
                        errorMessage={
                          errors.field === "plmarks_obtained" && errors.msg
                        } // Display error message if applicable.
                        label="Marks Obtained"
                        required={true}
                        name="plmarks_obtained"
                        id="plmarks_obtained"
                        value={formData.plmarks_obtained}
                        column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                        onChange={handleChange} // Handle input change.
                      />
                      {/* Percentage (%) Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "plpercent"} // Highlight border if there's an error.
                        errorMessage={
                          errors.field === "plpercent" && errors.msg
                        } // Display error message if applicable.
                        label="Percentage (%)"
                        readOnly={true}
                        required={true}
                        name="plpercent"
                        id="plpercent"
                        value={formData.plpercent}
                        column="col-md-2 col-lg-2 col-sm-12 col-12 form-group mb-3"
                        onChange={handleChange} // Handle input change.
                      />
                      {/* Board Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "plboard"} // Highlight border if there's an error.
                        errorMessage={errors.field === "plboard" && errors.msg} // Display error message if applicable.
                        label="Board"
                        required={true}
                        name="plboard"
                        id="plboard"
                        value={formData.plboard}
                        column="col-md-4 col-lg-4 col-sm-12 col-12 form-group mb-3"
                        onChange={handleChange} // Handle input change.
                      />
                      {/* College/Institution/University Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "plcollege"} // Highlight border if there's an error.
                        errorMessage={
                          errors.field === "plcollege" && errors.msg
                        } // Display error message if applicable.
                        label="College/Institution/University"
                        required={true}
                        name="plcollege"
                        id="plcollege"
                        value={formData.plcollege}
                        column="col-md-5 col-lg-5 col-sm-12 col-12 form-group mb-3"
                        onChange={handleChange} // Handle input change.
                      />
                      <div className="col-md-2 form-group">
                        <label
                          htmlFor="plpassing_year"
                          className="font-weight-semibold"
                        >
                          Passing year{" "}
                          <strong className="text-danger">*</strong>
                        </label>
                        <select
                          name="plpassing_year"
                          id="plpassing_year"
                          className="form-control select2"
                          value={formData.plpassing_year}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {yearsInter.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {errors.field === "plpassing_year" && errors.msg}
                        </span>
                      </div>
                      <div className="col-md-4 col-lg-4 col-sm-9 col-9 form-group mb-3">
                        <label>Upload Marksheet/Certificate</label>
                        <input
                          type="file"
                          id="plmarksheet"
                          name="plmarksheet"
                          accept=".pdf, .pdfx"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                        <p className="text-danger mb-0">
                          {errors.field === "plmarksheet" && errors.msg}
                        </p>
                      </div>
                      <div className="col-md-1 col-lg-1 col-sm-3 col-3 form-group mb-3 d-flex justify-content-start align-items-center">
                        {previewPdfGraduation && (
                          <Link target="_blank" to={previewPdfGraduation}>
                            <button
                              type="button"
                              className="btn btn-secondary text-white mt-4"
                            >
                              {" "}
                              <i className="fas fa-eye text-white"></i>{" "}
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                  {level?.level === "PG" && (
                    <div className="row">
                      <div className="col-md-12 mt-2 mb-3">
                        <h6 className="custom">
                          <span className="custo-head">Graduation Details</span>
                        </h6>
                        <p className="text-danger">
                          (For those students who are applying for postgraduate
                          courses)
                        </p>
                      </div>
                      {/* Roll No Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "groll"} // Highlight border if there's an error.
                        errorMessage={errors.field === "groll" && errors.msg} // Display error message if applicable.
                        label="Roll No"
                        required={true}
                        name="groll"
                        id="groll"
                        value={formData.groll}
                        column="col-md-3 col-lg-3 col-sm-12 col-12 form-group mb-3"
                        onChange={(e) => {
                          if (!notAllowedToEditInformation) {
                            handleChange(e);
                          }
                        }}
                        readOnly={notAllowedToEditInformation}
                      />
                      {/* Total Marks Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "gtotal_marks"} // Highlight border if there's an error.
                        errorMessage={
                          errors.field === "gtotal_marks" && errors.msg
                        } // Display error message if applicable.
                        label="Total Marks"
                        required={true}
                        name="gtotal_marks"
                        id="gtotal_marks"
                        value={formData.gtotal_marks}
                        column="col-md-3 col-lg-3 col-sm-12 col-12 form-group mb-3"
                        onChange={(e) => {
                          if (!notAllowedToEditInformation) {
                            handleChange(e);
                          }
                        }}
                        readOnly={notAllowedToEditInformation}
                      />
                      {/* Marks Obtained Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "gmarks_obtained"} // Highlight border if there's an error.
                        errorMessage={
                          errors.field === "gmarks_obtained" && errors.msg
                        } // Display error message if applicable.
                        label="Marks Obtained"
                        required={true}
                        name="gmarks_obtained"
                        id="gmarks_obtained"
                        value={formData.gmarks_obtained}
                        column="col-md-3 col-lg-3 col-sm-12 col-12 form-group mb-3"
                        onChange={(e) => {
                          if (!notAllowedToEditInformation) {
                            handleChange(e);
                          }
                        }}
                        readOnly={notAllowedToEditInformation}
                      />
                      {/* Percentage (%) Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "gpercent"} // Highlight border if there's an error.
                        errorMessage={errors.field === "gpercent" && errors.msg} // Display error message if applicable.
                        label="Percentage (%)"
                        readOnly={true}
                        required={true}
                        name="gpercent"
                        id="gpercent"
                        value={formData.gpercent}
                        column="col-md-3 col-lg-3 col-sm-12 col-12 form-group mb-3"
                        onChange={handleChange} // Handle input change.
                      />

                      {/* College/Institution/University Input Field */}
                      <FormField
                        bottom={true}
                        borderError={errors.field === "gcollege"} // Highlight border if there's an error.
                        errorMessage={errors.field === "gcollege" && errors.msg} // Display error message if applicable.
                        label="College/Institution/University"
                        required={true}
                        name="gcollege"
                        id="gcollege"
                        value={formData.gcollege}
                        column="col-md-5 col-lg-5 col-sm-12 col-12 form-group mb-3"
                        onChange={(e) => {
                          if (!notAllowedToEditInformation) {
                            handleChange(e);
                          }
                        }}
                        readOnly={notAllowedToEditInformation}
                      />
                      <div className="col-md-2 form-group">
                        <label
                          htmlFor="gpassing_year"
                          className="font-weight-semibold"
                        >
                          Passing year{" "}
                          <strong className="text-danger">*</strong>
                        </label>
                        <select
                          name="gpassing_year"
                          id="gpassing_year"
                          className="form-control select2"
                          value={formData.gpassing_year}
                          onChange={(e) => {
                            if (!notAllowedToEditInformation) {
                              handleChange(e);
                            }
                          }}
                          disabled={notAllowedToEditInformation}
                        >
                          <option value="">Select</option>
                          {yearsInter.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {errors.field === "gpassing_year" && errors.msg}
                        </span>
                      </div>
                      <div className="col-md-4 col-lg-4 col-sm-9 col-9 form-group mb-3">
                        <label>Upload Marksheet/Certificate</label>
                        <input
                          type="file"
                          id="gmarksheet"
                          name="gmarksheet"
                          accept=".pdf, .pdfx"
                          className="form-control"
                          onChange={(e) => {
                            if (!notAllowedToEditInformation) {
                              handleFileChange(e);
                            }
                          }}
                          disabled={notAllowedToEditInformation}
                        />
                        <p className="text-danger mb-0">
                          {errors.field === "gpassing_year" && errors.msg}
                        </p>
                      </div>
                      <div className="col-md-1 col-lg-1 col-sm-3 col-3 form-group mb-3 d-flex justify-content-start align-items-center">
                        {previewPdfPostGraduation && (
                          <Link target="_blank" to={previewPdfPostGraduation}>
                            <button
                              type="button"
                              className="btn btn-secondary text-white mt-4"
                            >
                              {" "}
                              <i className="fas fa-eye text-white"></i>{" "}
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-12">
                      <button
                        disabled={isSubmit}
                        className="btn btn-dark w-100 d-flex justify-content-center align-items-center"
                        type="submit"
                      >
                        Save{" "}
                        {isSubmit && (
                          <>
                            &nbsp; <div className="loader-circle"></div>
                          </>
                        )}
                      </button>
                      {/* {document && (
                          <Link
                            to="/student/document-upload"
                            className="btn btn-secondary"
                          >
                            Upload Document{" "}
                            <i className="fas fa-arrow-right"></i>
                          </Link>
                        )} */}
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

export default Qualification;
