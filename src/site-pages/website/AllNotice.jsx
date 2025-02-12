import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NODE_API_URL } from '../../site-components/Helper/Constant';
import { useParams } from 'react-router-dom';
const AllNotice = () => {
  const [AllNotice, setAllNotice] = useState([]);
  const [loading, setLoading] = useState(true);
  const {id}=useParams()
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


      <div className="about-page-area section-padding">
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
              <div className="col-md-12">
                <div className="about-text-container">
                  <div id="news-h">
                    Total Notices: <span style={{ color: "White" }}>{AllNotice.length}</span>
                  </div>

                  {/* Dynamically map over AllNotice array */}
                  {AllNotice.map((notice, index) => (
                    <div key={index} className="nupdate-on">
                      <div className="nupdatetext">
                        Updated on: {new Date(notice.notice_date).toLocaleDateString()}
                      </div>
                      <b>
                        <Link className="nheadingtext" to={`/notice-details/${notice.notice_type}`}>
                          {notice.title}
                        </Link>
                      </b>
                      <div style={{ float: "right", marginBottom: 12 }}>
                        <Link to={`/notice-details/${notice.notice_type}`} className="button success" style={{ fontWeight: "bold" }}>
                          Read More&nbsp;<i className="fa fa-arrow-right" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllNotice;
