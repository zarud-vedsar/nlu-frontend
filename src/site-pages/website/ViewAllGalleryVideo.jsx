import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../site-components/Helper/HelperFunction";
import { PHP_API_URL, NODE_API_URL } from "../../site-components/Helper/Constant";
import  "../../site-components/website/assets/css/ViewAllVideoGallery.css"

const ViewAllVideoGallery = () => {
  const { id } = useParams();

  const [galleryList, setGalleryList] = useState({
    title: "",
    gallery_videos: [],
  });

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

        setGalleryList((prev) => ({
          ...prev,
          title: response.data.data[0].title,
          gallery_videos: splitedGallery,
        }));
      }
    } catch (error) {
      setGalleryList({});
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
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Gallery</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>Video Gallery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div
          className="row "
          style={{ margin: "30px 0px" }}
        >
          <h2 className="">{capitalizeFirstLetter(galleryList?.title)}</h2>
          <div className="row ">
            <div className="col-md-12 col-12 col-sm-12">
              {galleryList?.gallery_videos.map((video, index) => (
                <div
                  className="col-12 col-sm-12 col-md-4 button-container"
                  key={index}
                  style={{ margin: "30px 0px" }}
                >
                  <div className="mb-3 ">
                    <video
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "250px", // Fixed height for tablet
                        objectFit: "cover", // Ensure the aspect ratio is preserved
                      }}
                      controls
                    >
                      <source
                        src={`${NODE_API_URL}/public/upload/vidGallery/${video}`}
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

     
    </>
  );
};

export default ViewAllVideoGallery;
