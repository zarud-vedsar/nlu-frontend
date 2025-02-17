import { React, useState, useEffect } from "react";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import StudentImg from "../../site-components/admin/assets/images/dashboard/student-1.png";
import StudentImg2 from "../../site-components/admin/assets/images/dashboard/student-2.png";
import CourseImg from "../../site-components/admin/assets/images/dashboard/course.png";
import RolesImg1 from "../../site-components/admin/assets/images/dashboard/roles-1.png";
import RolesImg2 from "../../site-components/admin/assets/images/dashboard/roles-2.png";
import FacultyImg from "../../site-components/admin/assets/images/dashboard/faculty.png";
import EventImg from "../../site-components/admin/assets/images/dashboard/event.png";
import NoticeImg from "../../site-components/admin/assets/images/dashboard/notice.png";
import PublicationImg from "../../site-components/admin/assets/images/dashboard/publication.png";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  //   const [session, setSession] = useState(); // Session data: the fuel for exams.
  const [data, setData] = useState([]); // Session data: the fuel for exams.

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

  const getAdminDashboardData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("session", secureLocalStorage.getItem("session"));
      bformData.append("data", "admin_dashboard");
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

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-3">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash">
                <Link to="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </Link>
                <span className="breadcrumb-item active">Admin</span>
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
                    <h5 className="id-counter-number">{data.total_courses}</h5>
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
                    <h4>Total Faculty</h4>
                    <h5 className="id-counter-number">{data.total_faculty}</h5>
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
                    <h5 className="id-counter-number">{data.total_roles}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="card " style={{ padding: "20px" }}>
                <div className="row">
                  <div className="col-lg-12 col-12 mb-3">
                    <h4>Courses</h4>
                  </div>
                  {data?.total_semester?.map((course, index) => (
                    <div
                      key={index}
                      className="col-lg-12 col-md-12 col-12 mb-3"
                    >
                      <div className="id-course-wrapper d-flex">
                        <span className="id-course-subject">
                          <img src={CourseImg} alt="student-img" />
                        </span>
                        <div className="id-course-content">
                          <h4>{course.coursename}</h4>
                          <h5 className="mb-0">Total Sem: {course.totalSem}</h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-lg-4 col-12">
              <div className="card id-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={NoticeImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4>Total Notice</h4>
                    <h5 className="id-counter-number">
                      {data?.total_notice?.total_notice}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-12">
              <div className="card id-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={EventImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4>Total Events</h4>
                    <h5 className="id-counter-number">
                      {data?.total_notice?.total_event}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-12">
              <div className="card id-card">
                <div className="id-total-record-wrapper d-flex justify-content-around align-items-center">
                  <span className="id-total-record-student">
                    <img src={PublicationImg} alt="student-img" />
                  </span>
                  <div className="id-total-record-content">
                    <h4>Total Publications</h4>
                    <h5 className="id-counter-number">
                      {data?.total_notice?.total_publication}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="card " style={{ padding: "20px" }}>
                <div className="row">
                  <div className="col-lg-12 col-12 mb-3">
                    <h4>Total Expence</h4>
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <table>
                      <tr>
                        <th>Category</th>
                        <th>Total Expence</th>
                      </tr>
                      <tr>
                        <td>furniture</td>
                        <td>900</td>
                      </tr>
                    </table>
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

export default AdminDashboard;
