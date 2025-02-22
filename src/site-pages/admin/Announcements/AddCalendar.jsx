import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../../site-components/Helper/HelperFunction";
import axios from "axios";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { useParams, Link } from "react-router-dom";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor
import { FormField } from "../../../site-components/admin/assets/FormField";
import {
  
  formatDate,
  
} from "../../../site-components/Helper/HelperFunction";
const AddCalendar = () => {
  const initialForm = {
    title: "",
    content: "",
    date: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [isSubmit, setIsSubmit] = useState(false);
  const { dbId } = useParams();
  // Jodit editor configuration
  const config = {
    readonly: false,
    placeholder: "Enter your content here...",
    spellcheck: true,
    language: "pt_br",
    defaultMode: "1",
    minHeight: 400,
    maxHeight: -1,
    defaultActionOnPaste: "insert_as_html",
    defaultActionOnPasteFromWord: "insert_as_html",
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchData = async () => {
    try {
      const loginid = secureLocalStorage.getItem("login_id");
      const logintype = secureLocalStorage.getItem("loginType");

      const response = await axios.post(`${NODE_API_URL}/api/calendar/fetch`, {
        dbId: dbId,
        loginid,
        logintype,
      });

      if (response.data.statusCode === 200) {
        setFormData((prev) => ({
          ...prev,
          title: validator.unescape(response.data?.data[0]?.title || ""),
          date: response?.data?.data[0]?.date
            ? new Date(response.data.data[0].date)
                .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) // Formats as YYYY-MM-DD
            : "",
          content: validator.unescape(response.data?.data[0]?.content || ""),
        }));
      console.log()
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
    if (dbId) {
      fetchData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!formData.title) {
      
      toast.error("Title is required.");
      return setIsSubmit(false);
    }
    if (!formData.date) {
      toast.error("Date is required.");
      return setIsSubmit(false);
    }
    if (!formData.content) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    }
    const sendFormData = {
      title: formData?.title,
      date: formData?.date,
      content: formData?.content,
      loguserid: secureLocalStorage.getItem("login_id"),
      login_type: secureLocalStorage.getItem("loginType"),
    };

    if (dbId) {
      sendFormData.dbId = dbId;
    }

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/calendar/register`,
        sendFormData
      );
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        toast.success(response.data.message);
        // Reset form and states
        setFormData(initialForm);

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
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
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
                  <i className="fas fa-home m-r-5" /> Announcement
                </a>
                <a href="/admin/home" className="breadcrumb-item">
                  Calendar
                </a>
                <span className="breadcrumb-item active">
                  {dbId ? "Update Calendar" : "Add New Calendar"}
                </span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">
                {" "}
                {dbId ? "Update Calendar" : "Add New Calendar"}
              </h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to="/admin/calendar">
                  <button className="ml-auto btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Calendar List
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-body">
                <div className="row mb-4">
                  <div className="form-group col-md-9 col-12">
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
                  
                  <FormField
                    label="Date"
                    name="date"
                    id="date"
                    type="date"
                    value={formData?.date}
                    onChange={handleChange}
                    column="col-md-3 col-12"
                    required
                  />

                  <div className="col-md-12">
                    {/* JoditEditor component */}
                    <label className="font-weight-semibold">
                      Content <span className="text-danger">*</span>
                    </label>
                    <JoditEditor
                      value={validator.unescape(formData?.content) || ""}
                      config={config}
                      onBlur={(newContent) => {
                        setFormData((prev) => ({
                          ...prev,
                          content: newContent,
                        }));
                      }}
                    />
                  </div>
                
                <div className="col-12 mt-3">
                  <button
                    className="btn btn-dark btn-block"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCalendar;
