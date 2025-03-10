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
const NoticeEventPublication = () => {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
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

        if (noticeResponse.data?.statusCode === 200) {
          setEvents(noticeResponse.data.data);
        }

        // Fetch events
        const eventResponse = await axios.post(
          `${NODE_API_URL}/api/notice/website-notice`,
          { notice_type: "event", limit: 3 }
        );
        if (eventResponse.data?.statusCode === 200) {
          setNotices(eventResponse.data.data);
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
          left: "0px !impor",
          [direction]: isMobile ? "0px" : "0px", // Adjust based on screen width
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
    // dots: true,
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

  return (
    <>
      <section className="public bg-f5" data-aos="fade-up" data-aos-delay="50">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-lg-8 col-12 col-sm-12">
              <div className="row">
                <div
                  className="col-md-12 d-flex justify-content-between align-items-center my-4 textManage"
                  style={{ position: "relative" }}
                >
                  <div>
                    <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Upcoming Events</h2>
                    <div className='heading-divider'></div>
                    <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
                      List of Upcoming Events, Workshops and Gatherings
                    </p>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <Slider {...settings}>
                        {notices.map((notice, index) => (
                          <div key={index}>
                            <div className="card card-custom border-0 soft-shadow id-g-img-m-left ">
                              <div className="new-img-container">
                                <Link to={`/notice-details/${notice.id}`}>
                                  <img
                                    src={notice.image || placeholder}
                                    className="news-image"
                                    alt="News Image"
                                  />
                                </Link>
                              </div>
                              <div className="card-body">
                                <div className="card-text gorditas-regular text-center id-event-date">
                                  <p className="date-month mb-0">
                                    {new Date(
                                      notice.notice_date
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                    })}{" "}
                                    {/* Month */}
                                  </p>
                                  <h5 className="date-day">
                                    {new Date(
                                      notice.notice_date
                                    ).toLocaleDateString("en-US", {
                                      day: "2-digit",
                                    })}{" "}
                                    {/* Day */}
                                  </h5>
                                  <p className="date-year mb-0">
                                    {new Date(
                                      notice.notice_date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                    })}{" "}
                                    {/* Year */}
                                  </p>
                                </div>
                                <div className="newsttl">
                                  {validator.unescape(notice.title)}
                                </div>
                              </div>
                              <div className="cardftr">
                                <Link
                                  className="btn btn-primary border border-primary d-flex justify-content-center align-items-center w-fit about-read-more"
                                  to={`/notice-details/${notice.id}`}
                                >
                                  Read More &nbsp; <FaArrowRightLong />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Slider>
                      <div className="col-md-12 text-center mt-5">
                        <Link
                          to="/view-all/event"
                          target="_blank"
                          style={{ minWidth: '230px' }}
                          className="btn btn-primary border-0 px-4 py-2 source-font"
                        >
                          More Events
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mt-sm-50">
              <div className="row">
                <div
                  className="col-md-12 px-2 d-flex justify-content-between align-items-center my-4 textManage"
                  style={{ position: "relative" }}
                >
                  <div className="px-0">
                    <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Latest News</h2>
                    <div className='heading-divider'></div>
                    <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
                      Latest News & Announcements
                    </p>
                  </div>
                </div>

                <div className="col-md-12">
                  <div
                    className="card border-0 rounded-0 border-bottom-2 soft-shadow mx-auto border-bottom border-primary"
                    style={{ height: "387px" }}
                  >
                    <div className="card-body pb-0">
                      <div className="">
                        <div className="marquee-container">
                          <div className="eventdiv marquee-content">
                            {events &&
                              events.length > 0 &&
                              events.map((event, index) => (
                                <Link
                                  to={`/notice-details/${event.id}`}
                                  key={index}
                                  className="text-decoration-none event-hover-container"
                                >
                                  <div
                                    className={`row ${events.length - 1 !== index &&
                                      "border-bottom"
                                      } eventrow`}
                                  >
                                    <div className="col-md-2 col-lg-2 col-2 col-sm-2 d-flex justify-content-center align-items-center flex-column">
                                      <h4 className="date-event butler-regular text-primary">
                                        {new Date(
                                          event.notice_date
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                        })}
                                      </h4>
                                      <h5 className="date-event-month gorditas-regular">
                                        {new Date(
                                          event.notice_date
                                        ).toLocaleDateString("en-GB", {
                                          month: "short",
                                        })}
                                      </h5>
                                    </div>
                                    <div className="col-md-10 col-lg-10 col-10 col-sm-10">
                                      <div className="rightnews">
                                        {`${validator.unescape(event.title)}`}
                                      </div>
                                      <p className="card-text gorditas-regular">
                                        {new Date(
                                          event.notice_date
                                        ).toLocaleDateString("en-GB", {
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                        {events && events.length > 0 && (
                          <div className="box-footer">
                            <Link
                              to="/view-all/notice"
                              className="btn-view-more"
                            >
                              <FaAnglesDown className="scroll-icon" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 text-center mt-5">
                    <Link
                      to="/view-all/notice"
                      target="_blank"
                      style={{ minWidth: '230px' }}
                      className="btn btn-primary border-0 px-4 py-2 source-font"
                    >
                      More News
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
    </>
  );
};
export default NoticeEventPublication;
