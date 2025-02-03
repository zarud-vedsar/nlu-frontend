import React, { useState, useEffect } from "react";
import TestimonialBg from "../assets/Images/testimonial.jpg";
import axios from "axios";
import { PHP_API_URL, FILE_API_URL } from "../../Helper/Constant";
import { FaStar } from "react-icons/fa";
import ProfileImg from '../assets/Images/profile-img.avif';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Importing Up and Down arrows

const Testimonial = () => {
  const [ttmlData, setTtmlData] = useState([]);

  // Fetch testimonials
  async function getTestimonial() {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_testimonial");

      const response = await axios.post(
        `${PHP_API_URL}/std_testimonial.php`,
        bformData
      );
      setTtmlData(response.data.data);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  useEffect(() => {
    getTestimonial();
  }, []);

  // Slider settings with vertical layout for desktop
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default for mobile/tablet
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    vertical: true, // Enable vertical slide
    verticalSwiping: true, // Allow swiping vertically
    prevArrow: (
      <button className="slick-prev prev-cs-slider">
        <FaArrowUp style={{ fontSize: "30px", color: "#000" }} />
      </button>
    ), // Custom Up arrow
    nextArrow: (
      <button className="slick-next next-cs-slider">
        <FaArrowDown style={{ fontSize: "30px", color: "#000" }} />
      </button>
    ), // Custom Down arrow
    responsive: [
      {
        breakpoint: 1024, // For tablets and smaller devices
        settings: {
          slidesToShow: 3, // Single slide for tablets
          slidesToScroll: 3,
          vertical: false, // Disable vertical slide for tablets and below
          verticalSwiping: false,
        },
      },
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 1, // Single slide for mobile
          slidesToScroll: 1,
          vertical: false, // Disable vertical slide for mobile
          verticalSwiping: false,
        },
      },
      {
        breakpoint: 1440, // For desktops
        settings: {
          slidesToShow: 2, // Show two slides vertically on larger screens
          slidesToScroll: 2,
          vertical: true, // Enable vertical slide for desktop
          verticalSwiping: true, // Allow swiping vertically on desktop
        },
      },
    ],
  };

  return (
    <div className="about section-padding-30" style={{ backgroundColor: "#F2F2F2" }}>
      <div className="container id-ttml-container">
        <div className="row align-items-center">
          {/* Image Section */}
          <div className="col-12 col-md-7 col-lg-7">
            <div className="id-ttml-img-wrapper position-relative">
              <div className="satisfied-student">
                <h2>Words from Our Grateful Students</h2>
                <div className="id-ttml-radius"></div>
              </div>
              <img
                src={TestimonialBg}
                alt="Testimonial Background"
                className="img-fluid"
                style={{ borderRadius: "15px" }}
              />
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="col-12 col-md-5 col-lg-5 prev-cs-slider">
            {ttmlData && ttmlData.length > 0 ? (
              <Slider {...settings}>
                {ttmlData.map((testimonial, index) => (
                  <div key={testimonial.id} className="id-ttml-card">
                    <div
                      className={`id-ttml-card ${index === 0 ? "red-card" : "green-card"} ${index !== 0 ? "hover-red" : ""
                        }`}
                    >
                      <div className="id-ttml-card-body">
                        {/* Generate stars based on test_rating */}
                        <p className="id-ttml-rating">
                          {[...Array(Math.min(Math.floor(testimonial.test_rating), 5))].map((_, starIndex) => (
                            <FaStar key={starIndex} />
                          ))}
                        </p>
                        <p className="tcontent">{testimonial.test_content}</p>

                        <div className="id-ttml-prsnl-details">
                          <div className="id-ttml-profile-img-wrapper">
                            <img
                              src={
                                testimonial.test_photo
                                  ? `${FILE_API_URL}/testimonial/${testimonial.test_photo}`
                                  : ProfileImg
                              }
                              alt="Profile Image"
                              className="profile-img"
                            />
                            <div>
                              <h2 className="tname" style={{ marginTop: "10px" }}>
                                {testimonial.test_name}
                              </h2>
                              <p className="id-ttml-occupation mb-0">{testimonial.test_occupation}</p>
                              <div className="id-ttml-contact-img-wrapper">
                                <p className="id-ttml-company mb-0">{testimonial.test_company}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p>No testimonials available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
