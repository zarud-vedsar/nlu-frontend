import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NODE_API_URL } from '../../site-components/Helper/Constant';
import { useParams } from 'react-router-dom';
import validator from "validator";
import { FaArrowRightLong, FaAnglesDown } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const AllNotice = () => {
  const [AllNotice, setAllNotice] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams()
  console.log(useParams)
  // Fetch data when component mounts
  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const noticeResponse = await axios.post(`${NODE_API_URL}/api/notice/website-notice`, { notice_type: id });
        if (noticeResponse.data.success) {
          setAllNotice(noticeResponse.data.data); // Save the fetched notices
        } else {
          console.error('Failed to fetch notices');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run only once when the component mounts

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">
                  {id === 'notice' ? 'All Notices' :
                    id === 'event' ? 'All Events' :
                      id === 'publication' ? 'All Publications' : ''}
                </h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>{id === 'notice' ? 'All Notices' :
                      id === 'event' ? 'All Events' :
                        id === 'publication' ? 'All Publications' : ''}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="about-page-area section-padding" style={{background:"#f5f5f5"}}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3> {id === 'notice' ? 'All Notices' :
                    id === 'event' ? 'All Events' :
                      id === 'publication' ? 'All Publications' : ''}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Display loading indicator while data is being fetched */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="row">
              {/* <div className="col-md-12">
                <div className="notic-container">
                  <div id="news-head">
                    Total Notices: <span className="nott">{AllNotice.length}</span>
                  </div>
                  </div>
                  </div> */}



                  {/* Dynamically map over AllNotice array */}
                  {/* {AllNotice.map((notice, index) => (
                    <div key={index} className="noricerow">

                      <div className='noticecontent'>
                        <span className='ccntn'>{`${index + 1}`}</span>
                        <Link to={`/notice-details/${notice.notice_type}`}>
                          {notice.title}
                        </Link>
                      </div>
                      <div className='noticeftr'>
                        <div className="dateon">
                          Updated on: {new Date(notice.notice_date).toLocaleDateString()}
                        </div>
                        <div>
                          <Link to={`/notice-details/${notice.id}`} className="btn btn-primary border border-primary d-flex justify-content-center align-items-center w-fit about-read-more" style={{ fontWeight: "bold" }}>
                            Read More&nbsp;<i className="fa fa-arrow-right" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  ))} */}
                     {id === "event" &&
                   AllNotice.map((notice, index) => (
                                        <div key={index} className="col-lg-3">
                                          <div className="card border-0 soft-shadow  ">
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

                </div>
             
            
         )}       
           </div>
      </div>
    </>
  );
};

export default AllNotice;
