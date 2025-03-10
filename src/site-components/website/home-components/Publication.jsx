import React, { useState, useEffect } from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
import axios from "axios";
import { NODE_API_URL } from "../../Helper/Constant";
import validator from "validator";
import { FaArrowRightLong, FaAnglesDown } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import placeholder from "../assets/Images/noticeDefault.png";
const PublicationsNotice = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  // API call to fetch notices, events, and publications
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch notices
        const noticeResponse = await axios.post(
          `${NODE_API_URL}/api/notice/website-notice`,
          { notice_type: "notice", limit: 20 }
        );
        // Fetch publications
        const publicationResponse = await axios.post(
          `${NODE_API_URL}/api/notice/website-notice`,
          { notice_type: "publication", limit: 20 }
        );
        if (publicationResponse.data?.statusCode === 200) {
          setPublications(publicationResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
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
        {direction === "left" ? (
          <FaChevronLeft color="white" />
        ) : (
          <FaChevronRight color="white" />
        )}
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
    centerMode: false,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: false } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, // Enable auto-scroll
    centerMode: false,
    autoplaySpeed: 2800, // Change slides every 3 seconds
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: false } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: false } },
    ],
    // responsive: [
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     },
    //   },
    // ],
  };
  return (
    <>
      <section className="public bg-white">
        <div className="container" data-aos="fade-up" data-aos-delay="50">
          <div className="row">
            <div
              className="col-md-10 mx-auto text-center"
              style={{ position: "relative" }}
            >
              <div>
                <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Publications</h2>
                <div className='heading-divider'></div>
                <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
                  Explore the Latest Research Works, Articles, and Publications
                </p>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <Slider {...settings2}>
                {publications.map((publication, index) => (
                  <div key={index} className="sldr">
                    <div className="card-custom id-g-img-m-left">
                      <div className="new-img-container">
                        <Link to={`/notice-details/${publication.id}`}>
                          <img
                            src={publication.image || placeholder}
                            className="news-image"
                            alt="News Image"
                          />
                        </Link>
                      </div>

                      <div className="card-fttr p-3">
                        <div className="card-text gorditas-regular text-center id-event-date">
                          <p className="date-month mb-0">
                            {new Date(
                              publication.notice_date
                            ).toLocaleDateString("en-US", {
                              month: "short",
                            })}{" "}
                            {/* Month */}
                          </p>
                          <h5 className="date-day">
                            {new Date(
                              publication.notice_date
                            ).toLocaleDateString("en-US", {
                              day: "2-digit",
                            })}{" "}
                            {/* Day */}
                          </h5>
                          <p className="date-year mb-0">
                            {new Date(
                              publication.notice_date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                            })}{" "}
                            {/* Year */}
                          </p>
                        </div>
                        <h3 className="butler-regular heading-primary3 pubtextbx two-line-text mt-3">
                          {validator.unescape(publication.title)}
                        </h3>
                        <div className="mt-3">
                          <Link
                            className="btn btn-primary border border-primary d-flex justify-content-center align-items-center w-fit about-read-more"
                            to={`/notice-details/${publication.id}`}
                          >
                            Read More &nbsp; <FaArrowRightLong />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="col-md-12 text-center">
              <Link
                to="/view-all/publication"
                target="_blank"
                style={{ minWidth: '230px' }}
                className="btn btn-primary border-0 mt-4 px-4 py-2 source-font"
              >
                More Publications
              </Link>
            </div>
          </div>
          <style>
            {`


.slick-track {
  display: flex !important;
  gap: 10px; 
}
  .slick-list {
 
  margin: 0 !important;
  overflow: hidden; 
}
  .marquee-container {
  height: 320px; 
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: marquee-scroll 20s linear infinite; 
}

/* Stop the marquee animation on hover */
.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0% { transform: translateY(0%); }
  25% { transform: translateY(-25%); } 
  50% { transform: translateY(-50%); }
  75% { transform: translateY(-75%); }
  100% { transform: translateY(-100%); }
}


/* Optional: Bouncing icon */
.scroll-icon {
  font-size: 24px;
  animation: bounce 1.5s infinite alternate ease-in-out;
}

@keyframes bounce {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-10px); }
}
            .fixedhights {
  height: 243px;
  overflow-y: scroll; /* Keep scrolling enabled */
  scrollbar-width: none; /* Hide scrollbar in Firefox */
}

.fixedhights::-webkit-scrollbar {
  display: none; /* Hide scrollbar in Chrome, Safari, and Edge */
}
.slick-initialized div:nth-child(1) {
    left: 15px !important;
}


`}
          </style>
        </div>
      </section>
    </>
  );
};
export default PublicationsNotice;