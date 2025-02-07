import React, { useEffect, useState } from "react";

import "./assets/custom.css";
import { Link } from "react-router-dom";
import ProfilePng from "./assets/img/dashboard/avatar.png";
import FeedbackPng from "./assets/img/dashboard/feedback.png";
import LmsPng from "./assets/img/dashboard/lms.png";
import TimeTablePng from "./assets/img/dashboard/Study-time.png";
import IssuedBookImg from "./assets/img/books-issued.jpg";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// import secureLocalStorage from "react-secure-storage";
// import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StudentDashboard() {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart Title",
      },
    },
  });

  useEffect(() => {
    //getStudentDashboardData()
    setChartData({
      labels: ["subject1", "subject2", "subject3", "subject4", "subject5", "subject6"],
      datasets: [
        {
          label: "Total Days",
          data: [30, 35, 28, 40, 38, 42],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
        {
          label: "Total Present",
          data: [25, 30, 20, 35, 33, 39],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
        {
          label: "Total Absent",
          data: [5, 5, 8, 5, 5, 3],
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgb(255, 159, 64)",
          borderWidth: 1,
        },
        {
          label: "OD",
          data: [5, 5, 8, 5, 5, 3],
          backgroundColor: "#007bff24",
          borderColor: "#4087f5",
          borderWidth: 1,
        },
      ],
    });
  }, []);
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // const getStudentDashboardData = async () => {
  //   try {
  //     console.log("getAdminDashboardData");
  //     const bformData = new FormData();
  //     bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
  //     bformData.append("login_type", secureLocalStorage.getItem("loginType"));
  //     bformData.append("session", localStorage.getItem("session"));
  //     bformData.append("data", "faculty_dashboard");

  //     bformData.append("faculty_id", facultyId);

  //     const response = await axios.post(
  //       `${PHP_API_URl}/dashboard.php`,
  //       bformData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log(response)
      
  //   } catch (error) {
  //     console.error("Error fetching admin Dashboard data:", error);
  //   }
  // };


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
                    <div className="d-flex justify-content-between">
                    <div className="card-title">Monthly Attendance</div>
                    <div className="" style={{ float: "right" }}>
                      <form onSubmit={handleMonthChange}>
                        <label htmlFor="month">Select a month</label>
                        <br />
                        <input
                          type="month"
                          id="month"
                          name="month"
                          value={selectedMonth}
                          onChange={handleMonthChange}
                        />
                      </form>
                    </div>

                    </div>
                   
                    <div className="id-chart-wrapper">
                      <Bar data={chartData} options={chartOptions} />
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
                    <div className="card-title">Pending Quiz</div>
                    <div className="d-flex justify-content-center">
                      <div className="table-responsive">
                        <table className="table text-center">
                          <thead>
                            <tr>
                              <th scope="col">Subject</th>
                              <th scope="col">Assignment</th>
                              <th scope="col">No of Question</th>
                              <th scope="col">Total Marks</th>
                              <th scope="col">Deadline Date</th>
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
                              <th scope="col">Subject</th>
                              <th scope="col">Assignment</th>
                              <th scope="col">No of Question</th>
                              <th scope="col">Total Marks</th>
                              <th scope="col">Deadline Date</th>
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
            <div className="col-md-5 d-flex justify-content-center">
              <div className="card w-100">
                <div className="card-body">
                  <div className="card-title">Today (Day) Shedule Class</div>
                  <div className="d-flex justify-content-center">
                    <div className="table-responsive">
                      <table className="table text-center">
                        <thead>
                          <tr>
                            <th scope="col">Suject</th>
                            <th scope="col">Time</th>
                            <th scope="col">Class Room</th>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
