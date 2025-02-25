
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../site-components/admin/assets/css/App.min.css";
import "../site-components/admin/assets/css/Custom.css";
import ProtectedRoute from "../site-pages/admin/ProtectedRoute";
import IsAdminLoggedIn from "../site-pages/admin/IsAdminLoggedIn";
import ErrorBoundary from "./ErrorBoundary.jsx";
import SuspensionLoader from "../SuspensionLoader.jsx";
import LibraryListing from "../site-pages/admin/LibraryManagement/LibraryListing.jsx";
const MessageForm = lazy(() => import("../site-pages/admin/MessageForm"));
const Gallery = lazy(() => import("../site-pages/admin/Gallery"));
const GalleryForm = lazy(() => import("../site-pages/admin/GalleryForm"));
const lazyLoad = (path) =>
  lazy(() => import(`../site-pages/admin/${path}.jsx`));
const lazyLoadTopic = (path) =>
  lazy(() => import(`../site-pages/admin/Topic/${path}.jsx`));
const lazyLoadAssignment = (path) =>
  lazy(() => import(`../site-pages/admin/Assignment/${path}.jsx`));
const lazyLoadQuiz = (path) =>
  lazy(() => import(`../site-pages/admin/Quiz/${path}.jsx`));
const lazyLoadApplication = (path) =>
  lazy(() => import(`../site-pages/admin/StudentManagement/Application/${path}.jsx`));
const lazyLoadClassAttendance = (path) =>
  lazy(() => import(`../site-pages/admin/StudentManagement/Attendance/${path}.jsx`));
const lazyLoadInternship = (path) =>
  lazy(() => import(`../site-pages/admin/StudentCorner/Internship/${path}.jsx`));
const lazyLoadPlacement = (path) =>
  lazy(() => import(`../site-pages/admin/StudentCorner/Placement/${path}.jsx`));
const lazyLoadVisitorManagement = (path) =>
  lazy(() => import(`../site-pages/admin/VisitorManagement/${path}.jsx`));
const lazyLoadAnnouncements = (path) =>
  lazy(() => import(`../site-pages/admin/Announcements/${path}.jsx`));

const Navbar = lazy(() => import("../site-pages/admin/Navbar"));
const lazyLoadHostelManagement = (path) => lazy(() => import(`../site-pages/admin/HostelManagement/${path}.jsx`));
const lazyLoadSessionWiseSemester = (path) =>
  lazy(() => import(`../site-pages/admin/LearningManagement/SessionWiseSemester/${path}.jsx`));
const lazyLoadReports = (path) =>
  lazy(() => import(`../site-pages/admin/Reports/Student/Reports.jsx`));
const lazyLoadBanner = (path) =>
  lazy(() => import(`../site-pages/admin/Banner/${path}.jsx`));
const lazyLoadExpense = (path) =>
  lazy(() => import(`../site-pages/admin/Expense/${path}.jsx`));
const lazyLoadUniversitySetting = (path) =>
  lazy(() => import(`../site-pages/admin/UniversitySetting/${path}.jsx`));


const components = {
  AdminMailVerification: lazyLoad("AdminMailVerification"),
  Achievement: lazyLoad("Achievement"),
  AddAchievement: lazyLoad("AddAchievement"),
  PopupNotice: lazyLoad("PopupNotice"),
  EmailSetting: lazyLoad("EmailSetting"),
  SEOSetting: lazyLoad("SEOSetting"),
  SocialMediaSetting: lazyLoad("SocialMediaSetting"),
  ContactIconSetting: lazyLoad("ContactIconSetting"),
  ContactSetting: lazyLoad("ContactSetting"),
  CopyrightPolicy: lazyLoad("CopyrightPolicy"),
  TermsAndUse: lazyLoad("TermsAndUse"),
  MarqueSlide: lazyLoad("MarqueSlide"),
  AddVendorForm: lazyLoad("AddVendorForm"),
  Vendor: lazyLoad("Vendor"),
  Book: lazyLoad("Book"),
  AddBook: lazyLoad("AddBook"),
  Specility: lazyLoad("Specility"),
  AddSpecility: lazyLoad("AddSpecility"),
  StudentTestimonial: lazyLoad("StudentTestimonial"),
  StudentTestimonialForm: lazyLoad("StudentTestimonialForm"),
  KeynoteSpeaker: lazyLoad("KeynoteSpeaker"),
  KeynoteSpeakerList: lazyLoad("KeynoteSpeakerList"),
  Feedback: lazyLoad("Feedback"),
  Contact: lazyLoad("Contact"),
  ContactHistory: lazyLoad("ContactHistory"),
  UpdateCourseContent: lazyLoad("UpdateCourseContent"),
  GalleryImageView: lazyLoad("GalleryImageView"),
  VideoGallery: lazyLoad("VideoGallery"),
  VideoGalleryForm: lazyLoad("VideoGalleryForm"),
  GalleryVideoView: lazyLoad("GalleryVideoView"),
  JobRecruitmentList: lazyLoad("JobRecruitmentList"),
  JobRecruitmentForm: lazyLoad("JobRecruitmentForm"),
  JobApplication: lazyLoad("JobApplication"),
  JobApplicationDetail: lazyLoad("JobApplicationDetail"),
  IssueBook: lazyLoad("IssueBook"),
  IssueBookAdd: lazyLoad("IssueBookAdd"),
  IssueBookReturn: lazyLoad("IssueBookReturn"),
  IssuedBookStatus: lazyLoad("IssuedBookStatus"),
  IssueBookReceipt: lazyLoad("IssueBookReceipt"),
  GalleryCategory: lazyLoad("GalleryCategory"),
  VideoAtWebsiteHome: lazyLoad("VideoAtWebsiteHome"),
  LibrarySetting: lazyLoad("LibrarySetting"),
  PlacementForm: lazyLoadPlacement("PlacementForm"),
  PlacementApplicationListing: lazyLoadPlacement("PlacementApplicationListing"),
  PlacementApplicationViewPage: lazyLoadPlacement("PlacementApplicationViewPage"),
  Placement: lazyLoadPlacement("Placement"),
  PrivacyPolicy: lazyLoad("PrivacyPolicy"),
  TermsAndConditions: lazyLoad("TermsAndConditions"),
  AntiRagging: lazyLoad("AntiRagging"),
  Internship: lazyLoadInternship("Internship"),
  AddInternshipForm: lazyLoadInternship("AddInternshipForm"),
  InternshipApplicationListing: lazyLoadInternship("InternshipApplicationListing"),
  InternshipApplicationViewPage: lazyLoadInternship("InternshipApplicationViewPage"),
  Scholarship: lazyLoad("Scholarship"),
  AddScholarship: lazyLoad("AddScholarship"),
  BrandSetting: lazyLoad("BrandSetting"),
  JobCategory: lazyLoad("JobCategory"),
  Grievance: lazyLoad("Grievance"),
  Vission: lazyLoad("Vission"),
  Mission: lazyLoad("Mission"),
  ForgetPassword: lazyLoad("ForgetPassword"),
  SignIn: lazyLoad("SignIn"),
  FacultyDepartment: lazyLoad("FacultyDepartment"),
  Department: lazyLoad("Department"),
  Designation: lazyLoad("Designation"),
  Subject: lazyLoad("Subject"),
  Course: lazyLoad("Course"),
  AddCourse: lazyLoad("AddCourse"),
  Session: lazyLoad("Session"),
  AddPage: lazyLoad("AddPage"),
  PageList: lazyLoad("PageList"),
  MenuList: lazyLoad("MenuList"),
  AddMenu: lazyLoad("AddMenu"),
  FacultyList: lazyLoad("FacultyList"),
  FacultyForm: lazyLoad("FacultyForm"),
  Home: lazyLoad("Home"),
  NoticeList: lazyLoad("NoticeList"),
  AddNotice: lazyLoad("AddNotice"),
  About: lazyLoad("About"),
  SignInFaculty: lazyLoad("SignInFaculty"),
  Message: lazyLoad("Message"),
  UseFulLinks: lazyLoad("UseFulLinks"),
  AddUseFulLinks: lazyLoad("AddUseFulLinks"),
  FaqList: lazyLoad("FaqList"),
  AddFaq: lazyLoad("AddFaq"),
  AddRole: lazyLoad("AddRole"),
  RoleList: lazyLoad("RoleList"),
  SemesterList: lazyLoad("SemesterList"),
  AddSemester: lazyLoad("AddSemester"),
  SemesterSubjectList: lazyLoad("SemesterSubjectList"),
  AddSemesterSubject: lazyLoad("AddSemesterSubject"),
  VisitorGenratePass: lazyLoadVisitorManagement("VisitorGenratePass"),
  VisitorPassHistory: lazyLoadVisitorManagement("VisitorPassHistory"),
  VisitorPass: lazyLoadVisitorManagement("VisitorPass"),
  Topic: lazyLoadTopic("Topic"),
  TopicAddNew: lazyLoadTopic("TopicAddNew"),
  AssignmentList: lazyLoadAssignment("AssignmentList"),
  AssignmentAddNew: lazyLoadAssignment("AssignmentAddNew"),
  AssignmentResponse: lazyLoadAssignment("AssignmentResponse"),
  AssignmentResponseView: lazyLoadAssignment("AssignmentResponseView"),
  AddQuestionInAssignment: lazyLoadAssignment("AddQuestionInAssignment"),
  QuizList: lazyLoadQuiz("QuizList"),
  AddQuiz: lazyLoadQuiz("AddQuiz"),

  AddQuestionInQuiz: lazyLoadQuiz("AddQuestionInQuiz"),
  QuizResponse: lazyLoadQuiz("QuizResponse"),
  QuizResponseView: lazyLoadQuiz("QuizResponseView"),
  StudentFeedbackList: lazyLoad("StudentFeedbackList"),
  NewApplication: lazyLoadApplication("NewApplication"),
  ViewApplication: lazyLoadApplication("ViewApplication"),
  EditApplication: lazyLoadApplication("EditApplication"),
  PreviewPreviousRegistration: lazyLoadApplication("PreviewPreviousRegistration"),
  ApprovedStudentList: lazyLoadApplication("ApprovedStudentList"),


  AllotRoomToStudent: lazyLoadHostelManagement("AllotRoomToStudent"),
  UpdateVacateDate: lazyLoadHostelManagement("UpdateVacateDate"),
  AllotedRoomHistory: lazyLoadHostelManagement("AllotedRoomHistory"),
  RaisedRoomQueries: lazyLoadHostelManagement("RaisedRoomQueries"),
  RaisedRoomComplain: lazyLoadHostelManagement("RaisedRoomComplain"),
  ViewAndResponseComplain: lazyLoadHostelManagement("ViewAndResponseComplain"),
  LeaveRequestList: lazyLoadHostelManagement("LeaveRequestList"),
  MarkHostelAttendanceForm: lazyLoadHostelManagement("MarkAttendanceForm"),
  HostelUpdateAttendance: lazyLoadHostelManagement("UpdateAttendance"),
  HostelAttendanceHistory: lazyLoadHostelManagement("AttendanceHistory"),
  MarkClassAttendanceForm: lazyLoadClassAttendance("MarkAttendanceForm"),
  ClassAttendanceHistory: lazyLoadClassAttendance("AttendanceHistory"),
  AddSessionWiseSemester: lazyLoadSessionWiseSemester("AddSessionWiseSemester"),
  SessionWiseSemesterList: lazyLoadSessionWiseSemester("SessionWiseSemesterList"),
  Reports: lazyLoadReports("Reports"),
  AddBanner: lazyLoadBanner("AddBanner"),
  BannerList: lazyLoadBanner("BannerList"),
  ExpenseCategory: lazyLoadExpense("ExpenseCategory"),
  AddExpense: lazyLoadExpense("AddExpense"),
  ExpenseList: lazyLoadExpense("ExpenseList"),
  SessionSetting: lazyLoadUniversitySetting("SessionSetting"),
  AddCalendar:lazyLoadAnnouncements('AddCalendar'),
  CalendarList:lazyLoadAnnouncements('CalendarList')
};
components.AddResourcePdf = lazy(() => import("../site-pages/admin/Resource/Pdf/AddPdfResource.jsx"));
components.ResourcePdfList = lazy(() => import("../site-pages/admin/Resource/Pdf/PdfResourceList.jsx"));
components.AddResourceLiveClassUrl = lazy(() => import("../site-pages/admin/Resource/LiveClass/AddResourceLiveClass.jsx"));
components.ResourceLiveClassUrlList = lazy(() => import("../site-pages/admin/Resource/LiveClass/ResourceLiveClassUrlList.jsx"));
components.AddResourceVideo = lazy(() => import("../site-pages/admin/Resource/Video/AddResourceVideo.jsx"));
components.ResourceVideoList = lazy(() => import("../site-pages/admin/Resource/Video/ResourceVideoList.jsx"));
components.AddNewHostelRoom = lazy(() => import("../site-pages/admin/HostelManagement/AddNewRoom.jsx"));
components.HostelRoomList = lazy(() => import("../site-pages/admin/HostelManagement/RoomList.jsx"));
components.HostelVisitorEntry = lazy(() => import("../site-pages/admin/HostelManagement/VisitorAdd.jsx"));
components.HostelVisitorHistory = lazy(() => import("../site-pages/admin/HostelManagement/VisitorHistory.jsx"));
components.VisitorRegistration = lazy(() => import("../site-pages/admin/VisitorManagement/Registration.jsx"));
components.VisitorRegistrationList = lazy(() => import("../site-pages/admin/VisitorManagement/VisitorRegistrationList.jsx"));
components.AddNewTimeTable = lazy(() => import("../site-pages/admin/TimeTable/AddNew.jsx"));
components.TimeTableList = lazy(() => import("../site-pages/admin/TimeTable/List.jsx"));
components.TimeSlot = lazy(() => import("../site-pages/admin/TimeTable/TimeSlot.jsx"));
components.TimeTableChartPrint = lazy(() => import("../site-pages/admin/TimeTable/TimeTableChartPrint.jsx"));
components.SubjectsAssignedFaculty = lazy(() => import("../site-pages/admin/TimeTable/SubjectsAssignedFaculty.jsx"));
components.SubjectsAssignedFacultyList = lazy(() => import("../site-pages/admin/TimeTable/SubjectsAssignedFacultyList.jsx"));
components.CommunicationManagementMessage = lazy(() => import("../site-pages/admin/CommunicationManagement/Message.jsx"));
components.CommunicationManagementMessageList = lazy(() => import("../site-pages/admin/CommunicationManagement/MessageList.jsx"));
components.CommunicationManagementMessageView = lazy(() => import("../site-pages/admin/CommunicationManagement/CommunicationManagementMessageView.jsx"));
components.InventoryCategory = lazy(() => import("../site-pages/admin/Inventory/List.jsx"));
components.AddInventoryProduct = lazy(() => import("../site-pages/admin/Inventory/AddProduct.jsx"));
components.InventoryProductList = lazy(() => import("../site-pages/admin/Inventory/ProductList.jsx"));
components.InventoryProductThresholdList = lazy(() => import("../site-pages/admin/Inventory/InventoryProductThresholdList.jsx"));
components.InventoryProductThresholdRaisedQuery = lazy(() => import("../site-pages/admin/Inventory/InventoryProductThresholdRaisedQuery.jsx"));
components.InventoryProductThresholdRaisedQueryNotification = lazy(() => import("../site-pages/admin/Inventory/InventoryProductThresholdRaisedQueryNotification.jsx"));
components.InventoryProductThresholdRaisedQueryNotificationViewAdmin = lazy(() => import("../site-pages/admin/Inventory/InventoryProductThresholdRaisedQueryNotificationViewAdmin.jsx"));
components.StockInAdd = lazy(() => import("../site-pages/admin/Inventory/StockInAdd.jsx"));
components.StockInList = lazy(() => import("../site-pages/admin/Inventory/StockInList.jsx"));
components.StockOutAdd = lazy(() => import("../site-pages/admin/Inventory/StockOutAdd.jsx"));
components.StockOutList = lazy(() => import("../site-pages/admin/Inventory/StockOutList.jsx"));
components.AddExamPaper = lazy(() => import("../site-pages/admin/Exam/AddExamPaper.jsx"));
components.ViewSubjectMarks = lazy(() => import("../site-pages/admin/Exam/ViewSubjectMarks.jsx"));
components.ExamPaperList = lazy(() => import("../site-pages/admin/Exam/ExamPaperList.jsx"));
components.ExamPaperAddQuestion = lazy(() => import("../site-pages/admin/Exam/ExamPaperAddQuestion.jsx"));
components.ExamAdmitCard = lazy(() => import("../site-pages/admin/Exam/ExamAdmitCard.jsx"));
components.CompiledAttendance = lazy(() => import("../site-pages/admin/Attendance/CompiledAttendance.jsx"));
components.ExamPaperView = lazy(() => import("../site-pages/admin/Exam/ExamPaperPrinting.jsx"));
components.ExamPaperUploadMarks = lazy(() => import("../site-pages/admin/Exam/UploadMarks.jsx"));
components.StudentReportDetails = lazy(() => import("../site-pages/admin/Reports/Student/StudentReportDetails.jsx"));
components.SubjectReport = lazy(() => import("../site-pages/admin/Reports/Student/SubjectReport.jsx"));
components.InventoryReport = lazy(() => import("../site-pages/admin/Reports/Student/InventoryReport.jsx"));
components.LibraryReport = lazy(() => import("../site-pages/admin/Reports/Student/LibraryReport.jsx"));
components.AdminDashboard = lazy(() => import("../site-pages/admin/AdminDashboard.jsx"));
components.UserLogList = lazy(() => import("../site-pages/admin/UserLogList.jsx"));
components.FacultyDashboard = lazy(() => import("../site-pages/admin/FacultyDashboard.jsx"));
components.ViewCompiledAttendance = lazy(() => import("../site-pages/admin/Attendance/ViewCompiledAttendance.jsx"));
components.CellComplainList = lazy(() => import("../site-pages/admin/CellComplainList.jsx"));
components.FileManager = lazy(() => import("../site-pages/admin/FileManager.jsx"));
components.CellComplainDetails = lazy(() => import("../site-pages/admin/CellComplainDetails.jsx"));

// eslint-disable-next-line react/prop-types
function AdminRoute({ toggleExpand, toggleFolded }) {
  const isLoggedIn = IsAdminLoggedIn();
  return (
    <>
      {isLoggedIn && (
        <Navbar toggleExpand={toggleExpand} toggleFolded={toggleFolded} />
      )}
      <ErrorBoundary>
        <Suspense fallback={<SuspensionLoader />}>
          <ToastContainer
            autoClose={5000}
            position="top-right"
            hideProgressBar={false}
            draggable
            pauseOnHover
            closeOnClick
          />
          <Routes>
            <Route path="/" element={<Navigate to="/admin/signin" />} />
            <Route path="/compoundv" element={<components.SignIn />} />
            <Route path="/signin" element={<components.SignInFaculty />} />
            <Route
              path="/forget-password"
              element={<components.ForgetPassword />}
            />
            <Route
              path="/home"
              element={<ProtectedRoute element={<components.Home />} />}
            />
                        <Route path="/book-stock-history" element={<ProtectedRoute element={<LibraryListing  />} />} />

            <Route
              path="/admin-dashboard"
              element={<ProtectedRoute element={<components.AdminDashboard />} />}
            />
            <Route
              path="/user-log"
              element={<ProtectedRoute element={<components.UserLogList />} />}
            />
            <Route
              path="/faculty-dashboard"
              element={<ProtectedRoute element={<components.FacultyDashboard />} />}
            />
            <Route
              path="/vission"
              element={<ProtectedRoute element={<components.Vission />} />}
            />
            {/** HOSTEL ROOM MANAGEMENT */}
            <Route
              path="/add-hostel-room/:dbId?"
              element={
                <ProtectedRoute element={<components.AddNewHostelRoom />} />
              }
            />
            <Route
              path="/hostel-room-list"
              element={<ProtectedRoute element={<components.HostelRoomList />} />}
            />
            {/** VISITOR ENTRY MANAGEMENT */}
            <Route
              path="/visitor-entry/:dbId?"
              element={
                <ProtectedRoute element={<components.HostelVisitorEntry />} />
              }
            />
            <Route
              path="/hostel-visitor-history"
              element={
                <ProtectedRoute element={<components.HostelVisitorHistory />} />
              }
            />
            {/** VISITOR REGISTRATION MANAGEMENT */}
            <Route
              path="/visitor-registration/:dbId?"
              element={
                <ProtectedRoute element={<components.VisitorRegistration />} />
              }
            />
            <Route
              path="/visitor-registration-list"
              element={
                <ProtectedRoute
                  element={<components.VisitorRegistrationList />}
                />
              }
            />
            <Route
              path="/grievance"
              element={<ProtectedRoute element={<components.Grievance />} />}
            />
            <Route
              path="/faculty-form"
              element={<ProtectedRoute element={<components.FacultyForm />} />}
            />
            <Route
              path="/faculty-list"
              element={<ProtectedRoute element={<components.FacultyList />} />}
            />
            <Route
              path="/message"
              element={<ProtectedRoute element={<components.Message />} />}
            />
            <Route
              path="/mission"
              element={<ProtectedRoute element={<components.Mission />} />}
            />
            <Route
              path="/privacy-policy"
              element={<ProtectedRoute element={<components.PrivacyPolicy />} />}
            />
            <Route
              path="/terms-and-conditions"
              element={
                <ProtectedRoute element={<components.TermsAndConditions />} />
              }
            />
            <Route
              path="/anti-ragging"
              element={<ProtectedRoute element={<components.AntiRagging />} />}
            />
            <Route
              path="/message-form"
              element={<ProtectedRoute element={<MessageForm />} />}
            />
            <Route
              path="/editDetail/:id"
              element={<ProtectedRoute element={<components.FacultyForm />} />}
            />
            <Route
              path="/edit-message/:id"
              element={<ProtectedRoute element={<MessageForm />} />}
            />
            <Route
              path="/about"
              element={<ProtectedRoute element={<components.About />} />}
            />
            <Route
              path="/video-gallery"
              element={<ProtectedRoute element={<components.VideoGallery />} />}
            />
            <Route
              path="/video-galleryform"
              element={
                <ProtectedRoute element={<components.VideoGalleryForm />} />
              }
            />
            <Route
              path="/edit-video-gallery/:id"
              element={
                <ProtectedRoute element={<components.VideoGalleryForm />} />
              }
            />
            <Route
              path="/student-feedback-list"
              element={
                <ProtectedRoute element={<components.StudentFeedbackList />} />
              }
            />
            <Route
              path="/Gallery-form"
              element={<ProtectedRoute element={<GalleryForm />} />}
            />
            <Route
              path="/view-gallery-image/:id"
              element={
                <ProtectedRoute element={<components.GalleryImageView />} />
              }
            />
            <Route
              path="/view-gallery-video/:id"
              element={
                <ProtectedRoute element={<components.GalleryVideoView />} />
              }
            />
            <Route
              path="/vendor"
              element={<ProtectedRoute element={<components.Vendor />} />}
            />
            <Route
              path="/calendar"
              element={<ProtectedRoute element={<components.CalendarList />} />}
            />
            <Route
              path="/calendar/add-new"
              element={<ProtectedRoute element={<components.AddCalendar />} />}
            />
            <Route
              path="/calendar/edit/:dbId"
              element={<ProtectedRoute element={<components.AddCalendar />} />}
            />
            <Route
              path="/add-vendor"
              element={<ProtectedRoute element={<components.AddVendorForm />} />}
            />
            <Route
              path="/edit-vendor-detail/:id"
              element={<ProtectedRoute element={<components.AddVendorForm />} />}
            />
            <Route
              path="/book"
              element={<ProtectedRoute element={<components.Book />} />}
            />
            <Route
              path="/add-book"
              element={<ProtectedRoute element={<components.AddBook />} />}
            />
            <Route
              path="/edit-book-detail/:id"
              element={<ProtectedRoute element={<components.AddBook />} />}
            />
            <Route
              path="/issue-book/"
              element={<ProtectedRoute element={<components.IssueBook />} />}
            />
            <Route
              path="/issue-book-add/"
              element={<ProtectedRoute element={<components.IssueBookAdd />} />}
            />
            <Route
              path="/return-book/:id"
              element={
                <ProtectedRoute element={<components.IssueBookReturn />} />
              }
            />
            <Route
              path="/book-status/:id"
              element={
                <ProtectedRoute element={<components.IssuedBookStatus />} />
              }
            />
            <Route
              path="/issue-book-receipt/:id"
              element={
                <ProtectedRoute element={<components.IssueBookReceipt />} />
              }
            />
            <Route
              path="/specility"
              element={<ProtectedRoute element={<components.Specility />} />}
            />
            <Route
              path="/add-specility"
              element={<ProtectedRoute element={<components.AddSpecility />} />}
            />
            <Route
              path="/edit-specility-detail/:id"
              element={<ProtectedRoute element={<components.AddSpecility />} />}
            />
            <Route
              path="/student-testimonial"
              element={
                <ProtectedRoute element={<components.StudentTestimonial />} />
              }
            />
            <Route
              path="/add-student-testimonial"
              element={
                <ProtectedRoute element={<components.StudentTestimonialForm />} />
              }
            />

            <Route
              path="/add-keynote-speaker/:mrq_slider_id"
              element={
                <ProtectedRoute element={<components.KeynoteSpeaker />} />
              }
            />
            <Route
              path="/edit-keynote-speaker/:mrq_slider_id/:key_note_id"
              element={
                <ProtectedRoute element={<components.KeynoteSpeaker />} />
              }
            />
            <Route
              path="/keynote-speaker-list/:mrq_slider_id"
              element={
                <ProtectedRoute element={<components.KeynoteSpeakerList />} />
              }
            />
            <Route
              path="/edit-student-testimonial-detail/:id"
              element={
                <ProtectedRoute element={<components.StudentTestimonialForm />} />
              }
            />

            <Route
              path="/add-student-testimonial"
              element={
                <ProtectedRoute element={<components.StudentTestimonialForm />} />
              }
            />
            <Route
              path="/edit-student-testimonial-detail/:id"
              element={
                <ProtectedRoute element={<components.StudentTestimonialForm />} />
              }
            />
            <Route
              path="/topic"
              element={<ProtectedRoute element={<components.Topic />} />}
            />
            <Route
              path="/topic/add-new"
              element={<ProtectedRoute element={<components.TopicAddNew />} />}
            />
            <Route
              path="/edit-topic/:topicId"
              element={<ProtectedRoute element={<components.TopicAddNew />} />}
            />
            <Route
              path="/assignment"
              element={<ProtectedRoute element={<components.AssignmentList />} />}
            />
            <Route
              path="/assignment/add-new"
              element={
                <ProtectedRoute element={<components.AssignmentAddNew />} />
              }
            />
            <Route
              path="/quiz"
              element={<ProtectedRoute element={<components.QuizList />} />}
            />
            <Route
              path="/quiz/add-new"
              element={<ProtectedRoute element={<components.AddQuiz />} />}
            />
            <Route
              path="/edit-assignment/:assignmentId"
              element={
                <ProtectedRoute element={<components.AssignmentAddNew />} />
              }
            />
            <Route
              path="/edit-quiz/:quizId"
              element={<ProtectedRoute element={<components.AddQuiz />} />}
            />
            <Route
              path="/cms/banner/add-new"
              element={<ProtectedRoute element={<components.AddBanner />} />}
            />
            <Route
              path="/cms/banner/list"
              element={<ProtectedRoute element={<components.BannerList />} />}
            />
            <Route
              path="/job-category"
              element={<ProtectedRoute element={<components.JobCategory />} />}
            />
            <Route
              path="/job-recruitment"
              element={
                <ProtectedRoute element={<components.JobRecruitmentList />} />
              }
            />
            <Route
              path="/job-recruitment-form"
              element={
                <ProtectedRoute element={<components.JobRecruitmentForm />} />
              }
            />
            <Route
              path="/edit-job-recruitment/:id"
              element={
                <ProtectedRoute element={<components.JobRecruitmentForm />} />
              }
            />
            <Route
              path="/feedback/"
              element={<ProtectedRoute element={<components.Feedback />} />}
            />
            <Route
              path="/contact/"
              element={<ProtectedRoute element={<components.Contact />} />}
            />
            <Route
              path="/contact/:id"
              element={<ProtectedRoute element={<components.ContactHistory />} />}
            />
            <Route
              path="/gallery-category"
              element={
                <ProtectedRoute element={<components.GalleryCategory />} />
              }
            />
            <Route
              path="/Gallery"
              element={<ProtectedRoute element={<Gallery />} />}
            />
            <Route
              path="/edit-gallery/:id"
              element={<ProtectedRoute element={<GalleryForm />} />}
            />
            <Route
              path="/add-placement"
              element={<ProtectedRoute element={<components.PlacementForm />} />}
            />
            -
            <Route
              path="/edit-placement/:id"
              element={<ProtectedRoute element={<components.PlacementForm />} />}
            />
            <Route
              path="/placement"
              element={<ProtectedRoute element={<components.Placement />} />}
            />
            <Route
              path="/internship"
              element={<ProtectedRoute element={<components.Internship />} />}
            />
            <Route
              path="/add-internship"
              element={
                <ProtectedRoute element={<components.AddInternshipForm />} />
              }
            />
            <Route
              path="/edit-internship/:id"
              element={
                <ProtectedRoute element={<components.AddInternshipForm />} />
              }
            />
            <Route
              path="/add-scholarship"
              element={<ProtectedRoute element={<components.AddScholarship />} />}
            />
            <Route
              path="/edit-scholarship/:id"
              element={<ProtectedRoute element={<components.AddScholarship />} />}
            />
            <Route
              path="/scholarship"
              element={<ProtectedRoute element={<components.Scholarship />} />}
            />
            <Route
              path="/brand-setting"
              element={<ProtectedRoute element={<components.BrandSetting />} />}
            />
            <Route
              path="/contact-setting"
              element={<ProtectedRoute element={<components.ContactSetting />} />}
            />
            <Route
              path="/contact-icon-setting"
              element={
                <ProtectedRoute element={<components.ContactIconSetting />} />
              }
            />
            <Route
              path="/session-setting"
              element={
                <ProtectedRoute element={<components.SessionSetting />} />
              }
            />
            <Route
              path="/social-media-setting"
              element={
                <ProtectedRoute element={<components.SocialMediaSetting />} />
              }
            />
            <Route
              path="/seo-setting"
              element={<ProtectedRoute element={<components.SEOSetting />} />}
            />
            <Route
              path="/email-setting"
              element={<ProtectedRoute element={<components.EmailSetting />} />}
            />
            <Route
              path="/verify-email"
              element={<components.AdminMailVerification />}
            />
            <Route
              path="/copyright-policy"
              element={<components.CopyrightPolicy />}
            />
            <Route
              path="/termanduse-policy"
              element={<components.TermsAndUse />}
            />
            <Route path="/marque-slide" element={<components.MarqueSlide />} />

            <Route
              path="/session"
              element={<ProtectedRoute element={<components.Session />} />}
            />
            <Route
              path="/department-faculty"
              element={
                <ProtectedRoute element={<components.FacultyDepartment />} />
              }
            />
            <Route
              path="/department"
              element={<ProtectedRoute element={<components.Department />} />}
            />
            <Route
              path="/job-applications"
              element={<ProtectedRoute element={<components.JobApplication />} />}
            />
            <Route
              path="/job-application/:id"
              element={
                <ProtectedRoute element={<components.JobApplicationDetail />} />
              }
            />
            <Route
              path="/subject"
              element={<ProtectedRoute element={<components.Subject />} />}
            />
            <Route
              path="/course"
              element={<ProtectedRoute element={<components.Course />} />}
            />
            <Route
              path="/update-course-content/:id"
              element={
                <ProtectedRoute element={<components.UpdateCourseContent />} />
              }
            />
            <Route
              path="/add-course"
              element={<ProtectedRoute element={<components.AddCourse />} />}
            />
            <Route
              path="/add-course/:courseId"
              element={<ProtectedRoute element={<components.AddCourse />} />}
            />
            <Route
              path="/add-page"
              element={<ProtectedRoute element={<components.AddPage />} />}
            />
            <Route
              path="/add-page/:pageid"
              element={<ProtectedRoute element={<components.AddPage />} />}
            />
            <Route
              path="/page-list"
              element={<ProtectedRoute element={<components.PageList />} />}
            />
            <Route
              path="/menu-list"
              element={<ProtectedRoute element={<components.MenuList />} />}
            />
            <Route
              path="/add-menu"
              element={<ProtectedRoute element={<components.AddMenu />} />}
            />
            <Route
              path="/add-menu/:menuid"
              element={<ProtectedRoute element={<components.AddMenu />} />}
            />
            <Route
              path="/notice-list"
              element={<ProtectedRoute element={<components.NoticeList />} />}
            />
            <Route
              path="/add-notice"
              element={<ProtectedRoute element={<components.AddNotice />} />}
            />
            <Route
              path="/add-notice/:noticeid"
              element={<ProtectedRoute element={<components.AddNotice />} />}
            />
            <Route
              path="/useful-links"
              element={<ProtectedRoute element={<components.UseFulLinks />} />}
            />
            <Route
              path="/add-useful-link"
              element={<ProtectedRoute element={<components.AddUseFulLinks />} />}
            />
            <Route
              path="/add-useful-link/:dbId"
              element={<ProtectedRoute element={<components.AddUseFulLinks />} />}
            />
            <Route
              path="/faq-list"
              element={<ProtectedRoute element={<components.FaqList />} />}
            />
            <Route
              path="/add-faq"
              element={<ProtectedRoute element={<components.AddFaq />} />}
            />
            <Route
              path="/add-faq/:dbId"
              element={<ProtectedRoute element={<components.AddFaq />} />}
            />
            <Route
              path="/designation"
              element={<ProtectedRoute element={<components.Designation />} />}
            />
            <Route
              path="/add-role"
              element={<ProtectedRoute element={<components.AddRole />} />}
            />
            <Route
              path="/add-role/:dbId"
              element={<ProtectedRoute element={<components.AddRole />} />}
            />
            <Route
              path="/role-list"
              element={<ProtectedRoute element={<components.RoleList />} />}
            />
            <Route
              path="/semester"
              element={<ProtectedRoute element={<components.SemesterList />} />}
            />
            <Route
              path="/add-semester"
              element={<ProtectedRoute element={<components.AddSemester />} />}
            />
            <Route
              path="/edit-semester/:semesterId"
              element={<ProtectedRoute element={<components.AddSemester />} />}
            />
            <Route
              path="/semester-subject"
              element={
                <ProtectedRoute element={<components.SemesterSubjectList />} />
              }
            />
            <Route
              path="/add-semester-subject"
              element={
                <ProtectedRoute element={<components.AddSemesterSubject />} />
              }
            />
            <Route
              path="/add-genrate-pass/:dbId"
              element={
                <ProtectedRoute element={<components.VisitorGenratePass />} />
              }
            />
            <Route
              path="/visitor-pass-history/:dbId"
              element={
                <ProtectedRoute element={<components.VisitorPassHistory />} />
              }
            />
            <Route
              path="/visitor-pass/:dbId"
              element={<ProtectedRoute element={<components.VisitorPass />} />}
            />
            <Route
              path="/video-at-website-home"
              element={
                <ProtectedRoute element={<components.VideoAtWebsiteHome />} />
              }
            />
            <Route
              path="/add-semester-subject/:semesterId"
              element={
                <ProtectedRoute element={<components.AddSemesterSubject />} />
              }
            />
            <Route
              path="/achievement-list"
              element={<ProtectedRoute element={<components.Achievement />} />}
            />
            <Route
              path="/add-achievement"
              element={<ProtectedRoute element={<components.AddAchievement />} />}
            />
            <Route
              path="/edit-achievement/:id"
              element={<ProtectedRoute element={<components.AddAchievement />} />}
            />
            <Route
              path="/add-resource-pdf"
              element={<ProtectedRoute element={<components.AddResourcePdf />} />}
            />
            <Route
              path="/add-resource-pdf/:dbId"
              element={<ProtectedRoute element={<components.AddResourcePdf />} />}
            />
            <Route
              path="/list-resource-pdf"
              element={
                <ProtectedRoute element={<components.ResourcePdfList />} />
              }
            />
            <Route
              path="/add-resource-video"
              element={
                <ProtectedRoute element={<components.AddResourceVideo />} />
              }
            />
            <Route
              path="/add-resource-video/:dbId"
              element={
                <ProtectedRoute element={<components.AddResourceVideo />} />
              }
            />
            <Route
              path="/list-resource-video"
              element={
                <ProtectedRoute element={<components.ResourceVideoList />} />
              }
            />
            <Route
              path="/add-resource-live-class-url"
              element={
                <ProtectedRoute
                  element={<components.AddResourceLiveClassUrl />}
                />
              }
            />
            <Route
              path="/add-resource-live-class-url/:dbId"
              element={
                <ProtectedRoute
                  element={<components.AddResourceLiveClassUrl />}
                />
              }
            />
            <Route
              path="/attendance-management/view-compile-attendance"
              element={
                <ProtectedRoute
                  element={<components.ViewCompiledAttendance />}
                />
              }
            />
            <Route
              path="/resource-live-class-url"
              element={
                <ProtectedRoute
                  element={<components.ResourceLiveClassUrlList />}
                />
              }
            />
            <Route
              path="/popup-notice"
              element={<ProtectedRoute element={<components.PopupNotice />} />}
            />
            <Route
              path="/library-setting"
              element={<ProtectedRoute element={<components.LibrarySetting />} />}
            />
            <Route
              path="/application-list"
              element={<ProtectedRoute element={<components.NewApplication />} />}
            />
            <Route
              path="/view-addmission-application/:sid"
              element={
                <ProtectedRoute element={<components.ViewApplication />} />
              }
            />
            <Route
              path="/view-addmission-application/edit/:sid"
              element={
                <ProtectedRoute element={<components.EditApplication />} />
              }
            />
            <Route
              path="/application/preview-previous-registration/:sid/:selectedcourse"
              element={
                <ProtectedRoute
                  element={<components.PreviewPreviousRegistration />}
                />
              }
            />
            <Route
              path="/student-management/student-list"
              element={
                <ProtectedRoute
                  element={<components.ApprovedStudentList />}
                />
              }
            />
            {/** GRIEVANCE MANAGEMENT */}
            <Route
              path="/grievance"
              element={<ProtectedRoute element={<components.Grievance />} />}
            />
            {/** FACULTY MANAGEMENT */}
            <Route
              path="/faculty-form"
              element={<ProtectedRoute element={<components.FacultyForm />} />}
            />{" "}
            {/* Add/Edit Faculty Form */}
            <Route
              path="/faculty-list"
              element={<ProtectedRoute element={<components.FacultyList />} />}
            />{" "}
            {/* List of Faculties */}
            <Route
              path="/editDetail/:id"
              element={<ProtectedRoute element={<components.FacultyForm />} />}
            />{" "}
            {/* Edit Faculty Details */}
            {/** MESSAGE MANAGEMENT */}
            <Route
              path="/message"
              element={<ProtectedRoute element={<components.Message />} />}
            />{" "}
            {/* Message Page */}
            <Route
              path="/message-form"
              element={<ProtectedRoute element={<MessageForm />} />}
            />{" "}
            {/* Create/Edit Message Form */}
            <Route
              path="/edit-message/:id"
              element={<ProtectedRoute element={<MessageForm />} />}
            />{" "}
            {/* Edit Message Details */}
            {/** GENERAL ROUTES */}
            <Route
              path="/mission"
              element={<ProtectedRoute element={<components.Mission />} />}
            />{" "}
            {/* Mission Page */}
            <Route
              path="/privacy-policy"
              element={<ProtectedRoute element={<components.PrivacyPolicy />} />}
            />{" "}
            {/* Privacy Policy Page */}
            <Route
              path="/terms-and-conditions"
              element={
                <ProtectedRoute element={<components.TermsAndConditions />} />
              }
            />{" "}
            {/* Terms & Conditions Page */}
            <Route
              path="/anti-ragging"
              element={<ProtectedRoute element={<components.AntiRagging />} />}
            />{" "}
            {/* Anti-Ragging Policy */}
            {/** ABOUT PAGE */}
            <Route
              path="/about"
              element={<ProtectedRoute element={<components.About />} />}
            />{" "}
            {/* About Us Page */}
            {/** VIDEO GALLERY MANAGEMENT */}
            <Route
              path="/video-gallery"
              element={<ProtectedRoute element={<components.VideoGallery />} />}
            />{" "}
            {/* Video Gallery */}
            <Route
              path="/video-galleryform"
              element={
                <ProtectedRoute element={<components.VideoGalleryForm />} />
              }
            />{" "}
            {/* Add/Edit Video Gallery */}
            <Route
              path="/edit-video-gallery/:id"
              element={
                <ProtectedRoute element={<components.VideoGalleryForm />} />
              }
            />{" "}
            {/* Edit Video Gallery Details */}
            {/** STUDENT FEEDBACK MANAGEMENT */}
            <Route
              path="/student-feedback-list"
              element={
                <ProtectedRoute element={<components.StudentFeedbackList />} />
              }
            />{" "}
            {/* List of Student Feedback */}
            {/** GALLERY MANAGEMENT */}
            <Route
              path="/Gallery-form"
              element={<ProtectedRoute element={<GalleryForm />} />}
            />{" "}
            {/* Add/Edit Gallery Item */}
            <Route
              path="/view-gallery-image/:id"
              element={
                <ProtectedRoute element={<components.GalleryImageView />} />
              }
            />{" "}
            {/* View Gallery Image */}
            <Route
              path="/view-gallery-video/:id"
              element={
                <ProtectedRoute element={<components.GalleryVideoView />} />
              }
            />{" "}
            {/* View Gallery Video */}
            {/** VENDOR MANAGEMENT */}
            <Route
              path="/vendor"
              element={<ProtectedRoute element={<components.Vendor />} />}
            />{" "}
            {/* Vendor Management Page */}
            <Route
              path="/add-vendor"
              element={<ProtectedRoute element={<components.AddVendorForm />} />}
            />{" "}
            {/* Add New Vendor */}
            <Route
              path="/edit-vendor-detail/:id"
              element={<ProtectedRoute element={<components.AddVendorForm />} />}
            />{" "}
            {/* Edit Vendor Details */}
            {/** BOOK MANAGEMENT */}
            <Route
              path="/book"
              element={<ProtectedRoute element={<components.Book />} />}
            />{" "}
            {/* Book Listing Page */}
            <Route
              path="/add-book"
              element={<ProtectedRoute element={<components.AddBook />} />}
            />{" "}
            {/* Add New Book */}
            <Route
              path="/edit-book-detail/:id"
              element={<ProtectedRoute element={<components.AddBook />} />}
            />{" "}
            {/* Edit Book Details */}
            {/** BOOK ISSUE AND RETURN */}
            <Route
              path="/issue-book/"
              element={<ProtectedRoute element={<components.IssueBook />} />}
            />{" "}
            {/* Issue Book to Student */}
            <Route
              path="/issue-book-add/"
              element={<ProtectedRoute element={<components.IssueBookAdd />} />}
            />{" "}
            {/* Add New Book Issue */}
            <Route
              path="/return-book/:id"
              element={
                <ProtectedRoute element={<components.IssueBookReturn />} />
              }
            />{" "}
            {/* Return Issued Book */}
            {/** BOOK STATUS AND RECEIPT */}
            <Route
              path="/book-status/:id"
              element={
                <ProtectedRoute element={<components.IssuedBookStatus />} />
              }
            />{" "}
            {/* View Book Issue Status */}
            <Route
              path="/issue-book-receipt/:id"
              element={
                <ProtectedRoute element={<components.IssueBookReceipt />} />
              }
            />{" "}
            {/* View Issue Book Receipt */}
            {/** SPECIALITY MANAGEMENT */}
            <Route
              path="/specility"
              element={<ProtectedRoute element={<components.Specility />} />}
            />{" "}
            {/* List of Specialities */}
            <Route
              path="/add-specility"
              element={<ProtectedRoute element={<components.AddSpecility />} />}
            />{" "}
            {/* Add New Speciality */}
            <Route
              path="/edit-specility-detail/:id"
              element={<ProtectedRoute element={<components.AddSpecility />} />}
            />{" "}
            {/* Edit Speciality Details */}
            {/** STUDENT TESTIMONIAL MANAGEMENT */}
            <Route
              path="/student-testimonial"
              element={
                <ProtectedRoute element={<components.StudentTestimonial />} />
              }
            />{" "}
            {/* List of Student Testimonials */}
            <Route
              path="/add-student-testimonial"
              element={
                <ProtectedRoute element={<components.StudentTestimonialForm />} />
              }
            />{" "}
            {/* Add New Student Testimonial */}
            <Route
              path="/edit-student-testimonial-detail/:id"
              element={
                <ProtectedRoute element={<components.StudentTestimonialForm />} />
              }
            />{" "}
            {/* Edit Student Testimonial */}
            {/** TOPIC MANAGEMENT */}
            <Route
              path="/topic"
              element={<ProtectedRoute element={<components.Topic />} />}
            />{" "}
            {/* List of Topics */}
            <Route
              path="/topic/add-new"
              element={<ProtectedRoute element={<components.TopicAddNew />} />}
            />{" "}
            {/* Add New Topic */}
            <Route
              path="/edit-topic/:topicId"
              element={<ProtectedRoute element={<components.TopicAddNew />} />}
            />{" "}
            {/* Edit Topic Details */}
            {/** ASSIGNMENT MANAGEMENT */}
            <Route
              path="/assignment"
              element={<ProtectedRoute element={<components.AssignmentList />} />}
            />{" "}
            {/* List of Assignments */}
            <Route
              path="/assignment/add-new"
              element={
                <ProtectedRoute element={<components.AssignmentAddNew />} />
              }
            />{" "}
            {/* Add New Assignment */}
            <Route
              path="/edit-assignment/:assignmentId"
              element={
                <ProtectedRoute element={<components.AssignmentAddNew />} />
              }
            />{" "}
            {/* Edit Assignment Details */}
            <Route
              path="/assignment/add-question/:assignmentId"
              element={
                <ProtectedRoute
                  element={<components.AddQuestionInAssignment />}
                />
              }
            />
            <Route
              path="/assignment-response"
              element={
                <ProtectedRoute element={<components.AssignmentResponse />} />
              }
            />{" "}
            {/* Edit Assignment Details */}
            <Route
              path="/assignment-response-view/:id"
              element={
                <ProtectedRoute element={<components.AssignmentResponseView />} />
              }
            />{" "}
            {/* Edit Assignment Details */}
            {/** QUIZ MANAGEMENT */}
            <Route
              path="/quiz"
              element={<ProtectedRoute element={<components.QuizList />} />}
            />{" "}
            {/* List of Quizzes */}
            <Route
              path="/quiz/add-new"
              element={<ProtectedRoute element={<components.AddQuiz />} />}
            />{" "}
            {/* Add New Quiz */}
            <Route
              path="/edit-quiz/:quizid"
              element={<ProtectedRoute element={<components.AddQuiz />} />}
            />{" "}
            {/* Edit Quiz Details */}
            <Route
              path="/quiz/add-question/:quizId"
              element={
                <ProtectedRoute element={<components.AddQuestionInQuiz />} />
              }
            />
            <Route
              path="/quiz-response"
              element={
                <ProtectedRoute element={<components.QuizResponse />} />
              }
            />{" "}
            <Route
              path="/quiz-response-view/:id"
              element={
                <ProtectedRoute element={<components.QuizResponseView />} />
              }
            />{" "}

            {/** JOB MANAGEMENT */}
            <Route
              path="/job-category"
              element={<ProtectedRoute element={<components.JobCategory />} />}
            />{" "}
            {/* List of Job Categories */}
            <Route
              path="/job-recruitment"
              element={
                <ProtectedRoute element={<components.JobRecruitmentList />} />
              }
            />{" "}
            {/* List of Job Recruitments */}
            <Route
              path="/job-recruitment-form"
              element={
                <ProtectedRoute element={<components.JobRecruitmentForm />} />
              }
            />{" "}
            {/* Add New Job Recruitment */}
            <Route
              path="/edit-job-recruitment/:id"
              element={
                <ProtectedRoute element={<components.JobRecruitmentForm />} />
              }
            />{" "}
            {/* Edit Job Recruitment Details */}
            {/** FEEDBACK MANAGEMENT */}
            <Route
              path="/feedback/"
              element={<ProtectedRoute element={<components.Feedback />} />}
            />{" "}
            {/* Feedback Page */}
            {/** CONTACT MANAGEMENT */}
            <Route
              path="/contact/"
              element={<ProtectedRoute element={<components.Contact />} />}
            />{" "}
            {/* Contact Information */}
            <Route
              path="/contact/:id"
              element={<ProtectedRoute element={<components.ContactHistory />} />}
            />{" "}
            {/* View Contact History */}
            {/** GALLERY MANAGEMENT */}
            <Route
              path="/gallery-category"
              element={
                <ProtectedRoute element={<components.GalleryCategory />} />
              }
            />{" "}
            {/* Gallery Category Management */}
            <Route
              path="/Gallery"
              element={<ProtectedRoute element={<Gallery />} />}
            />{" "}
            {/* Gallery Display Page */}
            <Route
              path="/edit-gallery/:id"
              element={<ProtectedRoute element={<GalleryForm />} />}
            />{" "}
            {/* Edit Gallery Item */}
            {/** PLACEMENT MANAGEMENT */}
            <Route
              path="/add-placement"
              element={<ProtectedRoute element={<components.PlacementForm />} />}
            />{" "}
            {/* Add New Placement */}
            <Route
              path="/edit-placement/:id"
              element={<ProtectedRoute element={<components.PlacementForm />} />}
            />{" "}
            {/* Edit Placement Details */}
            <Route
              path="/placement"
              element={<ProtectedRoute element={<components.Placement />} />}
            />{" "}
            {/* Placement Overview */}
            <Route
              path="/placement-application-listing"
              element={
                <ProtectedRoute
                  element={<components.PlacementApplicationListing />}
                />
              }
            />{" "}
            {/* Placement Applications List */}
            {/** INTERNSHIP MANAGEMENT */}
            <Route
              path="/internship"
              element={<ProtectedRoute element={<components.Internship />} />}
            />{" "}
            {/* Internship Management */}
            <Route
              path="/add-internship"
              element={
                <ProtectedRoute element={<components.AddInternshipForm />} />
              }
            />{" "}
            {/* Add New Internship */}
            {/** INTERNSHIP MANAGEMENT */}
            <Route
              path="/edit-internship/:id"
              element={
                <ProtectedRoute element={<components.AddInternshipForm />} />
              }
            />{" "}
            {/* Edit Internship Details */}
            <Route
              path="/internship-application-listing"
              element={
                <ProtectedRoute
                  element={<components.InternshipApplicationListing />}
                />
              }
            />{" "}
            {/* Internship Applications Listing */}
            <Route
              path="/internship-application/:id"
              element={
                <ProtectedRoute
                  element={<components.InternshipApplicationViewPage />}
                />
              }
            />{" "}
            {/* View Individual Internship Application */}
            {/** PLACEMENT APPLICATION MANAGEMENT */}
            <Route
              path="/placement-application/:id"
              element={
                <ProtectedRoute
                  element={<components.PlacementApplicationViewPage />}
                />
              }
            />{" "}
            {/* View Individual Placement Application */}
            {/** SCHOLARSHIP MANAGEMENT */}
            <Route
              path="/add-scholarship"
              element={<ProtectedRoute element={<components.AddScholarship />} />}
            />{" "}
            {/* Add New Scholarship */}
            <Route
              path="/edit-scholarship/:id"
              element={<ProtectedRoute element={<components.AddScholarship />} />}
            />{" "}
            {/* Edit Scholarship Details */}
            <Route
              path="/scholarship"
              element={<ProtectedRoute element={<components.Scholarship />} />}
            />{" "}
            {/* Scholarship Overview */}
            {/** SITE SETTINGS */}
            <Route
              path="/brand-setting"
              element={<ProtectedRoute element={<components.BrandSetting />} />}
            />{" "}
            {/* Brand Settings */}
            <Route
              path="/contact-setting"
              element={<ProtectedRoute element={<components.ContactSetting />} />}
            />{" "}
            {/* Contact Settings */}
            <Route
              path="/contact-icon-setting"
              element={
                <ProtectedRoute element={<components.ContactIconSetting />} />
              }
            />{" "}
            {/* Contact Icon Settings */}
            <Route
              path="/social-media-setting"
              element={
                <ProtectedRoute element={<components.SocialMediaSetting />} />
              }
            />{" "}
            {/* Social Media Settings */}
            <Route
              path="/seo-setting"
              element={<ProtectedRoute element={<components.SEOSetting />} />}
            />{" "}
            {/* SEO Settings */}
            <Route
              path="/email-setting"
              element={<ProtectedRoute element={<components.EmailSetting />} />}
            />{" "}
            {/* Email Settings */}
            {/** POLICY PAGES */}
            <Route
              path="/verify-email"
              element={<components.AdminMailVerification />}
            />{" "}
            {/* Admin Email Verification */}
            <Route
              path="/copyright-policy"
              element={<components.CopyrightPolicy />}
            />{" "}
            {/* Copyright Policy */}
            <Route
              path="/termanduse-policy"
              element={<components.TermsAndUse />}
            />{" "}
            {/* Terms of Use Policy */}
            {/** MARQUEE SLIDE */}
            <Route
              path="/marque-slide"
              element={<components.MarqueSlide />}
            />{" "}
            {/* Marquee Slide Settings */}
            {/** SESSION MANAGEMENT */}
            <Route
              path="/session"
              element={<ProtectedRoute element={<components.Session />} />}
            />{" "}
            <Route
              path="/expense-category"
              element={<ProtectedRoute element={<components.ExpenseCategory />} />}
            />{" "}
            <Route
              path="/expense/add-new"
              element={<ProtectedRoute element={<components.AddExpense />} />}
            />{" "}
            <Route
              path="/expense/edit/:expenseId"
              element={<ProtectedRoute element={<components.AddExpense />} />}
            />{" "}
            <Route
              path="/expense/list"
              element={<ProtectedRoute element={<components.ExpenseList />} />}
            />{" "}
            {/* Session Management */}
            {/** DEPARTMENT AND FACULTY MANAGEMENT */}
            <Route
              path="/department-faculty"
              element={
                <ProtectedRoute element={<components.FacultyDepartment />} />
              }
            />{" "}
            {/* Faculty and Department Management */}
            <Route
              path="/department"
              element={<ProtectedRoute element={<components.Department />} />}
            />{" "}
            {/* Department Overview */}
            {/** JOB APPLICATION MANAGEMENT */}
            <Route
              path="/job-applications"
              element={<ProtectedRoute element={<components.JobApplication />} />}
            />{" "}
            {/* Job Applications Listing */}
            <Route
              path="/job-application/:id"
              element={
                <ProtectedRoute element={<components.JobApplicationDetail />} />
              }
            />{" "}
            {/* View Job Application Details */}
            {/** COURSE AND SUBJECT MANAGEMENT */}
            <Route
              path="/subject"
              element={<ProtectedRoute element={<components.Subject />} />}
            />{" "}
            {/* Subject Management */}
            <Route
              path="/course"
              element={<ProtectedRoute element={<components.Course />} />}
            />{" "}
            {/* Course Management */}
            <Route
              path="/update-course-content/:id"
              element={
                <ProtectedRoute element={<components.UpdateCourseContent />} />
              }
            />{" "}
            {/* Update Course Content */}
            <Route
              path="/add-course"
              element={<ProtectedRoute element={<components.AddCourse />} />}
            />{" "}
            {/* Add New Course */}
            <Route
              path="/add-course/:courseId"
              element={<ProtectedRoute element={<components.AddCourse />} />}
            />{" "}
            {/* Edit Existing Course */}
            {/** PAGE MANAGEMENT */}
            <Route
              path="/add-page/:pageid?"
              element={<ProtectedRoute element={<components.AddPage />} />}
            />{" "}
            {/* Add/Edit Page */}
            <Route
              path="/page-list"
              element={<ProtectedRoute element={<components.PageList />} />}
            />{" "}
            {/* List of Pages */}
            {/** MENU MANAGEMENT */}
            <Route
              path="/add-menu/:menuid?"
              element={<ProtectedRoute element={<components.AddMenu />} />}
            />
            <Route
              path="/menu-list"
              element={<ProtectedRoute element={<components.MenuList />} />}
            />
            {/** NOTICE AND USEFUL LINKS MANAGEMENT */}
            <Route
              path="/add-notice/:noticeid?"
              element={<ProtectedRoute element={<components.AddNotice />} />}
            />{" "}
            {/* Add/Edit Notice */}
            <Route
              path="/notice-list"
              element={<ProtectedRoute element={<components.NoticeList />} />}
            />{" "}
            {/* Notice List */}
            <Route
              path="/add-useful-link/:dbId?"
              element={<ProtectedRoute element={<components.AddUseFulLinks />} />}
            />{" "}
            {/* Add/Edit Useful Link */}
            <Route
              path="/useful-links"
              element={<ProtectedRoute element={<components.UseFulLinks />} />}
            />{" "}
            {/* Useful Links List */}
            {/** FAQ AND DESIGNATION MANAGEMENT */}
            <Route
              path="/add-faq/:dbId?"
              element={<ProtectedRoute element={<components.AddFaq />} />}
            />{" "}
            {/* Add/Edit FAQ */}
            <Route
              path="/faq-list"
              element={<ProtectedRoute element={<components.FaqList />} />}
            />{" "}
            {/* FAQ List */}
            <Route
              path="/designation"
              element={<ProtectedRoute element={<components.Designation />} />}
            />{" "}
            {/* Designation Management */}
            {/** ROLE, SEMESTER, AND VIDEO MANAGEMENT */}
            <Route
              path="/add-role/:dbId?"
              element={<ProtectedRoute element={<components.AddRole />} />}
            />{" "}
            {/* Add/Edit Role */}
            <Route
              path="/role-list"
              element={<ProtectedRoute element={<components.RoleList />} />}
            />{" "}
            {/* Role List */}
            <Route
              path="/add-semester"
              element={<ProtectedRoute element={<components.AddSemester />} />}
            />{" "}
            {/* Add Semester */}
            <Route
              path="/semester"
              element={<ProtectedRoute element={<components.SemesterList />} />}
            />{" "}
            {/* Semester List */}
            <Route
              path="/add-semester-subject"
              element={
                <ProtectedRoute element={<components.AddSemesterSubject />} />
              }
            />{" "}
            {/* Add Semester Subject */}
            <Route
              path="/semester-subject"
              element={
                <ProtectedRoute element={<components.SemesterSubjectList />} />
              }
            />{" "}
            {/* Semester Subject List */}
            <Route
              path="/video-at-website-home"
              element={
                <ProtectedRoute element={<components.VideoAtWebsiteHome />} />
              }
            />{" "}
            {/* Video at Website Home */}
            {/** SEMESTER, ACHIEVEMENT, AND RESOURCE MANAGEMENT */}
            <Route
              path="/add-semester-subject/:semesterId?"
              element={
                <ProtectedRoute element={<components.AddSemesterSubject />} />
              }
            />{" "}
            {/* Add/Edit Semester Subject */}
            <Route
              path="/achievement-list"
              element={<ProtectedRoute element={<components.Achievement />} />}
            />{" "}
            {/* Achievement List */}
            <Route
              path="/add-achievement/:id?"
              element={<ProtectedRoute element={<components.AddAchievement />} />}
            />{" "}
            {/* Add/Edit Achievement */}
            {/** RESOURCE MANAGEMENT */}
            <Route
              path="/add-resource-pdf/:dbId?"
              element={<ProtectedRoute element={<components.AddResourcePdf />} />}
            />{" "}
            {/* Add/Edit Resource PDF */}
            <Route
              path="/list-resource-pdf"
              element={
                <ProtectedRoute element={<components.ResourcePdfList />} />
              }
            />{" "}
            {/* Resource PDF List */}
            <Route
              path="/add-resource-video/:dbId?"
              element={
                <ProtectedRoute element={<components.AddResourceVideo />} />
              }
            />{" "}
            {/* Add/Edit Resource Video */}
            <Route
              path="/list-resource-video"
              element={
                <ProtectedRoute element={<components.ResourceVideoList />} />
              }
            />{" "}
            {/* Resource Video List */}
            <Route
              path="/add-resource-live-class-url/:dbId?"
              element={
                <ProtectedRoute
                  element={<components.AddResourceLiveClassUrl />}
                />
              }
            />{" "}
            {/* Add/Edit Resource Live Class URL */}
            <Route
              path="/resource-live-class-url"
              element={
                <ProtectedRoute
                  element={<components.ResourceLiveClassUrlList />}
                />
              }
            />{" "}
            {/* Resource Live Class URL List */}
            {/** POPUP AND SETTINGS */}
            <Route
              path="/popup-notice"
              element={<ProtectedRoute element={<components.PopupNotice />} />}
            />
            <Route
              path="/library-setting"
              element={<ProtectedRoute element={<components.LibrarySetting />} />}
            />
            {/** Reports */}
            <Route
              path="/reports"
              element={<ProtectedRoute element={<components.Reports />} />}
            />
            <Route
              path="/reports/student-report"
              element={<ProtectedRoute element={<components.StudentReportDetails />} />}
            />
            <Route
              path="/reports/subject-report"
              element={<ProtectedRoute element={<components.SubjectReport />} />}
            />
            <Route
              path="/reports/inventory-report"
              element={<ProtectedRoute element={<components.InventoryReport />} />}
            />
            <Route
              path="/reports/library-report"
              element={<ProtectedRoute element={<components.LibraryReport />} />}
            />

            {/** APPLICATION MANAGEMENT */}
            <Route
              path="/application-list"
              element={<ProtectedRoute element={<components.NewApplication />} />}
            />
            <Route
              path="/view-addmission-application/:sid"
              element={
                <ProtectedRoute element={<components.ViewApplication />} />
              }
            />
            <Route
              path="/view-addmission-application/edit/:sid"
              element={
                <ProtectedRoute element={<components.EditApplication />} />
              }
            />
            <Route
              path="/application/preview-previous-registration/:sid/:selectedcourse"
              element={
                <ProtectedRoute
                  element={<components.PreviewPreviousRegistration />}
                />
              }
            />
            {/** ROOM ALLOCATION */}
            <Route
              path="/allot-room/:id?"
              element={
                <ProtectedRoute element={<components.AllotRoomToStudent />} />
              }
            />
            <Route
              path="/alloted-room-history"
              element={
                <ProtectedRoute element={<components.AllotedRoomHistory />} />
              }
            />
            <Route
              path="/update-allot-room/:id"
              element={
                <ProtectedRoute element={<components.AllotRoomToStudent />} />
              }
            />
            <Route
              path="/update-vacate-date/:id"
              element={
                <ProtectedRoute element={<components.UpdateVacateDate />} />
              }
            />
            <Route
              path="/alloted-room-history"
              element={
                <ProtectedRoute element={<components.AllotedRoomHistory />} />
              }
            />
            <Route
              path="/raised-room-queries"
              element={<components.RaisedRoomQueries />}
            />
            <Route
              path="/raised-room-complains"
              element={<components.RaisedRoomComplain />}
            />
            <Route
              path="/view-complain/:studentId/:complainId"
              element={<components.ViewAndResponseComplain />}
            />
            <Route
              path="/leave-request-list"
              element={<components.LeaveRequestList />}
            />
            <Route
              path="/hostel-management/mark-attendance"
              element={<components.MarkHostelAttendanceForm />}
            />
            <Route
              path="/hostel-management/update-attendance"
              element={<components.HostelUpdateAttendance />}
            />
            <Route
              path="/hostel-management/attendance-history"
              element={<components.HostelAttendanceHistory />}
            />
            <Route
              path="/student-management/mark-attendance"
              element={<components.MarkClassAttendanceForm />}
            />
            <Route
              path="/student-management/attendance-history"
              element={<components.ClassAttendanceHistory />}
            />
            {/** TIME TABLE MANAGEMENT */}
            <Route
              path="/time-slot/"
              element={<ProtectedRoute element={<components.TimeSlot />} />}
            />
            <Route
              path="/add-new-time-table/:dbId?"
              element={
                <ProtectedRoute element={<components.AddNewTimeTable />} />
              }
            />
            <Route
              path="/time-table-list"
              element={<ProtectedRoute element={<components.TimeTableList />} />}
            />
            <Route
              path="/time-table-print/:timeChartId"
              element={
                <ProtectedRoute element={<components.TimeTableChartPrint />} />
              }
            />
            <Route
              path="/subjects-assinged-faculty"
              element={
                <ProtectedRoute
                  element={<components.SubjectsAssignedFaculty />}
                />
              }
            />
            <Route
              path="/subjects-assinged-faculty/:dbId"
              element={
                <ProtectedRoute
                  element={<components.SubjectsAssignedFaculty />}
                />
              }
            />
            <Route
              path="/subjects-assinged-faculty-list"
              element={
                <ProtectedRoute
                  element={<components.SubjectsAssignedFacultyList />}
                />
              }
            />
            {/* COMMUNICATION MANAGEMENT  */}
            <Route
              path="/cmn-mng-message"
              element={
                <ProtectedRoute
                  element={<components.CommunicationManagementMessage />}
                />
              }
            />
            <Route
              path="/cmn-mng-message-list"
              element={
                <ProtectedRoute
                  element={<components.CommunicationManagementMessageList />}
                />
              }
            />
            <Route
              path="/message-list/view/:dbId"
              element={
                <ProtectedRoute
                  element={<components.CommunicationManagementMessageView />}
                />
              }
            />
            {/** LEARNING MANAGEMENT SESSION WISE SEMESTER */}
            <Route
              path="/learning-management/session-wise-semester/add-new"
              element={
                <ProtectedRoute element={<components.AddSessionWiseSemester />} />
              }
            />
            <Route
              path="/learning-management/session-wise-semester/edit/:id"
              element={
                <ProtectedRoute element={<components.AddSessionWiseSemester />} />
              }
            />
            <Route
              path="/learning-management/session-wise-semester/list"
              element={
                <ProtectedRoute element={<components.SessionWiseSemesterList />} />
              }
            />
            {/** INVENTORY MANAGEMENT */}
            <Route
              path="/inventory/category/"
              element={
                <ProtectedRoute element={<components.InventoryCategory />} />
              }
            />
            <Route
              path="/inventory/add-product/:dbId?"
              element={
                <ProtectedRoute element={<components.AddInventoryProduct />} />
              }
            />
            <Route
              path="/inventory/product"
              element={
                <ProtectedRoute element={<components.InventoryProductList />} />
              }
            />
            <Route
              path="/inventory/product/threshold"
              element={
                <ProtectedRoute
                  element={<components.InventoryProductThresholdList />}
                />
              }
            />
            <Route
              path="/inventory/product/threshold/raised-query/:pId?/:dbId?"
              element={
                <ProtectedRoute
                  element={<components.InventoryProductThresholdRaisedQuery />}
                />
              }
            />
            <Route
              path="/inventory/product/threshold/restock/notification"
              element={
                <ProtectedRoute
                  element={
                    <components.InventoryProductThresholdRaisedQueryNotification />
                  }
                />
              }
            />
            <Route
              path="/inventory/product/threshold/raised-query-notification-view/:dbId"
              element={
                <ProtectedRoute
                  element={
                    <components.InventoryProductThresholdRaisedQueryNotificationViewAdmin />
                  }
                />
              }
            />
            <Route
              path="/inventory/product/add-stock/:dbId?"
              element={<ProtectedRoute element={<components.StockInAdd />} />}
            />
            <Route
              path="/inventory/product/stockin/history"
              element={<ProtectedRoute element={<components.StockInList />} />}
            />
            <Route
              path="/inventory/product/add-stockout/:dbId?"
              element={<ProtectedRoute element={<components.StockOutAdd />} />}
            />
            <Route
              path="/inventory/product/stockout/history"
              element={<ProtectedRoute element={<components.StockOutList />} />}
            />
            {/** Exam Management **/}
            <Route
              path="/exam-paper/add-update/:dbId?"
              element={<ProtectedRoute element={<components.AddExamPaper />} />}
            />
            <Route
              path="/exam-paper/view-marks/:dbId?"
              element={<ProtectedRoute element={<components.ViewSubjectMarks />} />}
            />
            <Route
              path="/exam-paper/list"
              element={<ProtectedRoute element={<components.ExamPaperList />} />}
            />
            <Route
              path="/file-manager"
              element={<ProtectedRoute element={<components.FileManager />} />}
            />
            <Route
              path="/cell-complain-list"
              element={<ProtectedRoute element={<components.CellComplainList />} />}
            />
            <Route
              path="/cell-complain-details/:id"
              element={<ProtectedRoute element={<components.CellComplainDetails />} />}
            />
            <Route
              path="/exam-paper/add-question"
              element={
                <ProtectedRoute element={<components.ExamPaperAddQuestion />} />
              }
            />
            <Route
              path="/exam-paper/admit-card"
              element={<ProtectedRoute element={<components.ExamAdmitCard />} />}
            />
            <Route
              path="/attendance/compiled-attendance/:dbid?"
              element={<ProtectedRoute element={<components.CompiledAttendance />} />}
            />
            <Route
              path="/exam-paper/view-paper"
              element={<ProtectedRoute element={<components.ExamPaperView />} />}
            />
            <Route
              path="/exam-paper/upload-marks"
              element={<ProtectedRoute element={<components.ExamPaperUploadMarks />} />}
            />
            <Route path="*" element={<Navigate to="/page-not-found" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
export default AdminRoute;