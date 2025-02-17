import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import validator from 'validator';
import JoditEditor from "jodit-react"; // Import Jodit editor
const Mission = () => {
  const initialForm = {
    title: "",
    content: "",
    bgImage: "",
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
    readonly: false,
    placeholder: '',
    spellcheck: true,
    language: 'pt_br',
    defaultMode: '1',
    minHeight: 400,
    maxHeight: -1,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
  };
  const getMissionData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      const response = await axios.post(
        `${NODE_API_URL}/api/mission/fetch`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 200) {
        setFormData((prev) => ({
          ...prev,
          title: response.data?.data[0].title,
          bgImage: response.data?.data[0].image,
          content: validator.unescape(response.data?.data[0].content || ""),
        }));
        if (response.data?.data[0].image) {
          setPreviewImage(
            response.data?.data[0].image
          );
        }
      }
    } catch (error) {
      const status = error.response?.statusCode;
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
    getMissionData();
  }, []);

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    const { id } = e.target;
    if (!image) return;
    console.log(image);
    if (id === "image") {
      if (image.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(image));
        console.log(previewImage);
        setFormData((formData) => ({ ...formData, bgImage: image }));
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
    if (!formData.title) {
      toast.error("Page Title is required.");
      return setIsSubmit(false);
    }
    if (!formData.bgImage && !formData.content) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    }
    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) {
        sendFormData.append(key, formData[key]);
      }
    });
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/mission/register`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.statusCode === 200 || response?.data?.statusCode === 201) {
        toast.success(response.data.message);
        if (response.data.statusCode === 201) {
          setFormData(initialForm);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response.data?.statusCode;

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

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      content: newContent
    }))
  }
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
                <span className="breadcrumb-item active">CMS</span>
                <span className="breadcrumb-item">Mission</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent mb-2">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">Update Mission Section</h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 btn-light mr-2 btn btn-secondary"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="card">
              <div className="card-body">
                <div className="row mb-4">
                  <div className="form-group col-md-12">
                    <label> Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group col-md-12 ">
                    <label> Image</label>
                    <input
                      type="file"
                      id="image"
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
                    {/* JoditEditor component */}
                    <label className='font-weight-semibold'>Description</label>
                    <JoditEditor
                      value={formData?.content || ''}
                      config={config}
                      onBlur={handleEditorChange}
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

export default Mission;
