// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "./Index.css";
import { FormField } from "../../site-components/admin/assets/FormField";
import { toast } from 'react-toastify';
import validator from 'validator';
import axios from "axios";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { Link, Navigate, useNavigate } from "react-router-dom";
import IsStudentoggedIn from "./IsStudentoggedIn";
import HeaderPanel from "./HeaderPanel";
function Index() {
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isSubmit, setIsSubmit] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [btnText, setBtnText] = useState('Request OTP');
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if (IsStudentoggedIn()) {
            setRedirect(true); // Set redirect state if the user is logged in
        }
    }, []);
    const navigate = useNavigate();
    const initialState = {
        enrollmentNo: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        otp: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({ field: '', msg: '' });
    const [timer, setTimer] = useState(60); // Timer for resend OTP countdown
    const sliceLength = (value, length, type) => {
        if (type === 'number') {
            // Extract only the digits and slice them to the specified length
            const newValue = value.replace(/\D+/g, ''); // \D+ removes all non-digit characters
            return newValue.slice(0, length); // Slice the number string to the specified length
        } else {
            // Return the original value if it's not a number
            return value.slice(0, length);
        }
    };
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'phone') {
            value = sliceLength(value, 10, 'number');
        }
        setFormData({
            ...formData,
            [name]: value, // Updating formData state dynamically based on input name.
        });
    };
    // Start the timer when OTP is sent
    useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {

            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsSubmitDisabled(false);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [otpSent, timer]);
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
        if (!formData.enrollmentNo) {
            toast.error("Please enter enrollment number.");
            errorMsg("enrollmentNo", "Please enter enrollment number.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        if (!formData.name) {
            toast.error("Please enter name.");
            errorMsg("name", "Please enter name.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        if (!formData.email) {
            toast.error("Please enter email.");
            errorMsg("email", "Please enter email.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        if (!validator.isEmail(formData.email)) {
            toast.error("Please enter a valid email address.");
            errorMsg("email", "Please enter a valid email address.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        if (!formData.phone) {
            toast.error("Please enter phone number.");
            errorMsg("phone", "Please enter phone number.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        // Regular expression to match Indian phone number (starting with 6, 7, 8, or 9 and exactly 10 digits)
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit Indian phone number.");
            errorMsg("phone", "Please enter a valid 10-digit Indian phone number.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }

        if (!formData.password) {
            toast.error("Please enter password.");
            errorMsg("password", "Please enter password.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        if (!formData.confirmPassword) {
            toast.error("Please enter confirm password.");
            errorMsg("confirmPassword", "Please enter confirm password.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            errorMsg("confirmPassword", "Passwords do not match.");
            setIsSubmitDisabled(false);
            return setIsSubmit(false);
        }
        const sendFormData = new FormData();
        for (let key in formData) {
            sendFormData.append(key, formData[key]);
        }
        sendFormData.append('data', 'savestudentregistration');

        try {
            // submit to the API here
            const response = await axios.post(`${PHP_API_URL}/StudentSet.php`, sendFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data?.status === 200 || response.data?.status === 201) {
                toast.success(response.data.msg);
                setBtnText("Request OTP");
                setIsSubmit(false);
                setIsSubmitDisabled(false);
                setTimeout(() => {
                    navigate('/student/login');
                }, 500);
            } else if (response.data?.status === 205) {
                toast.success(response.data.msg);
                setTimer(60);
                setOtpSent(true);
                setIsSubmit(false);
                setIsSubmitDisabled(false);
                setBtnText("Verify & Register");
            } else {
                toast.error("An error occurred. Please try again.");
                setIsSubmit(false);
                setIsSubmitDisabled(false);
                errorMsg("", "");
            }
        } catch (error) {
            console.error(error);
            const status = error.response?.data?.status;
            setIsSubmit(false);
            setIsSubmitDisabled(false);
            errorMsg("", "");

            if (status === 202 || status === 400 || status === 404 || status === 500) {
                if (status === 202) {
                    setOtpSent(true);
                }
                toast.error(error.response.data.msg || "A server error occurred.");
                if (error.response.data.key) {
                    errorMsg(error.response.data.key, error.response.data.msg);
                }
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    }
    const handleResend = () => {
        handleSubmit(true);
    }
    if (redirect) {
        return <Navigate to="/student/home" replace={true} />;  // Redirect to home page if logged in
    }
    return (
        <div className="container-fluid">
            <HeaderPanel />
            <div className="row">
                <div className="col-md-12 text-center my-3">
                    <h1 className="font-20 fw-bold text-danger blinking-text">Registration for Existing Students Only</h1>
                    <h2 className="font-18">B.A. LLB. (Hons.) / LL.M. / Ph.D.</h2>
                </div>

                <div className="col-md-7 col-12 col-sm-12 col-lg-7 order1">
                    <div className="card mt-0" style={{ borderRadius: "15px" }}>
                        <div className="card-header py-0" style={{ borderRadius: "15px 15px 0 0" }}>
                            <h5 className="card-title py-2 mb-0" style={{ color: '#494e4d' }}>Notifications & Instructions</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                <li className="list-item font-13">Registration on this portal is exclusively for existing students of Dr. Rajendra Prasad National Law University.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 col-12 col-sm-12 col-lg-5 order2">
                    <div className="card mt-0" style={{ borderRadius: "15px" }}>
                        <div className="card-header py-0" style={{ background: '#2C5784', borderRadius: "15px 15px 0 0" }}>
                            <h5 className="card-title py-2 mb-0" style={{ color: '#EDE7E3' }}>Student Registration Portal</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <p className="text-start">Already registered? Click <Link to="/student/login">here</Link> to Log In</p>
                                <div className={`row ${otpSent ? 'd-none' : ''}`}>
                                    <FormField
                                        bottom={true}
                                        borderError={errors.field === 'enrollmentNo'}
                                        errorMessage={errors.field === 'enrollmentNo' && errors.msg}
                                        label="Enrollment No"
                                        required={true} name="enrollmentNo" id="enrollmentNo" value={formData.enrollmentNo} column='col-md-12 form-group' onChange={handleChange} />
                                    <FormField
                                        bottom={true}
                                        borderError={errors.field === 'name'}
                                        errorMessage={errors.field === 'name' && errors.msg}
                                        label="Full Name" required={true} name="name" id="name" value={formData.name} column='col-md-12 form-group' onChange={handleChange} />
                                    <div className="col-md-12">
                                        <p className="font-12">
                                            <strong>Note: </strong>{" "}
                                            <span className="text-danger">
                                                Please enter a correct and valid email address, as all
                                                registration will be sent to this email.
                                            </span>
                                        </p>
                                    </div>
                                    <FormField label="Email"
                                        bottom={true}
                                        borderError={errors.field === 'email'}
                                        errorMessage={errors.field === 'email' && errors.msg}
                                        type="email" required={true} name="email" id="email" value={formData.email} column='col-md-12 form-group' onChange={handleChange} />
                                    <FormField label="Phone No. (10 Digit)"
                                        bottom={true}
                                        borderError={errors.field === 'phone'}
                                        errorMessage={errors.field === 'phone' && errors.msg}
                                        type="email" required={true} name="phone" id="phone" value={formData.phone} column='col-md-12 form-group' onChange={handleChange} />

                                    <FormField label="Password"
                                        bottom={true}
                                        borderError={errors.field === 'password'}
                                        errorMessage={errors.field === 'password' && errors.msg}
                                        type={showPassword ? "text" : "password"} required={true} name="password" id="password" value={formData.password} column='col-md-6 form-group' onChange={handleChange} />
                                    <FormField
                                        bottom={true}
                                        borderError={errors.field === 'confirmPassword'}
                                        errorMessage={errors.field === 'confirmPassword' && errors.msg}
                                        label="Confirm Password" type={showPassword ? "text" : "password"} required={true} name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} column='col-md-6 form-group' onChange={handleChange} />
                                    <div className="col-md-12 form-group">
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
                                                <strong id="captcha-text1">
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
                                    {otpSent && (
                                        <div className={`col-md-12`}>
                                            <div className="row">
                                                <FormField
                                                    bottom={true}
                                                    borderError={errors.field === 'otp'}
                                                    errorMessage={errors.field === 'otp' && errors.msg}
                                                    label="Enter OTP" name="otp" id="otp" value={formData.otp} column='col-md-12 form-group' onChange={handleChange} />
                                                <div className="col-md-12 d-flex justify-content-center align-items-center">
                                                    <p className='mb-3 text-center'>
                                                        OTP not received yet? &nbsp;
                                                        <span
                                                            className={`text-primary ${timer > 0 ? 'disabled' : ''}`}
                                                            onClick={timer <= 0 ? handleResend : null} // Only assign handleSubmit if timer <= 0
                                                            style={{ cursor: timer <= 0 ? 'pointer' : 'not-allowed' }} // Add visual feedback for disabled state
                                                        >
                                                            Resend {timer > 0 ? `In ${timer}s` : ''}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-md-12 form-group mb-0">
                                        <p className="font-12">
                                            <strong>Note: </strong>{" "}
                                            <span className="text-danger">
                                                If the &quot;Request OTP&quot; or &quot;Verify &amp; Register&quot; button is not
                                                enabled, please regenerate the CAPTCHA and verify.
                                            </span>
                                        </p>

                                        <button
                                            type="button" onClick={handleSubmit}
                                            className="btn btn-dark d-flex justify-content-center align-items-center btn-block submit_btn"
                                            disabled={isSubmitDisabled}
                                        >
                                            {btnText}

                                            {isSubmit && (
                                                <>
                                                    &nbsp; <div className="loader-circle"></div>
                                                </>
                                            )}
                                        </button>
                                        <p className="mt-3 text-start">Already registered? Click <Link to="/student/login">here</Link> to Log In</p>
                                        <div className="floating_btn">
                                            <a
                                                target="_blank"
                                                href="https://api.whatsapp.com/send?phone=+919519876699&text=Hello"
                                            >
                                                <div className="contact_icon">
                                                    <i className="fab fa-whatsapp my-float" />
                                                </div>
                                            </a>
                                        </div>
                                        <div className="floating_btn1">
                                            <a target="_blank" href="tel:+918924057222">
                                                <div className="contact_icon1">
                                                    <i className="fas fa-phone my-float" />
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="card mt-0" style={{ borderRadius: "15px" }}>
                        <div className="card-header">
                            <h6 className="card-title" style={{ color: "#F26419" }}>Need Help? Contact Us</h6>
                        </div>
                        <div className="card-body">
                            <p>
                                For any queries, feel free to reach out to us via email at{' '}
                                <a href="mailto:info@rpnlup.ac.in" style={{ color: '#F26419', textDecoration: 'none' }}>
                                    info@rpnlup.ac.in
                                </a>{' '}
                                or call us at:{' '}
                                <a href="tel:+915322990413" style={{ fontWeight: 'bold' }}>+91-532-2990413</a>,{' '}
                                <a href="tel:+915322990414" style={{ fontWeight: 'bold' }}>+91-532-2990414</a>,{' '}
                                <a href="tel:+915322990415" style={{ fontWeight: 'bold' }}>+91-532-2990415</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
