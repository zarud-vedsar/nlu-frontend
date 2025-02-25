import React, { useCallback, useEffect, useState,useMemo } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import validator from 'validator';
import JoditEditor from "jodit-react"; // Import Jodit editor
const Vission = () => {
  const initialForm = {
    title: "",
    content: "",
    image: "",
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
const config = useMemo(()=>({
    readonly: false,
    placeholder: 'Enter your description here...',
    spellcheck: true,
    defaultMode: '1',
    minHeight: 400,
    maxHeight: -1,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
    language: 'en',
  }),[]);

  const getVissionData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${NODE_API_URL}/api/vission/fetch`,
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
          title: response.data?.data[0]?.title,
          image: response.data?.data[0]?.image,
          content: validator.unescape(response.data?.data[0]?.content || ""),
        }));
        if (response.data?.data[0].image) {
          setPreviewImage(response.data?.data[0]?.image);
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
    getVissionData();
  }, []);

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    const { id } = e.target;
    if (!image) return;
    if (id === "image") {
      if (image.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(image));
        setFormData((formData) => ({ ...formData, image: image }));
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
    if (!formData.image && !formData.content) {
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
        `${NODE_API_URL}/api/vission/register`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
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
              <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </a>

                <span className="breadcrumb-item active">CMS</span>
                <span className="breadcrumb-item ">Vission</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">Update Vission Section</h5>
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
              <div className="col-md-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
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
  );
};

export default Vission;
