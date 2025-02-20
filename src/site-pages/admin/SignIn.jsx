/* eslint-disable no-unused-vars */
import React, { lazy, useEffect } from "react";
import { MdMailOutline } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import "../../site-components/admin/assets/css/SignIn.css"
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import '../../site-components/admin/assets/css/SignIn.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import IsAdminLoggedIn from "./IsAdminLoggedIn";
import rpnl_logo from "../../site-components/website/assets/Images/rpnl_logo.png";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [redirect, setRedirect] = useState(false);  // Add a state to handle redirection
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (IsAdminLoggedIn()) {
      setRedirect(true); // Set redirect state if the user is logged in
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true)
    let isValid = true;

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else {
      setPasswordError('');
    }
    if (!isValid) {
      setTimeout(() => {
        setIsSubmit(false);
      }, 100);
    }
    if (isValid) {
      try {
        // submit to the API here
        const response = await axios.post(
          `${NODE_API_URL}/api/super-fast/har-super-admin/login`,
          {
            email,
            password,
          }
        );
        if (response.data?.statusCode === 200) {
          toast.success(response.data.message);
          secureLocalStorage.setItem('login_id', response.data.data.id);
          secureLocalStorage.setItem('email', response.data.data.email);
          secureLocalStorage.setItem('loginType', 'superadmin');
          const login_id = secureLocalStorage.getItem('login_id');
          if (!login_id) {
            toast.error("User not found.");
            return;
          }
          navigate('/admin/home');
          window.location.reload(); // This will force a page reload
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        const statusCode = error.response?.data?.statusCode;

        if (statusCode === 400 || statusCode === 500 || statusCode === 401) {
          toast.error(error.response.data.message || "A server error occurred.");
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
    return <Navigate to="/admin/home" replace={true} />;  // Redirect to home page if logged in
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
      <div className="container-fluid p-h-0 p-v-20 bg full-height d-flex bg_light">
        <div className="d-flex flex-column justify-content-between w-100">
          <div className="container" style={{ height: "100vh", display: "grid" }}>
            <div className="row align-items-center">
              <div className="col-md-7 col-lg-5 m-h-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between m-b-30">
                      <img
                        className="img-fluid rounded-5"
                        style={{ maxWidth: "30%" }}
                        alt="NLU Logo"
                        src={rpnl_logo}
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
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        {emailError && <small className="text-danger">{emailError}</small>}
                      </div>

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
                        {passwordError && <small className="text-danger">{passwordError}</small>}
                      </div>
                      <div className="form-group mb-0">
                        <button
                          disabled={isSubmit}
                          type="submit"
                          className="btn btn-dark py-2 d-flex justify-content-center align-items-center btn-block"
                        >
                          Sign In{" "}
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

export default SignIn;
