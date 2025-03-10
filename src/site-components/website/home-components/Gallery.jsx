import React, { useState, useEffect } from "react";
import AOS from "aos";
import { FILE_API_URL, PHP_API_URL } from "../../Helper/Constant";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import LightGallery from "lightgallery/react";
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
const Gallery = () => {
  const [image, setImage] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
    getGallery();
  }, []);

  const getGallery = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getRandomGallery");
      const response = await axios.post(`${PHP_API_URL}/gallery.php`, bformData);
      setImage(response.data.data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  };
  const CustomArrow = ({ onClick, direction }) => {
    const isMobile = window.innerWidth <= 768; // Check for mobile view

    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          top: "50%",
          [direction]: isMobile ? "0px" : "-40px", // Adjust based on screen width
          transform: "translateY(-50%)",
          background: "#2e3e50",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {direction === "left" ? <FaChevronLeft color="white" /> : <FaChevronRight color="white" />}
      </div>
    );
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    pauseOnHover: false,
    centerMode: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="section" data-aos="fade-up" data-aos-delay="100" style={{ background: "#f8f8f8" }}>
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-12 col-sm-12 text-center" style={{ position: "relative" }}>
            <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Visual Highlights</h2>
            <div className="heading-divider"></div>
            <p className="text-center mt-3 mb-1 id-sub-title id-sub-title-mobile-view">
              Explore our Gallery and Experience the Highlights in Pictures
            </p>
          </div>
        </div>
        <div className="gallery-container col-sm-12 mt-4 ">
          <Slider {...sliderSettings}>
            {image.map((img, index) => (
              <div key={index} className="slider-item col-12">
                <LightGallery
                  speed={500}
                  plugins={[
                    lgThumbnail,
                    lgZoom,
                    lgAutoplay,
                    lgFullscreen,
                    lgShare,
                    lgVideo,
                    lgPager
                  ]}
                  mode="lg-fade"
                  closable={true} // Ensure the close button is enabled
                  hideBarsDelay={0} // Prevent hiding UI elements too quickly
                  mobileSettings={{
                    controls: true, // Ensure controls are visible on mobile
                    showCloseButton: true, // Show close button on mobile
                  }}
                >

                  <a href={`${FILE_API_URL}/gallery/${img}`} target="_blank" style={{ width: '100%' }}>
                    <img
                      className="gallery-img1 col-12 id-g-img-m-left"
                      src={`${FILE_API_URL}/gallery/${img}`}
                      alt={`Gallery Image ${index + 1}`}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px"
                      }}
                    />
                  </a>
                </LightGallery>
              </div>
            ))}
          </Slider>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <Link
              to="/image-gallery"
              target="_blank"
              style={{ minWidth: '230px' }}
              className="btn btn-primary border-0 mt-4 px-4 py-2 source-font"
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </div>
      <style>
        {`
 
  .addtextoverlap{
      position: absolute;
    right: 100px;
    top: 20px;
  }


.slider-item {
  display: flex;
  justify-content: center; /* Change from end to center */
  align-items: center;
  width: 100%; 
}

.gallery-img1 {
  width: 100%;
  max-width: 100%;
  height: 200px; 
  object-fit: cover;
  border-radius: 10px;
}

 @media screen and (min-width:320px) and (max-width:768px){
 .slider-item {
 max-width:100% !important;
        }

    .addtextoverlap {
      position: absolute;
      right: 10%;
      top: 20px;
    }

        `}
      </style>
    </div>
  );
};

export default Gallery;

