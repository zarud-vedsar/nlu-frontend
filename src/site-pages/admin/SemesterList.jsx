// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { toast } from 'react-toastify';
import { capitalizeFirstLetter, dataFetchingDelete, dataFetchingPatch, dataFetchingPost, formatDate, goBack } from '../../site-components/Helper/HelperFunction';
import { DeleteSweetAlert } from '../../site-components/Helper/DeleteSweetAlert';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/Column';
import { InputText } from 'primereact/inputtext'; // Import InputText for the search box
import '../../../node_modules/primeicons/primeicons.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
function SemesterList() {
    const [SemesterListing, setSemesterListing] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(''); // State for the search box
    const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
    const navigate = useNavigate();
    const fetchSemesterListing = async (deleteStatus = 0) => {
        setIsFetching(true);
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/semester/fetch`,
                {
                    deleteStatus,
                    listing: 'yes'
                });

            if (response?.statusCode === 200 && response.data.length > 0) {
                setSemesterListing(response.data);
            } else {
                toast.error("Data not found.");
                setSemesterListing([]);
            }
        } catch (error) {
            setSemesterListing([]);
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
        fetchSemesterListing();
    }, []);
    const showRecyleBin = () => {
        setRecycleTitle(recycleTitle === "Show Recycle Bin" ? "Hide Recycle Bin" : "Show Recycle Bin");
        fetchSemesterListing(recycleTitle === "Show Recycle Bin" ? 1 : 0);
    }

    const handleToggleStatus = async (dbId, currentStatus) => {
        if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
        // Toggle the status (currentStatus is the current checkbox state)
        const newStatus = currentStatus === 1 ? 0 : 1;
        try {
            const loguserid = secureLocalStorage.getItem('login_id');
            const login_type = secureLocalStorage.getItem('loginType');
            const response = await dataFetchingPatch(`${NODE_API_URL}/api/semester/status/${dbId}/${loguserid}/${login_type}`);
            if (response?.statusCode === 200) {
                toast.success(response.message);
                // Update the notice list to reflect the status change
                setSemesterListing(prevList =>
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
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
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
                const response = await dataFetchingDelete(`${NODE_API_URL}/api/semester/deleteStatus/${dbId}/${loguserid}/${login_type}`);
                if (response?.statusCode === 200) {
                    toast.success(response.message);
                    if (response.data == 1) {
                        fetchSemesterListing(1);
                    } else {
                        fetchSemesterListing(0);
                    }
                    showRecyleBin()
                } else {
                    toast.error("An error occurred. Please try again.");
                }
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
    const updateDataFetch = async (dbId) => {
        if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
        navigate(`/admin/edit-semester/${dbId}`, { replace: false });
    }

    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container-fluid">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                <a href="/admin/" className="breadcrumb-item">
                                     <i className="fas fa-home m-r-5" />
                                    Dashboard
                                   </a>
                                   <span className="breadcrumb-item active">
                                   Learning Management
                                   </span>
                                    <span className="breadcrumb-item active">Semester</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                                <h5 className="card-title h6_new">Semester List</h5>
                                <div className="ml-auto id-mobile-go-back">
                                    <button
                                        className="mr-auto btn-md btn border-0 goback mr-2"
                                        onClick={() => goBack()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <Link
                                        to={'/admin/add-semester'}
                                        className="ml-2 btn-md btn border-0 btn-secondary"
                                    >
                                        <i className="fas fa-plus" /> Add New
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                {/* Search Box */}
                                <div className='row'>
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
                                    <div className='col-md-4 col-lg-4 col-10 col-sm-4 mb-3'>
                                        <button className={`btn ${recycleTitle === "Show Recycle Bin" ? 'btn-secondary' : 'btn-danger'}`} onClick={showRecyleBin}>{recycleTitle} <i className="fa fa-recycle"></i></button>
                                    </div>
                                </div>
                                <div className={`table-responsive ${isFetching ? 'form' : ''}`}>
                                    <DataTable
                                        value={SemesterListing}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        globalFilter={globalFilter} // Bind global filter
                                        emptyMessage="No records found"
                                        className="p-datatable-custom"
                                        tableStyle={{ minWidth: '50rem' }}
                                        sortMode="multiple"
                                    >
                                        <Column field="coursename" header="Course" sortable />
                                        <Column field='courseyearid' body={(row) => `${row.courseyearid} Years`} header="Year" sortable />
                                        <Column  field='semtitle' body={(row) => capitalizeFirstLetter(row.semtitle)} header="Semester" sortable />
                                        <Column field="created_at"
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
                                                        <input type="checkbox"
                                                            checked={rowData.status === 1}  // This ensures the checkbox reflects the correct status
                                                            onChange={() => handleToggleStatus(rowData.id, rowData.status)} // Pass the id and current status
                                                            className="facultydepartment-checkbox" id={`switch${rowData.id}`} />
                                                        <label className="mt-0" htmlFor={`switch${rowData.id}`}></label>
                                                    </div>
                                                    <div onClick={() => updateDataFetch(rowData.id)} className="avatar avatar-icon avatar-md avatar-orange">
                                                        <i className="fas fa-edit"></i>
                                                    </div>
                                                    {
                                                        rowData.deleteStatus == 0 ?
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
        </>
    )
}
export default SemesterList;