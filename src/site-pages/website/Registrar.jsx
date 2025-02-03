import React from 'react';
import { Link } from 'react-router-dom';

const Registrar = () => {
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Registrar</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>Registrar</li>
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
                  <h3>From the Registrar Desk</h3>
                </div>
              </div>
              <div className="about-text-container">
                <p>
                  <img
                    src="#"
                    className="thumbnail msg_ReghtImg"
                  />
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorum ipsa aperiam necessitatibus saepe nobis reprehenderit,
                  velit accusamus pariatur voluptas, repellendus deleniti
                  architecto ea cumque harum doloremque unde beatae corrupti
                  optio ut voluptatem mollitia non error delectus. Porro fugit
                  facilis ipsum!
                </p>
                <p style={{ fontWeight: "bold", marginTop: 15 }}>
                  Sh Satya Prakash
                  <br />
                  <span
                    style={{
                      float: "left",
                      fontSize: "1.0rem",
                      fontStyle: "italic",
                    }}
                  >
                    (PCS)
                  </span>
                  <br />
                  <span style={{ float: "left", fontSize: "1.0rem" }}>
                    Lorem, ipsum dolor.
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

export default Registrar