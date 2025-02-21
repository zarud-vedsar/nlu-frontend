import React, { useEffect, useState } from "react";
import { PHP_API_URL, FILE_API_URL } from "../../Helper/Constant";
import axios from "axios";
import validator from 'validator';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const [banner, setBanner] = useState([]);
  const fetchBanner = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_banner_front");

      const response = await axios.post(
        `${PHP_API_URL}/banner.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setBanner(response.data.data);
      }
    } catch (error) { /* empty */ }
  };
  useEffect(() => {
    fetchBanner();
  }, []);
  const CustomArrow = ({ onClick, direction }) => {
    const isMobile = window.innerWidth <= 768; // Check for mobile view

    return (
      <div
        onClick={onClick}
        className="homeNav"
        style={{
          position: "absolute",
          top: "50%",
          [direction]: isMobile ? "-15px" : "0px", // Adjust based on screen width
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
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };
  return (
    <>
      <div className="homesliderbx">
        <Slider {...settings}>
          {
            banner && banner.map((dData, index) => (
              <div className="home-slider-item" key={index} style={{ position: 'relative', }}>
                <img
                  src={`${FILE_API_URL}/banner/${dData.banner}`}
                  alt="#"
                  className="home-sliderimg"
                  title=""
                  id={`wows1_${index}`}
                />
                <div className="banner-text-sec">
                  <div className="banner-text">
                    <h1>{dData?.btitle ? validator.unescape(dData.btitle) : ''}</h1>
                    <p>{dData?.bshort ? validator.unescape(dData.bshort) : ''}</p>
                  </div>
                </div>
              </div>
            ))
          }
          <div className="ws_shadow" />
        </Slider>
      </div>



    </>
  );
};

export default Banner;
