import React, { useEffect, useState } from "react";
import StudyMaterial from "./assets/img/study-material.png";
import Assignment from "./assets/img/assignment.png";
import Quiz from "./assets/img/quiz.png";
import "./assets/custom.css";
import { Link } from "react-router-dom";
import ProfilePng from "./assets/img/dashboard/avatar.png";
import FeedbackPng from "./assets/img/dashboard/feedback.png";
import LmsPng from "./assets/img/dashboard/lms.png";
import TimeTablePng from "./assets/img/dashboard/Study-time.png";
import IssuedBookImg from "./assets/img/books-issued.jpg";
import { Pie } from "react-chartjs-2"; // Import Line chart component from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

function StudentDashboard() {
  // Register necessary components for Chart.js
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  const PieChart = ({ dataValues }) => {
    // Ensure the data is not null/undefined; if so, default to 0
  
    // Define the chart data
    const data = {
      labels: [], // Custom labels for tooltip
  
      datasets: [
        {
          data: dataValues,
          backgroundColor: [
            "rgb(63, 255, 98)",
            "rgb(238, 255, 4)",
            "rgb(255, 12, 4)",
          ],
          hoverOffset: 4,
        },
      ],
    };
  
    // Chart options to customize the tooltip
    const options = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const labels = ["Present", "On Duty", "Absent"];
              return `${labels[tooltipItem.dataIndex]}: ${tooltipItem.raw}`;
            },
          },
        },
      },
    };
  
    return <Pie data={data} options={options} />;
  };
  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container">
            <div className="mb-3 mt-0">
              <nav className="breadcrumb">
                <a href="/student" className="breadcrumb-item">
                  Dashboard
                </a>
              </nav>
            </div>
            <div className="row">
              <div className="col-md-6 col-lg-6 col-12 mb-3">
                              <div className="card ">
                                <div className="card-body ">
                                  <div className="card-title">Monthly Attendance</div>
                                  <div className="row ml-1">
                                    {" "}
                                        <div className="col-md-12 p-2">
                                          <div className="row">
                                            <div
                                              className=" col-4 "
                                              style={{
                                                backgroundColor: "",
                                                fontSize: "1em",
                                                borderRadius: "5px",
                                              }}
                                            >
                                              <p className="m-0 text-dark">
                                                {/* {capitalizeFirstLetter(data?.subject)} */}
                                                Subject 
                                              </p>
                                              <p className="m-0 text-dark">
                                                {/* {capitalizeFirstLetter(data?.course)} */}
                                                Course
                                              </p>
                                              <p className="m-0 text-dark">
                                                {/* {capitalizeFirstLetter(data?.semester)} */}
                                                Semester
                                              </p>
                                            </div>
                                            <div
                                              className=" col-4 p-1"
                                              style={{
                                                backgroundColor: "",
                                                fontSize: "1em",
                                                borderRadius: "5px",
                                              }}
                                            >
                                              <p className="m-0 text-success">
                                                <label className="">Total Present </label>{" "}
                                                {/* {data?.present_count || 0} */}0
                                              </p>
                
                                              <p className="m-0 text-warning">
                                                <label className="">Total OnDuty </label>{" "}
                                                {/* {data?.total_onduty || 0} */}0
                                              </p>
                
                                              <p className="m-0 text-danger">
                                                <label className="">Total Absent </label>{" "}
                                                {/* {data?.total_absent || 0} */}
                                              </p>
                                            </div>
                                            <div className="col-4">
                                              <PieChart
                                                dataValues={[
                                                  // data?.present_count ?? 0,
                                                  // data?.total_onduty ?? 0,
                                                  // data?.total_absent ?? 0,
                                                  3,5,6,
                                                ]}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      {/* ))} */}
                                  </div>
                                </div>
                              </div>
                            </div>
              <div className="col-md-6 col-lg-6 col-12 mb-3">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Link to={"/student/profile"}>
                      <div className="id-card-wrapper">
                        <img
                          src={ProfilePng}
                          alt="profile"
                          className="id-dsh-links-img"
                        />
                        <h4 className="mb-0">Profile</h4>
                      </div>
                    </Link>
                  </div>

                  <div className="col-md-6 mb-3">
                    <Link to={"/student/time-table"}>
                      <div className="id-card-wrapper">
                        <img
                          src={TimeTablePng}
                          alt="profile"
                          className="id-dsh-links-img"
                        />
                        <h4 className="mb-0">Time Table</h4>
                      </div>
                    </Link>
                  </div>

                  <div className="col-md-6">
                    <Link to={"/student/lms"}>
                      <div className="id-card-wrapper">
                        <img
                          src={LmsPng}
                          alt="profile"
                          className="id-dsh-links-img"
                        />
                        <h4 className="mb-0">LMS</h4>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to={"/student/new-feedback"}>
                      <div className="id-card-wrapper">
                        <img
                          src={FeedbackPng}
                          alt="profile"
                          className="id-dsh-links-img"
                        />
                        <h4 className="mb-0">Feedback</h4>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-12 d-flex justify-content-center">
                <div className="card w-100">
                  <div className="card-body">
                    <div className="card-title">Upcoming Exams</div>
                    <div className="d-flex justify-content-center">
                      <div className="table-responsive">
                        <table className="table text-center">
                          <thead>
                            <tr>
                              <th scope="col">Course</th>
                              <th scope="col">Semester</th>
                              <th scope="col">Subject</th>
                              <th scope="col">Paper Code</th>
                              <th scope="col">Exam Type</th>
                              <th scope="col">Exam Date</th>
                              <th scope="col">Start Time</th>
                              <th scope="col">End Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* {upcomingExamList?.length > 0 ? (
                              upcomingExamList.map((data, index) => (
                                <tr key={index}>
                                  <td>{capitalizeFirstLetter(data?.course)}</td>
                                  <td>
                                    {capitalizeFirstLetter(data?.semester)}
                                  </td>
                                  <td>
                                    {capitalizeFirstLetter(data?.subject)}
                                  </td>
                                  <td>
                                    {capitalizeAllLetters(data?.paperCode)}
                                  </td>
                                  <td>
                                    {capitalizeFirstLetter(data?.examType)}
                                  </td>
                                  <td>{data?.exam_date}</td>
                                  <td>{data?.startTime}</td>
                                  <td>{data?.endTime}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8">No upcoming exams available</td>
                              </tr>
                            )} */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 d-flex justify-content-center">
                <div className="card w-100">
                  <div className="card-body">
                    <div className="card-title">Pending Assignment</div>
                    <div className="d-flex justify-content-center">
                      <div className="table-responsive">
                        <table className="table text-center">
                          <thead>
                            <tr>
                              <th scope="col">Course</th>
                              <th scope="col">Semester</th>
                              <th scope="col">Subject</th>
                              <th scope="col">Assignment</th>
                              <th scope="col">Student</th>
                              <th scope="col">Evaluate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* {pendingAssignment?.length > 0 ? (
                              pendingAssignment.map((data, index) => (
                                <tr>
                                  <td>{capitalizeFirstLetter(data?.course)}</td>
                                  <td>
                                    {capitalizeFirstLetter(data?.semester)}
                                  </td>
                                  <td>
                                    {capitalizeFirstLetter(data?.subject)}
                                  </td>
                                  <td>
                                    {capitalizeFirstLetter(data?.assignment)}
                                  </td>
                                  <td>
                                    {capitalizeFirstLetter(data?.student)}
                                  </td>
                                  <td className="text-success">
                                    <Link
                                      to={`/admin/assignment-response-view/${data.id}`}
                                      className="avatar avatar-icon avatar-md avatar-orange"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8">No upcoming exams available</td>
                              </tr>
                            )} */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card " style={{ padding: "20px" }}>
                  <div className="row">
                    <div className="col-lg-12 col-12 mb-3">
                      <h4>Current Issued Books</h4>
                    </div>

                    <div className="col-lg-4 col-md-4 col-12 mb-3">
                      <div className="id-issued-wrapper">
                        <img
                          src={IssuedBookImg}
                          alt="student-img"
                          className="img-fluid"
                        />
                        <div className="id-issued-content">
                          <h4>Book Name</h4>
                          <p className="mb-0">Issued Date: 24/08/2003</p>
                          <p className="mb-0">Return Date: 12/06/2003 </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 mb-3">
                      <div className="id-issued-wrapper">
                        <img
                          src={IssuedBookImg}
                          alt="student-img"
                          className="img-fluid"
                        />
                        <div className="id-issued-content">
                          <h4>Book Name</h4>
                          <p className="mb-0">Issued Date: 24/08/2003</p>
                          <p className="mb-0">Return Date: 12/06/2003 </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 mb-3">
                      <div className="id-issued-wrapper">
                        <img
                          src={IssuedBookImg}
                          alt="student-img"
                          className="img-fluid"
                        />
                        <div className="id-issued-content">
                          <h4>Book Name</h4>
                          <p className="mb-0">Issued Date: 24/08/2003</p>
                          <p className="mb-0">Return Date: 12/06/2003 </p>
                        </div>
                      </div>
                    </div>

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

export default StudentDashboard;
