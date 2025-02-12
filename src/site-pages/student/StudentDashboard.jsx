import React, { useEffect, useState } from "react";

import "./assets/custom.css";
import { Link } from "react-router-dom";
import ProfilePng from "./assets/img/dashboard/avatar.png";
import FeedbackPng from "./assets/img/dashboard/feedback.png";
import LmsPng from "./assets/img/dashboard/lms.png";
import TimeTablePng from "./assets/img/dashboard/Study-time.png";
import IssuedBookImg from "./assets/img/books-issued.jpg";
import InternshipImg from "./assets/img/internshiplink.png";
import WebsitesImg from "./assets/img/web.png";
import IntroBannerImg from "./assets/img/intro.png";
import TeacherImg from "./assets/img/teacher.webp";
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
import {
  FILE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import {
  capitalizeFirstLetter,
  formatDate,
} from "../../site-components/Helper/HelperFunction";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StudentDashboard() {
  const selectedCourseId = secureLocalStorage.getItem("selectedCourseId");
  const [data, setData] = useState();
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
    if (data?.student_attendance) {
      let labels = [];
      let totalClassList = [];
      let totalPresentList = [];
      let totalAbsentList = [];
      let totalOnDutyList = [];
      data?.student_attendance?.map((attendanceData) => {
        labels.push(subject[attendanceData?.subjectid]);
        totalClassList.push(attendanceData?.total_classes_held);
        totalPresentList.push(attendanceData?.total_present);
        totalAbsentList.push(attendanceData?.total_ab);
        totalOnDutyList.push(attendanceData?.total_od);
      });
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Total Classes",
            data: totalClassList,
            backgroundColor: "rgba(35, 211, 255, 0.2)",
            borderColor: "rgb(99, 182, 255)",
            borderWidth: 1,
          },
          {
            label: "Total Present",
            data: totalPresentList,
            backgroundColor: "rgba(117, 255, 79, 0.2)",
            borderColor: "rgb(85, 192, 75)",
            borderWidth: 1,
          },
          {
            label: "Total Absent",
            data: totalAbsentList,
            backgroundColor: "rgba(197, 40, 19, 0.2)",
            borderColor: "rgb(188, 25, 14)",
            borderWidth: 1,
          },
          {
            label: "Total On Duty",
            data: totalOnDutyList,
            backgroundColor: "rgba(242, 255, 64, 0.2)",
            borderColor: "rgb(255, 252, 64)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data]);
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const formattedDate = `${year}-${month}`;
    setSelectedMonth(formattedDate);
    getStudentDashboardData(formattedDate);
  }, []);
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    getStudentDashboardData(e.target.value);
  };

  const [subject, setSubject] = useState();
  const [teacher, setTeacher] = useState();
  const getStudentDashboardData = async (month = "2025-2") => {
    try {
      const bformData = new FormData();

      bformData.append("selectedcourseid", selectedCourseId);
      bformData.append("studentid", secureLocalStorage.getItem("studentId"));
      bformData.append("month", month);
      bformData.append("data", "student_dashboard");

      const response = await axios.post(
        `${PHP_API_URL}/dashboard.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200) {
        setData(response?.data?.data);

        let subjectMap = {};
        let teacherMap = {};
        response?.data?.data?.subjects?.forEach((subject) => {
          if (!subjectMap[subject?.id]) {
            subjectMap[subject?.id] = subject?.name;
          }
        });
        response?.data?.data?.teachers?.forEach((teacher) => {
          if (!teacherMap[teacher?.subid]) {
            teacherMap[teacher?.subid] = teacher;
          }
        });
        setTeacher(teacherMap);
        setSubject(subjectMap);
      }
    } catch (error) {}
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
              <div className="col-md-12 d-flex justify-content-center">
                <div className="card w-100" style={{ background: "#4269c4" }}>
                  <div className="card-body">
                    <div className="id-dsh-text">
                      <h4>
                        Good Morning, {secureLocalStorage.getItem("sname")}
                      </h4>
                      <p>
                        {(() => {
                          const date = new Date();
                          const options = {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          };
                          const formattedDate = date.toLocaleDateString(
                            "en-GB",
                            options
                          );
                          return formattedDate;
                        })()}
                      </p>
                      <div className="mt-3 id-dsh-text">
                        <p>
                          Notice: There is a staff meeting at 9AM today, Dont
                          forget to Attend!!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-7 col-lg-7 col-12 mb-3">
                <div className="card ">
                  <div className="card-body ">
                    <div className="d-flex justify-content-between">
                      <div className="card-title">Monthly Attendance</div>
                      <div className="" style={{ float: "right" }}>
                        <form
                          onSubmit={handleMonthChange}
                          className="month-form"
                        >
                          <label htmlFor="month" className="month-label">
                            Select a month
                          </label>
                          <input
                            type="month"
                            id="month"
                            name="month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="month-input"
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

              <div className="col-md-5 col-lg-5 col-12 mb-3">
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
                    <Link to={"/student/feedback-list"}>
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
                  <div className="col-md-6 mb-3">
                    <Link to={"/"}>
                      <div className="id-card-wrapper">
                        <img
                          src={WebsitesImg}
                          alt="profile"
                          className="id-dsh-links-img"
                        />
                        <h4 className="mb-0">Website</h4>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-6 mb-3">
                    <Link to={"/student/internship"}>
                      <div className="id-card-wrapper">
                        <img
                          src={InternshipImg}
                          alt="profile"
                          className="id-dsh-links-img"
                        />
                        <h4 className="mb-0">Internship</h4>
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
                              <th scope="col">Quiz</th>
                              <th scope="col">No of Question</th>
                              <th scope="col">Total Marks</th>
                              <th scope="col">Duration</th>
                              {!secureLocalStorage.getItem(
                                "sguardianemail"
                              ) && <th scope="col">Attempt</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {data?.pendingQuiz?.length > 0 ? (
                              data?.pendingQuiz.map((data, index) => (
                                <tr key={index}>
                                  <td>
                                    {capitalizeFirstLetter(
                                      subject[data?.subjectid]
                                    )}
                                  </td>

                                  <td>{capitalizeFirstLetter(data?.Quiz)}</td>
                                  <td>{data?.noOfQuestion}</td>
                                  <td>{data?.totalMarks}</td>
                                  <td>{data?.duration} Minutes </td>

                                  {!secureLocalStorage.getItem(
                                    "sguardianemail"
                                  ) && (
                                    <td>
                                      <Link
                                        to={`/quiz/quiz-subject/paper/${data.courseid}/${data.semesterid}/${data.subjectid}/${data.quizid}`}
                                        className="avatar avatar-icon avatar-md avatar-orange"
                                      >
                                        <i className="fas fa-eye"></i>
                                      </Link>
                                    </td>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8">No pending quiz</td>
                              </tr>
                            )}
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
                              {!secureLocalStorage.getItem(
                                "sguardianemail"
                              ) && <th scope="col">Attempt</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {data?.pendingAssignment?.length > 0 ? (
                              data?.pendingAssignment.map((data, index) => (
                                <tr>
                                  <td>
                                    {capitalizeFirstLetter(
                                      subject[data?.subjectid]
                                    )}
                                  </td>
                                  <td>
                                    {capitalizeFirstLetter(data?.assignment)}
                                  </td>

                                  <td>{data?.noOfQuestion}</td>
                                  <td>{data?.totalMarks}</td>
                                  <td>{formatDate(data?.deadlineDate)}</td>
                                  {!secureLocalStorage.getItem(
                                    "sguardianemail"
                                  ) && (
                                    <td className="">
                                      <Link
                                        to={`/assignment/assignment-subject/paper/${data.courseid}/${data.semesterid}/${data.subjectid}/${data.quizid}`}
                                        className="avatar avatar-icon avatar-md avatar-orange"
                                      >
                                        <i className="fas fa-eye"></i>
                                      </Link>
                                    </td>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8">No pending assignment</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {data?.issued_books && data?.issued_books?.length > 0 && (
              <div className="row">
                <div className="col-lg-12">
                  <div className="card " style={{ padding: "20px" }}>
                    <div className="row">
                      <div className="col-lg-12 col-12 mb-3">
                        <h4>Current Issued Books</h4>
                      </div>
                      {data?.issued_books?.map((book) => (
                        <div className="col-lg-4 col-md-4 col-12 mb-3">
                          <div className="id-issued-wrapper">
                            <img
                              src={
                                book?.image
                                  ? `${FILE_API_URL}/books/${book.image}`
                                  : IssuedBookImg
                              }
                              alt="student-img"
                              className="img-fluid"
                            />
                            <div className="id-issued-content">
                              <h4>{capitalizeFirstLetter(book?.bookname)}</h4>
                              <p className="mb-0">ISBN: {book?.issue_no}</p>
                              <p className="mb-0">
                                Issued Date: {book?.issue_date}
                              </p>
                              <p className="mb-0">
                                Return Date: {book?.return_date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {data?.timetable && data?.timetable?.length > 0 && (
              <div className="col-md-5 d-flex justify-content-center">
                <div className="card w-100">
                  <div className="card-body">
                    {data?.timetable?.map((classItem) => (
                      <div className="card mb-3 id-card">
                        <div className="d-flex align-items-center justify-content-between p-3 pb-1">
                          <div className="d-flex align-items-center flex-wrap mb-2">
                            <span className="avatar avatar-lg flex-shrink-0 rounded mr-3">
                              {/* <img src={TeacherImg} alt="Profile" /> */}
                             
                              {teacher[classItem?.subjectid].avtar ? (
                                                            <img
                              
                                                              src={`${FILE_API_URL}/user/${teacher[classItem?.subjectid].uid}/${teacher[classItem?.subjectid].avtar}`}
                                                              alt=""
                                                              style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                backgroundColor: "#e6fff3",
                                                                fontSize: "20px",
                                                                color: "#00a158",
                                                              }}
                                                              className="rounded-circle d-flex justify-content-center align-items-center"
                                                            />
                                                          ) : (
                                                            <div
                                                              style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                backgroundColor: "#e6fff3",
                                                                fontSize: "20px",
                                                                color: "#00a158",
                                                              }}
                                                              className="rounded-circle d-flex justify-content-center align-items-center"
                                                            >
                                                              {teacher[classItem?.subjectid]?.teachername[0]}
                                                            </div>
                                                          )}
                            </span>
                            <div>
                              <h6 className="mb-1 text-decoration-line-through">
                                {subject[classItem?.subjectid]} <br />
                                
                                {teacher[classItem?.subjectid]?.teachername} 
                              </h6>
                              <span>
                                <i class="fa-regular fa-clock mr-2"></i>
                                {classItem?.time}
                              </span>
                            </div>
                          </div>
                          <span className="badge badge-soft-success shadow-none mb-2">
                            <i className="ti ti-circle-filled fs-8 me-1" />
                            Class Room:{" "}
                            <span className="id-class-room-no">{classItem?.classroom}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;