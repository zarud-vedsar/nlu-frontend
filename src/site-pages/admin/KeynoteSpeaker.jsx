import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  PHP_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const KeynoteSpeaker = () => {
  const { mrq_slider_id, key_note_id } = useParams();

  const initialForm = {
    keynote_name: "",
    keynote_link: "",
    keynote_content: "",
    keynote_photo: "",
    hiddenphoto: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [marquee, setMarquee] = useState();
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const getMarquee = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_mrq_slider_by_id");
      bformData.append("id", mrq_slider_id);

      const response = await axios.post(
        `${PHP_API_URL}/mrq_slider.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setMarquee(response?.data?.data[0]);
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
    if (mrq_slider_id) {
      getMarquee();
    }
  }, [mrq_slider_id]); // Ensure id is a dependency

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // for update
  const getMessage = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_keynote_by_id");
      bformData.append("id", key_note_id);

      const response = await axios.post(
        `${PHP_API_URL}/keynote_speaker.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setFormData({
          keynote_name: response.data.data[0].keynote_name,
          keynote_link: response.data.data[0].keynote_link,
          keynote_content: response.data.data[0].keynote_content,
          keynote_photo: response.data.data[0].keynote_photo,
          hiddenphoto: response.data.data[0].keynote_photo,
        });

        if (response.data.data[0].keynote_photo) {
          setPreviewImage(
            `${FILE_API_URL}/keynote/${response.data.data[0].keynote_photo}`
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
    if (key_note_id) {
      getMessage();
    }
  }, [key_note_id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;
    if (id === "keynote_photo") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));

        setFormData((formData) => ({ ...formData, keynote_photo: file }));
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
    if (!formData.keynote_name) {
      toast.error("Name is required.");
      return setIsSubmit(false);
    } else if (!formData.keynote_link) {
      toast.error("Company Name is required.");
      return setIsSubmit(false);
    } else if (!formData.keynote_content) {
      toast.error("Content is required.");
      return setIsSubmit(false);
    } else if (!formData.keynote_photo) {
      toast.error("Image is required.");
      return setIsSubmit(false);
    }

    const sendFormData = new FormData();
    sendFormData.append("data", "keynote_add");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("mrq_slider_id", mrq_slider_id);

    if (key_note_id) {
      sendFormData.append("updateid", key_note_id);
    }

    Object.entries(formData).forEach(([key, value]) => {
      sendFormData.append(key, value);
    });

    try {
      const response = await axios.post(
        `${PHP_API_URL}/keynote_speaker.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
                <span className="breadcrumb-item active">Keynote Speaker</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">
                {key_note_id
                  ? "Update Keynote Speaker"
                  : "Add New Keynote Speaker"}
              </h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to={`/admin/keynote-speaker-list/${mrq_slider_id}`}>
                  <button className="ml-auto btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Keynote Speaker List
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
                      <div className="form-group col-md-12 ">
                        <label>
                          <strong>Import Update Title</strong>
                        </label>
                        <div className="col-md-12 mb-3">{marquee?.content}</div>
                      </div>

                      <div className="form-group col-md-6">
                        <label>
                          Name<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="keynote_name"
                          value={formData.keynote_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label>
                          Link<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="keynote_link"
                          value={formData.keynote_link}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-12 ">
                        <label>
                          Image <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          id="keynote_photo"
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
                          name="keynote_content"
                          value={formData.keynote_content}
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

export default KeynoteSpeaker;
