/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { RiMenuFold3Fill } from "react-icons/ri";
import rpnl_logo from "../../site-components/website/assets/Images/rpnl_logo.png";
import {
  FILE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import {
  AiOutlineDashboard,
  AiOutlineBook,
  AiOutlineFolder,
  AiOutlineCalendar,
  AiOutlineHome,
  AiOutlineSolution,
  AiOutlineUsergroupAdd,
  AiOutlineSetting,
  AiOutlineCamera,
  AiOutlineUserAdd,
  AiOutlineFileProtect,
  AiOutlineSmile,
  AiOutlineUnlock,
  AiOutlineQuestionCircle,
  AiOutlineRead,
  AiOutlineLogout,
  AiOutlineLock,
  AiOutlineAppstore,
} from "react-icons/ai";
import {
  FaChalkboardTeacher,
  FaFileAlt,
  FaClipboardList,
  FaUserGraduate,
  FaHistory,
  FaBed,
  FaGraduationCap,
  FaBuilding,
  FaVideo,
  FaLink,
  FaFilePdf,
  FaRegListAlt,
  FaEnvelope,
  FaDoorClosed,
  FaExclamationCircle,
  FaUserPlus,
  FaListUl,
  FaRegFile,
  FaInfoCircle,
  FaPlayCircle,
  FaStickyNote,
  FaSuitcase,
  FaImages,
  FaRegFileAlt,
  FaPlusCircle,
  FaRegHandshake,
  FaBookReader,
  FaCommentDots,
  FaCogs,
} from "react-icons/fa";
import {
  MdAssignment,
  MdQuiz,
  MdCardMembership,
  MdPlaylistAddCheck,
  MdClass,
  MdSchool,
  MdInventory,
  MdAddShoppingCart,
  MdSchedule,
  MdRoomService,
} from "react-icons/md";
import {
  facultyData,
  RoleDbData,
} from "../../site-components/admin/FetchFacultyLoginData";
import { GoProject } from "react-icons/go";
import { IoIosSettings } from "react-icons/io";
import { RiMenuFold4Fill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PiChalkboardTeacher } from "react-icons/pi";
import secureLocalStorage from "react-secure-storage";
import { memo } from "react";
import { dataFetchingPost } from "../../site-components/Helper/HelperFunction";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const MyVerticallyCenteredModal = (props = {}) => {
  const [sessionList, setSessionList] = useState([]);
  const [selectedSession, setSelectSession] = useState({});
  useEffect(() => {
    fetchList();
  }, []);
  const fetchList = async (deleteStatus = 0) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/session/fetch`,
        {
          deleteStatus,
          column: "id, dtitle, created_at, status, deleted_at, deleteStatus",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        const tempCat = response.data.map((dep) => ({
          value: dep.id,
          label: dep.dtitle,
        }));
        const currentSession = localStorage.getItem("session");
        const val = tempCat.find((ele) => ele.value == currentSession);

        setSelectSession(val);
        setSessionList(tempCat);
      } else {
        toast.error("Data not found.");
        setSessionList([]);
      }
    } catch (error) {
      setSessionList([]);
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
  const handleSessionChange = (e) => {
    setSelectSession(e);
  };
  const handleSubmit = async () => {
    localStorage.setItem("session", selectedSession.value);
    localStorage.setItem("sessionTitle", selectedSession.label);
    toast.success("Session Changed");

    props.submit();
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      top
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group col-md-12">
          <label className="font-weight-semibold">Select Session</label>
          <Select
            name="application_status"
            id="application_status"
            onChange={handleSessionChange}
            options={sessionList}
            value={selectedSession}
          ></Select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="mx-auto">
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
  const navigate = useNavigate();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [facultyDataList, setFacultyDataList] = useState([]);
  const [RolePermission, setRolePermission] = useState([]);
  const login_id = secureLocalStorage.getItem("login_id");
  const loginType = secureLocalStorage.getItem("loginType");
  const role_id = secureLocalStorage.getItem("role_id");
  const ftchFac = async (dbId) => {
    const resp = await facultyData(dbId);
    setFacultyDataList(resp);
  };
  const fetchRolePermsn = async (dbId) => {
    const resp = await RoleDbData(dbId);
    setRolePermission(resp);
  };
  useEffect(() => {
    ftchFac(login_id);
  }, [login_id]);
  useEffect(() => {
    fetchRolePermsn(role_id);
  }, [role_id]);
  useEffect(() => {
    getSessionTitle();
  }, []);
  const getCurrentSession = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_currentsession");

      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data.status === 200) {
        localStorage.setItem(
          "session",
          response?.data?.data[0]?.currentsession
        );
        localStorage.setItem("sessionTitle", response?.data?.data[0]?.dtitle);
        setSessionTitle(response?.data?.data[0]?.dtitle);
      }
    } catch (error) {
      const status = error.response?.data?.status;
      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  const getSessionTitle = () => {
    const title = localStorage.getItem("sessionTitle");
    if (title) {
      setSessionTitle(title);
    } else {
      getCurrentSession();
      setSessionTitle("Select Session");
    }
  };

  const sideBarMenu = [
    {
      title: "Dashboard",
      icon: <AiOutlineDashboard />, // General dashboard icon
      url: "",
      dropdownMenus: [
        { subtitle: "Admin", url: "admin-dashboard", icon: <FaUserGraduate /> }, // User-related icon
        {
          subtitle: "Faculty",
          url: "faculty-dashboard",
          icon: <FaChalkboardTeacher />,
        },
        {
          subtitle: "User Log",
          url: "user-log",
          icon: <FaChalkboardTeacher />,
        },
      ],
    },
    {
      title: "Exam Management",
      icon: <AiOutlineBook />, // Books represent learning/exams
      url: "",
      dropdownMenus: [
        {
          subtitle: "Add Exam Paper",
          url: "exam-paper/add-update",
          icon: <FaFileAlt />,
        }, // Document icon for papers
        {
          subtitle: "Exam Paper List",
          url: "exam-paper/list",
          icon: <FaClipboardList />,
        }, // List icon for multiple papers
        {
          subtitle: "Admit Card",
          url: "exam-paper/admit-card",
          icon: <MdCardMembership />,
        }, // Card icon for admit cards
        { subtitle: "Assignment", url: "assignment", icon: <MdAssignment /> }, // Assignment-related icon
        {
          subtitle: "Assignment Response",
          url: "assignment-response",
          icon: <FaClipboardList />,
        }, // Clipboard for response tracking
        { subtitle: "Quiz", url: "quiz", icon: <MdQuiz /> }, // Quiz-related icon
        {
          subtitle: "Quiz Response",
          url: "quiz-response",
          icon: <FaClipboardList />,
        }, // Similar to assignment response
      ],
    },
    {
      title: "Attendance Management",
      icon: <AiOutlineBook />, // General icon for learning, can also be associated with attendance tracking
      url: "",
      dropdownMenus: [
        {
          subtitle: "Mark Class Attendance",
          url: "student-management/mark-attendance",
          icon: <MdPlaylistAddCheck />,
        }, // Checkmark icon for marking attendance
        {
          subtitle: "Class Attendance History",
          url: "student-management/attendance-history",
          icon: <FaHistory />,
        }, // History icon for past attendance
        {
          subtitle: "Mark Hostel Attendance",
          url: "hostel-management/mark-attendance",
          icon: <FaBed />,
        }, // Hostel-related icon

        {
          subtitle: "Hostel Attendance History",
          url: "hostel-management/attendance-history",
          icon: <FaHistory />,
        }, // History for hostel attendance
        {
          subtitle: "Compile Class Attendance",
          url: "attendance/compiled-attendance",
          icon: <FaHistory />,
        }, // Similar to history icon for compiled data
        {
          subtitle: "View Compile Attendance",
          url: "attendance-management/view-compile-attendance",
          icon: <FaHistory />,
        },
      ],
    },
    {
      title: "Learning Management",
      icon: <AiOutlineBook />, // Books for learning-related activities
      url: "",
      dropdownMenus: [
        { subtitle: "Session", url: "session", icon: <MdClass /> }, // Class icon for session management
        // {
        //   subtitle: "Faculty Department",
        //   url: "department-faculty",
        //   icon: <FaBuilding />,
        // },
        { subtitle: "Department", url: "department", icon: <FaBuilding /> }, // Building for departments
        {
          subtitle: "Designation",
          url: "designation",
          icon: <FaGraduationCap />,
        }, // Graduation cap for designations
        { subtitle: "Course", url: "course", icon: <MdSchool /> }, // School icon for courses
        {
          subtitle: "Semester",
          url: "semester",
          icon: <FaChalkboardTeacher />,
        }, // Teacher icon for semester-based learning
        {
          subtitle: "Session Wise Semester Class",
          url: "learning-management/session-wise-semester/list",
          icon: <MdClass />,
        }, // Class for session-wise semesters
        {
          subtitle: "Semester Wise Subject",
          url: "semester-subject",
          icon: <FaChalkboardTeacher />,
        }, // Teacher icon again for subjects
        { subtitle: "Topic", url: "topic", icon: <AiOutlineBook /> }, // Book icon for topics
      ],
    },
    {
      title: "Resources",
      icon: <AiOutlineFolder />, // Folder icon for resources
      url: "",
      dropdownMenus: [
        { subtitle: "Add Pdfs", url: "add-resource-pdf", icon: <FaFilePdf /> }, // PDF icon for adding PDFs
        {
          subtitle: "Pdfs List",
          url: "list-resource-pdf",
          icon: <FaFilePdf />,
        }, // PDF icon for PDF list
        {
          subtitle: "Add Videos",
          url: "add-resource-video",
          icon: <FaVideo />,
        }, // Video icon for adding videos
        {
          subtitle: "Videos List",
          url: "list-resource-video",
          icon: <FaVideo />,
        }, // Video icon for video list
        {
          subtitle: "Add Live Class",
          url: "add-resource-live-class-url",
          icon: <FaLink />,
        }, // Link icon for live classes
        {
          subtitle: "Live Classes List",
          url: "resource-live-class-url",
          icon: <FaLink />,
        }, // Link icon for live class list
      ],
    },
    {
      title: "Inventory Management",
      icon: <AiOutlineCalendar />, // Calendar icon for inventory scheduling
      url: "",
      dropdownMenus: [
        {
          subtitle: "Inventory Category",
          url: "inventory/category",
          icon: <MdInventory />,
        }, // Inventory icon for categories
        {
          subtitle: "Add Product",
          url: "inventory/add-product",
          icon: <MdAddShoppingCart />,
        }, // Add product icon
        {
          subtitle: "Product List",
          url: "inventory/product",
          icon: <MdInventory />,
        }, // Inventory icon for product list
        {
          subtitle: "Stock In",
          url: "inventory/product/add-stock",
          icon: <MdAddShoppingCart />,
        }, // Cart icon for stock-in
        {
          subtitle: "Stock In History",
          url: "inventory/product/stockin/history",
          icon: <MdInventory />,
        }, // History icon for stock-in history
        {
          subtitle: "Stock Out",
          url: "inventory/product/add-stockout",
          icon: <MdAddShoppingCart />,
        }, // Cart icon for stock-out
        {
          subtitle: "Stock Out History",
          url: "inventory/product/stockout/history",
          icon: <MdInventory />,
        }, // History icon for stock-out history
        {
          subtitle: "Critical Stock Products",
          url: "inventory/product/threshold",
          icon: <MdInventory />,
        }, // Inventory icon for critical products
        {
          subtitle: "Restock Notification List",
          url: "inventory/product/threshold/restock/notification",
          icon: <MdInventory />,
        }, // Inventory icon for restock notifications
      ],
    },
    {
      title: "Expense Management",
      icon: <AiOutlineCalendar />,
      url: "",
      dropdownMenus: [
        {
          subtitle: "Expense Category",
          url: "expense-category",
          icon: <MdInventory />,
        },
        {
          subtitle: "Add New Expense",
          url: "expense/add-new",
          icon: <MdInventory />,
        },
        {
          subtitle: "Expense List",
          url: "expense/list",
          icon: <MdInventory />,
        },
      ],
    },
    {
      title: "Time Table Management",
      icon: <AiOutlineCalendar />, // Calendar icon for timetable management
      url: "",
      dropdownMenus: [
        { subtitle: "Time Slot", url: "time-slot", icon: <MdSchedule /> }, // Schedule icon for time slots
        {
          subtitle: "Add New Time Table",
          url: "add-new-time-table",
          icon: <MdSchedule />,
        }, // Schedule icon for adding new timetable
        {
          subtitle: "Time Table List",
          url: "time-table-list",
          icon: <FaRegListAlt />,
        }, // List icon for timetable list
        {
          subtitle: "Subjects Assigned to Faculty",
          url: "subjects-assinged-faculty",
          icon: <FaEnvelope />,
        }, // Envelope for assigned faculty
        {
          subtitle: "List of Subjects Assigned to Faculty",
          url: "subjects-assinged-faculty-list",
          icon: <FaRegListAlt />,
        }, // List icon for faculty assignments
      ],
    },
    {
      title: "Communication Management",
      icon: <AiOutlineCalendar />, // Calendar icon can also represent scheduling communications
      url: "",
      dropdownMenus: [
        {
          subtitle: "New Message",
          url: "cmn-mng-message",
          icon: <FaEnvelope />,
        }, // Envelope for new message
        {
          subtitle: "Message List",
          url: "cmn-mng-message-list",
          icon: <FaRegListAlt />,
        }, // List icon for message list
      ],
    },
    {
      title: "Hostel Management",
      icon: <AiOutlineHome />, // House icon for hostel management
      url: "",
      dropdownMenus: [
        {
          subtitle: "Add Room",
          url: "add-hostel-room",
          icon: <FaDoorClosed />,
        }, // Door icon for adding new rooms
        {
          subtitle: "Room List",
          url: "hostel-room-list",
          icon: <FaRegListAlt />,
        }, // List icon for room list
        {
          subtitle: "Visitor Entry",
          url: "visitor-entry",
          icon: <FaUserPlus />,
        }, // User icon for visitor entry
        {
          subtitle: "Hostel Visitor History",
          url: "hostel-visitor-history",
          icon: <FaHistory />,
        }, // History icon for Hostel Visitor History
        {
          subtitle: "Room Allotment",
          url: "allot-room",
          icon: <MdRoomService />,
        }, // Room service icon for allotting rooms
        {
          subtitle: "Alloted Room History",
          url: "alloted-room-history",
          icon: <FaHistory />,
        }, // History icon for allotted rooms
        {
          subtitle: "Raised Room Queries",
          url: "raised-room-queries",
          icon: <FaExclamationCircle />,
        }, // Exclamation icon for raised queries
        {
          subtitle: "Room Complaints",
          url: "raised-room-complains",
          icon: <FaExclamationCircle />,
        }, // Exclamation icon for room complaints
        {
          subtitle: "Leave Request",
          url: "leave-request-list",
          icon: <FaRegListAlt />,
        }, // List icon for leave requests
      ],
    },
    {
      title: "Visitor Management",
      icon: <AiOutlineSolution />, // Icon representing visitor management
      url: "",
      dropdownMenus: [
        {
          subtitle: "Registration",
          url: "visitor-registration",
          icon: <FaUserPlus />,
        }, // User plus icon for registration
        {
          subtitle: "Visitor History",
          url: "visitor-registration-list",
          icon: <FaHistory />,
        }, // History icon for visitor registration history
      ],
    },
    {
      title: "Student Management",
      icon: <AiOutlineUsergroupAdd />, // Icon for student groups/feedback
      url: "",
      dropdownMenus: [
        {
          subtitle: "Applications List",
          url: "application-list",
          icon: <FaRegListAlt />,
        }, // List icon for applications
        {
          subtitle: "Academic Student List",
          url: "student-management/student-list",
          icon: <FaRegListAlt />,
        }, // List icon for applications
        {
          subtitle: "Feedbacks",
          url: "student-feedback-list",
          icon: <FaRegListAlt />,
        }, // List icon for feedbacks
      ],
    },
    {
      title: "Announcements",
      icon: <GoProject />, // Icon for announcements/projects
      url: "",
      dropdownMenus: [
        { subtitle: "Achievement", url: "achievement-list" },
        { subtitle: "Announcement", url: "notice-list" },
      ],
    },

    {
      title: "Website CMS Settings",
      icon: <AiOutlineSetting />, // CMS-related settings icon
      url: "",
      dropdownMenus: [
        // { subtitle: "Menu", url: "menu-list", icon: <FaListUl /> }, // List icon for menu management
        { subtitle: "Add Page", url: "add-page", icon: <FaRegFile /> }, // File icon for adding pages
        { subtitle: "Page List", url: "page-list", icon: <FaRegListAlt /> }, // List icon for page list
        { subtitle: "Faqs", url: "faq-list", icon: <FaListUl /> }, // List icon for FAQs
        { subtitle: "About", url: "about", icon: <FaInfoCircle /> }, // Info icon for the about page
        {
          subtitle: "Important Update Sliders",
          url: "marque-slide",
          icon: <FaPlayCircle />,
        }, // Play icon for marque slides
        { subtitle: "Message", url: "message", icon: <FaStickyNote /> }, // Sticky note icon for messages
        { subtitle: "Mission", url: "mission", icon: <FaInfoCircle /> }, // Info icon for mission page
        {
          subtitle: "Popup Notice",
          url: "popup-notice",
          icon: <FaStickyNote />,
        }, // Sticky note for popup notice
        { subtitle: "Speciality", url: "specility", icon: <FaInfoCircle /> }, // Info icon for speciality
        { subtitle: "Useful Links", url: "useful-links", icon: <FaListUl /> }, // List icon for useful links
        { subtitle: "Vission", url: "vission", icon: <FaInfoCircle /> }, // Info icon for vision
        {
          subtitle: "Website Home Video",
          url: "video-at-website-home",
          icon: <FaPlayCircle />,
        }, // Play icon for website home video

        {
          subtitle: "Banner",
          url: "cms/banner/list",
          icon: <FaPlayCircle />,
        },
       
      ],
    },
    {
      title: "HR Management",
      icon: <PiChalkboardTeacher />, // Icon representing faculty/teachers
      url: "",
      dropdownMenus: [
        { subtitle: "Employee", url: "faculty-list", icon: <FaRegListAlt /> }, // List icon for faculty list
      ],
    },
    {
      title: "Inquiry",
      icon: <AiOutlineQuestionCircle />, // Icon for inquiries
      url: "",
      dropdownMenus: [
        { subtitle: "Contact", url: "contact", icon: <FaCommentDots /> }, // Speech bubble for contact inquiries
        { subtitle: "Feedback", url: "feedback", icon: <FaCommentDots /> }, // Speech bubble for feedback
        { subtitle: "Grievance", url: "grievance", icon: <FaCommentDots /> }, // Speech bubble for grievances
      ],
    },
    {
      title: "Library Management",
      icon: <AiOutlineRead />, // Icon for library/books
      url: "",
      dropdownMenus: [
        { subtitle: "Books", url: "book", icon: <FaBookReader /> }, // Book reader icon for books
        {
          subtitle: "Issue New Book",
          url: "issue-book-add",
          icon: <FaBookReader />,
        }, // Book reader for issuing books
        {
          subtitle: "Issued Book List",
          url: "issue-book",
          icon: <FaBookReader />,
        }, // Clearer distinction for issued books
        {
          subtitle: "Library Settings",
          url: "library-setting",
          icon: <FaCogs />,
        }, // Plural for consistency
      ],
    },
    {
      title: "Media",
      icon: <AiOutlineCamera />, // Icon for media
      url: "",
      dropdownMenus: [
        {
          subtitle: "Media Category",
          url: "gallery-category",
          icon: <FaSuitcase />,
        }, // Suitcase icon for categories
        { subtitle: "Image", url: "gallery", icon: <FaImages /> }, // Image icon for gallery images
        { subtitle: "Video", url: "video-gallery", icon: <FaVideo /> }, // Video icon for video gallery
      ],
    },
    {
      title: "Recruitment",
      icon: <AiOutlineUserAdd />, // Icon for recruitment/jobs
      url: "",
      dropdownMenus: [
        { subtitle: "Job Category", url: "job-category", icon: <FaSuitcase /> }, // Suitcase icon for job categories
        { subtitle: "Job", url: "job-recruitment", icon: <FaSuitcase /> }, // Suitcase icon for job postings
        {
          subtitle: "Job Applications",
          url: "job-applications",
          icon: <FaClipboardList />,
        }, // Clipboard list icon for job applications
      ],
    },
    {
      title: "Reports",
      icon: <AiOutlineUserAdd />, // Icon for reports (user-related)
      url: "reports",
      dropdownMenus: [],
    },
    {
      title: "Policies",
      icon: <AiOutlineFileProtect />, // Icon for policies
      url: "",
      dropdownMenus: [
        {
          subtitle: "Anti Ragging Policy",
          url: "anti-ragging",
          icon: <FaRegFileAlt />,
        }, // Document icon for anti-ragging policy
        {
          subtitle: "Copyright Policy",
          url: "copyright-policy",
          icon: <FaRegFileAlt />,
        }, // Document icon for copyright policy
        {
          subtitle: "Privacy Policy",
          url: "privacy-policy",
          icon: <FaRegFileAlt />,
        }, // Document icon for privacy policy
        {
          subtitle: "Terms Of Use Policy",
          url: "termanduse-policy",
          icon: <FaRegFileAlt />,
        }, // Document icon for terms of use
        {
          subtitle: "Terms And Conditions",
          url: "terms-and-conditions",
          icon: <FaRegFileAlt />,
        }, // Document icon for terms and conditions
      ],
    },
    {
      title: "Student Corner",
      icon: <AiOutlineSmile />, // Icon for student resources
      url: "",
      dropdownMenus: [
        {
          subtitle: "Scholarship",
          url: "scholarship",
          icon: <FaRegHandshake />,
        }, // Handshake icon for scholarships
        { subtitle: "Internship", url: "internship", icon: <FaListUl /> }, // List icon for internships
        {
          subtitle: "Internship Application",
          url: "internship-application-listing",
          icon: <FaPlusCircle />,
        }, // Plus icon for internship applications
        { subtitle: "Placement", url: "placement", icon: <FaListUl /> }, // List icon for placement
        {
          subtitle: "Placement Application",
          url: "placement-application-listing",
          icon: <FaPlusCircle />,
        }, // Plus icon for placement applications
        {
          subtitle: "Students Testimonial",
          url: "student-testimonial",
          icon: <FaRegFile />,
        }, // File icon for testimonials
      ],
    },
    {
      title: "Role & Permission",
      icon: <AiOutlineUnlock />, // Icon for roles and permissions
      url: "",
      dropdownMenus: [
        { subtitle: "Add New", url: "add-role", icon: <FaPlusCircle /> }, // Plus icon for adding new roles
        { subtitle: "Role List", url: "role-list", icon: <FaListUl /> }, // List icon for role list
      ],
    },
    {
      title: "University Settings",
      icon: <IoIosSettings />, // Icon for settings
      url: "brand-setting",
      dropdownMenus: [],
    },
  ];

  function toggleSidebar() {
    setExpand(!expand);
    toggleExpand(!expand);
  }
  const logOut = () => {
    secureLocalStorage.clear();
    navigate("/admin/");
    window.location.reload(); // This will force a page reload
  };
  function toggleSidebarFolded() {
    setFolded(!folded);
    toggleFolded(!folded);
  }
  return (
    <>
      <div className="header bg-white border-none shadow-head-sm">
        <div className="logo logo-dark d-flex justify-content-center align-items-center">
          <Link to="/admin/home">
            <img style={{ width: "35%" }} src={rpnl_logo} alt="Logo" />
            <img
              style={{ width: "35%" }}
              className="logo-fold"
              src={rpnl_logo}
              alt="Logo Folded"
            />
          </Link>
          <div className="desktop-toggle mr-3" onClick={toggleSidebarFolded}>
            <RiMenuFold3Fill />
          </div>
        </div>
        <div className="logo logo-white">
          <Link href="/admin/home">
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
            <li className="mobile-toggle mr-3" onClick={toggleSidebar}>
              <RiMenuFold4Fill />
            </li>
            <li
              className="bg_light text-dark d-flex justify-content-center align-items-center "
              style={{
                padding: "10px 18px",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              onClick={() => setModalShow(true)}
            >
              <i className="fa-solid fa-calendar-days text-primary mr-3"></i>
              <div className="">{sessionTitle}</div>
            </li>
          </ul>
          <ul className="nav-right">
            <li className="dropdown dropdown-animated scale-left">
              <div className="pointer" onClick={() => setShowPopup(!showPopup)}>
                <div className="avatar avatar-image m-h-10 m-r-15">
                  <img
                    src={`${FILE_API_URL}/user/${facultyDataList?.uid}/${facultyDataList?.avtar}`}
                    alt="User Avatar"
                  />
                </div>
              </div>
              {showPopup && (
                <div className="dropdown-menu pop-profile show">
                  <div className="p-h-20 p-b-15 m-b-10 border-bottom">
                    <div className="d-flex">
                      <img
                        src={`${FILE_API_URL}/user/${facultyDataList?.uid}/${facultyDataList?.avtar}`}
                        style={{ width: "50px", height: "50px" }}
                        className="rounded-circle"
                        alt="User"
                      />
                      <div className="m-l-10">
                        <p className="m-b-0 text-dark font-weight-semibold">
                          {facultyDataList?.first_name}{" "}
                          {facultyDataList?.middle_name}{" "}
                          {facultyDataList?.last_name}
                        </p>
                        <p className="m-b-0 opacity-07">
                          {facultyDataList?.u_email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <a
                    className="dropdown-item d-block p-h-15 p-v-10"
                    onClick={logOut}
                    style={{ cursor: "pointer" }}
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
            {sideBarMenu.map((option, index) => {
              const url = location?.pathname?.split("/admin/");
              let activeClass =
                Array.isArray(url) && url.length > 1 ? url[1] : false;
              let showMenu = true;
              if (RolePermission && RolePermission.length > 0) {
                let resp = RolePermission.map((rData) => Object.keys(rData)[0]);
                
                showMenu = resp.length > 0 && resp.includes(option.title);
              }
              if (option.url && (showMenu || loginType === "superadmin")) {
                return (
                  <li
                    key={index}
                    className={`nav-item dropdown cursor ${
                      activeClass == option.url ? "mactive" : ""
                    }`}
                  >
                    <Link to={`/admin/${option.url}`}>
                      <span className="icon-holder">{option.icon}</span>
                      <span className="title font-14">{option.title}</span>
                    </Link>
                  </li>
                );
              }
              let addClass = option.dropdownMenus.some(
                (item) => activeClass == item.url
              );
              // If the menu has dropdown items and should be shown
              if (!option.url && (showMenu || loginType === "superadmin")) {
                return (
                  <li
                    key={index}
                    className={`nav-item dropdown cursor ${
                      activeSidebarMenu === index || addClass ? "open" : ""
                    }`}
                    onClick={() =>
                      setActiveSidebarMenu(
                        activeSidebarMenu === index ? null : index
                      )
                    }
                  >
                    <a className="dropdown-toggle">
                      <span className="icon-holder">{option.icon}</span>
                      <span className="title font-14">{option.title}</span>
                      <span className="arrow">
                        <i className="arrow-icon"></i>
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      {option.dropdownMenus?.map((subOption, subIndex) => {
                        let showSubMenu = RolePermission?.some((rData) => {
                          let arr = rData[Object.keys(rData)[0]]; // Get the array of roles
                          return arr?.some(
                            (item) =>
                              item.subRole === subOption.subtitle &&
                              item.crud.length > 0
                          );
                        });

                        if (showSubMenu || loginType === "superadmin") {
                          return (
                            <li
                              key={subIndex}
                              className={`${
                                activeSubSidebarMenu === subIndex
                                  ? "active"
                                  : ""
                              } font-14`}
                              onClick={() => setActiveSubSidebarMenu(subIndex)}
                            >
                              <Link
                                to={`/admin/${subOption.url}`}
                                className="font-14"
                              >
                                <span className="icon-holder">
                                  {subOption.icon}
                                </span>
                                <span className="ml-1 font-14">
                                  {subOption.subtitle}
                                </span>
                              </Link>
                            </li>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </ul>
                  </li>
                );
              }
              return null; // Ensure that something is returned in all cases
            })}
          </ul>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        submit={() => {
          setModalShow(false);
          window.location.reload();
        }}
      />
    </>
  );
};

export default memo(Navbar);
