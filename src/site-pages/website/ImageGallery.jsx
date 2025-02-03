import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import LightGallery from "lightgallery/react";
import axios from "axios";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { FILE_API_URL } from "../../site-components/Helper/Constant";
import { capitalizeFirstLetter } from "../../site-components/Helper/HelperFunction";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-video.css";
import "lightgallery/css/lg-pager.css";
// Import all plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgShare from "lightgallery/plugins/share";
import lgVideo from "lightgallery/plugins/video";
import lgPager from "lightgallery/plugins/pager";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaAngleRight } from "react-icons/fa6";
const ImageGallery = () => {
  const [loading, setLoading] = useState();
  const [galleryList, setGalleryList] = useState([]);

  const getGallery = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "getFrontGallery");
      const response = await axios.post(
        `${PHP_API_URL}/gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setGalleryList(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getGallery();
  }, []);
  const [activeIndex, setActiveIndex] = useState(0); // Track active tab for accordion behavior

  const togglePanel = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index)); // Toggle active panel
  };
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center heading-primary2 butler-regular text-white">
                  Photo Gallery
                </h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li>Photo Gallery</li>
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
                      <Tab key={index} onClick={() => togglePanel(index)}>
                        {capitalizeFirstLetter(category.category)}
                      </Tab>
                    ))}
                </TabList>

                {/* TabPanels */}
                {galleryList &&
                  galleryList.length > 0 &&
                  galleryList.map((category, index) => (
                    <TabPanel
                      key={index}
                      className={`tab-panel ${
                        activeIndex === index ? "" : "hidden"
                      }`}
                    >
                      {/* Loop through items in each category */}
                      {category.items &&
                        category.items.length > 0 &&
                        category.items.map((item, itemIndex) => (
                          <div className="row mb-3" key={itemIndex}>
                            {/* Loop through gallery_images for each item */}
                            {item.gallery_images &&
                              item.gallery_images.length > 0 && (
                                <>
                                  <div className="col-md-12">
                                    <h2 className="heading-primary3 mb-3 text-center">
                                      {capitalizeFirstLetter(item.title)}
                                    </h2>
                                  </div>
                                  <LightGallery
                                    speed={500}
                                    plugins={[
                                      lgThumbnail,
                                      lgZoom,
                                      lgAutoplay,
                                      lgFullscreen,
                                      lgShare,
                                      lgVideo,
                                      lgPager,
                                    ]}
                                    mode="lg-fade"
                                    className="col-12 col-sm-4 col-md-4 col-lg-3"
                                  >
                                    {item.gallery_images.map(
                                      (image, imageIndex) => (
                                        <>
                                          {/* <div key={imageIndex} className="col-12 col-sm-4 col-md-4 col-lg-3 gallery-col"> */}
                                          <a
                                            href={`${FILE_API_URL}/gallery/${image}`}
                                            className="col-12 col-sm-4 col-md-4 col-lg-3 gallery-col"
                                          >
                                            <img
                                              src={`${FILE_API_URL}/gallery/${image}`}
                                              alt={image}
                                              className="gal-image"
                                            />
                                          </a>
                                          {/* </div> */}
                                        </>
                                      )
                                    )}
                                  </LightGallery>
                                </>
                              )}
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
                            className="tab-panel"
                            style={{ padding: "15px", marginTop: "10px" }}
                          >
                            {category.items &&
                              category.items.length > 0 &&
                              category.items.map((item, itemIndex) => (
                                <div className="row mb-3" key={itemIndex}>
                                  {/* Loop through gallery_images for each item */}
                                  {item.gallery_images &&
                                    item.gallery_images.length > 0 && (
                                      <>
                                        <div className="col-md-12">
                                          <h2 className="heading-primary3 mb-3 text-center">
                                            {capitalizeFirstLetter(item.title)}
                                          </h2>
                                        </div>
                                        <LightGallery
                                          speed={500}
                                          plugins={[
                                            lgThumbnail,
                                            lgZoom,
                                            lgAutoplay,
                                            lgFullscreen,
                                            lgShare,
                                            lgVideo,
                                            lgPager,
                                          ]}
                                          mode="lg-fade"
                                          className="col-12 col-sm-12 col-md-12 col-lg-12"
                                        >
                                          {item.gallery_images.map(
                                            (image, imageIndex) => (
                                              <>
                                                <a
                                                  href={`${FILE_API_URL}/gallery/${image}`}
                                                  className="col-12 col-sm-6 col-md-6 col-lg-6 gallery-col" // Adjusted column classes
                                                >
                                                  <img
                                                    src={`${FILE_API_URL}/gallery/${image}`}
                                                    alt={image}
                                                    className="gallery-image"
                                                  />
                                                </a>
                                              </>
                                            )
                                          )}
                                        </LightGallery>
                                      </>
                                    )}
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

      <style jsx>
        {`
        .gallery-image {
  border-radius: 10px;
  width: 70%;
  aspect-ratio: 1/1;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}
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

export default ImageGallery;
