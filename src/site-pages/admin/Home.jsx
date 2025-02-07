import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
} from "../../site-components/Helper/HelperFunction";
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

import { Spinner } from "react-bootstrap";
import validator from "validator";
import { Link } from "react-router-dom";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import StudentImg from "../../site-components/admin/assets/images/dashboard/student-1.png";
import StudentImg2 from "../../site-components/admin/assets/images/dashboard/student-2.png";
import CourseImg from "../../site-components/admin/assets/images/dashboard/course.png";

import RolesImg2 from "../../site-components/admin/assets/images/dashboard/roles-2.png";
import FacultyImg from "../../site-components/admin/assets/images/dashboard/faculty.png";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router-dom";
// Register necessary components for Chart.js
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
  //   const [session, setSession] = useState(); // Session data: the fuel for exams.
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

  const fetchVisitorCounting = async (selectedYear) => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/visitor-website/fetch`,
        { year: selectedYear }
      );
      console.log(response);
      if (response?.statusCode === 200 && response.data.length > 0) {
        setVisitorData(response.data);
      } else {
        toast.error("Data not found.");
        setVisitorData([]);
      }
    } catch (error) {
      setVisitorData([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
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
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
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
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching admin Dashboard data:", error);
    }
  };

  useEffect(() => {
    getAdminDashboardData();
    // sessionListDropdown(); // Fetch session list
  }, []);

  const [activeCategory, setActiveCategory] = useState("notice"); // Track active tab for accordion behavior

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-3">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash">
                <a href="./" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>
                <span className="breadcrumb-item active">Home</span>
              </nav>
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
                    <img src={StudentImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4>Total Students</h4>
                    <h5 className="id-counter-number">{data.total_students}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-lg-3 col-12">
              <div className="card id-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={CourseImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4>Total Courses</h4>
                    <h5 className="id-counter-number">{data.totalCourse}</h5>
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
                    <h4>Total Employee</h4>
                    <h5 className="id-counter-number">{data.totalFaculty}</h5>
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
                    <h4>Total Roles</h4>
                    <h5 className="id-counter-number">{data.totalRoles}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="card-title">Monthly Visitor Analytics</div>
                  <form action="" id="form2">
                    <div class="mb-3 d-flex align-items-center">
                      <label class="form-label mr-2" style={{ width: "auto" }}>
                        Select Year
                      </label>
                      <select
                        class="selectpicker form-control"
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
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="card-title">Announcements</div>
                  <Tabs
                    selectedIndex={["notice", "event", "publication"].indexOf(
                      activeCategory
                    )}
                    onSelect={(index) =>
                      setActiveCategory(
                        ["notice", "event", "publication"][index]
                      )
                    }
                  >
                    <TabList>
                      {["notice", "event", "publication"].map(
                        (category, index) => (
                          <Tab key={index}>
                            {capitalizeFirstLetter(category)}
                          </Tab>
                        )
                      )}
                    </TabList>

                    <TabPanel>
                      {data?.LatestNotice && data?.LatestNotice?.map((item, index) => (
                        <div key={index}>
                          <div className="card">
                            <div className="card-body p-1">
                              <Link to={`/notice-details/${item.id}`} target="_blank">
                              <p className=" m-0">
                                {capitalizeFirstLetter(validator.unescape(item?.title))}
                              </p>
                              </Link>
                              <p className="text-danger m-1">
                                {formatDate(item?.notice_date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabPanel>

                    <TabPanel>
                      {data?.LatestEvent && data?.LatestEvent?.map((item, index) => (
                        <div key={index}>
                        <div className="card">
                          <div className="card-body p-1">
                          <Link to={`/notice-details/${item.id}`} target="_blank">
                            <p className=" m-0">
                              {capitalizeFirstLetter(validator.unescape(item?.title))}
                            </p>
                            </Link>
                            <p className="text-danger m-1">
                              {formatDate(item?.notice_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      ))}
                    </TabPanel>

                    <TabPanel>
                      {data?.LatestPublication && data?.LatestPublication?.map((item, index) => (
                        <div key={index}>
                        <div className="card">
                          <div className="card-body p-1">
                          <Link to={`/notice-details/${item.id}`} target="_blank">
                            <p className=" m-0">
                              {capitalizeFirstLetter(validator.unescape(item?.title))}
                            </p>
                            </Link>
                            <p className="text-danger m-1">
                              {formatDate(item?.notice_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      ))}
                    </TabPanel>
                  </Tabs>
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
