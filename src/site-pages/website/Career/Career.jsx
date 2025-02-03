import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../site-components/Helper/Constant";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../../../../node_modules/primeicons/primeicons.css";
import "../../../site-components/admin/assets/css/StudentCornerTable.css";
import { capitalizeFirstLetter, formatDate } from "../../../site-components/Helper/HelperFunction";
import '../../../site-components/website/assets/css/card.css'
import { FaAngleRight, FaArrowRightLong } from "react-icons/fa6";
const Career = () => {
  const [scholarships, setScholarships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async (filter = {}) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_job_post");
      bformData.append("delete_status", 0);

      const response = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setScholarships(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">Career</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link></li> <FaAngleRight />
                    <li>Career</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section bg-f5">
        <div className="container">
          {scholarships.length > 0 ? (
            <div className="row">
              <div className='col-md-12 mb-4 text-center'>
                <h2 className="heading-primary2">Recruitment at Dr. Rajendra Prasad NLU Prayagraj</h2>
                <div className="heading-divider"></div>
              </div>
              {scholarships.map(((data) => (
                <>
                  <div className="col-md-4 mt-2 col-lg-4 col-12 col-sm-6">
                    <div className="job-card">
                      <div className="job-header">
                        <span className="verified-badge">{capitalizeFirstLetter(data?.cat_title)}</span>
                        <h2>{capitalizeFirstLetter(data?.position)}</h2>
                        <p>{capitalizeFirstLetter(data?.state)}</p>
                      </div>
                      <div className="job-footer">
                        <div className="job-meta">
                          <span className="icon">&#x1F4BC; Min. Exp.: </span> {capitalizeFirstLetter(data?.job_experience)}
                        </div>
                        <div className="job-meta">
                          <span className="icon">&#x1F4B5; Job Schedule: </span> {capitalizeFirstLetter(data?.job_type)}
                        </div>
                      </div>
                      <div className="job-dates">
                        <p>Posting Date: <strong>{formatDate(data?.post_date)}</strong></p>
                        <p>Last date to apply: <strong>{formatDate(data?.post_last_date)}</strong></p>
                      </div>
                      <Link to={`/job/${data?.id}`} className="btn btn-primary border-primary rounded-1 px-5 py-2" >View More &nbsp; <FaArrowRightLong /></Link>
                    </div>
                  </div>
                </>
              )))}
            </div>) :
            (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                  color: "#888",
                  padding: "20px",
                }}
              >
                Currently No Data Available
              </div>
            )}
        </div>
      </section>

    </>
  );
};

export default Career;
