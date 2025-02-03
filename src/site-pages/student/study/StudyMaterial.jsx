import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import '.././assets/custom.css';
import { capitalizeFirstLetter } from '../../../site-components/Helper/HelperFunction';
function SudyMaterial() {
    const sid = secureLocalStorage.getItem('studentId'); // Retrieve student ID from secure local storage.
    const [courseSemester, setCourseSemester] = useState(null); // Initialize as `null` for an object.
    const [subjectList, setSubjectList] = useState([]);
    const [apiHit, setApiHit] = useState(false);
    const inititalData = {
        courseId: '',
        semesterId: ''
    };
    const [formData, setFormData] = useState(inititalData);
    const fetchAllCourseAndSemester = async (sid) => {
        setApiHit(true);
        try {
            const response = await axios.post(`${NODE_API_URL}/api/student/fetch-course-semester`, {
                sid,
                courseIdNameList: 'yes',
                allotedCourseSemesterList: 'yes'
            });
            if (response.data.data) {
                setCourseSemester(response.data.data[0]); // Set the entire response data object.
                if (response.data.data[0].courseIdName && response.data.data[0].courseIdName[0].id) {
                    setFormData((prev) => ({
                        ...prev,
                        courseId: response.data.data[0]?.courseIdName?.[0]?.id
                    }));
                }
            } else {
                setCourseSemester(null); // Reset to null if no data.
            }
            setTimeout(() => setApiHit(false), 200);
        } catch (error) {
            setTimeout(() => setApiHit(false), 200);
            console.error("Error fetching course and semester data:", error);
        }
    };

    useEffect(() => {
        if (sid) {
            fetchAllCourseAndSemester(sid); // Fetch data when `sid` is available.
        }
    }, [sid]);

    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container">
                        <div className="mb-3 mt-0">
                            <nav className="breadcrumb">
                                <a href="/student" className="breadcrumb-item">
                                    Home
                                </a>
                                <span className="breadcrumb-item active">Learning Management System</span>
                            </nav>
                        </div>
                        <div className="card">
                            <div className='card-header row justify-content-between align-items-center'>
                                <h5 className="card-title col-md-9 col-lg-9 col-12 col-sm-12 h6_new font-14">My Course: {" "}
                                    {courseSemester?.courseIdName?.[0]?.coursename
                                        ? courseSemester.courseIdName[0].coursename
                                        : "Course name not available"}
                                </h5>
                                <select className='form-control col-md-3 col-lg-3 col-12 col-sm-12' name='semester' onChange={(e) => {
                                    if (e.target.value) {
                                        setApiHit(true);
                                        setFormData((prev) => ({
                                            ...prev,
                                            semesterId: e.target.value
                                        }));
                                        // fetch subject list based on selected course and semester
                                        axios.post(`${NODE_API_URL}/api/student/fetch-subject-list-based-course-semester`, {
                                            courseId: formData.courseId,
                                            semesterId: e.target.value,
                                            sid
                                        }).then((response) => {
                                            if (response.data.data && response.data.data.length > 0) {
                                                setSubjectList(response.data.data);
                                            }
                                            setTimeout(() => setApiHit(false), 200);
                                        }).catch((error) => {
                                            console.error("Error fetching subject list:", error);
                                            setSubjectList([]);
                                            setTimeout(() => setApiHit(false), 200);
                                        });
                                        setTimeout(() => setApiHit(false), 200);
                                    } else {
                                        setFormData((prev) => ({
                                            ...prev,
                                            semesterId: ''
                                        }));
                                        setSubjectList([]);
                                    }
                                }
                                }>
                                    <option value="">Select Semester</option>
                                    {courseSemester?.allotedCourseSemester?.map((semester, index) => (
                                        <option key={index} value={semester.semesterid}>
                                            {capitalizeFirstLetter(semester.semtitle)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='card-body'>
                                <div className='row'>
                                    {
                                        apiHit && (
                                            <div className='col-md-12 text-center'>
                                                <div className="loader-fetch mx-auto"></div>
                                            </div>
                                        )
                                    }
                                    {
                                        subjectList && !apiHit && subjectList.map((item, index) => (
                                            <>
                                                <div key={index} className='col-md-4 col-lg-4 col-12 col-sm-12'>
                                                    <div className="card" style={{ background: '#B4C4AE' }}>
                                                        <div className="card-body py-3 px-3">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <p className="m-b-0 text-white font-12 font-weight-semibold">{capitalizeFirstLetter(item.subject)}</p>
                                                                </div>
                                                                <Link to={`/student/lms-subject-dashboard/${item.id}/${formData.semesterId}`}><div style={{ color: '#00241B', width: '30px', height: '30px' }} className='border font-16 d-flex justify-content-center align-items-center rounded-3'>
                                                                    <i className="fas fa-arrow-right"></i>
                                                                </div></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default SudyMaterial;