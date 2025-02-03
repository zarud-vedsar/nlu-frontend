import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { formatDate, goBack } from "../../../site-components/Helper/HelperFunction";
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import secureLocalStorage from "react-secure-storage";
import ScrollToBottom from 'react-scroll-to-bottom';

function MessageList() {
    const { dbId } = useParams();
    const [messageListing, setMessageListing] = useState([]);
    const [messageView, setMessageView] = useState([]);
    const sid = secureLocalStorage.getItem("studentId"); // Retrieving student ID
    const initialData = {
        dbId: '',
        message: '',
        loguserid: '',
        login_type: 'student'
    };
    const [formData, setFormData] = useState(initialData);
    const fetchMainMessage = async (dbId) => {
        try {
            const response = await axios.post(`${NODE_API_URL}/api/communication/fetch-all-message`, {
                dbId,
                studentId: sid,
                forListing: true
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

    const fetchMainMessageReply = async (dbId) => {
        try {
            const response = await axios.post(`${NODE_API_URL}/api/communication/fetch-all-message`, {
                replyId: dbId,
                studentId: sid,
                forListing: true
            });
            if (response?.data?.statusCode === 200 && response?.data?.data.length > 0) {
                setMessageView(response?.data?.data);
            } else {
                toast.error("No data found.");
                setMessageView([]);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to fetch data. Please try again later.");
            setMessageView([]);
        }
    };
    useEffect(() => {
        if (dbId) {
            Promise.all([
                fetchMainMessage(dbId),
                fetchMainMessageReply(dbId)
            ]).catch((error) => console.error("Error in fetching messages:", error));
        }
    }, [dbId]);

    const handleSubmit = async () => {
        if (!formData.message) {
            toast.error("Please enter message.");
            return;
        }
        try {
            const response = await axios.post(`${NODE_API_URL}/api/communication/reply-message-by-student`, {
                dbId,
                message: formData.message,
                loguserid: sid,
                login_type: 'student'
            });

            if (response?.data?.statusCode === 200 || response?.data?.statusCode === 201) {
                setMessageView((prev) => [
                    ...prev,
                    {
                        id: response.data.data[0].id,
                        message: response.data.data[0].message,
                        created_at: response.data.data[0].createdAt,
                        sentBy: 'student',
                    },
                ]);
                setFormData({ message: "" });

                toast.success("Message sent successfully.");
                fetchMainMessage(dbId);
            } else {
                toast.error("Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again later.");
        }
    }
    const updateStatus = async (dbId) => {
        try {
            await axios.post(`${NODE_API_URL}/api/communication/student/update-seen`, {
                dbId: dbId,
                replySeen: true,
                userType: 'faculty'
            });
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    useEffect(() => {
        if (dbId) {
            updateStatus(dbId);
        }
    }, [messageView, dbId]);
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
                                    <Link to="/admin/cmn-mng-message">
                                        <button className="btn btn-secondary">
                                            <i className="fas fa-plus"></i> Add New
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mx-auto">
                                <div className="chat chat-app">
                                    <div className="chat-content open">
                                        <div className="conversation">
                                            <div className="conversation-wrapper">

                                                <ScrollToBottom
                                                    className="conversation-body"
                                                    style={{
                                                        height: "500px", // Set the height of the scrollable area
                                                        overflowY: "auto",
                                                        display: "flex",
                                                        flexDirection: "column-reverse", // Ensure the scroll focuses on the bottom
                                                    }}
                                                    mode="bottom"
                                                >
                                                    {
                                                        messageListing && messageListing.map((item) => (
                                                            <>
                                                                <div className="msg msg-recipient">
                                                                    {
                                                                        item.sentBy == 'faculty' && (
                                                                            <div className="bubble">
                                                                                <div className="bubble-wrapper mb-0">
                                                                                    <span>{validator.unescape(item.message)}</span>
                                                                                </div>
                                                                                <span>{validator.unescape(item.facultyName)}</span> <span className="font-10">{formatDate(item.created_at)}</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="msg msg-sent">
                                                                    {
                                                                        item.sentBy == 'student' && (
                                                                            <div className="bubble">
                                                                                <div className="bubble-wrapper mb-0">
                                                                                    <span>{validator.unescape(item.message)}</span>
                                                                                </div>
                                                                                <span className="font-10">{formatDate(item.created_at)}</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </>
                                                        ))
                                                    }
                                                    {
                                                        messageView && messageView.map((item) => (
                                                            <>
                                                                <div className="msg msg-recipient">
                                                                    {
                                                                        item.sentBy == 'faculty' && (
                                                                            <div className="bubble">
                                                                                <div className="bubble-wrapper mb-0">
                                                                                    <span>{validator.unescape(item.message)}</span>
                                                                                </div>
                                                                                <span className="font-10">{validator.unescape(item.facultyName)}</span> <span className="font-10">{formatDate(item.created_at)}</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="msg msg-sent">
                                                                    {
                                                                        item.sentBy == 'student' && (
                                                                            <div className="bubble">
                                                                                <div className="bubble-wrapper mb-0">
                                                                                    <span>{validator.unescape(item.message)}</span>
                                                                                </div>
                                                                                <span className="font-10">{formatDate(item.created_at)}</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </>
                                                        ))
                                                    }
                                                    <div style={{ marginTop: '80px' }}></div>
                                                </ScrollToBottom>
                                                <div className="conversation-footer px-2 align-items-center">
                                                    <textarea
                                                        className="chat-input"
                                                        value={formData.message}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                message: e.target.value,
                                                            }))
                                                        }
                                                        id="message"
                                                        name="message"
                                                        style={{
                                                            height: "50px",
                                                            overflowY: "auto",
                                                            maxHeight: "80px",
                                                            width: "95%",
                                                        }}
                                                    />
                                                    <ul className="list-inline d-flex align-items-center m-b-0">
                                                        <li className="list-inline-item">
                                                            <button className="btn btn-primary" onClick={handleSubmit}>
                                                                <i className="far fa-paper-plane" />
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
