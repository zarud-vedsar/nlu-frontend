import React from "react";
import { Link } from "react-router-dom";
import {
  PHP_API_URL,
  NODE_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";
import { dataFetchingGet } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const fetchDesignationList = async () => {
    const deleteStatus = 0;

    try {
      const response = await dataFetchingGet(
        `${NODE_API_URL}/api/designation/retrieve-all-designation-with-department/${deleteStatus}`
      );

      if (response?.statusCode === 200 && response.data.length > 0) {
        const result = response.data;

        const designationMap = result.reduce((acc, designation) => {
          acc[designation.id] = designation.title;
          return acc;
        }, {});

        if (facultyList && facultyList.length > 0) {
          const tempData = facultyList.map((faculty) => {
            const designationTitle = designationMap[faculty.designationid];
            return {
              ...faculty,
              designationName: designationTitle || " ",
            };
          });
          setFacultyList(tempData);
        } else {
        }
      } else {
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
      } else {
       
      }
    } finally {
    }
  };

  const loadFacultyData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_userPage");

      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFacultyList(response.data.data);
      fetchDesignationList();

      setLoading(false);
    } catch (error) {
      setError("Error fetching faculty data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacultyData();
  }, []);

  const moreDetail = (id) => {
    
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
                      <Link to="/">Home</Link>
                    </li>
                    <li>Faculty</li>
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
                          src={faculty.avtar?`${FILE_API_URL}/user/${faculty.uid}/${faculty.avtar}`:`${FILE_API_URL}/user/dummy.webp`}
                          alt=""
                        />
                      </div>
                      <div className="col-lg-4">
                        <div className="staf-info">
                          <h5 className="title">
                            {`${capitalizeFirstLetter(faculty.first_name)} ${
                              faculty.middle_name
                            } ${faculty.last_name}`}
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
                          <div className="staf-info__speciality">
                            <p>{`${faculty.designationName?faculty.designationName:" "}`}</p>
                          </div>
                          <button
                            className="team-btn react_button"
                            onClick={() => moreDetail(faculty.id)}
                          >
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
