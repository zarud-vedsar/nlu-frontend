import React, { useState, useEffect } from "react";
import AOS from "aos";
import { NODE_API_URL } from "../../Helper/Constant";
import axios from "axios";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import validator from 'validator';
import LlmCourseImg from '../assets/Images/course-llm.jpg'
const Courses = () => {
  const [course, setCourse] = useState([]);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${NODE_API_URL}/api/course/course-data`,
          { dbId: 1, limit: 10 }
        );
        if (response.data.success) {
          setCourse(response.data.data);
        }
      } catch (error) { /* empty */ }
    };
    fetchData();
  }, []);
  return (
    <section className="section" style={{ background: '#F5F5F5' }} data-aos="fade-up" data-aos-delay="100" >
      <div className='container'>
        <div className="row">
          <div className='col-md-12 mb-3 text-center'>
            <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Courses We Offer</h2>
            <div className='heading-divider'></div>
            <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
              Discover a wide range of courses designed for academic and professional excellence.
            </p>
          </div>
          <div className="row mt-2 pr-0">
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-4 mt-1 text-center">
              <Link to={`/courses/1`}>
                <div className="course-img-container">
                  <img src={"https://mymindgreatone.co.in/public/upload/f4c64fda-e1e2-4ad9-97bb-2421676d4aa7.jpg"} className="course-image" alt="Course Image" style={{ height: '230px' }} />
                </div>
                <div className="course-detail d-flex justify-content-between align-items-start flex-column pt-3">
                  <h3 className="course-detail-title source-font" style={{ fontSize: '1.2em' }}>
                    Bachelor of Arts and Bachelor of Laws with Honours (B.A. LL.B. (Hons.))
                  </h3>
                  <h4 className="course-learn-more mt-3">Read More <FaArrowRightLong /></h4>
                </div>
              </Link>
            </div>
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-4 mt-1 text-center">
              <Link to={`/courses/3`}>
                <div className="course-img-container">
                  <img src={LlmCourseImg} className="course-image" alt="Course Image" style={{ height: '230px' }} />
                </div>
                <div className="course-detail d-flex justify-content-between align-items-start flex-column pt-3">
                  <h3 className="course-detail-title source-font" style={{ fontSize: '1.2em' }}>
                    Master of Laws (LL. M.)
                  </h3>
                  <h4 className="course-learn-more mt-3">Read More <FaArrowRightLong /></h4>
                </div>
              </Link>
            </div>
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-4 mt-1 text-center">
              <Link to={`/courses/2`}>
                <div className="course-img-container">
                  <img src={"https://mymindgreatone.co.in/public/upload/a8886d4e-d6ec-4ed0-935f-0178027d39fb.jpg"} className="course-image" alt="Course Image" style={{ height: '230px' }} />
                </div>
                <div className="course-detail d-flex justify-content-between align-items-start flex-column pt-3">
                  <h3 className="course-detail-title source-font" style={{ fontSize: '1.2em' }}>
                    Doctor of Philosophy in Law (Ph.D.)
                  </h3>
                  <h4 className="course-learn-more mt-3">Read More <FaArrowRightLong /></h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Courses;