import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import {
  FormField,
  TextareaField,
} from "../../site-components/admin/assets/FormField";
import axios from "axios";
import {
  PHP_API_URL, FILE_API_URL
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor
const About = () => {
  const initialForm = {
    atitle: "",
    about_content: "",
    image_file: "",
    meta_title: "",
    meta_content: "",
    meta_keywords: "",
    unlink_image_file: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
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
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getAboutData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "aboutget");

      const response = await axios.post(`${PHP_API_URL}/about.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status === 200) {
        setFormData((prev) => ({
          ...prev,
          atitle: response.data.data[0].atitle,
          image_file: response.data.data[0].image_file,
          about_content: response.data.data[0].about_content ? validator.unescape(response.data.data[0].about_content) : '',
          meta_title: response.data.data[0].meta_title,
          meta_content: response.data.data[0].meta_content,
          meta_keywords: response.data.data[0].meta_keywords,
          unlink_image_file: response.data.data[0].image_file,
        }));
        if (response.data.data[0].image_file) {
          setPreviewImage(
            `${FILE_API_URL}/about/${response.data.data[0].image_file}`
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
    getAboutData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;
    
    if (id === "image_file") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));
       
        setFormData((formData) => ({ ...formData, image_file: file }));
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
    if (!formData.atitle) {
      toast.error("Page Title is required.");
      return setIsSubmit(false);
    }
    if (!formData.image_file && !formData.about_content) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    }
    const sendFormData = new FormData();
    sendFormData.append("data", "aboutsave");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    for (let key in formData) {
      sendFormData.append(key, formData[key]);
    }
    try {
      const response = await axios.post(`${PHP_API_URL}/about.php`, sendFormData, { headers: { "Content-Type": "multipart/form-data" } });
      if ([200, 201].includes(response.data?.status)) {
        toast.success(response.data.msg);
        if (response.data.status === 201) {
          setFormData(initialForm);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      [400, 404, 401, 500].includes(status) ? toast.error(error.response.data.msg || "A server error occurred.") : toast.error("An error occurred. Please check your connection or try again.");
    } finally {
      setIsSubmit(false);
    }
  };
  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      about_content: newContent,
    }));
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
                <span className="breadcrumb-item active">CMS</span>
                <span className="breadcrumb-item active">About</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent mb-2">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">
                Update About Section
              </h5>
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
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="form-group col-md-12">
                        <label>About Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="atitle"
                          value={formData.atitle}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-12 ">
                        <label>About Image</label>
                        <input
                          type="file"
                          id="image_file"
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
                      <div className='col-md-12 px-0'>
                        {/* JoditEditor component */}
                        <label className='font-weight-semibold'>Description</label>
                        <JoditEditor
                          value={formData?.about_content ? validator.unescape(formData.about_content) : ""}
                          config={config}
                          onBlur={handleEditorChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <FormField
                        label="Meta Title"
                        name="meta_title"
                        id="meta_title"
                        value={formData.meta_title}
                        column="col-md-12"
                        onChange={handleChange}
                      />
                      <TextareaField
                        label="Meta Description"
                        name="meta_content"
                        id="meta_content"
                        value={formData.meta_content}
                        column="col-md-12"
                        onChange={handleChange}
                      />
                      <TextareaField
                        label="Meta Keywords"
                        name="meta_keywords"
                        id="meta_keywords"
                        value={formData.meta_keywords}
                        column="col-md-12"
                        onChange={handleChange}
                      />
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
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
