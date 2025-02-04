import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import {
  PHP_API_URL,
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import SettingSideBar from "./SettingSideBar";
import { useRef } from "react";

const BrandSetting = () => {
  const [formData, setFormData] = useState({
    business_bottom: "",
    business_top: "",

    unlink_favicon: "",
    unlink_light_logo: "",
    unlink_dark_logo: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const logoDarkRef = useRef(null);
  const logoLightRef = useRef(null);
  const logoFaviconRef = useRef(null);

  const [files, setFiles] = useState({
    logoDark: null,
    logoFavicon: null,
  });
  const [previewFiles, setPreviewFiles] = useState({
    logoDark: null,
    logoFavicon: null,
  });

  const handleFileChange = (e, field) => {
    console.log(e);
    const file = e.target.files[0];
    const { name } = e.target;
    console.log(name, file);

    if (file) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: file,
      }));
      setPreviewFiles((prevFiles) => ({
        ...prevFiles,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const handleButtonClick = (ref) => {
    ref.current.click();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getScholarship = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_brand_sett");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.data.status === 200) {
        setFormData((pre) => ({
          ...pre,
          business_top: response.data.data[0].business_top,
          business_bottom: response.data.data[0].business_bottom,
          logoLight: response.data.data[0].light_logo,
          logoFavicon: response.data.data[0].site_favicon,
          logoDark: response.data.data[0].dark_logo,
          unlink_favicon: response.data.data[0].site_favicon,
          unlink_light_logo: response.data.data[0].light_logo,
          unlink_dark_logo: response.data.data[0].dark_logo,
        }));

        setFiles((prevFiles) => ({
          ...prevFiles,
          logoLight: response?.data?.data[0]?.light_logo,
          logoFavicon: response?.data?.data[0]?.site_favicon,
          logoDark: response?.data?.data[0]?.dark_logo,
        }));
        setPreviewFiles((prevFiles) => ({
          ...prevFiles,
          logoLight: `${FILE_API_URL}/${response?.data?.data[0]?.light_logo}`,
          logoFavicon: `${FILE_API_URL}/${response?.data?.data[0]?.site_favicon}`,
          logoDark: `${FILE_API_URL}/${response?.data?.data[0]?.dark_logo}`,
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
    getScholarship();
  }, []);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const { id } = e.target;

  //   if (!file) return;
  //   if (id === "upload_file") {
  //     if (file.type.startsWith("")) {
  //       setFormData((formData) => ({ ...formData, upload_file: file }));
  //     } else {
  //       toast.error(
  //         "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
  //       );
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!formData.business_top) {
      toast.error("Business name top is required.");
      return setIsSubmit(false);
    }
    if (!formData.business_bottom) {
      toast.error("Business name bottom is required.");
      return setIsSubmit(false);
    }
    if (!files.logoDark) {
      toast.error("Dark logo  is required.");
      return setIsSubmit(false);
    }

    if (!files.logoFavicon) {
      toast.error("Favicon is required.");
      return setIsSubmit(false);
    }
    if (!files.logoLight) {
      toast.error("Light logo is required.");
      return setIsSubmit(false);
    }

    const sendFormData = new FormData();
    sendFormData.append("data", "update_brand_sett");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("dark_logo", files.logoDark);
    sendFormData.append("site_favicon", files.logoFavicon);
    sendFormData.append("light_logo", files.logoLight);

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      sendFormData.append(key, value)
    });

    try {
      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (response.data?.status === 201 || response.data?.status === 200) {
        toast.success(response.data.msg);

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

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-0">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash">
                <a className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Setting
                </a>
                <a href="" className="breadcrumb-item">
                  <i className="fas " /> Company Profile
                </a>
                <span className="breadcrumb-item active">Brand Setting</span>
              </nav>
            </div>
          </div>

          <div className="d-flex col-12 mx-auto mt-5">
            <div className="col-md-2 mr-2">
              <SettingSideBar />
            </div>

            <form onSubmit={handleSubmit} className="col-md-10 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="form-group col-md-4 justify-content-center">
                      <label>
                        Logo Dark <span className="text-danger">*</span>
                      </label>
                      <br />
                      <img
                        style={{ width: "200px", height: "200px" }}
                        src={previewFiles.logoDark}
                        alt=""
                      />
                      <input
                        type="file"
                        ref={logoDarkRef}
                        accept="image/*"
                        name="logoDark"
                        className="form-control"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, "logoDark")}
                      />
                      <br />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleButtonClick(logoDarkRef)}
                      >
                        Upload Logo Dark
                      </button>
                    </div>

                    <div className="form-group col-md-4">
                      <label>
                        Logo Light <span className="text-danger">*</span>
                      </label>

                      <br />
                      <img
                        style={{ width: "200px", height: "200px" }}
                        src={previewFiles.logoLight}
                        alt=""
                      />
                      <input
                        type="file"
                        ref={logoLightRef}
                        accept="image/*"
                        name="logoLight"
                        className="form-control"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, "logoLight")}
                      />
                      <br />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleButtonClick(logoLightRef)}
                      >
                        Upload Logo Light
                      </button>
                      <br />
                    </div>

                    <div className="form-group col-md-4">
                      <label>
                        Logo Favicon <span className="text-danger">*</span>
                      </label>
                      <br />
                      <img
                        style={{ width: "200px", height: "200px" }}
                        src={previewFiles?.logoFavicon}
                        alt=""
                      />
                      <input
                        type="file"
                        ref={logoFaviconRef}
                        accept="image/*"
                        name="logoFavicon"
                        className="form-control"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, "logoFavicon")}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleButtonClick(logoFaviconRef)}
                      >
                        Upload Logo Favicon
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6">
                      <label>
                        Business Name Top <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="business_top"
                        value={formData.business_top}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label>
                        Business Name Bottom{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="business_bottom"
                        value={formData.business_bottom}
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
    </div>
  );
};

export default BrandSetting;
