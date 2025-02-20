/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { RiMenuFold3Fill } from "react-icons/ri";
import {
  AiOutlineAppstore,
  AiOutlineDashboard,
  AiOutlineLogout,
} from "react-icons/ai";
import { RiMenuFold4Fill } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import studentAvatar from "./assets/img/studentAvatar.png";
import axios from "axios";
import {
  FILE_API_URL,
  NODE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { studentRecordById } from "../../site-components/student/GetData"; // Importing components and data-fetching functions.
import rpnl_logo from "../../site-components/website/assets/Images/rpnl_logo.png";
const MyVerticallyCenteredModal = (props = {}) => {
  const [selectedStudent, setSelectedStudent] = useState();
  const [studentList, setStudentList] = useState([]);
  useEffect(() => {
    fetchList();
    setSelectedStudent(secureLocalStorage.getItem("studentId"));
  }, []);
  const fetchList = async () => {
    try {
      const bformData = new FormData();

      bformData.append("data", "otherchild");
      bformData.append("student_id", secureLocalStorage.getItem("studentId"));
      bformData.append(
        "sguardianemail",
        secureLocalStorage.getItem("sguardianemail")
      );
      bformData.append("logintype", "parent");

      const response = await axios.post(
        `${PHP_API_URL}/parent.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === 200 && response.data?.data.length > 0) {
        setStudentList(response.data?.data);
      } else {
        toast.error("Data not found.");
        setStudentList([]);
      }
    } catch (error) {
      setStudentList([]);
      // const statusCode = error.response?.data?.statusCode;
      // if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
      //   toast.error(error.response.message || "A server error occurred.");
      // } else {
      //   toast.error(
      //     "An error occurred. Please check your connection or try again."
      //   );
      // }
    }
  };

  const handleSubmit = () => {
    secureLocalStorage.setItem("studentId", selectedStudent);
    let student = studentList?.find(
      (student) => student.stid == selectedStudent
    );
    secureLocalStorage.setItem("registrationNo", student?.registrationNo);
    toast.success("Student Changed");
    props.submit();
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      top
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select Student
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group col-md-12">
          <label className="font-weight-semibold">Select Student</label>
          <Select
            name="application_status"
            id="application_status"
            onChange={(selectedOption) => {
              setSelectedStudent(selectedOption.value);
            }}
            options={studentList?.map((dep) => ({
              value: dep.stid,
              label: `${dep.sname} (${dep.registrationNo})`,
            }))}
            value={
              studentList.find(
                (item) => item.stid === parseInt(selectedStudent)
              )
                ? {
                    value: parseInt(selectedStudent),
                    label: `${
                      studentList.find(
                        (item) => item.stid == parseInt(selectedStudent)
                      ).sname
                    }( ${
                      studentList.find(
                        (item) => item.stid == parseInt(selectedStudent)
                      ).registrationNo
                    })`,
                  }
                : { value: selectedStudent, label: "Select" }
            }
          ></Select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="mx-auto">
          <Button onClick={props.close} className="btn btn-danger">
            Close
          </Button>{" "}
          <Button onClick={handleSubmit} className="btn btn-success">
            Submit
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const Navbar = ({ toggleExpand, toggleFolded }) => {
  const [activeSidebarMenu, setActiveSidebarMenu] = useState(null);
  const [activeSubSidebarMenu, setActiveSubSidebarMenu] = useState(null);
  const [expand, setExpand] = useState(false);
  const [folded, setFolded] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [approvedStudent, setApprovedStudent] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [guardian, setGuardian] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setExpand(false);
    toggleExpand(false);
  }, [location.pathname]);

  const sideBarMenu = [
    ...(!secureLocalStorage.getItem("sguardianemail")
      ? [
          {
            title: "Home",
            icon: <AiOutlineDashboard />,
            url: "home",
            dropdownMenus: [],
          },
        ]
      : []),
  ];

  const fetchList = async () => {
    try {
      const bformData = new FormData();

      bformData.append("data", "otherchild");
      bformData.append("student_id", secureLocalStorage.getItem("studentId"));
      bformData.append(
        "sguardianemail",
        secureLocalStorage.getItem("sguardianemail")
      );
      bformData.append("logintype", "parent");

      const response = await axios.post(
        `${PHP_API_URL}/parent.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === 200 && response.data?.data.length > 0) {
        setStudentList(response.data?.data);
      } else {
        toast.error("Data not found.");
        setStudentList([]);
      }
    } catch (error) {
      setStudentList([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  if (approvedStudent) {
    sideBarMenu.push(
      {
        title: "Dashboard",
        icon: <AiOutlineDashboard />,
        url: "dashboard",
        dropdownMenus: [],
      },
      {
        title: "Library",
        icon: <AiOutlineAppstore />,
        url: "",
        dropdownMenus: [
          { subtitle: "Issued List", url: "issued-list" },
          { subtitle: "Book Catalogue", url: "book-catalogue" },
        ],
      },
      // {
      //   title: "Feedback",
      //   icon: <AiOutlineAppstore />,
      //   url: "",
      //   dropdownMenus: [
      //     ...(!secureLocalStorage.getItem("sguardianemail")
      //       ? [{ subtitle: "Give Feedback", url: "new-feedback" }]
      //       : []),
      //     { subtitle: "My Feedback", url: "feedback-list" },
      //   ],
      // },

      {
        title: "Learning Management System",
        icon: <AiOutlineAppstore />,
        url: "lms",
        dropdownMenus: [],
      },
      {
        title: "Internship",
        icon: <AiOutlineAppstore />,
        url: "",
        dropdownMenus: [
          { subtitle: "Internship List", url: "internship" },
          {
            subtitle: "Internship Applied History",
            url: "internship-applied-history",
          },
        ],
      },
      {
        title: "Placement",
        icon: <AiOutlineAppstore />,
        url: "",
        dropdownMenus: [
          { subtitle: "Placement List", url: "joblist" },
          { subtitle: "Placement Applied History", url: "job-applied-history" },
        ],
      },
      {
        title: "Hostel Management",
        icon: <AiOutlineAppstore />,
        url: "",
        dropdownMenus: [
          ...(!secureLocalStorage.getItem("sguardianemail")
            ? [{ subtitle: "Raise Room Query", url: "raise-query" }]
            : []),
          { subtitle: "Raised Room Queries", url: "raised-room-queries" },
          { subtitle: "Alloted Room History", url: "alloted-room-history" },
          ...(!secureLocalStorage.getItem("sguardianemail")
            ? [{ subtitle: "Raise Complain", url: "raise-complain" }]
            : []),
          { subtitle: "Complain History", url: "complain-history" },
          ...(!secureLocalStorage.getItem("sguardianemail")
            ? [{ subtitle: "New Leave Request", url: "leave-request" }]
            : []),
          { subtitle: "Leave Request History", url: "leave-request-list" },
        ],
      },
      {
        title: "Attendance",
        icon: <AiOutlineAppstore />,
        url: "",
        dropdownMenus: [
          { subtitle: "Hostel Attendance History", url: "attendance-history" },
          {
            subtitle: "Class Attendance History",
            url: "class-attendance-history",
          },
        ],
      },
      {
        title: "Time Table",
        icon: <AiOutlineAppstore />,
        url: "time-table",
        dropdownMenus: [],
      },
      {
        title: "Communication Management",
        icon: <AiOutlineAppstore />,
        url: "",
        dropdownMenus: [
          ...(!secureLocalStorage.getItem("sguardianemail")
            ? [{ subtitle: "New Message", url: "new-message" }]
            : []),
          { subtitle: "Message List", url: "message-list" },
        ],
      }
    );
  }

  const [studentPersonalDetail, setStudentPersonalDetail] = useState({
    name: "",
    pic: "",
    email: "",
  });
  useEffect(() => {
    getStudentSelectedCourse();
    getStudentPersonalData();
    if (secureLocalStorage.getItem("sguardianemail")) {
      fetchList();
      setGuardian(true);
    }
  }, []);

  const getStudentPersonalData = async () => {
    await studentRecordById(secureLocalStorage.getItem("studentId")).then(
      (res) => {
        if (res.length > 0) {
          secureLocalStorage.setItem("sname", res[0]?.sname);
          setStudentPersonalDetail({
            name: res[0]?.sname,
            pic: res[0]?.spic,
            registrationNo: res[0]?.registrationNo,
            id: res[0]?.id,
            enrollmentNo: res[0]?.enrollmentNo,
          });
        }
      }
    );
  };

  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = secureLocalStorage.getItem("studentId");
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetchCurrentCourse`,
        formData
      );

      if (response.data?.statusCode === 200) {
        if (
          response?.data?.data?.semtitle !== "semester 1" ||
          (response?.data?.data?.semtitle === "semester 1" &&
            response?.data?.data?.approved === 1)
        ) {
          secureLocalStorage.setItem(
            "selectedCourseId",
            response?.data?.data?.id
          );

          setApprovedStudent(true);
        }
      }
    } catch (error) {}
  };

  function toggleSidebar() {
    setExpand(!expand);
    toggleExpand(!expand);
  }
  const logOut = () => {
    secureLocalStorage.clear();
    navigate("/student/login");
    window.location.reload(); // This will force a page reload
  };

  function toggleSidebarFolded() {
    setFolded(!folded);
    toggleFolded(!folded);
  }

  useEffect(() => {
    getStudentDetail();
  }, [studentList]);

  const getStudentDetail = () => {
    const studentId = secureLocalStorage.getItem("studentId");
    if (studentId) {
      let student = studentList?.find((student) => student?.stid == studentId);
      setSessionTitle(`${student?.sname} (${student?.registrationNo})`);
    } else {
      setSessionTitle("Select Student");
    }
  };

  return (
    <>
      <div className="header bg-white border-none shadow-head-sm">
        <div className="logo logo-dark d-flex justify-content-center align-items-center">
          <Link to="/student/">
            <img style={{ width: "35%" }} src={rpnl_logo} alt="Logo" />
            <img
              style={{ width: "35%" }}
              className="logo-fold"
              src={rpnl_logo}
              alt="Logo Folded"
            />
          </Link>
        </div>
        <div className="logo logo-white">
          <Link href="/student/">
            <img style={{ width: "35%" }} src={rpnl_logo} alt="Logo White" />
            <img
              style={{ width: "35%" }}
              className="logo-fold"
              src={rpnl_logo}
              alt="Logo Folded White"
            />
          </Link>
        </div>
        <div className="nav-wrap">
          <ul className="nav-left">
            <li className="desktop-toggle mr-3" onClick={toggleSidebarFolded}>
              <RiMenuFold3Fill />
            </li>
            <li className="mobile-toggle mr-3" onClick={toggleSidebar}>
              <RiMenuFold4Fill />
            </li>
            {guardian && (
              <li
                className="bg_light text-dark d-flex justify-content-center align-items-center "
                style={{
                  padding: "10px 18px",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
                onClick={() => setModalShow(true)}
              >
                <>
                  <i className="fa-solid fa-user-tie text-primary mr-3"></i>
                  <div className="">{sessionTitle}</div>
                </>
              </li>
            )}
          </ul>
          <ul className="nav-right">
            <li className="dropdown dropdown-animated scale-left">
              <div className="pointer" onClick={() => setShowPopup(!showPopup)}>
                <div className="avatar avatar-image m-h-10 m-r-15">
                  <img
                    src={
                      studentPersonalDetail?.pic
                        ? `${FILE_API_URL}/student/${studentPersonalDetail.id}${studentPersonalDetail.registrationNo}/${studentPersonalDetail.pic}`
                        : studentAvatar
                    }
                  />
                </div>
              </div>
              {showPopup && (
                <div className="dropdown-menu pop-profile show">
                  <div className="p-h-20 p-b-15 m-b-10 border-bottom">
                    <div className="d-flex">
                      <div className="avatar avatar-lg avatar-image">
                        <img
                          src={
                            studentPersonalDetail?.pic
                              ? `${FILE_API_URL}/student/${studentPersonalDetail.id}${studentPersonalDetail.registrationNo}/${studentPersonalDetail.pic}`
                              : studentAvatar
                          }
                        />
                      </div>
                      <div className="m-l-10">
                        <p className="m-b-0 text-dark font-weight-semibold">
                          {studentPersonalDetail?.name || ""}
                        </p>
                        <p className="m-b-0 opacity-07">
                          {studentPersonalDetail?.enrollmentNo || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <a
                    className="dropdown-item d-block p-h-15 p-v-10"
                    onClick={logOut}
                  >
                    <AiOutlineLogout />
                    <span className="m-l-10">Logout</span>
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className={`side-nav ${expand ? "expanded" : ""}`}>
        <div className="side-nav-inner">
          <ul className="side-nav-menu scrollable">
            {sideBarMenu.map((option, index) =>
              option.url ? (
                <li key={index} className="nav-item dropdown cursor">
                  <Link to={`/student/${option.url}`}>
                    <span className="icon-holder">{option.icon}</span>
                    <span className="title font-12">{option.title}</span>
                  </Link>
                </li>
              ) : (
                <li
                  key={index}
                  className={`nav-item dropdown cursor ${
                    activeSidebarMenu === index ? "open" : ""
                  }`}
                  onClick={() =>
                    setActiveSidebarMenu(
                      activeSidebarMenu === index ? null : index
                    )
                  }
                >
                  <a className="dropdown-toggle">
                    <span className="icon-holder">{option.icon}</span>
                    <span className="title font-12">{option.title}</span>
                    <span className="arrow">
                      <i className="arrow-icon"></i>
                    </span>
                  </a>
                  <ul className="dropdown-menu">
                    {option.dropdownMenus.map((subOption, subIndex) => (
                      <li
                        key={subIndex}
                        className={`${
                          activeSubSidebarMenu === subIndex ? "active" : ""
                        }`}
                        onClick={() => setActiveSubSidebarMenu(subIndex)}
                      >
                        <Link
                          to={`/student/${subOption.url}`}
                          className="font-12"
                        >
                          {subOption.subtitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        close={() => setModalShow(false)}
        submit={() => {
          setModalShow(false);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }}
      />
      {secureLocalStorage.getItem("sguardianemail") && (
        <p className="id-parent-panel-position-fixed">Parent Panel</p>
      )}
    </>
  );
};

export default Navbar;
