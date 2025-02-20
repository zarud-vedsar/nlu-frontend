
import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PHP_API_URL, FILE_API_URL } from "../../site-components/Helper/Constant";
import axios from "axios";
import { FaAngleRight } from "react-icons/fa6";

const About = () => {
  const [aboutData, setAboutData] = useState([]);
  const [decodedMessages, setDecodedMessages] = useState({});
  async function getAbout() {
    try {
      const bformData = new FormData();
      bformData.append("data", "aboutget");
      const response = await axios.post(
        `${PHP_API_URL}/about.php`,
        bformData
      );
      if (response.data && response.data.data && response.data.data.length > 0) {
        const response2 = await axios.post(
          `${PHP_API_URL}/page.php`,
          { data: 'decodeData', html: response.data.data[0].about_content },
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setDecodedMessages(response2.data);
        setAboutData(response.data.data[0]);

      }
    } catch (error) { /* empty */ }
  }
  useEffect(() => {
    getAbout();
  }, []);
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center heading-primary butler-regular text-white">About Us</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li>About Us</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-page-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 d-none d-sm-none d-md-block d-lg-block leftpart">
              <h3 className="heading-primary2 butler-regular">About Us</h3>
              <div className="heading-divider mb-3"></div>
              <ul className="mcd-menu">
                <li>
                  <Link to="/emblem-motto">
                    <i className="fa fa-flag" />
                    <strong>Emblem and Motto</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/vision-mission">
                    <i className="fa fa-bullseye" />
                    <strong>Vision & Mission</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-9 col-md-9 col-12 col-sm-12 col-xs-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3 className="heading-primary3 butler-regular">{aboutData.atitle}</h3>
                </div>
              </div>
              <div className="about-text-container">
                <div className="row">
                  <div className="col-sm-12">
                    <img
                      src={`${FILE_API_URL}/about/${aboutData.image_file}`}
                      className="rounded-3"
                      style={{
                        float: "right",
                        marginLeft: 10,
                        marginBottom: 10,
                      }}
                    />
                    <p className='heading-para gorditas-regular'>Uttar Pradesh National Law University, Prayagraj, established in 2020 by Uttar Pradesh National Law University Act, 2020 (U.P. Act no 26 of 2020) and renamed as Dr Rajendra Prasad National Law University by the amendment in August 2023 (U.P. Act no. 11 of 2023), is the newest law institution dedicated to legal excellence that meets an unparalleled environment for aspiring lawyers, judges, academia and other professionals.</p>
                    <p className='heading-para gorditas-regular'>Nested in the Prayagraj, a city which has been known for her academic legacy and where knowledge, aspiration and justice confluence like the three rivers, NLU, Prayagraj offers extraordinary opportunities for students to embark on a transformative journey into the world of law. It is dedicated to nurturing the legal minds of tomorrow through inter-disciplinary and innovative curriculum designed to provide comprehensive understanding of the law and its implications in contemporary society.</p>
                    <p className='heading-para gorditas-regular'>The University aims to have students from diverse backgrounds, each bringing unique perspectives and experiences in classrooms. This diversity fosters an environment of intellectual vitality, encouraging lively debates and discussions both inside and outside the classroom. It aspires to culminate in a conducive environment where Professors, students, and industry share a strong sense of camaraderie, creating lasting connections that extend beyond graduation. Its commitment to mentorship and professional development ensures that every student is well-prepared for the legal profession and is a useful member of the society.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>
          {
            `

            .contentestsec{
              height: 400px;
         overflow-y: auto;
  scrollbar-width: none; /* Firefox */
            }

            .contentestsec::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

          .rightpart, .leftpart {
  height: 500px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
}

.rightpart::-webkit-scrollbar, 
.leftpart::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
            `
          }
        </style>
      </div >
    </>
  );
};

export default About;
