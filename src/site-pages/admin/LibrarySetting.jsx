import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
const LibrarySetting = () => {
  const initialForm = {
    max_issue: "",
    issue_duration: "",
    fine_perday: "",
    min_days_reissue: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    let { type, value, name } = e.target;
    
    if(value < 0) return;
  
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getContactIconInfo = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_library_sett");

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setFormData({
          max_issue: response?.data?.data[0].max_issue,
          issue_duration: response?.data?.data[0].issue_duration,
          fine_perday: response?.data?.data[0].fine_perday,
          min_days_reissue: response?.data?.data[0].min_days_reissue,
        });
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
    getContactIconInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!formData.max_issue) {
      toast.error("Maximum number of book issue allowed is required.");
      setIsSubmit(false);
      return;
    }
    if (!formData.issue_duration) {
      toast.error("Issue duration is required.");
      setIsSubmit(false);
      return;
    }

    if (!formData.fine_perday) {
      toast.error("Fine per day is required.");
      setIsSubmit(false);
      return;
    }

    if (!formData.min_days_reissue) {
      toast.error("Minimum number of days to reissue is required.");
      setIsSubmit(false);
      return;
    }

    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("data", "add_lib_setting");

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      sendFormData.append(key, value);
    });

    

    try {
      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 201 || response.data?.status === 200) {
        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response?.data?.msg || "A server error occurred.");
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

          <div className="">
            <nav className="breadcrumb">
            <a href="/admin/" className="breadcrumb-item">
                                     <i className="fas fa-home m-r-5" />
                                    Dashboard
                                   </a>
                                   <span className="breadcrumb-item active">
                                   Library Management
                                   </span>
              <span className="breadcrumb-item active">Library Setting</span>
            </nav>
          </div>

          <div className="card bg-transparent mb-2">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">Setting</h5>
              <div className="ml-auto">
                <Button
                  variant="light"
                  onClick={() => window.history.back()}
                  className="mb-2 mb-md-0"
                >
                  <i className="fas">
                    <FaArrowLeft />
                  </i>{" "}
                  Go Back
                </Button>
              </div>
            </div>
          </div>

              <form onSubmit={handleSubmit} >
              <div className="card">

                <div className="card-body">
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label>
                        Maximum number of book issue allowed{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="max_issue"
                        value={formData.max_issue}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>
                        Issue duration <span className="text-danger">*{" "}(How many days until the fine is imposed for a book issue?)</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="issue_duration"
                        value={formData.issue_duration}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>
                        Fine per day <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="fine_perday"
                        value={formData.fine_perday}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>
                        Minimum number of days 
                        <span className="text-danger">* {" "}(How many days after can a student re-issue the same book?)</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="min_days_reissue"
                        value={formData.min_days_reissue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                </div>

                <div className="col-md-12 col-lg-12 col-12">
                  <button
                    className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                    type="submit"
                    disabled={isSubmit}
                  >
                    Save{" "}
                    {isSubmit && (
                      <>
                        &nbsp; <div className="loader-circle"></div>
                      </>
                    )}
                  </button>
                </div>
              </form>
        </div>
      </div>
    </div>
  );
};

export default LibrarySetting;
