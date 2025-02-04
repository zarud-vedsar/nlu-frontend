import React, { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { data } from "jquery";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { NODE_API_URL } from "../../site-components/Helper/Constant";

const AddVendorForm = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState();

  const [errorKey, setErrorKey] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [selectDepartment, setSelectDepartment] = useState();
  const [selectDesignation, setSelectDesignation] = useState();
  const [isSubmit, setIsSubmit] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (id) {
      getFacultyDetail();
    }
  }, []);

  const [formData, setFormData] = useState({
    user_update_id: "",
    user_updateu_id: "",
    avtar_user: "",
    phone: "",
    name: "",
    address: "",
    city: "",
    state: "",
    email: "",
  });

  const getFacultyDetail = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getVendorById");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("id", id);
      
      bformData.forEach((value, key) => {
        console.log(key, value);
      });
      const res = await axios.post(`${PHP_API_URL}/vendor.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = res.data.data;
      console.log(result);
      setFormData({
        user_update_id: result[0].id,
        user_updateu_id: result[0]?.uid,
        avtar_user: result[0]?.profile,
        name: result[0].name,
        phone: result[0]?.phone,
        address: result[0]?.address,
        city: result[0]?.city,
        state: result[0]?.state,
        email: result[0]?.email,
      });
      console.log(`${FILE_API_URL}/vendor/${result[0].profile}`)
      setPreviewImage(
        `${FILE_API_URL}/vendor/${result[0].profile}`
      );
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleChange = async (e) => {
    const { name, value, type } = e.target;

    if (type == "number" && value.length > 10) {
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    console.log(formData);

    // Validate customer name
    if (!formData.name) {
      setErrorMessage("Please enter name");
      setErrorKey(".name");
      isValid = false;
    }

    // Validate phone number
    else if (!formData.phone) {
      setErrorMessage("Please enter valid phone number");
      setErrorKey(".phone");
      isValid = false;
    } else if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Please enter valid email");
      setErrorKey(".email");
      isValid = false;
    } else if (!formData.city) {
      setErrorMessage("Please enter  district");
      setErrorKey(".c_district");
      isValid = false;
    } else if (!formData.state) {
      setErrorMessage("Please enter state");
      setErrorKey(".c_state");
      isValid = false;
    }

    // Validate address
    else if (!formData.address) {
      setErrorMessage("Please enter address");
      setErrorKey(".c_address");
      isValid = false;
    }
    if (!isValid) {
      console.log("Form contains errors. Please correct them and try again.");
    } else {
      setErrorMessage("");
      setErrorKey("");
    }

    if (isValid) {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "vendor_add");

      if(id){
        bformData.append("update_id",id)
      }

      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        bformData.append(key, value);
        console.log(key, value);
      });

      try {
        const response = await axios.post(
          `${PHP_API_URL}/vendor.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        if (response.data?.status === 200 || response.data?.status === 201) {
          toast.success(response.data.msg);
          setFormData((pre) => ({
            ...pre,
            user_update_id: "",
            user_updateu_id: "",
            avtar_user: "",
            phone: "",
            name: "",
            address: "",
            city: "",
            state: "",
            email: "",
          }));

          if (response.data?.status === 200) {
            window.history.back();
          }

        } else {
          toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        const status = error.response?.data?.status;

        if (status === 500) {
          toast.error(error.response.data.msg || "A server error occurred.");
        } else if (status == 400) {
          setErrorKey(error.response.data.key);
          setErrorMessage(error.response.data.msg);
          toast.error(error.response.data.msg);
        } else {
          toast.error(
            "An error occurred. Please check your connection or try again."
          );
        }
      } finally {
      }
    }
  };

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
    if (file) {
      setFormData({
        ...formData,
        avtar_user: file,
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className=" mb-0 mt-0">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash ">
                <a href="./" className="breadcrumb-item  ">
                  <i className="anticon  m-r-5 "></i>Library
                </a>

                <span className="breadcrumb-item active">Vendor</span>
              </nav>
            </div>
          </div>

          <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
            <h2 className="card-title col-12 col-md-auto">{id? 'Update Vendor Detail' :'Add New Vendor'}</h2>
            <div className="col-12 col-md-auto d-flex justify-content-end">
              <Button
                variant="light"
                className="mb-2 mb-md-0"
                onClick={() => window.history.back()}
              >
                <i className="fas">
                  <FaArrowLeft />
                </i>{" "}
                Go Back
              </Button>
            </div>
          </div>
          <div className="card">
            <div className="">
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12 mt-2 mb-3">
                      <h6 className="custom">
                        <span className="custo-head">Personal Details</span>
                      </h6>
                    </div>

                    {/* Avatar */}

                    <div className="form-group col-md-12">
                      <div
                        style={{
                          width: "110px",
                          height: "100px",
                          position: "relative",
                        }}
                        className="mx-auto"
                      >
                        {formData.avtar_user ? (
                          <img
                            src={previewImage}
                            alt="Uploaded Preview"
                            style={{
                              width: "110px",
                              height: "100px",
                              position: "relative",
                            }}
                            className="rounded-circle"
                          />
                        ) : (
                          <div
                            className="rounded-circle"
                            style={{
                              width: "110px",
                              height: "100px",
                              position: "relative",
                              background: "#efeff6",
                            }}
                          >
                            {" "}
                          </div>
                        )}
                        <label
                          htmlFor="avatar-input"
                          onClick={triggerFileInput}
                          className="rounded-circle d-flex justify-content-center  align-items-center"
                          style={{
                            position: "absolute",
                            bottom: "-7px",
                            right: "6px",
                            backgroundColor: "#1ad1ff",
                            width: "30px",
                            height: "30px",
                          }}
                        >
                          <FaRegEdit />
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                        />{" "}
                        <span className="mt-1 avtar_user"></span>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="form-group col-md-4">
                      <label className="font-weight-semibold" htmlFor="name">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errorKey === ".name" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    {/* Phone 1 */}
                    <div className="form-group col-md-4">
                      <label className="font-weight-semibold" htmlFor="phone">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errorKey === ".phone" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                    <div className="form-group col-md-4">
                      <label className="font-weight-semibold" htmlFor="email">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errorKey === ".email" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group col-md-6">
                      <label className="font-weight-semibold" htmlFor="city">
                        City <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      {errorKey === ".city" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group col-md-6">
                      <label className="font-weight-semibold" htmlFor="state">
                        State <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                      {errorKey === ".state" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <label className="font-weight-semibold" htmlFor="address">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errorKey === ".address" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="col-md-12 me-auto d-flex justify-content-between align-items-center">
                      <button type="submit" className="btn btn-dark btn-block">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVendorForm;
