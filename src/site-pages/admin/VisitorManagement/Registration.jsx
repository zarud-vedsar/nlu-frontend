import React, { useEffect, useState,useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import {
  FormField,
  TextareaField,
} from "../../../site-components/admin/assets/FormField";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import validator from "validator";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Select from "react-select";
function Registration() {
  const { dbId } = useParams();
    const [previewImage, setPreviewImage] = useState();
    const [preGovernmentProofPhoto, setPreGovernmentProofPhoto] = useState();
  const initialData = {
    visitorName: "",
    visitorEmail: "",
    visitorPhone: "",
    visitorType: "",
    visitorPurpose: "",
    governmentIdProofType: "",
    governmentIdProofNo: "",
    dateOfArrival: "",
    dateOfDeparture: "",
    timeOfArrival: "",
    timeOfDeparture: "",
    hostDetails: "",
    photo: "",
    governmentProofPhoto: "",
    photoUrl: null,
    governmentProofPhotoUrl: null,
  };
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state

  const visitorType = [
    {
      value: "Prospective Students",
      label: "Prospective Students",
    },
    {
      value: "Parents/Guardians",
      label: "Parents/Guardians",
    },
    { value: "Alumni", label: "Alumni" },
    { value: "Vendors", label: "Vendors" },
    { value: "Contractors", label: "Contractors" },
    {
      value: "Guest Lecturers",
      label: "Guest Lecturers",
    },
    { value: "Researchers", label: "Researchers" },
    {
      value: "Event Attendees",
      label: "Event Attendees",
    },
    { value: "Job Recruiters", label: "Job Recruiters" },
    {
      value: "Government Officials",
      label: "Government Officials",
    },
    {
      value: "Media Personnel",
      label: "Media Personnel",
    },
    { value: "Collaborators", label: "Collaborators" },
    {
      value: "Friends/Family of Students/Staff",
      label: "Friends/Family of Students/Staff",
    },
    {
      value: "Emergency Responders",
      label: "Emergency Responders",
    },
    {
      value: "General Visitors",
      label: "General Visitors",
    },
    {
      value: "Admissions Interviewees",
      label: "Admissions Interviewees",
    },
    {
      value: "Research Participants",
      label: "Research Participants",
    },
    { value: "Auditors", label: "Auditors" },
    { value: "Donors", label: "Donors" },
    {
      value: "Event Organizers",
      label: "Event Organizers",
    },
    { value: "Sponsors", label: "Sponsors" },
    {
      value: "Delivery Personnel",
      label: "Delivery Personnel",
    },
    {
      value: "International Delegates",
      label: "International Delegates",
    },
    {
      value: "Exchange Students",
      label: "Exchange Students",
    },
    {
      value: "Facility Inspectors",
      label: "Facility Inspectors",
    },
    {
      value: "Internship Supervisors",
      label: "Internship Supervisors",
    },
    {
      value: "Non-Profit Representatives",
      label: "Non-Profit Representatives",
    },
    {
      value: "Campus Tour Groups",
      label: "Campus Tour Groups",
    },
    {
      value: "Retired Staff or Faculty",
      label: "Retired Staff or Faculty",
    },
    {
      value: "Technology Vendors",
      label: "Technology Vendors",
    },
    {
      value: "Academic Advisors",
      label: "Academic Advisors",
    },
    {
      value: "Career Counselors",
      label: "Career Counselors",
    },
    {
      value: "Community Members",
      label: "Community Members",
    },
    {
      value: "Health and Wellness Providers",
      label: "Health and Wellness Providers",
    },
    { value: "Legal Advisors", label: "Legal Advisors" },
    {
      value: "Student Organization Guests",
      label: "Student Organization Guests",
    },
    {
      value: "Conference Speakers",
      label: "Conference Speakers",
    },
    {
      value: "Performers/Artists",
      label: "Performers/Artists",
    },
    {
      value: "Sports Teams (Visiting Teams)",
      label: "Sports Teams (Visiting Teams)",
    },
    {
      value: "Academic Accreditation Teams",
      label: "Academic Accreditation Teams",
    },
  ];

  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (!formData.visitorType) {
      errorMsg("visitorType", "Visitor Type is required.");
      toast.error("Visitor Type is required.");
      return setIsSubmit(false);
    }
    if (!formData.visitorName) {
      errorMsg("Visitor Name", "Name is required.");
      toast.error("Name is required.");
      return setIsSubmit(false);
    }
    if (!formData.visitorPhone) {
      errorMsg("visitorPhone", "visitor phone Number is required.");
      toast.error("visitorPhone Number is required.");
      return setIsSubmit(false);
    }
    if (!formData.visitorEmail) {
      errorMsg("visitorEmail", "Email is required.");
      toast.error("Email is required.");
      return setIsSubmit(false);
    }
    if (!formData.visitorPurpose) {
      errorMsg("visitorPurpose", "Purpose is required.");
      toast.error("Purpose is required.");
      return setIsSubmit(false);
    }
    if (!formData.dateOfArrival) {
      errorMsg("visit_in_date", "Visit In Date is required.");
      toast.error("Visit In Date is required.");
      return setIsSubmit(false);
    }
    if (!formData.timeOfArrival) {
      errorMsg("time_in", "Time In is required.");
      toast.error("Time In is required.");
      return setIsSubmit(false);
    }
    if (!formData.governmentIdProofType) {
      errorMsg("governmentIdProofType", "governmentIdProofType is required.");
      toast.error("governmentIdProofType) is required.");
      return setIsSubmit(false);
    }
    if (!formData.governmentIdProofNo) {
      errorMsg("governmentIdProofNo", "governmentIdProofNo is required.");
      toast.error("governmentIdProofNo is required.");
      return setIsSubmit(false);
    }
   
    if (!formData.hostDetails) {
      errorMsg("hostDetails", "hostDetails is required.");
      toast.error("hostDetails is required.");
      return setIsSubmit(false);
    }
    try {
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      // submit to the API here
      const bformData = new FormData();

Object.keys(formData).forEach(key => {
  bformData.append(key, formData[key]);
});

      const response = await axios.post(
        `${NODE_API_URL}/api/campus/visitor/visitor-entry`,
        bformData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);
        if (response.data?.statusCode === 201) {
          //   setTimeout(() => {
          //     window.location.reload();
          //   }, 300);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };
  const fetchDataForupdateBasedOnId = async (dbId) => {
    if (!dbId || parseInt(dbId, 10) <= 0) {
      toast.error("Invalid ID.");
      return;
    }
  
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/campus/visitor/campus-visitor-list`,
        { dbId }
      );
  
      if (response?.statusCode === 200 && response.data.length > 0) {
        const data = response.data[0];
        setFormData((prev) => ({
          ...prev,
          dbId: data.id,
          visitorType: data.visitorType ? validator.unescape(data.visitorType) : data.visitorType,
          visitorName: data.visitorName,
          visitorPhone: data.visitorPhone,
          visitorEmail: data.visitorEmail,
          visitorPurpose: data.visitorPurpose ? validator.unescape(data.visitorPurpose) : data.visitorPurpose,
         dateOfArrival: data.dateOfArrival.split("T")[0], // Ensure valid date format
          dateOfDeparture: data.dateOfDeparture ? data.dateOfDeparture.split("T")[0] : data.dateOfDeparture,
          timeOfArrival: data.timeOfArrival,
          timeOfDeparture: data.timeOfDeparture,
          governmentIdProofType: data.governmentIdProofType,
          governmentIdProofNo: data.governmentIdProofNo,
          hostDetails: data.hostDetails,
          photo: data.photo,
          governmentProofPhoto: data.governmentProofPhoto,
          
        }));
  
        // Fetch room details if blockId is available
        if (data.blockId) {
          fetchRoomNoBasedOnBlock(data.blockId);
        }
  
        return response;
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {
      toast.error("Error fetching data.");
      return null;
    }
  };

  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      const {id} = e.target;
      if(id==="photo"){
        setPreviewImage(URL.createObjectURL(file));

      }
      else if(id==="governmentProofPhoto"){

        setPreGovernmentProofPhoto(URL.createObjectURL(file))
      }
      if (file) {
        setFormData((prev)=>({
          ...prev,
          [id]: file,
        }));
      }
    };
  
     useEffect(() => {
            if (dbId) fetchDataForupdateBasedOnId(dbId);
        }, [dbId]);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Dashboard
                  </a>
                  <span className="breadcrumb-item">Visitor Management</span>
                  <span className="breadcrumb-item active">
                    {dbId ? "Update Registration" : "Add New Registration"}
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new">
                {dbId ? "Update Registration" : "Add New Registration"}
                </h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/visitor-registration-list">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                              <i className="fas fa-list"></i> Registration History 
                                        </button>
                                    </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3 col-lg-3 form-group">
                      <label className="font-weight-semibold">
                        Visitor Type <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={visitorType.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            visitorType: selectedOption.value,
                          });
                        }}
                        value={
                          formData.visitorType
                            ? {
                                value: formData.visitorType,
                                label: formData.visitorType,
                              }
                            : { value: "", label: "Select" }
                        }
                      />
                    
                    </div>
                    {/* Visitor Name */}
                    <FormField
                      borderError={error.field === "visitorName"}
                      errorMessage={error.field === "visitorName" && error.msg}
                      label="Visitor Name"
                      name="visitorName"
                      id="visitorName"
                      placeholder="Enter Visitor Name"
                      value={formData.visitorName}
                      onChange={handleChange}
                      column="col-md-3 col-lg-3"
                      required
                    />
                    {/* Visitor Email */}
                    <FormField
                      borderError={error.field === "visitorEmail"}
                      errorMessage={error.field === "visitorEmail" && error.msg}
                      label="Visitor Email"
                      name="visitorEmail"
                      id="visitorEmail"
                      placeholder="Enter Visitor Email"
                      value={formData.visitorEmail}
                      onChange={handleChange}
                      column="col-md-3 col-lg-3"
                    />
                    {/* Contact No */}
                    <FormField
                      borderError={error.field === "visitorPhone"}
                      errorMessage={error.field === "visitorPhone" && error.msg}
                      label="Phone No"
                      name="visitorPhone"
                      id="visitorPhone"
                      placeholder="0123456789"
                      value={formData.visitorPhone}
                      onChange={handleChange}
                      column="col-md-3 col-lg-3"
                      required
                    />

                    {/* Purpose Of Visit */}
                    <TextareaField
                      borderError={error.field === "visitorPurpose"}
                      errorMessage={
                        error.field === "visitorPurpose" && error.msg
                      }
                      label="Purpose Of Visit"
                      name="visitorPurpose"
                      id="visitorPurpose"
                      placeholder="Enter Purpose of Visit"
                      value={formData.visitorPurpose}
                      onChange={handleChange}
                      column="col-md-12"
                      required
                    />
                    <div className="col-md-4 col-lg-4 form-group">
                      <label className="font-weight-semibold">
                        Government Id Proof{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={[
                          { value: "Aadhaar Card", label: "Aadhaar Card" },
                          { value: "PAN Card", label: "PAN Card" },
                          {
                            value: "Voter ID",
                            label: "Voter ID (Electoral Photo Identity Card)",
                          },
                          { value: "Passport", label: "Passport" },
                          {
                            value: "Driving License",
                            label: "Driving License",
                          },
                          {
                            value: "Ration Card",
                            label: "Ration Card (with photograph)",
                          },
                          {
                            value: "Employee ID",
                            label: "Employee ID (Government or PSU)",
                          },
                          {
                            value: "CGHS Card",
                            label:
                              "Central Government Health Scheme (CGHS) Card",
                          },
                          {
                            value: "NPR Smart Card",
                            label:
                              "National Population Register (NPR) Smart Card",
                          },
                          {
                            value: "PPO",
                            label:
                              "Pension Payment Order (PPO) with Photograph",
                          },
                          { value: "NREGA Job Card", label: "NREGA Job Card" },
                          {
                            value: "School/College ID",
                            label:
                              "School/College ID (Issued by a government-recognized institution)",
                          },
                          {
                            value: "Bank Passbook",
                            label:
                              "Bank Passbook with Photograph (Issued by a scheduled bank)",
                          },
                          {
                            value: "Post Office ID",
                            label:
                              "Post Office ID Card (Issued by the Department of Posts)",
                          },
                          { value: "Arms License", label: "Arms License" },
                          {
                            value: "Freedom Fighter ID",
                            label: "Freedom Fighter ID Card",
                          },
                          {
                            value: "Certificate of Identity",
                            label:
                              "Certificate of Identity with Photograph (Issued by a Gazetted Officer)",
                          },
                          {
                            value: "Kisan Photo Passbook",
                            label: "Kisan Photo Passbook",
                          },
                          {
                            value: "Disability ID",
                            label:
                              "Disability ID Card (Issued by the Government)",
                          },
                          {
                            value: "Bar Council ID",
                            label: "Bar Council ID Card (For lawyers)",
                          },
                        ]}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            governmentIdProofType: selectedOption.value,
                          });
                        }}
                        value={
                          formData.governmentIdProofType
                            ? {
                                value: formData.governmentIdProofType,
                                label: formData.governmentIdProofType,
                              }
                            : { value: "", label: "Select" }
                        }
                      />
                    </div>

                    {/* goverment id proof */}
                    <FormField
                      borderError={error.field === "governmentIdProofNo"}
                      errorMessage={
                        error.field === "governmentIdProofNo" && error.msg
                      }
                      label="Id number (Issued by Government)"
                      name="governmentIdProofNo"
                      id="governmentIdProofNo"
                      placeholder="XXXX XXXX XXXX"
                      value={formData.governmentIdProofNo}
                      onChange={handleChange}
                      column="col-md-4 col-lg-4"
                      required
                    />
                    {/* photo upload  */}
                    <FormField
                      borderError={error.field === "photo"}
                      errorMessage={error.field === "photo" && error.msg}
                      label="Upload Image (Issued by Government)"
                      name="photo"
                      id="photo"
                      onChange={handleImageUpload}
                      type="file" 
                      column="col-md-4 col-lg-4"
                      required
                    />
                     {formData?.photo && (
                      <div className="row col-12 d-flex justify-content-center">
                            <img
                              src={previewImage}
                              alt="Uploaded Preview"
                              className="row col-6 py-5"
                    />
                     </div> ) }
                    {/* Visit Date */}
                    <FormField
                      borderError={error.field === "dateOfArrival"}
                      errorMessage={
                        error.field === "dateOfArrival" && error.msg
                      }
                      label="Date Of Arrival"
                      name="dateOfArrival"
                      id="dateOfArrival"
                      type="date"
                      value={formData.dateOfArrival}
                      onChange={handleChange}
                      column="col-md-3 col-lg-3"
                      required
                    />
                    {/* Visit In Time */}
                    <FormField
                      borderError={error.field === "timeOfArrival"}
                      errorMessage={
                        error.field === "timeOfArrival" && error.msg
                      }
                      label="Time Of Arrival"
                      name="timeOfArrival"
                      id="timeOfArrival"
                      type="time"
                      value={formData.timeOfArrival}
                      onChange={handleChange}
                      column="col-md-3 col-lg-3"
                      required
                    />
                    {/* Visit Out Time */}
                    <FormField
                      borderError={error.field === "timeOfDeparture"}
                      errorMessage={
                        error.field === "timeOfDeparture" && error.msg
                      }
                      label="Time Of Departure"
                      name="timeOfDeparture"
                      id="timeOfDeparture"
                      type="time"
                      value={formData.timeOfDeparture}
                      onChange={handleChange}
                      column="col-md-3 col-lg-3"
                      required
                    />
                    {/* Visit Out Date */}
                    <FormField
                      borderError={error.field === "dateOfDeparture"}
                      errorMessage={
                        error.field === "dateOfDeparture" && error.msg
                      }
                      label="Date Of Departure"
                      name="dateOfDeparture"
                      id="dateOfDeparture"
                      type="date"
                      value={formData.dateOfDeparture}
                      onChange={handleChange}
                      column="col-md-3 col-lg-3"
                      required
                    />
                    {/* Host details */}
                    <FormField
                      borderError={error.field === "hostDetails"}
                      errorMessage={error.field === "hostDetails" && error.msg}
                      label="Host Details"
                      name="hostDetails"
                      id="hostDetails"
                      placeholder="Enter Host Details"
                      value={formData.hostDetails}
                      onChange={handleChange}
                      column="col-md-6 col-lg-6"
                      required
                    />
                    {/* photo  capture  */}
                    <FormField
                      borderError={error.field === "governmentProofPhoto"}
                      errorMessage={error.field === "governmentProofPhoto" && error.msg}
                      label="Photo capture of visitor"
                      name="governmentProofPhoto"
                      id="governmentProofPhoto"
                      onChange={handleImageUpload}
                      type="file" 
                      column="col-md-6 col-lg-6"
                      required
                    />
                     {formData?.governmentProofPhoto && (
                      <div className="row col-12 d-flex justify-content-center">
                            <img
                              src={preGovernmentProofPhoto}
                              alt="Uploaded Preview"
                              className="row col-6 py-5"
                    />
                     </div> ) }

                    {/* remark */}
                    <TextareaField
                      borderError={error.field === "remark"}
                      errorMessage={error.field === "remark" && error.msg}
                      label="Remarks"
                      name="remark"
                      id="remark"
                      placeholder="Enter Remarks"
                      value={formData.remark}
                      onChange={handleChange}
                      column="col-md-12"
                    />
                    <div className="col-md-12 col-lg-12 col-12">
                      <button
                        disabled={isSubmit}
                        className="btn btn-dark mt-2 d-flex justify-content-center align-items-center"
                        type="submit"
                      >
                        Submit{" "}
                        {isSubmit && (
                          <>
                            &nbsp; <div className="loader-circle"></div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
