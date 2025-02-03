import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../site-components/admin/assets/css/App.min.css";
import "../site-components/admin/assets/css/Custom.css";
import IsStudentoggedIn from "../site-pages/student/IsStudentoggedIn";
import ProtectedRouteStudent from "../site-pages/student/ProtectedRoute";

const lazyLoadQuiz = (path) =>
  lazy(() => import(`../site-pages/student/study/Quiz/${path}.jsx`));

const components = {
  QuizIntroPage:lazyLoadQuiz('QuizIntroPage'),
  SingleChoiceQuestion:lazyLoadQuiz('SingleChoiceQuestion'),
  DescriptiveQuestion:lazyLoadQuiz('DescriptiveQuestion'),
  MultipleChoiceQuestion:lazyLoadQuiz('MultipleChoiceQuestion'),
  ImageChoiceQuestion:lazyLoadQuiz('ImageChoiceQuestion'),
};



function StudentQuizRoute() {
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
          <Route path="/quiz-subject/paper/:courseId/:semesterId/:subjectId/:quizId" element={<ProtectedRouteStudent  element={<components.QuizIntroPage />} />} />
          <Route path="/quiz-subject/paper/scq/:courseId/:semesterId/:subjectId/:quizId" element={<ProtectedRouteStudent element={<components.SingleChoiceQuestion />}/>}  />
          <Route path="/quiz-subject/paper/description/:courseId/:semesterId/:subjectId/:quizId" element={<ProtectedRouteStudent element={<components.DescriptiveQuestion />}/>}  />
          <Route path="/quiz-subject/paper/mcq/:courseId/:semesterId/:subjectId/:quizId" element={<ProtectedRouteStudent element={<components.MultipleChoiceQuestion />}/>}  />
          <Route path="/quiz-subject/paper/image/:courseId/:semesterId/:subjectId/:quizId" element={<ProtectedRouteStudent element={<components.ImageChoiceQuestion />}/>}  />

          <Route path="*" element={<Navigate to="/page-not-found" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default StudentQuizRoute;
