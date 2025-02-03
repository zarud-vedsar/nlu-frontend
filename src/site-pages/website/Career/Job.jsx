import React, { useEffect, useState } from "react";
import axios from "axios";
import { PHP_API_URL } from "../../../site-components/Helper/Constant";
import { useParams, Link } from "react-router-dom";
import { FaAngleRight, FaRightLong } from "react-icons/fa6";

const Job = () => {
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

  const loadCategory = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_jobCategory");

      const response = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const tempCat = response.data.data.map((dep) => ({
        value: dep.id,
        label: dep.cat_title,
      }));
      setCategory(tempCat);
    } catch (error) {
      setCategory([]);
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = (id) => {
    const temp = category.find((cat) => cat.value === id);
    return temp?.label || "Unknown Category";
  };

  const getJobDetails = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "getJobById");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        const jobData = response?.data?.data[0];
        if (jobData) {
          setJobDetails(jobData);
          await decodeHtml(jobData.description);
          await loadCategory();
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
              <h2 className="heading-primary2 butler-regular text-primary">Job Information</h2>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Position:</strong> {jobDetails?.position}
              </p>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Job Category:</strong>{" "}
                {getCategory(jobDetails?.job_category)}
              </p>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Job Experience:</strong> {jobDetails?.job_experience}
              </p>
              <p className="heading-para mb-2 gorditas-regular">
                <strong>Job Type:</strong> {jobDetails?.job_type}
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
              <Link to={`/job/verify/${id}`} className="btn btn-primary border-primary rounded-1 px-5 py-2">
                Apply Now <FaRightLong />
              </Link>
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

export default Job;
