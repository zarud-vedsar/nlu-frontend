import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  PHP_API_URL,
 
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";

import SettingSideBar from "./SettingSideBar";

const SocialMediaSetting = () => {

 
  const [formData, setFormData] = useState({
    linkedin:"",
    youtube: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { type, value, name } = e.target;

  

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getContactIconInfo = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_socialmedia_sett");

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
          
          linkedin: response.data.data[0].linkedin,
          youtube: response.data.data[0].youtube,
          twitter: response.data.data[0].twitter,
          instagram: response.data.data[0].instagram,
          facebook: response.data.data[0].facebook,
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
    
    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("data", "socialmedia");
  
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      sendFormData.append(key, value);
      console.log(key,value)
    });
  
    Object.keys(sendFormData).forEach((key) => {
      const value = sendFormData[key];
      console.log(key, value);
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
                  <i className="fas " /> Company Profile
                </a>
                <span className="breadcrumb-item active">
                  Social Media Setting
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
                            Facebook <i className="fa-brands fa-facebook"></i>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <label>
                            Instagram <i className="fa-brands fa-square-instagram"></i>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <label>
                            Twitter <i className="fa-brands fa-twitter"></i>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <label>
                            Youtube <i className="fa-brands fa-youtube"></i>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <label>
                            LinkedIn <i className="fa-brands fa-linkedin-in"></i>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="linkedin"
                            value={formData.linkedin}
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

export default SocialMediaSetting;
