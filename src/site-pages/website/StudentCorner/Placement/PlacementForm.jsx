import React, { useEffect, useState } from "react";
import { toast,  } from "react-toastify";
import { PHP_API_URL } from "../../../../site-components/Helper/Constant";
import "../../../../site-components/website/assets/css/JobDetailForm.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { studentRecordById } from "../../../../site-components/student/GetData"; // Importing components and data-fetching functions.
import secureLocalStorage from "react-secure-storage"; // Importing secure storage for storing sensitive data.
import { useParams } from "react-router-dom";
const PlacementForm = () => {
  const initialization = {
    data: "",
    placementid: "",
    studentid: "",
    "app-title": "",
    "app-name": "",
    "app-email": "",
    "app-phone": "",
    "app-alternate-phone": "",
    "app-photo": "",
    "app-resume": "",
    "app-cover-letter": "",
  };

  const { id } = useParams();
  const [formData, setFormData] = useState(initialization);
  const [errorKey, setErrorKey] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const navigate = useNavigate();
  const sid = secureLocalStorage.getItem("studentId"); // Retrieving student ID from secure local storage.

  useEffect(()=>{
    if(!sid){
      navigate(`/student/login`)
    }
  },[])
  useEffect(() => {
    if (sid) {
      studentRecordById(sid).then((res) => {
        if (res.length > 0) {
          setFormData((prev) => ({
            ...prev,
            "app-name": res[0].sname,
            "app-email": res[0].semail,
            "app-phone": res[0].sphone,
            "app-alternate-phone": res[0].salterphone,
            data: "placementfinalapp",
            placementid: id,
            studentid: sid,
          }));
        }
      });
    }
  }, [sid]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const getJobDetails = async () => {
    if (!id) {
      toast.error("Placement ID not found.");
      return;
    }
    try {
      const bformData = new FormData();
      bformData.append("data", "get_placement_by_id");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/placement.php`,
        bformData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        const jobData = response?.data?.data[0];
        if (jobData) {
          setJobDetails(jobData);
        }
      }
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    getJobDetails();
  }, [id]);
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validateForm = () => {
    for (let key in formData) {
      if (
        formData[key] === "" &&
        key !== "app-cover-letter" &&
        key !== "placementid" &&
        key !== "data" &&
        key !== "studentid"
      ) {
        setErrorKey(key);
        setErrorMessage(
          `Please enter ${key.replace("app-", "").replace("-", " ")}`
        );
        toast.error(
          `Please enter ${key.replace("app-", "").replace("-", " ")}`
        );
        return false;
      }
    }
    if (!formData["app-title"]) {
      setErrorKey("app-title");
      setErrorMessage("Please select your title");
      toast.error("Please select your title");
      return false;
    }

    if (formData["app-email"] && !validateEmail(formData["app-email"])) {
      setErrorKey("app-email");
      setErrorMessage("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Validate phone numbers
    if (formData["app-phone"] && !validatePhone(formData["app-phone"])) {
      setErrorKey("app-phone");
      setErrorMessage("Please enter a valid phone number (10 digits).");
      toast.error("Please enter a valid phone number (10 digits).");
      return false;
    }

    if (
      formData["app-alternate-phone"] &&
      !validatePhone(formData["app-alternate-phone"])
    ) {
      setErrorKey("app-alternate-phone");
      setErrorMessage(
        "Please enter a valid alternative phone number (10 digits)."
      );
      toast.error("Please enter a valid alternative phone number (10 digits).");
      return false;
    }

    // Check file validations (size and type)
    if (formData["app-photo"] && formData["app-photo"].size > 2 * 1024 * 1024) {
      setErrorKey("app-photo");
      setErrorMessage("Photo file size exceeds 2MB");
      toast.error("Photo file size exceeds 2MB");
      return false;
    }

    if (
      formData["app-resume"] &&
      formData["app-resume"].size > 2 * 1024 * 1024
    ) {
      setErrorKey("app-resume");
      setErrorMessage("Resume file size exceeds 2MB");
      toast.error("Resume file size exceeds 2MB");
      return false;
    }

    if (
      formData["app-cover-letter"] &&
      formData["app-cover-letter"].size > 2 * 1024 * 1024
    ) {
      setErrorKey("app-cover-letter");
      setErrorMessage("Cover letter file size exceeds 2MB");
      toast.error("Cover letter file size exceeds 2MB");
      return false;
    }

    if (
      formData["app-cover-letter"] &&
      formData["app-cover-letter"].type !== "application/pdf"
    ) {
      setErrorKey("app-cover-letter");
      setErrorMessage("Cover letter must be a PDF file.");
      toast.error("Cover letter must be a PDF file.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const bformData = new FormData();
        Object.keys(formData).forEach((key) => {
          bformData.append(key, formData[key]);
        });

        const response = await axios.post(
          `${PHP_API_URL}/placementApplication.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response?.data?.status === 201) {
          toast.success(response?.data?.msg);

          setFormData(initialization);
          setTimeout(() => {
            navigate("/student/joblist");
          }, 500);
        } else {
          toast.error(response?.data?.msg);
        }
      } catch (e) {
        /* empty */
        if (
          e?.response?.data?.status === 400 ||
          e?.response?.data?.status === 500
        ) {
          toast.error(e?.response?.data?.msg);
        }
      }
    }
  };

  const cancel = (e) => {
    e.preventDefault();

    setFormData(initialization);
    navigate("/career");
  };
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">
                  Application Form - {jobDetails?.position}
                </h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link>
                    </li>{" "}
                    <FaAngleRight />
                    <li>Career</li> <FaAngleRight />
                    <li>{jobDetails?.position}</li> <FaAngleRight />
                    <li>Application Form</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section bg-f5">
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-lg-7 col-12 col-sm-12 mx-auto">
              <div
                className="card border-0 bg-white"
                style={{ width: "100%", maxWidth: "100%" }}
              >
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <h2 className="heading-primary2 butler-regular">
                      {" "}
                      Contact Information{" "}
                    </h2>
                    <p className="heading-para gorditas-regular mb-2">
                      Please provide contact details accurately
                    </p>

                    {/* Title Field */}
                    <div className="form-group">
                      <label>
                        Title<span className="text-danger">*</span>
                      </label>

                      <select
                        name="app-title"
                        id="app-title"
                        className="form-control"
                        value={formData["app-title"]}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option
                          value="Mr."
                          selected={formData["app-title"] == "Mr."}
                        >
                          Mr.
                        </option>
                        <option
                          value="Mrs."
                          selected={formData["app-title"] == "Mrs."}
                        >
                          Mrs.
                        </option>
                        <option
                          value="Miss"
                          selected={formData["app-title"] == "Miss"}
                        >
                          Miss
                        </option>
                        <option
                          value="Doctor"
                          selected={formData["app-title"] == "Doctor"}
                        >
                          Doctor
                        </option>
                      </select>

                      {errorKey === "app-title" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    {/* First Name Field */}
                    <div className="form-group">
                      <label>
                        Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="app-name"
                        className="form-control"
                        value={formData["app-name"]}
                        readOnly
                      />
                      {errorKey === "app-name" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                      <label>
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="app-email"
                        className="form-control"
                        value={formData["app-email"]}
                        readOnly
                      />
                      {errorKey === "app-email" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="form-group">
                      <label>
                        Phone Number<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="app-phone"
                        className="form-control"
                        value={formData["app-phone"]}
                        onChange={handleChange}
                      />
                      {errorKey === "app-phone" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    {/* Alternative Phone Field */}

                    <div className="form-group">
                      <label>
                        Alternative Phone Number
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="app-alternate-phone"
                        className="form-control"
                        value={formData["app-alternate-phone"]}
                        onChange={handleChange}
                      />
                      {errorKey === "app-alternate-phone" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="">
                      <h2 className="heading-primary2 butler-regular">
                        Documents
                      </h2>
                      <p className="heading-para gorditas-regular mb-2">
                        Please add additional documents
                      </p>
                      <p className="heading-para gorditas-regular text-primary mb-2">
                        Note that cover letter is optional{" "}
                      </p>
                      <p className="heading-para gorditas-regular text-primary">
                        Only PDF files upto 2MB are allowed{" "}
                      </p>
                    </div>
                    {/* File Inputs */}
                    <div className="form-group">
                      <label>
                        Photograph<span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        name="app-photo"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/jpeg, image/png, image/gif"
                      />
                      {errorKey === "app-photo" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>
                        Resume<span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        name="app-resume"
                        className="form-control"
                        onChange={handleFileChange}
                        accept=".pdf, .docx"
                      />
                      {errorKey === "app-resume" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Cover letter</label>
                      <input
                        type="file"
                        name="app-cover-letter"
                        className="form-control"
                        onChange={handleFileChange}
                        accept=".pdf, .docx"
                      />
                      {errorKey === "app-cover-letter" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div>
                      <h2 className="heading-primary2 butler-regular">
                        E-Signature
                      </h2>
                      <p className="heading-para gorditas-regular">
                        <strong>Note:</strong> I hereby declare that the
                        information provided is true and complete to the best of
                        my knowledge and belief. If any information is found to
                        be suppressed, misrepresented, or false, I accept
                        responsibility for the consequences and understand that
                        I may be subject to disciplinary action.
                      </p>
                    </div>

                    <div className="space-between">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={cancel}
                      >
                        {" "}
                        <i className="fas fa-angle-left "></i>Cancel
                      </button>
                      <button
                        className="btn  btn-outline-secondary"
                        type="submit"
                      >
                        Submit <i className="fas fa-angle-right"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlacementForm;
