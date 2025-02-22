import React, { useState, useEffect } from "react";
import AOS from "aos";
import { NODE_API_URL } from "../../Helper/Constant";
import axios from "axios";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import validator from 'validator';
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
    <section className="section" style={{ background: '#C6D6DC' }} data-aos="fade-up" data-aos-delay="100" >
      <div className='container'>
        <div className="row">
          <div className='col-md-12 mb-3 text-center'>
            <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Our Courses</h2>
            <div className="heading-divider"></div>
          </div>
          <div className="row mt-2">
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-4 text-center">
              <Link to={`/courses/1`}>
                <div className="course-img-container">
                  <img src={"https://mymindgreatone.co.in/public/upload/f4c64fda-e1e2-4ad9-97bb-2421676d4aa7.jpg"} className="course-image" alt="Course Image" />
                </div>
                <div className="course-detail-link text-center">
                  <h3 className="butler-regular course-detail-title heading-primary3">
                    B.A. LL.B. (Hons.)
                  </h3>
                  <h4 className="course-learn-more">Learn More <FaArrowRightLong /></h4>
                </div>
              </Link>
            </div>
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-4 text-center">
              <Link to={`/courses/3`}>
                <div className="course-img-container">
                  <img src={"https://mymindgreatone.co.in/public/upload/d7964460-36dd-4091-ba7e-c26f7fc2f387.jpg"} className="course-image" alt="Course Image" />
                </div>
                <div className="course-detail-link text-center">
                  <h3 className="butler-regular course-detail-title heading-primary3">
                    LL.M.
                  </h3>
                  <h4 className="course-learn-more">Learn More <FaArrowRightLong /></h4>
                </div>
              </Link>
            </div>
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-4 text-center">
              <Link to={`/courses/2`}>
                <div className="course-img-container">
                  <img src={"https://mymindgreatone.co.in/public/upload/a8886d4e-d6ec-4ed0-935f-0178027d39fb.jpg"} className="course-image" alt="Course Image" />
                </div>
                <div className="course-detail-link text-center">
                  <h3 className="butler-regular course-detail-title heading-primary3">
                    Ph.D.
                  </h3>
                  <h4 className="course-learn-more">Learn More <FaArrowRightLong /></h4>
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