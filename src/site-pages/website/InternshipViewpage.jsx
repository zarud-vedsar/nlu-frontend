import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { Link } from "react-router-dom";
import '../../site-components/admin/assets/css/PlacementViewpage.css'
import { FaAngleRight, FaArrowRightLong } from "react-icons/fa6";

const InternshipViewpage = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [html, setHtml] = useState("");

  const decodeHtml = async (html) => {
    try {
      const response = await axios.post(
        `${PHP_API_URL}/page.php`,
        {
          data: "decodeData",
          html,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setHtml(response.data);
    } catch (error) {
      console.error("Error decoding HTML:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getInternshipDetail();
    }
  }, [id]); // Include id in dependency array

  const getInternshipDetail = async () => {
    try {
      const formData = new FormData();
      formData.append("data", "get_internship_by_id");
      formData.append("id", id);
      const response = await axios.post(
        `${PHP_API_URL}/internship.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200 || response?.data?.status === 201) {
        setDetail(response?.data?.data[0]);
        decodeHtml(response?.data?.data[0].description);
      }
    } catch (error) {
    }
  };

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">Internship Details</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link></li> <FaAngleRight />
                    <li>Student Corner</li> <FaAngleRight />
                    <li><Link to='/internship'>Internship</Link></li> <FaAngleRight />
                    <li>{detail?.intrnshp_title}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section bg-f5">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-7 col-lg-7 mx-auto">
              <div className="card border-0">
                <div className="card-body">
                  <h3 className="heading-primary2 butler-regular text-primary">{detail?.intrnshp_title}</h3>
                  <p className="heading-para gorditas-regular mb-2">
                    <strong>Deadline: </strong>
                    {detail?.deadline_date?.split(" ")[0]}
                  </p>
                  <p className="heading-para gorditas-regular mb-2">
                    <strong>Employer: </strong>
                    {detail?.employer}
                  </p>

                  <div>
                    <h3 className="heading-primary2 butler-regular">Description</h3>
                    {html ? (
                      <div className="heading-para gorditas-regular" dangerouslySetInnerHTML={{ __html: html }} />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                  <p className="heading-para gorditas-regular mb-2">
                    <a href={detail?.apply_link} className="btn btn-primary border-primary rounded-1 px-5 py-2">Apply Now &nbsp; <FaArrowRightLong /></a>{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InternshipViewpage;
