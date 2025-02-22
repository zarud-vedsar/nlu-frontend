import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { toast, ToastContainer } from "react-toastify";
import feedbackPng from "../../site-components/website/assets/Images/feedback.webp"
import { FaAddressBook, FaAngleRight, FaRegMessage, FaRegUser } from "react-icons/fa6";
import { MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";
import { BiCategory } from "react-icons/bi";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bformData = new FormData();
    bformData.append("data", "feedback_form");
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      bformData.append(key, value);
    });

    try {
      const response = await axios.post(`${PHP_API_URL}/front.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if the response is successful
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
          category: "",
        });
        setErrorKey('');
        setErrorMessage('');
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else if (status === 400) {
        setErrorKey(error.response.data.key);
        setErrorMessage(error.response.data.msg);
        toast.error(error.response.data.msg);
      } else {
        toast.error("An error occurred. Please check your connection or try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">Feedback</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link> <FaAngleRight /></li> 
                     <li><span>Contact</span> <FaAngleRight /></li>
                    <li>Feedback</li>
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
            <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12">
              <img
                className="img-fluid rounded-3 mt-5"
                src={feedbackPng}
                alt="Institution"
                style={{
                  display: "block",
                }}
              />
            </div>
            <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
              <h4 className="heading-primary2 butler-regular source-font">Share Your Thoughts With Us</h4>
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
                          {errorKey === ".invalid-name" && (
                            <span className="text-danger ">{errorMessage}</span>
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
                          {errorKey === ".invalid-email" && (
                            <span className="text-danger ">{errorMessage}</span>
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
                          {errorKey === ".invalid-phone" && (
                            <span className="text-danger ">{errorMessage}</span>
                          )}
                        </div>
                        <div className="col-md-12 mb-18">
                          <label className="heading-para mb-1">Address</label>
                          <div className="form-group-custom">
                            <span className="form-custom-icon">
                              <FaAddressBook />
                            </span>
                            <input
                              name="address"
                              type="text"
                              className="form-custom-input"
                              placeholder="Address"
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </div>
                          {errorKey === ".invalid-address" && (
                            <span className="text-danger ">{errorMessage}</span>
                          )}
                        </div>
                        <div className="col-md-12 mb-18">
                          <label className="heading-para mb-1">Category</label>
                          <div className="form-group-custom">
                            <span className="form-custom-icon">
                              <BiCategory />
                            </span>
                            <select
                              name="category"
                              className="form-custom-input"
                              value={formData.category}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              <option value="academic">Academic</option>
                              <option value="facilities">Facilities</option>
                              <option value="general-suggestions">General Suggestions</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          {errorKey === ".invalid-category" && (
                            <span className="text-danger ">{errorMessage}</span>
                          )}
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
                              style={{ minHeight: '100px' }}
                            />
                          </div>
                          {errorKey === ".invalid-message" && (
                            <span className="text-danger ">{errorMessage}</span>
                          )}
                        </div>

                        <div className="col-md-12">
                          <button type="submit" style={{ minHeight: '48px' }} className="btn btn-primary py-2 border-primary w-100" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Now'}
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
      </section>

      <ToastContainer />
    </>
  );
};

export default Feedback;
