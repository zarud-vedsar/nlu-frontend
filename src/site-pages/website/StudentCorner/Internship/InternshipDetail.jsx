import React, { useEffect, useState } from "react";
import axios from "axios";
import { PHP_API_URL } from "../../../../site-components/Helper/Constant";
import { useParams, Link } from "react-router-dom";
import { FaAngleRight, FaRightLong } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage"; // Importing secure storage for storing sensitive data.

const InternshipDetail = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [html, setHtml] = useState(null);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const decodeHtml = async (html) => {
    try {
      const response = await axios.post(
        `${PHP_API_URL}/page.php`,
        { data: "decodeData", html },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setHtml(response.data);
    } catch (error) {
      console.error("Error decoding HTML:", error);
    }
  };

  

  const getJobDetails = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "get_internship_by_id");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/internship.php`,
        bformData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        const jobData = response?.data?.data[0];
        if (jobData) {
          setJobDetails(jobData);
          await decodeHtml(jobData.description);
        }
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getJobDetails();
    }
  }, [id]);

  if (!jobDetails) {
    return (
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
    );
  }

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">{jobDetails?.position}</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link></li> <FaAngleRight />
                    <li>Career</li> <FaAngleRight />
                    <li>{jobDetails?.position}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-padding">
        <div className="container mt-5">

          <div className="row">
            <div className="col-12 col-md-3 mb-3 job-information">
              <h2 className="heading-primary2 butler-regular text-primary">Internship Information</h2>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Position:</strong> {jobDetails?.position}
              </p>
              
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Education Level:</strong> {jobDetails?.education_level}
              </p>
             
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Post Date:</strong> {jobDetails?.post_date}
              </p>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Last Date:</strong> {jobDetails?.post_last_date}
              </p>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Vacancy:</strong> {jobDetails?.vacancy}
              </p>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Gender:</strong> {jobDetails?.gender}
              </p>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Salary Range:</strong> ₹{jobDetails?.salary_starting} -
                ₹{jobDetails?.salary_to}
              </p>
              <p style={{ textAlign: "left" }}>
                <strong>Location:</strong> {jobDetails?.address},{" "}
                {jobDetails?.city}, {jobDetails?.state}
              </p>
              {!secureLocalStorage.getItem("sguardianemail") && new Date(jobDetails.post_last_date) > new Date() && (
              <Link to={`/internship/apply/${id}`} className="btn btn-primary border-primary rounded-1 px-5 py-2">
                Apply Now <FaRightLong />
              </Link>)
              }
            </div>
            <div className="col-12 col-md-9 mb-3">
              <h2 className="heading-primary2 butler-regular text-primary">Description</h2>
              <div className="col-12 mb-3">
                <div className="heading-para gorditas-regular" dangerouslySetInnerHTML={{ __html: html }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InternshipDetail;
