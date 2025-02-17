import React, { useState, useEffect } from "react";
import axios from "axios";
import { PHP_API_URL } from "../../../site-components/Helper/Constant";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../site-components/website/assets/css/ApplicationForm.css";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { FaAngleRight, FaRegUser } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";

const ApplicationForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSend, setOtpSend] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);
  const getJobDetails = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getJobById");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        const jobData = response?.data?.data[0];
        if (jobData) {
          setJobDetails(jobData);
        }
      }
    } catch (error) { /* empty */ }
  };

  useEffect(() => {
    if (id) {
      getJobDetails();
    }
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.error("Please agree with terms and conditions")

      return;
    }

    setIsSubmit(true)

    let isValid = true;
    if (!name) {
      setErrorMessage("Please enter name");
      toast.error("Please enter name");
      return setIsSubmit(false);
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email");
      toast.error("Please enter a valid email");
      return setIsSubmit(false);
    }

    try {
      const formData = new FormData();
      formData.append("data", "job_apply_email_verification");
      formData.append("name", name);
      formData.append("email", email);
      formData.append("job_id", id);

      if (otpSend) {
        formData.append("otp", otp);
      }
      const response = await axios.post(
        `${PHP_API_URL}/jobApplication.php`,
        formData
      );
      if (response?.data?.status === 201) {
        setOtpSend(true);
        setSeconds(60);
        toast.success(response?.data?.msg);
      } else if (response?.data?.status === 200) {
        localStorage.setItem("email", response?.data?.data?.email);
        localStorage.setItem("jobid", response?.data?.data?.jobid);
        localStorage.setItem("name", response?.data?.data?.name);
        navigate(`/job/apply/${id}`);
      }
    } catch (error) {
      if (error?.response?.data?.status === 400) {
        toast.error(error?.response?.data?.msg);
      }
    } finally {
      setIsSubmit(false);
    }
  };

  const resendVOTP = async () => {
    setResendOtp(true);
    let isValid = true;
    if (!name) {
      setErrorMessage("Please enter name");
      toast.error("Please enter name");
      isValid = false;
    } else if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email");
      toast.error("Please enter a valid email");
      isValid = false;
    }

    if (isValid) {
      try {
        const formData = new FormData();
        formData.append("data", "job_apply_email_verification");
        formData.append("name", name);
        formData.append("email", email);
        formData.append("job_id", id);

        const response = await axios.post(
          `${PHP_API_URL}/jobApplication.php`,
          formData
        );

        if (response?.data?.status === 201) {
          setSeconds(60);
          toast.success(response?.data?.msg);
        }
      } catch (error) {
      } finally {
        setResendOtp(false);
      }
    }
  };

  if (otpSend) {
    return (
      <>
        <div className="breadcrumb-banner-area">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="breadcrumb-text">
                  <h1 className="heading-primary2 butler-regular text-white text-center">Application Form - {jobDetails?.position}</h1>
                  <div className="breadcrumb-bar">
                    <ul className="breadcrumb text-center">
                      <li><Link to="/">Home</Link></li> <FaAngleRight />
                      <li>Career</li> <FaAngleRight />
                      <li>{jobDetails?.position}</li> <FaAngleRight />
                      <li>Application Form</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="section bg-f5">
          <div className="container">
            <div className="row">
              <div className="col-md-5 col-lg-5 col-12 col-sm-12 mx-auto">
                <div className="card border-0 bg-white" style={{ width: '100%', maxWidth: '100%' }}>
                  <div className="card-body">
                    <h2 className="heading-primary2 butler-regular">OTP Verification</h2>
                    <p className="heading-para gorditas-regular">
                      Enter the verification code to confirm your identity and complete your application.
                    </p>
                    <form onSubmit={handleSubmit} className="otp-form">
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => (
                          <input className="otp-input" {...props} />
                        )}
                      />
                      {seconds > 0 ? (
                        <div className="text-center text-secondary mb-1">
                          OTP is valid for {seconds} seconds
                        </div>
                      ) : (
                        <div
                          className="text-center text-secondary mb-1 link-secondary"
                          onClick={resendVOTP}
                          style={{ color: resendOtp ? "red" : "blue", cursor: "pointer" }}
                        >
                          {resendOtp ? "Wait before Resending OTP" : "Resend OTP"}
                        </div>
                      )}
                      <button type="submit" style={{ minHeight: '48px' }}
                        className="btn btn-primary py-2 border-primary w-100" disabled={isSubmit}>
                        {isSubmit ? 'Sending...' : 'Verify OTP'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">Application Form - {jobDetails?.position}</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link></li> <FaAngleRight />
                    <li>Career</li> <FaAngleRight />
                    <li>{jobDetails?.position}</li> <FaAngleRight />
                    <li>Application Form</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section bg-f5">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-lg-5 col-12 col-sm-12 mx-auto">
              <div className="card border-0 bg-white" style={{ width: '100%', maxWidth: '100%' }}>
                <h2 className="heading-primary2 butler-regular">Application Form - {jobDetails?.position}</h2>
                <div className="card-body">
                  <p className="heading-para gorditas-regular mb-2">
                    .                    Get started easily! Apply for jobs with just your email—no account required!
                  </p>
                  <form onSubmit={handleSubmit} className="application-form">
                    <div className="row">
                      <div className="col-md-12 mb-18 text-start">
                        <label className="heading-para mb-1">Name</label>
                        <div className="form-group-custom">
                          <span className="form-custom-icon">
                            <FaRegUser />
                          </span>
                          <input
                            name="name"
                            id="name"
                            type="text"
                            className="form-custom-input"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 mb-18 text-start">
                        <label className="heading-para mb-1">Email</label>
                        <div className="form-group-custom">
                          <span className="form-custom-icon">
                            <MdOutlineMailOutline />
                          </span>
                          <input
                            name="email"
                            id="email"
                            type="email"
                            className="form-custom-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 mb-3 d-flex align-items-center" >
                        <input
                          type="checkbox"
                          id="agree"
                          value={agree}
                          onChange={(e) => setAgree((pre) => !pre)}
                          style={{ width: "20px" }}
                        />
                        <span>I agree with the <a href="" style={{ color: "#0d6efd" }} >terms and conditions</a></span>
                      </div>
                      <div className="col-md-12">
                        <button type="submit" style={{ minHeight: '48px' }}
                          className="btn btn-primary py-2 border-primary w-100" disabled={isSubmit}>
                          {isSubmit ? 'Sending...' : 'Send OTP'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
