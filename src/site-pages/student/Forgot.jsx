// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "./Index.css";
import { FormField } from "../../site-components/admin/assets/FormField";
import { toast } from 'react-toastify';
import axios from "axios";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { Link, useNavigate } from "react-router-dom";
import HeaderPanel from "./HeaderPanel";
import { IoMdArrowRoundBack, IoMdHome } from "react-icons/io";
function Forgot() {
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [btnText, setBtnText] = useState('Request OTP');

  const navigate = useNavigate();
  const initialState = {
    serid: '',
    otp: '',
    password: '',
    confirmPassword: ''
  };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({ field: '', msg: '' });
  const [timer, setTimer] = useState(5); // Timer for resend OTP countdown
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
    sendFormData.append('data', 'forgotpassword');

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
        setBtnText("Verify & Change Password");
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
  return (
    <div className="container-fluid">
      <HeaderPanel />
      <div className="row mt-3">
        <div className="col-md-5 col-12 col-sm-12 col-lg-5 mx-auto">
          <div className="backbtn btn" onClick={() => window.history.back()}>
            <IoMdArrowRoundBack /> Back
          </div>
          <Link to="/" className="backbtn1 btn" >
            <IoMdHome /> Home
          </Link>
          <div className="card mt-5" style={{ borderRadius: "15px" }}>
            <div className="card-header py-0" style={{ background: '#000000', borderRadius: "15px 15px 0 0" }}>
              <h5 className="card-title py-2 mb-0" style={{ color: '#EDE7E3' }}>Forgot Password?</h5>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className={`row ${otpSent ? 'd-none' : ''}`}>
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
                    <button
                      type="button" onClick={handleSubmit}
                      className="submitsbutton"
                      disabled={isSubmitDisabled}
                    >
                      {btnText}
                      {isSubmit && (
                        <>
                          &nbsp; <div className="loader-circle"></div>
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-start">Need to sign in? <Link to="/student/login">Go to Login Page</Link></p>
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

export default Forgot;
