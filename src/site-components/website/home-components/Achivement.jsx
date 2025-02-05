import React, { useState, useEffect, useRef } from "react";
import { NODE_API_URL } from "../../Helper/Constant";
import { dataFetchingPost } from "../../Helper/HelperFunction";
import validator from "validator";
import nluPrayagraj from "../assets/Images/nlu-prayagraj.jpg";
import Slider from "react-slick";
import { capitalizeFirstLetter } from "../../Helper/HelperFunction";
import DOMPurify from "dompurify";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Achivement = () => {
  const sliderRef = useRef(null);
  const [data, setData] = useState([]);

  const fetchAchivement = async () => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/achievement/fetch`,
        {
          delete_status: 0,
          status: 1,
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
    }
  };

  useEffect(() => {
    fetchAchivement();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
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
      <section className="achivement">
        <div className="container id-position-relative">
          <div className="row">
            <div className="col-md-12 mb-3 text-center">
              <h2 className="heading-primary2">Our Achievements</h2>
              <div className="heading-divider"></div>
            </div>
          </div>

          <button
            className="id-achive-prev-button prev-button"
            onClick={prevSlide}
            aria-label="Previous achievement"
          >
            &#10094;
          </button>

          <Slider ref={sliderRef} {...sliderSettings} className="">
            {data &&
              data.map((data, index) => (
                <div
                  className="row d-flex"
                  key={index}
                  style={{ padding: "0px" }}
                >
                  {/* Content Section */}
                  <div
                    className="col-lg-7 col-12 col-content"
                    style={{ paddingLeft: "100px", paddingRight: "20px" }}
                  >
                    <div className="asldcontsec">
                      <div className="asldcont">
                        <h4
                          className="heading-primary2 butler-regular mt-5"
                          style={{ color: "#8d1552" }}
                        >
                          {capitalizeFirstLetter(data.title)}
                        </h4>
                        <div
                          className="acivtxt"
                          style={{ color: "black", textAlign: "justify" }}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              validator.unescape(data.description)
                            ),
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {/* Image Section */}
                  <div className="col-xs-12 col-sm-12 col-lg-5 pr-0 pl-0 mr-0 mb-3 id-achivement-position-relative d-flex justify-content-center">
                    <div className="asldimgsec">
                      <div className="asldimg">
                        <img
                          src={`${data.image ? data.image : nluPrayagraj}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>

          <button
            className="id-achive-next-button next-button"
            onClick={nextSlide}
            aria-label="Next achievement"
          >
            &#10095;
          </button>
        </div>
      </section>
    </>
  );
};

export default Achivement;
