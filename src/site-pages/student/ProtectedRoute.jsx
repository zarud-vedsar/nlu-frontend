import React from "react";
import { Navigate } from "react-router-dom";
import IsStudentoggedIn from "./IsStudentoggedIn";

const ProtectedRouteStudent = ({ element }) => {
  const isLoggedIn = IsStudentoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/student/login" replace />;
  }
  return element;
};
export default ProtectedRouteStudent;
