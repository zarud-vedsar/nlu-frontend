// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
    capitalizeFirstLetter,
    dataFetchingPost,
    goBack
} from "../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { FormField} from "../../../site-components/admin/assets/FormField";

function AddNew() {
    const { dbId } = useParams();
    // Initial form state
    const initialForm = {
      dbId: "",
      courseid: "",
      semesterid: "",
      classroom: "",
      saturdayValueAdded: "",
      time1: "",
      time2: "",
      time3: "",
      time4: "",
      time5: "",
      time6: "",
      time7: "",
      timeBreak: "",
      lunchBreak: "",
      time1subject1: "",
      time1subject2: "",
      time1subject3: "",
      time1subject4: "",
      time1subject5: "",
      time1subject6: "",
      time2subject1: "",
      time2subject2: "",
      time2subject3: "",
      time2subject4: "",
      time2subject5: "",
      time2subject6: "",
      time3subject1: "",
      time3subject2: "",
      time3subject3: "",
      time3subject4: "",
      time3subject5: "",
      time3subject6: "",
      time4subject1: "",
      time4subject2: "",
      time4subject3: "",
      time4subject4: "",
      time4subject5: "",
      time4subject6: "",
      time5subject1: "",
      time5subject2: "",
      time5subject3: "",
      time5subject4: "",
      time5subject5: "",
      time5subject6: "",
      time6subject1: "",
      time6subject2: "",
      time6subject3: "",
      time6subject4: "",
      time6subject5: "",
      time6subject6: "",
      time7subject1: "",
      time7subject2: "",
      time7subject3: "",
      time7subject4: "",
      time7subject5: "",
      time7subject6: "",
    };
    const [formData, setFormData] = useState(initialForm); // Form state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [courseListing, setCourseListing] = useState([]); // Course dropdown state
    const [semesterListing, setSemesterListing] = useState([]); // Semester dropdown state
    const [subjectListing, setSubjectListing] = useState([]);
    const [TimeSlotList, setTimeSlotList] = useState([]); // Time slots state
    const [error, setError] = useState({ field: "", msg: "" }); // Error state

    // Handle input field change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Error message handler for fields
    const errorMsg = (field, msg) => {
        setError((prev) => ({
            ...prev,
            field: field,
            msg: msg,
        }));
    };

    // Fetch course list for dropdown
    const courseListDropdown = async () => {
        try {
            const { data } = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
            if (data?.statusCode === 200 && data.data.length) {
                setCourseListing(data.data); // Set course listing
            } else {
                toast.error("Course not found.");
                setCourseListing([]);
            }
        } catch (error) {
            setCourseListing([]); // Clear list on error
        }
    };
    // Fetch semester list based on course ID
    const fetchSemesterBasedOnCourse = async (courseid) => {
        if (!courseid || !Number.isInteger(+courseid) || +courseid <= 0) {
            return toast.error("Invalid course ID.");
        }

        try {
            const { data, statusCode } = await dataFetchingPost(`${NODE_API_URL}/api/semester/fetch`, {
                courseid,
                column: "id, semtitle"
            });

            if (statusCode === 200 && data.length) {
                setSemesterListing(data); // Set semester listing
            } else {
                toast.error("Semester not found.");
                setSemesterListing([]);
            }
        } catch ({ response }) {
            setSemesterListing([]);
            const { statusCode, message } = response?.data || {};
            toast.error(statusCode === 400 || statusCode === 401 || statusCode === 500 ? message || "Server error." : "Connection error.");
        }
    };

    // Trigger semester list fetch when courseid changes
    useEffect(() => {
        if (formData.courseid) {
            fetchSemesterBasedOnCourse(formData.courseid);
        }
    }, [formData.courseid]);

    // Fetch subjects based on course and semester
    const fetchSubjectBasedOnCourseAndSemeter = async (courseid, semesterid) => {
        // Validate course ID
        if (!courseid || !Number.isInteger(+courseid) || +courseid <= 0) {
            return toast.error("Invalid course ID.");
        }

        try {
            // Fetch subjects from the API
            const { data, statusCode } = await dataFetchingPost(
                `${NODE_API_URL}/api/semester-subject/fetch`,
                { courseid, semesterid, column: "id, subject" }
            );

            // Check if response contains valid data
            if (statusCode === 200 && data.length) {
                setSubjectListing(data); // Set subject list
            } else {
                toast.error("Subjects not found."); // No subjects found
                setSubjectListing([]);
            }
        } catch (error) {
            setSubjectListing([]); // Clear subject list on error
            const statusCode = error.response?.data?.statusCode;
            // Display appropriate error message based on the status code
            toast.error(
                statusCode === 400 || statusCode === 401 || statusCode === 500
                    ? error.response.message || "A server error occurred."
                    : "An error occurred. Please check your connection or try again."
            );
        }
    };

    // Retrieve all time slots with a POST request
    const retriveAllTimeSlotList = async () => {
        try {
            const { data, statusCode } = await dataFetchingPost(`${NODE_API_URL}/api/time-table/fetch`, {
                column: "id, dtitle", status: 1
            });

            if (statusCode === 200 && data.length) {
                setTimeSlotList(data); // Set time slot list on success
            } else {
                toast.error("Time slot not found");
                setTimeSlotList([]); // Clear time slots
            }
        } catch ({ response }) {
            setTimeSlotList([]);
            const { statusCode, message } = response?.data || {};
            toast.error(statusCode === 400 || statusCode === 401 || statusCode === 500 ? message || "Server error." : "Connection error.");
        }
    };

    // Trigger course list fetch on component mount
    useEffect(() => {
        retriveAllTimeSlotList();
        courseListDropdown();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const requiredFields = ['courseid', 'semesterid', 'classroom'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${capitalizeFirstLetter(field.split('id')[0])} is required.`);
                errorMsg(field, `${capitalizeFirstLetter(field.split('id')[0])} is required.`);
                return;
            }
        }

        try {
            // Prepare form data
            formData.loguserid = secureLocalStorage.getItem('login_id');
            formData.login_type = secureLocalStorage.getItem('loginType');

            // Submit data to API
            const { data } = await axios.post(`${NODE_API_URL}/api/time-table/table-chart/register`, formData);
            // Handle success or failure
            if ([200, 201].includes(data?.statusCode)) {
                toast.success(data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            // Handle different error types
            const errorMessage = error?.response?.data?.message || "A server error occurred.";
            const errorField = error?.response?.data?.errorField;
            if (errorField) errorMsg(errorField, errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmit(false);
        }
    };

    const fetchTimeTableData = async (dbId) => {
        try {
            const { data } = await axios.post(`${NODE_API_URL}/api/time-table/table-chart/fetch`, {
                dbId
            });
            if (data.statusCode === 200 && data?.data.length > 0) {
                console.log(data.data[0]);
                
                setFormData((prev) => ({
                  ...prev,
                  dbId: data.data[0].id,
                  courseid: data.data[0].courseid,
                  semesterid: data.data[0].semesterid,
                  classroom: data.data[0].classroom,
                  saturdayValueAdded: data.data[0].saturdayValueAdded,
                  time1: data.data[0].time1,
                  time2: data.data[0].time2,
                  time3: data.data[0].time3,
                  time4: data.data[0].time4,
                  time5: data.data[0].time5,
                  time6: data.data[0].time6,
                  time7: data.data[0].time7,
                  timeBreak: data.data[0].timeBreak,
                  lunchBreak: data.data[0].lunchBreak,
                  time1subject1: data.data[0].time1subject1,
                  time1subject2: data.data[0].time1subject2,
                  time1subject3: data.data[0].time1subject3,
                  time1subject4: data.data[0].time1subject4,
                  time1subject5: data.data[0].time1subject5,
                  time1subject6: data.data[0].time1subject6,
                  time2subject1: data.data[0].time2subject1,
                  time2subject2: data.data[0].time2subject2,
                  time2subject3: data.data[0].time2subject3,
                  time2subject4: data.data[0].time2subject4,
                  time2subject5: data.data[0].time2subject5,
                  time2subject6: data.data[0].time2subject6,
                  time3subject1: data.data[0].time3subject1,
                  time3subject2: data.data[0].time3subject2,
                  time3subject3: data.data[0].time3subject3,
                  time3subject4: data.data[0].time3subject4,
                  time3subject5: data.data[0].time3subject5,
                  time3subject6: data.data[0].time3subject6,
                  time4subject1: data.data[0].time4subject1,
                  time4subject2: data.data[0].time4subject2,
                  time4subject3: data.data[0].time4subject3,
                  time4subject4: data.data[0].time4subject4,
                  time4subject5: data.data[0].time4subject5,
                  time4subject6: data.data[0].time4subject6,
                  time5subject1: data.data[0].time5subject1,
                  time5subject2: data.data[0].time5subject2,
                  time5subject3: data.data[0].time5subject3,
                  time5subject4: data.data[0].time5subject4,
                  time5subject5: data.data[0].time5subject5,
                  time5subject6: data.data[0].time5subject6,
                  time6subject1: data.data[0].time6subject1,
                  time6subject2: data.data[0].time6subject2,
                  time6subject3: data.data[0].time6subject3,
                  time6subject4: data.data[0].time6subject4,
                  time6subject5: data.data[0].time6subject5,
                  time6subject6: data.data[0].time6subject6,
                  time7subject1: data.data[0].time7subject1,
                  time7subject2: data.data[0].time7subject2,
                  time7subject3: data.data[0].time7subject3,
                  time7subject4: data.data[0].time7subject4,
                  time7subject5: data.data[0].time7subject5,
                  time7subject6: data.data[0].time7subject6,
                }));
                fetchSubjectBasedOnCourseAndSemeter(data.data[0].courseid, data.data[0].semesterid);
                fetchSemesterBasedOnCourse(data.data[0].courseid);
            } else {
                toast.error("Time table data is not available.");
            }
        } catch ({ response }) {
            const { statusCode, message } = response?.data || {};
            toast.error(statusCode === 400 || statusCode === 401 || statusCode === 500 ? message || "Server error." : "Connection error.");
        }
    }
    useEffect(() => {
        if (dbId) fetchTimeTableData(dbId);
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
                                    <span className="breadcrumb-item">Time Table Management</span>
                                    <span className="breadcrumb-item active">{dbId ? 'Update Time Table' : 'Add New Time Table'}</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    {dbId ? 'Update Time Table' : 'Add New Time Table'}
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 btn-light mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <a href="/admin/time-table-list">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            <i className="fas fa-list"></i> Time Table List
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mx-auto">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 col-12 form-group px-0">
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
                                                            fetchSemesterBasedOnCourse(
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

                                                <div className="col-md-6 col-12 form-group pr-0">
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
                                            </div>
                                            <div className="row mt-2">
                                                <FormField
                                                    borderError={error.field === "classroom"}
                                                    errorMessage={
                                                        error.field === "classroom" && error.msg
                                                    }
                                                    label="Classroom/Floor"
                                                    name="classroom"
                                                    id="classroom"
                                                    value={formData.classroom}
                                                    column="col px-0"
                                                    placeholder="CLASSROOM-2 (FIRST FLOOR)"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="row">
                                                <div className="col font-12 border p-2 fw-5">Time Slot</div>
                                                <div className="col font-12 border p-2 fw-5">Monday</div>
                                                <div className="col font-12 border p-2 fw-5">Tuesday</div>
                                                <div className="col font-12 border p-2 fw-5">Wednesday</div>
                                                <div className="col font-12 border p-2 fw-5">Thursday</div>
                                                <div className="col font-12 border p-2 fw-5">Friday</div>
                                                <div className="col font-12 border p-2 fw-5">Saturday</div>
                                            </div>

                                            {[...Array(7)].map((_, index) => (
                                                <div className="row mt-2" key={index}>
                                                    <div className="col-2 font-12 border px-0">
                                                        <Select
                                                            options={TimeSlotList.map((item) => ({
                                                                value: item.id,
                                                                label: capitalizeFirstLetter(item.dtitle),
                                                            }))}
                                                            onChange={(selectedOption) => {
                                                                setFormData({
                                                                    ...formData,
                                                                    [`time${index + 1}`]: selectedOption.value,
                                                                });
                                                            }}
                                                            value={
                                                                TimeSlotList.find((item) => item.id === formData[`time${index + 1}`])
                                                                    ? {
                                                                        value: formData[`time${index + 1}`],
                                                                        label: capitalizeFirstLetter(
                                                                            TimeSlotList.find((item) => item.id === formData[`time${index + 1}`]).dtitle
                                                                        ),
                                                                    }
                                                                    : { value: formData[`time${index + 1}`], label: 'Select' }
                                                            }
                                                        />
                                                    </div>
                                                    {[...Array(6)].map((_, subjectIndex) => (
                                                        <div
                                                            key={subjectIndex}
                                                            className="col font-12 border px-0"
                                                            style={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            <Select
                                                                options={subjectListing.map((item) => ({
                                                                    value: item.id,
                                                                    label: capitalizeFirstLetter(item.subject),
                                                                }))}
                                                                onChange={(selectedOption) => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        [`time${index + 1}subject${subjectIndex + 1}`]: selectedOption.value,
                                                                    });
                                                                }}
                                                                value={
                                                                    subjectListing.find(
                                                                        (item) => item.id === formData[`time${index + 1}subject${subjectIndex + 1}`]
                                                                    )
                                                                        ? {
                                                                            value: formData[`time${index + 1}subject${subjectIndex + 1}`],
                                                                            label: capitalizeFirstLetter(
                                                                                subjectListing.find(
                                                                                    (item) => item.id === formData[`time${index + 1}subject${subjectIndex + 1}`]
                                                                                ).subject
                                                                            ),
                                                                        }
                                                                        : { value: formData[`time${index + 1}subject${subjectIndex + 1}`], label: 'Select' }
                                                                }
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                            <div className="row mt-2">
                                                <div className="col-1 font-12 border fw-5">Saturday</div>
                                                <FormField
                                                    borderError={error.field === "saturdayValueAdded"}
                                                    errorMessage={
                                                        error.field === "saturdayValueAdded" && error.msg
                                                    }
                                                    name="saturdayValueAdded"
                                                    id="saturdayValueAdded"
                                                    value={formData.saturdayValueAdded || "VALUE-ADDED COURSES/EXTRA-CURRICULAR ACTIVITIES/CO-CURRICULAR ACTIVITIES ETC."}
                                                    column="col-11 px-0"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-2 font-12 border px-0">
                                                    <Select
                                                        options={TimeSlotList.map((item) => ({
                                                            value: item.id,
                                                            label: capitalizeFirstLetter(item.dtitle),
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({
                                                                ...formData,
                                                                timeBreak: selectedOption.value,
                                                            });
                                                        }}
                                                        value={
                                                            TimeSlotList.find((item) => item.id === formData.timeBreak)
                                                                ? {
                                                                    value: formData.timeBreak,
                                                                    label: capitalizeFirstLetter(
                                                                        TimeSlotList.find((item) => item.id === formData.timeBreak).dtitle
                                                                    ),
                                                                }
                                                                : { value: formData.timeBreak, label: 'Select' }
                                                        }
                                                    />
                                                </div>
                                                <div className="col-10 font-12 border fw-5 d-flex justify-content-center align-items-center">
                                                    Break
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-2 font-12 border px-0">
                                                    <Select
                                                        options={TimeSlotList.map((item) => ({
                                                            value: item.id,
                                                            label: capitalizeFirstLetter(item.dtitle),
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({
                                                                ...formData,
                                                                lunchBreak: selectedOption.value,
                                                            });
                                                        }}
                                                        value={
                                                            TimeSlotList.find((item) => item.id === formData.lunchBreak)
                                                                ? {
                                                                    value: formData.lunchBreak,
                                                                    label: capitalizeFirstLetter(
                                                                        TimeSlotList.find((item) => item.id === formData.lunchBreak).dtitle
                                                                    ),
                                                                }
                                                                : { value: formData.lunchBreak, label: 'Select' }
                                                        }
                                                    />
                                                </div>
                                                <div className="col-10 font-12 border fw-5 d-flex justify-content-center align-items-center">
                                                    Lunch Break
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 col-lg-12 col-12 px-0">
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
export default AddNew;