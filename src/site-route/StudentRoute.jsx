import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../site-components/admin/assets/css/App.min.css";
import "../site-components/admin/assets/css/Custom.css";
import IsStudentoggedIn from "../site-pages/student/IsStudentoggedIn";
import ProtectedRouteStudent from "../site-pages/student/ProtectedRoute";
import RouteGaurd from "../site-pages/student/RouteGaurd";
import Navbar from '../site-pages/student/Navbar';
const lazyLoad = (path) => lazy(() => import(`../site-pages/student/${path}.jsx`));

const lazyLoadPreviousRegistration = (path) =>
  lazy(() => import(`../site-pages/student/PreviousRegistration/${path}.jsx`));
const lazyLoadInternship = (path) =>
  lazy(() => import(`../site-pages/student/Jobs/Internship/${path}.jsx`));
const lazyLoadPlacement = (path) =>
  lazy(() => import(`../site-pages/student/Jobs/Placement/${path}.jsx`));
const lazyLoadHostel = (path) =>
  lazy(() => import(`../site-pages/student/Hostel/${path}.jsx`));
const LazyLoadAttendance = (path) =>
  lazy(() => import(`../site-pages/student/Attendance/${path}.jsx`));
const lazyLoadComplain = (path) =>
  lazy(() => import(`../site-pages/student/Complain/${path}.jsx`));
const lazyLoadAssignment = (path) =>
  lazy(() => import(`../site-pages/student/study/Assignment/${path}.jsx`));
const lazyLoadQuiz = (path) =>
  lazy(() => import(`../site-pages/student/study/Quiz/${path}.jsx`));
const lazyLoadLibrary = (path) =>
  lazy(() => import(`../site-pages/student/Library/${path}.jsx`));



// Lazy-loaded components
const components = {
  Index: lazyLoad("Index"),
  Home: lazyLoad("Home"),
  Login: lazyLoad("Login"),
  Forgot: lazyLoad("Forgot"),
  Profile: lazyLoad("Profile"),
  CourseSelection: lazyLoad("CourseSelection"),
  Qualification: lazyLoad("Qualification"),
  DocumentUpload: lazyLoad("DocumentUpload"),
  Preview: lazyLoad("Preview"),
  BookCatalogue: lazyLoad("BookCatalogue"),
  BookIssued: lazyLoad("BookIssued"),
  IssueList: lazyLoad("IssueList"),
  IssueDetail: lazyLoad("IssueDetail"),
  BookCatalogueDetail: lazyLoad("BookCatalogueDetail"),
  Internship: lazyLoad("Internship"),
  InternshipDetails: lazyLoad("InternshipDetails"),
  FeedbackForm: lazyLoad("FeedbackForm"),
  FeedbackList: lazyLoad("FeedbackList"),
  LmsDashboard: lazyLoad("LmsDashboard"),
  AllPreviousRegistraton: lazyLoadPreviousRegistration("AllPreviousRegistraton"),
  PreviewPreviousRegistration: lazyLoadPreviousRegistration("PreviewPreviousRegistration"),
  InternshipList: lazyLoadInternship('Internshiplist'),
  InternshipAppliedHistory: lazyLoadInternship('InternshipAppliedHistory'),
  JobAppliedHistory: lazyLoadPlacement('JobAppliedHistory'),
  Joblist: lazyLoadPlacement('Joblist'),
  AllotedRoomHistory: lazyLoadHostel('AllotedRoomHistory'),
  RaiseQueryForHostelRoom: lazyLoadHostel('RaiseQueryForHostelRoom'),
  RaisedRoomQueries: lazyLoadHostel('RaisedRoomQueries'),
  ComplainHistory: lazyLoadComplain('ComplainHistory'),
  RaiseComplain: lazyLoadComplain('RaiseComplain'),
  LeaveRequestForm: lazyLoadHostel('LeaveRequestForm'),
  LeaveRequestList: lazyLoadHostel('LeaveRequestList'),
  AttendanceHistory: lazyLoadHostel('AttendanceHistory'),
  ClassAttendanceHistory: LazyLoadAttendance('ClassAttendanceHistory'),
  AssignmentSubject: lazyLoadAssignment('AssignmentSubject'),
  AssignmentSubjectDashboard: lazyLoadAssignment('AssignmentSubjectDashboard'),
  AssignmentPaper: lazyLoadAssignment('AssignmentPaper'),
  AssignmentResult: lazyLoadAssignment('Result'),

  QuizSubject: lazyLoadQuiz('QuizSubject'),
  QuizSubjectDashboard: lazyLoadQuiz('QuizSubjectDashboard'),
  QuizPaper: lazyLoadQuiz('QuizPaper'),
  QuizResult: lazyLoadQuiz('Result'),
  BookPdfViewer: lazyLoadLibrary('BookPdfViewer'),
};

// Additional lazy-loaded component
components.StudyMaterial = lazy(() => import("../site-pages/student/study/StudyMaterial.jsx"));
components.LmsSubjectDashboard = lazy(() => import("../site-pages/student/study/LmsSubjectDashboard.jsx"));
components.LmsTopicDashboard = lazy(() => import("../site-pages/student/study/LmsTopicDashboard.jsx"));
components.LmsTopicPdfViewer = lazy(() => import("../site-pages/student/study/LmsTopicPdfViewer.jsx"));
components.NewMessage = lazy(() => import("../site-pages/student/Communication/NewMessage.jsx"));
components.MessageList = lazy(() => import("../site-pages/student/Communication/MessageList.jsx"));
components.MessageView = lazy(() => import("../site-pages/student/Communication/MessageView.jsx"));
components.TimeTable = lazy(() => import("../site-pages/student/TimeTable.jsx"));
function StudentRoute({ toggleExpand, toggleFolded }) {
  const isLoggedIn = IsStudentoggedIn();
  return (
    <>
      {isLoggedIn && (
        <Navbar toggleExpand={toggleExpand} toggleFolded={toggleFolded} />
      )}
      <Suspense fallback="...">
        <ToastContainer
          autoClose={5000}
          position="top-right"
          hideProgressBar={false}
          draggable
          pauseOnHover
          closeOnClick
        />
        <Routes>
          <Route path="/" element={<Navigate to="/student/register" />} />
          <Route path="/register" element={<components.Index />} />
          <Route path="/home" element={<ProtectedRouteStudent element={<components.Home />} />} />
          <Route path="/profile" element={<ProtectedRouteStudent element={<components.Profile />} />} />
          <Route path="/course-selection" element={<ProtectedRouteStudent element={<RouteGaurd element={<components.CourseSelection />} />} />} />
          <Route path="/qualification" element={<ProtectedRouteStudent element={<RouteGaurd element={<components.Qualification />} />} />} />
          <Route path="/document-upload" element={<ProtectedRouteStudent element={<RouteGaurd element={<components.DocumentUpload />} />} />} />
          <Route path="/preview" element={<ProtectedRouteStudent element={<RouteGaurd element={<components.Preview />} />} />} />
          <Route path="/assignment/result/:id" element={<ProtectedRouteStudent element={<RouteGaurd element={<components.AssignmentResult />} />} />} />
          <Route path="/quiz/result/:id" element={<ProtectedRouteStudent element={<RouteGaurd element={<components.QuizResult />} />} />} />
          <Route path="/login" element={<components.Login />} />
          <Route path="/forgot" element={<components.Forgot />} />
          <Route path="/book-catalogue" element={<ProtectedRouteStudent element={<components.BookCatalogue />}/>}  />
          <Route path="/book-catalogue-detail/:id" element={<ProtectedRouteStudent element={<components.BookCatalogueDetail />} />} />
          <Route path="/book-issued" element={<ProtectedRouteStudent element={<components.BookIssued />}/>}  />
          <Route path="/issued-list" element={<ProtectedRouteStudent element={<components.IssueList />} />} />
          <Route path="/issued-detail/:id" element={<ProtectedRouteStudent element={<components.IssueDetail />} />} />
          <Route path="/internship" element={<ProtectedRouteStudent element={<components.InternshipList />} />} />
          <Route path="/internship-applied-history"  element={<ProtectedRouteStudent element={<components.InternshipAppliedHistory />} />} />
          <Route path="/job-applied-history" element={<ProtectedRouteStudent element={<components.JobAppliedHistory />} />} />
          <Route path="/joblist" element={<ProtectedRouteStudent element={<components.Joblist />} />} />
          <Route path="/new-feedback" element={<ProtectedRouteStudent  element={<components.FeedbackForm />} />} />
          <Route path="/feedback-list" element={<ProtectedRouteStudent element={<components.FeedbackList />} />} />
          <Route path="/internship-details/:id" element={<ProtectedRouteStudent element={<components.InternshipDetails />} />} />
          <Route path="/previous-registration-list" element={<ProtectedRouteStudent  element={<components.AllPreviousRegistraton />} />} />
          <Route path="/preview-previous-registration/:sid/:selectedcourse"  element={<ProtectedRouteStudent   element={<components.PreviewPreviousRegistration />}  />}/>
          <Route path="/lms"   element={<ProtectedRouteStudent   element={<components.LmsDashboard />}  />}/>
          <Route path="/study-material"   element={<ProtectedRouteStudent   element={<components.StudyMaterial />} />} />
          <Route path="/lms-subject-dashboard/:subjectId/:semesterId"  element={<ProtectedRouteStudent    element={<components.LmsSubjectDashboard />} />} />
          <Route path="/lms-topic-dashboard/:topicId/:subjectId/:semesterId"  element={<ProtectedRouteStudent    element={<components.LmsTopicDashboard />} />} />
          <Route path="/lms-topic-dashboard/:topicId/:subjectId/:semesterId/:courseId/:videoId"  element={<ProtectedRouteStudent    element={<components.LmsTopicDashboard/>} />} />
          <Route path="/topic-pdf-viewer"  element={<ProtectedRouteStudent    element={<components.LmsTopicPdfViewer />} />}/>
          <Route path="/book-viewer"  element={<ProtectedRouteStudent    element={<components.BookPdfViewer />} />}/>
          <Route path="/alloted-room-history"   element={<ProtectedRouteStudent   element={<components.AllotedRoomHistory />}/>} />
          <Route path="/raise-query"  element={<ProtectedRouteStudent    element={<components.RaiseQueryForHostelRoom />}/>} />
          <Route path="/raised-room-queries"   element={<ProtectedRouteStudent   element={<components.RaisedRoomQueries />}/>} />

          <Route path="/complain-history"   element={<ProtectedRouteStudent   element={<components.ComplainHistory />}/>} />
          <Route path="/raise-complain"   element={<ProtectedRouteStudent   element={<components.RaiseComplain />}/>} />
          <Route path="/leave-request"   element={<ProtectedRouteStudent   element={<components.LeaveRequestForm />}/>} />
          <Route path="/leave-request-list"   element={<ProtectedRouteStudent   element={<components.LeaveRequestList />}/>} />
          <Route path="/attendance-history"   element={<ProtectedRouteStudent   element={<components.AttendanceHistory />} />}/>
          <Route path="/class-attendance-history"   element={<ProtectedRouteStudent   element={<components.ClassAttendanceHistory />} />}/>
          <Route path="/assignment-subject"   element={<ProtectedRouteStudent   element={<components.AssignmentSubject />} />}/>
          <Route path="/assignment-subject/:courseId/:semesterId/:subjectId"   element={<ProtectedRouteStudent   element={<components.AssignmentSubjectDashboard />}/>} />
          <Route path="/quiz-subject"  element={<ProtectedRouteStudent    element={<components.QuizSubject />}/>} />
          <Route path="/quiz-subject/:courseId/:semesterId/:subjectId"   element={<ProtectedRouteStudent   element={<components.QuizSubjectDashboard />}/>} />
          <Route path="/new-message"   element={<ProtectedRouteStudent   element={<components.NewMessage />}/>} />
          <Route path="/message-list"   element={<ProtectedRouteStudent   element={<components.MessageList />}/>} />
          <Route path="/message-list/view/:dbId"   element={<ProtectedRouteStudent   element={<components.MessageView />} />} />
          <Route path="/time-table"   element={<ProtectedRouteStudent    element={<components.TimeTable />} />} />
          <Route path="*" element={<Navigate to="/page-not-found" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default StudentRoute;
