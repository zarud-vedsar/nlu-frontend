import React, { useEffect } from "react";
import { MdMailOutline } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import "../../site-components/admin/assets/css/SignIn.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../site-components/admin/assets/css/SignIn.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import IsAdminLoggedIn from "./IsAdminLoggedIn";
import { Link } from "react-router-dom";

const SignInFaculty = () => {

  const [seconds, setSeconds] = useState(0);
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(true);
  const [resendOtp, setResendOtp] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
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
    if (IsAdminLoggedIn()) {
      
      setRedirect(true);
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

    if (!verified && !resendOtp && (!otp || otp.length < 6)) {
      setOtpError("Please Enter Valid OTP");
      console.log("Please Enter Valid OTP");
      isValid = false;
    } else {
      setOtpError("");
    }

    // Validate password
    if (!password && !resendOtp) {
      setPasswordError("Please enter your password");
      isValid = false;
    } else {
      setPasswordError("");
    }
    if (!isValid) {
      setTimeout(() => {
        setIsSubmit(false);
      }, 100);
    }
    if (isValid) {
      try {
        // submit to the API here
        const bformData = new FormData();
        bformData.append("user_email", email);
        bformData.append("user_pass", password);
        bformData.append("data", "userLogin_ad");

        if (!verified && !resendOtp) {
          bformData.append("otp", otp);
        }
        console.log(bformData);
        for (let [key, value] of bformData) {
          console.log(key, value);
        }
        const response = await axios.post(
          `${PHP_API_URL}/faculty.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        if (response.data?.status === 200) {
          toast.success(response.data.msg);
          console.log(response.data);
          secureLocalStorage.setItem("login_id", response.data.data[0].id);
          secureLocalStorage.setItem("email", response.data.data[0].u_email);
          secureLocalStorage.setItem("role_id", response.data.data[0].role);
          secureLocalStorage.setItem("loginType", "faculty");

          const login_id = secureLocalStorage.getItem("login_id");

          if (!login_id) {
            toast.error("User not found.");
            return;
          }
          navigate("/admin/home");
        } else if (response.data?.status === 201) {
          setSeconds(60);
          setResendOtp(false);
          setVerified(false);
          toast.success("OTP Sent");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
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

  if (redirect) {
    navigate("/admin/home")

    // return <Navigate to="/admin/home" replace={true} />; 
  }

  useEffect(() => {
    if (resendOtp) {
      handleSubmit();
    }
  }, [resendOtp]);
  const resendVOTP = (e) => {
    e.preventDefault();
    setResendOtp(true);
  };

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
                        src="https://www.rpnlup.ac.in/wp-content/themes/rpnlup/assets/img/rpnlup_logo_glow.png"
                      />
                      <h2 className="h4_new">Sign In</h2>
                    </div>
                    <div className="row">
                      <div className="col-md-12 ml-2">
                        <h3 className="h6_new">Welcome Back!</h3>
                        <p>Enter your credentials for login</p>
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
                            disabled={!verified}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        {emailError && (
                          <small className="text-danger">{emailError}</small>
                        )}
                      </div>

                      {!verified && (
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
                                type="otp"
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

                      {verified && (
                        <div className="form-group">
                          <label
                            className="font-weight-semibold"
                            htmlFor="user_pass"
                          >
                            Password:
                          </label>
                          <div className="input-affix m-b-10">
                            <i className="prefix-icon anticon">
                              <AiOutlineLock />
                            </i>
                            <input
                              type="password"
                              name="user_pass"
                              className="form-control"
                              id="user_pass"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          {passwordError && (
                            <small className="text-danger">
                              {passwordError}
                            </small>
                          )}
                        </div>
                      )}
                      {!verified &&
                        (seconds > 0 ? (
                          <div className="text-center text-secondary mb-1">
                            OTP is valid for {seconds}
                          </div>
                        ) : (
                          <div
                            className="text-center text-secondary mb-1"
                            onClick={resendVOTP}
                          >
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
                          {verified ? "Continue" : "Sign In"}{" "}
                          {isSubmit && (
                            <>
                              &nbsp; <div className="loader-circle"></div>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    {verified && (
                      <Link to="/admin/forget-password">
                        <div className="text-center text-secondary mb-3">
                          Forget Password
                        </div>
                      </Link>
                    )}
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

export default SignInFaculty;
