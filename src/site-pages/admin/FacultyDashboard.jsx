import React, { useEffect, useMemo, useState } from "react";
import {
  capitalizeAllLetters,
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
} from "../../site-components/Helper/HelperFunction";
import { Pie } from "react-chartjs-2"; // Import Line chart component from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Select from "react-select";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import bg from "./dashboard-img/bg.webp";
import banners2 from "../../site-components/admin/assets/images/dashboard/shape-02.png";
import banners4 from "../../site-components/admin/assets/images/dashboard/shape-04.png";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";
import { facultyData } from "../../site-components/admin/FetchFacultyLoginData";
import { FaCalendar } from "react-icons/fa";
import subjectpng from "./dashboard-img/subject.png";
import coursepng from "./dashboard-img/coursepng.png";
import exampng from "./dashboard-img/exampng.png";
import validator from "validator";
import { toast } from "react-toastify";
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
  const [facultyListing, setFacultyListing] = useState([]);
  const [facultyId, setFacultyId] = useState(
    
  );
  const loadFacultyData = async () => {
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
      setFacultyListing(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };
  useEffect(() => {
    getAdminDashboardData();
  }, [facultyId]);

  const [scheduleClass, setScheduleClass] = useState([]);
  const [upcomingExamList, setUpcomingExamList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [pendingAssignment, setPendingAssignment] = useState([]);
  const [productIssued, setProductIssued] = useState([]);
  const [selfSubjectDailyAttendance, setSelfSubjectDailyAttendance] = useState(
    []
  );
  const getAdminDashboardData = async (year = null) => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("session", localStorage.getItem("session"));
      bformData.append("data", "faculty_dashboard");
      if (facultyId) {
        bformData.append("faculty_id", facultyId);
      }
      bformData.append("year", year || currentYear);
      const response = await axios.post(
        `${PHP_API_URL}/dashboard.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setScheduleClass(response.data.data?.today_schedule);
      setUpcomingExamList(response?.data?.data?.upcomingExam);
      setSubjectList(response?.data?.data?.facultysubjects);
      setPendingAssignment(response?.data?.data?.pendingAssignment);
      setProductIssued(response?.data?.data?.inventoryIssue);
     
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
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formattedTime = today.toLocaleTimeString("en-US", timeOptions);
      // Combine Date & Time
      setCurrentDate(`${formattedDate}, ${formattedTime}`);
    };
    updateGreeting();
    updateDate(); // Initial call
    const interval = setInterval(updateDate, 1000); // Updates every second
    return () => clearInterval(interval);
  }, []);
  const [facultyDataList, setFacultyDataList] = useState([]);
  const login_id = secureLocalStorage.getItem("login_id");
  const ftchFac = async (dbId) => {
    const resp = await facultyData(dbId);
    setFacultyDataList(resp);
  };
  useEffect(() => {
    ftchFac(login_id);
  }, [login_id]);
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    const tempGroupedData = [];

    subjectList.forEach(({ course, semester, subject }) => {
      let courseObj = tempGroupedData.find(
        (item) => item.courseName === course
      );

      if (!courseObj) {
        courseObj = { courseName: course, semester: [] };
        tempGroupedData.push(courseObj);
      }

      let semesterObj = courseObj.semester.find(
        (item) => item.semester === semester
      );

      if (!semesterObj) {
        semesterObj = { semester, subjects: [] };
        courseObj.semester.push(semesterObj);
      }

      semesterObj.subjects.push(subject);
    });

    setGroupedData(tempGroupedData); // Update state properly
  }, [subjectList]); // Only dependent on subjectList, not groupedData
  const groupAttendanceData = (attendanceList) => {
    const groupedData = [];

    attendanceList.forEach(
      ({
        course,
        semester,
        subject,
        total_students,
        present_count,
        total_onduty,
        total_absent,
      }) => {
        let courseObj = groupedData.find((item) => item.courseName === course);

        if (!courseObj) {
          courseObj = { courseName: course, semesters: [] };
          groupedData.push(courseObj);
        }

        let semesterObj = courseObj.semesters.find(
          (item) => item.semester === semester
        );

        if (!semesterObj) {
          semesterObj = { semester, subjects: [] };
          courseObj.semesters.push(semesterObj);
        }

        semesterObj.subjects.push({
          subject,
          total_students,
          present_count,
          total_onduty,
          total_absent,
        });
      }
    );

    return groupedData;
  };
  const groupedAttendance = useMemo(
    () => groupAttendanceData(selfSubjectDailyAttendance),
    [selfSubjectDailyAttendance]
  );
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    whiteSpace: "nowrap",
    overflow: "hidden",
    width: "100%",
    minHeight: "335px",
  };

  const boxStyle = {
    animation: "marquee 10s linear infinite",
    fontSize: "15px",
    color: "#111111",
    // borderBottom: "1px solid #555",
    marginBottom: "10px",
    background: "rgb(17 112 228 / 5%)",
    padding: "13px",
  };
  const quantityStyle = {
    background: "rgb(39 76 119)",
    color:"white",
    padding:"2px 5px",
    borderRadius:"5px",
    fontSize:"13px",
    fontWeight:"800"
   
  };

  const keyframesStyle = `
    @keyframes marquee {
      0% {
        transform: translateY(320%);
      }
      100% {
        transform: translateY(-100%);
      }
    }
  `;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  );
  useEffect(() => {
    getAdminDashboardData(selectedYear); // Fetch product data based on selected year
  }, [selectedYear]);
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 mb-3">
              <h5 className="h6_new">Faculty Dashboard</h5>
            </div>
            <div className="col-md-4 mb-3">
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
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="text-white py-4 px-3 mb-3 border_10"
                    style={{ background: "#274C77", overflow: "hidden" }}
                  >
                    <div
                      className="banneradmins"
                      style={{
                        backgroundImage: `url(${bg})`,
                        backgroundPosition: "right center",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div>
                        <div className="banerheadings mt-3 h5_new font-18">
                          <span className="text-white">
                            Hello, {facultyDataList?.first_name}{" "}
                            {facultyDataList?.middle_name}{" "}
                            {facultyDataList?.last_name}
                          </span>
                        </div>
                        <div className="h6_new font-15 mt-2">
                          <span className="text-white">{greeting}!</span>
                        </div>
                        <div className="mt-2 font-14">
                          <FaCalendar /> {currentDate}
                        </div>
                      </div>
                    </div>
                    <img
                      src={banners2}
                      alt="icon"
                      width="50"
                      height="70"
                      className="img-fluid shape-02"
                    />
                    <img
                      src={banners4}
                      alt="icon"
                      width="25"
                      height="25"
                      className="img-fluid shape-04"
                    />
                  </div>
                </div>
                <div className="col-md-5 px-0">
                  <div className="col-md-12 col-lg-12 col-sm-12 col-12">
                    <div className="card" style={{ background: "#f0bd37" }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p className="m-b-0 text-white font-14 font-weight-semibold">
                              Assigned Subjects
                            </p>
                            <h6 className="m-b-0 h6_new">
                              <span className="text-white">
                                {subjectList?.length}
                              </span>
                            </h6>
                          </div>
                          <div
                            className="avatar avatar-lg avatar-image p-2"
                            style={{ background: "#fff" }}
                          >
                            <img src={subjectpng} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-12 col-sm-12 col-12">
                    <div className="card" style={{ background: "#9084c2" }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p className="m-b-0 text-white font-14 font-weight-semibold">
                              Scheduled Classes
                            </p>
                            <h6 className="m-b-0 h6_new">
                              <span className="text-white">
                                {scheduleClass?.length}
                              </span>
                            </h6>
                          </div>
                          <div
                            className="avatar avatar-lg avatar-image p-2"
                            style={{ background: "#fff" }}
                          >
                            <img src={coursepng} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-12 col-sm-12 col-12">
                    <div className="card" style={{ background: "#CD417E" }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p className="m-b-0 text-white font-14 font-weight-semibold">
                              Upcoming Exams
                            </p>
                            <h6 className="m-b-0 h6_new">
                              <span className="text-white">
                                {upcomingExamList?.length}
                              </span>
                            </h6>
                          </div>
                          <div
                            className="avatar avatar-lg avatar-image p-2"
                            style={{ background: "#fff" }}
                          >
                            <img src={exampng} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-12 col-sm-12 col-12">
                    <div className="card" style={{ background: "#6096BA" }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p className="m-b-0 text-white font-14 font-weight-semibold">
                              Pending Assignments
                            </p>
                            <h6 className="m-b-0 h6_new">
                              <span className="text-white">
                                {pendingAssignment?.length}
                              </span>
                            </h6>
                          </div>
                          <div
                            className="avatar avatar-lg avatar-image p-2"
                            style={{ background: "#fff" }}
                          >
                            <img src={exampng} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div
                    className="card"
                    style={{ height: "450px", overflowY: "auto" }}
                  >
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title h6_new">
                        Inventory: Product Issued
                      </h5>
                      <select
                        className="selectpicker form-control"
                        id="yearPicker"
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(Number(e.target.value))
                        }
                        style={{ width: "auto" }}
                      >
                        {availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="card-body ">
                      <style>{keyframesStyle}</style>
                      <div style={containerStyle}>
                        {productIssued &&
                          productIssued.map((product, index) => (
                            <>
                              <div style={boxStyle} className="rounded">
                                <p className="text-danger mb-0 font-14">
                                  {formatDate(product?.stockOutDate)}
                                </p>
                                <h4 className="font-15 mb-0">
                                  {product?.pname
                                    ? validator.unescape(product?.pname)
                                    : ""}
                                </h4>
                                <div className="d-flex justify-content-between mb-0">
                                <p className="font-15 mb-0">
                               <span className="text-dark">Brand: </span>  <span className="id-product-brand" style={{background: "#6096ba",
    padding:"0px 5px",
    borderRadius: "2px",
    color: "white",}}>{product?.pbrand
                                    ? validator.unescape(product?.pbrand)
                                    : ""} </span>
                                </p>
                                <p className="font-15 mb-0">
                                 <span className="text-dark">Code: </span> 
                                  {product?.pcode
                                    ? product?.pcode
                                    : ""}
                                </p>

                                </div>
                               
                                <div className="d-flex justify-content-between mb-0">
                                   <p className="mb-0">
                                   <span className="text-dark">Unit: </span>{product?.punit
                                    ? product?.punit
                                    : ""}
                                    
                                    </p>

                                    <p className="mb-0">

                                     <span className="text-dark"> Quantity: </span><span style={quantityStyle}>{product?.quantity
                                    ? product?.quantity
                                    : ""} </span>
                                       </p> 
                                    
                                     </div>
                                
                              </div>
                            </>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4">
              <div
                className="card"
                style={{ height: "600px", overflowY: "auto" }}
              >
                <div className="card-header">
                  <h5 className="card-title h6_new">Assigned Subject</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {groupedData &&
                      groupedData?.length > 0 &&
                      groupedData.map((data, index) => (
                        <>
                          <div className="col-md-12" key={index}>
                            <div className="list-group list-group-flush">
                              <div className="list-group-item p-0">
                                <h6 className="h6_new mb-1 font-16 border-bottom">
                                  {data?.courseName}
                                </h6>
                                <p className="mb-0">
                                  {data.semester.map(
                                    (semester, semesterIndex) => (
                                      <div
                                        key={semesterIndex}
                                        className="d-flex"
                                      >
                                        <div className="font-14 mr-2">
                                          {capitalizeAllLetters(
                                            semester?.semester
                                          )}
                                        </div>
                                        <div>
                                          {semester.subjects.map(
                                            (subject, subjectIndex) => (
                                              <strong
                                                key={subjectIndex}
                                                className="text-primary font-14 mr-2"
                                              >
                                                {subjectIndex + 1}. {subject}
                                                <br />
                                              </strong>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-title h6_new">Scheduled Classes</div>
                </div>
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Semester</th>
                        <th>Subject</th>
                        <th>Class Room</th>
                        <th>Time Slot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleClass &&
                        scheduleClass?.length > 0 &&
                        scheduleClass.map((data, index) => (
                          <tr key={index}>
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
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-title h6_new">Today Attendance</div>
                </div>
                <div className="card-body">
                  <div className="row">
                    {groupedAttendance &&
                      groupedAttendance?.length > 0 &&
                      groupedAttendance.map((data, index) => (
                        <div className="col-md-12" key={index}>
                          <div className="row">
                            <div className="col-12">
                              <div
                                className="list-group list-group-flush px-3 py-3 border_10"
                                style={{ border: "1px solid #b82650" }}
                              >
                                <div className="list-group-item p-0">
                                  <h6 className="h6_new mb-1 font-16 border-bottom">
                                    {data?.courseName}
                                  </h6>
                                  {data.semesters.map(
                                    (semester, semesterIndex) => (
                                      <div key={semesterIndex}>
                                        <h6 className="font-14 text-primary mr-2">
                                          {capitalizeAllLetters(
                                            semester?.semester
                                          )}
                                        </h6>
                                        <div className="row">
                                          {semester.subjects.map(
                                            (subject, subjectIndex) => (
                                              <div
                                                key={subjectIndex}
                                                className="col-md-3"
                                              >
                                                <div className="card bg_light">
                                                  <div className="card-header">
                                                    <h6 className="my-1 h6_new font-14 mb-0">
                                                      {subject?.subject}
                                                    </h6>
                                                    <p>
                                                      Total Student:{" "}
                                                      {subject?.total_students}
                                                    </p>
                                                    <p
                                                      className="mb-0"
                                                      style={{
                                                        color: "#63BE17",
                                                      }}
                                                    >
                                                      Present:{" "}
                                                      {subject?.present_count}
                                                    </p>
                                                    <p
                                                      className="mb-0"
                                                      style={{
                                                        color: "#CD417E",
                                                      }}
                                                    >
                                                      Absent:{" "}
                                                      {subject?.total_absent}
                                                    </p>
                                                    <p
                                                      className="mb-0"
                                                      style={{
                                                        color: "#E3A723",
                                                      }}
                                                    >
                                                      On Duty:{" "}
                                                      {subject?.total_onduty}
                                                    </p>
                                                  </div>
                                                  <div className="card-body">
                                                    <PieChart
                                                      dataValues={[
                                                        subject?.present_count ||
                                                          0,
                                                        subject?.total_onduty ||
                                                          0,
                                                        subject?.total_absent ||
                                                          0,
                                                      ]}
                                                      dataColors={[
                                                        "#63BE17", // Present
                                                        "#CD417E", // Absent
                                                        "#E3A723", // On Duty
                                                      ]}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-title h6_new">Pending Assignment</div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-center">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Course</th>
                            <th>Semester</th>
                            <th>Subject</th>
                            <th>Assignment</th>
                            <th>Student</th>
                            <th>Evaluate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingAssignment?.length > 0 ? (
                            pendingAssignment.map((data, index) => (
                              <tr key={index}>
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
              <div className="card">
                <div className="card-header">
                  <div className="card-title h6_new">Upcoming Exams</div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-center">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Course</th>
                            <th>Semester</th>
                            <th>Subject</th>
                            <th>Paper Code</th>
                            <th>Exam Type</th>
                            <th>Exam Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingExamList?.length > 0 ? (
                            upcomingExamList.map((data, index) => (
                              <tr key={index}>
                                <td>{capitalizeFirstLetter(data?.course)}</td>
                                <td>{capitalizeFirstLetter(data?.semester)}</td>
                                <td>
                                  {capitalizeFirstLetter(
                                    data?.subject
                                      ? validator.unescape(data?.subject)
                                      : ""
                                  )}
                                </td>
                                <td>
                                  {capitalizeAllLetters(
                                    data?.paperCode
                                      ? validator.unescape(data?.paperCode)
                                      : ""
                                  )}
                                </td>
                                <td>
                                  {capitalizeFirstLetter(
                                    data?.examType
                                      ? validator.unescape(data?.examType)
                                      : ""
                                  )}
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
                          )}
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
    </div>
  );
};
export default FacultyDashboard;
