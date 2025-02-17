import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormField } from '../../../site-components/admin/assets/FormField';
import axios from 'axios';
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from 'react-toastify';
import { dataFetchingPatch, dataFetchingPost, formatDate, goBack } from '../../../site-components/Helper/HelperFunction';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/Column';
import { InputText } from 'primereact/inputtext'; // Import InputText for the search box
import '../../../../node_modules/primeicons/primeicons.css';
import secureLocalStorage from 'react-secure-storage';
function TimeSlot() {
    const [toggleShow, setToggleShow] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [TimeSlotList, setTimeSlotList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(''); // State for the search box
    const iniatialForm = {
        dbId: "",
        title: "",
    };
    const [formData, setFormData] = useState(iniatialForm);
    const fetchList = async () => {
        setIsFetching(true);
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/time-table/fetch`,
                {
                    column: "id, dtitle, created_at, status"
                });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setTimeSlotList(response.data);
            } else {
                toast.error("Data not found.");
                setTimeSlotList([]);
            }
        } catch (error) {
            setTimeSlotList([]);
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                setTitleError(error.response.message);
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
    }, []);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const submitForm = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setTitleError('');
        if (!formData.title) {
            setTitleError("Title is required.");
            return setIsSubmit(false);
        }
        try {
            formData.loguserid = secureLocalStorage.getItem('login_id');
            formData.login_type = secureLocalStorage.getItem('loginType');
            // submit to the API here
            const response = await axios.post(`${NODE_API_URL}/api/time-table/register`, formData);
            if (response.data?.statusCode === 200 || response.data?.statusCode === 201) {
                toast.success(response.data.message);
                setTitleError('');
                fetchList(0);
                setToggleShow(false);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                setTitleError(error.response.data.message);
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
    const handleToggleShow = () => {
        setToggleShow(!toggleShow);
        setFormData(iniatialForm)
    };
    const handleToggleStatus = async (dbId, currentStatus) => {
        if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
        try {
            // Toggle the status (currentStatus is the current checkbox state)
            const newStatus = currentStatus === 1 ? 0 : 1;
            const loguserid = secureLocalStorage.getItem('login_id');
            const login_type = secureLocalStorage.getItem('loginType');
            const response = await dataFetchingPatch(`${NODE_API_URL}/api/time-table/status/${dbId}/${loguserid}/${login_type}`);
            if (response?.statusCode === 200) {
                toast.success(response.message);
                // Update the notice list to reflect the status change
                setTimeSlotList(prevList =>
                    prevList.map(item =>
                        item.id === dbId ? { ...item, status: newStatus } : item
                    )
                );
                setTitleError('');
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;

            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                setTitleError(error.response.message);
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    }
    const updateDataFetch = async (dbId) => {
        if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/time-table/fetch`,
                { dbId: dbId }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                toast.success(response.message);
                setFormData((prev) => ({
                    ...prev,
                    dbId: response.data[0].id,
                    title: response.data[0].dtitle,
                }));
                setToggleShow(!toggleShow);
            } else {
                toast.error("Data not found.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;

            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                setTitleError(error.response.message);
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
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
                                        <i className="fas fa-home m-r-5" />
                                        Dashboard
                                    </a>
                                    <span className="breadcrumb-item">Time Table Management</span>
                                    <span className="breadcrumb-item active">Time Slot</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">Time Slot List</h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 btn-light mr-2"
                                        onClick={() => goBack()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <button
                                        className="ml-2 btn-md btn border-0 btn-secondary"
                                        onClick={handleToggleShow}
                                    >
                                        <i className="fas fa-plus" /> Add New
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                {/* Search Box */}
                                <div className='row'>
                                    <div className="col-md-12 col-lg-12 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                                        <div className='search-icon'><i className="pi pi-search" /></div>
                                        <InputText
                                            type="search"
                                            value={globalFilter}
                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                            placeholder="Search"
                                            className="form-control dtsearch-input"
                                        />
                                    </div>
                                </div>
                                <div className={`table-responsive ${isFetching ? 'form' : ''}`}>
                                    <DataTable
                                        value={TimeSlotList}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        globalFilter={globalFilter} // Bind global filter
                                        emptyMessage="No records found"
                                        className="p-datatable-custom"
                                        tableStyle={{ minWidth: '50rem' }}
                                        sortMode="multiple"
                                    >
                                        <Column field="dtitle" header="Title" sortable />
                                        <Column field="created_at"
                                            body={(row) => formatDate(row.created_at)}
                                            header="Created At" sortable />
                                        <Column
                                            header="Action"
                                            body={(rowData) => (
                                                <div className="d-flex">
                                                    <div className="switch mt-1 w-auto">
                                                        <input type="checkbox"
                                                            checked={rowData.status === 1}  // This ensures the checkbox reflects the correct status
                                                            onChange={() => handleToggleStatus(rowData.id, rowData.status)} // Pass the id and current status
                                                            className="facultydepartment-checkbox" id={`switch${rowData.id}`} />
                                                        <label className="mt-0" htmlFor={`switch${rowData.id}`}></label>
                                                    </div>
                                                    <div onClick={() => updateDataFetch(rowData.id)} className="avatar avatar-icon avatar-md avatar-orange">
                                                        <i className="fas fa-edit"></i>
                                                    </div>
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
            <Modal show={toggleShow} onHide={handleToggleShow}>
                <Modal.Header>
                    <Modal.Title>{formData.dbId ? "Update Time Slot" : "Add New Time Slot"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className='row'>
                            <FormField label="Title" name="title" id="title" borderError={titleError ? true : false} errorMessage={titleError} value={formData.title} column='col-md-12' onChange={handleChange} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className='d-flex nowrap justify-content-between'>
                    <Button variant="light" onClick={handleToggleShow}>
                        Close
                    </Button>
                    <Button variant="dark" className='d-flex justify-content-center align-items-center' onClick={submitForm}>
                        Save{" "} {isSubmit && (
                            <>
                                &nbsp; <div className="loader-circle"></div>
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default TimeSlot