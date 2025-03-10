import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PHP_API_URL } from "../../../../site-components/Helper/Constant";
import { capitalizeFirstLetter } from "../../../../site-components/Helper/HelperFunction";
import { formatDate } from "../../../../site-components/Helper/HelperFunction";
import { FaArrowRightLong } from "react-icons/fa6";
import "../../../../site-components/website/assets/css/card.css";
import secureLocalStorage from "react-secure-storage"; // Importing secure storage for storing sensitive data.

const InternshipAppliedHistory = () => {
  const [loading, setLoading] = useState(false);
  const [internships, setInternships] = useState([]);
  const [internshipStatus, setInternshipStatus] = useState([]);
  const sid = secureLocalStorage.getItem("studentId"); // Retrieving student ID from secure local storage.

  useEffect(() => {
    loadInternships();
    loadInternshipStatus();
  }, []);

  const loadInternships = async (filter = {}) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_st_filled_internship");
      bformData.append("studentid", sid);

      const response = await axios.post(
        `${PHP_API_URL}/internship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setInternships(response.data.data);
    } catch (error) {
      console.error("Error fetching internship data:", error);
    }
  };
  const loadInternshipStatus = async (filter = {}) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_st_internship");
      bformData.append("studentid", sid);

      const response = await axios.post(
        `${PHP_API_URL}/internship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setInternshipStatus(response.data.data);
    } catch (error) {
      setInternshipStatus([])
    }
  };

  const checkStatus = (internshipId) => {
    const internship = internshipStatus.find(
      (internship) => internship.id === internshipId
    );
    if (internship) {
      return internship.status;
    }
    return 3; // Return 3 if no internship found
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="" className="breadcrumb-item">
                    Internship
                  </a>
                  <span className="breadcrumb-item">
                    Internship Applied History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Internship List</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light "
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                </div>
              </div>
            </div>

            {internships.length > 0 ? (
              <div className="row">
                {internships.map((data, index) => (
                  <>
                    <div
                      className="col-md-4 mt-2 col-lg-4 col-12 col-sm-6"
                      key={index}
                    >
                      <div className="job-card">
                        <div className="job-header">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <span className="verified-badge">Internship</span>
                              <h2>{capitalizeFirstLetter(data?.position)}</h2>
                              <p>{capitalizeFirstLetter(data?.state)}</p>
                            </div>
                            
                                <div className="col">
                                  {(() => {
                                    const status = checkStatus(data?.id);
                                    if (status === 1) {
                                      return (
                                        <span className="badge badge-success">
                                          Shortlisted
                                        </span>
                                      );
                                    }
                                    if (status === 2) {
                                      return (
                                        <span className="badge badge-danger">
                                          Not Shortlisted
                                        </span>
                                      );
                                    }
                                    if (status === 0) {
                                      return (
                                        <span className="badge badge-warning">
                                          Applied
                                        </span>
                                      );
                                    }
                                    
                                  })()}
                                </div>
                              
                          </div>
                        </div>
                        <div className="job-footer">
                          <div className="job-meta">
                            <span className="icon">
                              &#x1F4BC; Education Level :{" "}
                            </span>{" "}
                            {capitalizeFirstLetter(data?.education_level)}
                          </div>
                        </div>
                        <div className="job-dates">
                          <p>
                            Posting Date:{" "}
                            <strong>{formatDate(data?.post_date)}</strong>
                          </p>
                          <p>
                            Last date to apply:{" "}
                            <strong>{formatDate(data?.post_last_date)}</strong>
                          </p>
                        </div>
                        <Link
                          to={`/internship/${data?.id}`}
                          className="btn btn-primary border-primary rounded-1 px-5 py-2"
                        >
                          View More &nbsp; <FaArrowRightLong />
                        </Link>
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
        </div>
      </div>
    </>
  );
};

export default InternshipAppliedHistory;
