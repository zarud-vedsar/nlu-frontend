import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select'; // Dropdown component
import { FormField } from '../../site-components/admin/assets/FormField';
import { goBack } from '../../site-components/Helper/HelperFunction';
import { PHP_API_URL } from '../../site-components/Helper/Constant';
import secureLocalStorage from 'react-secure-storage';
const AddMenu = () => {
    const navigate = useNavigate();
    const { menuid } = useParams();
    const initialForm = {
        updateid: '',
        menu_title: '',
        menu_link: '',
        menu_other_link: '',
        target: '',
    };
    const [formData, setFormData] = useState(initialForm);
    const [PageListing, setPageListing] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);

    // Fetch list of pages 
    const fetchList = async () => {
        try {
            const response = await axios.post(`${PHP_API_URL}/page.php`, {
                data: 'distinctTitleId',
            },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
            if (response.data.status === 200) {
                setPageListing(response.data.data);
            }
        } catch (error) {
            const status = error.response?.data?.status;

            if (status === 400 || status === 500) {
                toast.error(error.response.data.msg || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    }
    useEffect(() => {
        fetchList();
    }, []);
    const updatfetchPageById = async (menuid) => {

        if (Number.isInteger(parseInt(menuid, 10)) && parseInt(menuid, 10) > 0) {
            try {
                const response = await axios.post(`${PHP_API_URL}/menu.php`, {
                    data: 'menuwithid',
                    id: menuid,
                },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    });
                if (response.data.status === 200) {
                    setFormData((prev) => ({
                        ...prev,
                        updateid: response.data.data[0].id,
                        menu_title: response.data.data[0].menu_title,
                        menu_link: response.data.data[0].menu_link,
                        menu_other_link: response.data.data[0].menu_other_link,
                        target: response.data.data[0].target,
                    }));
                }
            } catch (error) {
                const status = error.response?.data?.status;
                if (status === 400 || status === 500) {
                    toast.error(error.response.data.msg || "A server error occurred.");
                } else {
                    toast.error(
                        "An error occurred. Please check your connection or try again."
                    );
                }
            }
        }
    }
    useEffect(() => {
        if (menuid) {
            updatfetchPageById(menuid);
        }
    }, [menuid]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        if (!formData.menu_title) {
            toast.error("Title is required.");
            return setIsSubmit(false);
        }
        if (!formData.menu_link) {
            toast.error("Link type is required.");
            return setIsSubmit(false);
        }
        if (formData.menu_link === 'other-link' && !formData.menu_other_link) {
            toast.error("Other Link is required.");
            return setIsSubmit(false);
        }
        if (!formData.target) {
            toast.error("Target is required.");
            return setIsSubmit(false);
        }
        const sendFormData = new FormData();
        for (let key in formData) {
            sendFormData.append(key, formData[key]);
        }
        sendFormData.append('data', 'menusave');
        sendFormData.append('loguserid', secureLocalStorage.getItem('login_id'));
        sendFormData.append('login_type', secureLocalStorage.getItem('loginType'));

        try {
            // submit to the API here
            const response = await axios.post(`${PHP_API_URL}/menu.php`, sendFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            if (response.data?.status === 200 || response.data?.status === 201) {
                toast.success(response.data.msg);
                if (response.data.status === 201) {
                    setFormData(initialForm);
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const status = error.response?.data?.status;

            if (status === 400 || status === 500) {
                toast.error(error.response.data.msg || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        } finally {
            setIsSubmit(false);
        }
    };
    return (
        <div className="page-container">
            <div className="main-content">
                <div className="container-fluid">
                    <div className="page-header mb-0 mt-0">
                        <div className="header-sub-title">
                            <nav className="breadcrumb breadcrumb-dash">
                                <a href="/" className="breadcrumb-item"><i className="fas fa-home m-r-5"></i>Dashboard</a>
                                <a href="#" className="breadcrumb-item">Menu</a>
                                <span className="breadcrumb-item active">{menuid ? 'Update Menu' : 'Add Menu'}</span>
                            </nav>
                        </div>
                    </div>
                    <div className="card bg-transparent mb-2">
                        <div className="card-header d-flex justify-content-between align-items-center px-0">
                            <h5 className="card-title h6_new">Menu List</h5>
                            <div className="ml-auto">
                                <button
                                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                                    onClick={() => goBack()}
                                >
                                    <i className="fas fa-arrow-left" /> Go Back
                                </button>
                                <Link
                                    to={'/admin/menu-list'}
                                    className="ml-2 btn-md btn border-0 btn-secondary"
                                >
                                    <i className="fas fa-list" /> Menu List
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-lg-6 col-12 mx-auto">
                            <form onSubmit={handleSubmit}>
                                <div className="card">
                                    <div className="card-body">
                                        <div className='row'>
                                            <FormField
                                                label="Title"
                                                type="text"
                                                name="menu_title"
                                                value={formData.menu_title}
                                                column="col-md-12"
                                                onChange={handleChange}
                                                required
                                            />
                                            <div className="col-md-12 form-group">
                                                <label>Link Type: <span className="text-danger">*</span></label>
                                                <Select
                                                    options={[
                                                        { value: '', label: 'Select' },
                                                        { value: 'other-link', label: 'Other Link' },
                                                        ...PageListing.map(page => ({ value: page.id, label: page.ptitle })),
                                                    ]}
                                                    value={
                                                        formData.menu_link === 'other-link'
                                                            ? { value: 'other-link', label: 'Other Link' }
                                                            : PageListing.find(page => page.id === parseInt(formData.menu_link))
                                                                ? {
                                                                    value: parseInt(formData.menu_link),
                                                                    label: PageListing.find(page => page.id === parseInt(formData.menu_link)).ptitle
                                                                }
                                                                : { value: formData.menu_link, label: 'Select' }
                                                    }
                                                    onChange={(selectedOption) =>
                                                        setFormData({ ...formData, menu_link: selectedOption.value })
                                                    }
                                                />



                                            </div>

                                            {formData.menu_link === 'other-link' && (
                                                <FormField
                                                    label="Other Link"
                                                    type="text"
                                                    name="menu_other_link"
                                                    value={formData.menu_other_link}
                                                    column="col-md-12"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            )}
                                            <div className="col-md-12 form-group">
                                                <label>Target: <span className="text-danger">*</span></label>
                                                <Select
                                                    options={[
                                                        { value: '', label: 'Select' },
                                                        { value: '_blank', label: 'On New Tab' },
                                                        { value: '_self', label: 'On Same Tab' },
                                                    ]}
                                                    value={
                                                        formData.target
                                                            ? { value: formData.target, label: formData.target === '_blank' ? 'On New Tab' : 'On Same Tab' }
                                                            : { value: '', label: 'Select' }
                                                    }
                                                    onChange={(selectedOption) =>
                                                        setFormData({ ...formData, target: selectedOption.value })
                                                    }
                                                />
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
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMenu;