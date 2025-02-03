import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import SettingSideBar from "./SettingSideBar";
import { TagsInput } from "react-tag-input-component";

const ContactSetting = () => {
  const [formData, setFormData] = useState({
    c_email: "",
    c_phone: "",
    c_add: "",
    c_map: "",
  });
  const [map, setMap] = useState(null);

  const [isSubmit, setIsSubmit] = useState(false);
  const [mails, setMails] = useState([]);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [errorKey, setErrorKey] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);

  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleContactNumbersChange = (newContactNumbers) => {
    const lastInput = newContactNumbers[newContactNumbers.length - 1];
    if (lastInput && !phoneRegex.test(lastInput)) {
      setErrorKey("phone");
      setErrorMessage("Please enter a valid 10-digit phone number.");
    } else {
      setErrorMessage("");
      setErrorKey("");
    }
    setContactNumbers(newContactNumbers);
  };

  const handleMailsChange = (newMails) => {
    const lastInput = newMails[newMails.length - 1];
    if (lastInput && !emailRegex.test(lastInput)) {
      setErrorMessage("Please enter a valid email address.");
      setErrorKey("mail");
    } else {
      setErrorMessage("");
      setErrorKey("");
    }
    setMails(newMails);
  };

  const handleChange = (e) => {
    const { type, value, name } = e.target;
    if (name == "c_map") {
      setMap(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getContactIconInfo = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_contact_sett");

      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.data.status === 200) {
        setFormData({
          c_map: response?.data?.data[0]?.c_map,
          c_add: response?.data?.data[0]?.c_add,
          c_phone: response?.data?.data[0]?.c_phone,
          c_email: response?.data?.data[0]?.c_email,
        });
      }
      setMails(response?.data?.data[0]?.c_email.split(","));
      setContactNumbers(response?.data?.data[0]?.c_phone.split(","));
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  useEffect(() => {
    getContactIconInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    const sendFormData = new FormData();
    sendFormData.append("data", "addcontactdetails");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("c_map", formData.c_map);
    sendFormData.append("c_add", formData.c_add);
    sendFormData.append("c_phone", contactNumbers.join(","));
    sendFormData.append("c_email", mails.join(","));

    try {
      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (response.data?.status === 201 || response.data?.status === 200) {
        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };
  const decodeHtmlEntities = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-0">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash">
                <a className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Setting
                </a>
                <a href="" className="breadcrumb-item">
                  <i className="fas " /> Company Profile
                </a>
                <span className="breadcrumb-item active">Contact Setting</span>
              </nav>
            </div>
          </div>

          <div className="d-flex col-12 mx-auto mt-5">
            <div className="col-md-2 mr-2">
              <SettingSideBar />
            </div>

            <form onSubmit={handleSubmit} className="col-md-10 col-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>
                            Email <span className="text-danger">*</span>
                          </label>
                          <TagsInput
                            value={mails}
                            onChange={handleMailsChange}
                            name=""
                            placeHolder="enter mails"
                            className="form-control"
                          />
                          {errorKey == "mail" && (
                            <div style={{ color: "red", marginTop: "10px" }}>
                              {errorMessage}
                            </div>
                          )}
                        </div>
                        <div className="form-group col-md-6">
                          <label>
                            Phone Number <span className="text-danger">*</span>
                          </label>
                          <TagsInput
                            value={contactNumbers}
                            onChange={handleContactNumbersChange}
                            name="contacts"
                            type="text"
                            placeHolder="enter phone numbers"
                            className="form-control"
                          />
                          {errorKey == "phone" && (
                            <div style={{ color: "red", marginTop: "10px" }}>
                              {errorMessage}
                            </div>
                          )}
                        </div>
                        <div className="form-group col-md-12">
                          <label>
                            Address <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="c_add"
                            value={formData.c_add}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <label>
                            Map Iframe Code{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <textarea
                            type="text"
                            className="form-control"
                            name="c_map"
                            value={formData.c_map}
                            onChange={handleChange}
                          />
                        </div>
                        {map ? (
                          <>
                            <br /> <br />{" "}
                            <div
                              className="map-preview"
                              dangerouslySetInnerHTML={{
                                __html: map,
                              }}
                            />
                          </>
                        ) : (
                          <div
                            className="map-preview"
                            dangerouslySetInnerHTML={{
                              __html: decodeHtmlEntities(formData.c_map),
                            }}
                          />
                        )}
                      </div>
                    </div>
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSetting;
