import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    const { dbId } = useParams();
    const [status, setStatus] = useState({ status: '' });
    const [productThresholdData, setProductThresholdData] = useState([]);
    const navigate = useNavigate();
    const fetchThresholdCheckExists = async (dbId) => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/threshold-product-request-list`,
                { dbId });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setProductThresholdData(response.data);
            } else {
                setProductThresholdData([]);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setProductThresholdData([]);
        }
    }
    useEffect(() => {
        if (dbId) {
            fetchThresholdCheckExists(dbId);
        }
        // After fetching data, force a hard reload of the page
        navigate(window.location.pathname, { replace: false });
    }, [dbId]);
    const changeStatusOfStock = async () => {
        if (!status.status) {
            toast.error("Please select status.");
            return;
        }
        if (!dbId) {
            toast.error("Invalid ID.");
            return;
        }
        try {
            const loguserid = secureLocalStorage.getItem("login_id");
            const login_type = secureLocalStorage.getItem("loginType");
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/threshold-product-change-status`,
                { dbId, status: status.status, loguserid, login_type });

            if (response?.statusCode === 200) {
                toast.success(response.message);
                fetchThresholdCheckExists(dbId);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.statusCode;

            if ([400, 401, 404, 409, 500].includes(statusCode)) {
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
                                        <i className="fas fa-home m-r-5" /> Dashboard
                                    </a>
                                    <span className="breadcrumb-item">Inventory Management</span>
                                    <span className="breadcrumb-item">Restock Notification List</span>
                                    <span className="breadcrumb-item active">Restock Notification Detail</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    Restock Notification Detail
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 goBack mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card">
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
                                        <Column field="facultyName" header="Request By" sortable body={(rowData) => validator.unescape(rowData.facultyName)} />
                                        <Column field="ctitle" header="Category" sortable body={(rowData) => validator.unescape(rowData.ctitle)} />
                                        <Column field="pname" header="Product" sortable body={(rowData) => validator.unescape(rowData.pname)} />
                                        <Column field="punit" header="Unit" sortable body={(rowData) => validator.unescape(rowData.punit)} />
                                        <Column field="pbrand" header="Brand" sortable body={(rowData) => rowData.pbrand ? validator.unescape(rowData.pbrand) : rowData.pbrand} />
                                        <Column field="total_available_qty" header="Available Stock" sortable body={(rowData) => rowData.total_available_qty} />
                                        <Column field="threshhold_limit" header="Threshold Limit" sortable body={(rowData) => rowData.threshhold_limit} />
                                        <Column
                                        field="currentStock"
                                            header="Current Stock"
                                            sortable
                                            body={(rowData) => rowData?.currentStock}
                                        />
                                        <Column
                                        field="created_at"
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
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title h6_new">
                                    Update Restock Notification Status
                                </h5>
                            </div>
                            <div className="card-body pt-3">
                                <div className="row">
                                    <div className="col-md-6">
                                        <select name="status" value={status.status} id="status" className="form-control" onChange={(e) => setStatus({ status: e.target.value })}>
                                            <option value="">Select Status</option>
                                            <option value="1">Request Cancelled</option>
                                            <option value="2">Order To Vendor</option>
                                            <option value="3">Order Received</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <button onClick={changeStatusOfStock} type="button" className="btn btn-dark py-2">Update Status</button>
                                    </div>
                                </div>
                                <p className="mt-2"><strong>Remark:</strong> {productThresholdData[0]?.remark}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Registration;