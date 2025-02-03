import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Img2 from '../assets/Images/img-2.jpg';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PHP_API_URL } from '../../Helper/Constant';
import { FILE_API_URL } from '../../Helper/Constant';

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
  const sliderRef = useRef(null);
  const [image, setImage] = useState([]);

  const sliderSettings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '20px',
        },
      },
    ],
  };

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const getGallery = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getRandomGallery");
      const response = await axios.post(`${PHP_API_URL}/gallery.php`, bformData);
      setImage(response.data.data);
    } catch (error) { /* empty */ }
  };
  useEffect(() => {
    getGallery()
  }, [])
  return (
    <div className="latest-area section-padding-30 kn-position-realative" >
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="gal-section-title-wrapper">
              <h2 className="heading-primary2 butler-regular">Our Gallery</h2>
              <Link to="/image-gallery" target='_blank' className='text-primary custom-link gorditas-regular ms-5'>View All <FaLongArrowAltRight /></Link>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Prev button */}
          <div className="col-2">
            <button onClick={prevSlide} className="kn-prev kn-btn">
              <FaChevronLeft />
            </button>
          </div>
          <Slider ref={sliderRef} {...sliderSettings} className="kn-cards-contain">
            {image.map((img, index) => (
              <div className="col-md-3 mb-333 col-lg-3 col-12 col-sm-12" key={index}>
                <div style={{ width: '95%' }}>
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
                    mode="lg-fade">
                    <a href={`${FILE_API_URL}/gallery/${img}`}>
                      {/* {console.log(img)} */}
                      <img src={`${FILE_API_URL}/gallery/${img}`} className="gal-image" />
                    </a>
                  </LightGallery>
                </div>
              </div>
            ))}

          </Slider>

          {/* Next button */}
          <div className="col-2">
            <button onClick={nextSlide} className="kn-next kn-btn">
              <FaChevronRight />

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
