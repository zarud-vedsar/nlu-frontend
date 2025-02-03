import React from 'react'
import { Link } from 'react-router-dom'

const AllPublication = () => {
  return (
    <>
     <div className="breadcrumb-banner-area">
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <div className="breadcrumb-text">
          <h1 className="text-center">All Publication</h1>
          <div className="breadcrumb-bar">
            <ul className="breadcrumb text-center">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>All Publication</li>
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
            <h3>All Publication</h3>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div className="about-text-container">
          <div id="news-h">
            Total Publication:&nbsp;
            <span
              id="ctl00_ctl00_CPH_MainContent_CPH_MainContent_Label_TotalNotices"
              style={{ color: "White" }}
            >
              22
            </span>
          </div>
          <div
            style={{
              float: "left",
              height: "auto",
              width: "100%",
              marginTop: 5
            }}
          >
            <div className="nupdate-on">
              <div className="nupdatetext">Updated on: 11 Sep, 2024</div>
              <b>
                <Link
                  className="nheadingtext"
                  to="/publication-details"
                >
                  NOTICE FOR DIPLOMA IN OPTOMETRY/PHYSIOTHERAPY STUDENTS
                  DOCUMENT VERIFICATION
                </Link>
              </b>
              <div style={{ float: "right", marginBottom: 12 }}>
                <Link
                  to="/publication-details"
                  className="button success"
                  style={{ fontWeight: "bold" }}
                >
                  Read More&nbsp;
                  <i className="fa fa-arrow-right" />
                </Link>
              </div>
            </div>
            <br /> 
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

export default AllPublication