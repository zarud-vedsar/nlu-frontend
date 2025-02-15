import React, { useState } from 'react'
import { PHP_API_URL } from '../../site-components/Helper/Constant';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaRegMessage, FaRegUser } from 'react-icons/fa6';
import { GiCalendarHalfYear } from 'react-icons/gi';
import { MdOutlineMailOutline, MdOutlinePhone } from 'react-icons/md';
function CellForm({ type }) {
    const initialData = {
        cell: type,
        fname: '',
        lname: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        batch: '',
        semester: '',
    };
    const [formData, setFormData] = useState(initialData);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // To store specific field errors

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Clear previous errors
        setErrors({});

        // Simple client-side validation
        const validationErrors = {};
        if (!formData.cell) validationErrors.cell = "Cell is missing. Contact to administration.";
        if (!formData.fname) validationErrors.fname = "First name is required.";
        if (!formData.email) validationErrors.email = "Email is required.";
        if (!formData.phone) {
            validationErrors.phone = "Phone number is required.";
        } else if (!/^[6789]\d{9}$/.test(formData.phone)) {
            validationErrors.phone = "Phone number must be 10 digits and start with 6, 7, 8, or 9.";
        }

        if (!formData.batch) validationErrors.batch = "Batch is required.";
        if (!formData.semester) validationErrors.semester = "Semester is required.";
        if (!formData.subject) validationErrors.subject = "Subject is required.";
        if (!formData.message) validationErrors.message = "Complaint is required.";

        // Check if the message is more than 150 words
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const bformData = new FormData();
            bformData.append("data", "cell_complain_form");
            bformData.append("cell", formData.cell);
            bformData.append("fname", formData.fname);
            bformData.append("lname", formData.lname);
            bformData.append("email", formData.email);
            bformData.append("phone", formData.phone);
            bformData.append("batch", formData.batch);
            bformData.append("semester", formData.semester);
            bformData.append("subject", formData.subject);
            bformData.append("message", formData.message);
            const response = await axios.post(
                `${PHP_API_URL}/cell_messages.php`,
                bformData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (response?.data?.status === 201) {
                toast.success(response.data?.msg);
                setFormData(initialData);
            }
        } catch (error) {
            const status = error.response?.data?.statusCode;
            if ([400, 401, 500].includes(status)) {
                toast.error(error.response.data?.msg || 'A server error occurred.');
            } else {
                toast.error('An error occurred. Please check your connection or try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    // Handle form field changes
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'phone') {
            value = value.slice(0, 10)
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    return (
        <div className="card border-0">
            <div className='card-body'>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className="col-md-6 mb-18">
                            <label className="heading-para mb-1">First Name</label>
                            <div className="form-group-custom">
                                <span className="form-custom-icon">
                                    <FaRegUser />
                                </span>
                                <input
                                    name="fname"
                                    type="text"
                                    className="form-custom-input"
                                    placeholder="First Name"
                                    value={formData.fname}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.fname && <span className="text-danger">{errors.fname}</span>}
                        </div>
                        <div className="col-md-6 mb-18">
                            <label className="heading-para mb-1">Last Name</label>
                            <div className="form-group-custom">
                                <span className="form-custom-icon">
                                    <FaRegUser />
                                </span>
                                <input
                                    name="lname"
                                    type="text"
                                    className="form-custom-input"
                                    placeholder="Last Name"
                                    value={formData.lname}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.name && <span className="text-danger">{errors.name}</span>}
                        </div>
                        <div className="col-md-12 mb-18">
                            <label className="heading-para mb-1">Email</label>
                            <div className="form-group-custom">
                                <span className="form-custom-icon">
                                    <MdOutlineMailOutline />
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    className="form-custom-input"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.email && <span className="text-danger">{errors.email}</span>}
                        </div>
                        <div className="col-md-12 mb-18">
                            <label className="heading-para mb-1">Phone No.</label>
                            <div className="form-group-custom">
                                <span className="form-custom-icon">
                                    <MdOutlinePhone />
                                </span>
                                <input
                                    name="phone"
                                    type="number"
                                    className="form-custom-input"
                                    placeholder="Phone No."
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.phone && <span className="text-danger">{errors.phone}</span>}
                        </div>
                        <div className="col-md-12 mb-18">
                            <label className="heading-para mb-1">Batch</label>
                            <div className="form-group-custom">
                                <span className="form-custom-icon">
                                    <GiCalendarHalfYear />
                                </span>
                                <input
                                    name="batch"
                                    type="text"
                                    className="form-custom-input"
                                    placeholder="Batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.batch && <span className="text-danger">{errors.batch}</span>}
                        </div>
                        <div className="col-md-12 mb-18">
                            <label className="heading-para mb-1">Semester</label>
                            <div className="form-group-custom">
                                <span className="form-custom-icon">
                                    <GiCalendarHalfYear />
                                </span>
                                <input
                                    name="semester"
                                    type="text"
                                    className="form-custom-input"
                                    placeholder="Semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.semester && <span className="text-danger">{errors.semester}</span>}
                        </div>
                        <div className="col-md-12 mb-18">
                            <label className="heading-para mb-1">Subject</label>
                            <div className="form-group-custom">
                                <span className="form-custom-icon">
                                    <GiCalendarHalfYear />
                                </span>
                                <input
                                    name="subject"
                                    type="text"
                                    className="form-custom-input"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.subject && <span className="text-danger">{errors.subject}</span>}
                        </div>
                        <div className="col-md-12 mb-18">
                            <label className="heading-para mb-1">Complaint</label>
                            <div className="form-group-custom align-items-start">
                                <span className="form-custom-icon pt-3">
                                    <FaRegMessage />
                                </span>
                                <textarea
                                    name="message"
                                    className="form-custom-input pt-2"
                                    placeholder="Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    style={{ minHeight: '100px' }}
                                />
                            </div>
                            {errors.message && <span className="text-danger">{errors.message}</span>}
                        </div>
                        <div className="col-md-12">
                            <button type="submit"
                                style={{ minHeight: '48px' }}
                                className="btn btn-primary py-2 border-primary w-100"
                                disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Now'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default CellForm;