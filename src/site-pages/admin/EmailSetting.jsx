import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  PHP_API_URL,

} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";

import SettingSideBar from "./SettingSideBar";

const EmailSetting = () => {
  const initialForm = {
    mail_driver: "",
    mail_host: "",
    mail_port: "",
    mail_user: "",
    mail_pass: "",
    mail_from_name: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { type, value, name } = e.target;

    if (name === "calllink") {
      let pattern = /\d/;
      let containsNumber = pattern.test(value);
      let isValidLength = value.length <= 10;

       if (!containsNumber) {
        
        return;
      } else if (value.length > 10) {
        
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getContactIconInfo = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_email_sett");

      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data.status === 200) {
        setFormData({
          mail_host: response?.data?.data[0].mail_host,
          mail_driver: response?.data?.data[0].mail_driver,
          mail_port: response?.data?.data[0].mail_port,
          mail_user: response?.data?.data[0].mail_user,
          mail_pass: response?.data?.data[0].mail_pass,
          mail_from_name: response?.data?.data[0].mail_from_name,
        });
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
    }
  };

  useEffect(() => {
    getContactIconInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    
  
    if (!formData.mail_driver) {
      toast.error("Mail Driver is required.");
      setIsSubmit(false);
      return;
    }
    if (!formData.mail_host) {
      toast.error("Mail Host is required.");
      setIsSubmit(false);
      return;
    }
    if (!formData.mail_port) {
      toast.error("Mail Port is required.");
      setIsSubmit(false);
      return;
    }
    if (!formData.mail_user) {
      toast.error("Mail Username is required.");
      setIsSubmit(false);
      return;
    }
    if (!formData.mail_pass) {
      toast.error("Mail Password is required.");
      setIsSubmit(false);
      return;
    }
    if (!formData.mail_from_name) {
      toast.error("Name is required.");
      setIsSubmit(false);
      return;
    }
  
    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("data", "update_email_sett");
  
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      sendFormData.append(key, value);
      
    });
  
    
  
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
      
  
      if (response.data?.status === 201 || response.data?.status === 200) {
        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
  
      if (status === 400 || status === 500) {
        toast.error(error.response?.data?.msg || "A server error occurred.");
      } else {
        toast.error("An error occurred. Please check your connection or try again.");
      }
    } finally {
      setIsSubmit(false);
    }
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
                  <i className="fas " /> University Settings
                </a>
                <span className="breadcrumb-item active">
                  Email Setting
                </span>
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
                        <div className="form-group col-md-4">
                          <label>
                            Mail Driver <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mail_driver"
                            value={formData.mail_driver}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>
                            Mail Host <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mail_host"
                            value={formData.mail_host}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>
                            Mail Port <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mail_port"
                            value={formData.mail_port}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-4">
                          <label>
                            Mail Username <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mail_user"
                            value={formData.mail_user}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>
                            Mail Password <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mail_pass"
                            value={formData.mail_pass}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>
                            Mail From Name{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mail_from_name"
                            value={formData.mail_from_name}
                            onChange={handleChange}
                          />
                        </div>
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

export default EmailSetting;
