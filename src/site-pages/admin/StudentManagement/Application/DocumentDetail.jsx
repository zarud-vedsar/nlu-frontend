import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDocument, Step } from "../../../../site-components/student/GetData";
import "../../../../site-components/student/assets/css/custom.css"; // Importing custom CSS for styling.
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import axios from "axios";
import {
  PHP_API_URL,
  NODE_API_URL,
  FILE_API_URL,
} from "../../../../site-components/Helper/Constant";
function DocumentDetail({ sid }) {
  // State declarations
  const initialData = {
    sid: "",
    dtc: "",
    hdtc: "",
    character_certificate: "",
    hcharacter_certificate: "",
    caste_certificate: "",
    hcaste_certificate: "",
  };

  const [formData, setFormData] = useState(initialData); // State for form data.
  const [errors, setErrors] = useState({ field: "", msg: "" }); // For handling and displaying field errors.
  const [previewPdfTc, setPreviewPdfTc] = useState(null);
  const [previewPdfCharacter, setPreviewPdfCharacter] = useState(null);
  const [previewPdfCast, setPreviewPdfCast] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [level, setLevel] = useState();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;
    if (file.type === "application/pdf") {
      if (id === "dtc") {
        setPreviewPdfTc(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, dtc: file }));
      }
      if (id === "character_certificate") {
        setPreviewPdfCharacter(URL.createObjectURL(file));
        setFormData((formData) => ({
          ...formData,
          character_certificate: file,
        }));
      }
      if (id === "caste_certificate") {
        setPreviewPdfCast(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, caste_certificate: file }));
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

    const sendFormData = new FormData();
    for (let key in formData) {
      sendFormData.append(key, formData[key]);
    }
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("data", "admupdatedocumentupload");
    sendFormData.append("dtc", formData.dtc);
    sendFormData.append(
      "character_certificate",
      formData.character_certificate
    );
    sendFormData.append("caste_certificate", formData.caste_certificate);
    sendFormData.append("sid", sid);
    sendFormData.append("selectedcourse", level.id);
    // Append student ID to the form data for update
    try {
      // submit to the API here
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

  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = sid;
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/courseType`,
        formData
      );
      if (response?.data?.statusCode === 200) {
        setLevel(response?.data?.data[0]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getStudentSelectedCourse();
  }, []);

  useEffect(() => {
    if (level?.id) {
      getDocument(level?.id).then((res) => {
        if (res.length > 0) {
            
          setFormData((prev) => ({
            ...prev,
            sid: res[0].sid,
            dtc: res[0].dtc,
            hdtc: res[0].hdtc,
            character_certificate: res[0].character_certificate,
            hcharacter_certificate: res[0].hcharacter_certificate,
            caste_certificate: res[0].caste_certificate,
            hcaste_certificate: res[0].hcaste_certificate,
          }));
          if (res[0].dtc) {
            setShowPreview(true);
          }
          if (res[0].dtc) {
            setPreviewPdfTc(
              `${FILE_API_URL}/student/${sid}${res[0].registrationNo}/${res[0].dtc}`
            );
          }
          if (res[0].character_certificate) {
            setPreviewPdfCharacter(
              `${FILE_API_URL}/student/${sid}${res[0].registrationNo}/${res[0].character_certificate}`
            );
          }
          if (res[0].caste_certificate) {
            setPreviewPdfCast(
              `${FILE_API_URL}/student/${sid}${res[0].registrationNo}/${res[0].caste_certificate}`
            );
          }
        }
      });
    }
  }, [level?.id]);
  return (
    <>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 mb-3">
                <p>
                  <strong>Note:</strong>
                </p>
                <p className="text-danger">
                  Please ensure the following for document uploads:
                </p>
                <ul className="list-group">
                  <li className="item text-danger">
                    Transfer Certificate (TC), Character Certificate, and Caste
                    Certificate (if available) should each be a maximum of 2 MB.
                  </li>
                </ul>
              </div>
              <div className="col-md-10 col-lg-10 col-sm-9 col-9 form-group mb-3">
                <label>
                  Transfer Certificate (TC){" "}
                  <strong className="text-danger">*</strong>
                </label>
                <input
                  type="file"
                  id="dtc"
                  name="dtc"
                  accept=".pdf, .pdfx"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <p className="text-danger mb-0">
                  {errors.field === "dtc" && errors.msg}
                </p>
              </div>
              <div className="col-md-2 col-lg-2 col-sm-3 col-3 form-group mb-3 d-flex justify-content-start align-items-center">
                {previewPdfTc && (
                  <Link target="_blank" to={previewPdfTc}>
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
              <div className="col-md-10 col-lg-10 col-sm-9 col-9 form-group mb-3">
                <label>Character Certificate (CC)</label>
                <input
                  type="file"
                  id="character_certificate"
                  name="character_certificate"
                  accept=".pdf, .pdfx"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <p className="text-danger mb-0">
                  {errors.field === "character_certificate" && errors.msg}
                </p>
              </div>
              <div className="col-md-2 col-lg-2 col-sm-3 col-3 form-group mb-3 d-flex justify-content-start align-items-center">
                {previewPdfCharacter && (
                  <Link target="_blank" to={previewPdfCharacter}>
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
              <div className="col-md-10 col-lg-10 col-sm-9 col-9 form-group mb-3">
                <label>Cast Certificate (CC)</label>
                <input
                  type="file"
                  id="caste_certificate"
                  name="caste_certificate"
                  accept=".pdf, .pdfx"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <p className="text-danger mb-0">
                  {errors.field === "caste_certificate" && errors.msg}
                </p>
              </div>
              <div className="col-md-2 col-lg-2 col-sm-3 col-3 form-group mb-3 d-flex justify-content-start align-items-center">
                {previewPdfCast && (
                  <Link target="_blank" to={previewPdfCast}>
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
              <div className="col-md-12 col-lg-12 col-12 d-flex">
                <button
                  disabled={isSubmit}
                  className="btn btn-dark btn-block"
                  type="submit"
                >
                  Update{" "}
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
    </>
  );
}

export default DocumentDetail;
