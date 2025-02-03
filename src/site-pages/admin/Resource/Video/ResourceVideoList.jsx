// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from 'react-toastify';
import { capitalizeFirstLetter, dataFetchingDelete, dataFetchingPatch, dataFetchingPost, extractGoogleDriveId, formatDate, goBack, googleDriveUrl } from '../../../../site-components/Helper/HelperFunction';
import { DeleteSweetAlert } from '../../../../site-components/Helper/DeleteSweetAlert';
import '../../../../../node_modules/primeicons/primeicons.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import Select from "react-select";
function ResourceVideoList() {
    const navigate = useNavigate();
    const [showFilter, setShowFilter] = useState(true)
    const [ResourceVideoList, setResourceVideoListing] = useState([]);
    const [courseListing, setCourseListing] = useState([]); // Form submission state
    const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
    const [subjectListing, setSubjectListing] = useState([]);
    const [topicList, setTopicList] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [recycleTitle, setRecycleTitle] = useState("Trash");
    const initialData = {
        courseid: "",
        semesterid: "",
        subjectid: "",
        topicid: "",
        deleteStatus: 0,
        status: 1
    };
    const [formData, setFormData] = useState(initialData);
    const fetchTopicBasedOnCSS = async (courseid, semesterid, subjectid) => {
        try {
            const response = await axios.post(`${NODE_API_URL}/api/topic/fetch`, {
                courseid: courseid,
                semesterid: semesterid,
                subject: subjectid,
                column: 'id, topic_name'
            });
            if (response.data?.statusCode === 200 && response.data.data.length > 0) {
                setTopicList(response.data.data);
            } else {
                setTopicList([]);
            }
        } catch (error) {
            setTopicList([]);
        }
    }
    useEffect(() => {
        if (formData.courseid && formData.semesterid && formData.subjectid) {
            fetchTopicBasedOnCSS(formData.courseid, formData.semesterid, formData.subjectid); 0
        }
    }, [formData.courseid, formData.semesterid, formData.subjectid]);
    const courseListDropdown = async () => {
        try {
            const response = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
            if (response.data?.statusCode === 200 && response.data.data.length > 0) {
                setCourseListing(response.data.data);
            } else {
                toast.error("Course not found.");
                setCourseListing([]);
            }
        } catch (error) {
            setCourseListing([]);
        }
    };
    useEffect(() => {
        courseListDropdown();
    }, []);

    const fetchSemesterBasedOnCourseAndYear = async (courseid) => {
        if (
            !courseid ||
            !Number.isInteger(parseInt(courseid, 10)) ||
            parseInt(courseid, 10) <= 0
        )
            return toast.error("Invalid course ID.");
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/semester/fetch`,
                {
                    courseid: courseid,
                    column: "id, semtitle",
                }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                setSemesterListing(response.data);
            } else {
                toast.error("Semester not found.");
                setSemesterListing([]);
            }
        } catch (error) {
            setSemesterListing([]);
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    };
    const fetchSubjectBasedOnCourseAndSemeter = async (courseid, semesterid) => {
        if (
            !courseid ||
            !Number.isInteger(parseInt(courseid, 10)) ||
            parseInt(courseid, 10) <= 0
        )
            return toast.error("Invalid course ID.");
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/semester-subject/fetch`,
                {
                    courseid: courseid,
                    semesterid: semesterid,
                    column: "id, subject",
                }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                setSubjectListing(response.data);
            } else {
                toast.error("Semester not found.");
                setSubjectListing([]);
            }
        } catch (error) {
            setSubjectListing([]);
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleToggleStatus = async (dbId, currentStatus) => {
        if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
        // Toggle the status (currentStatus is the current checkbox state)
        const newStatus = currentStatus === 1 ? 0 : 1;
        try {
            const loguserid = secureLocalStorage.getItem('login_id');
            const login_type = secureLocalStorage.getItem('loginType');
            const response = await dataFetchingPatch(`${NODE_API_URL}/api/resource/video/status/${dbId}/${loguserid}/${login_type}`);
            if (response?.statusCode === 200) {
                toast.success(response.message);
                // Update the notice list to reflect the status change
                setResourceVideoListing(prevList =>
                    prevList.map(item =>
                        item.id === dbId ? { ...item, status: newStatus } : item
                    )
                );
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;

            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    }
    const updateDataFetch = async (dbId) => {
        if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
        navigate(`/admin/add-resource-video/${dbId}`, { replace: false });
    }
    const handleSubmit = async (e = false) => {
        if (e) e.preventDefault();
        setIsSubmit(true);
        try {
            if (!formData.courseid) {
                toast.error("Course is required.");
                return setIsSubmit(false);
            }

            if (!formData.semesterid) {
                toast.error("Semester is required.");
                return setIsSubmit(false);
            }

            if (!formData.subjectid) {
                toast.error("Subject is required.");
                return setIsSubmit(false);
            }
            const response = await axios.post(`${NODE_API_URL}/api/resource/video/fetch`, {
                courseid: formData.courseid,
                semesterid: formData.semesterid,
                subjectid: formData.subjectid,
                topicid: formData.topicid,
                deleteStatus: formData.deleteStatus,
                status: formData.status,
                listing: 'yes'
            });
            if (response.data?.statusCode === 200 && response.data.data.length > 0) {
                setResourceVideoListing(response.data.data);
            } else {
                setTopicList([]);
            }
        } catch (error) {
            setResourceVideoListing([]);
        } finally {
            setIsSubmit(false);
        }
    }
    const deleteStatus = async (dbId) => {
        if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
        try {
            const deleteAlert = await DeleteSweetAlert();
            if (deleteAlert) {
                const loguserid = secureLocalStorage.getItem('login_id');
                const login_type = secureLocalStorage.getItem('loginType');
                const response = await dataFetchingDelete(`${NODE_API_URL}/api/resource/video/deleteStatus/${dbId}/${loguserid}/${login_type}`);
                if (response?.statusCode === 200) {
                    toast.success(response.message);
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;

            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    }
    const showRecyleBin = () => {
        setRecycleTitle(recycleTitle === "Trash" ? "Hide Trash" : "Trash");
        setFormData((prev) => ({
            ...prev,
            deleteStatus: recycleTitle === "Trash" ? 1 : 0
        }));
        handleSubmit();
    }
    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container-fluid">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                    <a href="./" className="breadcrumb-item">
                                        <i className="fas fa-home m-r-5" /> Dashboard
                                    </a>
                                    <span className="breadcrumb-item">Resource</span>
                                    <span className="breadcrumb-item">Video</span>
                                    <span className="breadcrumb-item active">Video List</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">Video List</h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 btn-light mr-2"
                                        onClick={() => goBack()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <Link
                                        to={'/admin/add-resource-video'}
                                        className="ml-2 btn-md btn border-0 btn-secondary"
                                    >
                                        <i className="fas fa-plus" /> Add New
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className='card-header d-flex justify-content-between align-items-center position-relative py-0 px-3'>
                                <h6 className='h6_new card-title'>
                                    Filter Records
                                </h6>
                                <button className='btn btn-info' onClick={() => setShowFilter(!showFilter)}>
                                    {showFilter ? (
                                        <i className="fas fa-times" /> // Close icon
                                    ) : (
                                        <i className="fas fa-filter" /> // Filter icon
                                    )}
                                </button>
                            </div>
                            <div className={`card-body px-3 ${showFilter ? '' : 'd-none'}`}>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-3 col-lg-3 col-12 form-group">
                                            <label className="font-weight-semibold">
                                                Course <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                options={courseListing.map((item) => ({
                                                    value: item.id,
                                                    label: item.coursename,
                                                    year: item.duration,
                                                }))}
                                                onChange={(selectedOption) => {
                                                    setFormData({
                                                        ...formData,
                                                        courseid: selectedOption.value,
                                                    });
                                                    fetchSemesterBasedOnCourseAndYear(
                                                        selectedOption.value
                                                    );
                                                }}
                                                value={
                                                    courseListing.find(
                                                        (item) =>
                                                            item.id === parseInt(formData.courseid)
                                                    )
                                                        ? {
                                                            value: parseInt(formData.courseid),
                                                            label: courseListing.find(
                                                                (item) =>
                                                                    item.id === parseInt(formData.courseid)
                                                            ).coursename,
                                                        }
                                                        : { value: formData.courseid, label: "Select" }
                                                }
                                            />
                                        </div>

                                        <div className="col-md-3 col-lg-3 col-12 form-group">
                                            <label className="font-weight-semibold">
                                                Semester <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                options={semesterListing.map((item) => ({
                                                    value: item.id,
                                                    label: capitalizeFirstLetter(item.semtitle),
                                                }))}
                                                onChange={(selectedOption) => {
                                                    setFormData({
                                                        ...formData,
                                                        semesterid: selectedOption.value,
                                                    });
                                                    fetchSubjectBasedOnCourseAndSemeter(
                                                        formData.courseid, selectedOption.value
                                                    );
                                                }}
                                                value={
                                                    semesterListing.find(
                                                        (item) => item.id === formData.semesterid
                                                    )
                                                        ? {
                                                            value: formData.semesterid,
                                                            label: capitalizeFirstLetter(
                                                                semesterListing.find(
                                                                    (item) =>
                                                                        item.id === formData.semesterid
                                                                ).semtitle
                                                            ),
                                                        }
                                                        : {
                                                            value: formData.semesterid,
                                                            label: "Select",
                                                        }
                                                }
                                            />
                                        </div>

                                        <div className="col-md-6 col-lg-6 col-12 form-group">
                                            <label className="font-weight-semibold">
                                                Subject <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                options={subjectListing.map((item) => ({
                                                    value: item.id,
                                                    label: capitalizeFirstLetter(item.subject),
                                                }))}
                                                onChange={(selectedOption) => {
                                                    setFormData({
                                                        ...formData,
                                                        subjectid: selectedOption.value,
                                                    });
                                                }}
                                                value={
                                                    subjectListing.find(
                                                        (item) => item.id === formData.subjectid
                                                    )
                                                        ? {
                                                            value: formData.subjectid,
                                                            label: capitalizeFirstLetter(
                                                                subjectListing.find(
                                                                    (item) => item.id === formData.subjectid
                                                                ).subject
                                                            ),
                                                        }
                                                        : { value: formData.subjectid, label: "Select" }
                                                }
                                            />
                                        </div>
                                        <div className="col-md-8 col-lg-8 col-12 form-group">
                                            <label className="font-weight-semibold">
                                                Topic
                                            </label>
                                            <Select
                                                options={topicList.map((item) => ({
                                                    value: item.id,
                                                    label: capitalizeFirstLetter(item.topic_name),
                                                }))}
                                                onChange={(selectedOption) => {
                                                    setFormData({
                                                        ...formData,
                                                        topicid: selectedOption.value,
                                                    });
                                                }}
                                                value={
                                                    topicList.find(
                                                        (item) => item.id === formData.topicid
                                                    )
                                                        ? {
                                                            value: formData.topicid,
                                                            label: capitalizeFirstLetter(
                                                                topicList.find(
                                                                    (item) => item.id === formData.topicid
                                                                ).topic_name
                                                            ),
                                                        }
                                                        : { value: formData.topicid, label: "Select" }
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4 col-lg-4 col-12 d-flex justify-content-between align-items-center mt-2">
                                            <button
                                                disabled={isSubmit}
                                                className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                                                type="submit"
                                            >
                                                Search{" "}
                                                {isSubmit && (
                                                    <>
                                                        &nbsp; <div className="loader-circle"></div>
                                                    </>
                                                )}
                                            </button>
                                            <button className={`btn ${recycleTitle === "Trash" ? 'btn-secondary' : 'btn-danger'}`} onClick={showRecyleBin}>{recycleTitle} <i className="fa fa-recycle"></i></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="row">
                            {
                                ResourceVideoList.length == 0 && (
                                    <>
                                        <div className='col-md-12 alert alert-danger'>
                                            Data not available
                                        </div>
                                    </>
                                )
                            }
                            {
                                ResourceVideoList && ResourceVideoList.length > 0 && ResourceVideoList.map((rowData, index) => {
                                    return (
                                        <div className="col-md-4" key={index}>
                                            <div className='card'>
                                                <div className='card-body p-3'>
                                                    <div className="iframe-container-admin">
                                                        <iframe
                                                            src={googleDriveUrl(rowData.video_drive_id)}
                                                            allow="autoplay"
                                                            allowFullScreen
                                                            title="Google Drive Video"
                                                            className="iframe-admin"
                                                        ></iframe>
                                                    </div>
                                                    <h6 className='card-title font-14 mb-1 mt-2'>{rowData.title}</h6>
                                                    <h6 className='card-text font-14'>Topic: {rowData.topic_name}</h6>
                                                    <div className='card-text d-flex'>
                                                        <div className="switch mt-1 w-auto mr-2">
                                                            <input type="checkbox"
                                                                checked={rowData.status === 1}
                                                                onChange={() => handleToggleStatus(rowData.id, rowData.status)}
                                                                id={`switch${rowData.id}`} />
                                                            <label className="mt-0" htmlFor={`switch${rowData.id}`}></label>
                                                        </div>
                                                        <button onClick={() => updateDataFetch(rowData.id)} className="btn btn-warning font-14">
                                                            Edit <i className="fas fa-edit"></i>
                                                        </button>
                                                        {
                                                            rowData.deleteStatus == 0 ?
                                                                <OverlayTrigger
                                                                    placement="bottom"
                                                                    overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}
                                                                >
                                                                    <button className="btn btn-danger ml-2 font-14">
                                                                        Delete <i className="fas fa-trash-alt" onClick={() => deleteStatus(rowData.id)}></i>
                                                                    </button>
                                                                </OverlayTrigger>
                                                                :
                                                                <OverlayTrigger
                                                                    placement="bottom"
                                                                    overlay={<Tooltip id="button-tooltip-2">Restore</Tooltip>}
                                                                >
                                                                    <button className="btn btn-danger ml-2 font-14">
                                                                        Restore <i className="fas fa-recycle" onClick={() => deleteStatus(rowData.id)}></i>
                                                                    </button>
                                                                </OverlayTrigger>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )

                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ResourceVideoList;