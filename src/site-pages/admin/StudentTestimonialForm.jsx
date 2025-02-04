import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  PHP_API_URL,
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const StudentTestimonialForm = () => {
  const { id } = useParams();

  const initialForm = {
    test_name: "",
    phone: "",
    email: "",
    test_company: "",
    test_rating: "",
    test_occupation: "",
    test_content: "",
    test_photo: "",
    hiddenphoto: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getMessage = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_testimonial_by_id");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/std_testimonial.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setFormData({
          test_name: response.data.data[0].test_name,
          phone: response.data.data[0].phone,
          email: response.data.data[0].email,
          test_company: response.data.data[0].test_company,
          test_rating: response.data.data[0].test_rating,
          test_occupation: response.data.data[0].test_occupation,
          test_content: response.data.data[0].test_content,
          test_photo: response.data.data[0].test_photo,
          hiddenphoto: response.data.data[0].test_photo,
        });

        if (response.data.data[0].test_photo) {
          setPreviewImage(
            `${FILE_API_URL}/testimonial/${response.data.data[0].test_photo}`
          );
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
  };

  useEffect(() => {
    if (id) {
      getMessage();
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;
    if (id === "test_photo") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));
        console.log(file);

        setFormData((formData) => ({ ...formData, test_photo: file }));
      } else {
        toast.error(
          "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    console.log(formData);

    setIsSubmit(true);
    if (!formData.test_name) {
      toast.error("Name is required.");
      return setIsSubmit(false);
    } else if (!formData.phone || !phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return setIsSubmit(false);
    } else if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email");
      isValid = false;
    } else if (!formData.test_company) {
      toast.error("Company Name is required.");
      return setIsSubmit(false);
    } else if (!formData.test_rating) {
      toast.error("Rating is required.");
      return setIsSubmit(false);
    } else if (!formData.test_occupation) {
      toast.error("Occupation is required.");
      return setIsSubmit(false);
    } else if (!formData.test_content) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    } else if (!formData.test_photo) {
      toast.error("Image is required.");
      return setIsSubmit(false);
    }

    const sendFormData = new FormData();
    sendFormData.append("data", "testimonial_add");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));

    if (id) {
      sendFormData.append("updateid", id);
      console.log('updateid',id)
    }

    for (let key in formData) {
      sendFormData.append(key, formData[key]);
    }

    for(let [key,value] of sendFormData){
      console.log(key,value)
    }
    console.log(`${PHP_API_URL}/std_testimonial.php`)
    try {
      const response = await axios.post(
        `${PHP_API_URL}/std_testimonial.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
        setFormData(initialForm);
        setPreviewImage(null);
        if (response.data?.status === 200) {
          window.history.back();
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
                <span className="breadcrumb-item active">
                  Student Testimonial
                </span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">
                {id
                  ? "Update Student Testimonial"
                  : "Add New Student Testimonial"}
              </h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to="/admin/student-testimonial">
                  <button className="ml-auto btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Student Testimonial
                    List
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label>
                          Name<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="test_name"
                          value={formData.test_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label>
                          Phone<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label>
                          Email<span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label>
                          Company<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="test_company"
                          value={formData.test_company}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label>
                          Rating<span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="test_rating"
                          value={formData.test_rating}
                          onChange={handleChange}
                        >
                          <option value="">Select Rating</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div className="form-group col-md-4">
                        <label>
                          Occupation<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="test_occupation"
                          value={formData.test_occupation}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-12 ">
                        <label>
                          Image <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          id="test_photo"
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
                        <label>
                          Content<span className="text-danger">*</span>
                        </label>
                        <textarea
                          type="text"
                          className="form-control"
                          name="test_content"
                          value={formData.test_content}
                          onChange={handleChange}
                        ></textarea>
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentTestimonialForm;
