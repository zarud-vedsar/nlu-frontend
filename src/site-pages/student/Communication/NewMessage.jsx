import React, { useState, useEffect } from "react";
import axios from "axios";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { FormField, TextareaField } from "../../../site-components/admin/assets/FormField";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Select from "react-select";
const FeedbackForm = () => {
    const initialData = {
        facultyId: '',
        studentId: '',
        message: ''
    };
    const sid = secureLocalStorage.getItem('studentId'); // Retrieving student ID from secure local storage.
    const [formData, setFormData] = useState(initialData);
    const [isSubmit, setIsSubmit] = useState(false);
    const [CurrentCourse, setCurrentCourse] = useState([{
        course: [],
        faculty: [],
    }]);
    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value, // Updating formData state dynamically based on input name.
        });
    };
    const [errors, setErrors] = useState({ field: '', msg: '' }); // For handling and displaying field errors.
    const errorMsg = (field, value) => {
        setErrors((prev) => ({ ...prev, field: field, msg: value }));
    };

    const courseListDropdown = async () => {
        try {
            const response = await axios.post(`${NODE_API_URL}/api/course-selection/fetchCurrentCourseActive`, {
                sid
            });
            if (response.data?.statusCode === 200 && response.data.data.length > 0) {
                setCurrentCourse(response.data.data[0]);
            } else {
                setCurrentCourse([]);
            }
        } catch (error) {
            setCurrentCourse([]);
        }
    };
    useEffect(() => {
        courseListDropdown();
    }, [sid]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        errorMsg("", "");
        if (!formData.facultyId) {
            errorMsg("facultyId", "Please select faculty.");
            toast.error("Please select faculty.");
            return setIsSubmit(false);
        }
        if (!formData.message) {
            errorMsg("message", "Message is required.");
            toast.error("Message is required.");
            return setIsSubmit(false);
        }
        try {
            formData.studentId = sid;
            formData.courseid = 1; // courseid is required
            const response = await axios.post(`${NODE_API_URL}/api/communication/send-message-by-student`, formData);
            if (
                response.data?.statusCode === 200 ||
                response.data?.statusCode === 201
            ) {
                if (response.data?.statusCode === 201) {
                    setFormData(initialData);
                }
                toast.success(response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
            errorMsg("", "");
        } catch (error) {
            errorMsg("", "");
            const statusCode = error.response?.data?.statusCode;
            if ([400, 401, 404, 500].includes(statusCode)) {
                toast.error(error.response.data.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        } finally {
            errorMsg("", "");
            setIsSubmit(false);
        }
    }
    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container-fluid">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                    <a href="/student" className="breadcrumb-item">
                                        Home
                                    </a>
                                    <span className="breadcrumb-item">Communication Management</span>
                                    <span className="breadcrumb-item">New Message</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card border-0 bg-transparent mb-2">
                            <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">New Message</h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn btn-light"
                                        onClick={() => window.history.back()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <Link to='/student/message-list' className="btn btn-info ml-2"><i className="fas fa-list"></i> Message History</Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-12 col-12 form-group">
                                                    <label className="font-weight-semibold">
                                                        Select Faculty<span className="text-danger">*</span>
                                                    </label>

                                                    <Select
                                                        options={CurrentCourse?.faculty?.map((item) => ({
                                                            value: item.id,
                                                            label: item.name,
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({
                                                                ...formData,
                                                                facultyId: selectedOption.value,
                                                            });
                                                        }}
                                                        value={
                                                            CurrentCourse?.faculty?.find(
                                                                (item) =>
                                                                    item.id === parseInt(formData.facultyId)
                                                            )
                                                                ? {
                                                                    value: parseInt(formData.facultyId),
                                                                    label: CurrentCourse?.faculty?.find(
                                                                        (item) =>
                                                                            item.id === parseInt(formData.facultyId)
                                                                    ).name,
                                                                }
                                                                : { value: formData.facultyId, label: "Select" }
                                                        }
                                                    />
                                                </div>
                                                <TextareaField
                                                    bottom={true}
                                                    borderError={errors.field === 'message'} // Highlight border if there's an error.
                                                    errorMessage={errors.field === 'message' && errors.msg} // Display error message if applicable.
                                                    label="Message"
                                                    type="text"
                                                    name="message"
                                                    id="message"
                                                    value={formData.message}
                                                    column='col-md-12 form-group mb-3'
                                                    onChange={handleChange} // Handle input change.
                                                />
                                                <div className="col-md-12 col-lg-12 col-12 d-flex">
                                                    <button
                                                        disabled={isSubmit}
                                                        className='btn btn-dark d-flex justify-content-center align-items-center'
                                                        type='submit'>
                                                        Submit{" "} {isSubmit && (<>&nbsp; <div className="loader-circle"></div></>)}
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
};

export default FeedbackForm;
