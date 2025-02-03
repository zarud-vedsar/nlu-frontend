import React from 'react';
import { Link } from 'react-router-dom';
import BgImg from '../assets/Images/cf.jpg';
import cs from '../assets/Images/cs.png';
import { FaArrowRight } from "react-icons/fa6";
const ContactFeatures = () => {
  return (
    <>
      <section className="section-contact-home" style={{
        backgroundImage: `url(${BgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-12 col-sm-12 cf-content p-4">
              <h2 className='butler-regular heading-primary3 text-white'>Contact & Support</h2>
              <Link className="ed-btn-yellow" target='_blank' to="/contact-us">
                <span className='gorditas-regular'>
                  Contact With us
                  <span className='icon'>
                    <FaArrowRight className='i' />
                  </span>
                </span>
              </Link>
            </div>
            <div className='col-lg-4 col-md-4 d-none d-sm-none d-md-block d-lg-block'>
              <img src={cs} className='img-fluid w-75' />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactFeatures