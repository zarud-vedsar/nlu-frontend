import React, { useState } from "react";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { toast, ToastContainer } from "react-toastify";
import ImgBg from "../../site-components/website/assets/Images/grievance.webp";
import { FaAngleRight, FaRegMessage, FaRegUser } from "react-icons/fa6";
import { MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";
import { GiCalendarHalfYear } from "react-icons/gi";
import { Link } from "react-router-dom";

const Grievance = () => {
  // State for form data and errors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    year_semester: "",
    message: "",
    upload_file: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // To store specific field errors

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to count the words in the message
  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Clear previous errors
    setErrors({});

    // Simple client-side validation
    const validationErrors = {};
    if (!formData.name) validationErrors.name = "Name is required.";
    if (!formData.email) validationErrors.email = "Email is required.";
    if (!formData.phone) validationErrors.phone = "Phone is required.";
    if (!formData.message) validationErrors.message = "Message is required.";

    // Check if the message is more than 150 words
    if (countWords(formData.message) > 150) {
      validationErrors.message = "Message should not exceed 150 words.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      
      const bformData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "upload_file") {
          bformData.append(key, value);
        }
      });

      bformData.append("pdf_file", formData.upload_file);

      
      const response = await axios.post(
        `${NODE_API_URL}/api/grievance/register`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      // Check if the response is successful
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        toast.success(response.data.message);
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          year_semester: "",
          message: "",
        });
      } else {
        toast.error("An error occurred. Please try again");
      }
    } catch (error) {
      const status = error.response?.data?.statusCode;
      if (status === 500) {
        toast.error(error.response.data.message || "A server error occurred.");
      } else if (status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB!");
        e.target.value = null;
        return;
      }
      
      setFormData((prev) => ({ ...prev, upload_file: file }));
    } else {
      toast.error("Only PDF files are allowed!");
      e.target.value = null;
    }
  };

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">
                  Grievance
                </h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li>
                      <span>Contact</span> <FaAngleRight />
                    </li>
                    <li>Grievance</li>
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
            <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
              <h4 className="heading-primary2 butler-regular source-font">
                Express Your Concerns or Complaints
              </h4>
              <div className="contact-form">
                <div className="card border-0">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12 mb-18">
                          <label className="heading-para mb-1">Name</label>
                          <div className="form-group-custom">
                            <span className="form-custom-icon">
                              <FaRegUser />
                            </span>
                            <input
                              name="name"
                              type="text"
                              className="form-custom-input"
                              placeholder="Name"
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                          {errors.name && (
                            <span className="text-danger">{errors.name}</span>
                          )}
                        </div>
                        <div className="col-md-12 mb-18">
                          <label className="heading-para mb-1">Email</label>
                          <div className="form-group-custom">
                            <span className="form-custom-icon">
                              <MdOutlineMailOutline />
                            </span>
                            <input
                              name="email"
                              type="email"
                              className="form-custom-input"
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                          {errors.email && (
                            <span className="text-danger">{errors.email}</span>
                          )}
                        </div>
                        <div className="col-md-12 mb-18">
                          <label className="heading-para mb-1">Phone No.</label>
                          <div className="form-group-custom">
                            <span className="form-custom-icon">
                              <MdOutlinePhone />
                            </span>
                            <input
                              name="phone"
                              type="text"
                              className="form-custom-input"
                              placeholder="Phone No."
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          {errors.phone && (
                            <span className="text-danger">{errors.phone}</span>
                          )}
                        </div>
                        <div className="col-md-12 mb-18">
                          <label className="heading-para mb-1">
                            Year / Semester
                          </label>
                          <div className="form-group-custom">
                            <span className="form-custom-icon">
                              <GiCalendarHalfYear />
                            </span>
                            <input
                              name="year_semester"
                              type="text"
                              className="form-custom-input"
                              placeholder="Year / Semester"
                              value={formData.year_semester}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mb-18">
                          <label className="heading-para mb-1">
                            Upload File
                          </label>
                          <div className="form-group-custom">
                            <span className="form-custom-icon">
                              <GiCalendarHalfYear />
                            </span>

                            <input
                              type="file"
                              name="upload_file"
                              className="form-custom-input"
                              accept="application/pdf"
                              onChange={handleUploadFile}
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mb-18">
                          <label className="heading-para mb-1">Message</label>
                          <div className="form-group-custom align-items-start">
                            <span className="form-custom-icon pt-3">
                              <FaRegMessage />
                            </span>
                            <textarea
                              name="message"
                              className="form-custom-input pt-2"
                              placeholder="Message"
                              value={formData.message}
                              onChange={handleChange}
                              style={{ minHeight: "100px" }}
                            />
                          </div>
                          {errors.message && (
                            <span className="text-danger">
                              {errors.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-12">
                          <button
                            type="submit"
                            style={{ minHeight: "48px" }}
                            className="btn btn-primary py-2 border-primary w-100"
                            disabled={loading}
                          >
                            {loading ? "Submitting..." : "Submit Now"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12">
              <img
                className="img-fluid rounded-3 mt-5"
                src={ImgBg}
                style={{
                  display: "block",
                }}
                alt="Grievance"
              />
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />{" "}
      {/* Toast container for displaying success/error messages */}
    </>
  );
};

export default Grievance;
