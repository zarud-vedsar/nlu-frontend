import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dataFetchingPost } from "../../site-components/Helper/HelperFunction";
import { NODE_API_URL, PHP_API_URL } from "../../site-components/Helper/Constant";
import axios from "axios";
import validator from 'validator';
import { FaAngleRight } from "react-icons/fa6";

const VisionMission = () => {
  const [vision, setVision] = useState({});
  const [mission, setMission] = useState({});
  const [decodedMessagesMission, setDecodedMessagesMission] = useState("");
  const [decodedMessagesVision, setDecodedMessagesVision] = useState("");

  const fetchVision = async () => {
    try {
      const response = await dataFetchingPost(`${NODE_API_URL}/api/vission/fetch`);

      if (response?.statusCode === 200 && response.data.length > 0) {
        const response2 = await axios.post(
          `${PHP_API_URL}/page.php`,
          { data: 'decodeData', html: response.data[0].content },
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setDecodedMessagesVision(validator.unescape(response2.data));
        setVision(response.data[0]);
      }
    } catch (error) { /* empty */ }
  };

  const fetchMission = async () => {
    try {
      const response = await dataFetchingPost(`${NODE_API_URL}/api/mission/fetch`);

      if (response?.statusCode === 200 && response.data.length > 0) {
        const response2 = await axios.post(
          `${PHP_API_URL}/page.php`,
          { data: 'decodeData', html: response.data[0].content },
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setDecodedMessagesMission(validator.unescape(response2.data));
        setMission(response.data[0]);
      }
    } catch (error) { /* empty */ }
  };

  useEffect(() => {
    fetchVision();
    fetchMission();
  }, []);

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">{vision.title} & {mission.title}</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link></li> <FaAngleRight />
                     <li>About</li><FaAngleRight />
                    <li>{vision.title} & {mission.title}</li>
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
            {/* <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 leftpart ">
              <h3 className="heading-primary2 butler-regular">About Us</h3>
              <div className="heading-divider mb-3"></div>
              <ul className="mcd-menu">
                <li><Link to="/about" className="active"><i className="fa fa-university" /><strong>Introduction</strong><small>National Law University Prayagraj</small></Link></li>
                <li><Link to="/emblem-motto"><i className="fa fa-flag" /><strong>Emblem and Motto</strong><small>National Law University Prayagraj</small></Link></li>
              </ul>
            </div> */}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 rightpart">
              <div className="about-text-container1">
                <div className="row mb-4">
                  <div className="col-md-12 col-lg-12 col-12 col-sm-12">
                    <div className="section-title-wrapper">
                      <div className="section-title">
                        <h3 className="heading-primary3 butler-regular source-font">{vision.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-lg-4 col-12 col-sm-12">
                    {vision.image && <img src={vision.image} alt={vision.title} className="img-fluid rounded-3" />}
                  </div>
                  <div className="col-md-8 col-lg-8 col-12 col-sm-12">
                    <div className="d-flex h-100 align-items-center">
                      <p className="heading-para gorditas-regular m-0 source-font" dangerouslySetInnerHTML={{ __html: decodedMessagesVision }} />
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12 col-lg-12 col-12 col-sm-12">
                    <div className="section-title-wrapper">
                      <div className="section-title">
                        <h3 className="heading-primary3 butler-regular source-font">{mission.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-lg-4 col-12 col-sm-12">
                    {mission.image && <img src={mission.image} alt={mission.title} className="img-fluid rounded-3" />}
                  </div>
                  <div className="col-md-8 col-lg-8 col-12 col-sm-12">
                    <div className="d-flex h-100 align-items-center">
                      <p className="heading-para gorditas-regular m-0 source-font" dangerouslySetInnerHTML={{ __html: decodedMessagesMission }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default VisionMission;