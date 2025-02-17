import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { capitalizeFirstLetter } from "../../site-components/Helper/HelperFunction";
import InternshipImg from './assets/img/internship.png';



const InternshipDetails = () => {
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
        console.error(error);
      }
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
                  <span className="breadcrumb-item">Internship Details</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                        Internship Details
                </h5>
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
       

          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-5 col-lg-5 col-12 col-sm-12 p-input-icon-left mb-3 ">
                   <img src={InternshipImg} alt="image" className="img-fluid" style={{height:"180px"}}/>
                
                </div>
                <div className="col-md-7 col-lg-7 col-12 col-sm-12 p-input-icon-left mb-3 ">
                    <div className='details'>
                    <h5 className="card-title mb-2"> <strong style={{width:"125px",display:"inline-block"}}>{capitalizeFirstLetter(detail?.intrnshp_title)}</strong> {''}</h5>
                    <p className="card-text mb-1"><strong style={{width:"110px",display:"inline-block"}}>Apply Link: </strong><a href={detail?.apply_link}>{detail?.apply_link}</a></p>
                    <p className="card-text mb-1"> <strong style={{width:"110px", display:"inline-block"}}>Deadline: </strong> {detail?.deadline_date?.split(" ")[0]}</p>
                    <p className="card-text mb-1"><strong style={{width:"110px", display:"inline-block"}}>Employer: </strong>  {capitalizeFirstLetter(detail?.employer)}</p>
                    {/* <p><strong style={{width:"110px", display:"inline-block"}}>Edition: </strong>  {'book.edition'}</p> */}
                    </div>
                
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12 col-lg-12 col-12 col-sm-12 p-input-icon-left mb-3 ">
                <p> {html ? (
            <div dangerouslySetInnerHTML={{__html: html}} />
          ) : (
            <p>Loading...</p>
          )}</p>
                </div>
             
              </div>
            </div>
          </div>
         
        </div>
        </div>
       
      </div>
    </>
  )
}

export default InternshipDetails