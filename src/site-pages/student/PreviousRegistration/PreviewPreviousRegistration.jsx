import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  getDocument,
  studentRecordById,
} from "../../../site-components/student/GetData";
import rpnlLogo from "../../../site-components/website/assets/Images/rpnl-logo.png";
import {
  FILE_API_URL,
  NODE_API_URL,
} from "../../../site-components/Helper/Constant";
import { formatDate } from "../../../site-components/Helper/HelperFunction";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";

import { useParams } from "react-router-dom";



function PreviewPreviousRegistration() {
  const { sid ,selectedcourse} = useParams();
  const [personalDetails, setPersonalDetails] = useState([]);
  const [document, setDocument] = useState([]);
  const [currentCourse, setCurrentCourse] = useState({});
  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = sid;
      formData.selectedcourse = selectedcourse;
      formData.login_type = "student";
      console.log("getStudentSelectedCourse")
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetchCurrentCourse`,
        formData
      );
      if (response.data?.statusCode === 200) {
        console.log(response)
        const {
          id,
          coursename,
          semtitle,
          groupName,
          subGroupName,
          subject1,
          subject2,
          subject3,
          subject4,
          subject5,
          subject6,
          preview,
          approved,
          level,
        } = response.data?.data || {};

        setCurrentCourse((prev) => ({
          ...prev,
          id,
          preview: preview,
          approved: approved,
          level: level,
          coursename: capitalizeFirstLetter(coursename),
          semtitle: capitalizeFirstLetter(semtitle),
          groupName: capitalizeFirstLetter(groupName),
          subGroupName: capitalizeFirstLetter(subGroupName),
          subject1: capitalizeFirstLetter(subject1),
          subject2: capitalizeFirstLetter(subject2),
          subject3: capitalizeFirstLetter(subject3),
          subject4: capitalizeFirstLetter(subject4),
          subject5: capitalizeFirstLetter(subject5),
          subject6: capitalizeFirstLetter(subject6),
        }));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getStudentSelectedCourse();
  }, []);

  const getStudentPreviewDetail = () => {
    if (sid) {
      studentRecordById(sid).then((res) => {
        if (res.length > 0) {
          setPersonalDetails(res[0]);
        }
      });
    } else {
      setPersonalDetails([]);
      setDocument([]);
    }
  };

  useEffect(() => {
    if (selectedcourse) {
      getDocument(selectedcourse).then((res) => {
        console.log(res);
        if (res.length > 0) {
          setDocument(res[0]);
        }
      });
    }
  }, [selectedcourse]);

  useEffect(() => {
    getStudentPreviewDetail();
  }, [sid]);

  

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </a>
                  <span className="breadcrumb-item">Previous Registration </span>
                  <span className="breadcrumb-item active">
                    Preview
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Preview</h5>
                <div className="ml-auto d-flex">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>

            

                  
                  <button className="btn btn-dark mr-2">
                    <i className="fa-solid fa-print mr-2"></i> Print
                  </button>
                </div>
              </div>
            </div>
            

            <div className="card mt-2" id="pdiv">
              <div className="card-body">
                <div className="row header-top">
                  <div className="col-md-6 col-lg-6 d-flex justify-content-start align-items-center">
                    <img
                      src={rpnlLogo}
                      alt="logo"
                      style={{ width: "35%" }}
                      className="img-fluid"
                    />
                    <div>
                      <h5 className="font-14" style={{ color: "#8F0F50" }}>
                        Dr. Rajendra Prasad National Law University
                      </h5>
                      <h6 className="font-12" style={{ color: "#9E3264" }}>
                        Gaddopur, Phaphamau, Prayagraj, Uttar Pradesh 211013
                      </h6>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 text-right">
                    <img
                      src={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${personalDetails.spic}`}
                      alt="photograph"
                      style={{ width: "100px", height: "90px" }}
                      className="img-fluid slogo"
                    />
                    <img
                      src={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${personalDetails.ssign}`}
                      alt="photograph"
                      style={{ width: "100px", height: "90px" }}
                      className="img-fluid ml-2 slogo"
                    />
                  </div>
                  <div className="col-md-12 text-center">
                    <h2 className="h2_new">Preview</h2>
                    <hr />
                  </div>
                  <div className="col-md-12">
                    <p className="mb-0">
                      <strong>Registration No:</strong>{" "}
                      {personalDetails.registrationNo}
                    </p>
                    <p>
                      <strong>Enrollment No:</strong>{" "}
                      {personalDetails.enrollmentNo}
                    </p>
                  </div>
                  {/* <div className="col-md-12">
                                        <div className="card">
                                            <div className="alert alert-danger text-danger" role="alert">
                                                <i className="fas fa-exclamation-circle font-18" /> Registration
                                                Rejected.
                                            </div>
                                            <div className="col-md-12">
                                                <p>
                                                    <strong>Note: </strong> Rejection note goes here.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="alert alert-warning text-warning" role="alert">
                                            <i className="fas fa-exclamation-circle font-18" /> Pending.
                                        </div>
                                        <div className="alert alert-success text-success" role="alert">
                                            <i className="fas fa-check-circle font-18" /> Registration Approved.
                                        </div>
                                    </div> */}
                  <div className="col-md-12">
                    <table className="table w-100">
                      <div className="row">
                        <div className="col-md-12">
                          <h6 className="custom font-12">
                            <span className="custo-head">Personal Details</span>
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Name:</strong> <br />{" "}
                          {personalDetails.sname}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Date Of Birth</strong>{" "}
                          <br />
                          {formatDate(personalDetails.sdob)}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">
                            Father&apos;s Name:
                          </strong>{" "}
                          <br /> {personalDetails.sfather}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">
                            Mother&apos;s Name:
                          </strong>{" "}
                          <br /> {personalDetails.smother}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Gender:</strong> <br />{" "}
                          {personalDetails.sgender}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Religion:</strong> <br />{" "}
                          {personalDetails.sreligion}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Category: </strong> <br />{" "}
                          {personalDetails.scategory}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Caste: </strong> <br />{" "}
                          {personalDetails.scaste}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Sub Caste: </strong>{" "}
                          <br /> {personalDetails.ssubcaste}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">ABC Id:</strong> <br />{" "}
                          {personalDetails.sabcid}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Aadhaar No:</strong>{" "}
                          <br /> {personalDetails.saadhaar}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <h6 className="custom font-12">
                            <span className="custo-head">Contact Details</span>
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Email:</strong> <br />{" "}
                          {personalDetails.semail}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Phone No:</strong> <br />{" "}
                          {personalDetails.sphone}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">
                            Alternate Phone No:
                          </strong>{" "}
                          <br /> {personalDetails.salterphone}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Whatsapp No:</strong>{" "}
                          <br /> {personalDetails.swhatsapp}
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col-md-12">
                          <h6 className="custom font-12">
                            <span className="custo-head">Address</span>
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 border">
                          <strong>Address:</strong> <br />{" "}
                          {personalDetails.saddress}
                        </div>
                        <div className="col-md-4 border">
                          <strong>Pin Code:</strong> <br />{" "}
                          {personalDetails.spincode}
                        </div>
                        <div className="col-md-4 border">
                          <strong>City:</strong> <br /> {personalDetails.scity}
                        </div>
                        <div className="col-md-4 border">
                          <strong>State:</strong> <br />{" "}
                          {personalDetails.sstate}
                        </div>
                      </div>
                      {/* Course Section */}
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <h6 className="custom font-12 mt-2">
                            <span className="custo-head">Course</span>
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Course</strong> <br />{" "}
                          {currentCourse.coursename}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Semester</strong> <br />{" "}
                          {currentCourse.semtitle}
                        </div>
                      </div>
                      {currentCourse?.groupName &&
                        currentCourse?.subGroupName && (
                          <>
                            <div className="row mt-3">
                              <div className="col-md-12">
                                <h6 className="custom font-12 mt-2">
                                  <span className="custo-head">Group</span>
                                </h6>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-3 border">
                                <strong className="font-12">Group Name</strong>{" "}
                                <br /> {currentCourse.groupName}
                              </div>
                              <div className="col-md-3 border">
                                <strong className="font-12">
                                  Sub Group Name
                                </strong>{" "}
                                <br /> {currentCourse.subGroupName}
                              </div>
                            </div>{" "}
                          </>
                        )}

                      {/* Subject Section */}
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <h6 className="custom font-12 mt-2">
                            <span className="custo-head">Subject</span>
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        {currentCourse.subject1 && (
                          <div className="col-md-4 border">
                            <strong className="font-12">Subject 1</strong>{" "}
                            <br /> {currentCourse.subject1}
                          </div>
                        )}
                        {currentCourse.subject2 && (
                          <div className="col-md-4 border">
                            <strong className="font-12">Subject 2</strong>{" "}
                            <br /> {currentCourse.subject2}
                          </div>
                        )}
                        {currentCourse.subject3 && (
                          <div className="col-md-4 border">
                            <strong className="font-12">Subject 3</strong>{" "}
                            <br /> {currentCourse.subject3}
                          </div>
                        )}
                        {currentCourse.subject4 && (
                          <div className="col-md-4 border">
                            <strong className="font-12">Subject 4</strong>{" "}
                            <br /> {currentCourse.subject4}
                          </div>
                        )}
                        {currentCourse.subject5 && (
                          <div className="col-md-4 border">
                            <strong className="font-12">Subject 5</strong>{" "}
                            <br /> {currentCourse.subject5}
                          </div>
                        )}
                        {currentCourse.subject6 && (
                          <div className="col-md-4 border">
                            <strong className="font-12">Subject 6</strong>{" "}
                            <br /> {currentCourse.subject6}
                          </div>
                        )}
                      </div>

                      {/* High School Details */}
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <h6 className="custom font-12 mt-2">
                            <span className="custo-head">
                              High School Details
                            </span>
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Roll No</strong> <br />{" "}
                          {document.hroll}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Total Marks</strong>{" "}
                          <br /> {document.htotal_marks}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Marks Obtained</strong>{" "}
                          <br /> {document.hmarks_obtained}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Percentage (%)</strong>{" "}
                          <br /> {document.hpercent}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Board</strong> <br />{" "}
                          {document.hboard}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">
                            School/College/Institution
                          </strong>{" "}
                          <br /> {document.hcollege}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Passing year</strong>{" "}
                          <br /> {document.hpassing_year}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">
                            Marksheet/Certificate
                          </strong>{" "}
                          <br />
                          <Link
                            target="_blank"
                            to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.hmarksheet}`}
                          >
                            <button
                              type="button"
                              className="btn btn-secondary text-white mt-4"
                            >
                              <i className="fas fa-eye text-white"></i>
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Intermediate Details */}
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <h6 className="custom font-12 mt-2">
                            <span className="custo-head">
                              Intermediate Details
                            </span>
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Roll No</strong> <br />{" "}
                          {document.iroll}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Total Marks</strong>{" "}
                          <br /> {document.itotal_marks}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Marks Obtained</strong>{" "}
                          <br /> {document.imarks_obtained}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Percentage (%)</strong>{" "}
                          <br /> {document.ipercent}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Board</strong> <br />{" "}
                          {document.iboard}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">
                            School/College/Institution
                          </strong>{" "}
                          <br /> {document.icollege}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 border">
                          <strong className="font-12">Passing year</strong>{" "}
                          <br /> {document.ipassing_year}
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">
                            Marksheet/Certificate
                          </strong>{" "}
                          <br />
                          <Link
                            target="_blank"
                            to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.imarksheet}`}
                          >
                            <button
                              type="button"
                              className="btn btn-secondary text-white mt-4"
                            >
                              <i className="fas fa-eye text-white"></i>
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Previous Semester/Year Details */}
                      {currentCourse?.semtitle && currentCourse?.semtitle.toLowerCase() !== "semester 1" && (
                        <>
                          {" "}
                          <div className="row mt-3">
                            <div className="col-md-12">
                              <h6 className="custom font-12 mt-2">
                                <span className="custo-head">
                                  Previous Passing Semester/Year Details
                                </span>
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3 border">
                              <strong className="font-12">Roll No</strong>{" "}
                              <br /> {document.plroll}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">Total Marks</strong>{" "}
                              <br /> {document.pltotal_marks}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">
                                Marks Obtained
                              </strong>{" "}
                              <br /> {document.plmarks_obtained}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3 border">
                              <strong className="font-12">
                                Percentage (%)
                              </strong>{" "}
                              <br /> {document.plpercent}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">Board</strong> <br />{" "}
                              {document.plboard}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">
                                School/College/Institution
                              </strong>{" "}
                              <br /> {document.plcollege}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3 border">
                              <strong className="font-12">Passing year</strong>{" "}
                              <br /> {document.plpassing_year}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">
                                Marksheet/Certificate
                              </strong>{" "}
                              <br />
                              <Link
                                target="_blank"
                                to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.plmarksheet}`}
                              >
                                <button
                                  type="button"
                                  className="btn btn-secondary text-white mt-4"
                                >
                                  <i className="fas fa-eye text-white"></i>
                                </button>
                              </Link>
                            </div>
                          </div>{" "}
                        </>
                      )}
                      {/* Graduation Details */}
                      {currentCourse?.level === "PG" && (
                        <>
                          <div className="row mt-3">
                            <div className="col-md-12">
                              <h6 className="custom font-12 mt-2">
                                <span className="custo-head">
                                  Graduation Details
                                </span>
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3 border">
                              <strong className="font-12">Roll No</strong>{" "}
                              <br /> {document.groll}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">Total Marks</strong>{" "}
                              <br /> {document.gtotal_marks}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">
                                Marks Obtained
                              </strong>{" "}
                              <br /> {document.gmarks_obtained}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3 border">
                              <strong className="font-12">
                                Percentage (%)
                              </strong>{" "}
                              <br /> {document.gpercent}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">Board</strong> <br />{" "}
                              {document.gboard}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">
                                School/College/Institution
                              </strong>{" "}
                              <br /> {document.gcollege}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3 border">
                              <strong className="font-12">Passing year</strong>{" "}
                              <br /> {document.gpassing_year}
                            </div>
                            <div className="col-md-3 border">
                              <strong className="font-12">
                                Marksheet/Certificate
                              </strong>{" "}
                              <br />
                              <Link
                                target="_blank"
                                to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.gmarksheet}`}
                              >
                                <button
                                  type="button"
                                  className="btn btn-secondary text-white mt-4"
                                >
                                  <i className="fas fa-eye text-white"></i>
                                </button>
                              </Link>
                            </div>
                          </div>{" "}
                        </>
                      )}
                      {/* Additional Documents */}
                      <div className="row mt-3">
                            <div className="col-md-12">
                              <h6 className="custom font-12 mt-2">
                                <span className="custo-head">
                                  Document
                                </span>
                              </h6>
                            </div>
                          </div>
                      <div className="row mt-3">
                        <div className="col-md-3 border">
                          <strong className="font-12">TC</strong> <br />
                          <Link
                            target="_blank"
                            to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.dtc}`}
                          >
                            <button
                              type="button"
                              className="btn btn-secondary text-white mt-4"
                            >
                              <i className="fas fa-eye text-white"></i>
                            </button>
                          </Link>
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">
                            Character Certificate
                          </strong>{" "}
                          <br />
                          <Link
                            target="_blank"
                            to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.character_certificate}`}
                          >
                            <button
                              type="button"
                              className="btn btn-secondary text-white mt-4"
                            >
                              <i className="fas fa-eye text-white"></i>
                            </button>
                          </Link>
                        </div>
                        <div className="col-md-3 border">
                          <strong className="font-12">Cast Certificate</strong>{" "}
                          <br />
                          <Link
                            target="_blank"
                            to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.caste_certificate}`}
                          >
                            <button
                              type="button"
                              className="btn btn-secondary text-white mt-4"
                            >
                              <i className="fas fa-eye text-white"></i>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
}

export default PreviewPreviousRegistration;
