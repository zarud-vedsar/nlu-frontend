import React from "react";
import { Link } from "react-router-dom";
import {
  PHP_API_URL,
  NODE_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";
import { FaAngleRight } from 'react-icons/fa6'
import { dataFetchingGet } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Faculty = () => {
  const [facultyList, setFacultyList] = useState([
    {
      avtar: "avtar_user20250743159805701738762483.jpg",
      uid: "RPNLUP",
      first_name: "Sr. Prof. Dr. Usha ",
      last_name: "Tandon",
      designation: "Vice Chancellor",
      id:1
    },
  ]);

  const navigate = useNavigate();

  const loadFacultyData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_faculty_front");

      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFacultyList((prev) => [...prev, ...response.data.data]);
    } catch (error) {
      // Handle errors (empty for now)
    }
  };

  useEffect(() => {
    loadFacultyData();
  }, []);

  const moreDetail = (id) => {
    console.log(id)
    navigate(`/faculty/${id}`);
  };

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Faculty</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li><span>People</span> <FaAngleRight /></li> 
                    <li><span>Faculty</span> <FaAngleRight /> </li>
                  </ul>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container">
          <div className="row">
            {facultyList &&
              facultyList.map((faculty) => (
                <div className="col-lg-6 col-md-12 filter_professor  grid-item">
                  <div className="single-staff">
                    <div className="row">
                      <div
                        className="col-lg-8"
                        style={{ width: "300px", height: "300px" }}
                      >
                        <img
                          style={{ width: "300px", height: "300px" }}
                          src={
                            faculty.avtar
                              ? `${FILE_API_URL}/user/${faculty.uid}/${faculty.avtar}`
                              : `${FILE_API_URL}/user/dummy.webp`
                          }
                          alt=""
                        />
                      </div>
                      <div className="col-lg-4">
                        <div className="staf-info">
                          <h5 className="title">
                            {`${faculty?.first_name} ${faculty?.last_name}`}
                          </h5>

                          <a
                            aria-label="team mail"
                            href="https://themewant.com/products/wordpress/unipix/teams/michael-mcgarvey/"
                            className="email-contact"
                          >
                            <span>
                              <i className="rt-envelope" />
                            </span>
                            {faculty.u_email}
                          </a>
                          {faculty && faculty?.u_phone && (
                            <a
                              aria-label="team phone"
                              href="https://themewant.com/products/wordpress/unipix/teams/michael-mcgarvey/"
                              className="phone-contact"
                            >
                              <span>
                                <i className="rt-phone-flip" />
                              </span>
                              +91 {faculty.u_phone}
                            </a>
                          )}
                          <div className="staf-info__speciality">
                            <p>{`${
                              faculty.designation ? faculty.designation : " "
                            }`}</p>
                          </div>
                          <button
                            className="team-btn react_button"
                            onClick={() => moreDetail(faculty.id)}
                          >
                            {console.log(faculty.id)}
                            More Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Faculty;
