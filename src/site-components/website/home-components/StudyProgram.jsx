import React from "react";
import Grduateimg from '../assets/Images/study-program/ug.png';
import Bookimg from '../assets/Images/study-program/book.png';
import Certificate from '../assets/Images/study-program/Certificate.png';
import MasterGrduate from '../assets/Images/study-program/graduated.png';
import BecomeLecturer from '../assets/Images/study-program/briefcase.png';

const StudyProgram = () => {
  return (
    <>
      <div className="latest-area section-padding-20 bg-white">
        <div className="container sp-relative">
          <div className="sp-hr-line"></div>
          <div className="row">
            <div className="col-md-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3>Course and Study Program</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 hr-line"></div>
          </div>
          <div className="row ">
            {/* Public Courses */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
              <div className="useful-links-outer">
                <div className="sp-wrapper d-flex justify-content-center text-center">
                  <span className="sp-img-wrapper">
                    <img
                      src={Bookimg}
                      alt="Public Course"
                      className="img-fluid"
                    />
                  </span>
                  <h4 className="sp-title">Public Courses</h4>
                  <p className="sp-text">
                    Public courses offer accessible education to all, often focusing on legal principles, policy, and rights.
                  </p>
                </div>
              </div>
            </div>

            {/* Undergraduate Courses */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
              <div className="useful-links-outer">
                <div className="sp-wrapper d-flex justify-content-center text-center">
                  <span className="sp-img-wrapper">
                    <img
                      src={Grduateimg}
                      alt="Undergraduate Courses"
                      className="img-fluid"
                      style={{ height: "111px" }}
                    />
                  </span>
                  <h4 className="sp-title">Undergraduate Courses</h4>
                  <p className="sp-text">
                    Undergraduate law courses, such as BA LLB, offer foundational legal education, preparing students for legal careers.
                  </p>
                </div>
              </div>
            </div>

            {/* Master's Courses */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
              <div className="useful-links-outer">
                <div className="sp-wrapper d-flex justify-content-center text-center">
                  <span className="sp-img-wrapper">
                    <img
                      src={Certificate}
                      alt="Master's Courses"
                      className="img-fluid"
                    />
                  </span>
                  <h4 className="sp-title">Master's Courses</h4>
                  <p className="sp-text">
                    Master's law courses, like LLM, offer specialization in areas such as constitutional, criminal, or international law.
                  </p>
                </div>
              </div>
            </div>

            {/* Postgraduate Research */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
              <div className="useful-links-outer">
                <div className="sp-wrapper d-flex justify-content-center text-center">
                  <span className="sp-img-wrapper">
                    <img
                      src={MasterGrduate}
                      alt="Postgraduate Research"
                      className="img-fluid"
                    />
                  </span>
                  <h4 className="sp-title">Postgraduate Research</h4>
                  <p className="sp-text">
                    Postgraduate research in law focuses on in-depth study, analysis, and original contributions to legal scholarship.
                  </p>
                </div>
              </div>
            </div>

            {/* Become Lecturer */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
              <div className="useful-links-outer">
                <div className="sp-wrapper d-flex justify-content-center text-center">
                  <span className="sp-img-wrapper">
                    <img
                      src={BecomeLecturer}
                      alt="Become Lecturer"
                      className="img-fluid"
                    />
                  </span>
                  <h4 className="sp-title">Become Lecturer</h4>
                  <p className="sp-text">
                    To become a law lecturer, complete a master's, pursue research, and gain teaching experience.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default StudyProgram;
