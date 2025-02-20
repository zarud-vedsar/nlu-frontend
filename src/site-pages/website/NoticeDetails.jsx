import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import validator from "validator";

const NoticeDetails = () => {
  const [noticeDetails, setNoticeDetails] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const { id } = useParams();
  const [html, setHtml] = useState("");
  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const noticeResponse = await axios.post(
          `${NODE_API_URL}/api/notice/website-notice`,
          { dbId: id }
        );
        if (noticeResponse.data?.statusCode === 200) {
          setNoticeDetails(noticeResponse.data.data[0]); // Save the fetched notice details
          if (noticeResponse?.data?.data[0]?.description) {
            setHtml(
              validator?.unescape(noticeResponse?.data?.data[0]?.description)
            );
          }
        } else {
          console.error("Failed to fetch notices");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData(id);
  }, [id]); // Run only once when the component mounts
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Notice Details</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <a href="default.html">Home</a>
                    </li>
                    <li>Notice Details</li>
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
              <h2 className="heading-primary2">{
                noticeDetails?.title || "Notice Title"
              }</h2>
              {
                noticeDetails?.notice_date && (
                  <>
                    <p>  {new Date(noticeDetails.notice_date).toLocaleDateString('en-GB', {
                      month: 'short'
                    })} {" "} {new Date(noticeDetails.notice_date).toLocaleDateString('en-GB', {
                      day: '2-digit'
                    })} {", "}
                      {new Date(noticeDetails.notice_date).toLocaleDateString('en-GB', {
                        year: 'numeric' // "2021"
                      })}</p>
                  </>
                )
              }

            </div>
            <div className="col-md-12">
              <div className="about-text-container">
                {noticeDetails?.description && (
                  <div className="events-wrapper" style={{ width: '100%', overflow: 'auto' }}>
                    {/* Render description directly */}
                    <div
                      className="nfullmain-container"
                      dangerouslySetInnerHTML={{ __html: html }}
                    >
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">


            {
              noticeDetails?.pdf_file && (
                <div className="col-md-12">
                  <iframe
                    src={noticeDetails?.pdf_file ? validator.unescape(validator.unescape(noticeDetails?.pdf_file)) : ''}
                    width="100%"
                    height="600px"
                    title="Notice PDF"
                  />
                </div>
              )
            }
          </div>

        </div>
      </div >
    </>
  );
};

export default NoticeDetails;
