import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import '../assets/custom.css';
import '../assets/CustomNavTab.css';
import { capitalizeFirstLetter } from '../../../site-components/Helper/HelperFunction';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import validator from 'validator';
function LmsTopicPdfViewer() {
    const sid = secureLocalStorage.getItem('studentId'); // Retrieve student ID from secure local storage.
    const location = useLocation();
    const { dbId, courseId, semesterId, subjectId, topicId } = location.state;
    const [courseSemester, setCourseSemester] = useState(null);
    const [subject, setSubject] = useState(null);
    const [apiHit, setApiHit] = useState(false);
    const [topicList, setTopicList] = useState([]);
    const inititalData = {
        courseId: '',
        subjectId: subjectId,
        semesterId: semesterId,
        topicId: topicId,
    };
    const [numPages, setNumPages] = useState(null); // numPages is initially null
    const [pageNumber, setPageNumber] = useState(1);
    // Function to handle document load success
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    // Function to go to the next page
    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    // Function to go to the previous page
    const goToPrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };
    const [formData, setFormData] = useState(inititalData);
    const [pdfs, setPdfs] = useState([]);
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
            setCourseSemester(null);
        } finally {
            setApiHit(false);
        }
    };

    const fetchTopicsBasedOn = async (topicId) => {
        setApiHit(true);
        try {
            const response = await axios.post(`${NODE_API_URL}/api/student/fetch-topic-by-id`, {
                topicId,
            });
            if (response.data?.data && response.data.data.length > 0) {
                setTopicList(response.data.data);
            } else {
                setTopicList([]);
            }
            setApiHit(false);
        } catch (error) {
            setApiHit(false);
        }
    }
    const FetchPdfByCourseSemesterSubject = async () => {
        setApiHit(true);
        try {
            const response = await axios.post(`${NODE_API_URL}/api/student/fetch-pdf-by-course-semester-subject`, {
                courseId: formData.courseId,
                semesterId: formData.semesterId,
                subjectId: formData.subjectId,
            });
            if (response.data?.data && response.data.data.length > 0) {
                setPdfs(response.data.data);
            } else {
                setPdfs([]);
            }
            setApiHit(false);
        } catch (error) {
            setApiHit(false);
            setPdfs([]);
        }
    }

    const FetchPdfById = async (pdfId) => {
        setApiHit(true);
        try {
            const response = await axios.post(`${NODE_API_URL}/api/student/fetch-pdf-by-id`, {
                pdfId
            });
            if (response.data?.data && response.data.data.length > 0) {
                setPdfs(response.data.data);
            } else {
                setPdfs([]);
            }
            setApiHit(false);
        } catch (error) {
            setApiHit(false);
            setPdfs([]);
        }
    }
    useEffect(() => {
        FetchPdfByCourseSemesterSubject(formData.courseId, formData.semesterId, formData.subjectId);
    }, [formData.courseId, formData.semesterId, formData.subjectId]);
    useEffect(() => {
        FetchPdfById(dbId);
    }, [dbId]);
    useEffect(() => {
        if (sid) {
            fetchAllCourseAndSemester(sid);
        }
    }, [sid]);

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
            setSubject([]);
        }
    }

    useEffect(() => {
        getSubject(formData.subjectId);
        // Fetch subject dashboard data when courseId, semesterId, and subjectId are updated.
        fetchTopicsBasedOn(topicId);
    }, [formData.subjectId, topicId]);

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
                            <div className='col-md-12 text-center'>
                                <h2 className='font-16 h6_new'>{topicList?.[0]?.topic_name || "No topic available"}</h2>
                                {pdfs.length > 0 ? (
                                    <>
                                        <Document
                                            file={pdfs[0]?.pdf ? validator.unescape(pdfs[0]?.pdf) : ''}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            onLoadError={(error) => console.error('Error loading PDF:', error)}
                                        >
                                            <Page pageNumber={pageNumber} />
                                        </Document>
                                        <div className='mt-3'>
                                            <button onClick={goToPrevPage} className='btn btn-primary' disabled={pageNumber === 1 || numPages === null}>
                                                <i className='fas fa-arrow-left'></i> Previous
                                            </button>
                                            <button onClick={goToNextPage} className='btn btn-primary ml-3' disabled={pageNumber === numPages || numPages === null}>
                                                Next <i className='fas fa-arrow-right'></i>
                                            </button>
                                        </div>

                                        <p className='fw-bold font-14 mt-2'>
                                            Page {pageNumber} of {numPages || 'Loading...'}
                                        </p>
                                    </>
                                ) : (
                                    <p>No PDF available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}
export default LmsTopicPdfViewer;