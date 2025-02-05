import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import "../assets/custom.css";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import TopicPng from "../assets/img/topic.png";
import livePng from "../assets/img/livethembnail.jpg";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { formatDate } from "../../../site-components/Helper/HelperFunction";
function LmsSubjectDashboard() {
  const sid = secureLocalStorage.getItem("studentId"); // Retrieve student ID from secure local storage.
  const [courseSemester, setCourseSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [apiHit, setApiHit] = useState(false);
  const [topcList, setTopicList] = useState([]);
  const [liveList, setLiveList] = useState([]);
  const { subjectId, semesterId } = useParams();
  const [activeCategory, setActiveCategory] = useState("topics"); // Default tab is 'topics'
  // Assuming `liveContent` contains your live content data-------------------
  const currentDate = new Date(); // Get the current date and time

  const inititalData = {
    courseId: "",
    subjectId: subjectId,
    semesterId: semesterId,
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

  useEffect(() => {
    if (sid) {
      fetchAllCourseAndSemester(sid);
    }
  }, [sid]);
  const fetchTopicsBasedOn = async (courseId, semesterId, subjectId) => {
    setApiHit(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/student/fetch-topics`,
        {
          courseId,
          semesterId,
          subjectId,
        }
      );
      if (response.data?.data && response.data.data.length > 0) {
        setTopicList(response.data.data);
      } else {
        setTopicList([]);
      }
      setApiHit(false);
    } catch (error) {
      console.error("Error fetching topics:", error);
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
  const fetchLiveBasedOn = async (courseId, semesterId, subjectId) => {
    setApiHit(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/student/fetch-live-class-by-course-semester-subject`,
        {
          courseId,
          semesterId,
          subjectId,
        }
      );
      console.log(response);
      if (response.data?.data && response.data.data.length > 0) {
        setLiveList(response.data.data);
        console.log(liveList);
      } else {
        setLiveList([]);
      }
      setApiHit(false);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setApiHit(false);
    }
  };

  useEffect(() => {
    // Fetch subject data
    getSubject(formData.subjectId);

    // Fetch topics based on courseId, semesterId, and subjectId
    fetchTopicsBasedOn(
      formData.courseId,
      formData.semesterId,
      formData.subjectId
    );

    // Fetch live content based on courseId, semesterId, and subjectId
    fetchLiveBasedOn(
      formData.courseId,
      formData.semesterId,
      formData.subjectId
    );
  }, [formData.courseId, formData.semesterId, formData.subjectId]);

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

            <Tabs
              selectedIndex={["topics", "live"].indexOf(activeCategory)}
              onSelect={(index) => setActiveCategory(["topics", "live"][index])}
            >
              <TabList>
                {["topics", "live"].map((category, index) => (
                  <Tab key={index}>{capitalizeFirstLetter(category)}</Tab>
                ))}
              </TabList>

              <TabPanel>
                <div className="row">
                  {topcList &&
                    topcList.map((item, index) => (
                      <div
                        key={index}
                        className="col-md-4 mb-2 col-lg-4 col-12 col-sm-12"
                      >
                        <div className="card border-0">
                          <img
                            src={item.thumbnail ? item.thumbnail : TopicPng}
                            style={{
                              width: "100%",
                              height: "180px",
                              objectFit: "cover",
                            }}
                            className="card-img-top"
                          />
                          <div className="card-body pt-3 position-relative pb-3 d-flex justify-content-between align-items-center">
                            <h6 className="h6_new font-13">
                              {capitalizeFirstLetter(item.topic_name)}
                            </h6>
                            <Link
                              target="_blank"
                              to={`/student/lms-topic-dashboard/${item.id}/${formData.subjectId}/${formData.semesterId}`}
                            >
                              <button className="haruki_Btn">
                                <div className="haruki_sign">
                                  <i className="fas fa-arrow-right"></i>
                                </div>
                                <div className="haruki_text_view">View</div>
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabPanel>

              <TabPanel>
                {liveList &&
                  liveList.map((item, index) => (
                    <div
                      key={index}
                      className="col-md-4 mb-2 col-lg-4 col-12 col-sm-12"
                    >
                      <div className="card border-0">
                        <img
                          src={item.thumbnail ? item.thumbnail : livePng}
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                          }}
                          className="card-img-top"
                        />
                        <div className="card-body pt-3 position-relative pb-3 ">
                          <h6 className="h6_new font-13">
                            {capitalizeFirstLetter(item.title)}
                          </h6>
                          <div  className="d-flex justify-content-between">
                          <p>Live Date: {formatDate(item.liveDate)}</p>
                           {/* Show event status based on the logic */}
                           <p
                            className={
                              checkEventStatus(
                                item.liveDate,
                                item.startTime,
                                item.endTime
                              ) === "Expired"
                                ? "text-danger"
                                : checkEventStatus(
                                    item.liveDate,
                                    item.startTime,
                                    item.endTime
                                  ) === "Ongoing"
                                ? "text-warning" // You can use 'text-warning' for ongoing events if you'd like
                                : "text-success" // For pending events
                            }
                          >
                            {checkEventStatus(
                              item.liveDate,
                              item.startTime,
                              item.endTime
                            )}
                          </p>

                          </div>
                         
                          <div className="d-flex justify-content-between">
                            <p>Start Time: {item.startTime}</p>
                            <p>End Time: {item.endTime}</p>
                          </div>

                         

                          <Link
                            to={`/student/lms-live-details/${item.id}/${formData.subjectId}/${formData.semesterId}`}
                          >
                            <button className="haruki_Btn">
                              <div className="haruki_sign">
                                <i className="fas fa-arrow-right"></i>
                              </div>
                              <div className="haruki_text_view">View</div>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

export default LmsSubjectDashboard;
