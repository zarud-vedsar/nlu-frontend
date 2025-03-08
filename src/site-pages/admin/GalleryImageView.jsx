import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  PHP_API_URL,
  FILE_API_URL,
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";

const GalleryImageView = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    gallery_images: [],
  });

 
 



  const getGalleryById = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getGalleryById");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        let splitedGallery =
          response.data?.data[0]?.gallery_images?.split("$;");

        setFormData((prev) => ({
          ...prev,
          title: response.data.data[0].title,
          gallery_images: splitedGallery,
        
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
    if (id) {
      getGalleryById();
    }
  }, []);

 

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

              <span className="breadcrumb-item active">Media</span>
                <a href="/" className="breadcrumb-item">
                Gallery
              </a>

              <span className="breadcrumb-item active">View Galley Images</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent ">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">
                {formData?.title}
              </h5>
              <div className="ml-auto">
                <button
                  className="ml-auto btn-md btn border-0 goback mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to="/admin/gallery">
                  <button className="ml-auto btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Images
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="table-responsive d-flex flex-wrap">
          {formData?.gallery_images?.map((item, index) => (
            <div key={index} className="col-md-3 mt-3 flex-wrap">
              <div className="card">
                <div className="card-body ">
                  <div className="rs-container">
                    <img
                      src={`${FILE_API_URL}/gallery/${item}`}
                      style={{
                        width: "auto",
                        maxWidth: "100%",
                        height: "100px",
                      }}
                      alt="Avatar"
                      className="rs-image mx-auto border_10"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryImageView;
