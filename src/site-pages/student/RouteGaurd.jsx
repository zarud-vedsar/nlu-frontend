import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { Navigate } from "react-router-dom";

const RouteGuard = ({ element }) => {
  const [isAllowed, setIsAllowed] = useState(null); 

  const getStudentSelectedCourse = async () => {
    try {
      const formData = {
        studentId: secureLocalStorage.getItem("studentId"),
        login_type: "student",
      };
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/courseType`,
        formData
      );
      if (response?.data?.statusCode === 200) {

        const isPreview = response?.data?.data[0]?.preview;
        setIsAllowed(isPreview === 1); 
      } else {
        setIsAllowed(false); 
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      setIsAllowed(false);
    }
  };

  useEffect(() => {
    getStudentSelectedCourse();
  }, []);

  if (isAllowed === null) {
    return <div>Loading...</div>; 
  }

  if (isAllowed) {
    return <Navigate to="/student/profile" replace />;
  }

  return element;
};

export default RouteGuard;
