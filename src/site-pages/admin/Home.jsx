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
import { FaAngleRight } from "react-icons/fa6";
import { MdEventAvailable } from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";

import banners1 from "../../site-components/admin/assets/images/dashboard/shape-01.png";
import banners2 from "../../site-components/admin/assets/images/dashboard/shape-02.png";
import banners3 from "../../site-components/admin/assets/images/dashboard/shape-03.png";
import banners4 from "../../site-components/admin/assets/images/dashboard/shape-04.png";
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
  const [activeTab, setActiveTab] = useState("notice");
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

  const stats = [
    { title: "Total Students", color: "#ffe6ef", img: "student", counter: 3654 },
    { title: "Total Teachers", color: "#e8f7fc", img: "teacher", counter: 200 },
    { title: "Total Staff", color: "#fef8e8", img: "staff", counter: 150 },
    { title: "Total Subjects", color: "#eef4f0", img: "subject", counter: 50 },
  ];

  // State to track counter values
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((item, index) => {
      let count = 0;
      return setInterval(() => {
        if (count >= item.counter) {
          clearInterval(intervals[index]);
          return;
        }
        count += Math.ceil(item.counter / 50); // Adjust speed
        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = count;
          return newCounters;
        });
      }, 20); // Speed of counting
    });

    return () => intervals.forEach(clearInterval);
  }, []);

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
              <div className="card announcement">
                <div className="card-body cardspacingzzwqx">
                  <div className="card-title">Announcements</div>


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
                          {capitalizeFirstLetter(tab)}
                        </button>
                      ))}
                    </div>


                    <div className="mt-4 marquee-container">
                      <div className="marquee-box">
                        {activeTab === "notice" &&
                          data?.LatestNotice?.map((item, index) => (
                            <div key={index} className="mb-3">
                              <div className=" shadows rounded-lg overflow-hidden">
                                <div className="card-body p-2 ">
                                  <p className="text-sm text-gray-500 mb-2">
                                    {formatDate(item?.notice_date)}
                                  </p>
                                  <h5 className="text-lg font-semibold text-gray-800 mb-2">
                                    {capitalizeFirstLetter(validator.unescape(item?.title))}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          ))}

                        {activeTab === "event" &&
                          data?.LatestEvent?.map((item, index) => (
                            <div key={index} className="mb-3">
                              <div className=" shadows rounded-lg overflow-hidden">
                                <div className="card-body p-3 ">
                                  <p className="text-sm text-gray-500 mb-2">
                                    {formatDate(item?.notice_date)}
                                  </p>
                                  <h5 className="text-lg font-semibold text-gray-800 mb-2">
                                    {capitalizeFirstLetter(validator.unescape(item?.title))}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          ))}

                        {activeTab === "publication" &&
                          data?.LatestPublication?.map((item, index) => (
                            <div key={index} className="mb-3">
                              <div className="shadows rounded-lg overflow-hidden">
                                <div className="card-body p-2 ">
                                  <p className="text-sm text-gray-500 mb-2">
                                    {formatDate(item?.notice_date)}
                                  </p>
                                  <h5 className="text-lg font-semibold text-gray-800 mb-2">
                                    {capitalizeFirstLetter(validator.unescape(item?.title))}
                                  </h5>
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
      </div>
    </div>
  );
};

export default Home;


// import React, { useEffect, useState } from "react";
// import { NODE_API_URL } from "../../site-components/Helper/Constant";
// import { toast } from "react-toastify";
// import {
//   capitalizeFirstLetter,
//   dataFetchingPost,
//   formatDate,
// } from "../../site-components/Helper/HelperFunction";
// import { Line } from "react-chartjs-2"; // Import Line chart component from react-chartjs-2
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { Spinner } from "react-bootstrap";
// import validator from "validator";
// import { Link } from "react-router-dom";
// import { PHP_API_URL } from "../../site-components/Helper/Constant";
// import secureLocalStorage from "react-secure-storage";
// import axios from "axios";
// import StudentImg from "../../site-components/admin/assets/images/dashboard/student-1.png";
// import StudentImg2 from "../../site-components/admin/assets/images/dashboard/student-2.png";
// import CourseImg from "../../site-components/admin/assets/images/dashboard/course.png";

// import RolesImg2 from "../../site-components/admin/assets/images/dashboard/roles-2.png";
// import FacultyImg from "../../site-components/admin/assets/images/dashboard/faculty.png";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
// import { useNavigate } from "react-router-dom";
// // Register necessary components for Chart.js
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Home = () => {
//   //   const [session, setSession] = useState(); // Session data: the fuel for exams.
//   const [data, setData] = useState([]);
// const navigate = useNavigate();
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
//   const [visitorData, setVisitorData] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const fetchVisitorCounting = async (selectedYear) => {
//     setIsFetching(true);
//     try {
//       const response = await dataFetchingPost(
//         `${NODE_API_URL}/api/visitor-website/fetch`,
//         { year: selectedYear }
//       );
//       console.log(response);
//       if (response?.statusCode === 200 && response.data.length > 0) {
//         setVisitorData(response.data);
//       } else {
//         toast.error("Data not found.");
//         setVisitorData([]);
//       }
//     } catch (error) {
//       setVisitorData([]);
//       const statusCode = error.response?.data?.statusCode;
//       if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
//         toast.error(error.response.message || "A server error occurred.");
//       } else {
//         toast.error(
//           "An error occurred. Please check your connection or try again."
//         );
//       }
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   const allMonths = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const visitorCounts = allMonths.map(() => 0);

//   const currentYear = new Date().getFullYear();
//   const availableYears = Array.from(
//     { length: 10 },
//     (_, index) => currentYear - index
//   );

//   visitorData.forEach((item) => {
//     const monthIndex = item.month - 1;
//     visitorCounts[monthIndex] = item.unique_visitors;
//   });

//   const chartData = {
//     labels: allMonths,
//     datasets: [
//       {
//         label: "Monthly Analysis",
//         data: visitorCounts,
//         borderColor: "rgb(75, 192, 192)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Number of Visitor",
//           font: {
//             size: 15,
//             weight: "bold",
//           },
//         },
//       },
//     },
//   };

//   useEffect(() => {
//     fetchVisitorCounting(selectedYear);
//   }, []);
//   useEffect(() => {
//     fetchVisitorCounting(selectedYear);
//   }, [selectedYear]);

//   const getAdminDashboardData = async () => {
//     try {
//       const bformData = new FormData();
//       bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
//       bformData.append("login_type", secureLocalStorage.getItem("loginType"));
//       bformData.append("session", localStorage.getItem("session"));
//       bformData.append("data", "home_dashboard");
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
//       console.log(response.data.data);
//     } catch (error) {
//       console.error("Error fetching admin Dashboard data:", error);
//     }
//   };

//   useEffect(() => {
//     getAdminDashboardData();
//     // sessionListDropdown(); // Fetch session list
//   }, []);

//   const [activeCategory, setActiveCategory] = useState("notice"); // Track active tab for accordion behavior

//   return (
//     <div className="page-container">
//       <div className="main-content">
//         <div className="container-fluid">
//         <div className="page-header mb-3">
//             <div className="admintext">Admin Dashboard</div>
//             <div className="header-sub-title">
//               <nav className="breadcrumb breadcrumb-dash">
//                 <a href="./" className="breadcrumb-item">
//                   <i className="fas fa-home m-r-5" /> Dashboard
//                 </a>
//                 <span className="breadcrumb-item active">Home</span>
//               </nav>
//             </div>
//           </div>
       
//           <div className="row">
//             <div className="col-md-3 col-lg-3 col-12">
//               <div className="card id-card">
//                 <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
//                   <span className="id-total-record-student">
//                     <img src={StudentImg} alt="student-img" />
//                   </span>
//                   <div className="id-total-record-content">
//                     <h4>Total Students</h4>
//                     <h5 className="id-counter-number">{data.total_students}</h5>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-lg-3 col-12">
//               <div className="card id-card">
//                 <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
//                   <span className="id-total-record-student">
//                     <img src={CourseImg} alt="student-img" />
//                   </span>
//                   <div className="id-total-record-content">
//                     <h4>Total Courses</h4>
//                     <h5 className="id-counter-number">{data.totalCourse}</h5>
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
//                     <h4>Total Employee</h4>
//                     <h5 className="id-counter-number">{data.totalFaculty}</h5>
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
//                     <h4>Total Roles</h4>
//                     <h5 className="id-counter-number">{data.totalRoles}</h5>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-md-6">
//               <div className="card">
//                 <div className="card-body">
//                   <div className="card-title">Monthly Visitor Analytics</div>
//                   <form action="" id="form2">
//                     <div class="mb-3 d-flex align-items-center">
//                       <label class="form-label mr-2" style={{ width: "auto" }}>
//                         Select Year
//                       </label>
//                       <select
//                         class="selectpicker form-control"
//                         id="yearPicker"
//                         value={selectedYear}
//                         onChange={(e) =>
//                           setSelectedYear(Number(e.target.value))
//                         }
//                         style={{ width: "auto" }}
//                       >
//                         {availableYears.map((year) => (
//                           <option key={year} value={year}>
//                             {year}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </form>
//                   {visitorData.length > 0 && !isFetching ? (
//                     <Line data={chartData} options={options} />
//                   ) : data.length === 0 && !isFetching ? (
//                     <div className="text-center text-danger">
//                       Data is not available for year {selectedYear}
//                     </div>
//                   ) : (
//                     <div className="text-center">
//                       <Spinner animation="border" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="card">
//                 <div className="card-body">
//                   <div className="card-title">Announcements</div>
//                   <Tabs
//                     selectedIndex={["notice", "event", "publication"].indexOf(
//                       activeCategory
//                     )}
//                     onSelect={(index) =>
//                       setActiveCategory(
//                         ["notice", "event", "publication"][index]
//                       )
//                     }
//                   >
//                     <TabList>
//                       {["notice", "event", "publication"].map(
//                         (category, index) => (
//                           <Tab key={index}>
//                             {capitalizeFirstLetter(category)}
//                           </Tab>
//                         )
//                       )}
//                     </TabList>

//                     <TabPanel>
//                       {data?.LatestNotice && data?.LatestNotice?.map((item, index) => (
//                         <div key={index}>
//                           <div className="card">
//                             <div className="card-body p-1">
//                               <Link to={`/notice-details/${item.id}`} target="_blank">
//                               <p className=" m-0">
//                                 {capitalizeFirstLetter(validator.unescape(item?.title))}
//                               </p>
//                               </Link>
//                               <p className="text-danger m-1">
//                                 {formatDate(item?.notice_date)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </TabPanel>

//                     <TabPanel>
//                       {data?.LatestEvent && data?.LatestEvent?.map((item, index) => (
//                         <div key={index}>
//                         <div className="card">
//                           <div className="card-body p-1">
//                           <Link to={`/notice-details/${item.id}`} target="_blank">
//                             <p className=" m-0">
//                               {capitalizeFirstLetter(validator.unescape(item?.title))}
//                             </p>
//                             </Link>
//                             <p className="text-danger m-1">
//                               {formatDate(item?.notice_date)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       ))}
//                     </TabPanel>

//                     <TabPanel>
//                       {data?.LatestPublication && data?.LatestPublication?.map((item, index) => (
//                         <div key={index}>
//                         <div className="card">
//                           <div className="card-body p-1">
//                           <Link to={`/notice-details/${item.id}`} target="_blank">
//                             <p className=" m-0">
//                               {capitalizeFirstLetter(validator.unescape(item?.title))}
//                             </p>
//                             </Link>
//                             <p className="text-danger m-1">
//                               {formatDate(item?.notice_date)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       ))}
//                     </TabPanel>
//                   </Tabs>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
