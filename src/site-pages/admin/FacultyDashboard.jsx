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
import { FaAngleRight } from "react-icons/fa6";
import { MdEventAvailable } from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";
import axios from "axios";
import StudentImg from "../../site-components/admin/assets/images/dashboard/student-1.png";
import StudentImg2 from "../../site-components/admin/assets/images/dashboard/student-2.png";
import CourseImg from "../../site-components/admin/assets/images/dashboard/course.png";
import RolesImg1 from "../../site-components/admin/assets/images/dashboard/roles-1.png";
import RolesImg2 from "../../site-components/admin/assets/images/dashboard/roles-2.png";
import FacultyImg from "../../site-components/admin/assets/images/dashboard/faculty.png";
import banners1 from "../../site-components/admin/assets/images/dashboard/shape-01.png";
import banners2 from "../../site-components/admin/assets/images/dashboard/shape-02.png";
import banners3 from "../../site-components/admin/assets/images/dashboard/shape-03.png";
import banners4 from "../../site-components/admin/assets/images/dashboard/shape-04.png";
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



    const [greeting, setGreeting] = useState("");
    const [currentDate, setCurrentDate] = useState("");
  
    useEffect(() => {
      // Function to update greeting based on time
      const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
          setGreeting("Good Morning");
        } else if (hour < 17) {
          setGreeting("Good Afternoon");
        } else if (hour < 20) {
          setGreeting("Good Evening");
        } else {
          setGreeting("Good Night");
        }
      };
  
      // Function to update current date
      const updateDate = () => {
    
        const today = new Date();
  
        // Format Date (e.g., "15 Jun 2024")
        const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = today.toLocaleDateString("en-GB", dateOptions);
    
        // Format Time (e.g., "10:30:45 AM")
        const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
        const formattedTime = today.toLocaleTimeString("en-US", timeOptions);
    
        // Combine Date & Time
        setCurrentDate(`${formattedDate}, ${formattedTime}`);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        // setCurrentDate(today.toLocaleDateString("en-GB", options)); // Format: "15 Jun 2024"
      };
  
      updateGreeting();
      updateDate(); // Initial call
      const interval = setInterval(updateDate, 1000); // Updates every second
      return () => clearInterval(interval);
    }, []);
  
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-3">
          <div className="admintext"> Faculty Dashboard</div>
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
             <div className="px-3">
                    <div className="row">
                    <div className="bg-dark" style={{ color: "white", padding: "20px" }}>
                <div className="banneradmins">
                  <div>
                    <div  className="banerheadings"
                      style={{
                      
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontWeight:"700"
                      }}
                    >
                      Welcome Back, Mr. Herald <span className="editIcons dark-hover"><FiEdit /></span>
                    </div>
                    <div style={{ fontSize: "14px" }}> {greeting}! Hope you have a great day at work.</div>
                  </div>
                  <div>
                    <LuRefreshCcw style={{ fontSize: "14px", color: "white", marginRight: "6px" }} />
                    {/* Updated Recently on  */}
                    {currentDate}
                  </div>
                </div>
                <img src={banners1} alt="icon" width="70" height="60" className="img-fluid shape-01" />
                <img src={banners2} alt="icon" width="50" height="70" className="img-fluid shape-02" />
                <img src={banners3} alt="icon" width="50" height="50" className="img-fluid shape-03" />
                <img src={banners4} alt="icon" width="25" height="25" className="img-fluid shape-04" />
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

  <div className="row mt-3 mb-1">
      {/* Total Students */}
      <div className="col-md-3 col-lg-3 col-12 ">
        <div className="card id-card gradient-card1 animate-card">
          <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
            <span className="id-total-record-student">
              <img src={StudentImg} alt="student-img" />
            </span>
            <div className="id-total-record-content">
              <div className="titleboxes">Assigned Subjects</div>
              <h5 className="id-counter-number">{subjectList?.length}</h5>
            </div>
          </div>
          {/* Wave Background */}
        <div className="wave-bg">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#8cb6f9"
            d="M0,256L48,245.3C96,235,192,213,288,202.7C384,192,480,192,576,176C672,160,768,128,864,133.3C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160V320H0Z"
          ></path>
        </svg>
  {/* <svg viewBox="0 0 1440 320" className="w-full">
    <path
      fill="#8cb6f9"
      fillOpacity="1"
      d="M0,64L48,101.3C96,139,192,213,288,224C384,235,480,181,576,144C672,107,768,85,864,101.3C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
    ></path>
  </svg> */}
</div>

        </div>
      </div>

      {/* Total Courses */}
      <div className="col-md-3 col-lg-3 col-12">
        <div className="card id-card gradient-card2 animate-card">
          <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
            <span className="id-total-record-student">
              <img src={CourseImg} alt="course-img" />
            </span>
            <div className="id-total-record-content">
              <h4 className="titleboxes">Scheduled Classes</h4>
              <h5 className="id-counter-number">{scheduleClass?.length}</h5>
            </div>
          </div>
        <div className="wave-bg">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#ff9a9e"
            d="M0,288L48,266.7C96,245,192,203,288,170.7C384,139,480,117,576,122.7C672,128,768,160,864,181.3C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224V320H0Z"
          ></path>
        </svg>

</div>

        </div>
      </div>

      {/* Total Employee */}
      <div className="col-md-3 col-lg-3 col-12">
        <div className="card id-card gradient-card3 animate-card">
          <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
            <span className="id-total-record-student">
              <img src={FacultyImg} alt="faculty-img" />
            </span>
            <div className="id-total-record-content">
              <h4 className="titleboxes">Upcoming Exams</h4>
              <h5 className="id-counter-number"> {upcomingExamList?.length}</h5>
            </div>
          </div>
        <div className="wave-bg">

 
      <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#a8e063"
            d="M0,224L48,197.3C96,171,192,117,288,112C384,107,480,149,576,181.3C672,213,768,235,864,229.3C960,224,1056,192,1152,154.7C1248,117,1344,75,1392,53.3L1440,32V320H0Z"
          ></path>
        </svg>
</div>

        </div>
      </div>

      {/* Total Roles */}
      <div className="col-md-3 col-lg-3 col-12">
        <div className="card id-card gradient-card4 animate-card">
          <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
            <span className="id-total-record-student">
              <img src={RolesImg2} alt="roles-img" />
            </span>
            <div className="id-total-record-content">
              <h4 className="titleboxes">Pending Assignments</h4>
              <h5 className="id-counter-number"> {pendingAssignment?.length}</h5>
            </div>
          </div>
        <div className="wave-bg">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#66a6ff"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,213.3C672,213,768,203,864,192C960,181,1056,171,1152,176C1248,181,1344,203,1392,213.3L1440,224V320H0Z"
          ></path>
        </svg>
 
</div>

        </div>
      </div>
    </div>


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


// import React, { useEffect, useState } from "react";
// import {
//   capitalizeAllLetters,
//   capitalizeFirstLetter,
// } from "../../site-components/Helper/HelperFunction";
// import { Pie } from "react-chartjs-2"; // Import Line chart component from react-chartjs-2
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import Select from "react-select";

// import { PHP_API_URL } from "../../site-components/Helper/Constant";
// import secureLocalStorage from "react-secure-storage";
// import axios from "axios";
// import StudentImg from "../../site-components/admin/assets/images/dashboard/student-1.png";
// import StudentImg2 from "../../site-components/admin/assets/images/dashboard/student-2.png";
// import CourseImg from "../../site-components/admin/assets/images/dashboard/course.png";
// import RolesImg1 from "../../site-components/admin/assets/images/dashboard/roles-1.png";
// import RolesImg2 from "../../site-components/admin/assets/images/dashboard/roles-2.png";
// import FacultyImg from "../../site-components/admin/assets/images/dashboard/faculty.png";
// import "react-tabs/style/react-tabs.css";
// import { Link } from "react-router-dom";

// // Register necessary components for Chart.js
// ChartJS.register(ArcElement, Tooltip, Legend);

// const PieChart = ({ dataValues }) => {
//   // Ensure the data is not null/undefined; if so, default to 0

//   // Define the chart data
//   const data = {
//     labels: [], // Custom labels for tooltip

//     datasets: [
//       {
//         data: dataValues,
//         backgroundColor: [
//           "rgb(63, 255, 98)",
//           "rgb(238, 255, 4)",
//           "rgb(255, 12, 4)",
//         ],
//         hoverOffset: 4,
//       },
//     ],
//   };

//   // Chart options to customize the tooltip
//   const options = {
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             const labels = ["Present", "On Duty", "Absent"];
//             return `${labels[tooltipItem.dataIndex]}: ${tooltipItem.raw}`;
//           },
//         },
//       },
//     },
//   };

//   return <Pie data={data} options={options} />;
// };

// const FacultyDashboard = () => {
//   //   const [session, setSession] = useState(); // Session data: the fuel for exams.
//   const [data, setData] = useState([]);

//   // const sessionListDropdown = async () => {
//   //     try {
//   //       const { data } = await axios.post(`${NODE_API_URL}/api/session/fetch`, {
//   //         status: 1,
//   //         column: "id, dtitle",
//   //       });
//   //       data?.statusCode === 200 && data.data.length
//   //         ? setSession(data.data)
//   //         : (toast.error("Session not found."), setSession([]));
//   //     } catch {
//   //       setSession([]);
//   //     }
//   //   };

//   const [isFetching, setIsFetching] = useState(false);

//   const [loading, setLoading] = useState();
//   const [facultyListing, setFacultyListing] = useState([]);
//   const [facultyId, setFacultyId] = useState(
//     secureLocalStorage.getItem("login_id")
//   );
//   const loadFacultyData = async () => {
//     setLoading(true);
//     try {
//       const bformData = new FormData();
//       bformData.append("data", "load_userPage");
//       const response = await axios.post(
//         `${PHP_API_URL}/faculty.php`,
//         bformData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log(response);
//       // Assuming response.data.data contains the faculty data
//       setFacultyListing(response.data.data);
//     } catch (error) {
//       console.error("Error fetching faculty data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     getAdminDashboardData();
//   }, [facultyId]);

//   const [scheduleClass, setScheduleClass] = useState([]);
//   const [upcomingExamList, setUpcomingExamList] = useState([]);
//   const [subjectList, setSubjectList] = useState([]);
//   const [pendingAssignment, setPendingAssignment] = useState([]);
//   const [selfSubjectDailyAttendance, setSelfSubjectDailyAttendance] = useState(
//     []
//   );
//   const getAdminDashboardData = async () => {
//     try {
//       console.log("getAdminDashboardData");
//       const bformData = new FormData();
//       bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
//       bformData.append("login_type", secureLocalStorage.getItem("loginType"));
//       bformData.append("session", localStorage.getItem("session"));
//       bformData.append("data", "faculty_dashboard");

//       bformData.append("faculty_id", facultyId);

//       const response = await axios.post(
//         `${PHP_API_URL}/dashboard.php`,
//         bformData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setData(response.data.data);
//       console.log(response?.data?.data);
//       setScheduleClass(response.data.data?.today_schedule);
//       setUpcomingExamList(response?.data?.data?.upcomingExam);
//       setSubjectList(response?.data?.data?.facultysubjects);
//       setPendingAssignment(response?.data?.data?.pendingAssignment);
//       setSelfSubjectDailyAttendance(
//         response?.data?.data?.selfSubjectDailyAttendance
//       );
//     } catch (error) {
//       console.error("Error fetching admin Dashboard data:", error);
//     }
//   };

//   useEffect(() => {
//     getAdminDashboardData();
//     loadFacultyData();
//     // sessionListDropdown(); // Fetch session list
//   }, []);

//   return (
//     <div className="page-container">
//       <div className="main-content">
//         <div className="container-fluid">
//           <div className="page-header mb-3">
//             <div className="header-sub-title d-flex justify-content-between">
//               <nav className="breadcrumb breadcrumb-dash">
//                 <Link to="/admin/home" className="breadcrumb-item">
//                   <i className="fas fa-home m-r-5" /> Dashboard
//                 </Link>
//                 <span className="breadcrumb-item active">
//                   Faculty 
//                 </span>
//               </nav>
//               <div className="form-group ">
//                 <Select
//                   options={facultyListing?.map((faculty) => ({
//                     value: faculty.id, // Use faculty id as the value
//                     label: `${faculty.first_name} ${faculty.last_name}`, // Assuming faculty has first_name and last_name fields
//                   }))}
//                   onChange={(selectedOption) => {
//                     setFacultyId(
//                       selectedOption.value // Save selected faculty id
//                     );
//                   }}
//                   value={
//                     facultyListing.find((faculty) => faculty.id === facultyId)
//                       ? {
//                           value: facultyId,
//                           label: `${
//                             facultyListing.find(
//                               (faculty) => faculty.id === facultyId
//                             ).first_name
//                           } ${
//                             facultyListing.find(
//                               (faculty) => faculty.id === facultyId
//                             ).last_name
//                           }`,
//                         }
//                       : {
//                           value: facultyId,
//                           label: "Select Faculty",
//                         }
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           {/* <div className="card border-0 bg-transparent mb-2">
//           <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
//             <h5 className="card-title h6_new">
//               {"Monthly Visitor Analytics"}
//             </h5>
//           </div>
//         </div> */}

//           <div className="row">
//             <div className="col-md-3 col-lg-3 col-12">
//               <div className="card id-card">
//                 <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
//                   <span className="id-total-record-student">
//                     <img src={CourseImg} alt="student-img" />
//                   </span>
//                   <div className="id-total-record-content">
//                     <h4> Assigned Subjects</h4>
//                     <h5 className="id-counter-number">{subjectList?.length}</h5>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-lg-3 col-12">
//               <div className="card id-card">
//                 <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
//                   <span className="id-total-record-student">
//                     <img src={FacultyImg} alt="student-img" />
//                   </span>
//                   <div className="id-total-record-content">
//                     <h4>Scheduled Classes</h4>
//                     <h5 className="id-counter-number">
//                       {scheduleClass?.length}
//                     </h5>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-lg-3 col-12">
//               <div className="card id-card">
//                 <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
//                   <span className="id-total-record-student">
//                     <img src={RolesImg2} alt="student-img" />
//                   </span>
//                   <div className="id-total-record-content">
//                     <h4> Upcoming Exams</h4>
//                     <h5 className="id-counter-number">
//                       {upcomingExamList?.length}
//                     </h5>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-lg-3 col-12">
//               <div className="card id-card">
//                 <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
//                   <span className="id-total-record-student">
//                     <img src={StudentImg} alt="student-img" />
//                   </span>
//                   <div className="id-total-record-content">
//                     <h4>Pending Assignments</h4>
//                     <h5 className="id-counter-number">
//                       {pendingAssignment?.length}
//                     </h5>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-md-6">
//               <div className="card ">
//                 <div className="card-body ">
//                   <div className="card-title">Assigned Subject</div>
//                   <div className="row">
//                     {" "}
//                     {subjectList &&
//                       subjectList?.length > 0 &&
//                       subjectList.map((data, index) => (
//                         <div className="col-md-6 p-2" key={index}>
//                           <div
//                             className="text-center text-light col-12 p-1"
//                             style={{
//                               backgroundColor: "#3f87f5",
//                               fontSize: "1em",
//                               borderRadius: "5px",
//                             }}
//                           >
//                             <p className="m-0 text-light">
//                               {capitalizeFirstLetter(data?.subject)}
//                             </p>
//                             <p className="m-0 text-light">
//                               {capitalizeFirstLetter(data?.course)}
//                             </p>
//                             <p className="m-0 text-light">
//                               {capitalizeFirstLetter(data?.semester)}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="card">
//                 <div className="card-body">
//                   <div className="card-title">Scheduled Classes</div>
//                   <table class="table table-responsive">
//                     <thead>
//                       <tr>
//                         <th scope="col">Course</th>
//                         <th scope="col">Semester</th>
//                         <th scope="col">Subject</th>
//                         <th scope="col">Class Room</th>
//                         <th scope="col">Time Slot</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {scheduleClass &&
//                         scheduleClass?.length > 0 &&
//                         scheduleClass.map((data, index) => (
//                           <tr>
//                             <td>{capitalizeFirstLetter(data?.course)}</td>
//                             <td>{capitalizeFirstLetter(data?.semester)}</td>
//                             <td>{capitalizeFirstLetter(data?.subject)}</td>
//                             <td>{capitalizeFirstLetter(data?.classroom)}</td>
//                             <td className="text-success">
//                               {capitalizeFirstLetter(data?.timeSlot)}
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-12 d-flex justify-content-center">
//               <div className="card w-100">
//                 <div className="card-body">
//                   <div className="card-title">Upcoming Exams</div>
//                   <div className="d-flex justify-content-center">
//                     <div className="table-responsive">
//                       <table className="table text-center">
//                         <thead>
//                           <tr>
//                             <th scope="col">Course</th>
//                             <th scope="col">Semester</th>
//                             <th scope="col">Subject</th>
//                             <th scope="col">Paper Code</th>
//                             <th scope="col">Exam Type</th>
//                             <th scope="col">Exam Date</th>
//                             <th scope="col">Start Time</th>
//                             <th scope="col">End Time</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {upcomingExamList?.length > 0 ? (
//                             upcomingExamList.map((data, index) => (
//                               <tr key={index}>
//                                 <td>{capitalizeFirstLetter(data?.course)}</td>
//                                 <td>{capitalizeFirstLetter(data?.semester)}</td>
//                                 <td>{capitalizeFirstLetter(data?.subject)}</td>
//                                 <td>{capitalizeAllLetters(data?.paperCode)}</td>
//                                 <td>{capitalizeFirstLetter(data?.examType)}</td>
//                                 <td>{data?.exam_date}</td>
//                                 <td>{data?.startTime}</td>
//                                 <td>{data?.endTime}</td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="8">No upcoming exams available</td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-12 d-flex justify-content-center">
//               <div className="card w-100">
//                 <div className="card-body">
//                   <div className="card-title">Pending Assignment</div>
//                   <div className="d-flex justify-content-center">
//                     <div className="table-responsive">
//                       <table className="table text-center">
//                         <thead>
//                           <tr>
//                             <th scope="col">Course</th>
//                             <th scope="col">Semester</th>
//                             <th scope="col">Subject</th>
//                             <th scope="col">Assignment</th>
//                             <th scope="col">Student</th>
//                             <th scope="col">Evaluate</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {pendingAssignment?.length > 0 ? (
//                             pendingAssignment.map((data, index) => (
//                               <tr>
//                                 <td>{capitalizeFirstLetter(data?.course)}</td>
//                                 <td>{capitalizeFirstLetter(data?.semester)}</td>
//                                 <td>{capitalizeFirstLetter(data?.subject)}</td>
//                                 <td>
//                                   {capitalizeFirstLetter(data?.assignment)}
//                                 </td>
//                                 <td>{capitalizeFirstLetter(data?.student)}</td>
//                                 <td className="text-success">
//                                   <Link
//                                     to={`/admin/assignment-response-view/${data.id}`}
//                                     className="avatar avatar-icon avatar-md avatar-orange"
//                                   >
//                                     <i className="fas fa-eye"></i>
//                                   </Link>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="8">No pending assignment</td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-12">
//               <div className="card ">
//                 <div className="card-body ">
//                   <div className="card-title">Today Attendance</div>
//                   <div className="row ml-1">
//                     {" "}
//                     {selfSubjectDailyAttendance &&
//                       selfSubjectDailyAttendance?.length > 0 &&
//                       selfSubjectDailyAttendance.map((data, index) => (
//                         <div className="col-md-6 p-2" key={index}>
//                           <div className="row">
//                             <div
//                               className=" col-4 "
//                               style={{
//                                 backgroundColor: "",
//                                 fontSize: "1em",
//                                 borderRadius: "5px",
//                               }}
//                             >
//                               <p className="m-0 text-dark">
//                                 {capitalizeFirstLetter(data?.subject)}
//                               </p>
//                               <p className="m-0 text-dark">
//                                 {capitalizeFirstLetter(data?.course)}
//                               </p>
//                               <p className="m-0 text-dark">
//                                 {capitalizeFirstLetter(data?.semester)}
//                               </p>
//                             </div>
//                             <div
//                               className=" col-4 p-1"
//                               style={{
//                                 backgroundColor: "",
//                                 fontSize: "1em",
//                                 borderRadius: "5px",
//                               }}
//                             >
//                               <p className="m-0 text-success">
//                                 <label className="">Total Present </label>{" "}
//                                 {data?.present_count || 0}
//                               </p>

//                               <p className="m-0 text-warning">
//                                 <label className="">Total OnDuty </label>{" "}
//                                 {data?.total_onduty || 0}
//                               </p>

//                               <p className="m-0 text-danger">
//                                 <label className="">Total Absent </label>{" "}
//                                 {data?.total_absent || 0}
//                               </p>
//                             </div>
//                             <div className="col-4">
//                               <PieChart
//                                 dataValues={[
//                                   data?.present_count ?? 0,
//                                   data?.total_onduty ?? 0,
//                                   data?.total_absent ?? 0,
//                                 ]}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FacultyDashboard;
