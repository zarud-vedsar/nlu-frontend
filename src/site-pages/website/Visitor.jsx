import React from 'react';
import { Link } from 'react-router-dom';




const Visitor = () => {
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Chairperson</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <a href="Default-2.html">Home</a>
                    </li>
                    <li>Chairperson</li>
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
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3>Governance</h3>
                </div>
              </div>
              <ul className="mcd-menu">
                <li>
                  <Link to="/chairperson" className="active">
                    <i className="fa fa-university" />
                    <strong>Chairperson</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/visitor">
                    <i className="fa fa-university" />
                    <strong>Visitor</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/chancellor">
                    <i className="fa fa-university" />
                    <strong>Chancellor</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/vice-chancellor">
                    <i className="fa fa-university" />
                    <strong>Vice Chancellor</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/finance-controller">
                    <i className="fa fa-university" />
                    <strong>Finance Controller</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                {/* <li>
                  <Link to="/registrar">
                    <i className="fa fa-university" />
                    <strong>Registrar</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/general-council">
                    <i className="fa fa-university" />
                    <strong>General Council</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/executive-council">
                    <i className="fa fa-university" />
                    <strong>Executive Council</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/academic-council">
                    <i className="fa fa-university" />
                    <strong>Academic Council</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li> */}
                {/* <li>
                  <Link to="/finance-committee">
                    <i className="fa fa-university" />
                    <strong>Finance Committee</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li> */}
              </ul>
            </div>
            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3>From the Visitor Desk</h3>
                </div>
              </div>
              <div className="about-text-container">
                <p>
                  <img
                    src="https://www.rpnlup.ac.in/wp-content/uploads/2024/02/Manoj-Mishra.jpg"
                    className="thumbnail msg_ReghtImg"
                  />
                 Hon’ble <br/> Mr. Justice Manoj Misra is a judge of the Supreme Court of India.<br/>
                 His Lordship has also served as judge of the Allahabad High Court.<br/>
                 He graduated in law from the University of Allahabad in 1988 and enrolled as an Advocate on 12 December 1988. He was elevated as an Additional Judge of Allahabad High Court on 21 November 2011 and was made permanent on 6 August 2013.
                 <br/>His Lordship was elevated to the Supreme Court of India on February 6, 2023.
             

                </p>
                <p style={{ fontWeight: "bold", marginTop: 15 }}>
                 Mr. Justice Manoj Misra
                  <br />
                  <span
                    style={{
                      float: "left",
                      fontSize: "1.0rem",
                      fontStyle: "italic",
                    }}
                  >
                    Hon’ble Judge,
                  </span>
                  <br />
                  <span style={{ float: "left", fontSize: "1.0rem" }}>
                  Supreme Court of India
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Visitor