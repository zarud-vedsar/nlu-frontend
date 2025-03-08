import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import { dataFetchingDelete, dataFetchingPatch, dataFetchingPost, formatDate, goBack, productUnits } from '../../../site-components/Helper/HelperFunction'
import { DeleteSweetAlert } from '../../../site-components/Helper/DeleteSweetAlert';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/Column';
import { InputText } from 'primereact/inputtext'; // Import InputText for the search box
import '../../../../node_modules/primeicons/primeicons.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toast } from 'react-toastify';
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormField } from '../../../site-components/admin/assets/FormField';
import secureLocalStorage from 'react-secure-storage';
import validator from "validator";
import Select from "react-select";
function ProductList() {
    const [ProductList, setProductList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(''); // State for the search box
    const [recycleTitle, setRecycleTitle] = useState("Trash");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();
    // initialize form fields
    const initialData = {
        catId: '',
    }
    const [formData, setFormData] = useState(initialData);
    const [isSubmit, setIsSubmit] = useState(false);
    // handle Input fields data and stored them in the formData
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const fetchCategoryList = async () => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/category/fetch`, { all: true });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setCategoryList(response.data);
            } else {
                setCategoryList([]);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setCategoryList([]);
        }
    }
    useEffect(() => {
        fetchCategoryList();
    }, []);
    const fetchList = async () => {
        setIsFetching(true);
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/threshold-products`,
                {
                    catId: formData.catId,
                });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setProductList(response.data);
            } else {
                toast.error("Data not found.");
                setProductList([]);
            }
        } catch (error) {
            setProductList([]);
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
        fetchList(0);
        // After fetching data, force a hard reload of the page
        navigate(window.location.pathname, { replace: false });
    }, []);
    const showRecyleBin = () => {
        setRecycleTitle(recycleTitle == "Trash" ? "Hide Trash" : "Trash");
        fetchList(recycleTitle == "Trash" ? 1 : 0);
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
            const response = await dataFetchingPatch(`${NODE_API_URL}/api/inventory/product/status/${dbId}/${loguserid}/${login_type}`);
            if (response?.statusCode === 200) {
                toast.success(response.message);
                // Update the notice list to reflect the status change
                setProductList(prevList =>
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
                const response = await dataFetchingDelete(`${NODE_API_URL}/api/inventory/product/deleteStatus/${dbId}/${loguserid}/${login_type}`);
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
                                    <span className="breadcrumb-item">Inventory Management</span>
                                    <span className="breadcrumb-item active">Inventory Alert: Limited Stock Items</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card border-0 bg-transparent mb-2">
                            <div className="card-header border-0 bg-transparent py-1 id-pc-divices-header px-0 id-mobile-divice-d-block">
                                <h5 className="card-title h6_new pt-0">Inventory Alert: Limited Stock Items</h5>
                                <div className="ml-auto id-mobile-go-back">
                                    <button
                                        className="mr-auto btn border-0 goback mr-2"
                                        onClick={() => goBack()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <button className="btn btn-info text-white" onClick={handleShow}><i className="fa fa-filter"></i></button>

                                    <button onClick={() => navigate("/admin/inventory/add-product", { replace: false })}
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
                                    <div className="col-md-11 col-lg-11 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                                        value={ProductList}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        globalFilter={globalFilter} // Bind global filter
                                        emptyMessage="No records found"
                                        className="p-datatable-custom"
                                        tableStyle={{ minWidth: '50rem' }}
                                        sortMode="multiple"
                                    >
                                        <Column field='ctitle' header="Category" sortable body={(rowData) => validator.unescape(rowData.ctitle)} />
                                        <Column field='pname' header="Product" sortable body={(rowData) => validator.unescape(rowData.pname)} />
                                        <Column field='punit' header="Unit" sortable body={(rowData) => validator.unescape(rowData.punit)} />
                                        <Column field='pbrand' header="Brand" sortable body={(rowData) => rowData.pbrand ? validator.unescape(rowData.pbrand) : rowData.pbrand} />
                                        <Column field='total_available_qty' header="Available Stock" sortable body={(rowData) => rowData.total_available_qty} />
                                        <Column field='threshhold_limit' header="Threshold Limit" sortable body={(rowData) => rowData.threshhold_limit} />
                                        <Column header="Action" body={(rowData) => (
                                            <Link to={`/admin/inventory/product/threshold/raised-query/${rowData.id}`} className="btn btn-primary">
                                                <i className="fas fa-bell"></i> Notify for Restock
                                            </Link>
                                        )} />
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
                            <div className="col-md-12 col-lg-12 form-group">
                                <label className="font-weight-semibold">Category</label>
                                <Select
                                    options={categoryList.map((item) => ({
                                        value: item.id,
                                        label: item.ctitle,
                                    }))}
                                    onChange={(selectedOption) => {
                                        setFormData({
                                            ...formData,
                                            catId: selectedOption.value,
                                        });
                                    }}
                                    value={
                                        categoryList.find(
                                            (item) =>
                                                item.id === parseInt(formData.catId)
                                        )
                                            ? {
                                                value: parseInt(formData.catId),
                                                label: categoryList.find(
                                                    (item) =>
                                                        item.id === parseInt(formData.catId)
                                                ).ctitle,
                                            }
                                            : { value: formData.catId, label: "Select" }
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
                    </form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
export default ProductList