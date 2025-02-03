import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../../site-components/Helper/Constant";
import "../../assets/custom.css";
import TopicPng from "../../assets/img/topic.png";
import { toast } from "react-toastify";
import validator from "validator";
import { formatDate,capitalizeFirstLetter,capitalizeAllLetters } from "../../../../site-components/Helper/HelperFunction";

function AssignmentIntroPage() {
  const sid = secureLocalStorage.getItem("studentId");
  const [courseSemester, setCourseSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [apiHit, setApiHit] = useState(false);
  const { courseId, semesterId, subjectId, assignmentId } = useParams();
  const [assignmentDetail, setAssignmentDetail] = useState([]);
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
      getAssignmentDetail();
    }
  }, [sid]);

  useEffect(() => {
    getSubject(formData.subjectId);
  }, [formData.courseId, formData.semesterId, formData.subjectId]);

  const getAssignmentDetail = async () => {
    if (
      !assignmentId ||
      !Number.isInteger(parseInt(assignmentId, 10)) ||
      parseInt(assignmentId, 10) <= 0
    ) {
      toast.error("Invalid ID.");
      return null;
    }
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/assignment/fetch`,
        { dbId: assignmentId }
      );
      if (
        response?.data?.statusCode === 200 &&
        response?.data?.data.length > 0
      ) {
        toast.success(response.message);
        setAssignmentDetail(response.data.data[0]);

        return response;
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  return (
    <>
    <div className="" style={{height:"100vh", width:"100vw", background:"rgb(224 224 224 / 30%)"}}>
      <div className="container-fluid">
        <div className="mb-3 mt-0 pt-2 px-5">
          {/* <nav className="breadcrumb">
            <Link to="/student" className="breadcrumb-item">
              Home
            </Link>
            <Link className="breadcrumb-item ">Learning Management System</Link>
            <Link className="breadcrumb-item active">Assignment</Link>
            <span className="breadcrumb-item active">paper</span>
          </nav> */}
        </div>
        <div className="card">
          <div className="card-header id-card-header">
            <h5 className="card-title col-md-9 col-lg-9 col-12 col-sm-12  text-light">
              My Course:{" "}
              {courseSemester?.courseIdName?.[0]?.coursename ||
                "Course name not available"}
              <span>
                {" "}
                {semesterId &&
                  courseSemester?.allotedCourseSemester?.find(
                    (semester) => semester.semesterid == semesterId
                  )?.semtitle &&
                  ` - ${capitalizeFirstLetter(
                    courseSemester.allotedCourseSemester.find(
                      (semester) => semester.semesterid == semesterId
                    ).semtitle
                  )}`}
              </span>
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
          
          <div className="col-md-12 mb-2 col-lg-12 col-12 col-sm-12">
            <div className="card border-0">
              <div className="card-body pt-3 ">
                <div className="row">
                <div className="col-md-7 mb-2 col-lg-7 col-12 col-sm-12">
                <h6 className="id-title">
                  {capitalizeFirstLetter(assignmentDetail.assignment_title)}
                </h6>
                <p className="id-assign-d-p"><strong className="id-strong-d">Subject:</strong> {capitalizeFirstLetter(subject?.subject)}</p>
                <p className="id-assign-d-p"><strong className="id-strong-d">Question Type:</strong>{capitalizeAllLetters(assignmentDetail.question_type)}</p>
                <p className="id-assign-d-p"><strong className="id-strong-d">Numbers of Question:</strong> {assignmentDetail.number_of_question}</p>
                <p className="id-assign-d-p"><strong className="id-strong-d">Marks Per Question:</strong>  {assignmentDetail.marks_per_question}</p>
                <p className="id-assign-d-p"><strong className="id-strong-d">Negative Marks Per Wrong Answer:</strong>{assignmentDetail.minus_mark}</p>
                
               
                <p className="id-assign-d-p"><strong className="id-strong-d">Total Marks:</strong> {assignmentDetail.total_marks}</p>
                <p className="id-assign-d-p"><strong className="id-strong-d">Due Date:</strong> {formatDate(assignmentDetail?.deadline_date)} </p>
                  </div>
                  <div className="col-md-5 mb-2 col-lg-5 col-12 col-sm-12 id-position-relative">
                  <h6 className="id-h6_new">
                  Description :-
                </h6>
              
                 <p>{assignmentDetail.description ? validator.unescape(assignmentDetail.description) : 'No description available'}</p>
                 {/* <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita ex possimus nihil sed. Iure totam quisquam, tenetur quam, voluptatibus architecto dicta commodi nesciunt corporis deleniti ducimus, impedit reiciendis nihil dolores inventore blanditiis ut temporibus?</p> */}

                    {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati sunt, soluta neque minima a repudiandae minus perspiciatis sequi, vel sed, qui excepturi culpa? Non quod nemo nulla et, facere dolores.</p> */}
                    <div className="id-button-wrapper">
                    <Link class="btn btn-dark id-btn-bg-color-cancel" type="submit" disabled="">Cancel</Link>
                    
                    <Link class="btn btn-dark id-btn-bg-color" to={`/assignment/assignment-subject/paper/${assignmentDetail.question_type}/${courseId}/${semesterId}/${subjectId}/${assignmentId}`} >Attempt <i className="fas fa-arrow-right"></i></Link>
                    </div>
                  </div>
                  

                </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

    </>
  );
}

export default AssignmentIntroPage;
