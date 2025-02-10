import React, { useEffect, useState } from "react";
import {
  capitalizeAllLetters,
  capitalizeFirstLetter,
} from "../../site-components/Helper/HelperFunction";
import { Pie } from "react-chartjs-2"; // Import Line chart component from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Select from "react-select";

import { PHP_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import StudentImg from "../../site-components/admin/assets/images/dashboard/student-1.png";
import StudentImg2 from "../../site-components/admin/assets/images/dashboard/student-2.png";
import CourseImg from "../../site-components/admin/assets/images/dashboard/course.png";
import RolesImg1 from "../../site-components/admin/assets/images/dashboard/roles-1.png";
import RolesImg2 from "../../site-components/admin/assets/images/dashboard/roles-2.png";
import FacultyImg from "../../site-components/admin/assets/images/dashboard/faculty.png";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";

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

const FacultyDashboard = () => {
  //   const [session, setSession] = useState(); // Session data: the fuel for exams.
  const [data, setData] = useState([]);

  // const sessionListDropdown = async () => {
  //     try {
  //       const { data } = await axios.post(`${NODE_API_URL}/api/session/fetch`, {
  //         status: 1,
  //         column: "id, dtitle",
  //       });
  //       data?.statusCode === 200 && data.data.length
  //         ? setSession(data.data)
  //         : (toast.error("Session not found."), setSession([]));
  //     } catch {
  //       setSession([]);
  //     }
  //   };

  const [isFetching, setIsFetching] = useState(false);

  const [loading, setLoading] = useState();
  const [facultyListing, setFacultyListing] = useState([]);
  const [facultyId, setFacultyId] = useState(
    secureLocalStorage.getItem("login_id")
  );
  const loadFacultyData = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_userPage");
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      // Assuming response.data.data contains the faculty data
      setFacultyListing(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAdminDashboardData();
  }, [facultyId]);

  const [scheduleClass, setScheduleClass] = useState([]);
  const [upcomingExamList, setUpcomingExamList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [pendingAssignment, setPendingAssignment] = useState([]);
  const [selfSubjectDailyAttendance, setSelfSubjectDailyAttendance] = useState(
    []
  );
  const getAdminDashboardData = async () => {
    try {
      console.log("getAdminDashboardData");
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("session", localStorage.getItem("session"));
      bformData.append("data", "faculty_dashboard");

      bformData.append("faculty_id", facultyId);

      const response = await axios.post(
        `${PHP_API_URL}/dashboard.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(response.data.data);
      console.log(response?.data?.data);
      setScheduleClass(response.data.data?.today_schedule);
      setUpcomingExamList(response?.data?.data?.upcomingExam);
      setSubjectList(response?.data?.data?.facultysubjects);
      setPendingAssignment(response?.data?.data?.pendingAssignment);
      setSelfSubjectDailyAttendance(
        response?.data?.data?.selfSubjectDailyAttendance
      );
    } catch (error) {
      console.error("Error fetching admin Dashboard data:", error);
    }
  };

  useEffect(() => {
    getAdminDashboardData();
    loadFacultyData();
    // sessionListDropdown(); // Fetch session list
  }, []);

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-3">
            <div className="header-sub-title d-flex justify-content-between">
              <nav className="breadcrumb breadcrumb-dash">
                <Link to="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </Link>
                <span className="breadcrumb-item active">
                  Faculty 
                </span>
              </nav>
              <div className="form-group ">
                <Select
                  options={facultyListing?.map((faculty) => ({
                    value: faculty.id, // Use faculty id as the value
                    label: `${faculty.first_name} ${faculty.last_name}`, // Assuming faculty has first_name and last_name fields
                  }))}
                  onChange={(selectedOption) => {
                    setFacultyId(
                      selectedOption.value // Save selected faculty id
                    );
                  }}
                  value={
                    facultyListing.find((faculty) => faculty.id === facultyId)
                      ? {
                          value: facultyId,
                          label: `${
                            facultyListing.find(
                              (faculty) => faculty.id === facultyId
                            ).first_name
                          } ${
                            facultyListing.find(
                              (faculty) => faculty.id === facultyId
                            ).last_name
                          }`,
                        }
                      : {
                          value: facultyId,
                          label: "Select Faculty",
                        }
                  }
                />
              </div>
            </div>
          </div>

          {/* <div className="card border-0 bg-transparent mb-2">
          <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
            <h5 className="card-title h6_new">
              {"Monthly Visitor Analytics"}
            </h5>
          </div>
        </div> */}

          <div className="row">
            <div className="col-md-3 col-lg-3 col-12">
              <div className="card id-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={CourseImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4> Assigned Subjects</h4>
                    <h5 className="id-counter-number">{subjectList?.length}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-lg-3 col-12">
              <div className="card id-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={FacultyImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4>Scheduled Classes</h4>
                    <h5 className="id-counter-number">
                      {scheduleClass?.length}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-lg-3 col-12">
              <div className="card id-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={RolesImg2} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4> Upcoming Exams</h4>
                    <h5 className="id-counter-number">
                      {upcomingExamList?.length}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-lg-3 col-12">
              <div className="card id-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={StudentImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4>Pending Assignments</h4>
                    <h5 className="id-counter-number">
                      {pendingAssignment?.length}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card ">
                <div className="card-body ">
                  <div className="card-title">Assigned Subject</div>
                  <div className="row">
                    {" "}
                    {subjectList &&
                      subjectList?.length > 0 &&
                      subjectList.map((data, index) => (
                        <div className="col-md-6 p-2" key={index}>
                          <div
                            className="text-center text-light col-12 p-1"
                            style={{
                              backgroundColor: "#3f87f5",
                              fontSize: "1em",
                              borderRadius: "5px",
                            }}
                          >
                            <p className="m-0 text-light">
                              {capitalizeFirstLetter(data?.subject)}
                            </p>
                            <p className="m-0 text-light">
                              {capitalizeFirstLetter(data?.course)}
                            </p>
                            <p className="m-0 text-light">
                              {capitalizeFirstLetter(data?.semester)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="card-title">Scheduled Classes</div>
                  <table class="table table-responsive">
                    <thead>
                      <tr>
                        <th scope="col">Course</th>
                        <th scope="col">Semester</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Class Room</th>
                        <th scope="col">Time Slot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleClass &&
                        scheduleClass?.length > 0 &&
                        scheduleClass.map((data, index) => (
                          <tr>
                            <td>{capitalizeFirstLetter(data?.course)}</td>
                            <td>{capitalizeFirstLetter(data?.semester)}</td>
                            <td>{capitalizeFirstLetter(data?.subject)}</td>
                            <td>{capitalizeFirstLetter(data?.classroom)}</td>
                            <td className="text-success">
                              {capitalizeFirstLetter(data?.timeSlot)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
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
                          {upcomingExamList?.length > 0 ? (
                            upcomingExamList.map((data, index) => (
                              <tr key={index}>
                                <td>{capitalizeFirstLetter(data?.course)}</td>
                                <td>{capitalizeFirstLetter(data?.semester)}</td>
                                <td>{capitalizeFirstLetter(data?.subject)}</td>
                                <td>{capitalizeAllLetters(data?.paperCode)}</td>
                                <td>{capitalizeFirstLetter(data?.examType)}</td>
                                <td>{data?.exam_date}</td>
                                <td>{data?.startTime}</td>
                                <td>{data?.endTime}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8">No upcoming exams available</td>
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
                            <th scope="col">Course</th>
                            <th scope="col">Semester</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Assignment</th>
                            <th scope="col">Student</th>
                            <th scope="col">Evaluate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingAssignment?.length > 0 ? (
                            pendingAssignment.map((data, index) => (
                              <tr>
                                <td>{capitalizeFirstLetter(data?.course)}</td>
                                <td>{capitalizeFirstLetter(data?.semester)}</td>
                                <td>{capitalizeFirstLetter(data?.subject)}</td>
                                <td>
                                  {capitalizeFirstLetter(data?.assignment)}
                                </td>
                                <td>{capitalizeFirstLetter(data?.student)}</td>
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

            <div className="col-md-12">
              <div className="card ">
                <div className="card-body ">
                  <div className="card-title">Today Attendance</div>
                  <div className="row ml-1">
                    {" "}
                    {selfSubjectDailyAttendance &&
                      selfSubjectDailyAttendance?.length > 0 &&
                      selfSubjectDailyAttendance.map((data, index) => (
                        <div className="col-md-6 p-2" key={index}>
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
                                {capitalizeFirstLetter(data?.subject)}
                              </p>
                              <p className="m-0 text-dark">
                                {capitalizeFirstLetter(data?.course)}
                              </p>
                              <p className="m-0 text-dark">
                                {capitalizeFirstLetter(data?.semester)}
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
                                {data?.present_count || 0}
                              </p>

                              <p className="m-0 text-warning">
                                <label className="">Total OnDuty </label>{" "}
                                {data?.total_onduty || 0}
                              </p>

                              <p className="m-0 text-danger">
                                <label className="">Total Absent </label>{" "}
                                {data?.total_absent || 0}
                              </p>
                            </div>
                            <div className="col-4">
                              <PieChart
                                dataValues={[
                                  data?.present_count ?? 0,
                                  data?.total_onduty ?? 0,
                                  data?.total_absent ?? 0,
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
