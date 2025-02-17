import React, { useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../../site-components/Helper/HelperFunction";
import axios from "axios";
import { PHP_API_URL } from "../../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { useParams, Link } from "react-router-dom";

const AddBanner = () => {
  const initialForm = {
    btitle: "",
    bshort: "",
    banner_image: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [html, sethtml] = useState("");
  const { id } = useParams();

  const handleChange = (e) => {
    let value = e.target.name;
    if (value === "bshort") {
      if (formData?.bshort?.length > 150) {
        toast.error("150 character only allowed in description");
        return;
      }
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const banner_image = e.target.files[0];
    const { id } = e.target;

    if (!banner_image) return;
    if (id === "banner_image") {
      if (banner_image.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(banner_image));
        setFormData((formData) => ({
          ...formData,
          banner_image: banner_image,
        }));
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
    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("data", "banner_add");

    // Append form data to FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) {
        sendFormData.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `${PHP_API_URL}/banner.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success(response.data.msg);

        // Reset form and states
        setFormData(initialForm);
        setPreviewImage("");
        sethtml("");

        // If status is 201, stay on the current page. If 200, navigate back
        if (response.data.status === 200) {
          window.history.back();
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      if (status === 400 || status === 500) {
        toast.error(error.response?.data.msg || "A server error occurred.");
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
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>
               
                <span className="breadcrumb-item active">CMS</span>
                <span className="breadcrumb-item active">Add New</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent col-lg-8 col-md-8 mx-auto">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new"> Add New Banner</h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                 <Link to="/admin/cms/banner/list"
                                    className="ml-2 btn-md btn border-0 btn-secondary"
                                  >
                                    <i className="fas fa-list" /> Banner List
                                  </Link>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card col-md-8 mx-auto">
              <div className="card-body">
                <div className="row mb-4">
                  <div className="form-group col-md-12 ">
                    <label> Banner Image</label>{" "}
                    <span className="text-danger">*</span>
                    <input
                      type="file"
                      id="banner_image"
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
                  <div className="form-group col-md-12">
                    <label> Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="btitle"
                      placeholder="Enter Title"
                      value={formData.btitle}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label> Short Description</label>{" "}
                    <textarea
                      type="text"
                      className="form-control"
                      name="bshort"
                      placeholder="Enter your short description..."
                      value={formData.bshort}
                      onChange={handleChange}
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

export default AddBanner;
