// Import the usual suspects (like a hacker assembling a team for a heist)
import React, { useEffect, useRef, useState } from 'react'; // React is life; state is chaos.
import { Link, useLocation } from 'react-router-dom'; // For navigating the matrix.
import { capitalizeAllLetters, dataFetchingPost, goBack } from '../../../site-components/Helper/HelperFunction'; // Escape hatch in case things go south.
import { NODE_API_URL } from "../../../site-components/Helper/Constant"; // The secret base URL we talk to.
import validator from 'validator'; // Validating like a pro, no shady inputs allowed.
import { toast } from 'react-toastify'; // Toasts: because why suffer in silence when you can pop a notification?
import secureLocalStorage from 'react-secure-storage'; // Encryption? Check. Security? Double-check.
import axios from 'axios'; // Axios is like the courier for your HTTP requests.
import Swal from 'sweetalert2';
import "./examPaper.css";
import rpnl_logo from "../../../site-components/website/assets/Images/rpnl_logo.png";
import { useReactToPrint } from "react-to-print";

function AddExam() {
    const location = useLocation();
    const dbId = location?.state?.dbId; // Destructure dbId from the state
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    // State variables: The true chaos handlers.
    const [formData, setFormData] = useState([]); // For holding all the exam data.
    // Fetch and set the semester list based on the selected course

    // Fetch the data for the list
    const fetchDataForUpdate = async (dbId) => {
        if (!dbId || parseInt(dbId, 10) < 1) {
            toast.error("Invalid exam id");
            return false;
        }
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/exam/paper/list`,
                { dbId }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                setFormData(response.data[0]);
            } else {
                toast.error("Data not found.");
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
    };
    const [questionForm, setQuestionForm] = useState([]);
    const fetchSavedQuestion = async () => {
        try {
            const { data } = await axios.post(
                `${NODE_API_URL}/api/exam/paper/question-list`,
                { examId: dbId }
            );
            if (data?.statusCode === 200 && data.data.length) {
                setQuestionForm(JSON.parse(data.data[0].questions));
            }
        } catch (error) {
            console.error("Error fetching saved questions", error);
        }
    };

    const handleUpdate = async (dbId) => {
        if (!dbId || parseInt(dbId, 10) < 1) {
            toast.error("Invalid exam id");
            return false;
        }
        try {
            const { value: password } = await Swal.fire({
                title: "Enter Password to Edit Exam Details",
                input: "password", // Updated input type to "password"
                inputLabel: "Password",
                inputPlaceholder: "Enter your password",
                showCancelButton: true, // Optionally allow the user to cancel the action
            });
            if (password) {
                const { data } = await axios.post(
                    `${NODE_API_URL}/api/exam/paper/checkpass`,
                    {
                        dbId,
                        password,
                        loguserid: secureLocalStorage.getItem("login_id"),
                        login_type: secureLocalStorage.getItem("loginType"),
                    }
                );
                // Handle success or failure
                if ([200].includes(data?.statusCode)) {
                    toast.success(data.message);
                    fetchDataForUpdate(dbId);
                    fetchSavedQuestion(dbId);
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            } else {
                Swal.fire("Password is required to proceed.");
            }
        } catch (error) {
            // Handle different error types
            const errorMessage =
                error?.response?.data?.message || "A server error occurred.";
            toast.error(errorMessage);
            Swal.fire(errorMessage);
        }
    };
    useEffect(() => {
        if (dbId && parseInt(dbId, 10) > 0) {
            handleUpdate(dbId);
        }
    }, [dbId]);

    function formatExamDate(date) {
        const parsedDate = new Date(date); // Parse the date
        const day = parsedDate.getDate(); // Get the day
        const month = parsedDate.toLocaleString('en-US', { month: 'short' }); // Get the short month name (e.g., "Nov")
        return `.${month}.${day}`; // Format as ".Nov.24"
    }
    function getMonth(date) {
        const parsedDate = new Date(date);
        return parsedDate.toLocaleString('en-US', { month: 'short' }); // Example: "Nov"
    }

    function getYear(date) {
        const parsedDate = new Date(date);
        return parsedDate.getFullYear(); // Example: 2024
    }
    return (
        <>
            {/* HTML Skeleton of Doom */}
            <div className="page-container">
                <div className="main-content">
                    <div className="container-fluid">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                {/* Breadcrumbs: because getting lost is easy */}
                                <nav className="breadcrumb breadcrumb-dash">
                                    <Link to="/admin/" className="breadcrumb-item">
                                        <i className="fas fa-home m-r-5" />
                                        Announcement
                                    </Link>
                                    <span className="breadcrumb-item">Exam Management</span>
                                    <span className="breadcrumb-item active">
                                        Exam Paper
                                    </span>
                                </nav>
                            </div>
                        </div>
                        {/* Main Content Starts Here */}
                        <div className="card border-0 bg-transparent mb-0">
                            <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
                                <h5 className="card-title h6_new font-16">
                                    Exam Paper
                                </h5>
                                <div className='ml-auto'>
                                    <button className="btn goback" onClick={goBack}>
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <button onClick={() => reactToPrintFn()} className="btn btn-primary ml-2">
                                        <i className="fas fa-print"></i> Print
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div id="hello" className="container-page" ref={contentRef}>
                                    <div className="id-inner-container">
                                        <div className="id-header-wrapper">
                                            <div>
                                                <img src={rpnl_logo} alt="" className="id-header-img" />
                                            </div>
                                            <div className="id-header-content">
                                                <h4>{validator.unescape("Dr. Rajendra Prasad")}</h4>
                                                <h3>{validator.unescape("National Law University, Prayagraj")}</h3>
                                                <hr />
                                            </div>
                                        </div>
                                        <div className="id-text-title-right">
                                        RPNLUP/{validator.unescape(`${formData?.examType == 'end-term' ? 'ET' : 'MT'} EXAMINATION`)}
                                            {validator.unescape(`/${formData?.semtitle ? capitalizeAllLetters(formData?.semtitle) : formData?.semtitle}`)} {" "}
                                            {formData?.examDate ? formatExamDate(formData.examDate) : ""} {" "}
                                            {validator.unescape(`${formData?.subject}/${formData?.paperCode}`)}
                                        </div>
                                        <div className="id-title">
                                            {validator.unescape(`${formData?.examType == 'end-term' ? 'END TERM' : 'MID TERM'} EXAMINATION`)}{" "}
                                            {formData?.examDate ? getMonth(formData.examDate) : ""}, {formData?.examDate ? getYear(formData.examDate) : ""}
                                        </div>
                                        <div className="id-info">
                                            <span>{validator.unescape("Roll No.")}</span>
                                            <div>
                                                {validator.unescape(`Time Duration - ${formData?.timeDuration}`)} &nbsp;&nbsp;
                                                <br />
                                                {validator.unescape(`Max-Marks - ${formData?.maxMarks}`)}
                                            </div>
                                        </div>
                                        <div className="id-paper-subject">
                                            <div>
                                                <strong>
                                                    {validator.unescape(`PAPER – ${formData?.subject}, PAPER CODE: ${formData?.paperCode}`)}
                                                </strong>
                                            </div>
                                            <div className='ss'>
                                                {validator.unescape(`SEMESTER: ${formData?.semtitle ? capitalizeAllLetters(formData?.semtitle) : formData?.semtitle}`)}
                                            </div>
                                        </div>
                                        <div className="instructions">
                                            <div
                                                style={{
                                                    wordBreak: "break-word",
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: formData?.instruction
                                                        ? validator.unescape(validator.unescape(formData?.instruction))
                                                        : "",
                                                }}
                                            ></div>
                                        </div>
                                        {JSON.parse(formData?.section || "[]").map((item, index) => (
                                            <div className="section" key={index}>
                                                <h3>{validator.unescape(`SECTION-${item.title}`)}</h3>
                                                <p className="id-marks-right">
                                                    {validator.unescape(
                                                        `Total: ${item.marksPerQuestion} x ${item.attemptQuestion} = ${item.marksPerQuestion * item.attemptQuestion
                                                        } Marks`
                                                    )}
                                                </p>
                                                <div
                                                    style={{
                                                        wordBreak: "break-word",
                                                        whiteSpace: "normal",
                                                        wordWrap: "break-word",
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: validator.unescape(
                                                            validator.unescape(
                                                                questionForm.find(
                                                                    (section) => section.title === item.title
                                                                )?.question || ""
                                                            )
                                                        ),
                                                    }}
                                                ></div>
                                            </div>
                                        ))}
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

export default AddExam;