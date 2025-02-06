// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useRef, useState } from "react";
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter, dataFetchingPost, goBack, extractGoogleDriveId } from "../../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { FormField } from "../../../../site-components/admin/assets/FormField";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor

function AddResourceVideo() {
    // Initial form state
    const initialForm = {
        dbId: "",
        courseid: "",
        semesterid: "",
        subjectid: "",
        topicid: '',
        title: '',
        thumbnail: '',
        video_url: '',
        video_drive_id: '',
        video_type: 'drive', // drive, youtube
        description: ''
    };
    const [formData, setFormData] = useState(initialForm); // Form state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [courseListing, setCourseListing] = useState([]); // Form submission state
    const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
    const [subjectListing, setSubjectListing] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [topicList, setTopicList] = useState([]);
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const { dbId } = useParams();
    // Jodit editor configuration
    const config = {
        readonly: false, // set to true if you want readonly mode
    };
    const handleEditorChange = (newContent) => {
        setFormData((prev) => ({
            ...prev,
            description: newContent,
        }));
    }
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
                console.log(response.data.data, "TOPIC")
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
                fetchTopicBasedOnCSS(courseid, semesterid, formData.subjectid);

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
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.type.startsWith("image/")) {
            setPreviewImage(URL.createObjectURL(file));
            setFormData((formData) => ({ ...formData, thumbnail: file }));
        } else {
            errorMsg('thumbnail', "Invalid image format. Only png, jpeg, jpg, and webp are allowed.");
            toast.error("Invalid image format. Only png, jpeg, jpg, and webp are allowed.");
        }
    };
    const updateFetchData = async (dbId) => {
        if (
            !dbId ||
            !Number.isInteger(parseInt(dbId, 10)) ||
            parseInt(dbId, 10) <= 0
        ) {
            toast.error("Invalid ID.");
            return null;
        }
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/resource/video/fetch`,
                { dbId }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                const data = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    dbId: data.id,
                    courseid: data.courseid,
                    semesterid: data.semesterid,
                    subjectid: data.subjectid,
                    topicid: data.topicid,
                    title: data.title ? validator.unescape(data.title) : data.title,
                    video_url: data.video_url ? validator.unescape(data.video_url) : data.video_url,
                    video_drive_id: data.video_drive_id ? validator.unescape(data.video_drive_id) : data.video_drive_id,
                    video_type: data.video_type,
                    description: data.description ? validator.unescape(data.description) : data.description
                }));
                setPreviewImage(data.thumbnail)
                fetchSubjectBasedOnCourseAndSemeter(data.courseid, data.semesterid)
                return response;
            } else {
                toast.error("Data not found.");
                return null;
            }
        } catch (error) {
            return null;
        }
    };


    // Handle input field change
    const errorMsg = (field, msg) => {
        setError((prev) => ({
            ...prev,
            field: field,
            msg: msg,
        }));
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        errorMsg("", "");

        if (!formData.courseid) {
            errorMsg("courseid", "Course is required.");
            toast.error("Course is required.");
            return setIsSubmit(false);
        }

        if (!formData.semesterid) {
            errorMsg("semesterid", "Semester is required.");
            toast.error("Semester is required.");
            return setIsSubmit(false);
        }

        if (!formData.subjectid) {
            errorMsg("subject", "Subject is required.");
            toast.error("Subject is required.");
            return setIsSubmit(false);
        }
        if (!formData.topicid) {
            errorMsg("topicid", "Topic is required.");
            toast.error("Topic is required.");
            return setIsSubmit(false);
        }
        if (!formData.thumbnail && !formData.dbId) {
            errorMsg("thumbnail", "Thumbnail is required.");
            toast.error("Thumbnail is required.");
            return setIsSubmit(false);
        }
        if (!formData.title) {
            errorMsg("title", "Title is required.");
            toast.error("Title is required.");
            return setIsSubmit(false);
        }
        if (!formData.video_url) {
            errorMsg("video_url", "Video URL is required.");
            toast.error("Video URL is required.");
            return setIsSubmit(false);
        }
        try {
            const sendFormData = new FormData();
            for (let key in formData) {
                sendFormData.append(key, formData[key]);
            }
            sendFormData.append('loguserid', secureLocalStorage.getItem('login_id'));
            sendFormData.append('login_type', secureLocalStorage.getItem('loginType'));
            // submit to the API here
            const response = await axios.post(
                `${NODE_API_URL}/api/resource/video/register`,
                sendFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            );
            if (
                response.data?.statusCode === 200 ||
                response.data?.statusCode === 201
            ) {
                errorMsg("", "");
                toast.success(response.data.message);
                if (response.data?.statusCode === 201) {
                    setFormData({ ...formData, thumbnail: "" });
                    setTimeout(() => {
                        window.location.reload();
                    }, 300);
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;
            const errorField = error.response?.data?.errorField;

            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                if (errorField) errorMsg(errorField, error.response?.data?.message);
                toast.error(error.response.data.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        } finally {
            setIsSubmit(false);
        }
    };
    // Handle input field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'video_url') {
            let videoId = extractGoogleDriveId(value);
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
                video_drive_id: videoId,
            }));
            return false;
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    useEffect(() => {
        if (dbId) {
            updateFetchData(dbId).then((response) => {
                if (response?.statusCode === 200 && response.data.length > 0) {
                    const { courseid } = response.data[0];
                    fetchSemesterBasedOnCourseAndYear(courseid);
                }
            });
        }
    }, [dbId]);
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
                                    <span className="breadcrumb-item active">{dbId ? 'Update Video' : 'Add New Video'}</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    {dbId ? "Update Video" : "Add New Video"}
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 btn-light mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <a href="/admin/list-resource-video">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            <i className="fas fa-list"></i> Video List
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-10 mx-auto">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 col-lg-6 col-12 form-group">
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

                                                    {error.field === "courseid" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
                                                </div>

                                                <div className="col-md-6 col-lg-6 col-12 form-group">
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
                                                    {error.field === "semesterid" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
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
                                                    {error.field === "subject" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-6 col-12 form-group">
                                                    <label className="font-weight-semibold">
                                                        Topic <span className="text-danger">*</span>
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
                                                    {error.field === "topicid" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label>Choose Image</label>
                                                    <input
                                                        type="file"
                                                        id="thumbnail"
                                                        accept=".png, .jpg, .jpeg, .webp"
                                                        className="form-control"
                                                        onChange={handleFileChange}
                                                    />
                                                    {previewImage && (
                                                        <img src={previewImage} alt="Preview" className="img-fluid mt-3" style={{ maxHeight: 300 }} />
                                                    )}
                                                </div>
                                                <FormField
                                                    borderError={error.field === "title"}
                                                    errorMessage={error.field === "title" && error.msg}
                                                    label="Title"
                                                    name="title"
                                                    id="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    column="col-md-12 col-lg-12 col-12 col-sm-12"
                                                />
                                                <FormField
                                                    borderError={error.field === "video_url"}
                                                    errorMessage={error.field === "video_url" && error.msg}
                                                    label="Video Url (Google Drive)"
                                                    name="video_url"
                                                    id="video_url"
                                                    value={formData.video_url}
                                                    onChange={handleChange}
                                                    column="col-md-12 col-lg-12 col-12 col-sm-12"
                                                />
                                                <div className="col-md-12 col-lg-12">
                                                    <label className='font-weight-semibold'>Description</label>
                                                    <JoditEditor
                                                        value={formData?.description ? validator.unescape(formData.description) : ""}
                                                        config={config}
                                                        onBlur={handleEditorChange}
                                                    />

                                                </div>
                                                <div className="col-md-12 col-lg-12 col-12">
                                                    <button
                                                        disabled={isSubmit}
                                                        className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                                                        type="submit"
                                                    >
                                                        Save{" "}
                                                        {isSubmit && (
                                                            <>
                                                                &nbsp; <div className="loader-circle"></div>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
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
export default AddResourceVideo;
