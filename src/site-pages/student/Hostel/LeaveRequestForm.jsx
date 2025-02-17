import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { goBack } from "../../../site-components/Helper/HelperFunction";
import {
  FormField,
  TextareaField,
} from "../../../site-components/admin/assets/FormField";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Select from "react-select";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
function LeaveRequestForm() {
  const { id: dbId } = useParams();
  const initialData = {
    dbId: "",
    studentId: "",
    reason: "",
    leaveType: "",
    startDate: "",
    endDate: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state

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

    if (!formData.startDate) {
      errorMsg("startDate", "Start Date is required.");
      toast.error("Start Date is required.");
      return setIsSubmit(false);
    }
    if (!formData.endDate) {
      errorMsg("endDate", "End Date is required.");
      toast.error("End Date is required.");
      return setIsSubmit(false);
    }
    if (!formData.leaveType) {
      errorMsg("leaveType", "Leave Type is required.");
      toast.error("Leave Type is required.");
      return setIsSubmit(false);
    }
    if (!formData.reason) {
      errorMsg("reason", "Reason is required.");
      toast.error("Reason is required.");
      return setIsSubmit(false);
    }
    errorMsg("", "");

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/leave-request`,
        {
          studentId: formData?.studentId,
          reason: formData?.reason,
          startDate: formData?.startDate,
          endDate: formData?.endDate,
          leaveType: formData?.leaveType,
        }
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);
        setFormData(initialData);
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
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      studentId: secureLocalStorage.getItem("studentId"),
    }));
  }, []);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Dashboard
                  </a>
                  <a href="./" className="breadcrumb-item">
                    Allot Room
                  </a>
                  <span className="breadcrumb-item active">
                    Leave Request
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Leave Request</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/student/leave-request-list">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      Leave History <i className="fas fa-list"></i>
                    </button>
                  </Link>
                  
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* <FormField
                      borderError={error.field === "studentId"}
                      errorMessage={error.field === "studentId" && error.msg}
                      label="Student ID"
                      name="studentId"
                      id="studentId"
                      type="text"
                      value={formData.studentId}
                      column="col-md-2 col-lg-2"
                      readOnly
                    /> */}
                    <FormField
                      borderError={error.field === "startDate"}
                      errorMessage={error.field === "startDate" && error.msg}
                      label="Start Date"
                      name="startDate"
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      column="col-md-4 col-lg-4 col-12"
                      onChange={handleChange}
                      required
                    />
                    <FormField
                      borderError={error.field === "endDate"}
                      errorMessage={error.field === "endDate" && error.msg}
                      label="End Date"
                      name="endDate"
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      column="col-md-4 col-lg-4 col-12"
                      onChange={handleChange}
                      required
                    />
                    <div className="col-md-4 col-lg-4 col-12 col-sm-12 form-group">
                      <label className="font-weight-semibold">
                        Select Leave Type:{" "}
                        <strong className="text-danger">*</strong>
                      </label>

                      <Select
                        options={["halfday", "fullday","internship leave"].map((item) => ({
                          value: item,
                          label: capitalizeFirstLetter(item),
                        }))}
                        onChange={(selectedOption) => {
                          

                          setFormData((prev) => ({
                            ...prev,
                            leaveType: selectedOption.value, // Store a single value
                          }));
                        }}
                        value={
                          formData?.leaveType
                            ? {
                                value: formData.leaveType,
                                label: capitalizeFirstLetter(
                                  formData.leaveType
                                ),
                              }
                            : null
                        }
                      />
                    </div>
                    <TextareaField
                      borderError={error.field === "reason"}
                      errorMessage={error.field === "reason" && error.msg}
                      label="Reason"
                      name="reason"
                      id="reason"
                      type="text"
                      value={formData.reason}
                      onChange={handleChange}
                      column="col-md-12 col-lg-12"
                      required
                    />

                    <div className="col-md-12 col-lg-12 col-12">
                      <button
                        disabled={isSubmit}
                        className="btn btn-dark col-12 d-flex justify-content-center"
                        type="submit"
                      >
                        Submit{" "}
                        {isSubmit && (
                          <div className="d-flex justify-content-center">
                            &nbsp; <div className="loader-circle"></div>
                          </div>
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

export default LeaveRequestForm;
