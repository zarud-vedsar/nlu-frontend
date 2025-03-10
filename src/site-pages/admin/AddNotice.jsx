/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  dataFetchingPost,
  goBack,
} from "../../site-components/Helper/HelperFunction";
import { FormField } from "../../site-components/admin/assets/FormField";
import { toast } from "react-toastify";
import axios from "axios";
import {
  NODE_API_URL,
  CKEDITOR_URL,
} from "../../site-components/Helper/Constant";
import validator from "validator";
import secureLocalStorage from "react-secure-storage";
import JoditEditor from "jodit-react"; // Import Jodit editor
function NoticeList() {
  // initialize form fields
  const initialData = {
    dbId: "",
    notice_type: "",
    title: "",
    notice_date: "",
    description: "",
    pdf_file: "",
    image: "",
  };
  const { noticeid } = useParams();
  // initialize form state
  const [formData, setFormData] = useState(initialData);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  // Jodit editor configuration
  const config = useMemo(()=>({
    readonly: false,
    placeholder: 'Enter Your description here...',
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
  // handle Input fields data and stored them in the formData
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;
    if (id === "pdf_file") {
      if (file.type === "application/pdf") {
        setPreviewPdf(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, pdf_file: file }));
      } else {
        toast.error("Invalid PDF format. Only .pdf and .pdfx are allowed.");
      }
    }
    if (id === "image") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));

        setFormData((formData) => ({ ...formData, image: file }));
      } else {
        toast.error(
          "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
        );
      }
    }
  };
  const updateFetchData = async (noticeid) => {
    if (
      !noticeid ||
      !Number.isInteger(parseInt(noticeid, 10)) ||
      parseInt(noticeid, 10) <= 0
    )
      return toast.error("Invalid ID.");

    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/notice/fetch`,
        { dbId: noticeid }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        toast.success(response.message);
        setFormData((prev) => ({
          ...prev,
          dbId: response?.data[0]?.id,
          title: validator.unescape( response?.data[0]?.title),
          notice_type: response?.data[0]?.notice_type,
          notice_date: response?.data[0]?.notice_date,
          description: validator.unescape(response?.data[0]?.description || ""),
          pdf_file: validator.unescape(response?.data[0]?.pdf_file || ""),
          image: validator.unescape(response?.data[0]?.image || ""),
        }));
        if (response?.data[0]?.pdf_file) {
          setPreviewPdf(validator.unescape(response?.data[0]?.pdf_file || ""));
        }
        if (response?.data[0]?.image) {
          setPreviewImage(validator.unescape(response?.data[0]?.image || ""));
        }
      } else {
        toast.error("Data not found.");
      }
    } catch (error) {
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
    if (noticeid) {
      updateFetchData(noticeid);
    }
  }, [noticeid]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const {
      dbId,
      notice_type,
      title,
      notice_date,
      pdf_file,
      image,
      description,
    } = formData;
    if (!notice_type) {
      toast.error("Notice Type is required.");
      return setIsSubmit(false);
    }
    if (!title) {
      toast.error("Title is required.");
      return setIsSubmit(false);
    }
    if (!notice_date) {
      toast.error("Notice Date is required.");
      return setIsSubmit(false);
    }
    if (!pdf_file && !description) {
      toast.error("Must have to provide one among pdf and description");
      return setIsSubmit(false);
    }
    const highLevelData = new FormData();
    highLevelData.append("dbId", dbId);
    highLevelData.append("notice_type", notice_type);
    highLevelData.append("title", title);
    highLevelData.append("notice_date", notice_date);
    highLevelData.append("pdf_file", pdf_file);
    highLevelData.append("thumbnail", image);
    highLevelData.append("description", formData.description);
    highLevelData.append("loguserid", secureLocalStorage.getItem("login_id"));
    highLevelData.append("login_type", secureLocalStorage.getItem("loginType"));
    try {
      // submit to the API here
      const response = await axios.post(
        `${NODE_API_URL}/api/notice/register`,
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

        if (response.data?.statusCode === 201) {
          setFormData(initialData);
        } else if (response.data?.statusCode === 200) {
          window.history.back();
        }
        toast.success(response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
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
      description: newContent,
    }));
  }
  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <Link to="/admin/home" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </Link>
                  <span className="breadcrumb-item">Announcement</span>
                  <span className="breadcrumb-item active">Notice</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new">
                  {noticeid ? "Update Notice" : "Add Notice"}
                </h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link
                    to="/admin/notice-list"
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-list" /> Notice List
                  </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12 form-group">
                      <label className="font-weight-semibold">
                        Notice Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        value={formData.notice_type}
                        name="notice_type"
                        id="notice_type"
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option
                          value="notice"
                          selected={
                            formData.notice_type === "notice" ? true : false
                          }
                        >
                          Notice
                        </option>
                        <option
                          value="event"
                          selected={
                            formData.notice_type === "event" ? true : false
                          }
                        >
                          Event
                        </option>
                        <option
                          value="publication"
                          selected={
                            formData.notice_type === "publication"
                              ? true
                              : false
                          }
                        >
                          Publication
                        </option>
                      </select>
                    </div>
                    <FormField
                      label="Title"
                      required
                      name="title"
                      id="title"
                      placeholder="Enter Title"
                      value={formData.title}
                      column="col-md-12"
                      onChange={handleChange}
                    />
                    <FormField
                      label="Notice Date"
                      required
                      type="date"
                      name="notice_date"
                      id="notice_date"
                      value={formData.notice_date}
                      column="col-md-4"
                      onChange={handleChange}
                    />
                    <div className="form-group col-md-8">
                      <label>Choose Image</label>
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
                    <div className="col-md-12 form-group">
                      <label>Upload Pdf</label>
                      <input
                        type="file"
                        id="pdf_file"
                        accept=".pdf"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    {previewPdf && (
                      <div className="col-md-12 form-group">
                        <iframe
                          src={previewPdf}
                          title="PDF Preview"
                          className="mt-3"
                          style={{ width: "100%", height: 300 }}
                        ></iframe>
                      </div>
                    )}

                    <div className="col-md-12">
                      {/* JoditEditor component */}
                      <label className="font-weight-semibold">
                        Description
                      </label>
                      <JoditEditor
                        value={formData?.description || ""}
                        config={config}
                        onBlur={handleEditorChange}
                      />
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
export default NoticeList;
