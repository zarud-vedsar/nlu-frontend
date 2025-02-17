import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dataFetchingGet, dataFetchingPost, goBack } from '../../../site-components/Helper/HelperFunction';
import { FormField, TextareaField } from '../../../site-components/admin/assets/FormField';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import validator from 'validator';
import { toast } from 'react-toastify';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import Select from "react-select";
function AddNewRoom() {
    const { dbId } = useParams();
    const initialData = {
        dbId: '',
        blockId: '',
        roomNo: '',
        visitorType: '',
        name: '',
        contact_number: '',
        purpose: '',
        visit_in_date: '',
        visit_out_date: '',
        time_in: '',
        time_out: '',
        vehicle_no: '',
        StudentId: '',
    };
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [block, setBlock] = useState([]);
    const [blockRoomNo, setBlockRoomNo] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const errorMsg = (field, msg) => {
        setError((prev) => ({
            ...prev,
            field: field,
            msg: msg,
        }));
    };
    const fetchStudent = async (block, roomNo) => {
        try {
            const response = await dataFetchingGet(`${NODE_API_URL}/api/hostel-management/student-list/${block}/${roomNo}`);
            if (response?.statusCode === 200 && response.data.length > 0) {
                setStudentList(response.data);
                return null;
            } else {
                toast.error("Data not found.");
                return [];
            }
        } catch (error) {
            return [];
        }
    }
    useEffect(() => {
        if (formData.blockId && formData.roomNo) {
            fetchStudent(formData.blockId, formData.roomNo);
        }
    }, [formData.blockId, formData.roomNo]);
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'vehicle_no' && value != '') {
            value = value.toUpperCase();
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        if (!formData.visitorType) {
            errorMsg("visitorType", "Visitor Type is required.");
            toast.error("Visitor Type is required.");
            return setIsSubmit(false);
        }
        if (!formData.name) {
            errorMsg("name", "Name is required.");
            toast.error("Name is required.");
            return setIsSubmit(false);
        }
        if (!formData.contact_number) {
            errorMsg("contact_number", "Contact Number is required.");
            toast.error("Contact Number is required.");
            return setIsSubmit(false);
        }
        if (!formData.purpose) {
            errorMsg("purpose", "Purpose is required.");
            toast.error("Purpose is required.");
            return setIsSubmit(false);
        }
        if (!formData.visit_in_date) {
            errorMsg("visit_in_date", "Visit In Date is required.");
            toast.error("Visit In Date is required.");
            return setIsSubmit(false);
        }
        if (!formData.time_in) {
            errorMsg("time_in", "Time In is required.");
            toast.error("Time In is required.");
            return setIsSubmit(false);
        }
        try {
            formData.loguserid = secureLocalStorage.getItem('login_id');
            formData.login_type = secureLocalStorage.getItem('loginType');
            // submit to the API here
            const response = await axios.post(
                `${NODE_API_URL}/api/hostel-management/visitor/entry`,
                formData
            );
            if (
                response.data?.statusCode === 200 ||
                response.data?.statusCode === 201
            ) {
                errorMsg("", "");
                toast.success(response.data.message);
                if (response.data?.statusCode === 201) {
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
    }
    const fetchDataForupdateBasedOnId = async (dbId) => {
        if (!dbId || parseInt(dbId, 10) <= 0) {
            toast.error("Invalid ID.");
            return;
        }
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/hostel-management/visitor/fetch`,
                { dbId }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                const data = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    dbId: data.id,
                    blockId: data.blockId,
                    roomNo: data.roomNo,
                    visitorType: data.visitorType ? validator.unescape(data.visitorType) : data.visitorType,
                    name: data.name,
                    contact_number: data.contact_number,
                    purpose: data.purpose ? validator.unescape(data.purpose) : data.purpose,
                    visit_in_date: data.visit_in_date.split('T')[0],
                    visit_out_date: data.visit_out_date ? data.visit_out_date.split('T')[0] : data.visit_out_date,
                    time_in: data.time_in,
                    time_out: data.time_out,
                    vehicle_no: data.vehicle_no,
                    StudentId: data.StudentId,
                }));
                if (data.blockId) {
                    fetchRoomNoBasedOnBlock(data.blockId);
                }
                return response;
            } else {
                toast.error("Data not found.");
                return null;
            }
        } catch (error) {
            return null;
        }
    }
    const fetchRoomNoBasedOnBlock = async (block) => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/hostel-management/room/room-no-based-on-block/${block}`);
            if (response?.statusCode === 200 && response.data.length > 0) {
                setBlockRoomNo(response.data);
                return null;
            } else {
                toast.error("Data not found.");
                return [];
            }
        } catch (error) {
            return [];
        }
    }
    const fetchDistinctBlock = async () => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/hostel-management/room/distinct-blocks`);
            if (response?.statusCode === 200 && response.data.length > 0) {
                setBlock(response.data);
                console.log(response.data, "MAD");

                return null;
            } else {
                toast.error("Data not found.");
                return [];
            }
        } catch (error) {
            return [];
        }
    }
    useEffect(() => {
        fetchDistinctBlock();
        if (dbId) fetchDataForupdateBasedOnId(dbId);
    }, [dbId]);
    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                    <a href="./" className="breadcrumb-item">
                                        <i className="fas fa-home m-r-5" /> Dashboard
                                    </a>
                                    <span className="breadcrumb-item">Hostel Management</span>
                                    <span className="breadcrumb-item active">
                                        {dbId ? "Update Visitor Entry" : "Add New Visitor Entry"}
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    {dbId ? "Update Visitor Entry" : "Add New Visitor Entry"}
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 goBack mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <Link to="/admin/hostel-visitor-history">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            Visitor History  <i className="fas fa-list"></i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className='row'>
                                        <div className='col-md-3 col-lg-3'>
                                            <label className='font-weight-semibold'>Visitor Type <span className='text-danger'>*</span></label>
                                            <select name="visitorType" id="visitorType" value={formData.visitorType} onChange={handleChange} className='form-control'>
                                                <option value="">Select</option>
                                                <option value="Student's Relative">Student's Relative</option>
                                                <option value="Student's Friend">Student's Friend</option>
                                                <option value="Workmen">Workmen</option>
                                                <option value="Official">Official</option>
                                                <option value="Delivery">Delivery</option>
                                                <option value="Guest">Guest</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Other">Other</option>
                                                <option value="Tourist">Tourist</option>
                                                <option value="Event Attendee">Event Attendee</option>
                                                <option value="Student">Student</option>
                                                <option value="Volunteer">Volunteer</option>
                                                <option value="Vendor">Vendor</option>
                                                <option value="Health/Safety Inspector">Health/Safety Inspector</option>
                                                <option value="Contractor">Contractor</option>
                                                <option value="Tour Guide">Tour Guide</option>
                                                <option value="Transport Service">Transport Service</option>
                                                <option value="Sponsor">Sponsor</option>
                                                <option value="Supplier">Supplier</option>
                                                <option value="Maintenance Staff (Internal)">Maintenance Staff (Internal)</option>
                                                <option value="Resident Guest">Resident Guest</option>
                                                <option value="Media/Press">Media/Press</option>
                                                <option value="Local Neighbor">Local Neighbor</option>
                                                <option value="Public Authority">Public Authority</option>
                                                <option value="Researcher">Researcher</option>
                                            </select>
                                            {error.field === "visitorType" && (
                                                <div className="text-danger">{error.msg}</div>
                                            )}
                                        </div>
                                        {/* Visitor Name */}
                                        <FormField
                                            borderError={error.field === "name"}
                                            errorMessage={error.field === "name" && error.msg}
                                            label="Visitor Name"
                                            name="name"
                                            id="name"
                                            placeholder='Enter Visitor Name'
                                            value={formData.name}
                                            onChange={handleChange}
                                            column="col-md-6 col-lg-6"
                                            required
                                        />
                                        {/* Contact No */}
                                        <FormField
                                            borderError={error.field === "contact_number"}
                                            errorMessage={error.field === "contact_number" && error.msg}
                                            label="Contact No"
                                            name="contact_number"
                                            id="contact_number"
                                            placeholder='0123456789'
                                            value={formData.contact_number}
                                            onChange={handleChange}
                                            column="col-md-3 col-lg-3"
                                            required
                                        />
                                        {/* Purpose Of Visit */}
                                        <TextareaField
                                            borderError={error.field === "purpose"}
                                            errorMessage={error.field === "purpose" && error.msg}
                                            label="Purpose Of Visit"
                                            name="purpose"
                                            id="purpose"
                                            placeholder='Enter Your Visit Purpose'
                                            value={formData.purpose}
                                            onChange={handleChange}
                                            column="col-md-12"
                                            required
                                        />
                                        {/* Visit Date */}
                                        <FormField
                                            borderError={error.field === "visit_in_date"}
                                            errorMessage={error.field === "visit_in_date" && error.msg}
                                            label="Visit Date"
                                            name="visit_in_date"
                                            id="visit_in_date"
                                            type='date'
                                            value={formData.visit_in_date}
                                            onChange={handleChange}
                                            column="col-md-3 col-lg-3"
                                            required
                                        />
                                        {/* Visit In Time */}
                                        <FormField
                                            borderError={error.field === "time_in"}
                                            errorMessage={error.field === "time_in" && error.msg}
                                            label="Visit In Time"
                                            name="time_in"
                                            id="time_in"
                                            type='time'
                                            value={formData.time_in}
                                            onChange={handleChange}
                                            column="col-md-3 col-lg-3"
                                            required
                                        />
                                        {/* Visit Out Time */}
                                        <FormField
                                            borderError={error.field === "time_out"}
                                            errorMessage={error.field === "time_out" && error.msg}
                                            label="Visit Out Time"
                                            name="time_out"
                                            id="time_out"
                                            type='time'
                                            value={formData.time_out}
                                            onChange={handleChange}
                                            column="col-md-3 col-lg-3"
                                            
                                        />
                                        {/* Visit Out Date */}
                                        <FormField
                                            borderError={error.field === "visit_out_date"}
                                            errorMessage={error.field === "visit_out_date" && error.msg}
                                            label="Visit Out Date"
                                            name="visit_out_date"
                                            id="visit_out_date"
                                            type='date'
                                            value={formData.visit_out_date}
                                            onChange={handleChange}
                                            column="col-md-3 col-lg-3"
                                            
                                        />
                                        {/* Vehicle No */}
                                        <FormField
                                            borderError={error.field === "vehicle_no"}
                                            errorMessage={error.field === "vehicle_no" && error.msg}
                                            label="Vehicle No (if Any)"
                                            name="vehicle_no"
                                            placeholder='UP70CV0000'
                                            id="vehicle_no"
                                            value={formData.vehicle_no}
                                            onChange={handleChange}
                                            column="col-md-4 col-lg-4"
                                        />
                                        <div className="col-md-4 col-lg-4 form-group">
                                            <label className="font-weight-semibold">
                                                Block
                                            </label>
                                            <Select
                                                options={block.map((item) => ({
                                                    value: item.block,
                                                    label: item.block,
                                                }))}
                                                onChange={(selectedOption) => {
                                                    setFormData({
                                                        ...formData,
                                                        blockId: selectedOption.value,
                                                    });
                                                    fetchRoomNoBasedOnBlock(
                                                        selectedOption.value
                                                    );
                                                }}
                                                value={
                                                    block.find(
                                                        (item) =>
                                                            item.block === formData.blockId
                                                    )
                                                        ? {
                                                            value: formData.blockId,
                                                            label: block.find(
                                                                (item) =>
                                                                    item.block === formData.blockId
                                                            ).block,
                                                        }
                                                        : { value: formData.blockId, label: "Select" }
                                                }
                                            />

                                            {error.field === "blockId" && (
                                                <span className="text-danger">{error.msg}</span>
                                            )}
                                        </div>
                                        <div className="col-md-4 col-lg-4 form-group">
                                            <label className="font-weight-semibold">
                                                Room No
                                            </label>
                                            <Select
                                                options={blockRoomNo.map((item) => ({
                                                    value: item.roomNo,
                                                    label: item.roomNo,
                                                }))}
                                                onChange={(selectedOption) => {
                                                    setFormData({
                                                        ...formData,
                                                        roomNo: selectedOption.value,
                                                    });
                                                }}
                                                value={
                                                    blockRoomNo.find(
                                                        (item) =>
                                                            item.roomNo === formData.roomNo
                                                    )
                                                        ? {
                                                            value: formData.roomNo,
                                                            label: blockRoomNo.find(
                                                                (item) =>
                                                                    item.roomNo === formData.roomNo
                                                            ).roomNo,
                                                        }
                                                        : { value: formData.roomNo, label: "Select" }
                                                }
                                            />
                                            {error.field === "roomNo" && (
                                                <span className="text-danger">{error.msg}</span>
                                            )}
                                        </div>
                                        <div className="col-md-4 col-lg-4 form-group">
                                            <label className="font-weight-semibold">
                                                Student <span className="text-danger">(if visitor meetup with student)</span>
                                            </label>
                                            <Select
                                                options={[
                                                    { value: "", label: "Select" }, // Default reset option
                                                    ...studentList.map((item) => ({
                                                        value: item.id,
                                                        label: `${item.sname} (${item.sphone})`,
                                                    })),
                                                ]}
                                                onChange={(selectedOption) => {
                                                    setFormData({
                                                        ...formData,
                                                        StudentId: selectedOption.value,
                                                    });
                                                }}
                                                value={
                                                    studentList.find((item) => item.id === formData.StudentId)
                                                        ? {
                                                            value: formData.StudentId,
                                                            label: studentList.find(
                                                                (item) => item.id === formData.StudentId
                                                            ).sname,
                                                        }
                                                        : { value: "", label: "Select" }
                                                }
                                            />
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-12">
                                            <button
                                                disabled={isSubmit}
                                                className="btn btn-dark mt-3 d-flex justify-content-center align-items-center"
                                                type="submit"
                                            >
                                                Submit{" "}
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
        </>
    )
}

export default AddNewRoom