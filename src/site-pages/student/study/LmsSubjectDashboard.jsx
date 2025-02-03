import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import '../assets/custom.css';
import { capitalizeFirstLetter } from '../../../site-components/Helper/HelperFunction';
import TopicPng from "../assets/img/topic.png";
function LmsSubjectDashboard() {
    const sid = secureLocalStorage.getItem('studentId'); // Retrieve student ID from secure local storage.
    const [courseSemester, setCourseSemester] = useState(null);
    const [subject, setSubject] = useState(null);
    const [apiHit, setApiHit] = useState(false);
    const [topcList, setTopicList] = useState([]);
    const { subjectId, semesterId } = useParams();

    const inititalData = {
        courseId: '',
        subjectId: subjectId,
        semesterId: semesterId,
    };
    const [formData, setFormData] = useState(inititalData);

    const fetchAllCourseAndSemester = async (sid) => {
        setApiHit(true);
        try {
            const response = await axios.post(`${NODE_API_URL}/api/student/fetch-course-semester`, {
                sid,
                courseIdNameList: 'yes',
                allotedCourseSemesterList: 'yes',
            });
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
            console.error('Error fetching course and semester data:', error);
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
            const response = await axios.post(`${NODE_API_URL}/api/student/fetch-topics`, {
                courseId,
                semesterId,
                subjectId,
            });
            if (response.data?.data && response.data.data.length > 0) {
                setTopicList(response.data.data);
            } else {
                setTopicList([]);
            }
            setApiHit(false);
        } catch (error) {
            console.error('Error fetching topics:', error);
            setApiHit(false);
        }
    }
    const getSubject = async (subjectId) => {
        try {
            const response = await axios.post(`${NODE_API_URL}/api/student/get-subject-name-id`, {
                subjectId,
            });
            if (response.data?.data && response.data.data.length > 0) {
                setSubject(response.data.data[0]);
            } else {
                setSubject([]);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            setSubject([]);
        }
    }

    useEffect(() => {
        getSubject(formData.subjectId);
        // Fetch subject dashboard data when courseId, semesterId, and subjectId are updated.
        fetchTopicsBasedOn(formData.courseId, formData.semesterId, formData.subjectId);
    }, [formData.courseId, formData.semesterId, formData.subjectId])

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
                                <span className="breadcrumb-item active">Learning Management System</span>
                            </nav>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title col-md-9 col-lg-9 col-12 col-sm-12 h6_new font-14">
                                    My Course:{" "}
                                    {courseSemester?.courseIdName?.[0]?.coursename || "Course name not available"}
                                    {semesterId &&
                                        courseSemester?.allotedCourseSemester?.find(
                                            (semester) => semester.semesterid == semesterId
                                        )?.semtitle &&
                                        ` - ${capitalizeFirstLetter(
                                            courseSemester.allotedCourseSemester.find(
                                                (semester) => semester.semesterid == semesterId
                                            ).semtitle
                                        )}`}
                                    <span>{" "} ({capitalizeFirstLetter(subject?.subject)})</span>
                                </h5>
                            </div>
                        </div>
                        <div className='row'>
                            {apiHit ? (
                                <div className="col-md-12 text-center">
                                    <div className="loader-fetch mx-auto"></div>
                                </div>
                            ) : ''}
                            {
                                topcList && (
                                    <div className='col-md-12 border-bottom mb-3'>
                                        <p className='mb-1'>Topics</p>
                                    </div>
                                )
                            }

                            {
                                topcList && topcList.map((item, index) => (
                                    <div key={index} className="col-md-4 mb-2 col-lg-4 col-12 col-sm-12">
                                        <div className="card border-0">
                                            <img src={item.thumbnail ? item.thumbnail : TopicPng} style={{ width: '100%', height: '180px', objectFit: 'cover' }} className='card-img-top' />
                                            <div className="card-body pt-3 position-relative pb-3 d-flex justify-content-between align-items-center">
                                                <h6 className='h6_new font-13'>{capitalizeFirstLetter(item.topic_name)}</h6>
                                                <Link target='_blank' to={`/student/lms-topic-dashboard/${item.id}/${formData.subjectId}/${formData.semesterId}`}>
                                                    <button className="haruki_Btn">
                                                        <div className="haruki_sign">
                                                            <i className='fas fa-arrow-right'></i>
                                                        </div>
                                                        <div className="haruki_text_view">View</div>
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LmsSubjectDashboard;
