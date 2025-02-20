import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dataFetchingPost, goBack } from '../../../site-components/Helper/HelperFunction';
import { FormField } from '../../../site-components/admin/assets/FormField';
import { CKEDITOR_URL, NODE_API_URL } from '../../../site-components/Helper/Constant';
import validator from 'validator';
import { toast } from 'react-toastify';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import { TagsInput } from "react-tag-input-component";
import JoditEditor from "jodit-react"; // Import Jodit editor
function AddNewRoom() {
    const { dbId } = useParams();
    const initialData = {
        dbId: '',
        block: '',
        roomNo: '',
        roomType: '',
        floor: '',
        capacity: '',
        occupied_beds: '',
        amenities: [],
        description: '',
    };
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [amenities, setAmenities] = useState([]);
    const addNewAmenity = (data) => {
        setAmenities(data);
        setFormData((prev) => ({
            ...prev,
            amenities: data.join(","),
        }));
    };
    // Jodit editor configuration
    const config = {
        readonly: false,
        placeholder: 'Enter your description here...',
        spellcheck: true,
        language: 'pt_br',
        defaultMode: '1',
        minHeight: 400,
        maxHeight: -1,
        defaultActionOnPaste: 'insert_as_html',
        defaultActionOnPasteFromWord: 'insert_as_html',
        askBeforePasteFromWord: false,
        askBeforePasteHTML: false,
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const errorMsg = (field, msg) => {
        setError((prev) => ({
            ...prev,
            field: field,
            msg: msg,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        if (!formData.block) {
            toast.error("Block is required.")
            errorMsg("block", "Block is required.");
            return setIsSubmit(false);
        }
        if (!formData.roomNo) {
            toast.error("Room No is required.")
            errorMsg("roomNo", "Room No is required.");
            return setIsSubmit(false);
        }
        if (formData.floor === "" || formData.floor === null || formData.floor < 0) {
            toast.error("Floor is required and should be 0 or greater.");
            errorMsg("floor", "Floor is required and should be 0 or greater.");
            return setIsSubmit(false);
        }

        if (!validator.isNumeric(String(formData.capacity)) || formData.capacity < 0) {
            toast.error("Capacity is required and should be 0 or greater.");
            errorMsg("capacity", "Capacity is required and should be 0 or greater.");
            return setIsSubmit(false);
        }

        if (!validator.isNumeric(String(formData.occupied_beds)) || formData.occupied_beds < 0) {
            toast.error("No Of Beds is required and should be 0 or greater.");
            errorMsg("occupied_beds", "No Of Beds is required and should be 0 or greater.");
            return setIsSubmit(false);
        }

        if (!formData.roomType) {
            toast.error("Room Type is required.")
            errorMsg("roomType", "Room Type is required.");
            return setIsSubmit(false);
        }
        if (!formData.amenities) {
            toast.error("Amenities is required.")
            errorMsg("amenities", "Amenities is required.");
            return setIsSubmit(false);
        }

        try {
            formData.loguserid = secureLocalStorage.getItem('login_id');
            formData.login_type = secureLocalStorage.getItem('loginType');
            // submit to the API here
            const response = await axios.post(
                `${NODE_API_URL}/api/hostel-management/room/add-update`,
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
                `${NODE_API_URL}/api/hostel-management/room/fetch`,
                { dbId }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                const data = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    dbId: data.id,
                    block: data.block,
                    roomNo: data.roomNo,
                    roomType: data.roomType,
                    floor: data.floor,
                    capacity: data.capacity,
                    occupied_beds: data.occupied_beds,
                    amenities: data.amenities,
                    description: data.description ? validator.unescape(data.description) : ""
                }));
                setAmenities(data.amenities.split(","))
                return response;
            } else {
                toast.error("Data not found.");
                return null;
            }
        } catch (error) {
            return null;
        }
    }
    useEffect(() => {
        if (dbId) fetchDataForupdateBasedOnId(dbId);
    }, [dbId]);
    const handleEditorChange = (newContent) => {
        setFormData((prev) => ({
            ...prev,
            description: newContent,
        }));
    }
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
                                        {dbId ? "Update Room" : "Add Room"}
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    {dbId ? "Update Room" : "Add Room"}
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 goBack mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <Link to="/admin/hostel-room-list">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            Room List <i className="fas fa-list"></i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className='row'>
                                        {/* Block Name */}
                                        <FormField
                                            borderError={error.field === "block"}
                                            errorMessage={error.field === "block" && error.msg}
                                            label="Block Name"
                                            name="block"
                                            id="block"
                                            placeholder='Enter Block Name'
                                            value={formData.block}
                                            onChange={handleChange}
                                            column="col-md-4"
                                            required
                                        />
                                        {/* Room No */}
                                        <FormField
                                            borderError={error.field === "roomNo"}
                                            errorMessage={error.field === "roomNo" && error.msg}
                                            label="Room No"
                                            name="roomNo"
                                            id="roomNo"
                                            placeholder='01'
                                            value={formData.roomNo}
                                            onChange={handleChange}
                                            column="col-md-4"
                                            required
                                        />
                                        {/* Floor */}
                                        <FormField
                                            borderError={error.field === "floor"}
                                            errorMessage={error.field === "floor" && error.msg}
                                            label="Floor"
                                            name="floor"
                                            id="floor"
                                            placeholder='1st'
                                            value={formData.floor}
                                            onChange={handleChange}
                                            column="col-md-4"
                                            required
                                        />
                                        {/* Capacity */}
                                        <FormField
                                            borderError={error.field === "capacity"}
                                            errorMessage={error.field === "capacity" && error.msg}
                                            label="Capacity"
                                            name="capacity"
                                            id="capacity"
                                            placeholder='10'
                                            value={formData.capacity}
                                            onChange={handleChange}
                                            column="col-md-4"
                                            required
                                        />
                                        {/* No Of Beds */}
                                        <FormField
                                            borderError={error.field === "occupied_beds"}
                                            errorMessage={error.field === "occupied_beds" && error.msg}
                                            label="No Of Beds"
                                            name="occupied_beds"
                                            id="occupied_beds"
                                            placeholder='10'
                                            value={formData.occupied_beds}
                                            onChange={handleChange}
                                            column="col-md-4"
                                            required
                                        />
                                        <div className='col-md-4'>
                                            <label className='font-weight-semibold'>Type <span className='text-danger'>*</span></label>
                                            <select className="form-control" id="roomType" value={formData.roomType} name="roomType" onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="Single">Single Room</option>
                                                <option value="Double">Double Room</option>
                                                <option value="Triple">Triple Room</option>
                                                <option value="Quad">Quad Room</option>
                                                <option value="Quint">Five-Bed Room</option>
                                                <option value="Sext">Six-Bed Room</option>
                                            </select>
                                            {error.field === "roomType" && (
                                                <span className="text-danger">{error.msg}</span>
                                            )}
                                        </div>
                                        {/* Amenities */}
                                        <div className="form-group col-md-12">
                                            <label>
                                                Amenities <span className="text-danger">*</span>
                                            </label>
                                            <TagsInput
                                                value={amenities}
                                                onChange={addNewAmenity}
                                                placeHolder='Enter Amenities'
                                                name=""
                                                className="form-control"
                                            />

                                        </div>

                                    </div>
                                    <div className='col-md-12 px-0'>
                                        <label className='font-weight-semibold'>Description</label>
                                        <JoditEditor
                                            value={formData?.description ? validator.unescape(formData.description) : ""}
                                            config={config}
                                            onBlur={handleEditorChange}
                                        />
                                    </div>
                                    <div className="col-md-12 col-lg-12 col-12 px-0">
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
                                </form>
                            </div>
                        </div>
                        <div className='card'>
                            <div className='card-header'>
                                <h6 className='card-title h6_new'>Sample Data</h6>
                            </div>
                            <div className='card-body'>
                            <div className="overflow-x-auto">
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>room_id</th>
                                            <th>room_number</th>
                                            <th>block</th>
                                            <th>floor</th>
                                            <th>capacity</th>
                                            <th>occupied_beds</th>
                                            <th>type</th>
                                            <th>Amenities</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>A101</td>
                                            <td>Block A</td>
                                            <td>1</td>
                                            <td>2</td>
                                            <td>1</td>
                                            <td>double</td>
                                            <td>Wi-Fi, AC, Study Table</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>A102</td>
                                            <td>Block A</td>
                                            <td>1</td>
                                            <td>3</td>
                                            <td>2</td>
                                            <td>triple</td>
                                            <td>Wi-Fi, Fan, Wardrobe</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>B201</td>
                                            <td>Block B</td>
                                            <td>2</td>
                                            <td>1</td>
                                            <td>0</td>
                                            <td>single</td>
                                            <td>Wi-Fi, AC, Private Bathroom</td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{


`
@media screen and (max-width:768px) {
input#block {
    font-size: 14px;
}
    select#roomType {
    font-size: 14px;
}
    input.rti--input {
    font-size: 14px;
}
    element.style {
    font-size: 13px !important;
}
.font-weight-semibold{
font-size:14px;
}
nav.breadcrumb.breadcrumb-dash {
font-size:13px;
}
h5.card-title.h6_new {
    font-size: 14px !important;
}
    button.ml-auto.btn-md.btn.border-0.btn-light.mr-2 {
    font-size: 14px !important;
}
    button.ml-2.btn-md.btn.border-0.btn-secondary {
    font-size: 12px !important;
}
        }

`
        }
        </style>
            </div>
        </>
    )
}

export default AddNewRoom