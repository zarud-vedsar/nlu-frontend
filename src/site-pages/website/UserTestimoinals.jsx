

import React, { useEffect, useState } from "react";
import AOS from "aos";
import Slider from "react-slick";
import axios from "axios";
import { FILE_API_URL, PHP_API_URL } from "../../site-components/Helper/Constant";
import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function UserTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);
  useEffect(() => {
    const loadData = async () => {
      try {
        const bformData = new FormData();
        bformData.append("data", "load_testimonial_front");
        const response = await axios.post(
          `${PHP_API_URL}/std_testimonial.php`,
          bformData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.status === 200) {
          setTestimonials(response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    loadData();
  }, []);

  const CustomArrow = ({ onClick, direction }) => {
    const isMobile = window.innerWidth <= 768; // Check for mobile view

    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          top: "50%",
          [direction]: isMobile ? "-15px" : "-40px", // Adjust based on screen width
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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < rating ? <FaStar key={i} className="text-warning me-1" /> : <FaRegStar key={i} className="text-secondary me-1" />
    );

  return (
    <div className="usertesti" data-aos="fade-up" data-aos-delay="100">
      <div className="container pb-5 mb-4 ">

        <div className="row">
          <div className="col-md-12 mb-3 text-center">
          <h2 className="heading-primary2 source-font" style={{ fontSize: '55px' }}>What Our Students Are Saying</h2>
            <div className="heading-divider"></div>
          </div>
        </div>
        {testimonials.length > 0 ? (
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-3 my-4">
                <div className="testimonial-card">
                  <div className="testi-name-review-bx">
                 
                    <h5 className="fw-semibold mb-1 py-1">{testimonial.test_name}</h5>
                    <div className="ratee">{renderStars(parseInt(testimonial.test_rating))}</div>
                  </div>
                  <div className="d-flex">
                  <div className="testibx-left">
                      {testimonial.test_photo && (
                        <img
                          src={`${FILE_API_URL}/testimonial/${testimonial.test_photo}`}
                          alt={testimonial.test_name}
                          className="rounded-circle border border-2 border-secondary"
                          style={{
                            width: "100px",
                            height: "60px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />

                      )}

                    </div>
                  <p className="testimonial-text mb-0 py-1">
                    "{testimonial.test_content.split(" ").slice(0, 10).join(" ")}
                    {testimonial.test_content.split(" ").length > 10 ? "..." : ""}"
                  </p>

                  </div>
                 

                  {/* <div className="testibx">
                    <div className="testibx-left">
                      {testimonial.test_photo && (
                        <img
                          src={`${FILE_API_URL}/testimonial/${testimonial.test_photo}`}
                          alt={testimonial.test_name}
                          className="rounded-circle border border-2 border-secondary"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />

                      )}

                    </div>

                  <div className="testibx-right">
                      <p className="text-muted small mb-0">
                        {testimonial.test_occupation} at {testimonial.test_company}
                      </p>
                      <p className="text-muted small mb-0">{testimonial.email}</p>
                      <p className="text-muted small mb-0">{testimonial.phone}</p>
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center">No testimonials available.</p>
        )}

        {/* Internal CSS */}
        <style>
          {`
        .usertesti {
        background: #f3f3f3;
        padding: 60px 0 1px;
        }
          .testimonial-card {
            background: white;
            border-radius: 10px;
       box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);

            padding: 20px;
            text-align: center;
            position: relative;
            min-height: 164px;
          }

          .testimonial-text {
            font-style: italic;
            color: #555;
            min-height: 80px;
          }

          .testimonial-user {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
          }

          .testimonial-img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #ccc;
          }

          .slick-prev, .slick-next {
            display: none !important;
          }

          @media (max-width: 768px) {
            .slick-prev {
    left: 0 !important;
  }

  .slick-next {
    right: 0 !important;
  }
            .testimonial-card {
              padding: 15px;
            }
              .responsivebox{
              flex-direction:column;
              justify-content:center;
              }
             .d-flex1 {
    display: flex !important;
    justify-content: center;
}
          }
        `}
        </style>
      </div>
    </div>
  );
}

export default UserTestimonials;

