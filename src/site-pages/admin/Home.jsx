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
            size: 15,
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
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12">
                  <div className="text-white py-4 px-3 mb-3 border_10" style={{ background: '#274C77', overflow: 'hidden' }}>
                    <div className="banneradmins" style={{
                      backgroundImage: `url(${bg})`,
                      backgroundPosition: "right center",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat"
                    }}>
                      <div>
                        <div className="banerheadings mt-3 h5_new font-18">
                          <span className="text-white">Hello, {" "}
                            {facultyDataList?.first_name}{" "}
                            {facultyDataList?.middle_name}{" "}
                            {facultyDataList?.last_name}</span>
                        </div>
                        <div className="h6_new font-15 mt-2"><span className="text-white">{greeting}!</span></div>
                        <div className="mt-2 font-14"><FaCalendar /> {" "}{currentDate}</div>
                      </div>
                    </div>
                    <img src={banners2} alt="icon" width="50" height="70" className="img-fluid shape-02" />
                    <img src={banners4} alt="icon" width="25" height="25" className="img-fluid shape-04" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-4 col-lg-4 col-sm-6 col-12">
                      <Link to='/admin/student-management/student-list'>
                        <div className="card" style={{ background: '#7889DA' }}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <p className="m-b-0 text-white font-12 font-weight-semibold">Total Students</p>
                                <h6 className="m-b-0 h6_new"><span className="text-white">{data?.total_students}</span></h6>
                              </div>
                              <div className="avatar avatar-lg avatar-image p-2" style={{ background: '#fff' }}>
                                <img src={studentImg} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-6 col-12">
                      <Link to='/admin/course'>
                        <div className="card" style={{ background: '#21B6C8' }}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <p className="m-b-0 text-white font-12 font-weight-semibold">Total Courses</p>
                                <h6 className="m-b-0 h6_new"><span className="text-white">{data?.totalCourse}</span></h6>
                              </div>
                              <div className="avatar avatar-lg avatar-image p-2" style={{ background: '#fff' }}>
                                <img src={courseImg} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-6 col-12">
                      <Link to='/admin/faculty-list'>
                        <div className="card" style={{ background: '#E3A723' }}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <p className="m-b-0 text-white font-12 font-weight-semibold">Total Employee</p>
                                <h6 className="m-b-0 h6_new"><span className="text-white">{data?.totalFaculty}</span></h6>
                              </div>
                              <div className="avatar avatar-lg avatar-image p-2" style={{ background: '#fff' }}>
                                <img src={employeeImg} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title h6_new">Website Visitor</h5>
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
                <div className="card-body">
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
                            borderBottom: activeTab === tab ? "3px solid #007BFF" : "none",
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
                      <Link to={'/admin/student-management/mark-attendance'} target="_blank">
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
                      <Link to={'/admin/inventory/product/add-stockout'} target="_blank">
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