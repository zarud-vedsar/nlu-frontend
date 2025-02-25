// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { FormField } from "../../site-components/admin/assets/FormField";
import { toast } from 'react-toastify';
import axios from "axios";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { Link, Navigate, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import IsStudentoggedIn from "./IsStudentoggedIn";
import HeaderPanel from "./HeaderPanel";
import ContactIcon from "../../site-components/website/home-components/ContactIcon";
import './Index.css';
import { IoMdArrowRoundBack, IoMdHome } from "react-icons/io";
function Index() {
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if (IsStudentoggedIn()) {
            setRedirect(true); // Set redirect state if the user is logged in
        }
    }, []);
    const navigate = useNavigate();
    const initialState = {
        serid: '',
        password: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({ field: '', msg: '' });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const generateRandomCaptcha = (length = 8) => {
        return Array.from({ length }, () =>
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(
                Math.floor(Math.random() * 62)
            )
        ).join("");
    };

    useEffect(() => {
        const newCaptcha = generateRandomCaptcha();
        setCaptcha(newCaptcha);
    }, []);
    const handleShowHidePassword = () => setShowPassword(!showPassword);
    const handleCaptchaInput = e => {
        setCaptchaInput(e.target.value);
        if (e.target.value === captcha) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    };

    const handleNewCaptcha = () => {
        const newCaptcha = generateRandomCaptcha();
        setCaptcha(newCaptcha);
        setCaptchaInput("");
        setIsSubmitDisabled(true);
    };
    const errorMsg = (field, value) => {
        setErrors((prev) => ({ ...prev, field: field, msg: value }));
    }
    const handleSubmit = async () => {
        errorMsg("", "");
        setIsSubmit(true);
        setIsSubmitDisabled(true);
        if (!formData.serid) {
            toast.error("Please enter enrollment number, email, or phone.");
            errorMsg("serid", "Please enter enrollment number, email, or phone.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        if (!formData.password) {
            toast.error("Please enter password.");
            errorMsg("password", "Please enter password.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        const sendFormData = new FormData();
        for (let key in formData) {
            sendFormData.append(key, formData[key]);
        }
        sendFormData.append('data', 'savelogin');

        try {
            // submit to the API here
            const response = await axios.post(`${PHP_API_URL}/StudentSet.php`, sendFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data?.status === 200) {
                toast.success(response.data.msg);
                if (Object.keys(response.data.data).length > 0) {
                    secureLocalStorage.setItem("studentId", response.data.data.studentId);
                    secureLocalStorage.setItem("registrationNo", response.data.data.registrationNo);
                    secureLocalStorage.setItem("dateTime", response.data.data.dateTime);
                    setTimeout(() => {
                        navigate('/student/home');
                        window.location.reload();
                    }, 500);
                } else {
                    toast.error("Invalid credentials.");
                }

            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const status = error.response?.data?.status;
            errorMsg("", "");
            if (status === 400 || status === 401 || status === 500) {
                toast.error(error.response.data.msg || "A server error occurred.");
                if (error.response.data.key) {
                    errorMsg(error.response.data.key, error.response.data.msg);
                }
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        } finally {
            setIsSubmit(false);
            setIsSubmitDisabled(false);
        }
    }
    if (redirect) {
        return <Navigate to="/student/home" replace={true} />;  // Redirect to home page if logged in
    }
    return (
        <div className="container-fluid">
            <HeaderPanel />
            <div className="row mb-4">

                <div className="col-md-12 col-12 col-sm-12 col-lg-12 order2 fixedwidthsLogin ">
                    <div className="col-md my-3">
                        <div className="backbtn btn" onClick={() => window.history.back()}>
                            <IoMdArrowRoundBack /> Back
                        </div>
                        <Link to="/" className="backbtn1 btn" >
                            <IoMdHome /> Home
                        </Link>
                        <h2 className="font-18 mt-5">B.A. LLB. (Hons.) / LL.M. / Ph.D.</h2>
                    </div>
                    <div className="card mt-0" style={{ borderRadius: "15px" }}>
                        <div className="card-header py-0" style={{ background: '#000000', borderRadius: "15px 15px 0 0" }}>
                            <h5 className="card-title py-2 mb-0" style={{ color: '#EDE7E3' }}>Student Login  Portal</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="row">
                                    <FormField
                                        bottom={true}
                                        borderError={errors.field === 'serid'}
                                        errorMessage={errors.field === 'serid' && errors.msg}
                                        label="Enrollment No/Email Address/Phone No"
                                        required={true} name="serid" id="serid" value={formData.serid} column='col-md-12 form-group' onChange={handleChange} />

                                    <FormField label="Password"
                                        bottom={true}
                                        borderError={errors.field === 'password'}
                                        errorMessage={errors.field === 'password' && errors.msg}
                                        type={showPassword ? "text" : "password"} required={true} name="password" id="password" value={formData.password} column='col-md-12 form-group' onChange={handleChange} />
                                    <div className="col-md-12 form-group">
                                        <p className="text-right">Forgot Password? <Link to="/student/forgot">Reset It Securely</Link></p>
                                        <div className="checkbox">
                                            <input
                                                id="showhidepass"
                                                type="checkbox"
                                                checked={showPassword}
                                                onChange={handleShowHidePassword}
                                            />
                                            <label htmlFor="showhidepass">
                                                {showPassword ? "Hide Password" : "Show Password"}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-md-12 form-group">
                                        <label className="font-weight-semibold" htmlFor="captcha1">
                                            CAPTCHA:
                                        </label>
                                        <div className="input-affix d-flex justify-content-between align-items-center">
                                            <input
                                                type="text"
                                                name="captcha1"
                                                style={{ width: "60%" }}
                                                className="form-control"
                                                placeholder="Enter CAPTCHA"
                                                value={captchaInput}
                                                onChange={handleCaptchaInput}
                                            />
                                            <div>
                                                <strong id="captcha-text1"
                                                 style={{
                                                    userSelect: "none",
                                                    WebkitUserSelect: "none",
                                                    MozUserSelect: "none",
                                                    msUserSelect: "none"
                                                }}
                                                onSelect={() => false}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onCopy={(e) => {
                                                    e.preventDefault();
                                                    
                                                }}
                                                onContextMenu={(e) => e.preventDefault()}
                                                >
                                                    {captcha}
                                                </strong>
                                                <button
                                                    type="button"
                                                    className="btn ml-1 btn-md btn-white shadow-none border-0"
                                                    id="newcpatcha1"
                                                    onClick={handleNewCaptcha}
                                                >
                                                    <i className="fas fa-sync-alt" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-12 form-group mb-0">
                                        <button
                                            type="button" onClick={handleSubmit}
                                            className="submitsbutton"
                                            disabled={isSubmitDisabled}
                                        >
                                            Log In
                                            {isSubmit && (
                                                <>
                                                    &nbsp; <div className="loader-circle"></div>
                                                </>
                                            )}
                                        </button>
                                        <p className="mt-3 text-start">New Registration? Click <Link to="/student/register">here</Link></p>
                                        <ContactIcon />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;