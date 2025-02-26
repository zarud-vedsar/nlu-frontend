import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import { NODE_API_URL } from "../../Helper/Constant";
import { dataFetchingPost } from "../../Helper/HelperFunction";
import validator from "validator";
import nluPrayagraj from "../assets/Images/nlu-prayagraj.jpg";
import Slider from "react-slick";
import { capitalizeFirstLetter } from "../../Helper/HelperFunction";
import DOMPurify from "dompurify";

const Achivement = () => {
  const sliderRef = useRef(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

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
    // dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 6000,
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
      <section className="section" data-aos="fade-up" data-aos-delay="100">
        <div className="container id-position-relative">
          <div className="row">
            <div className='col-md-12 mb-3 text-center'>
              <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Our Achievements</h2>
              <div className='heading-divider'></div>
              <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
                Celebrating our Journey of Excellence, Awards, and Recognitions
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button
                className="id-achive-prev-button prev-button"
                onClick={prevSlide}
                aria-label="Previous achievement"
              >
                &#10094;
              </button>
              <button
                className="id-achive-next-button next-button"
                onClick={nextSlide}
                aria-label="Next achievement"
              >
                &#10095;
              </button>
              <Slider ref={sliderRef} {...sliderSettings} className="">
                {data &&
                  data.map((data, index) => (
                    <div
                      className="row d-flex"
                      key={index}
                    >
                      <div className="col-xs-12 col-sm-12 col-lg-5 mb-3 id-achivement-position-relative d-flex justify-content-center">
                        <div className="asldimgsec ">
                          <div className="asldimg">
                            <img
                              src={`${data.image ? data.image : nluPrayagraj}`}
                              className="id-achiment-image-m-view"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-7 col-12"
                      >
                        <div className="asldcontsec align-items-start">
                          <div className="asldcont">
                            <h4
                              className="heading-primary2 source-font mt-3"
                              style={{ color: "#8d1552" }}
                            >
                              {capitalizeFirstLetter(data.title)}
                            </h4>
                            <div
                              className="heading-para source-font"
                              style={{ textAlign: "justify" }}
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  validator.unescape(data.description)
                                ),
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>
      <style jsx>
        {
          `
          .slick-initialized div:nth-child(1) {
              left: 0 !important;
          }
          .prev-button{
            left: 10px !important;
          }
           .nex-button{
            right: -15px !important;
          }
          `
        }
      </style>
    </>
  );
};

export default Achivement;
