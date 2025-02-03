import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import validator from "validator";

const NoticeDetails = () => {
  const [noticeDetails, setNoticeDetails] = useState(null);
  const [loading, setLoading] = useState(true);  // Start with loading true
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const noticeResponse = await axios.post(`${NODE_API_URL}/api/notice/website-notice`, { dbId: id });
        if (noticeResponse.data?.statusCode === 200) {
          setNoticeDetails(noticeResponse.data.data[0]); // Save the fetched notice details
        } else {
          console.error('Failed to fetch notices');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    fetchData(id);
  }, [id]);  // Run only once when the component mounts

  if (loading) {
    return (
      <div className="loading-container">
        <h3>Loading...</h3>  {/* A simple loading message */}
      </div>
    );
  }

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
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3>Notice Details</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <iframe
                src={noticeDetails?.pdf_file || ''}
                width="100%"
                height="600px"
                title="Notice PDF"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="about-text-container">
                {
                  noticeDetails?.description && (


                    <div className="events-wrapper">
                      {/* Render description directly */}
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "left" }}>
                              <table
                                id="ctl00_ctl00_CPH_MainContent_CPH_MainContent_DataList1"
                                cellSpacing={0}
                                style={{ width: "100%", borderCollapse: "collapse" }}
                              >
                                <tbody>
                                  <tr>
                                    <td>
                                      <div className="nfullmain-container">
                                        {/* Directly render the description */}
                                        {noticeDetails?.description ? validator.unescape(noticeDetails?.description) : ''}
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeDetails;
