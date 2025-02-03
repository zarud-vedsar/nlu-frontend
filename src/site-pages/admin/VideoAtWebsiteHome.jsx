import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import validator from "validator";

const VideoAtWebsiteHome = () => {
  const [formData, setFormData] = useState({ title: "", link: "" });
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getAboutData = async () => {
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/website-home-video/fetch`
      );
      if (response.data.statusCode === 200) {
        const tempLink = response?.data?.data[0]?.link ? validator.unescape(response?.data?.data[0]?.link) : null ;
        setFormData((prev) => ({
          ...prev,
          title: response.data.data[0]?.title ,
          link: tempLink ,
        }));
      }
    } catch (error) {
      const status = error.response?.data?.statusCode;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  useEffect(() => {
    getAboutData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!formData.title) {
      toast.error("Title is required.");
      return setIsSubmit(false);
    } else if (!formData.link) {
      toast.error("Link is required.");
      return setIsSubmit(false);
    }

    let sendFormData = {
      title: formData?.title,
      link: formData?.link,
      loguserid: secureLocalStorage.getItem("login_id"),
      login_type: secureLocalStorage.getItem("loginType"),
    };

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/website-home-video/register`,
        sendFormData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        toast.success(response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.statusCode;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.message || "A server error occurred.");
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
                  <i className="fas fa-home m-r-5" /> CMS
                </a>
                <span className="breadcrumb-item active">
                  Website Home Video
                </span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent mb-2">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">Update Website Home Video Section</h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="form-group col-md-12">
                        <label>Title <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-12">
                        <label>Link <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={formData.link}
                          onChange={handleChange}
                        />
                      </div>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoAtWebsiteHome;
