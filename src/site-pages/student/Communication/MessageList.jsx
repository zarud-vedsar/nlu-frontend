import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { formatDate, goBack } from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext";
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import secureLocalStorage from "react-secure-storage";

function MessageList() {
    const navigate = useNavigate();
    const [messageListing, setMessageListing] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(""); // Search filter
    const sid = secureLocalStorage.getItem("studentId"); // Retrieving student ID

    const fetchAllMessages = async (sid) => {
        try {
            const response = await axios.post(`${NODE_API_URL}/api/communication/fetch-all-message`, {
                studentId: sid,
                forListing: true,
                replyId: 0,
            });
            if (response?.data?.statusCode === 200 && response?.data?.data.length > 0) {
                setMessageListing(response?.data?.data);
            } else {
                toast.error("No data found.");
                setMessageListing([]);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to fetch data. Please try again later.");
            setMessageListing([]);
        }
    };

    useEffect(() => {
        if (sid) fetchAllMessages(sid);
    }, [sid]);
    console.log(messageListing);

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
                                    <span className="breadcrumb-item">Communication Management</span>
                                    <span className="breadcrumb-item active">Message List</span>
                                </nav>
                            </div>
                        </div>

                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title">Message List</h5>
                                <div className="ml-auto">
                                    <button className="btn btn-secondary mr-2" onClick={goBack}>
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    {!secureLocalStorage.getItem("sguardianemail") &&
                                    <Link to="/student/new-message">
                                        <button className="btn btn-secondary">
                                            <i className="fas fa-plus"></i> Add New
                                        </button>
                                    </Link>
}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                {/* Search Box */}
                                <div className="row mb-3">
                                    <div className="col-12 p-input-icon-left">
                                        <i className="pi pi-search" />
                                        <InputText
                                            type="search"
                                            value={globalFilter}
                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                            placeholder="Search"
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                {/* Data Table */}
                                <div className="table-responsive">
                                    <DataTable
                                        value={messageListing}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        globalFilter={globalFilter}
                                        emptyMessage="No records found"
                                        sortMode="multiple"
                                    >
                                        <Column
                                            field="facultyName"
                                            header="Faculty"
                                            body={(row) => (
                                                <div>
                                                    {validator.unescape(row.facultyName)}
                                                    {
                                                        row.StudentSeen > 0 && (
                                                            <span className="badge badge-danger">{row.StudentSeen}</span>
                                                        )
                                                    }
                                                </div>
                                            )}
                                            sortable
                                        />
                                        <Column
                                            header="Sender Type"
                                            body={(row) =>
                                                row.sentBy === "student" ? (
                                                    <span className="badge badge-success">Sent</span>
                                                ) : (
                                                    <span className="badge badge-info">Received</span>
                                                )
                                            }
                                            sortable
                                        />
                                        <Column
                                            field="created_at"
                                            header="Created At"
                                            body={(row) => formatDate(row.created_at)}
                                            sortable
                                        />
                                        <Column
                                            header="Action"
                                            body={(rowData) => (
                                                <div className="d-flex">
                                                    <button
                                                        className="btn btn-primary btn-sm mr-2"
                                                        onClick={() => navigate(`/student/message-list/view/${rowData.id}`)}
                                                    >
                                                        View
                                                    </button>
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
    );
}

export default MessageList;
