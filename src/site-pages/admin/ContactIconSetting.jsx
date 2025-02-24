import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import {
  PHP_API_URL,
 
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";

import SettingSideBar from "./SettingSideBar";

const ContactIconSetting = () => {

  const initialForm = {
    whatsapplink: "",
    calllink: "",
  };
  const [formData, setFormData] = useState(initialForm);
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
      bformData.append("data", "get_conacticon_sett");

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
          whatsapplink: response?.data?.data[0]?.whatsapplink,
          calllink: response?.data?.data[0]?.calllink,
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
    sendFormData.append("data", "contacticon");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("whatsapplink", formData.whatsapplink)
    sendFormData.append("calllink", formData.calllink)

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
              <a href="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>
                <a href="" className="breadcrumb-item">
                  <i className="fas " /> University Settings
                </a>
                <span className="breadcrumb-item active">
                  Contact Icon Setting
                </span>
              </nav>
            </div>
          </div>

          <div className="d-flex row mt-5">
            <div className="col-md-2 col-12 col-sm-12 mb-2">
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
                            Whatsapp <i className="fa-brands fa-whatsapp"></i>
                          </label>
                          <p>https://api.whatsapp.com/send?phone=mobile_number_with country code&text=your message</p>
                          <p>https://api.whatsapp.com/send?phone=+910000000000&text=Hello</p>
                          <input
                            type="text"
                            className="form-control"
                            name="whatsapplink"
                            value={formData.whatsapplink}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-md-12">
                          <label>
                            Call In <i className="fa-solid fa-mobile"></i>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="calllink"
                            value={formData.calllink}
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

export default ContactIconSetting;
