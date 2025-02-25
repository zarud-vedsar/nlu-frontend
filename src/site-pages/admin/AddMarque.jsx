import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  
  PHP_API_URL
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { useParams, Link } from "react-router-dom";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor
const AddMarque = () => {
  const initialForm = {
    content: "",
    description: "",
    link: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [isSubmit, setIsSubmit] = useState(false);
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
       const sendFormData = new FormData();
       sendFormData.append("data","get_mrq_slider_by_id"),
       sendFormData.append("id",id)
    
      const response = await axios.post(
        `${PHP_API_URL}/mrq_slider.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data.status === 200) {
        setFormData((prev) => ({
          ...prev,
          content: validator.unescape(response.data?.data[0].content || ""),
          link: response.data?.data[0].link,
          description: validator.unescape(response.data?.data[0].description || ""),
        }));
        
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
      getMissionData();
    }
  }, []);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!formData.content) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    }
   
    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("data", "mrq_slider_add");
    if (id) {
      sendFormData.append("updateid", id);
    }
    // Append form data to FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) {
        sendFormData.append(key, formData[key]);
      }
    });
    try {

        const response = await axios.post(
            `${PHP_API_URL}/mrq_slider.php`,
            sendFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
      if (
        response?.status === 200 ||
        response?.status === 201
      ) {
        toast.success(response.msg || "New important update slider added");
        // Reset form and states
        setFormData(initialForm);
        
        // If status is 201, stay on the current page. If 200, navigate back
        if (response.status === 200) {
          window.history.back();
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400 || status === 500) {
        toast.error(error.response?.msg || "A server error occurred.");
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
                <a className="breadcrumb-item active">CMS</a>
                <a className="breadcrumb-item active">Important Update Slider</a>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
              <h5 className="card-title h6_new">
                {" "}
                {id ? "Update Important Update Slider" : "Add New Important Update Slider"}
              </h5>
              <div className="ml-auto id-mobile-go-back">
                <button
                  className="mr-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to="/admin/marque-slide">
                  <button className="ml-2 btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Important Update Sliders List
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
                    <label> Content</label> <span className="text-danger">*</span>
                    <input
                      type="text"
                      className="form-control"
                      name="content"
                      placeholder="Enter content"
                      value={formData.content}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group col-md-12 ">
                    <label> Link</label> 
                    <input
                      type="text"
                      className="form-control"
                      name="link"
                      placeholder="Enter link"
                      value={formData.link}
                      onChange={handleChange}
                    />
                    
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

export default AddMarque;
