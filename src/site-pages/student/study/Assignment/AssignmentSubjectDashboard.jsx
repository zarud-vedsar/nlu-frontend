import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../../site-components/Helper/Constant";
import "../../assets/custom.css";
import {
  capitalizeFirstLetter,
  formatDate,
} from "../../../../site-components/Helper/HelperFunction";
import { toast } from "react-toastify";
function AssignmentSubjectDashboard() {
  const sid = secureLocalStorage.getItem("studentId"); // Retrieve student ID from secure local storage.
  const [courseSemester, setCourseSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [apiHit, setApiHit] = useState(false);
  const { courseId, semesterId, subjectId } = useParams();
  const [assignmentList, setAssignmentList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const inititalData = {
    courseId: courseId,
    subjectId: subjectId,
    semesterId: semesterId,
    studentId: sid,
  };
  const [formData, setFormData] = useState(inititalData);

  const fetchAllCourseAndSemester = async (sid) => {
    setApiHit(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/student/fetch-course-semester`,
        {
          sid,
          courseIdNameList: "yes",
          allotedCourseSemesterList: "yes",
        }
      );
      if (response.data.data) {
        const [firstCourse] = response.data.data;
        setCourseSemester(firstCourse);
        if (firstCourse?.courseIdName?.[0]?.id) {
          setFormData((prev) => ({
            ...prev,
            courseId: firstCourse.courseIdName[0].id,
          }));
        }
      } else {
        setCourseSemester(null);
      }
    } catch (error) {
      console.error("Error fetching course and semester data:", error);
      setCourseSemester(null);
    } finally {
      setApiHit(false);
    }
  };

  const fetchAllAssignmentusingPhp = async () => {
    setIsFetching(true);
    try {
      let bformData = new FormData();

      bformData.append("data", "load_st_assignment");
      bformData.append("courseid", formData?.courseId);
      bformData.append("semesterid", formData?.semesterId);
      bformData.append("student_id", sid);
      bformData.append("subject", formData?.subjectId);
      bformData.append("selectedcourse",secureLocalStorage.getItem("selectedCourseId"));
      

      const response = await axios.post(
        `${PHP_API_URL}/assignment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200 && response.data.data.length > 0) {
        // toast.success(response?.data?.msg);
        setAssignmentList(response?.data?.data);
      } else {
        setAssignmentList([]);
      }
    } catch (error) {
      setAssignmentList([]);
      if (
        error?.response?.data?.status === 400 ||
        error?.response?.data?.status === 404 ||
        error?.response?.data?.status === 500
      ) {
        toast.error(error?.response?.data?.msg);
      }
    } finally {
      setIsFetching(false);
    }
  };

  const getSubject = async (subjectId) => {
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/student/get-subject-name-id`,
        {
          subjectId,
        }
      );
      if (response.data?.data && response.data.data.length > 0) {
        setSubject(response.data.data[0]);
      } else {
        setSubject([]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setSubject([]);
    }
  };

  useEffect(() => {
    if (sid) {
      fetchAllCourseAndSemester(sid);
    }
  }, [sid]);

  useEffect(() => {
    getSubject(formData.subjectId);
    fetchAllAssignmentusingPhp();
  }, [formData.courseId, formData.semesterId, formData.subjectId]);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container">
            <div className="mb-3 mt-0">
              <nav className="breadcrumb">
                <Link to="/student" className="breadcrumb-item">
                  Home
                </Link>
                <Link className="breadcrumb-item ">
                  Learning Management System
                </Link>
                <Link className="breadcrumb-item active">Assignment</Link>
                <span className="breadcrumb-item active">Assignment List</span>
              </nav>
            </div>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title col-md-9 col-lg-9 col-12 col-sm-12 h6_new font-14">
                  My Course:{" "}
                  {courseSemester?.courseIdName?.[0]?.coursename ||
                    "Course name not available"}
                  {semesterId &&
                    courseSemester?.allotedCourseSemester?.find(
                      (semester) => semester.semesterid == semesterId
                    )?.semtitle &&
                    ` - ${capitalizeFirstLetter(
                      courseSemester.allotedCourseSemester.find(
                        (semester) => semester.semesterid == semesterId
                      ).semtitle
                    )}`}
                  <span> ({capitalizeFirstLetter(subject?.subject)})</span>
                </h5>
              </div>
            </div>
            <div className="row">
              {apiHit ? (
                <div className="col-md-12 text-center">
                  <div className="loader-fetch mx-auto"></div>
                </div>
              ) : (
                ""
              )}
              {assignmentList && (
                <div className="col-md-12 border-bottom mb-3">
                  <p className="mb-1">Assignments</p>
                </div>
              )}

              {assignmentList &&
                assignmentList.map((item, index) => (
                  <>
                    {item.question_type !== "description" && (
                      <div
                        key={index}
                        className="col-md-4 mb-2 col-lg-4 col-12 col-sm-12"
                      >
                        <div className="card border-0">
                          <div className="card-body pt-3 ">
                            <h6 className="h6_new font-13">
                              {capitalizeFirstLetter(item.assignment_title)}
                            </h6>
                            <br />
                            <span>
                              Deadline : {formatDate(item.deadline_date)}
                            </span>
                            <br />
                            <span>
                              Question Type :{" "}
                              {capitalizeFirstLetter(item.question_type)}
                            </span>
                            <br />
                            { !secureLocalStorage.getItem("sguardianemail") && item.attempt_status !== "Attempted" && new Date(item.deadline_date) >= new Date() && (
                              <Link
                                target="_blank"
                                className="btn btn-success mt-2"
                                to={`/assignment/assignment-subject/paper/${courseId}/${semesterId}/${subjectId}/${item.id}`}
                              >
                                Attempt
                              </Link>
                            )}
                            { secureLocalStorage.getItem("sguardianemail") &&  item.attempt_status !== "Attempted" && new Date(item.deadline_date) >= new Date() && (
                              <Link
                               
                                className="btn btn-warning mt-2"
                              
                              >
                                Pending
                              </Link>
                            )}
                            {item.attempt_status !== "Attempted" && new Date(item.deadline_date) < new Date() && (
                              <div className="btn btn-danger mt-2">
                              Not Attempted
                            </div>
                            )}
                            
                             {item.attempt_status === "Attempted" &&
                              new Date(item.deadline_date) < new Date() && (
                                <Link
                                  target="_blank"
                                  className="btn btn-secondary mt-2"
                                  to={`/student/assignment/result/${item.response_id}`}
                                >
                                  View Result
                                </Link>
                              )}

                            {item.attempt_status === "Attempted" &&
                              new Date(item.deadline_date) >= new Date() && (
                                <div className="btn btn-danger mt-2">
                                  Already Attempted
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                    {item.question_type === "description" && (
                      <div
                        key={index}
                        className="col-md-4 mb-2 col-lg-4 col-12 col-sm-12"
                      >
                        <div className="card border-0">
                          <div className="card-body pt-3 ">
                            <h6 className="h6_new font-13">
                              {capitalizeFirstLetter(item.assignment_title)}
                            </h6>
                            <br />

                            <span>
                              Deadline : {formatDate(item.deadline_date)}{" "}
                            </span>
                            <br />
                            <span>
                              Question Type :
                              {capitalizeFirstLetter(item.question_type)}
                            </span>

                            <br />

                            {!secureLocalStorage.getItem("sguardianemail")  && item.attempt_status !== "Attempted" && (
                              <Link
                                target="_blank"
                                className="btn btn-success mt-2"
                                to={`/assignment/assignment-subject/paper/${courseId}/${semesterId}/${subjectId}/${item.id}`}
                              >
                                Attempt
                              </Link>
                            )}
                            {secureLocalStorage.getItem("sguardianemail")  && item.attempt_status !== "Attempted" && (
                              <Link
                                className="btn btn-warning mt-2"
                              >
                                Pending
                              </Link>
                            )}
                            {item.attempt_status === "Attempted" &&
                              new Date(item.deadline_date) < new Date() && (
                                <Link
                                  target="_blank"
                                  className="btn btn-secondary mt-2"
                                  to={`/student/assignment/result/${item.response_id}`}
                                >
                                  View Result
                                </Link>
                              )}

                            {item.attempt_status === "Attempted" &&
                              new Date(item.deadline_date) >= new Date() && (
                                <div className="btn btn-danger mt-2">
                                  Already Attempted
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignmentSubjectDashboard;
