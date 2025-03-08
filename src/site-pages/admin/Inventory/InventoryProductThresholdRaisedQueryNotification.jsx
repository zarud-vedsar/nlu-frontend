import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import { dataFetchingDelete, dataFetchingPatch, dataFetchingPost, formatDate, goBack, productUnits } from '../../../site-components/Helper/HelperFunction'
import { DeleteSweetAlert } from '../../../site-components/Helper/DeleteSweetAlert';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/Column';
import { InputText } from 'primereact/inputtext'; // Import InputText for the search box
import '../../../../node_modules/primeicons/primeicons.css';
import { toast } from 'react-toastify';
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import secureLocalStorage from 'react-secure-storage';
import validator from "validator";
import Select from "react-select";
import { FormField } from '../../../site-components/admin/assets/FormField';
function ProductList() {
    const [ProductList, setProductList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(''); // State for the search box
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();
    // initialize form fields
    const initialData = {
        catId: '',
        status: '',
        requestDate: '',
        requestDateStart: '',
        requestDateEnd: '',
        facultyId: ''
    }
    const [formData, setFormData] = useState(initialData);
    const [isSubmit, setIsSubmit] = useState(false);
    // handle Input fields data and stored them in the formData
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
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/threshold-product-request-list`,
                {
                    catId: formData.catId,
                    status: formData.status,
                    requestDate: formData.requestDate,
                    requestDateStart: formData.requestDateStart,
                    requestDateEnd: formData.requestDateEnd
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
        fetchList();
        // After fetching data, force a hard reload of the page
        navigate(window.location.pathname, { replace: false });
    }, []);
    const handleFilter = (e) => {
        e.preventDefault();
        fetchList();
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                                    <span className="breadcrumb-item active">Restock Notification List</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card border-0 bg-transparent mb-2">
                            <div className="card-header border-0 bg-transparent py-1 id-pc-divices-header px-0 id-mobile-divice-d-block">
                                <h5 className="card-title h6_new pt-0">Restock Notification List</h5>
                                <div className="ml-auto id-mobile-go-back ">
                                    <button
                                        className="mr-auto btn border-0 goback mr-2"
                                        onClick={() => goBack()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <button className="btn btn-info text-white" onClick={handleShow}><i className="fa fa-filter"></i></button>

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
                                        <Column header="Category" sortable body={(rowData) => validator.unescape(rowData.ctitle)} />
                                        <Column header="Product" sortable body={(rowData) => validator.unescape(rowData.pname)} />
                                        <Column header="Unit" sortable body={(rowData) => validator.unescape(rowData.punit)} />
                                        <Column header="Brand" sortable body={(rowData) => rowData.pbrand ? validator.unescape(rowData.pbrand) : rowData.pbrand} />
                                        <Column header="Available Stock" sortable body={(rowData) => rowData.total_available_qty} />
                                        <Column header="Threshold Limit" sortable body={(rowData) => rowData.threshhold_limit} />
                                        <Column
                                            header="Current Stock"
                                            sortable
                                            body={(rowData) => rowData?.currentStock}
                                        />
                                        <Column
                                            header="Request Date"
                                            sortable
                                            body={(rowData) => rowData?.created_at ? formatDate(rowData?.created_at) : rowData?.created_at}
                                        />
                                        <Column
                                            header="Status"
                                            body={(rowData) => (
                                                <div>
                                                    {rowData.status === 0 && (
                                                        <span className="badge badge-warning">New Request</span>
                                                    )}
                                                    {rowData.status === 1 && (
                                                        <span className="badge badge-danger">Request Cancelled</span>
                                                    )}
                                                    {rowData.status === 2 && (
                                                        <span className="badge badge-info">Order To Vendor</span>
                                                    )}
                                                    {rowData.status === 3 && (
                                                        <span className="badge badge-success">Order Received</span>
                                                    )}
                                                </div>
                                            )}
                                        />
                                        <Column header="Action" body={(rowData) => (
                                            <Link to={`/admin/inventory/product/threshold/raised-query-notification-view/${rowData.id}`} className="btn btn-primary">
                                                <i className="fas fa-eye"></i> View
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
                            <div className="col-md-12 form-group">
                                <select name="status" value={formData.status} id="status" className="form-control" onChange={handleChange}>
                                    <option value="">Select Status</option>
                                    <option value="1">Request Cancelled</option>
                                    <option value="2">Order To Vendor</option>
                                    <option value="3">Order Received</option>
                                </select>
                            </div>
                            <FormField
                                label="Request Date"
                                name="requestDate"
                                id="requestDate"
                                type='date'
                                value={formData.requestDate}
                                onChange={handleChange}
                                column="col-md-12 col-lg-12"
                            />
                            <FormField
                                label="Request Date From"
                                name="requestDateStart"
                                id="requestDateStart"
                                type='date'
                                value={formData.requestDateStart}
                                onChange={handleChange}
                                column="col-md-6 col-lg-6"
                            />
                            <FormField
                                label="Request Date To"
                                name="requestDateEnd"
                                id="requestDateEnd"
                                type='date'
                                value={formData.requestDateEnd}
                                onChange={handleChange}
                                column="col-md-6 col-lg-6"
                            />
                            <div className="col-md-12 col-lg-12 col-12 d-flex align-items-center justify-content-center">
                                <button onClick={() => setFormData(initialData)} className='mt-2 btn btn-secondary btn-block d-flex justify-content-center align-items-center' type='button'>
                                    Reset
                                </button>
                                <button className='btn btn-primary ml-2 btn-block d-flex justify-content-center align-items-center' type='submit'>
                                    Apply Filter{" "} {isSubmit && (
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