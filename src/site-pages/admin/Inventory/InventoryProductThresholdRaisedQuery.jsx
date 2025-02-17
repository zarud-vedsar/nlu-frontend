import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    dataFetchingGet,
    dataFetchingPost,
    formatDate,
    goBack
} from "../../../site-components/Helper/HelperFunction";
import { TextareaField } from "../../../site-components/admin/assets/FormField";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import validator from 'validator';
function Registration() {
    const { dbId, pId } = useParams();
    const initialData = {
        dbId: "",
        pId: "",
        remark: "",
    };
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [productThresholdData, setProductThresholdData] = useState([]);
    const [productThresholdHistory, setProductThresholdHistory] = useState([]);
    const errorMsg = (field, msg) => {
        setError((prev) => ({
            ...prev,
            field: field,
            msg: msg,
        }));
    };
    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const checkProductThreshold = async (pId) => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/threshold-products`, { pId: pId });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setProductThresholdData(response.data);
            } else {
                toast.error("Data not found.");
                setProductThresholdData([]);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setProductThresholdData([]);
        }
    }
    const ProductThresholdHistory = async (pId) => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/threshold-product-request-list`, { pId: pId });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setProductThresholdHistory(response.data);
            } else {
                setProductThresholdHistory([]);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setProductThresholdHistory([]);
        }
    }
    const ProductThresholdDataById = async (dbId) => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/threshold-product-data-by-id/`, { dbId });
            if (response?.statusCode === 200 && response.data.length > 0) {

                setFormData((prev) => ({
                    ...prev,
                    dbId: response.data[0].id,
                    remark: response.data[0].remark,
                }));
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) { /* empty */ }
    }
    useEffect(() => {
        if (dbId) {
            ProductThresholdDataById(dbId);
        } else {
            setFormData((prev) => ({
                ...prev,
                pId: pId,
                remark: "",
                dbId: "",
            }));
        }
    }, [dbId]);
    useEffect(() => {
        if (pId) {
            setFormData((prev) => ({
                ...prev,
                pId: pId
            }));
            checkProductThreshold(pId);
            ProductThresholdHistory(pId);
        }
    }, [pId]);
    const fetchProductForUpdate = async (dbId) => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/fetch`, { dbId });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    dbId: response.data[0].id,
                    catId: response.data[0].catId,
                    pname: response.data[0].pname,
                    threshhold_limit: response.data[0].threshhold_limit,
                    pcode: response.data[0].pcode,
                    punit: response.data[0].punit,
                    pbrand: response.data[0].pbrand,
                    pdesc: response.data[0].pdesc
                }));
            } else {
                toast.error("Data not found.");
                setProductThresholdData([]);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setProductThresholdData([]);
        }
    }
    useEffect(() => {
        if (dbId) {
            fetchProductForUpdate(dbId);
        }
    }, [dbId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        if (!formData.pId) {
            errorMsg("pId", "An error occured.");
            toast.error("An error occured.");
            return setIsSubmit(false);
        }
        if (!formData.remark) {
            errorMsg("remark", "Remark is required.");
            toast.error("Remark is required.");
            return setIsSubmit(false);
        }
        try {
            formData.loguserid = secureLocalStorage.getItem("login_id");
            formData.login_type = secureLocalStorage.getItem("loginType");
            const response = await axios.post(
                `${NODE_API_URL}/api/inventory/product/threshold-product-send-request-to-admin`,
                formData
            );
            if (
                response.data?.statusCode === 200 ||
                response.data?.statusCode === 201
            ) {
                errorMsg("", "");
                toast.success(response.data.message);
                if (response.data?.statusCode === 201) {
                    setFormData(initialData);
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;
            const errorField = error.response?.data?.errorField;

            if ([400, 401, 404, 409, 500].includes(statusCode)) {
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
    };
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
                                    <span className="breadcrumb-item">Inventory Management</span>
                                    <span className="breadcrumb-item active">
                                        {dbId ? "Update Product Detail" : "Add New Product"}
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    {dbId ? "Update Product Detail" : "Add New Product"}
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 goBack mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <Link to="/admin/inventory/product">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            Product History  <i className="fas fa-list"></i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-body">
                                <div className={`table-responsive`}>
                                    <DataTable
                                        value={productThresholdData}
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
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
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-header d-flex justify-content-center align-items-center">
                                <h5 className="card-title h6_new">
                                    Product Threshold Request Form
                                </h5>
                                {
                                    dbId && (
                                        <Link to={`/admin/inventory/product/threshold/raised-query/${pId}`} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                            <i className="fas fa-edit"></i> New Request
                                        </Link>
                                    )
                                }
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <TextareaField
                                            borderError={error.field === "remark"}
                                            errorMessage={error.field === "remark" && error.msg}
                                            label="Remark"
                                            name="remark"
                                            id="remark"
                                            placeholder="Enter Remark"
                                            value={formData.remark}
                                            onChange={handleChange}
                                            column="col-md-12 col-lg-12"
                                            required
                                        />
                                        <div className="col-md-12 col-lg-12 col-12">
                                            <button
                                                disabled={isSubmit}
                                                className="btn btn-dark d-flex justify-content-center align-items-center"
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
                        <div className="card border-0">
                            <div className="card-header">
                                <h5 className="card-title h6_new">
                                    Product Threshold Request History
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className={`table-responsive`}>
                                    <DataTable
                                        value={productThresholdHistory}
                                        paginator
                                        rows={50}
                                        rowsPerPageOptions={[10, 25, 50, 100, 500, 1000, 2000]}
                                        emptyMessage="No records found"
                                        className="p-datatable-custom"
                                        tableStyle={{ minWidth: '50rem' }}
                                        sortMode="multiple"
                                    >
                                        <Column
                                            header="Request By"
                                            sortable
                                            body={(rowData) => rowData.facultyName ? validator.unescape(rowData.facultyName) : 'N/A'}
                                        />
                                        <Column
                                            header="Product"
                                            sortable
                                            body={(rowData) => rowData.pname ? validator.unescape(rowData.pname) : 'N/A'}
                                        />
                                        <Column
                                            header="Unit"
                                            sortable
                                            body={(rowData) => rowData.punit ? validator.unescape(rowData.punit) : 'N/A'}
                                        />
                                        <Column
                                            header="Brand"
                                            sortable
                                            body={(rowData) => rowData.pbrand ? validator.unescape(rowData.pbrand) : 'N/A'}
                                        />
                                        <Column
                                            header="Avl. Stock"
                                            sortable
                                            body={(rowData) => rowData?.total_available_qty}
                                        />
                                        <Column
                                            header="Threshold"
                                            sortable
                                            body={(rowData) => rowData.threshhold_limit || 'N/A'}
                                        />
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
                                                        <span className="badge badge-warning">Request Sent</span>
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
                                        <Column
                                            header="Action"
                                            body={(rowData) => (
                                                <>
                                                    {[0, 2].includes(rowData.status) && (
                                                        <Link to={`/admin/inventory/product/threshold/raised-query/${pId}/${rowData.id}`} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                                            <i className="fas fa-edit"></i> View/Edit Remark
                                                        </Link>
                                                    )}
                                                </>
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
    );
}
export default Registration;