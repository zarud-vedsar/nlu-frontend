import React, { useEffect, useState } from 'react';
import { Link, replace, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import '../assets/custom.css';
import '../assets/CustomNavTab.css';
import { capitalizeFirstLetter, googleDriveUrl } from '../../../site-components/Helper/HelperFunction';
import TopicPng from "../assets/img/topic.png";
import PdfPng from "../assets/img/pdf.png";
import validator from 'validator';
function LmsSubjectDashboard() {
    const sid = secureLocalStorage.getItem('studentId'); // Retrieve student ID from secure local storage.
    const navigate = useNavigate();
    const [courseSemester, setCourseSemester] = useState(null);
    const [subject, setSubject] = useState(null);
    const [apiHit, setApiHit] = useState(false);
    const [topicList, setTopicList] = useState([]);
    const [videoPlayer, setVideoPlayer] = useState([]);
    const { subjectId, semesterId, topicId, courseId, videoId } = useParams();
    const inititalData = {
        courseId: '',
        subjectId: subjectId,
        semesterId: semesterId,
        topicId: topicId,
    };
    const tabs = [
        { id: 'home', label: 'Description' },
        { id: 'pdfs', label: 'Pdfs' },
        { id: 'videos', label: 'Videos' },
        { id: 'settings', label: 'Settings' },
    ];

    const [formData, setFormData] = useState(inititalData);
    const [activeTab, setActiveTab] = useState(videoId ? tabs[2].id : tabs[0].id);
    const [pdfs, setPdfs] = useState([]);
    const [videos, setVideos] = useState([]);
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };
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
            console.error('Error fetching topics:', error);
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
            console.error('Error fetching topics:', error);
            setApiHit(false);
            setPdfs([]);
        }
    }
    const FetchVideoByCourseSemesterSubject = async () => {
        setApiHit(true);
        try {
            const response = await axios.post(`${NODE_API_URL}/api/student/fetch-video-by-course-semester-subject`, {
                courseId: formData.courseId,
                semesterId: formData.semesterId,
                subjectId: formData.subjectId,
                topicId: formData.topicId
            });
            if (response.data?.data && response.data.data.length > 0) {
                setVideos(response.data.data);
            } else {
                setVideos([]);
            }
            setApiHit(false);
        } catch (error) {
            console.error('Error fetching topics:', error);
            setApiHit(false);
            setVideos([]);
        }
    }
    const FetchVideoById = async (videoId) => {
        setApiHit(true);
        try {
            const response = await axios.post(`${NODE_API_URL}/api/student/fetch-video-by-id`, {
                videoId
            });
            if (response.data?.data && response.data.data.length > 0) {
                setVideoPlayer(response.data.data);
            } else {
                setVideoPlayer([]);
            }
            setApiHit(false);
        } catch (error) {
            console.error('Error fetching topics:', error);
            setApiHit(false);
            setVideoPlayer([]);
        }
    }
    useEffect(() => {
        FetchPdfByCourseSemesterSubject(formData.courseId, formData.semesterId, formData.subjectId);
        FetchVideoByCourseSemesterSubject(formData.courseId, formData.semesterId, formData.subjectId, formData.topicId);
    }, [formData.courseId, formData.semesterId, formData.subjectId, formData.topicId]);
    useEffect(() => {
        if (sid) {
            fetchAllCourseAndSemester(sid);
        }
    }, [sid]);
    useEffect(() => {
        FetchVideoById(videoId);
    }, [videoId]);
    console.log(videos)
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
        fetchTopicsBasedOn(topicId);
    }, [formData.subjectId, topicId])

    const redirectToPdfViewer = (dbId, courseId, semesterId, subjectId, topicId) => {
        navigate(`/student/topic-pdf-viewer`, {
            state: { dbId, courseId, semesterId, subjectId, topicId },  // Passing dbId in state
            replace: false      // This will replace the current entry in the history stack
        });
    }
    const redirectToVideoViewer = (dbId, courseId, semesterId, subjectId, topicId) => {
        navigate(`/student/lms-topic-dashboard/${topicId}/${subjectId}/${semesterId}/${courseId}/${dbId}`, {
            replace: false      // This will replace the current entry in the history stack
        });
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const description = videoPlayer[0]?.description
        ? validator.unescape(videoPlayer[0]?.description)
        : '';

    // Split words and handle truncation
    const words = description.split(' ');
    const truncatedDescription = words.length > 50
        ? words.slice(0, 50).join(' ') + '...'
        : description;

    const handleReadMore = () => {
        setModalContent(description);
        setIsModalOpen(true);
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
                                videoId && videoPlayer && (
                                    <>
                                        <div className='col-md-12'>
                                            <div className="iframe-container-admin mb-3">
                                                <iframe
                                                    src={googleDriveUrl(videoPlayer[0]?.video_drive_id)}
                                                    allow="autoplay"
                                                    allowFullScreen
                                                    title="Google Drive Video"
                                                    className="iframe-admin"
                                                ></iframe>
                                            </div>
                                            <h6 className='mb-3'>{videoPlayer[0]?.title}</h6>
                                            <p dangerouslySetInnerHTML={{ __html: truncatedDescription.replace(/<[^>]+>/g, '') }} />
                                            {words.length > 50 && (
                                                <button className="btn bg-white mb-3 font-14 text-danger" onClick={handleReadMore}>
                                                    Read More
                                                </button>
                                            )}

                                            {/* Modal */}
                                            {isModalOpen && (
                                                <div
                                                    className="modal fade show"
                                                    tabIndex="-1"
                                                    style={{ display: 'block' }}
                                                    onClick={() => setIsModalOpen(false)}
                                                >
                                                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title">Description</h5>
                                                                <button
                                                                    type="button"
                                                                    className="btn-close border-0 btn btn-danger"
                                                                    onClick={() => setIsModalOpen(false)}
                                                                >
                                                                    <i className='fas fa-times'></i>
                                                                </button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <p dangerouslySetInnerHTML={{ __html: modalContent }} />
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => setIsModalOpen(false)}
                                                                >
                                                                    Close
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )
                            }
                            <div className={`col-md-3 ${videoId ? 'hide-topic-div' : ''}`}>
                                {
                                    topicList && (
                                        <>
                                            <img src={topicList.thumbnail ? topicList.thumbnail : TopicPng} className='ms-auto small-w-100 mb-3' style={{ maxHeight: '240px' }} />
                                            <h2 className='font-15 h6_new'>{topicList?.[0]?.topic_name || "No topic available"}</h2>
                                        </>
                                    )
                                }
                            </div>
                            <div className='col-md-9'>
                                <div className="nav-tab-container">
                                    <div className="nav-tabs">
                                        {tabs.map((tab) => (
                                            <div
                                                key={tab.id}
                                                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                                                onClick={() => handleTabClick(tab.id)}
                                            >
                                                {tab.label}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="tab-content">
                                        <div className='row'>
                                            {activeTab === 'home' && (
                                                <div className='col-md-12'>
                                                    <p dangerouslySetInnerHTML={{ __html: topicList[0]?.description ? validator.unescape(topicList[0]?.description) : 'No description available.' }} />
                                                </div>
                                            )}
                                            {activeTab === 'pdfs' && (
                                                <div className='col-md-12'>
                                                    <div className='d-flex flex-wrap justify-content-start align-items-center'>
                                                        {
                                                            pdfs && pdfs.map((item, index) => (
                                                                <div key={index} onClick={() => redirectToPdfViewer(item.id, formData.courseId, formData.semesterId, formData.subjectId, formData.topicId)} className='mb-2 mr-3 d-flex flex-column'>
                                                                    <img src={PdfPng} />
                                                                    <span className='font-12 mt-2 text-center text-primary'>View Pdf</span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === 'videos' && (
                                                <>
                                                    {
                                                        videos && videos.map((item, index) => (
                                                            <div key={index} className='col-md-12 mb-3'>
                                                                <div className='thumb-container' onClick={() => redirectToVideoViewer(item.id, formData.courseId, formData.semesterId, formData.subjectId, formData.topicId)}>
                                                                    <img src={item?.thumbnail} />
                                                                    <div className='thumb-side'>
                                                                        <span
                                                                            className='font-12 mb-2'
                                                                            style={{
                                                                                color: videoId == item.id ? '#E56B70' : '#39A0ED',
                                                                            }}
                                                                        >
                                                                            {item?.title}
                                                                        </span>
                                                                        {
                                                                            !videoId && (
                                                                                <button className='btn btn-primary btn-sm'>Watch <i className='fas fa-play'></i></button>
                                                                            )
                                                                        }
                                                                        {
                                                                            videoId && videoId == item.id && (
                                                                                <div className="wave-container">
                                                                                    <div className="wave-bar"></div>
                                                                                    <div className="wave-bar"></div>
                                                                                    <div className="wave-bar"></div>
                                                                                    <div className="wave-bar"></div>
                                                                                    <div className="wave-bar"></div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
export default LmsSubjectDashboard;