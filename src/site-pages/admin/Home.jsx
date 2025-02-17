import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate
} from "../../site-components/Helper/HelperFunction";
import validator from 'validator';
import { Line } from "react-chartjs-2"; // Import Line chart component from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { MdEventAvailable } from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";

import banners1 from "../../site-components/admin/assets/images/dashboard/shape-01.png";
import banners2 from "../../site-components/admin/assets/images/dashboard/shape-02.png";
import banners4 from "../../site-components/admin/assets/images/dashboard/shape-04.png";
import { facultyData } from "../../site-components/admin/FetchFacultyLoginData";
import { FaCalendar } from "react-icons/fa";
// Register necessary components for Chart.js
import studentImg from "./dashboard-img/student.png";
import courseImg from "./dashboard-img/course.png";
import employeeImg from "./dashboard-img/employee.png";
import product from "./dashboard-img/product.png";
import stockout from "./dashboard-img/stockout.png";
import stockin from "./dashboard-img/stockin.png";
import attendance from "./dashboard-img/attendance.png";
import bg from "./dashboard-img/bg.webp";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
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
  const [visitorData, setVisitorData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("notice");
  const fetchVisitorCounting = async (selectedYear) => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/visitor-website/fetch`,
        { year: selectedYear }
      );

      if (response?.statusCode === 200 && response.data.length > 0) {
        setVisitorData(response.data);
      } else {
        toast.error("Data not found.");
        setVisitorData([]);
      }
    } catch (error) {
      setVisitorData([]);
    } finally {
      setIsFetching(false);
    }
  };

  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const visitorCounts = allMonths.map(() => 0);
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  );
  visitorData.forEach((item) => {
    const monthIndex = item.month - 1;
    visitorCounts[monthIndex] = item.unique_visitors;
  });
  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: "Monthly Analysis",
        data: visitorCounts,
        borderColor: "#CD417E",
        backgroundColor: "#FBECF3",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Visitor",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  useEffect(() => {
    fetchVisitorCounting(selectedYear);
  }, []);
  useEffect(() => {
    fetchVisitorCounting(selectedYear);
  }, [selectedYear]);
  const getAdminDashboardData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("session", localStorage.getItem("session"));
      bformData.append("data", "home_dashboard");
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
    } catch (error) {
    }
  };
  useEffect(() => {
    getAdminDashboardData();
  }, []);

  const [activeCategory, setActiveCategory] = useState("notice"); // Track active tab for accordion behavior



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
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-3">
            <div className="admintext">Admin Dashboard</div>
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash">
                <a href="./" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>
                <span className="breadcrumb-item active">Home</span>
              </nav>
            </div>
          </div>
          <div className="px-3">
            <div className="row">
              <div className="bg-dark" style={{ color: "white", padding: "20px" }}>
                <div className="banneradmins">
                  <div>
                    <div className="banerheadings"
                      style={{

                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontWeight: "700"
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


          <div className="row mt-3 mb-1">
            {/* Total Students */}
            <div className="col-md-3 col-lg-3 col-12 ">
              <div className="card id-card gradient-card1 animate-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={StudentImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <div className="titleboxes">Total Students</div>
                    <h5 className="id-counter-number">{data.total_students}</h5>
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
                    <h4 className="titleboxes">Total Courses</h4>
                    <h5 className="id-counter-number">{data.totalCourse}</h5>
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
                    <h4 className="titleboxes">Total Employee</h4>
                    <h5 className="id-counter-number">{data.totalFaculty}</h5>
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
                    <h4 className="titleboxes">Total Roles</h4>
                    <h5 className="id-counter-number">{data.totalRoles}</h5>
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
            <div className="col-md-6">
              <div className="card equalhight">
                <div className="card-body">
                  <div className="card-title">Monthly Visitor Analytics</div>
                  <form action="" id="form2">
                    <div className="mb-3 d-flex align-items-center">
                      <label className="form-label mr-2" style={{ width: "auto" }}>
                        Select Year
                      </label>
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
                  </form>
                  {visitorData.length > 0 && !isFetching ? (
                    <Line data={chartData} options={options} />
                  ) : data.length === 0 && !isFetching ? (
                    <div className="text-center text-danger">
                      Data is not available for year {selectedYear}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Spinner animation="border" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-8 col-lg-8 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-title h6_new">Announcements</div>
                </div>
                <div className="card-body">
                  <div className="w-full py-0">
                    <div className="d-flex border-bottom">
                      {["notice", "event", "publication"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`fs-5 fw-bold pb-2 px-4 text-start transition-all duration-300 rounded-3 ${activeTab === tab
                            ? "text-custom-actives border-b-4 border-blue-500"
                            : "text-muted hover:text-primary"
                            }`}
                          style={{
                            cursor: "pointer",
                            background: "transparent",
                            outline: "none",
                            border: "none",
                            borderBottom:
                              activeTab === tab ? "3px solid #007BFF" : "none",
                          }}
                        >
                          {capitalizeFirstLetter(tab == 'notice' ? "News" : tab)}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 marquee-container">
                      <div className="marquee-box">
                        {activeTab === "notice" &&
                          data?.LatestNotice?.map((item, index) => (
                            <div key={index} className="mb-2">
                              <Link to={`/notice-details/${item.id}`} target="_blank">
                                <div className="border-bottom">
                                  <p className="mb-1 font-14" style={{ color: '#D64D89' }}>
                                    {formatDate(item?.notice_date)}
                                  </p>
                                  <h6 className="h6_new font-14">
                                    {capitalizeFirstLetter(validator.unescape(item?.title))}
                                  </h6>
                                </div>
                              </Link>
                            </div>
                          ))}

                        {activeTab === "event" &&
                          data?.LatestEvent?.map((item, index) => (
                            <div key={index} className="mb-2">
                              <Link to={`/notice-details/${item.id}`} target="_blank">
                                <div className="border-bottom">
                                  <p className="mb-1 font-14" style={{ color: '#D64D89' }}>
                                    {formatDate(item?.notice_date)}
                                  </p>
                                  <h6 className="h6_new font-14">
                                    {capitalizeFirstLetter(validator.unescape(item?.title))}
                                  </h6>
                                </div>
                              </Link>
                            </div>
                          ))}

                        {activeTab === "publication" &&
                          data?.LatestPublication?.map((item, index) => (
                            <div key={index} className="mb-2">
                              <Link to={`/notice-details/${item.id}`} target="_blank">
                                <div className="border-bottom">
                                  <p className="mb-1 font-14" style={{ color: '#D64D89' }}>
                                    {formatDate(item?.notice_date)}
                                  </p>
                                  <h6 className="h6_new font-14">
                                    {capitalizeFirstLetter(validator.unescape(item?.title))}
                                  </h6>
                                </div>
                              </Link>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title h6_new">Quick Links</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <Link to={'/admin/inventory/product/add-stock'} target="_blank">
                        <div className="card" style={{ background: '#ffe7d3 ' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-center flex-column">
                              <div className="rounded-circle p-1" style={{ border: '1px solid #ffd5aa' }}>
                                <div className="avatar avatar-lg avatar-image p-2" style={{ background: '#ffd5aa' }}>
                                  <img src={attendance} />
                                </div>
                              </div>
                              <h6 className="m-b-0 h6_new font-14 mt-2" style={{ whiteSpace: 'nowrap' }}>Mark Attendance</h6>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <Link to={'/admin/inventory/product'} target="_blank">
                        <div className="card" style={{ background: '#b6c93124' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-center flex-column">
                              <div className="rounded-circle p-1" style={{ border: '1px solid #b6c931' }}>
                                <div className="avatar avatar-lg avatar-image p-2" style={{ background: '#b6c931' }}>
                                  <img src={product} />
                                </div>
                              </div>
                              <h6 className="m-b-0 h6_new font-14 mt-2" style={{ whiteSpace: 'nowrap' }}>Inventory Product</h6>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <Link to={'/admin/inventory/product/add-stock'} target="_blank">
                        <div className="card" style={{ background: '#dcd3ff ' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-center flex-column">
                              <div className="rounded-circle p-1" style={{ border: '1px solid #b7aaff' }}>
                                <div className="avatar avatar-lg avatar-image p-2" style={{ background: '#b7aaff' }}>
                                  <img src={stockin} />
                                </div>
                              </div>
                              <h6 className="m-b-0 h6_new font-14 mt-2" style={{ whiteSpace: 'nowrap' }}>Stock In</h6>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <Link to={'/admin/inventory/product/add-stock'} target="_blank">
                        <div className="card" style={{ background: '#ffe7d3 ' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-center flex-column">
                              <div className="rounded-circle p-1" style={{ border: '1px solid #ffd5aa' }}>
                                <div className="avatar avatar-lg avatar-image p-2" style={{ background: '#ffd5aa' }}>
                                  <img src={stockout} />
                                </div>
                              </div>
                              <h6 className="m-b-0 h6_new font-14 mt-2" style={{ whiteSpace: 'nowrap' }}>Stock Out</h6>
                            </div>
                          </div>
                        </div>
                      </Link>
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

export default Home;
