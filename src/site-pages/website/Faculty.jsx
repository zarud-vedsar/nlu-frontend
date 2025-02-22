import React from "react";
import { Link } from "react-router-dom";
import {
  PHP_API_URL,
  FILE_API_URL
} from "../../site-components/Helper/Constant";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiEnvelope, BiPhone } from "react-icons/bi";
import validator from 'validator';
const Faculty = () => {
  const [facultyList, setFacultyList] = useState([
    {
      avtar: "avtar_user20250743159805701738762483.jpg",
      uid: "RPNLUP",
      first_name: "Sr. Prof. Dr. Usha ",
      last_name: "Tandon",
      designation: "Vice Chancellor",
      id: 1
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
              facultyList.map((faculty, index) => (
                <div key={index} className="col-lg-6 col-md-12 col-12 text-s-center filter_professor grid-item">
                  <div className="single-staff">
                    <div className="row w-100 mx-0">
                      <div
                        className="col-lg-5 text-center col-md-5 col-sm-12 col-12"
                        style={{ height: "300px" }}
                      >
                        <img
                          style={{ width: "300px", height: "300px" }}
                          className="mx-auto"
                          src={
                            faculty.avtar
                              ? `${FILE_API_URL}/user/${faculty.uid}/${faculty.avtar}`
                              : `${FILE_API_URL}/user/dummy.webp`
                          }
                          alt=""
                        />
                      </div>
                      <div className="col-lg-7 text-center text-md-start col-md-7 col-sm-12 col-12">
                        <div className="staf-info">
                          <h5 className="heading-primary2 title source-font smt-12">
                            {`${faculty?.first_name} ${faculty?.last_name}`}
                          </h5>
                          {faculty?.show_email_on_website && faculty?.u_email && (
                            <p className="mb-1">
                              <a
                                aria-label="team mail"
                                href={`mailto:${faculty?.u_email}`}
                                className="emai-contact"
                              >
                                <span>
                                  <BiEnvelope />
                                </span> &nbsp;
                                {faculty?.u_email}
                              </a>
                            </p>
                          )}
                          {faculty?.show_contact_on_website && faculty?.u_phone && (
                            <p className="mb-1">
                              <a
                                aria-label="team phone"
                                href={`tel:+91${faculty.u_phone}`}
                                className="phone-contact"
                              >
                                <span>
                                  <BiPhone />
                                </span>
                                +91 {faculty.u_phone}
                              </a>
                            </p>
                          )}
                          <div className="staf-info__speciality">
                            <p>{faculty.designation ? validator.unescape(faculty.designation) : " "}</p>
                            <p>{faculty?.qualification ? validator.unescape(faculty.qualification) : ""}</p>
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
