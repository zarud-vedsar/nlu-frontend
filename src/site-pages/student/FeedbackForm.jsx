import React, { useState, useEffect } from "react";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { FormField, TextareaField } from "../../site-components/admin/assets/FormField";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const FeedbackForm = () => {
    const initialData = {
        subject: '',
        message: ''
    };
    const sid = secureLocalStorage.getItem('studentId'); // Retrieving student ID from secure local storage.
    const [formData, setFormData] = useState(initialData);
    const [isSubmit, setIsSubmit] = useState(false);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        errorMsg("", "");
        if (!formData.subject) {
            errorMsg("subject", "Subject is required.");
            toast.error("subject", "Subject is required.");
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
            const response = await axios.post(`${NODE_API_URL}/api/student/feedback/submit`, formData);
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
                                    <span className="breadcrumb-item">Feedback</span>
                                    <span className="breadcrumb-item">Give Feedback</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card border-0 bg-transparent mb-2">
                            <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">Give Feedback</h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn btn-light"
                                        onClick={() => window.history.back()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <Link to='/student/feedback-list' className="btn btn-info ml-2">My Feedback <i className="fas fa-list"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <FormField
                                                    bottom={true}
                                                    borderError={errors.field === 'subject'} // Highlight border if there's an error.
                                                    errorMessage={errors.field === 'subject' && errors.msg} // Display error message if applicable.
                                                    label="Subject"
                                                    type="text"
                                                    name="subject"
                                                    id="subject"
                                                    value={formData.subject}
                                                    column='col-md-12 form-group mb-3'
                                                    onChange={handleChange} // Handle input change.
                                                />
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
