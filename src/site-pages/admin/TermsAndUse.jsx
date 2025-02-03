import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";

import axios from "axios";
import {
  PHP_API_URL,
  CKEDITOR_URL
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import validator from "validator";

const TermsAndUse = () => {
 
  const [formData, setFormData] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [html, sethtml] = useState("");

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
            setFormData(data);
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
  const getPrivacyPolicyData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data","get_latest_tmsuse");

      const response = await axios.post(
        `${PHP_API_URL}/tms_use.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setFormData(
          response.data?.data[0].content,
        );

        if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
          window.CKEDITOR.instances['editor1'].setData(
              validator.unescape(validator.unescape(response.data?.data[0].content)) // Ensure content is unescaped properly
          );
      }
      }
    } catch (error) {
      const status = error.response?.status;

      // if (status === 400 || status === 500) {
      //   toast.error(error.response.data.msg || "A server error occurred.");
      // } else {
      //   toast.error(
      //     "An error occurred. Please check your connection or try again."
      //   );
      // }
    }
  };
  useEffect(() => {
    getPrivacyPolicyData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!formData) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    }

    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("data", "tmsuse_add");
    sendFormData.append("content", formData);

   

    try {
      const response = await axios.post(
        `${PHP_API_URL}/tms_use.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response)

      if (
        response?.data?.status === 200 ||
        response?.data?.status === 201
      ) {
        toast.success(response.data.msg);
        if (response.data.status === 201) {
          setFormData('');
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response.data?.status;

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
                <span className="breadcrumb-item active">Terms Of Use Policy</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">Update Terms Of Use Policy</h5>
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
                      <div className="col-md-12 ">
                      <textarea id="editor1" name="description">{formData && validator.unescape(formData)}</textarea>

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

export default TermsAndUse;

