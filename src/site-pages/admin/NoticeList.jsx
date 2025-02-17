import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { NODE_API_URL } from '../../site-components/Helper/Constant';
import { dataFetchingDelete, dataFetchingPatch, dataFetchingPost, formatDate, goBack } from '../../site-components/Helper/HelperFunction'
import { DeleteSweetAlert } from '../../site-components/Helper/DeleteSweetAlert';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/Column';
import { InputText } from 'primereact/inputtext'; // Import InputText for the search box
import '../../../node_modules/primeicons/primeicons.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toast } from 'react-toastify';
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormField } from '../../site-components/admin/assets/FormField';
import secureLocalStorage from 'react-secure-storage';
import validator from "validator";

function NoticeList() {
    const [noticeList, setnoticeList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(''); // State for the search box
    const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();
    // initialize form fields
    const initialData = {
        notice_type: '',
        title: '',
        notice_date: '',
        startDate: '',
        endDate: '',
        status: '',
        deleteStatus: ''
    }
    const [formData, setFormData] = useState(initialData);
    const [isSubmit, setIsSubmit] = useState(false);
    // handle Input fields data and stored them in the formData
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const fetchList = async (deleteStatus = 0) => {
        setIsFetching(true);
        if (formData.deleteStatus != '') {
            deleteStatus = formData.deleteStatus;
        }
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/notice/fetch`,
                {
                    deleteStatus,
                    notice_type: formData.notice_type,
                    title: formData.title,
                    notice_date: formData.notice_date,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    status: formData.status,
                    listing: 'yes'
                });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setnoticeList(response.data);
            } else {
                toast.error("Data not found.");
                setnoticeList([]);
            }
        } catch (error) {
            setnoticeList([]);
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        } finally {
            setIsFetching(false);
        }
    }
    useEffect(() => {
        fetchList();
        // After fetching data, force a hard reload of the page
        navigate(window.location.pathname, { replace: false });
    }, []);
    const showRecyleBin = () => {
        setRecycleTitle(recycleTitle === "Show Recycle Bin" ? "Hide Recycle Bin" : "Show Recycle Bin");
        fetchList(recycleTitle === "Show Recycle Bin" ? 1 : 0);
    }
    const handleToggleStatus = async (dbId, currentStatus) => {
        if (!dbId || !Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0) {
            return toast.error("Invalid ID.");
        }

        // Toggle the status (currentStatus is the current checkbox state)
        const newStatus = currentStatus === 1 ? 0 : 1;

        try {
            const loguserid = secureLocalStorage.getItem('login_id');
            const login_type = secureLocalStorage.getItem('loginType');
            const response = await dataFetchingPatch(`${NODE_API_URL}/api/notice/status/${dbId}/${loguserid}/${login_type}`);
            if (response?.statusCode === 200) {
                toast.success(response.message);
                // Update the notice list to reflect the status change
                setnoticeList(prevList =>
                    prevList.map(item =>
                        item.id === dbId ? { ...item, status: newStatus } : item
                    )
                );
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error("An error occurred. Please check your connection or try again.");
            }
        }
    }

    const deleteStatus = async (dbId) => {
        if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
        try {
            const deleteAlert = await DeleteSweetAlert();
            if (deleteAlert) {
                const loguserid = secureLocalStorage.getItem('login_id');
                const login_type = secureLocalStorage.getItem('loginType');
                const response = await dataFetchingDelete(`${NODE_API_URL}/api/notice/deleteStatus/${dbId}/${loguserid}/${login_type}`);
                if (response?.statusCode === 200) {
                    toast.success(response.message);
                    if (response.data == 1) {
                        fetchList(1);
                    } else {
                        fetchList(0);
                    }
                    showRecyleBin()
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            }
        } catch (error) {
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
    const updateDataFetch = (dbId) => {
        if (dbId) {
            navigate(`/admin/add-notice/${dbId}`, { replace: false });
        }
    }
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const handleFilter = (e) => {
        e.preventDefault();
        fetchList();
    }
    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container-fluid">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                    <Link to="/admin/home" className="breadcrumb-item">
                                        <i className="fas fa-home m-r-5" />
                                        Dashboard
                                    </Link>
                                    <span className="breadcrumb-item">Announcement</span>
                                    <span className="breadcrumb-item active">Notice</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card border-0 bg-transparent mb-2">
                            <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">Notice List</h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn border-0 btn-light mr-2"
                                        onClick={() => goBack()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <button onClick={() => navigate("/admin/add-notice", { replace: false })}
                                        className="ml-2 btn border-0 btn-secondary"
                                    >
                                        <i className="fas fa-plus" /> Add New
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-body">
                                {/* Search Box */}
                                <div className='row align-items-center'>
                                    <div className="col-md-8 col-lg-8 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                                        <div className='search-icon'><i className="pi pi-search" /></div>
                                        <InputText
                                            type="search"
                                            value={globalFilter}
                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                            placeholder="Search"
                                            className="form-control dtsearch-input"
                                        />
                                    </div>
                                    <div className='col-md-4 col-lg-4 col-10 mb-3 col-sm-4 d-flex justify-content-between align-items-center'>
                                        <button className={`btn ${recycleTitle === "Show Recycle Bin" ? 'btn-secondary' : 'btn-danger'}`} onClick={showRecyleBin}>{recycleTitle} <i className="fa fa-recycle"></i></button>
                                        <button className="btn btn-info text-white" onClick={handleShow}><i className="fa fa-filter"></i></button>
                                    </div>
                                </div>
                                <div className={`table-responsive ${isFetching ? 'form' : ''}`}>
                                    <DataTable
                                        value={noticeList}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        globalFilter={globalFilter} // Bind global filter
                                        emptyMessage="No records found"
                                        className="p-datatable-custom"
                                        tableStyle={{ minWidth: '50rem' }}
                                        sortMode="multiple"
                                    >
                                        <Column body={(row) => capitalizeFirstLetter(row.notice_type)} header="Notice Type" sortable />
                                        <Column field="title" header="Title" sortable
                                            body={(rowData) => validator.unescape(rowData.title)}
                                        />
                                        <Column
                                            body={(row) => formatDate(row.notice_date)}
                                            header="Notice Date" sortable />
                                        <Column
                                            body={(row) => formatDate(row.created_at)}
                                            header="Created At" sortable />
                                        {
                                            recycleTitle !== "Show Recycle Bin" && (
                                                <Column field="deleted_at"
                                                    body={(row) => row.deleted_at && row.deleted_at != '0000-00-00' && formatDate(row.deleted_at)}
                                                    header="Deleted At" sortable />
                                            )
                                        }
                                        <Column
                                            header="Action"
                                            body={(rowData) => (
                                                <div className="d-flex">
                                                    <div className="switch mt-1 w-auto">
                                                        <input
                                                            type="checkbox"
                                                            checked={rowData.status === 1}  // This ensures the checkbox reflects the correct status
                                                            onChange={() => handleToggleStatus(rowData.id, rowData.status)} // Pass the id and current status
                                                            id={`switch${rowData.id}`}
                                                        />
                                                        <label className="mt-0" htmlFor={`switch${rowData.id}`}></label>
                                                    </div>
                                                    <div onClick={() => updateDataFetch(rowData.id)} className="avatar avatar-icon avatar-md avatar-orange">
                                                        <i className="fas fa-edit"></i>
                                                    </div>
                                                    {
                                                        parseInt(rowData.deleteStatus) == 0 ?
                                                            (
                                                                <OverlayTrigger
                                                                    placement="bottom"
                                                                    overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}
                                                                >
                                                                    <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                                                                        <i className="fas fa-trash-alt" onClick={() => deleteStatus(rowData.id)}></i>
                                                                    </div>
                                                                </OverlayTrigger>
                                                            ) :
                                                            (
                                                                <OverlayTrigger
                                                                    placement="bottom"
                                                                    overlay={<Tooltip id="button-tooltip-2">Restore</Tooltip>}
                                                                >
                                                                    <div className="avatar ml-2 avatar-icon avatar-md avatar-lime">
                                                                        <i className="fas fa-recycle" onClick={() => deleteStatus(rowData.id)}></i>
                                                                    </div>
                                                                </OverlayTrigger>
                                                            )
                                                    }

                                                </div>
                                            )}
                                        />
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter Records</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <form onSubmit={handleFilter}>
                        <div className='row'>
                            <div className="col-md-12 form-group">
                                <label className='font-weight-semibold'>Notice Type <span className='text-danger'>*</span></label>
                                <select className="form-control" value={formData.notice_type} name='notice_type' id='notice_type' onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="notice" selected={formData.notice_type === 'notice' ? true : false}>Notice</option>
                                    <option value="event" selected={formData.notice_type === 'event' ? true : false}>Event</option>
                                    <option value="publication" selected={formData.notice_type === 'publication' ? true : false}>Publication</option>
                                </select>
                            </div>
                            <FormField label="Title" required name="title" id="title" value={formData.title} column="col-md-12" onChange={handleChange} />
                            <FormField label="Notice Date" required type='date' name="notice_date" id="notice_date" value={formData.notice_date} column="col-md-12" onChange={handleChange} />
                            <div className='col-md-12'>
                                <div className='row px-0'>
                                    <FormField label="Start Date" required type='date' name="startDate" id="startDate" value={formData.startDate} column="col-md-6" onChange={handleChange} />
                                    <FormField label="End Date" required type='date' name="endDate" id="endDate" value={formData.endDate} column="col-md-6" onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-md-12 form-group">
                                <label className='font-weight-semibold'>Status <span className='text-danger'>*</span></label>
                                <select className="form-control" value={formData.status} name='status' id='status' onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="1" selected={formData.status === '1' ? true : false}>Active</option>
                                    <option value="0" selected={formData.status === '0' ? true : false}>Inactive</option>
                                </select>
                            </div>
                            <div className="col-md-12 form-group">
                                <label className='font-weight-semibold'>Delete Status <span className='text-danger'>*</span></label>
                                <select className="form-control" value={formData.deleteStatus} name='deleteStatus' id='deleteStatus' onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="0" selected={formData.deleteStatus === '0' ? true : false}>Non Deleted</option>
                                    <option value="1" selected={formData.deleteStatus === '1' ? true : false}>Deleted</option>
                                </select>
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
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default NoticeList