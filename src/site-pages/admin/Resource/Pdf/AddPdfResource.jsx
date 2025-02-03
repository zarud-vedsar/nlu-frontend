// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
    capitalizeFirstLetter,
    dataFetchingPost,
    goBack,
} from "../../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

function AddNewResourcePdf() {
    // Initial form state
    const initialForm = {
        dbId: "",
        courseid: "",
        semesterid: "",
        subjectid: "",
        pdf_file: '',
    };
    const [formData, setFormData] = useState(initialForm); // Form state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [courseListing, setCourseListing] = useState([]); // Form submission state
    const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
    const [subjectListing, setSubjectListing] = useState([]);
    const [previewPdf, setPreviewPdf] = useState(null);
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const { dbId } = useParams();
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
        if (file.type === "application/pdf") {
            setPreviewPdf(URL.createObjectURL(file));
            setFormData((formData) => ({ ...formData, pdf_file: file }));
        } else {
            errorMsg("pdf_file", "Invalid PDF format. Only .pdf and .pdfx are allowed.");
            toast.error("Invalid PDF format. Only .pdf file are allowed.");
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
                `${NODE_API_URL}/api/resource/pdf/fetch`,
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
                }));
                setPreviewPdf(data.pdf);
                fetchSubjectBasedOnCourseAndSemeter(data.courseid, data.semesterid)
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

        if (!formData.pdf_file && !formData.dbId) {
            errorMsg("pdf_file", "PDF file is required.");
            toast.error("PDF file is required.");
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
                `${NODE_API_URL}/api/resource/pdf/register`,
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
                    setFormData({ ...formData, pdf_file: "" });
                    setPreviewPdf(null);
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
                                    <span className="breadcrumb-item">Pdf</span>
                                    <span className="breadcrumb-item active">{dbId ? 'Update Pdf' : 'Add New Pdf'}</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    {dbId ? "Update Pdf" : "Add New Pdf"}
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 btn-light mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <a href="/admin/list-resource-pdf">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            <i className="fas fa-list"></i> Pdf List
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
                                                <div className="col-md-12 col-12 form-group">
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

                                                <div className="col-md-12 col-12 form-group">
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

                                                <div className="col-md-12 col-12 form-group">
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
                                                <div className={`form-group col-md-12`}>
                                                    <label>Upload PDF <span className="text-danger">*</span></label>
                                                    <input
                                                        type="file"
                                                        id="pdf_file"
                                                        accept=".pdf"
                                                        className="form-control"
                                                        onChange={handleFileChange}
                                                    />
                                                    {error.field === "pdf_file" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
                                                    {previewPdf && (
                                                        <iframe
                                                            src={previewPdf}
                                                            title="PDF Preview"
                                                            className="mt-3"
                                                            style={{ width: '100%', height: 300 }}
                                                        ></iframe>
                                                    )}
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
export default AddNewResourcePdf;
