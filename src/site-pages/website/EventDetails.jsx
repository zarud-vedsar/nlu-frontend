import React from 'react'
import { Link } from 'react-router-dom'

const EventDetails = () => {
  return (
    <>
    <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Event Details</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>Event Details</li>
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
                  <h3>Event Details</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
                  <iframe
                    src="https://spaceshineone.co.in/wp-content/uploads/2024/10/RPNLUP-Courses.pdf"
                    width="100%"
                    height="600px"
                  >
                  </iframe>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="about-text-container">
                <div className="events-wrapper">
                  <input
                    type="hidden"
                    name="ctl00$ctl00$CPH_MainContent$CPH_MainContent$HiddenField1"
                    id="ctl00_ctl00_CPH_MainContent_CPH_MainContent_HiddenField1"
                  />
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <table
                            id="ctl00_ctl00_CPH_MainContent_CPH_MainContent_DataList1"
                            cellSpacing={0}
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
                          >
                            <tbody>
                              <tr>
                                <td>
                                  <div className="nfullmain-container">
                                    <div className="nfullmain">
                                      Updated on: 04 Jul, 2024
                                    </div>
                                    <br />
                                    <div className="nfullhead-text">
                                      <b className="css_Bold">
                                        JEECUP (POLYTECHNIC) COUNSELLING STARTED
                                        FOR D.PHARMA 1ST TO 3RD ROUND.
                                      </b>
                                    </div>
                                    <br />
                                    <div className="nfullNot-Data">
                                      <p>
                                        JEECUP (POLYTECHNIC) COUNSELLING.
                                        STARTED FOR 1<sup>ST</sup> TO 3&nbsp;
                                        <sup>RD&nbsp;</sup>
                                        ROUND.
                                      </p>
                                      <p>
                                        Online (1st Phase) Main Counselling
                                        Schedule (1<sup>st</sup>&nbsp;to 3
                                        <sup>rd&nbsp;</sup>
                                        Round)
                                      </p>
                                      <p>
                                        FOR QUALIFIED CANDIDATES OF UP STATE
                                      </p>
                                    </div>
                                  
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="nfullother">
                            <b>Other Events</b>
                          </div>
                          <br />
                          <div className="nother-cont">
                            <div className="notherbg">
                              <span>&nbsp;11 Sep, 2024</span>
                              &nbsp;
                              <span className="newicon all-news-sub1">
                                <Link
                                  className="all-news-sub1"
                                  to="/event-details"
                                >
                                  NOTICE FOR DIPLOMA IN OPTOMETRY/PHYSIOTHERAPY
                                  STUDENTS DOCUMENT VERIFICATION
                                </Link>
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  className="media-back"
                  style={{ textAlign: "center", marginTop: 10 }}
                >
                  <Link to="/all-notice" className="button-default">
                    All Notices
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EventDetails