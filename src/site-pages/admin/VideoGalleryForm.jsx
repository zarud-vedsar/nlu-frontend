import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  PHP_API_URL,
  FILE_API_URL,
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { Link } from "react-router-dom";
import Select from "react-select";

import { useParams } from "react-router-dom";

const VideoGalleryForm = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    gallery_videos: [],
    oldfile: [],
    updateid: "",
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [errorKey, setErrorKey] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(true);

  const updateCategory = (e) => {
    setSelectCategory(e);
    setFormData((prevState) => ({
      ...prevState,
      cat_id: e.value,
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;

    if (!files) return;

    const newPreviewImages = [];
    const newGalleryImages = [];

    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    const maxFiles = 5; // Max allowed files

    // Check if more than 5 files are selected
    if (files.length + previewImages.length > maxFiles) {
      toast.error("You can only upload up to 5 video files.");
      return; // Stop processing if more than 5 files are selected
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith("video/")) {
        if (file.size > maxSize) {
          toast.error("File size is too large. Maximum allowed size is 5 MB.");
          continue; // Skip this file if it exceeds the size limit
        }

        const fileUrl = URL.createObjectURL(file);
        newPreviewImages.push(fileUrl);
        newGalleryImages.push(file);
      } else {
        toast.error(
          "Invalid file format. Only video files (mp4, mov, etc.) are allowed."
        );
      }
    }

    // Update state with valid files
    setPreviewImages((prevImages) => [...prevImages, ...newPreviewImages]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      gallery_videos: [...prevFormData.gallery_videos, ...newGalleryImages],
    }));
  };

  const removeImage = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      gallery_videos: prevFormData.gallery_videos.filter((_, i) => i !== index),
      oldfile: prevFormData.oldfile.filter((_, i) => i !== index),
    }));

    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getGalleryById = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getGalleryById");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/video_gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        let splitedGallery =
          response.data?.data[0]?.gallery_videos?.split("$;");

        setFormData((prev) => ({
          ...prev,
          title: response.data.data[0].title,
          cat_id: response?.data?.data[0]?.cat_id,
          gallery_videos: splitedGallery,
          oldfile: splitedGallery,
          updateid: id,
        }));

        

        let updatedPreviewImages = [];

        splitedGallery.map((gallery) => {
          updatedPreviewImages.push(
            `${FILE_API_URL}/vidGallery/${gallery}`
          );
        });

        setPreviewImages(updatedPreviewImages);
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

  useEffect(()=>{
    const cat = category?.find(
      (cat) => cat.value === formData?.cat_id
    );
    if (cat) {
      setSelectCategory(cat);
    }
  },[category,formData])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await loadCategory();
      if (id) {
        await getGalleryById();
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const loadCategory = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_mediaCategory");

      const response = await axios.post(
        `${PHP_API_URL}/gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const tempCat = response.data.data.map((dep) => ({
        value: dep.id,
        label: dep.cat_title,
      }));
      setCategory(tempCat);
    } catch (error) {
      setCategory([]);
      console.error("Error fetching  data:", error);
    } finally {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!formData.title) {
      toast.error("Title is required.");
      return setIsSubmit(false);
    } else if (!formData.gallery_videos) {
      toast.error("Video is required.");
      return setIsSubmit(false);
    } else if (!formData.cat_id) {
      toast.error("Category is required.");
      return setIsSubmit(false);
    }

    const sendFormData = new FormData();
    sendFormData.append("data", "add_video_gallery");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("title", formData.title);
    sendFormData.append("cat_id", formData?.cat_id);

    if (id) {
      sendFormData.append("updateid", id);
      sendFormData.append("oldfile", formData.oldfile);
    }

    formData.gallery_videos.forEach((file, index) => {
      sendFormData.append("gallery_videos[]", file);
    });
    formData.oldfile.forEach((file, index) => {
      sendFormData.append("oldfile[]", file);
    });

    

    try {
      const response = await axios.post(
        `${PHP_API_URL}/video_gallery.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data?.msg);
        setFormData((prev) => ({
          ...prev,
          title: "",
          gallery_videos: [],
          oldfile: [],
          updateid: "",
        }));
        if (response.data.status === 200) {
          window.history.back();
        }

        setPreviewImages([]);
        setSelectCategory(null);
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
  if (loading) {
    return (
      <div className="page-container">
        <div className="main-content ">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

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
                <span className="breadcrumb-item active">Gallery Video</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">
                {formData.updateid
                  ? "Update Gallery Video"
                  : "Add New Galley Video"}
              </h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to="/admin/gallery">
                  <button className="ml-auto btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Galley Video
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
                      <div className="form-group col-md-12">
                        <label>
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <label
                          className="font-weight-semibold"
                          htmlFor="cat_id"
                        >
                          Select Category <span className="text-danger">*</span>
                        </label>
                        <Select
                          value={selectCategory}
                          options={category}
                          onChange={updateCategory}
                        />

                        {errorKey === ".cat_id" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>

                      <div className="form-group col-md-12 ">
                        <label>
                          Videos (Multiples){" "}
                          <span className="text-danger">
                          * Note: Uploading videos may take some time. The maximum allowed file size is 5MB per video, and you can upload a maximum of 5 videos.
                          </span>
                        </label>
                        <input
                          type="file"
                          id="authority_img"
                          accept=".mp4, .mov"
                          className="form-control"
                          onChange={handleFileChange}
                          multiple
                        />
                        <div className="position-relative">
                          {previewImages &&
                            previewImages.map((previewImage, index) => (
                              <div
                                key={index}
                                className="position-relative d-inline-block mt-3"
                              >
                                <video
                                  style={{
                                    height: "150px",
                                    width: "150px",
                                    marginLeft: "10px",
                                  }}
                                  className="img-fluid"
                                  controls
                                >
                                  <source src={previewImage} />
                                  Your browser does not support the video tag.
                                </video>

                                <i
                                  className="fa-solid fa-xmark rounded-circle"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    color: "red",
                                    padding: "5px",
                                    position: "absolute",
                                    right: "3px",
                                  }}
                                  onClick={() => removeImage(index)}
                                ></i>
                              </div>
                            ))}
                        </div>
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoGalleryForm;
