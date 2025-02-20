import React, { useEffect } from "react";
import { MdMailOutline } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../site-components/admin/assets/css/SignIn.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import IsStudentoggedIn from "../student/IsStudentoggedIn";
import secureLocalStorage from "react-secure-storage";
import rpnl_logo from "../../site-components/website/assets/Images/rpnl_logo.png";

const Signin = () => {
  const [seconds, setSeconds] = useState();

  const [email, setEmail] = useState("");
  const [otpSend, setOtpSend] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [resendOtp, setResendOtp] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (IsStudentoggedIn()) {
      setRedirect(true)
    }
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmit(true);
    let isValid = true;

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (otpSend && !resendOtp && (!otp || otp.length < 6)) {
      setOtpError("Please Enter Valid OTP");
      isValid = false;
    } else {
      setOtpError("");
    }


    if (!isValid) {
      setTimeout(() => {
        setIsSubmit(false);
      }, 100);
    }

    if (isValid) {
      try {
        const bformData = new FormData();
        bformData.append("sguardianemail", email);
        // bformData.append("user_pass", password);
        if (otpSend && !resendOtp) {
          bformData.append("data", "ParentLogin_ad");
          bformData.append("otp", otp);
        } else {
          bformData.append("data", "ParentLogin_ad");
        }

        const response = await axios.post(
          `${PHP_API_URL}/parent.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data?.status === 200) {
          toast.success(response.data.msg);
          setEmail("");
          setOtp("");

          secureLocalStorage.setItem("studentId", response.data.data.studentid);
          secureLocalStorage.setItem("sguardianemail", response.data.data.sguardianemail);
          secureLocalStorage.setItem("sguardianphone", response.data.data.sguardianphone);
          secureLocalStorage.setItem("registrationNo", response.data.data.sregno);
          secureLocalStorage.setItem("dateTime", response.data.data.dateTime);
          setTimeout(() => {
            setIsSubmit(false);
            navigate("/student");
          }, 300);
        } else if (response.data?.status === 201) {
          setSeconds(60);
          setOtpSend(true);
          setResendOtp(false)
          toast.success("OTP Sent");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        const status = error.response?.data?.status;

        if (status === 400 || status === 500 || status === 401) {
          toast.error(error.response.data.msg || "A server error occurred.");
        } else {
          toast.error(
            "An error occurred. Please check your connection or try again."
          );
        }
      } finally {
        setIsSubmit(false);
      }
    }
  };


  useEffect(() => {
    if (resendOtp) {
      handleSubmit();
    }
  }, [resendOtp]);
  const resendVOTP = (e) => {
    e.preventDefault()
    setResendOtp(true);
  };

  if (redirect) {
    return <Navigate to="/student/home" replace={true} />;  // Redirect to home page if logged in
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />
      <div className="container-fluid p-h-0 p-v-20 bg full-height d-flex">
        <div className="d-flex flex-column justify-content-between w-100">
          <div
            className="container"
            style={{ height: "100vh", display: "grid" }}
          >
            <div className="row align-items-center">
              <div className="col-md-7 col-lg-5 m-h-auto">
                <div className="card shadow-lg">
                  <div className="card-body px-3">
                    <div className="d-flex align-items-center justify-content-between m-b-30">
                      <img
                        className="img-fluid rounded-5"
                        style={{ maxWidth: "30%" }}
                        alt="NLU Logo"
                        src={rpnl_logo}
                      />
                      <h2 className="h4_new">
                        Parent <br />
                        Login
                      </h2>
                    </div>
                    <div className="row">
                      <div className="col-md-12 ml-2">
                        <h3 className="h6_new">Welcome Back!</h3>
                        <p>
                          {!otpSend
                            ? "Enter your registered email"
                            : "Enter OTP"}
                        </p>
                      </div>
                    </div>
                    <form
                      className="pt-2 px-2"
                      id="security_login_form"
                      onSubmit={handleSubmit}
                    >
                      <div className="form-group">
                        <label
                          className="font-weight-semibold"
                          htmlFor="user_email"
                        >
                          Email:
                        </label>
                        <div className="input-affix">
                          <i className="prefix-icon anticon ">
                            <MdMailOutline />
                          </i>
                          <input
                            type="text"
                            name="user_email"
                            className="form-control"
                            id="user_email"
                            placeholder="Email"
                            value={email}
                            disabled={otpSend}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        {emailError && (
                          <small className="text-danger">{emailError}</small>
                        )}
                      </div>

                      {otpSend && (
                        <>


                          <div className="form-group">
                            <label
                              className="font-weight-semibold"
                              htmlFor="otp"
                            >
                              Otp:
                            </label>
                            <div className="input-affix m-b-10">
                              <i className="prefix-icon anticon">
                                <AiOutlineLock />
                              </i>
                              <input
                                type="number"
                                name="otp"
                                className="form-control"
                                id="otp"
                                placeholder="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                              />
                            </div>
                            {otpError && (
                              <small className="text-danger">{otpError}</small>
                            )}
                          </div>
                        </>
                      )}

                      {otpSend &&
                        (seconds > 0 ? (
                          <div className="text-center text-secondary mb-1">
                            OTP is valid for {seconds}
                          </div>
                        ) : (
                          <div className="text-center text-secondary mb-1" style={{ cursor: "pointer" }} onClick={resendVOTP}>
                            Resend OTP
                          </div>
                        ))}

                      <div className="form-group mb-1 px-0">
                        <button
                          disabled={isSubmit}
                          type="submit"
                          className="btn btn-dark d-flex justify-content-center align-items-center btn-block submit_btn"
                          id="signin-btn"
                        >
                          {" "}
                          {!otpSend ? "Continue" : "Verify OTP"}{" "}
                          {isSubmit && (
                            <>
                              &nbsp; <div className="loader-circle"></div>
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
