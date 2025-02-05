import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { NODE_API_URL } from "../../Helper/Constant";
import validator from "validator";
import { FaArrowRightLong, FaAnglesDown } from "react-icons/fa6";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import placeholder from "../assets/Images/placeholder-image.jpg";
const NoticeEventPublication = () => {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setNotices(noticeResponse.data.data);
        }

        // Fetch events
        const eventResponse = await axios.post(
          `${NODE_API_URL}/api/notice/website-notice`,
          { notice_type: "event", limit: 3 }
        );
        if (eventResponse.data?.statusCode === 200) {
          console.log(eventResponse.data.data);
          setEvents(eventResponse.data.data);
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
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
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    arrows: false,
    slidesToScroll: 1,
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
      <section className='section bg-f5'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 mb-3 d-flex align-items-center justify-content-between'>
              <h2 className="heading-primary2 m-0">Latest News</h2>
              <Link to="/view-all/notice" className="text-primary custom-link gorditas-regular">View all news &nbsp; <FaArrowRightLong /></Link>
            </div>
            <div className="col-md-8 col-lg-8 col-12 col-sm-12">
              <div className="row">

                <Slider {...settings}>
                  {notices.map((notice, index) => (
                    <div key={index} className="col-md-4 col-lg-4 col-12 col-sm-12">
                      <div className="card border-0 soft-shadow mx-auto" style={{ width: '95%', minHeight: '289px' }}>
                        <div className="new-img-container">
                          <Link to={`/notice-details/${notice.id}`}>
                            {/* <img src={notice.image || placeholder} className="news-image" alt="News Image" /> */}
                            <img src='https://www.rpnlup.ac.in/wp-content/themes/rpnlup/assets/img/carousel/1500.png' className="news-image" alt="News Image" />
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
                <div className="card-body pb-0">
                  <div className="rightconten">
                    <div className='d-flex justify-content-between align-items-center'>
                      <h2 className="heading-primary2a">Upcoming Events</h2>
                      {/* <Link to="/view-all/event" className="text-primary custom-link gorditas-regular">More Events &nbsp; <FaArrowRightLong /></Link> */}
                    </div>
                    <div className="eventdiv">
                      {events && events.length > 0 && events.map((event, index) => (
                        <Link to={`/notice-details/${event.id}`} key={index} className="text-decoration-none event-hover-container">
                          <div className={`row ${(events.length - 1) != index && 'border-bottom'} eventrow`}>
                            <div className="col-md-2 col-lg-2 col-2 col-sm-2 d-flex justify-content-center align-items-center flex-column">
                              <h4 className="date-event butler-regular text-primary">
                                {new Date(event.notice_date).toLocaleDateString('en-GB', {
                                  day: '2-digit'
                                })}
                              </h4>
                              <h5 className="date-event-month gorditas-regular">{new Date(event.notice_date).toLocaleDateString('en-GB', {
                                month: 'short'
                              })}</h5>
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
                      {
                        events && events.length > 0 && (
                          <div className="box-footer">
                            <Link to="/view-all/event" className="btn-view-more">
                              <FaAnglesDown />
                            </Link>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='section bg-white'>
        <div className='container'>
          <div className="row">
            {/* <div className='col-md-12 mb-3 text-center'>
              <h2 className="heading-primary2">Publications</h2>
              <div className="heading-divider"></div>
            </div> */}
            <div className='col-md-12 mb-3 d-flex align-items-center justify-content-between'>
              <h2 className="heading-primary2 m-0">Publications</h2>
              <Link to="/introduction" className="text-primary custom-link gorditas-regular">More Publications &nbsp; <FaArrowRightLong /></Link>
            </div>
          </div>
          <div className="row mt-3">
            <Slider {...settings2}>
              {publications.map((publication, index) => (
                <div key={index} className="sldr">
                  <div className="card-custom">
                    <div className="new-img-container">
                      <Link to={`/notice-details/${publication.id}`}>
                        {/* <img src={publication.image || placeholder} className="news-image" alt="News Image" /> */}
                        <img src='/src/site-components/website/assets/Images/nlu-prayagraj.jpg' className="news-image" alt="News Image" />
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
      </section>
    </>
  );
};
export default NoticeEventPublication;