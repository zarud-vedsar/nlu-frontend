


import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import JoditEditor from "jodit-react"; // Import Jodit editor

const AntiRagging = () => {

  const [formData, setFormData] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
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
  const getAntiRaggingData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "get_latest_ragging_policy");
      const response = await axios.post(
        `${PHP_API_URL}/ragging_policy.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setFormData(
          response.data?.data[0]?.content,
        );

      }
    } catch (error) {
    }
  };
  useEffect(() => {
    getAntiRaggingData();
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
    sendFormData.append("data", "ragging_policy_add");
    sendFormData.append("content", formData);
    try {
      const response = await axios.post(
        `${PHP_API_URL}/ragging_policy.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        response?.data?.status === 200 ||
        response?.data?.status === 201
      ) {
        toast.success(response.data.msg);
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

  const handleEditorChange = (newContent) => {
    setFormData(newContent);
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

              <span className="breadcrumb-item active">Policies</span>
                <span className="breadcrumb-item active">Anti Ragging Policy </span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent mb-2 ">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">Update Anti Ragging Policy</h5>
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
                    {/* JoditEditor component */}
                    <label className='font-weight-semibold'>Description</label>
                    <JoditEditor
                      value={formData || ""}
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

export default AntiRagging;



