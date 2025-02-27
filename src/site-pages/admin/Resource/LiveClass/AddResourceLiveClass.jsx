// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useRef, useState,useMemo } from "react";
import { CKEDITOR_URL, NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter, dataFetchingPost, goBack, extractGoogleDriveId } from "../../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { FormField } from "../../../../site-components/admin/assets/FormField";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor

function AddResourceLiveClass() {
    // Initial form state
    const initialForm = {
        dbId: "",
        courseid: "",
        semesterid: "",
        subjectid: "",
        title: '',
        thumbnail: '',
        liveUrl: '',
        liveDate: '',
        startTime: '',
        endTime: '',
        description: ''
    };
    const [formData, setFormData] = useState(initialForm); // Form state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [courseListing, setCourseListing] = useState([]); // Form submission state
    const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
    const [subjectListing, setSubjectListing] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const { dbId } = useParams();
    // Jodit editor configuration
    const config = useMemo(()=>({
        readonly: false,
        placeholder: 'Enter your description here..',
        spellcheck: true,
        language: 'en',
        defaultMode: '1',
        minHeight: 400,
        maxHeight: -1,
        defaultActionOnPaste: 'insert_as_html',
        defaultActionOnPasteFromWord: 'insert_as_html',
        askBeforePasteFromWord: false,
        askBeforePasteHTML: false,
    }),[]);
    const handleEditorChange = (newContent) => {
        setFormData((prev) => ({
            ...prev,
            description: newContent,
        }));
    }
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
                `${NODE_API_URL}/api/resource/live-class/resource-live-class-list`,
                { dbId }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                const data = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    dbId: data.id,
                    courseid: data.courseId,
                    semesterid: data.semesterId,
                    subjectid: data.subjectId,
                    title: data.title ? validator.unescape(data.title) : data.title,
                    liveUrl: data.liveUrl ? validator.unescape(data.liveUrl) : data.liveUrl,
                    liveDate: data.liveDate ? data.liveDate.split('T')[0] : data.liveDate,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    description: validator.unescape(data?.description || ""), // Ensure content is unescaped properly
                }));
                setPreviewImage(data.thumbnail);
                fetchSubjectBasedOnCourseAndSemeter(data.courseId, data.semesterId);
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
        if (!formData.title) {
            errorMsg("title", "Title is required.");
            toast.error("Title is required.");
            return setIsSubmit(false);
        }
        if (!formData.liveUrl || (formData.liveUrl && !validator.isURL(formData.liveUrl))) {
            errorMsg("liveUrl", "Video URL is required.");
            toast.error("Video URL is required.");
            return setIsSubmit(false);
        }
        if (!formData.liveDate) {
            errorMsg("liveDate", "Date is required.");
            toast.error("Date is required.");
            return setIsSubmit(false);
        }
        if (formData.liveDate && !formData.dbId) {
            // Check if liveDate is not a past date
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

            const selectedDate = new Date(formData.liveDate);
            if (selectedDate < today) {
                errorMsg("liveDate", "Date cannot be in the past.");
                toast.error("Date cannot be in the past.");
                return setIsSubmit(false);
            }

        }
        if (!formData.startTime) {
            errorMsg("startTime", "Start Time is required.");
            toast.error("Start Time is required.");
            return setIsSubmit(false);
        }
        if (!formData.endTime) {
            errorMsg("endTime", "End Time is required.");
            toast.error("End Time is required.");
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
                `${NODE_API_URL}/api/resource/live-class/resource-live-class-for-subject`,
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
        if (name === 'liveUrl') {
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
                    const { courseId } = response.data[0];
                    fetchSemesterBasedOnCourseAndYear(courseId);
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
                                    <span className="breadcrumb-item">Live Class</span>
                                    <span className="breadcrumb-item active">{dbId ? 'Update Live Class' : 'Add New Live Class'}</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2 col-md-10 m-auto px-0">
                            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                                <h5 className="card-title h6_new pt-2">
                                    {dbId ? 'Update Live Class' : 'Add New Live Class'}
                                </h5>
                                <div className="ml-auto id-mobile-go-back mb-2">
                                    <button
                                        className="mr-auto btn-md btn border-0 btn-light mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <a href="/admin/resource-live-class-url">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            <i className="fas fa-list"></i> Live Class List
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
                                                <div className="col-md-4 col-lg-4 col-12 form-group">
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

                                                <div className="col-md-4 col-lg-4 col-12 form-group">
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

                                                <div className="col-md-4 col-lg-4 col-12 form-group">
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
                                                    placeholder="Enter Title"
                                                    required
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    column="col-md-12 col-lg-12 col-12 col-sm-12"
                                                />

                                                <FormField
                                                    borderError={error.field === "liveUrl"}
                                                    errorMessage={error.field === "liveUrl" && error.msg}
                                                    label="Live Url (Ex: Google Meet Url)"
                                                    name="liveUrl"
                                                    id="liveUrl"
                                                    placeholder="Enter Url"
                                                    required
                                                    value={formData.liveUrl}
                                                    onChange={handleChange}
                                                    column="col-md-12 col-lg-12 col-12 col-sm-12"
                                                />
                                                <FormField
                                                    borderError={error.field === "liveDate"}
                                                    errorMessage={error.field === "liveDate" && error.msg}
                                                    label="Live Date"
                                                    name="liveDate"
                                                    id="liveDate"
                                                    required
                                                    value={formData.liveDate}
                                                    type="date"
                                                    onChange={handleChange}
                                                    column="col-md-4 col-lg-4 col-12 col-sm-12"
                                                />
                                                <FormField
                                                    borderError={error.field === "startTime"}
                                                    errorMessage={error.field === "startTime" && error.msg}
                                                    label="Start Time"
                                                    name="startTime"
                                                    id="startTime"
                                                    value={formData.startTime}
                                                    type="time"
                                                    required
                                                    onChange={handleChange}
                                                    column="col-md-4 col-lg-4 col-12 col-sm-12"
                                                />
                                                <FormField
                                                    borderError={error.field === "endTime"}
                                                    errorMessage={error.field === "endTime" && error.msg}
                                                    label="End Time"
                                                    name="endTime"
                                                    id="endTime"
                                                    required
                                                    value={formData.endTime}
                                                    type="time"
                                                    onChange={handleChange}
                                                    column="col-md-4 col-lg-4 col-12 col-sm-12"
                                                />
                                                <div className="col-md-12 col-lg-12">
                                                    <JoditEditor
                                                        value={formData?.description ? validator.unescape(formData.description) : ""}
                                                        config={config}
                                                        onBlur={handleEditorChange}
                                                    />
                                                </div>
                                                <div className="col-md-12 col-lg-12 col-12">
                                                    <button
                                                        disabled={isSubmit}
                                                        className="btn btn-dark btn-block d-flex justify-content-center align-items-center mt-2"
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
export default AddResourceLiveClass;
