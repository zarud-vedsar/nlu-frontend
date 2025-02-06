import React, { useState, useEffect } from "react";
import AOS from "aos";
import { NODE_API_URL } from "../../Helper/Constant";
import axios from "axios";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import placeholder from "../assets/Images/placeholder-image.jpg";
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
        // console.log(response);
        if (response.data.success) {
          setCourse(response.data.data);
          console.log(response);
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
            <h2 className="heading-primary2 butler-regular">Our Courses</h2>
            <div className="heading-divider"></div>
          </div>
          <div className="row mt-2">
            {course.map((course, index) => (
              <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-4 text-center" key={index}>
                <Link to={`/courses/${course.id}`}>
                  <div className="course-img-container">
                    <img src={course.thumbnail || placeholder} className="course-image" alt="Course Image" />
                  </div>
                  <div className="course-detail-link text-center">
                    <h3 className="butler-regular course-detail-title heading-primary3">
                      {validator.unescape(course.coursename)}
                    </h3>
                    <h4 className="course-learn-more">Learn More <FaArrowRightLong /></h4>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Courses;