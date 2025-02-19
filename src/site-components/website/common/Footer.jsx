import React, { useEffect, useState } from "react";
import axios from "axios";
import { NODE_API_URL, PHP_API_URL } from "../../Helper/Constant";
import { Link } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import validator from "validator";
import { FaFacebookF } from "react-icons/fa";
import rpnl_logo from "../assets/Images/rpnl_logo.png";
const Footer = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [iconLink, setIconLink] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [brandData, setBrandData] = useState([]);

  const data = {
    site_url: window.location.href,
  };

  async function visitor() {
    try {
      await axios.post(`${NODE_API_URL}/api/visitor-website/visitor`, data);
    } catch (error) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
    }
  }

  // Fetch visitor data to display
  async function visitorShow() {
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/visitor-website/show`
      );
      setVisitorData(response.data);
    } catch (error) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
    }
  }

  // fetch icon links
  async function getSocialMediaLink() {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_socialmedia_sett");
      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData
      );
      setIconLink(response.data.data[0]);
    } catch (error) {
      console.error("Error occurred:");
    }
  }

  async function getContactInfo() {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_contact_sett");
      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData
      );
      setContactData(response.data.data[0]);
    } catch (error) {
      console.error("Error occurred:");
    }
  }
  async function getBrands() {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_brand_sett");
      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData
      );
      setBrandData(response.data.data[0]);
    } catch (error) {
      console.error("Error occurred:");
    }
  }
  useEffect(() => {
    getBrands();
    getContactInfo();
    getSocialMediaLink();
    visitor(); // Call to track the visit
    visitorShow(); // Call to fetch and display visitor data
  }, []);

  const currentYear = new Date().getFullYear();
  // Get the next year
  const nextYear = currentYear + 1;
  const phoneNumbers = contactData?.c_phone
    ? contactData.c_phone.split(",")
    : [];
  const emailNumbers = contactData?.c_email
    ? contactData.c_email.split(",")
    : [];
  return (
    <>
      {/*Footer Widget Area Start*/}
      <div className="footer-widget-area">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-sm-4">
              <div className="single-footer-widget">
                <div className="footer-logo">
                  <Link to="/">
                    <img src={rpnl_logo} className="img-fluid border-0" />
                  </Link>
                </div>
                <p className="footer-para">
                  Dr. Rajendra Prasad National Law University, Prayagraj,
                  established in 2020, fosters legal excellence and diversity.
                </p>
              </div>
              
                <div className="mb-2 row">
                  {iconLink.facebook && (
                    <Link
                      to={iconLink.facebook}
                      target="_blank"
                      className="mb-3 col-6"
                      
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <span
                          className="id-fb-icon"
                          style={{ background: "#145dbf" }}
                        >
                          <FaFacebookF className="fticon fbfticon" />
                        </span>
                        <h6
                          className="id-fb-title"
                          style={{ background: "rgb(20 93 191 / 95%)" }}
                        >
                          Facebook
                        </h6>
                      </div>
                    </Link>
                  )}
                  {iconLink.linkedin && (
                    <Link
                      to={iconLink.linkedin}
                      target="_blank"
                      className="mb-3 col-6"
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <span
                          className="id-fb-icon"
                          style={{ background: "rgb(8 88 170 / 98%)" }}
                        >
                          <FaLinkedin className="fticon linkedfticon" />
                        </span>
                        <h6
                          className="id-fb-title"
                          style={{ background: "#0a66c2" }}
                        >
                          Linked in
                        </h6>
                      </div>
                    </Link>
                  )}

                  {iconLink.instagram && (
                    <Link
                      to={iconLink.instagram}
                      target="_blank"
                      className="mb-3 col-6"
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <span className="id-fb-icon">
                          <FaInstagram className="fticon insfticon" />
                        </span>
                        <h6 className="id-fb-title id-icon-insta-gred">
                          Instagram
                        </h6>
                      </div>
                    </Link>
                  )}
                  {iconLink.youtube && (
                    <Link
                      to={iconLink.instagram}
                      target="_blank"
                      className="mb-3 col-6"
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <span className="id-fb-icon">
                          <FaYoutube className="fticon youfticon" />
                        </span>
                        <h6
                          className="id-fb-title"
                          style={{ background: "#FF0000" }}
                        >
                          Youtube
                        </h6>
                      </div>
                    </Link>
                  )}
                  {iconLink.twitter && (
                    <Link
                      to={iconLink.twitter}
                      target="_blank"
                      className="mb-3 col-6"
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <span
                          className="id-fb-icon"
                          style={{ background: "#00000033" }}
                        >
                          <FaXTwitter className="fticon twfticon" />
                        </span>
                        <h6
                          className="id-fb-title"
                          style={{ background: "#000000" }}
                        >
                          Twitter
                        </h6>
                      </div>
                    </Link>
                  )}
                </div>
            
            </div>

            <div className="col-md-3 hidden-sm">
              <div className="single-footer-widget">
                <h3
                  className="heading-primary3 butler-regular mb-3"
                  style={{ color: "#7D1944" }}
                >
                  Quick Links
                </h3>
                <ul className="footer-list">
                  <li>
                    <Link to="/">&nbsp;Home</Link>
                  </li>
                  <li>
                    <Link to="/about">&nbsp;About University</Link>
                  </li>
                  <li>
                    <Link to="/contact-us">&nbsp;Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/feedback">&nbsp;Feedback</Link>
                  </li>
                  <li>
                    <Link to="/image-gallery">&nbsp;Photo Gallery</Link>
                  </li>
                  <li>
                    <Link to="/video-gallery">&nbsp;Video Gallery</Link>
                  </li>
                  <li>
                    <Link to="/career">&nbsp; Career</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-sm-4">
              <div className="single-footer-widget">
                <h3
                  className="heading-primary3 butler-regular mb-3"
                  style={{ color: "#7D1944" }}
                >
                  Policies and Terms
                </h3>
                <ul className="footer-list">
                  <li>
                    <Link to="/privacy-policy">&nbsp;Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/copyright-policy">&nbsp;Copyright Policy</Link>
                  </li>
                  <li>
                    <Link to="/termof-use">&nbsp;Terms of Use</Link>
                  </li>
                  <li>
                    <a href="/anti-ragging-policy">&nbsp;Anti Ragging Policy</a>
                  </li>
                  <li>
                    <a href="/term-condition">&nbsp;Terms & Condition</a>
                  </li>
                  <li>
                    <Link to="/grievance">&nbsp;Grievance</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-sm-4">
              <div className="single-footer-widget">
                <h3
                  className="heading-primary3 butler-regular mb-3"
                  style={{ color: "#7D1944" }}
                >
                  Contact Information
                </h3>
                <span>
                  <i className="fa fa-phone" />
                  {phoneNumbers && phoneNumbers.length > 0 ? (
                    phoneNumbers.map((phone, index) => (
                      <span key={index}>
                        <a href={`tel:${phone.trim()}`}>{phone.trim()}</a>
                        {index < phoneNumbers.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span></span>
                  )}
                </span>

                <span>
                  <i className="fa fa-envelope" />
                  {emailNumbers && emailNumbers.length > 0 ? (
                    emailNumbers.map((email, index) => (
                      <span key={index}>
                        <a href={`mailto:${email.trim()}`}>{email.trim()}</a>
                        {index < emailNumbers.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span></span>
                  )}
                </span>
                <span className="footer-para">
                  <i className="fa fa-map-marker" />
                  {contactData.c_add
                    ? validator.unescape(contactData.c_add)
                    : ""}
                </span>
                <span className="visitor-counting">
                  Visitor:{" "}
                  {visitorData?.data &&
                    visitorData.data
                      .toString()
                      .split("")
                      .map((data, index) => (
                        <span className="id-visitor-data" key={index}>
                          {data}
                        </span>
                      ))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*End of Footer Widget Area*/}
      {/*Footer Area Start*/}
      <footer className="footer-area" style={{ background: "#4E0528" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-sm-6" style={{ textAlign: "center" }}>
              <span>
                &copy; {currentYear} {brandData.business_bottom}. All rights
                reserved.
              </span>
            </div>
            <div className="col-md-6 col-sm-6" style={{ textAlign: "center" }}>
              <div className="column-right">
                <span>
                  Designed &amp; Maintained by:{" "}
                  <a
                    href="https://vedsar.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#C0A262" }}
                  >
                    Vedsar India Pvt Ltd
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/*End of Footer Area*/}
    </>
  );
};

export default Footer;
