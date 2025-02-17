import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  PHP_API_URL,
  
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";

import SettingSideBar from "./SettingSideBar";

const SEOSetting = () => {

  const initialForm = {
 
    meta_title: "",
    meta_key: "",
    meta_des: "",

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
      bformData.append("data", "get_seo_sett");

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
          
          linkedin: response.data.data[0].linkedin,
          youtube: response.data.data[0].youtube,
          twitter: response.data.data[0].twitter,
          
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

    if (!formData.meta_title) {
      toast.error("Title is required.");
      return setIsSubmit(false);
    }
    if (!formData.meta_key) {
      toast.error("Keyword is required.");
      return setIsSubmit(false);
    }

    if (!formData.meta_des) {
      toast.error("Description is required.");
      return setIsSubmit(false);
    }
    
    const sendFormData = new FormData();
    sendFormData.append("data", "update_seo_sett");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));

    Object.keys(formData).forEach(key => {
      const value = formData[key];
      sendFormData.append(key,value)
    });
    Object.keys(sendFormData).forEach(key => {
      const value = sendFormData[key];
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
                  SEO Setting
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
                        <div className="form-group col-md-12">
                          <label>
                            Meta Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="meta_title"
                            value={formData.meta_title}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <label>
                            Meta Keyword <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="meta_key"
                            value={formData.meta_key}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <label>
                            Meta Description <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="meta_des"
                            value={formData.meta_des}
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

export default SEOSetting;
