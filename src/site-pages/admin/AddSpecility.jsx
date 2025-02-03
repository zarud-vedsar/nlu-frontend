import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  PHP_API_URL,
  NODE_API_URL,
  CKEDITOR_URL
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { useParams } from "react-router-dom";
import validator from "validator";


const AddSpeciality = () => {
  const initialForm = {
    title: "",
    description: "",
    image: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [html, sethtml] = useState("");
  const { id } = useParams();

  // Load CKEditor 4 dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = CKEDITOR_URL;
    script.async = true;
    script.onload = () => {
        // Initialize CKEditor instance
        window.CKEDITOR.replace('editor1', {
            versionCheck: false, // Disable security warnings
        });

        // Update the formData when the editor content changes
        window.CKEDITOR.instances['editor1'].on('change', () => {
            const data = window.CKEDITOR.instances['editor1'].getData();
            setFormData((prevState) => ({
                ...prevState,
                description: data, // Update description in formData
            }));
        });
    };
    document.body.appendChild(script);

    // Cleanup CKEditor instance on component unmount
    return () => {
        if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
            window.CKEDITOR.instances['editor1'].destroy();
        }
    };
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const decodeHtml = async (html) => {
    try {
      const response = await axios.post(
        `${PHP_API_URL}/page.php`,
        {
          data: "decodeData",
          html,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      sethtml(response.data);
    } catch (error) {}
  };
  const getMissionData = async () => {
    try {
      const loginid = secureLocalStorage.getItem("login_id");
      const logintype = secureLocalStorage.getItem("loginType");

      const response = await axios.post(
        `${NODE_API_URL}/api/speciality/fetch`,
        {
          dbId: id,
          listing: "yes",
          loginid,
          logintype,
        }
      );

      if (response.data.statusCode === 200) {
        setFormData((prev) => ({
          ...prev,
          title: response.data?.data[0].title,
          image: response.data?.data[0].image,
          description: response.data?.data[0].description,
        }));
        if (response.data?.data[0].image) {
          setPreviewImage(response.data?.data[0].image);
        }
        console.log(response)
        if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
          window.CKEDITOR.instances['editor1'].setData(
              validator.unescape(validator.unescape(response?.data?.data[0].description)) // Ensure content is unescaped properly
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
    if (id) {
      getMissionData();
    }
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
  
    if (!formData.image) {
      toast.error("Image is required.");
      return setIsSubmit(false);
    }
  
    if (!formData.description) {
      toast.error("Description is required.");
      return setIsSubmit(false);
    }
  
    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
  
    if (id) {
      sendFormData.append("dbId", id);
    }
  
    // Append form data to FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) {
        sendFormData.append(key, formData[key]);
      }
    });
  
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/speciality/register`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
  
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        toast.success(response.data.message);
  
        // Reset form and states
        setFormData(initialForm);
        setPreviewImage("");
        sethtml("");
  
        // If status is 201, stay on the current page. If 200, navigate back
        if (response.data.statusCode === 200) {
          window.history.back();
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.statusCode;
      if (status === 400 || status === 500) {
        toast.error(error.response?.data.message || "A server error occurred.");
      } else {
        toast.error("An error occurred. Please check your connection or try again.");
      }
    } finally {
      setIsSubmit(false); // Reset the submit state
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
                <span className="breadcrumb-item active">Speciality</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">
                {" "}
                {id ? "Add New Speciality" : "Update Speciality"}
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
          
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="form-group col-md-12">
                        <label> Title</label> <span className="text-danger">*</span>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-12 ">
                        <label> Image</label> <span className="text-danger">*</span>
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

                      <div className='col-md-12 px-0'>
                                        <label className='font-weight-semibold'>Description</label>
                                        <textarea id="editor1" name="description">{formData.description && validator.unescape(formData.description)}</textarea>
                                    </div>
                    </div>
                    <div>
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

export default AddSpeciality;
