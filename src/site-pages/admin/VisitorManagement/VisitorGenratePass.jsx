import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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

const VisitorGenratePass = () => {
  const { dbId } = useParams();
  const [previewImage, setPreviewImage] = useState();
  const [preGovernmentProofPhoto, setPreGovernmentProofPhoto] = useState();
  const initialData = {
    visitorId: dbId,
    hostDetails: "",
    visitorPurpose: "",
    visitorType: "",
    passType: "",
    fromDate: "",
    toDate: "",
    visitorPhone: "",
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
    if (!formData.visitorPhone) {
      errorMsg("visitorPhone", "visitor phone Number is required.");
      toast.error("visitor Phone Number is required.");
      return setIsSubmit(false);
    }
  
    if (!formData.visitorPurpose) {
      errorMsg("visitorPurpose", "Purpose is required.");
      toast.error("Purpose is required.");
      return setIsSubmit(false);
    }
   
    if (!formData.passType) {
      errorMsg("passType", "Pass Type is required.");
      toast.error("passType) is required.");
      return setIsSubmit(false);
    }
    if (!formData.hostDetails) {
      errorMsg("hostDetails", "Host Details is required.");
      toast.error("hostDetails is required.");
      return setIsSubmit(false);
    }
     if (!formData.fromDate) {
          errorMsg("fromDate", "From date is required.");
          toast.error("From date is required.");
          return setIsSubmit(false);
        }
     if (!formData.toDate) {
          errorMsg("toDate", "To date is required.");
          toast.error("To date is required.");
          return setIsSubmit(false);
        }
    try {
        formData.loguserid = secureLocalStorage.getItem('login_id');
        formData.login_type = secureLocalStorage.getItem('loginType');
        // submit to the API here
        const response = await axios.post(
            `${NODE_API_URL}/api/campus/visitor/generate-campus-pass`,
            formData
        );
        console.log(response);
        if (
            response.data?.statusCode === 200 ||
            response.data?.statusCode === 201
        ) {
            errorMsg("", "");
            toast.success(response.data.message);
            if (response.data?.statusCode === 201) {
              navigate(`/admin/visitor-pass/${dbId}`, { replace: true });
                // setTimeout(() => {
                //     window.location.reload();
                // }, 300);
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
    // Validate dbId
    if (!dbId || parseInt(dbId, 10) <= 0) {
      toast.error("Invalid ID.");
      return;
    }
  
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/campus/visitor/campus-visitor-list`,
        { dbId }
      );

      // Log the response for debugging
      console.log('API Response:', response);

      if (response?.statusCode === 200 && response.data?.length > 0) {
        const data = response.data[0]; // Assuming data is an array and taking the first item
        
        // Set form data with the fetched values
        setFormData((prev) => ({
          ...prev,
          dbId: data.id,
          visitorType: data.visitorType ? validator.unescape(data.visitorType) : data.visitorType,
          passType: data.passType ? validator.unescape(data.passType) : data.passType,
          visitorPhone: data.visitorPhone,
          visitorPurpose: data.visitorPurpose ? validator.unescape(data.visitorPurpose) : data.visitorPurpose,
          hostDetails: data.hostDetails,

        }));
  
        return response;
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Log error details
      toast.error("Error fetching data. debug");
      return null;
    }
  };

  useEffect(() => {
    if (dbId) {
      fetchDataForupdateBasedOnId(dbId); // Fetch data when dbId changes
    }
  }, [dbId]); // Effect runs on dbId change
  
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
                    {dbId ? "Update Data" : "Add New Genrate Pass"}
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {dbId ? "Update Data" : "Add New Genrate Pass"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to={`/admin/visitor-pass-history/${dbId}`}>
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      Pass History <i className="fas fa-list"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Host details */}
                    <FormField
                      borderError={error.field === "hostDetails"}
                      errorMessage={error.field === "hostDetails" && error.msg}
                      label="Host Details"
                      name="hostDetails"
                      id="hostDetails"
                      value={formData.hostDetails || ""}
                      onChange={handleChange}
                      column="col-md-4 col-lg-4"
                      required
                    />
                    <div className="col-md-4 col-lg-4 form-group">
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

                    {/* Contact No */}
                    <FormField
                      borderError={error.field === "visitorPhone"}
                      errorMessage={error.field === "visitorPhone" && error.msg}
                      label="Phone No"
                      name="visitorPhone"
                      id="visitorPhone"
                      value={formData.visitorPhone}
                      onChange={handleChange}
                      column="col-md-4 col-lg-4"
                      required
                    />

                    <div className="col-md-4 col-lg-4 form-group">
                      <label className="font-weight-semibold">
                        Pass Type <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={[
                          { value: "Temporary", label: "Temporary" },
                          { value: "Long Term", label: "Long Term" },
                        ]}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            passType: selectedOption.value,
                          });
                        }}
                        value={
                          formData.passType
                            ? {
                                value: formData.passType,
                                label: formData.passType,
                              }
                            : { value: "", label: "Select" }
                        }
                      />
                    </div>

                    {/* Conditionally render the visit date fields */}
                    {formData.passType === "Long Term" && (
                      <>
                        {/* Visit Date */}
                        <FormField
                          borderError={error.field === "fromDate"}
                          errorMessage={
                            error.field === "fromDate" && error.msg
                          }
                          label="From Date"
                          name="fromDate"
                          id="fromDate"
                          type="date"
                          value={formData.fromDate || ""}
                          onChange={handleChange}
                          column="col-md-4 col-lg-4"
                          required
                        />

                        {/* Visit Out Date */}
                        <FormField
                          borderError={error.field === "toDate"}
                          errorMessage={
                            error.field === "toDate" && error.msg
                          }
                          label="To Date"
                          name="toDate"
                          id="toDate"
                          type="date"
                          value={formData.toDate || ""}
                          onChange={handleChange}
                          column="col-md-4 col-lg-4"
                          required
                        />
                      </>
                    )}

                    {/* Purpose Of Visit */}
                    <TextareaField
                      borderError={error.field === "visitorPurpose"}
                      errorMessage={
                        error.field === "visitorPurpose" && error.msg
                      }
                      label="Purpose Of Visit"
                      name="visitorPurpose"
                      id="visitorPurpose"
                      value={formData.visitorPurpose}
                      onChange={handleChange}
                      column="col-md-12"
                      required
                    />

                    <div className="col-md-12 col-lg-12 col-12">
                      <button
                        disabled={isSubmit}
                        className="btn btn-dark mt-3 d-flex justify-content-center align-items-center"
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
};

export default VisitorGenratePass;
