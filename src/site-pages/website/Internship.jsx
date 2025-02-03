import React, { useState, useEffect } from "react";
import axios from "axios";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { Link } from "react-router-dom";
import "../../../node_modules/primeicons/primeicons.css";
import "../../site-components/admin/assets/css/StudentCornerTable.css";
import "../../site-components/website/assets/css/card.css";
import { formatDate } from "../../site-components/Helper/HelperFunction";
import { capitalizeFirstLetter } from "../../site-components/Helper/HelperFunction";
import { FaAngleRight, FaArrowRightLong } from "react-icons/fa6";
const Internship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadScholarships();
  }, []);
  const loadScholarships = async (filter = {}) => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_internship");
      bformData.append("delete_status", 0);


      const response = await axios.post(
        `${PHP_API_URL}/internship.php`,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">Internship</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link></li> <FaAngleRight />
                    <li>Student Corner</li> <FaAngleRight />
                    <li>Internship</li>
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
              {scholarships.map((data) => (
                <>
                  <div className="col-md-4 col-lg-4 col-12 col-sm-6">
                    <div className="job-card">
                      <div className="job-header">
                        <span className="verified-badge">Internship</span>
                        <h2>{capitalizeFirstLetter(data?.intrnshp_title)}</h2>
                      </div>

                      <div className="job-footer">
                        <div className="job-meta">
                          <span className="icon">&#x1F4BC; Employer Name: </span>{" "}
                          {capitalizeFirstLetter(data?.employer)}
                        </div>

                      </div>

                      <div className="job-dates">
                        <p>
                          Posting Date:{" "}
                          <strong>{formatDate(data?.created_at)}</strong>
                        </p>
                        <p>
                          Last date to apply:{" "}
                          <strong>{formatDate(data?.deadline_date)}</strong>
                        </p>
                      </div>
                      <Link to={`/internship/${data.id}`} className="btn btn-primary border-primary rounded-1 px-5 py-2">View More &nbsp; <FaArrowRightLong /></Link>
                    </div>
                  </div>
                </>
              ))}
            </div>
          ) : (
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

export default Internship;
