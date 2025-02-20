import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import axios from "axios";
import Slider from "react-slick";
import {
  PHP_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";
import { FaArrowRightLong } from "react-icons/fa6";
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
    infinite: true,
    speed: 500,
    slidesToShow: 3,
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
        <section
          className="section"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="container">
            <div className="col-md-12 d-flex justify-content-between align-items-center my-4 textManage" style={{ position: "relative" }}>
              <div>
                <h2 className="heading-primary2 source-font">Faculty & Staff</h2>
                <div className="heading-divider"></div>
              </div>
              <Link to="/faculty" className='text-primary custom-link gorditas-regular ms-5 addtextoverlap'>All Faculty Members<FaArrowRightLong /></Link>
            </div>
            <div className="row">
              <div className="col-md-3 col-lg-3">
                <div className="faculty-slide mt-3">
                  <div className="facslider">
                    <Link to={`/faculty/1`} target="_blank" >
                      <div className="facimg-bx">
                        <img
                          src="https://www.spaceshineone.co.in/public/upload/user/RPNLUP/avtar_user20250743159805701738762483.jpg"
                          alt=""
                          className="facimg"
                        />
                      </div>
                    </Link>
                    <div className="facpost">
                      <Link to={`/faculty/1`} target="_blank" >
                        <h3 className="sldnn source-font mb-1 mt-2">Sr. Prof. Dr. Usha Tandon</h3>
                        <p className="facdesti source-font">Vice Chancellor</p>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-md-9 col-lg-9">
                <div className="faculty-slider-container">
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
                              <h3 className="sldnn mb-1 mt-2 source-font">{`${(
                                faculty.first_name
                              )} ${faculty.middle_name} ${faculty.last_name}`}</h3>
                              <p className="facdesti source-font">{faculty?.designation}</p>
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
            </div>

          </div>
        </section>
      )}
    </>
  );
};

export default FacultySlider;
