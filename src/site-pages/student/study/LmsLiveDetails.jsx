import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import "../assets/custom.css";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import livePng from "../assets/img/livethembnail.jpg";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { formatDate } from "../../../site-components/Helper/HelperFunction";
import validator from 'validator';

const LmsLiveDetails = () => {
  const sid = secureLocalStorage.getItem("studentId");
  const [courseSemester, setCourseSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const { subjectId, semesterId, dbId } = useParams();
  const [apiHit, setApiHit] = useState(false);
  const [liveData, setLiveData] = useState([]);
  const [formData, setFormData] = useState();

  const currentDate = new Date(); // Get the current date and time

  // Function to check event status based on start time and end time
  const checkEventStatus = (liveDate, startTime, endTime) => {
    const eventStartDate = new Date(`${liveDate} ${startTime}`); // Combine live date and start time to get event start datetime
    const eventEndDate = new Date(`${liveDate} ${endTime}`); // Combine live date and end time to get event end datetime

    // If the event has started but not ended, it's ongoing
    if (eventStartDate <= currentDate && eventEndDate >= currentDate) {
      return "Ongoing";
    }

    // If the event has ended, it's expired
    if (eventEndDate < currentDate) {
      return "Expired";
    }

    // If the event is yet to start, it's pending
    return "Upcoming";
  };


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
      console.log(response);
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
  const getLive = async (dbId) => {
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/student/fetch-live-class-by-id`,
        {
          dbId,
        }
      );
      console.log(response);
      if (response.data?.data && response.data.data.length > 0) {
        setLiveData(response.data.data[0]);
      } else {
        setLiveData([]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setLiveData([]);
    }
  };

  useEffect(() => {
    getLive(dbId);
    if (sid) {
      fetchAllCourseAndSemester(sid);
    }
  }, [sid]);
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
                <span className="breadcrumb-item active">
                  Learning Management System
                </span>
              </nav>
            </div>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title col-md-9 col-lg-9 col-12 col-sm-12 h6_new font-14">
                  My Course: {console.log(courseSemester)}
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
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0">
                  <img
                    src={liveData.thumbnail ? liveData.thumbnail : livePng}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                    className="card-img-top"
                  />
                  <div className="card-body pt-3 pb-3">
                    <div className="d-flex justify-content-between">
                    <h6 className="h6_new font-13">
                      {capitalizeFirstLetter(liveData.title)}
                    </h6>
                    {!secureLocalStorage.getItem("sguardianemail") &&
                    <Link target="blank" to={liveData.liveUrl}  className="id-live-join-btn">
                        Join Now  <i className="fas fa-arrow-right"></i>
                      </Link> }
                    
                      
                    </div>
                   
                    <div className="d-flex justify-content-between">
                      <p>Live Date: {formatDate(liveData.liveDate)}</p>
                      <p
                            className={
                              checkEventStatus(
                                liveData.liveDate,
                                liveData.startTime,
                                liveData.endTime
                              ) === "Expired"
                                ? "text-danger"
                                : checkEventStatus(
                                    liveData.liveDate,
                                    liveData.startTime,
                                    liveData.endTime
                                  ) === "Ongoing"
                                ? "text-warning" // You can use 'text-warning' for ongoing events if you'd like
                                : "text-success" // For pending events
                            }
                          >
                            {checkEventStatus(
                              liveData.liveDate,
                              liveData.startTime,
                              liveData.endTime
                            )}
                          </p>
                     
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Start Time: {liveData.startTime}</p>
                      <p>End Time: {liveData.endTime}</p>
                    </div>
                    <p>
                    {liveData?.description ? validator.unescape(liveData?.description) : ""}
                    </p>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
        .id-live-join-btn{
            float: right;
    padding: 5px 10px;
    background: #8b1709;
    color: white;
    border-radius: 5px;
        }
         
        `}
      </style>
    </>
  );
};

export default LmsLiveDetails;
