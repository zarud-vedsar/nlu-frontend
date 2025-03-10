import React, { useEffect } from "react";
import { useState } from "react";
import axios from 'axios'; // Import axios
import { PHP_API_URL } from '../../site-components/Helper/Constant';
import { toast } from "react-toastify";
import { MdOutlineMailOutline, MdOutlinePhone, MdOutlineSubject } from "react-icons/md";
import { FaAngleRight, FaRegMessage, FaRegUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FiPhone } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";
import validator from 'validator';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contactData, setContactData] = useState([]);
  const [decodeMap, setdecodeMap] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  async function getContactInfo() {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_contact_sett");
      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData);
      if (response?.data?.data[0]) {
        const response2 = await axios.post(
          `${PHP_API_URL}/page.php`,
          { data: 'decodeData', html: response.data.data[0].c_map },
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setdecodeMap(validator.unescape(response2.data));
        setContactData(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error occurred:");
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const bformData = new FormData()
    bformData.append('data', 'contact_form')
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      bformData.append(key, value);
    });

    try {
      const response = await axios.post(`${PHP_API_URL}/front.php`, bformData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      // Check if the response is successful
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again");
      }
    } catch (error) {
      console.error("Error:", error);
      const status = error.response?.data?.status;

      if (status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else if (status == 400) {
        setErrorKey(error.response.data.key);
        setErrorMessage(error.response.data.msg);
        toast.error(error.response.data.msg);
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getContactInfo();
  }, []);
  const phoneNumbers = contactData?.c_phone ? contactData.c_phone.split(',') : [];
  const emailNumbers = contactData?.c_email ? contactData.c_email.split(',') : [];
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">Contact Us</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link> <FaAngleRight /></li>
                    <li><span>Contact</span> <FaAngleRight /></li>
                    <li>Contact Us</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section contact-icon">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h3 className="heading-primary2 butler-regular source-font">General Contact Information</h3>
              <div className="heading-divider mb-4"></div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center">
              <div className="row">
                <div className="col-md-2">
                  <span className="faicon"><SlLocationPin /></span>
                </div>
                <div className="col-md-8 text-start">
                  <span className="heading butler-regular">Address</span>
                  <p className="heading-para mb-0 gorditas-regular">Gram Devghat, Tehsil Sadar,</p>
                  <p className="heading-para mb-0 gorditas-regular">District Prayagraj. Pincode- 211011,</p>
                  <p className="heading-para mb-0 gorditas-regular">Uttar Pradesh, India.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center">
              <div className="row">
                <div className="col-md-2">
                  <span className="faicon"><SlLocationPin /></span>
                </div>
                <div className="col-md-8 text-start">
                  <span className="heading butler-regular">Current Temporary Address</span>
                  <p className="heading-para mb-0 gorditas-regular">Gaddopur, Phaphamau,</p>
                  <p className="heading-para mb-0 gorditas-regular">District Prayagraj. Pincode- 211013,</p>
                  <p className="heading-para mb-0 gorditas-regular">Uttar Pradesh, India.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center">
              <div className="row">
                <div className="col-md-2">
                  <span className="faicon"><FiPhone /></span>
                </div>
                <div className="col-md-8 text-start">
                  <span className="heading butler-regular">Contact</span>
                  <p className="heading-para mb-0 gorditas-regular">
                    Phone: {
                      phoneNumbers && phoneNumbers.length > 0 ? (
                        phoneNumbers.map((phone, index) => (
                          <span key={index}>
                            <a href={`tel:${phone.trim()}`}>{phone.trim()}</a>
                            {index < phoneNumbers.length - 1 && ", "}
                          </span>
                        ))
                      ) : (
                        <span></span>
                      )
                    }
                  </p>
                  <p className="heading-para mb-0 gorditas-regular">
                    Mail:  {
                      emailNumbers && emailNumbers.length > 0 ? (
                        emailNumbers.map((email, index) => (
                          <span key={index}>
                            <a href={`mailto:${email.trim()}`}>{email.trim()}</a>
                            {index < emailNumbers.length - 1 && ", "}
                          </span>
                        ))
                      ) : (
                        <span></span>
                      )
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-f5">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="heading-primary2 butler-regular source-font">Get Directions on Google Maps</h3>
                  <div className="heading-divider mb-4"></div>
                </div>
              </div>
              <div className="card border-0 p-3">
                <div className="card-body contact-iframe">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: decodeMap,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="heading-primary2 butler-regular source-font">Get In Touch with Us</h3>
                  <div className="heading-divider mb-4"></div>
                </div>
              </div>
              <div className="card border-0">
                <div className="card-body">
                  <h4 className="contact-title">Drop Us a Message</h4>
                  <div className="row">
                    <form onSubmit={handleSubmit}>
                      <div id="contactForm" className="row">
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
                          <label className="heading-para mb-1">Subject</label>
                          <div className="form-group-custom">
                            <span className="form-custom-icon">
                              <MdOutlineSubject />
                            </span>
                            <input
                              name="subject"
                              type="text"
                              className="form-custom-input"
                              placeholder="Subject"
                              value={formData.subject}
                              onChange={handleChange}
                            />
                          </div>
                          {errorKey === ".invalid-subject" && (
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
    </>
  );
};

export default ContactUs;
