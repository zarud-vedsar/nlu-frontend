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

        console.log(noticeResponse)
        if (noticeResponse.data?.statusCode === 200) {
          console.log("notice",noticeResponse.data.data)
          setEvents(noticeResponse.data.data);
        }

        // Fetch events
        const eventResponse = await axios.post(
          `${NODE_API_URL}/api/notice/website-notice`,
          { notice_type: "event", limit: 3 }
        );
        if (eventResponse.data?.statusCode === 200) {
          console.log("event",eventResponse.data.data)
          setNotices(eventResponse.data.data);
        }

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
    arrows: false,
    autoplay: true, // Enable auto-scroll
    autoplaySpeed: 2800, // Change slides every 3 seconds
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <section className='public bg-f5'>
        <div className='container' data-aos="fade-up" data-aos-delay="50">
          <div className='row'>
             
                      <div className="col-md-12 text-center my-4" style={{position:"relative"}}>
                        <h2 className="heading-primary2">Upcoming Events</h2>
                        <div className="heading-divider"></div>
                    <Link to="/view-all/event" target='_blank' className='text-primary custom-link gorditas-regular ms-5 addtextoverlap'>View All <FaArrowRightLong /></Link>

                      </div>
                 
            {/* <div className='col-md-12 mb-3 d-flex align-items-center justify-content-between'>
              <h2 className="heading-primary2 m-0">Upcoming Events</h2>
              <Link to="/view-all/event"  className="text-primary custom-link gorditas-regular">More events &nbsp; <FaArrowRightLong /></Link>
            </div> */}
            <div className="col-md-8 col-lg-8 col-12 col-sm-12">
              <div className="row">

                <Slider {...settings}>
                  {notices.map((notice, index) => (
                    <div key={index} className="">
                      <div className="card border-0 soft-shadow  ">
                        <div className="new-img-container">
                          <Link to={`/notice-details/${notice.id}`}>
                            <img src={notice.image || placeholder} className="news-image" alt="News Image" />
                          </Link>

                        </div>
                        <div className="card-body">
                          <div className="newsttl">
                            {validator.unescape(notice.title)}
                          </div>
                          <p className="card-text gorditas-regular">
                            {new Date(notice.notice_date).toLocaleDateString('en-US', {
                              month: 'short', // "Jan"
                              day: '2-digit', // "22"
                              year: 'numeric' // "2021"
                            })}
                          </p>
                        </div>
                        <div className="cardftr">
                          <Link className="btn btn-primary border border-primary d-flex justify-content-center align-items-center w-fit about-read-more" to={`/notice-details/${notice.id}`}>Read More &nbsp; <FaArrowRightLong /></Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mt-sm-50">
              <div className="card border-0 rounded-0 border-bottom-2 soft-shadow mx-auto border-bottom border-primary">
                <div className="card-body pb-0 ">
                  <div className="rightconten">
                    <div className='d-flex justify-content-between align-items-center'>
                      <h2 className="heading-primary2a">Latest News</h2>
                      <Link to="/view-all/notice" className="text-primary custom-link gorditas-regular">View all News &nbsp; <FaArrowRightLong /></Link>
                    </div>
                    <div className="marquee-container fixedhights">
  <div className="eventdiv marquee-content">
    {events && events.length > 0 && events.map((event, index) => (
      <Link to={`/notice-details/${event.id}`} key={index} className="text-decoration-none event-hover-container">
        <div className={`row ${(events.length - 1) !== index && 'border-bottom'} eventrow`}>
          <div className="col-md-2 col-lg-2 col-2 col-sm-2 d-flex justify-content-center align-items-center flex-column">
            <h4 className="date-event butler-regular text-primary">
              {new Date(event.notice_date).toLocaleDateString('en-GB', {
                day: '2-digit'
              })}
            </h4>
            <h5 className="date-event-month gorditas-regular">
              {new Date(event.notice_date).toLocaleDateString('en-GB', {
                month: 'short'
              })}
            </h5>
          </div>
          <div className="col-md-10 col-lg-10 col-10 col-sm-10">
            <div className="rightnews">
              {`${validator.unescape(event.title)}`}
            </div>
            <p className="card-text gorditas-regular">
              {new Date(event.notice_date).toLocaleDateString('en-GB', {
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </Link>
    ))}
    {events && events.length > 0 && (
     <div className="box-footer">
     <Link to="/view-all/notice" className="btn-view-more">
       <FaAnglesDown className="scroll-icon" />
     </Link>
   </div>
    )}
  </div>
</div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='public bg-white'>
        <div className='container' data-aos="fade-up" data-aos-delay="50">
          <div className="row">
            <div className='col-md-12 mb-3 d-flex align-items-center justify-content-between'>
              <h2 className="heading-primary2 m-0">Publications</h2>
              <Link to="/view-all/notice" className="text-primary custom-link gorditas-regular">More Publications &nbsp; <FaArrowRightLong /></Link>
            </div>
          </div>
          <div className="w-100">
            <div className="pubsldrbx">
              <Slider {...settings2}>
                {publications.map((publication, index) => (
                  <div key={index} className="sldr">
                    <div className="card-custom">
                      <div className="new-img-container">
                        <Link to={`/notice-details/${publication.id}`}>
                          <img src={publication.image || placeholder} className="news-image" alt="News Image" />
                        </Link>
                      </div>

                      <div className="card-fttr p-3">
                        <div className="news-read-more-pub bg-primary mb-2">
                          <Link className="text-white" to={`/notice-details/${publication.id}`}>
                            {new Date(publication.notice_date).toLocaleDateString('en-GB', {
                              month: 'short'
                            })} {" "} {new Date(publication.notice_date).toLocaleDateString('en-GB', {
                              day: '2-digit'
                            })} {", "}
                            {new Date(publication.notice_date).toLocaleDateString('en-GB', {
                              year: 'numeric' // "2021"
                            })}
                          </Link>
                        </div>
                        <h3 className="butler-regular heading-primary3 pubtextbx two-line-text">
                          {validator.unescape(publication.title)}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <style>

            {
              `


.slick-track {
  display: flex !important;
  gap: 10px; 
}
  .slick-list {
 
  margin: 0 !important;
  overflow: hidden; 
}
   .marquee-container {
  height: 200px; 
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: marquee-scroll 20s linear infinite; 
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
  
              `
            }
          </style>
        </div>
      </section>
    </>
  );
};
export default NoticeEventPublication;