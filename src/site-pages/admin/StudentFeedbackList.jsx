import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { formatDate } from "../../site-components/Helper/HelperFunction";
import secureLocalStorage from "react-secure-storage";
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import validator, { toDate } from "validator";
const FeedbackList = () => {
    const [feedbackListing, setFeedbackListing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState(""); // State for filtering
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    
    const formatDateForMonth = (date) => {
        return new Intl.DateTimeFormat("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(date);
      };
      
        
      const getFirstDayOfMonth = () => {
        const now = new Date();
        return formatDateForMonth(new Date(now.getFullYear(), now.getMonth(), 1));
      };
      
      const getLastDayOfMonth = () => {
        const now = new Date();
        return formatDateForMonth(new Date(now.getFullYear(), now.getMonth() + 1, 0));
      };
    const initialData = {
        fromDate: getFirstDayOfMonth(),
        toDate: getLastDayOfMonth()
    }

    const [formData, setFormData] = useState(initialData);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        fetchFeedbackList();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const filterList = () => {
        fetchFeedbackList();
    }
    const fetchFeedbackList = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${NODE_API_URL}/api/student/feedback/get-student-feedback-filter-list`, {
                fromDate: formData.fromDate,
                toDate: formData.toDate
            });
            if (response.data.data && response.data.data.length > 0) {
                setFeedbackListing(response.data.data);
            } else {
                setFeedbackListing([]);
            }
        } catch (error) {
            setFeedbackListing([]);
        } finally {
            setLoading(false);
        }
    };

    // Columns for DataTable with auto-incremented Sr. No.
    const columns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1, // Auto-incremented Sr. No.
            sortable: true,
        },
        {
            name: 'Subject',
            selector: row => row.subject,
            sortable: true,
        },
        {
            name: 'Submit Date',
            selector: row => formatDate(row.submit_date),
            sortable: true,
        },
        {
            name: 'Message',
            selector: (row) => {
                return (
                    <>
                        <button className="btn btn-primary" onClick={() => {
                            handleShow();
                            setMessage(row.message ? validator.unescape(row.message) : row.message);
                        }}>View <i className="fas fa-eye"></i></button>
                    </>
                )
            },
            sortable: true,
        }
    ];

    // Filter the feedback list based on filter text
    const filteredFeedback = feedbackListing.filter(item =>
        item.subject && item.subject.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container-fluid">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                    <a href="/student" className="breadcrumb-item">
                                        Home
                                    </a>
                                    <span className="breadcrumb-item">Feedback</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card border-0 bg-transparent mb-2">
                            <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">All Feedback</h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 btn-light "
                                        onClick={() => window.history.back()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header py-2">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="font-weight-semibold">From</label>
                                        <input type="date" className="form-control" name="fromDate" id="fromDate" value={formData.fromDate} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="font-weight-semibold">To</label>
                                        <input type="date" className="form-control" name="toDate" id="toDate" value={formData.toDate} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-4 d-flex justify-content-start align-items-center">
                                        <button className="btn btn-info mt-4" onClick={filterList}>Search</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by Subject"
                                            value={filterText}
                                            onChange={(e) => setFilterText(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <DataTable
                                            columns={columns}
                                            data={filteredFeedback} // Filtered data passed to DataTable
                                            progressPending={loading}
                                            pagination
                                            highlightOnHover
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <p>{message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FeedbackList;
