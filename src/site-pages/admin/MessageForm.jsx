import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";

import axios from "axios";
import {
  PHP_API_URL,
  FILE_API_URL
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor

const MessageForm = () => {
  const { id } = useParams();
  const initialForm = {
    name: "",
    from: "",
    message: "",
    authority_img: "",
    hiddenthumbnail: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Jodit editor configuration
  const config = {
    readonly: false, // set to true if you want readonly mode
  };
  const getMessage = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_message");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/message.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setFormData({
          name: response.data.data[0].name,
          from: response.data.data[0].msg_from,
          authority_img: response.data.data[0].image,
          message: validator.unescape(response.data.data[0].message || "'"),
          hiddenthumbnail: response.data.data[0].image,
        });
        if (response.data.data[0].image) {
          setPreviewImage(
            `${FILE_API_URL}/our-authorities/${response.data.data[0].image}`
          );
        }
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
    if (id) {
      getMessage();
    }
  }, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;
    if (id === "authority_img") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, authority_img: file }));
      } else {
        toast.error(
          "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
        );
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (!formData.name) {
      toast.error("Name is required.");
      return setIsSubmit(false);
    }
    if (!formData.from) {
      toast.error("Message From is required.");
      return setIsSubmit(false);
    }
    if (!formData.authority_img && !formData.message) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    }
    const sendFormData = new FormData();
    sendFormData.append("data", "savemessage");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    if (id) sendFormData.append("updateid", id);
    for (let key in formData) {
      sendFormData.append(key, formData[key]);
    }
    try {
      const response = await axios.post(
        `${PHP_API_URL}/message.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
        setFormData(initialForm);
        setPreviewImage(null);
        if (response?.data?.status === 200) {
          window.history.back();
        }
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
                  <i className="fas fa-home m-r-5" /> CMS
                </a>
                <span className="breadcrumb-item active">Message</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent mb-2  mx-auto">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">
                {id ? "Update Message" : "Add New Message"}
              </h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to="/admin/message">
                  <button className="ml-auto btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Message List
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-body">
                <div className="row mb-4">
                  <div className="form-group col-md-6">
                    <label>
                      Message From <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group col-md-12 ">
                    <label>
                      Image <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      id="authority_img"
                      accept=".png, .jpg, .jpeg, .webp"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="img-fluid mt-3"
                        style={{ maxHeight: 300 }}
                      />
                    )}
                  </div>

                  <div className="col-md-12 ">
                    <label>
                      Message <span className="text-danger">*</span>
                    </label>
                    {/* JoditEditor component */}
                    <JoditEditor
                      value={formData?.message || ''}
                      config={config}
                      onChange={(newContent) => setFormData((prev) => ({
                        ...prev,
                        message: newContent
                      }))}
                    />
                  </div>
                </div>
                <div className="">
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
  );
};

export default MessageForm;
