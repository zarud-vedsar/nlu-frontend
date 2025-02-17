// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
    capitalizeFirstLetter,
    dataFetchingPost,
    goBack,
} from "../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

function SemesterSubjectAdd() {
    // Initial form state
    const initialForm = {
        dbId: "",
        courseid: "",
        semesterid: "",
        subject: "",
        practNonPract: "",
        subjectType: "",
        isGroup: "",
        groupName: "",
        subGroupName: "",
    };
    const { semesterId } = useParams();
    const [formData, setFormData] = useState(initialForm); // Form state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [courseListing, setCourseListing] = useState([]); // Form submission state
    const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const practNonPract = ["Yes", "No"];
    const subjectType = ["Compulsory", "Optional", "Elective", "Seminar","optional-paper"];
    const isGroup = ["Yes", "No"];
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
                toast.success(response.message);
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
    const updateFetchData = async (semesterId) => {
        if (
            !semesterId ||
            !Number.isInteger(parseInt(semesterId, 10)) ||
            parseInt(semesterId, 10) <= 0
        ) {
            toast.error("Invalid ID.");
            return null;
        }
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/semester-subject/fetch`,
                { dbId: semesterId }
            );
        
            if (response?.statusCode === 200 && response.data.length > 0) {
                toast.success(response.message);
                const data = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    dbId: data.id,
                    courseid: data.courseid,
                    semesterid: data.semesterid,
                    subject: data.subject,
                    practNonPract: data.practNonPract,
                    subjectType: data.subjectType,
                    isGroup: data.isGroup,
                    groupName: data.groupName,
                    subGroupName: data.subGroupName,
                }));
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
        if (!formData.subjectType) {
            errorMsg("subjectType", "Subject Type is required.");
            toast.error("Subject Type is required.");
            return setIsSubmit(false);
        }
        if (!formData.isGroup) {
            errorMsg("isGroup", "Group is required.");
            toast.error("Group is required.");
            return setIsSubmit(false);
        }
        if (formData.isGroup == "Yes" && !formData.groupName) {
            errorMsg("groupName", "Group Name is required.");
            toast.error("Group Name is required.");
            return setIsSubmit(false);
        }



        if (!formData.subject) {
            errorMsg("subject", "Subject is required.");
            toast.error("Subject is required.");
            return setIsSubmit(false);
        }
        if (!formData.practNonPract) {
            errorMsg("practNonPract", "Practical is required.");
            toast.error("Practical is required.");
            return setIsSubmit(false);
        }

        try {
            formData.loguserid = secureLocalStorage.getItem("login_id");
            formData.login_type = secureLocalStorage.getItem("loginType");
            // submit to the API here
            const response = await axios.post(
                `${NODE_API_URL}/api/semester-subject/register`,
                formData
            );
            if (
                response.data?.statusCode === 200 ||
                response.data?.statusCode === 201
            ) {
                errorMsg("", "");
                toast.success(response.data.message);
                setFormData({
                    ...formData,
                    subGroupName: "",
                });
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
        if (semesterId) {
            updateFetchData(semesterId).then((response) => {
                if (response?.statusCode === 200 && response.data.length > 0) {
                    const { courseid } = response.data[0];
                    fetchSemesterBasedOnCourseAndYear(courseid);
                }
            });
        }
    }, [semesterId]);

    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container-fluid">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                    <a href="./" className="breadcrumb-item">
                                        <i className="fas fa-home m-r-5" /> Learning Management
                                    </a>
                                    
                                    <span className="breadcrumb-item">Semester Wise Subject</span>
                                    <span className="breadcrumb-item active">
                                    {semesterId ? "Update Subject" : "Add New Subject"}
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    {semesterId ? "Update Subject" : "Add New Subject"}
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 btn-light mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <a href="/admin/semester-subject">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            <i className="fas fa-list"></i> Subject List
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
                                                <div className="col-md-6 col-12 form-group">
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

                                                <div className="col-md-6 col-12 form-group">
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
                                                <div className="col-md-6 col-12 form-group">
                                                    <label className="font-weight-semibold">
                                                        Subject Type <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        options={subjectType.map((item) => ({
                                                            value: item,
                                                            label: capitalizeFirstLetter(item),
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({
                                                                ...formData,
                                                                subjectType: selectedOption.value,
                                                            });
                                                        }}
                                                        value={
                                                            subjectType.find(
                                                                (item) => item === formData.subjectType
                                                            )
                                                                ? {
                                                                    value: formData.subjectType,
                                                                    label: capitalizeFirstLetter(
                                                                        formData.subjectType
                                                                    ),
                                                                }
                                                                : {
                                                                    value: formData.subjectType,
                                                                    label: "Select",
                                                                }
                                                        }
                                                    />
                                                    {error.field === "subjectType" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
                                                </div>

                                                <div className="col-md-6 col-12 form-group">
                                                    <label className="font-weight-semibold">
                                                        Group <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        options={isGroup.map((item) => ({
                                                            value: item,
                                                            label: capitalizeFirstLetter(item),
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({
                                                                ...formData,
                                                                isGroup: selectedOption.value,
                                                            });
                                                            if (selectedOption.value == "No") {

                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    groupName: '',
                                                                    subGroupName: '',
                                                                }));
                                                            }
                                                        }}

                                                        value={
                                                            isGroup.find((item) => item === formData.isGroup)
                                                                ? {
                                                                    value: formData.isGroup,
                                                                    label: capitalizeFirstLetter(
                                                                        formData.isGroup
                                                                    ),
                                                                }
                                                                : { value: formData.isGroup, label: "Select" }
                                                        }
                                                    />
                                                    {error.field === "isGroup" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
                                                </div>

                                                {formData.isGroup == "Yes" && (
                                                    <>
                                                        {" "}
                                                        <div className="form-group col-md-6 col-12">
                                                            <label>
                                                                Group Name{" "}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="title"
                                                                value={formData.groupName}
                                                                onChange={(e) => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        groupName: e.target.value,
                                                                    });
                                                                }}
                                                            />
                                                            {error.field === "groupName" && (
                                                                <span className="text-danger">{error.msg}</span>
                                                            )}
                                                        </div>
                                                        <div className="form-group col-md-6 col-12">
                                                            <label>Sub Group Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="title"
                                                                value={formData.subGroupName}
                                                                onChange={(e) => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        subGroupName: e.target.value,
                                                                    });
                                                                }}
                                                            />
                                                        </div>{" "}
                                                    </>
                                                )}

                                                <div className="form-group col-md-6 col-12">
                                                    <label>
                                                        Subject Name <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="title"
                                                        value={formData.subject}
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                subject: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                    {error.field === "subject" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
                                                </div>


                                                <div className="col-md-6 col-12 form-group">
                                                    <label className="font-weight-semibold">
                                                        Practical Subject<span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        options={practNonPract.map((item) => ({
                                                            value: item,
                                                            label: capitalizeFirstLetter(item),
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({
                                                                ...formData,
                                                                practNonPract: selectedOption.value,
                                                            });
                                                        }}
                                                        value={
                                                            practNonPract.find(
                                                                (item) => item === formData.practNonPract
                                                            )
                                                                ? {
                                                                    value: formData.practNonPract,
                                                                    label: capitalizeFirstLetter(
                                                                        formData.practNonPract
                                                                    ),
                                                                }
                                                                : {
                                                                    value: formData.practNonPract,
                                                                    label: "Select",
                                                                }
                                                        }
                                                    />
                                                    {error.field === "practNonPract" && (
                                                        <span className="text-danger">{error.msg}</span>
                                                    )}
                                                </div>
                                                <div className="col-md-12 col-lg-12 col-12">
                                                    <button
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
export default SemesterSubjectAdd;
