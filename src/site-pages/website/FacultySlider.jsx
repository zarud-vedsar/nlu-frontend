import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import axios from "axios";
import Slider from "react-slick";
import {
  PHP_API_URL,
  NODE_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";
import { Link } from "react-router-dom";
const FacultySlider = () => {
  const [facultyList, setFacultyList] = useState([]);
  const sliderRef = useRef(null);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const loadFacultyData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_faculty_front");

      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFacultyList(response.data.data); // Set initial faculty list
    } catch (error) {
      // Handle errors (empty for now)
    }
  };

  useEffect(() => {
    loadFacultyData(); // Load faculty data on component mount
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true, // Enable auto-scroll
    autoplaySpeed: 2800, // Change slides every 3 seconds
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
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


  return (
    <>
      {facultyList && facultyList.length > 0 && (
        <section className="section bg-" data-aos="fade-up" data-aos-delay="100">
          <div className="container">
            <div className="row">
              <div className="col-md-12 mb-3 text-center">
                <h2 className="heading-primary2 butler-regular">
                  Faculty & Staffs
                </h2>
                <div className="heading-divider"></div>
              </div>
            </div>

            <div className="faculty-slider-container ">
              <button
                className="prev-button"
                onClick={prevSlide}
                aria-label="Previous Faculty"
              >
                &#10094;
              </button>

              <Slider ref={sliderRef} {...sliderSettings}>
                {facultyList.length > 0 &&
                  facultyList.map((faculty, index) => (
                    <div key={index} className="faculty-slide">
                      <div className="facslider">
                        <Link to={`/faculty/${faculty.id}`} target="_blank">
                          <div className="facimg-bx">
                            <img
                              src={`${FILE_API_URL}/user/${faculty.uid}/${faculty.avtar}`}
                              alt={faculty.firstname}
                              className="facimg"
                              loading="lazy"
                              onError={(e) =>
                                (e.target.src = `${FILE_API_URL}/user/dummy.webp`)
                              }
                            />
                          </div>
                        </Link>
                        <div className="facpost">
                          <h3 className="sldnn mb-1 mt-2">{`${(
                            faculty.first_name
                          )} ${faculty.middle_name} ${faculty.last_name}`}</h3>
                          <p className="facdesti">{faculty?.designation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </Slider>

              <button
                className="next-button"
                onClick={nextSlide}
                aria-label="Next Faculty"
              >
                &#10095;
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FacultySlider;
