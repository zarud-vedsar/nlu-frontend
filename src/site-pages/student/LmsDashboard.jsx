import React, { useEffect, useState } from "react";
import StudyMaterial from "./assets/img/study-material.png";
import Assignment from "./assets/img/assignment.png";
import Quiz from "./assets/img/quiz.png";
import "./assets/custom.css";
import { Link } from "react-router-dom";
function LmsDashboard() {
  return (
    <>
      <div className="page-container bg-white">
        <div className="main-content">
          <div className="container">
            <div className="mb-3 mt-0">
              <nav className="breadcrumb">
                <a href="/student" className="breadcrumb-item">
                  Home
                </a>
                <span className="breadcrumb-item active">
                  Learning Management System
                </span>
              </nav>
            </div>
            <div className="row">
              {/* <div className="col-md-12 col-lg-12">
                                <div className="card">
                                    <div className='card-header'>
                                        <h5 className="card-title py-2 px-0 h6_new">Course &amp; Semester</h5>
                                    </div>
                                    <div className="card-body">
                                        {courseSemester?.courseIdName?.[0]?.coursename
                                            ? courseSemester.courseIdName[0].coursename
                                            : "Course name not available"}
                                        <div className='card-text'>
                                            {courseSemester?.allotedCourseSemester?.[0]?.semtitle
                                                ? courseSemester.allotedCourseSemester[0].semtitle
                                                : "Semester title not available"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            Add more cards here for other course and semester details */}
              <div className="col-md-4 col-lg-4 col-12 card-custom-hover">
                <Link to={"/student/study-material"}>
                  <div className="card-custom-inside">
                    <img
                      src={StudyMaterial}
                      alt="Study Material"
                      className="img-fluid"
                    />
                  </div>
                  <h5 className="card-title">Study Material</h5>
                </Link>
              </div>
              <div className="col-md-4 col-lg-4 col-12 card-custom-hover">
                <Link to={"/student/assignment-subject"}>
                  <div className="card-custom-inside">
                    <img
                      src={Assignment}
                      alt="Study Material"
                      className="img-fluid"
                    />
                  </div>
                  <h5 className="card-title">Assignment</h5>
                </Link>
              </div>
              <div className="col-md-4 col-lg-4 col-12 card-custom-hover">
              <Link to={"/student/quiz-subject"}>
                <div className="card-custom-inside">
                  <img src={Quiz} alt="Study Material" className="img-fluid" />
                </div>
                <h5 className="card-title">Quiz</h5>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LmsDashboard;
