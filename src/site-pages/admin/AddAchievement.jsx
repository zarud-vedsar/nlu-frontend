import React, { useEffect, useState } from "react";
import { NODE_API_URL ,CKEDITOR_URL} from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  dataFetchingPost,
  goBack,
} from "../../site-components/Helper/HelperFunction";

import {
  FormField
} from "../../site-components/admin/assets/FormField";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import validator from "validator";

function AddAchievement() {
  // Initial form state
  const initialForm = {
    dbId: "", 
    title: "",
    description: "",
    bgImage: "",
  };
  const { id:achievementId } = useParams();
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState(initialForm); // Form state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [error, setError] = useState({ field: "", msg: "" }); // Error state



  

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

  const updateFetchData = async (achievementId) => {
    if (
      !achievementId ||
      !Number.isInteger(parseInt(achievementId, 10)) ||
      parseInt(achievementId, 10) <= 0
    )
      return toast.error("Invalid ID.");

    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/achievement/fetch`,
        { dbId: achievementId }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        toast.success(response.message);
        setFormData((prev) => ({
          ...prev,
          dbId: response.data[0].id,
          title: response.data[0].title,
          description: validator.unescape(response.data[0].description),
          bgImage: validator.unescape(response.data[0].image),
        }));
        if (response.data[0].image) {
          setPreviewImage(`${response.data[0].image}`);
        }
        if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
          window.CKEDITOR.instances['editor1'].setData(
              validator.unescape(validator.unescape(response.data[0].description)) 
          );
      }
      } else {
        toast.error("Data not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      const statusCode = error.response?.data?.statusCode;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  useEffect(() => {
    if (achievementId) {
      updateFetchData(achievementId);
    }
  }, [achievementId]);
  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;
    
    if (id === "bgImage") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, bgImage: file }));
      } else {
        toast.error(
          "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
        );
      }
    }
  };
 
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
   
    setError((prev) => ({
      ...prev,
      field: "",
      msg: "",
    }));
    if (!formData.title) {
      toast.error("Title is required.");
      errorMsg("Title", "Title  is required.");
       setIsSubmit(false);
       return
    }

    if (!formData.bgImage) {
        toast.error("Image is required.");
        errorMsg("Image", "Image  is required.");
        return setIsSubmit(false);
      }
    if (!formData.description) {
      toast.error("Description is required.");
      errorMsg("Description", "Image  is required.");
      return setIsSubmit(false);
    }
    
    const highLevelData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
       highLevelData.append(key, value);
    });
    highLevelData.append("loguserid", secureLocalStorage.getItem("login_id"));
    highLevelData.append("login_type", secureLocalStorage.getItem("loginType"));

    try {
      // submit to the API here
      const response = await axios.post(
        `${NODE_API_URL}/api/achievement/register`,
        highLevelData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        if (response.data?.statusCode === 201) {
          setFormData({ ...initialForm });
          setPreviewImage(null);
         
        }
        if(response.data?.statusCode ===200){
          setFormData({ ...initialForm });
          setPreviewImage(null);
          goBack();
        }
        toast.success(response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
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
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Announcement
                  </a>
                  <span className="breadcrumb-item">Achievement</span>
                  <span className="breadcrumb-item active">Add Achievement</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {achievementId ? "Update Achievement" : "Add Achievement"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link
                    to="/admin/achievement-list"
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-list" /> Achievement List
                  </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    

                    {/* Course Name */}
                    <FormField
                      borderError={error.field === "title"}
                      errorMessage={error.field === "title" && error.msg}
                      label="Achievement"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      column="col-md-12"
                      required
                    />

                    
                    <div className="form-group col-md-12">
                      <label>Choose Image <span className="text-danger">*</span></label>
                      <input
                        type="file"
                        id="bgImage"
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
        </div>
      </div>
    </>
  );
}
export default AddAchievement;
