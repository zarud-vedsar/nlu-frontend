import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PHP_API_URL,
  NODE_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaAngleRight } from "react-icons/fa6";
import { capitalizeFirstLetter } from "../../site-components/Helper/HelperFunction";
const VideoGallery = () => {
  const [loading, setLoading] = useState(false);
  const [galleryList, setGalleryList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullScreenVideo, setFullScreenVideo] = useState(null);

  // Fetch Gallery Data
  const getGallery = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "getFrontVideoGallery");

      const response = await axios.post(
        `${PHP_API_URL}/video_gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setGalleryList(response.data.data);
    } catch (error) {
      console.error("Error fetching video gallery data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGallery();
  }, []);

  const togglePanel = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const openFullScreen = (videoSrc) => {
    setFullScreenVideo(videoSrc);
  };

  const closeFullScreen = () => {
    setFullScreenVideo(null);
  };

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center heading-primary2 butler-regular text-white">
                  Video Gallery
                </h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li>Video Gallery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 desktop">
              <Tabs>
                <TabList>
                  {galleryList &&
                    galleryList.length > 0 &&
                    galleryList.map((category, index) => (
                      <Tab key={index} onClick={() => togglePanel(index)} >
                        {capitalizeFirstLetter(category.category)}
                      </Tab>
                    ))}
                </TabList>

                {galleryList &&
                  galleryList.length > 0 &&
                  galleryList.map((category, index) => (
                    <TabPanel
                      key={index}
                      className={`tab-panel ${
                        activeIndex === index ? "" : "hidden"
                      }`}
                    >
                      {category.items &&
                        category.items.length > 0 &&
                        category.items.map((item, itemIndex) => (
                          <div className="row mb-3" key={itemIndex} >
                            <div className="col-md-12">
                              <h2 className="heading-primary3 mb-3 text-center ">
                                {capitalizeFirstLetter(item.title)}
                              </h2>
                            </div>
                            <div className="row">
                              {item.gallery_videos &&
                                item.gallery_videos.map((video, videoIndex) => (
                                  <div
                                    key={videoIndex}
                                    className="col-12 col-sm-4 col-md-4 col-lg-3"
                                    onClick={() =>
                                      openFullScreen(
                                        `${FILE_API_URL}/vidGallery/${video}`
                                      )
                                    }
                                  >
                                    <video
                                      style={{ width: "100%", height: "150px" }}
                                      controls
                                      className="gallery-video"
                                    >
                                      <source
                                        src={`${FILE_API_URL}/vidGallery/${video}`}
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </TabPanel>
                  ))}
              </Tabs>
            </div>
            <div className="col-md-12 mobile">
              <div className="accordion-tabs-container">
                <div className="tab-list">
                  {galleryList &&
                    galleryList.length > 0 &&
                    galleryList.map((category, index) => (
                      <div key={index}>
                        <div
                          className={`${
                            activeIndex == index ? "active_mobile_tab" : "tab"
                          } `}
                          onClick={() => togglePanel(index)}
                          style={{
                            cursor: "pointer",
                            marginBottom: "5px",
                            padding: "10px",
                            borderBottom:
                              activeIndex === index
                                ? "2px solid #892834"
                                : "1px solid #ccc",
                          }}
                        >
                          {capitalizeFirstLetter(category.category)}
                        </div>

                        {activeIndex === index && (
                          <div
                            className="tab-panel "
                            style={{ padding: "15px", marginTop: "10px" }}
                          >
                            {category.items &&
                              category.items.length > 0 &&
                              category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="item-content" style={{marginTop:"20px"}}>
                                  <h2 className="heading-primary3 mb-3 text-center">
                                    {capitalizeFirstLetter(item.title)}
                                  </h2>
                                  <div className="row">
                                    {item.gallery_videos &&
                                      item.gallery_videos.map(
                                        (video, videoIndex) => (
                                          <div
                                            key={videoIndex}
                                            className="col-12 col-sm-4 col-md-4 col-lg-3 d-flex justify-content-center mb-3"
                                          >
                                            <video
                                              style={{
                                                width: "90%",
                                                height: "150px",
                                              }}
                                              controls
                                              className="gallery-video"
                                            >
                                              <source
                                                src={`${FILE_API_URL}/vidGallery/${video}`}
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {fullScreenVideo && (
        <div className="fullscreen-video-overlay" onClick={closeFullScreen}>
          <div className="fullscreen-video-container">
            <button className="close-btn" onClick={closeFullScreen}>
              ×
            </button>
            <video controls autoPlay style={{ width: "100%", height: "100%" }}>
              <source src={fullScreenVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <style jsx>
        {`
          .mobile{
        display:none
      }
        .desktop{
                display:block

        }

           @media (max-width: 600px) {
      .mobile{
        display:block
      }
        .desktop{
                display:none

        }
    }

    .active_mobile_tab{
    color:#000000;
    }
   
    }`}
      </style>
    </>
  );
};

export default VideoGallery;
