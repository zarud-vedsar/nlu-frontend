import React from 'react';
import { Link } from 'react-router-dom';
import LibraryImg from '../assets/Images/library.png';
import ContactImg from '../assets/Images/contact.png';
import GrievanceImg from '../assets/Images/grievance.png';
import AntiRagImg from '../assets/Images/anti-rag.png';



const ImportantLinks = () => {
  return (
    <>
      <div className="latest-area section-padding " style={{ backgroundColor: '#F2F2F2' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className='heading-primary2 butler-regular'>Important Links</h2>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-3 mt-3">
              <div className="card border-0 shadow-none cardimlink">
                <div className="card-body imp-card-body">
                  <div className="imlink">
                    <div className="imimg">
                      <img
                        src={LibraryImg}
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    Library
                    <a href="#">
                      <i className="fas fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="card border-0 shadow-none cardimlink">
                <div className="card-body imp-card-body">
                  <div className="imlink">
                    <div className="imimg">
                      <img
                        src={AntiRagImg}
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    Anti Ragging Policy
                    <a href="/anti-ragging-policy">
                      <i className="fas fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="card border-0 shadow-none cardimlink">
                <div className="card-body imp-card-body">
                  <div className="imlink">
                    <div className="imimg">
                      <img src={GrievanceImg} className="img-fluid" alt="" />
                    </div>
                    Submit Your Grievance
                    <Link to="/grievance">
                      <i className="fas fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="card border-0 shadow-none cardimlink">
                <div className="card-body imp-card-body">
                  <div className="imlink">
                    <div className="imimg">
                      <img
                        src={ContactImg}
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    Contact & Support
                    <Link to="/contact-us">
                      <i className="fas fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>





        </div>
      </div>
    </>
  )
}

export default ImportantLinks