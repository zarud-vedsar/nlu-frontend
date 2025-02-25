import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  NODE_API_URL
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { useParams, Link } from "react-router-dom";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor
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
  // Jodit editor configuration
  const config = useMemo(()=>({
    readonly: false,
    placeholder: 'Enter your description here...',
    spellcheck: true,
    language: 'en',
    defaultMode: '1',
    minHeight: 400,
    maxHeight: -1,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
  }),[]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          title: validator.unescape(response.data?.data[0].title || ""),
          image: response.data?.data[0].image,
          description: validator.unescape(response.data?.data[0].description || "'"),
        }));
        if (response.data?.data[0].image) {
          setPreviewImage(response.data?.data[0].image);
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

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      description: newContent
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
                <span className="breadcrumb-item active">Speciality</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
              <h5 className="card-title h6_new">
                {" "}
                {id ? "Update Speciality" : "Add New Speciality"}
              </h5>
              <div className="ml-auto id-mobile-go-back">
                <button
                  className="mr-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to="/admin/specility">
                  <button className="ml-2 btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Speciality List
                  </button>
                </Link>
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
                      placeholder="Enter Title"
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

                  <div className='col-md-12'>
                    {/* JoditEditor component */}
                    <label className='font-weight-semibold'>Description</label>
                    <JoditEditor
                      value={formData?.description || ''}
                      config={config}
                      onBlur={handleEditorChange}
                    />
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
