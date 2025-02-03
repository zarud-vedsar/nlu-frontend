import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../site-components/admin/assets/css/App.min.css";
import "../site-components/admin/assets/css/Custom.css";
import IsStudentoggedIn from "../site-pages/student/IsStudentoggedIn";
import ProtectedRouteStudent from "../site-pages/student/ProtectedRoute";

const lazyLoadAssignment = (path) =>
  lazy(() => import(`../site-pages/student/study/Assignment/${path}.jsx`));

const components = {
  AssignmentIntroPage:lazyLoadAssignment('AssignmentIntroPage'),
  SingleChoiceQuestion:lazyLoadAssignment('SingleChoiceQuestion'),
  DescriptiveQuestion:lazyLoadAssignment('DescriptiveQuestion'),
  MultipleChoiceQuestion:lazyLoadAssignment('MultipleChoiceQuestion'),
  ImageChoiceQuestion:lazyLoadAssignment('ImageChoiceQuestion'),
};



function StudentAssignmentRoute() {
  const isLoggedIn = IsStudentoggedIn();
  return (
    <>

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
          <Route path="/assignment-subject/paper/:courseId/:semesterId/:subjectId/:assignmentId" element={<ProtectedRouteStudent  element={<components.AssignmentIntroPage />} />} />
          <Route path="/assignment-subject/paper/scq/:courseId/:semesterId/:subjectId/:assignmentId" element={<ProtectedRouteStudent element={<components.SingleChoiceQuestion />}/>}  />
          <Route path="/assignment-subject/paper/description/:courseId/:semesterId/:subjectId/:assignmentId" element={<ProtectedRouteStudent element={<components.DescriptiveQuestion />}/>}  />
          <Route path="/assignment-subject/paper/mcq/:courseId/:semesterId/:subjectId/:assignmentId" element={<ProtectedRouteStudent element={<components.MultipleChoiceQuestion />}/>}  />
          <Route path="/assignment-subject/paper/image/:courseId/:semesterId/:subjectId/:assignmentId" element={<ProtectedRouteStudent element={<components.ImageChoiceQuestion />}/>}  />

          <Route path="*" element={<Navigate to="/page-not-found" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default StudentAssignmentRoute;
