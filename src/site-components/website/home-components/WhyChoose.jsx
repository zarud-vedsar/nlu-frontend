import React, { useEffect } from "react";
import AOS from "aos";
import BgImg from '../assets/Images/whychoosebg.png';
import AcademicPng from '../assets/Images/academic.jpg'
import Distinguished from '../assets/Images/distinguished.jpg'
import Holistic from '../assets/Images/holistic.png'
const WhyChoose = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <>
      <section className="section bg-f5" data-aos="fade-right" data-aos-delay="100">
        <div className="container">
          <div className="row">
            <div className='col-md-10 mx-auto mb-3 text-center'>
              <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Why Choose Us</h2>
              <div className='heading-divider'></div>
              <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
                Excellence in Legal Education with a Legacy of Academic Brilliance and Professional Success.
              </p>
            </div>
          </div>

          <div className="row text-center mt-3">
            {/* Column 1: Industry Leaders */}
            <div className="col-md-4">
              <div className="image-box-wrapper bg-white">
                <img
                  className="img-fluid"
                  style={{ height: '170px' }}
                  src={AcademicPng}
                  alt="Best Industry Leaders"
                />
                <h4 className="wc-title text-center mt-3 mb-1 source-font">Academic Excellence</h4>
                <p className="wc-text text-center mt-3 mb-1 source-font">Our interdisciplinary curriculum and innovative teaching methodologies ensure a deep understanding of legal principles and their practical applications.</p>
              </div>
            </div>
            {/* Column 2: Learn Courses Online */}
            <div className="col-md-4">
              <div className="image-box-wrapper bg-white">
                <img
                  className="img-fluid"
                  style={{ height: '170px' }}
                  src={Distinguished}
                  alt="Learn Courses Online"
                />
                <h4 className="wc-title text-center mt-3 mb-1 source-font">Distinguished Faculty</h4>
                <p className="wc-text text-center mt-3 mb-1 source-font">Learn from renowned legal scholars and industry experts who are committed to mentoring and guiding students.</p>
              </div>
            </div>
            {/* Column 3: Scholarship Facility */}
            <div className="col-md-4">
              <div className="image-box-wrapper bg-white">
                <img
                  className="img-fluid"
                  style={{ height: '170px' }}
                  src={Holistic}
                  alt="Scholarship Facility"
                />
                <h4 className="wc-title text-center mt-3 mb-1 source-font">Holistic Development</h4>
                <p className="wc-text text-center mt-3 mb-1 source-font">We provide numerous opportunities for moot courts, internships, debates, and workshops, fostering both professional and personal growth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>




    </>
  );
};

export default WhyChoose;
