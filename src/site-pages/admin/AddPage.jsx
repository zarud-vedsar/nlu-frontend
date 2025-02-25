import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import {
  FormField,
  TextareaField,
} from "../../site-components/admin/assets/FormField";
import axios from "axios";
import {
  PHP_API_URL,
  FILE_API_URL
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor

function AddPage() {
  const initialForm = {
    updateid: "",
    ptitle: "",
    page_type: "",
    sidebar: 0,
    image_file: "",
    pdf_file: "",
    page_content: "",
    meta_title: "",
    meta_content: "",
    meta_keywords: "",
    unlink_image_file: "",
    unlink_pdf_file: "",
  };
  const { pageid } = useParams();
  const [formData, setFormData] = useState(initialForm);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [pageType, setpageType] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Jodit editor configuration
  const config = {
    readonly: false,
    placeholder: 'Enter your description here...',
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
  const updatfetchPageById = async (pageid) => {
    if (Number.isInteger(parseInt(pageid, 10)) && parseInt(pageid, 10) > 0) {
      try {
        const response = await axios.post(
          `${PHP_API_URL}/page.php`,
          {
            data: "fetch_page",
            id: pageid,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.status === 200) {
          setFormData((prev) => ({
            ...prev,
            updateid: response.data.data[0].id,
            ptitle: response.data.data[0].ptitle,
            page_type: response.data.data[0].page_type,
            sidebar: response.data.data[0].sidebar,
            image_file: response.data.data[0].image_file,
            pdf_file: response.data.data[0].pdf_file,
            page_content: validator.unescape(response.data.data[0]?.page_content || ""),
            meta_title: response.data.data[0].meta_title,
            meta_content: response.data.data[0].meta_content,
            meta_keywords: response.data.data[0].meta_keywords,
            unlink_image_file: response.data.data[0].image_file,
            unlink_pdf_file: response.data.data[0].pdf_file,
          }));
          setpageType(response.data.data[0].page_type);
          if (response.data.data[0].image_file) {
            setPreviewImage(
              `${FILE_API_URL}/${response.data.data[0].image_file}`
            );
          }
          if (response.data.data[0].pdf_file) {
            setPreviewPdf(`${FILE_API_URL}/${response.data.data[0].pdf_file}`);
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
    }
  };
  useEffect(() => {
    if (pageid) updatfetchPageById(pageid);
  }, [pageid]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;
    if (id === "image_file") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));
        setPreviewPdf(null);
        setFormData((formData) => ({ ...formData, image_file: file }));
      } else {
        toast.error(
          "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
        );
      }
    } else if (id === "pdf_file") {
      if (file.type === "application/pdf") {
        setPreviewPdf(URL.createObjectURL(file));
        setPreviewImage(null);
        setFormData((formData) => ({ ...formData, pdf_file: file }));
      } else {
        toast.error("Invalid PDF format. Only .pdf and .pdfx are allowed.");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (!formData.ptitle) {
      toast.error("Page Title is required.");
      return setIsSubmit(false);
    }
    if (!formData.page_type) {
      toast.error("Page type is required.");
      return setIsSubmit(false);
    }

    if (!formData.image_file && !formData.pdf_file && !formData.page_content) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    }
    if (formData.pdf_file) {
      setFormData((prev) => ({
        ...prev,
        image_file: "",
        page_content: "",
      }));
    }
    const sendFormData = new FormData();
    for (let key in formData) {
      sendFormData.append(key, formData[key]);
    }
    sendFormData.append("data", "pagesave");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));

    try {
      // submit to the API here
      const response = await axios.post(
        `${PHP_API_URL}/page.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
        if (response.data.status === 201) {
          setFormData(initialForm);
        }
      } else {
        toast.error("An error occurred. Please try again.");
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
    } finally {
      setIsSubmit(false);
    }
  };
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      page_content: newContent
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
                  <i className="fas fa-home m-r-5" />
                  Dashboard
                </a>
                <span className="breadcrumb-item">CMS</span>
                <span className="breadcrumb-item active">Standard Pages</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent mb-2">
            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
              <h5 className="card-title h6_new">
                {formData.updateid ? "Update Page" : "Add New"}
              </h5>
              <div className="ml-auto id-mobile-go-back">
                <button
                  className="mr-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link
                  to={"/admin/page-list"}
                  className="ml-2 btn-md btn border-0 btn-secondary"
                >
                  <i className="fas fa-list" /> Pages List
                </Link>
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
                        <label>Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ptitle"
                          placeholder="Enter Title"
                          value={formData.ptitle}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-12 form-group">
                        <label>Page Type</label>
                        <Select
                          options={[
                            { value: "image", label: "Image" },
                            { value: "pdf", label: "PDF" },
                            { value: "content", label: "Content" },
                          ]}
                          value={
                            pageType
                              ? {
                                value: pageType,
                                label: capitalizeFirstLetter(pageType),
                              }
                              : null
                          }
                          onChange={(selected) => {
                            setFormData({
                              ...formData,
                              page_type: selected.value,
                            });
                            setpageType(selected.value);
                          }}
                        />
                      </div>
                      <div
                        className={`form-group col-md-12 ${formData.page_type === "image" ? "" : "d-none"
                          }`}
                      >
                        <label>Choose Image</label>
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
                      <div
                        className={`form-group col-md-12 ${formData.page_type === "pdf" ? "" : "d-none"
                          }`}
                      >
                        <label>Choose PDF</label>
                        <input
                          type="file"
                          id="pdf_file"
                          accept=".pdf"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                        {previewPdf && (
                          <iframe
                            src={previewPdf}
                            title="PDF Preview"
                            className="mt-3"
                            style={{ width: "100%", height: 300 }}
                          ></iframe>
                        )}
                      </div>
                      <div
                        className={`col-md-12 ${formData.page_type !== "pdf" ? "" : "d-none"
                          }`}
                      >
                        {/* JoditEditor component */}
                        <label className='font-weight-semibold'>Description</label>
                        <JoditEditor
                          value={formData?.page_content || ''}
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
                        placeholder="Enter Meta Title"
                        value={formData.meta_title}
                        column="col-md-12"
                        onChange={handleChange}
                      />
                      <TextareaField
                        label="Meta Description"
                        name="meta_content"
                        id="meta_content"
                        placeholder="Enter Meta Description"
                        value={formData.meta_content}
                        column="col-md-12"
                        onChange={handleChange}
                      />
                      <TextareaField
                        label="Meta Keywords"
                        name="meta_keywords"
                        id="meta_keywords"
                        placeholder="Enter Meta Keywords"
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
}

export default AddPage;
