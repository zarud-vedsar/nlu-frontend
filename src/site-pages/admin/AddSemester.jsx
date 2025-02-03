
import React, { useEffect, useState } from 'react';
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { capitalizeFirstLetter, dataFetchingGet, dataFetchingPost, goBack } from '../../site-components/Helper/HelperFunction';
import Select from 'react-select';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';

function SemesterAdd() {
    // Initial form state
    const initialForm = {
        dbId: "",
        courseid: '',
        courseyearid: '',
        semtitle: ''
    };
    const { semesterId } = useParams();
    const [formData, setFormData] = useState(initialForm); // Form state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [courseListing, setCourseListing] = useState([]); // Form submission state
    const [yearListing, setYearListing] = useState([]); // on course selection
    const [error, setError] = useState({ field: '', msg: '' }); // Error state
    const semesterList = [
        'semester 1',
        'semester 2',
        'semester 3',
        'semester 4',
        'semester 5',
        'semester 6',
        'semester 7',
        'semester 8',
        'semester 9',
        'semester 10',
        'semester 11',
        'semester 12',
        'semester 13',
        'semester 14',
        'semester 15',
        'semester 16',
        'semester 17',
        'semester 18',
        'semester 19',
        'semester 20',
    ];
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
    }
    useEffect(() => {
        courseListDropdown();
    }, []);

    const updateFetchData = async (semesterId) => {
        if (!semesterId || (!Number.isInteger(parseInt(semesterId, 10)) || parseInt(semesterId, 10) <= 0)) return toast.error("Invalid ID.");
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/semester/fetch`,
                { dbId: semesterId }
            );
            console.log(response);
            if (response?.statusCode === 200 && response.data.length > 0) {
                toast.success(response.message);
                setFormData((prev) => ({
                    ...prev,
                    dbId: response.data[0].id,
                    courseid: response.data[0].courseid,
                    courseyearid: response.data[0].courseyearid,
                    semtitle: response.data[0].semtitle,
                }));
            } else {
                toast.error("Data not found.");
            }
        } catch (error) {
            console.error("Error:", error);
            const statusCode = error.response?.data?.statusCode;

            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    }
    useEffect(() => {
        if (semesterId) {
            updateFetchData(semesterId);
        }
    }, [semesterId]);
    // Handle input field change
    const errorMsg = (field, msg) => {
        setError((prev) => ({
            ...prev,
            field: field,
            msg: msg
        }));
    }
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        errorMsg('', '');
        if (!formData.courseid) {
            errorMsg('courseid', 'Course is required.');
            toast.error('Course is required.');
            return setIsSubmit(false);
        }
        if (!formData.courseyearid) {
            errorMsg('courseyearid', 'Year is required.');
            toast.error('Year is required.');
            return setIsSubmit(false);
        }
        if (!formData.semtitle) {
            errorMsg('semtitle', 'Semester Title is required.');
            toast.error('Semester Title is required.');
            return setIsSubmit(false);
        }

        try {
            formData.loguserid = secureLocalStorage.getItem('login_id');
            formData.login_type = secureLocalStorage.getItem('loginType');
            // submit to the API here
            const response = await axios.post(`${NODE_API_URL}/api/semester/register`, formData);
            if (response.data?.statusCode === 200 || response.data?.statusCode === 201) {
                errorMsg('', "");
                toast.success(response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;
            const errorField = error.response?.data?.errorField;

            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                if (errorField)
                    errorMsg(errorField, error.response?.data?.message);
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
                                    <span className="breadcrumb-item">Academic</span>
                                    <span className="breadcrumb-item">Course</span>
                                    <span className="breadcrumb-item active">Add Course</span>
                                </nav>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mx-auto'>
                                <div className="card border-0 bg-transparent mb-2">
                                    <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                                        <h5 className="card-title h6_new">{semesterId ? 'Update Semester' : 'Add Semester'}</h5>
                                        <div className="ml-auto">
                                            <button
                                                className="ml-auto btn-md btn border-0 btn-light mr-2"
                                                onClick={() => goBack()}
                                            >
                                                <i className="fas fa-arrow-left" /> Go Back
                                            </button>
                                            <Link to="/admin/semester"
                                                className="ml-2 btn-md btn border-0 btn-secondary"
                                            >
                                                <i className="fas fa-list" /> Semester List
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="card border-0">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label className="font-weight-semibold">
                                                        Course <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        options={courseListing.map((item) => ({
                                                            value: item.id,
                                                            label: item.coursename,
                                                            year: item.duration
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({ ...formData, courseid: selectedOption.value });
                                                            const year = selectedOption.year ? selectedOption.year.split(',') : [];
                                                            setYearListing(year);
                                                        }
                                                        }
                                                        value={
                                                            courseListing.find(page => page.id === parseInt(formData.courseid))
                                                                ? {
                                                                    value: parseInt(formData.courseid),
                                                                    label: courseListing.find(page => page.id === parseInt(formData.courseid)).coursename
                                                                }
                                                                : { value: formData.courseid, label: 'Select' }
                                                        }
                                                    />
                                                    {error.field === 'courseid' && <span className="text-danger">{error.msg}</span>}
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="font-weight-semibold">
                                                        Year <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        options={yearListing.map((item) => ({
                                                            value: item,
                                                            label: item,
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({ ...formData, courseyearid: selectedOption.value });
                                                        }
                                                        }
                                                        value={
                                                            yearListing.find(item => item === formData.courseyearid)
                                                                ? {
                                                                    value: formData.courseyearid,
                                                                    label: formData.courseyearid
                                                                }
                                                                : { value: formData.courseyearid, label: 'Select' }
                                                        }
                                                    />
                                                    {error.field === 'courseyearid' && <span className="text-danger">{error.msg}</span>}
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="font-weight-semibold">
                                                        Semester <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        options={semesterList.map((item) => ({
                                                            value: item,
                                                            label: capitalizeFirstLetter(item),
                                                        }))}
                                                        onChange={(selectedOption) => {
                                                            setFormData({ ...formData, semtitle: selectedOption.value });
                                                        }
                                                        }
                                                        value={
                                                            semesterList.find(item => item === formData.semtitle)
                                                                ? {
                                                                    value: formData.semtitle,
                                                                    label: capitalizeFirstLetter(formData.semtitle)
                                                                }
                                                                : { value: formData.semtitle, label: 'Select' }
                                                        }
                                                    />
                                                    {error.field === 'semtitle' && <span className="text-danger">{error.msg}</span>}
                                                </div>
                                                <div className="col-md-12 col-lg-12 col-12">
                                                    <button className='btn btn-dark btn-block d-flex justify-content-center align-items-center' type='submit'>
                                                        Save{" "} {isSubmit && (
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
export default SemesterAdd;