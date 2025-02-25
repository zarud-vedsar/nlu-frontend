import React from "react";
import { Link } from "react-router-dom";
import {
  PHP_API_URL,
  FILE_API_URL
} from "../../site-components/Helper/Constant";
import axios from "axios";
import { FaAngleRight } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiEnvelope, BiPhone } from "react-icons/bi";
import validator from 'validator';
import f1 from './fimage/f1.jpg';
import f2 from './fimage/f2.jpg';
import f3 from './fimage/f3.jpg';
import f4 from './fimage/f4.jpg';
import f5 from './fimage/f5.jpg';
import f6 from './fimage/f6.jpg';
import f7 from './fimage/f7.jpg';
const Faculty = () => {
  const [facultyList, setFacultyList] = useState([
    {
      avtar: f1,
      first_name: "Sr. Prof. Dr. Usha ",
      last_name: "Tandon",
      designation: "Vice-Chancellor",
      email1: 'usha@rpnlup.ac.in',
      email2: 'vc@rpnlup.ac.in',
      id: 1
    },
    {
      avtar: f2,
      first_name: "Dr. Deepak ",
      last_name: "Sharma",
      designation: "Assistant Professor of Law",
      email1: 'deepak@rpnlup.ac.in',
      email2: '',
      id: 3
    },
    {
      avtar: f3,
      first_name: "Dr. Sonika",
      last_name: "",
      designation: "Assistant Professor of Law",
      email1: 'sonika@rpnlup.ac.in',
      email2: '',
      id: 2
    },
    {
      avtar: f4,
      first_name: "Dr. Prakash ",
      last_name: "Tripathi",
      designation: "Assistant Professor of Sociology",
      email1: 'prakash@rpnulp.ac.in',
      email2: '',
      id: 4
    },
    {
      avtar: f5,
      first_name: "Dr. Neha ",
      last_name: "Dubey",
      designation: "Assistant Professor of English",
      email1: 'neha@rpnlup.ac.in',
      email2: '',
      id: 5
    },
    {
      avtar: f6,
      first_name: "Dr. Suchit ",
      last_name: "Kumar Yadav",
      designation: "Assistant Professor of Political Science",
      email1: 'suchit@rpnlup.ac.in',
      email2: '',
      id: 6
    },
    {
      avtar: f7,
      first_name: "Dr. Akanshi ",
      last_name: "Vidyarthi",
      designation: "Assistant Professor of History",
      email1: 'akanshi@rpnlup.ac.in',
      email2: '',
      id: 7
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
      // setFacultyList((prev) => [...prev, ...response.data.data]);
    } catch (error) {
      // Handle errors (empty for now)
    }
  };

  useEffect(() => {
    // loadFacultyData();
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
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li><span>People</span> <FaAngleRight /></li>
                    <li><span>Faculty</span></li>
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
                          style={{ width: "300px", height: "270px" }}
                          className="mx-auto rounded-3"
                          src={faculty.avtar}
                          alt=""
                        />
                      </div>
                      <div className="col-lg-7 text-center text-md-start col-md-7 col-sm-12 col-12">
                        <div className="staf-info">
                          <h5 className="heading-primary2 title source-font smt-12">
                            {`${faculty?.first_name} ${faculty?.last_name}`}
                          </h5>
                          <p className="source-font heading-primary3 mb-2">{faculty.designation ? validator.unescape(faculty.designation) : " "}</p>
                          {
                            faculty?.email1 && (
                              <p className="mb-1">
                                <a
                                  aria-label="team mail"
                                  href={`mailto:${faculty?.email1}`}
                                  className="emai-contact"
                                >
                                  <span>
                                    <BiEnvelope />
                                  </span> &nbsp;
                                  {faculty?.email1}
                                </a>
                              </p>
                            )
                          }
                          {
                            faculty?.email2 && (
                              <p className="mb-1">
                                <a
                                  aria-label="team mail"
                                  href={`mailto:${faculty?.email2}`}
                                  className="emai-contact"
                                >
                                  <span>
                                    <BiEnvelope />
                                  </span> &nbsp;
                                  {faculty?.email2}
                                </a>
                              </p>
                            )
                          }
                          <button
                            className="team-btn react_button mt-3"
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
