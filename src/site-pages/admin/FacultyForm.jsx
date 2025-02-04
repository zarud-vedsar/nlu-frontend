import React, { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { FILE_API_URL, PHP_API_URL } from "../../site-components/Helper/Constant";
import Select from "react-select";
import { toast,  } from "react-toastify";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import {
  capitalizeFirstLetter,
  dataFetchingGet,
} from "../../site-components/Helper/HelperFunction";
import { Spinner } from "react-bootstrap";
const FacultyForm = () => {
  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState();

  const [errorKey, setErrorKey] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [selectDepartment, setSelectDepartment] = useState();
  const [selectDesignation, setSelectDesignation] = useState();
  const [isSubmit, setIsSubmit] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [loading, setLoading] = useState();
  const [
    correspondingAddressSameAsPermanent,
    setCorrespondingAddressSameAsPermanent,
  ] = useState(false);

  const initilization = {
    data: "user_add",
    user_update_id: "",
    user_updateu_id: "",
    avtar_user: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    c_email: "",
    c_phone: "",
    c_alter_phone: "",
    c_dob: "",
    c_gender: "",
    qualification: "",
    departmentid: "",
    designationid: "",
    father_name: "",
    mother_name: "",
    gphone: "",
    galterphone: "",
    c_address: "",
    c_pincode: "",
    c_district: "",
    c_state: "",
    c_country: "",
    p_country: "",
    p_address: "",
    p_pincode: "",
    p_district: "",
    p_state: "",
    c_discription: "",
    c_pass: "",
    emergency_contact: "",
    exp_yrs: "",
    specialization: "",
    joining_date: "",
    show_email_on_website: false,
    show_contact_on_website: false,
  };

  const [formData, setFormData] = useState(initilization);
  const phoneRegex =
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,3}[-.\s]?\d{1,4}$/;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDepartment(),
          getRoleList(),
          fetchDesignationList(),
          id ? getFacultyDetail() : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      const response = await axios.post(
        `${NODE_API_URL}/api/department/fetch`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const tempDepartments = response.data.data.map((dep) => ({
        value: dep.id,
        label: dep.dtitle,
      }));

      setDepartments(tempDepartments);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchDesignationList = async (deleteStatus = 0) => {
    try {
      const response = await dataFetchingGet(
        `${NODE_API_URL}/api/designation/retrieve-all-designation-with-department/${deleteStatus}`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        console.log(response.data);
        const tempDesignation = response.data.map((dep) => ({
          value: dep.id,
          label: dep.title,
        }));

        setDesignationList(tempDesignation);
      } else {
        toast.error("Data not found.");
        setDesignationList([]);
      }
    } catch (error) {
      setDesignationList([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
    }
  };

  const getFacultyDetail = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "fetch_user");
      bformData.append("update_id", id);
      const res = await axios.post(`${PHP_API_URL}/faculty.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = res.data.data;
      console.log(result);
      if(res?.data?.status===200 || res?.data?.status ===201){
      setFormData({
        data: "user_add",
        user_update_id: result[0].id,
        user_updateu_id: result[0]?.uid,
        avtar_user: result[0]?.avtar,
        role: result[0]?.role,
        first_name: result[0].first_name,
        middle_name: result[0].middle_name,
        last_name: result[0].last_name,
        c_email: result[0]?.u_email,
        c_phone: result[0]?.u_phone,
        c_alter_phone: result[0]?.c_alter_phone,
        c_dob: result[0]?.dob,
        c_gender: result[0]?.gender,
        qualification: result[0]?.qualification,
        departmentid: result[0]?.departmentid,
        designationid: result[0]?.designationid,
        father_name: result[0]?.father_name,
        mother_name: result[0]?.mother_name,
        gphone: result[0]?.gphone,
        galterphone: result[0]?.galterphone,
        c_country: result[0]?.c_country,
        c_address: result[0]?.c_address,
        c_pincode: result[0]?.c_pin_code,
        c_district: result[0]?.c_district,
        c_state: result[0]?.c_state,
        p_address: result[0]?.p_address,
        p_country: result[0]?.p_country,
        c_discription: result[0]?.discription,
        p_district: result[0]?.p_district,
        p_pincode: result[0]?.p_pincode,
        p_state: result[0]?.p_state,
        c_pass: result[0]?.pass,
        emergency_contact: result[0]?.emergency_contact,
        exp_yrs: result[0]?.exp_yrs,
        joining_date: result[0]?.joining_date,
        show_contact_on_website:
          result[0]?.show_contact_on_website === 1 ? true : false,
        show_email_on_website:
          result[0]?.show_email_on_website === 1 ? true : false,
        specialization: result[0]?.specialization,
      });
      setPreviewImage(
        `${FILE_API_URL}/user/${result[0]?.uid}/${result[0].avtar}`
      );
    }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const [roleList, setRoleList] = useState([]);
  const getRoleList = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_role");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200) {
        setRoleList(response?.data?.data);
      }
    } catch (error) {
      setRoleList([]);
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    if (departments && designationList && formData) {
      const selectedDepartment = departments.find(
        (department) => department.value === formData.departmentid
      );
      if (selectedDepartment) {
        setSelectDepartment(selectedDepartment);
      }

      const selectedDesignation = designationList.find(
        (designation) => designation.value === formData.designationid
      );
      if (selectedDesignation) {
        setSelectDesignation(selectedDesignation);
      }
    }
  }, [departments, designationList, formData]);

  const fillAddress = () => {
    if (!correspondingAddressSameAsPermanent) {
      setFormData((prevState) => ({
        ...prevState,
        c_address: formData.p_address,
        c_state: formData.p_state,
        c_pincode: formData.p_pincode,
        c_district: formData.p_district,
        c_country: formData.p_country,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        c_address: "",
        c_state: "",
        c_pincode: "",
        c_district: "",
        c_country: "",
      }));
    }

    setCorrespondingAddressSameAsPermanent((e) => !e);
  };

  const updateDepartment = (e) => {
    setSelectDepartment(e);
    setFormData((prevState) => ({
      ...prevState,
      departmentid: e.value,
    }));
  };
  const updateDesignation = (e) => {
    setSelectDesignation(e);
    setFormData((prevState) => ({
      ...prevState,
      designationid: e.value,
    }));
  };

  const handleChange = async (e) => {
    const { name, value, type } = e.target;

    if (type == "number") {
      if (name == "c_pincode" && value.length == 6) {
        const bformData = new FormData();
        bformData.append("data", "pin_code");
        bformData.append("c_pincode", value);
        try {
          const response = await axios.post(
            `${PHP_API_URL}/faculty.php`,
            bformData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          setFormData((prevState) => ({
            ...prevState,
            c_district: response.data.data.District,
            c_state: response.data.data.State,
            c_country: response.data.data.Country,
          }));
        } catch (error) {
          toast.error(error.response.data.msg);
        } finally {
        }
      } else if (name == "c_pincode" && value.length > 6) {
        return;
      } else if (name == "p_pincode" && value.length == 6) {
        const bformData = new FormData();
        bformData.append("data", "pin_code");
        bformData.append("c_pincode", value);
        try {
          const response = await axios.post(
            `${PHP_API_URL}/faculty.php`,
            bformData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          setFormData((prevState) => ({
            ...prevState,
            p_district: response.data.data.District,
            p_state: response.data.data.State,
            p_country: response.data.data.Country,
          }));
        } catch (error) {
          toast.error(error.response.data.msg);
        } finally {
        }
      } else if (name == "p_pincode" && value.length > 6) {
        return;
      } else if (
        (name != "c_pincode" || name != "p_pincode") &&
        value.length > 10
      ) {
        return;
      }
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setErrorKey("");
    setErrorMessage("");

    if (!formData.first_name && !/^[a-zA-Z\s\.]+$/.test(formData.first_name)) {
      setErrorMessage("Please enter first name");
      toast.error("Please enter first name");
      setErrorKey(".first_name");
      return setIsSubmit(false);
    } 
     if (!formData.c_email || !/\S+@\S+\.\S+/.test(formData.c_email)) {
      setErrorMessage("Please enter a valid email");
      toast.error("Please enter a valid email");
      setErrorKey(".c_email");
      return setIsSubmit(false);
    } 
     if (!formData.role ) {
      setErrorMessage("Role is required");
      toast.error("Role is required");
      setErrorKey(".role");
      return setIsSubmit(false);
    } 
     if (!formData.c_gender) {
      setErrorMessage("Please select gender");
      toast.error("Please select gender");
      setErrorKey(".c_gender");
      return setIsSubmit(false);
    } 
     if (formData.c_phone && !phoneRegex.test(formData.c_phone)) {
      toast.error("Please enter a valid phone number");
      return setIsSubmit(false);
    } 
     if (
      formData.c_alter_phone &&
      !phoneRegex.test(formData.c_alter_phone)
    ) {
      toast.error("Please enter a valid alternative phone number");
      return setIsSubmit(false);
    } 
     if (formData.gphone && !phoneRegex.test(formData.gphone)) {
      toast.error("Please enter a valid gaurdian phone number");
      return setIsSubmit(false);
    } 
     if (formData.galterphone && !phoneRegex.test(formData.galterphone)) {
      toast.error("Please enter a valid gaurdian alternative phone number");
      return setIsSubmit(false);
    }
    

    const bformData = new FormData();
    bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
    bformData.append("login_type", secureLocalStorage.getItem("loginType"));
    bformData.append("data", "user_add");

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      bformData.append(key, value);
    });

    try {
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
        setFormData(initilization);
        setSelectDepartment(null);
        setSelectDesignation(null);
        if (response.data?.status === 200) {
          window.history.back();
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      const status = error.response?.data?.status;

      if (status === 500 || status === 400) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else if (status == 400) {
        setErrorKey(error.response.data.key);
        setErrorMessage(error.response.data.msg);
        toast.error(error.response.data.msg);
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setErrorKey("");
      setErrorMessage("");
      setIsSubmit(false);
    }
  };

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
    if (file) {
      setFormData({
        ...formData,
        avtar_user: file,
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="">
            <nav className="breadcrumb">
              <a href="/" className="breadcrumb-item">
                Department
              </a>
              <a className="breadcrumb-item ">Faculty</a>

              <span className="breadcrumb-item active">Add New Faculty</span>
            </nav>
          </div>

          <div className="card bg-transparent mb-2">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">Add New Faculty</h5>
              <div className="ml-auto">
                <Button
                  variant="light"
                  className="mb-2 mb-md-0"
                  onClick={() => window.history.back()}
                >
                  <i className="fas">
                    <FaArrowLeft />
                  </i>{" "}
                  Go Back
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="card">
              <div className="">
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-12 mt-2 mb-3">
                        <h6 className="custom">
                          <span className="custo-head">Personal Details</span>
                        </h6>
                      </div>

                      {/* Avatar */}

                      <div className="form-group col-md-12">
                        <div
                          style={{
                            width: "110px",
                            height: "100px",
                            position: "relative",
                          }}
                          className="mx-auto"
                        >
                          {formData.avtar_user ? (
                            <img
                              src={previewImage}
                              alt="Uploaded Preview"
                              style={{
                                width: "110px",
                                height: "100px",
                                position: "relative",
                              }}
                              className="rounded-circle"
                            />
                          ) : (
                            <div
                              className="rounded-circle"
                              style={{
                                width: "110px",
                                height: "100px",
                                position: "relative",
                                background: "#efeff6",
                              }}
                            >
                              {" "}
                            </div>
                          )}
                          <label
                            htmlFor="avatar-input"
                            onClick={triggerFileInput}
                            className="rounded-circle d-flex justify-content-center  align-items-center"
                            style={{
                              position: "absolute",
                              bottom: "-7px",
                              right: "6px",
                              backgroundColor: "#1ad1ff",
                              width: "30px",
                              height: "30px",
                            }}
                          >
                            <FaRegEdit />
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                          />{" "}
                          <span className="mt-1 avtar_user"></span>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="first_name"
                        >
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                        {errorKey === ".first_name" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="middle_name"
                        >
                          Middle Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="middle_name"
                          value={formData.middle_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="last_name"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Email */}
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_email"
                        >
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="c_email"
                          value={formData.c_email}
                          onChange={handleChange}
                        />
                        {errorKey === ".c_email" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>

                      {/* Phone 1 */}
                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_phone"
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="c_phone"
                          value={formData.c_phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_alter_phone"
                        >
                          Alternative Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="c_alter_phone"
                          value={formData.c_alter_phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-2">
                        <label className="font-weight-semibold" htmlFor="c_dob">
                          Date Of Birth
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="c_dob"
                          value={formData.c_dob}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Gender */}
                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_gender"
                        >
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          name="c_gender"
                          id="c_gender"
                          className="form-control"
                          value={formData.c_gender}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errorKey === ".c_gender" && (
                          <span className="text-danger">{errorMessage}</span>
                        )}
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="qualification"
                        >
                          Highest Qualification{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="departmentid"
                        >
                          Department
                        </label>
                        <Select
                          value={selectDepartment}
                          options={departments}
                          onChange={updateDepartment}
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="designationid"
                        >
                          Designation
                        </label>
                        <Select
                          value={selectDesignation}
                          options={designationList}
                          onChange={updateDesignation}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label className="font-weight-semibold" htmlFor="role">
                          Role <span className="text-danger">*</span>
                        </label>
                        <Select
                          options={roleList.map((item) => ({
                            value: item.id,
                            label: capitalizeFirstLetter(item.role_name),
                          }))}
                          onChange={(selectedOption) => {
                            setFormData({
                              ...formData,
                              role: selectedOption.value,
                            });
                          }}
                          value={
                            roleList.find((item) => item.id === formData.role)
                              ? {
                                  value: formData.role,
                                  label: capitalizeFirstLetter(
                                    roleList.find(
                                      (item) => item.id === formData.role
                                    ).role_name
                                  ),
                                }
                              : {
                                  value: formData.role,
                                  label: "Select",
                                }
                          }
                        />
                      </div>

                      <div className="col-md-12 mt-2 mb-3">
                        <h6 className="custom">
                          <span className="custo-head">Gaurdians Details</span>
                        </h6>
                      </div>

                      {/* Name */}

                      <div className="form-group col-md-6">
                        <label
                          className="font-weight-semibold"
                          htmlFor="father_name"
                        >
                          Father's Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="father_name"
                          value={formData.father_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label
                          className="font-weight-semibold"
                          htmlFor="mother_name"
                        >
                          Mother's Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="mother_name"
                          value={formData.mother_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label
                          className="font-weight-semibold"
                          htmlFor="gphone"
                        >
                          Guardian Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="gphone"
                          value={formData.gphone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label
                          className="font-weight-semibold"
                          htmlFor="galterphone"
                        >
                          Guardian's Alternative Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="galterphone"
                          value={formData.galterphone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-12 mt-2 mb-3">
                        <h6 className="custom">
                          <span className="custo-head">Permanent Address</span>
                        </h6>
                      </div>

                      <div className="form-group col-md-8">
                        <label
                          className="font-weight-semibold"
                          htmlFor="p_address"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="p_address"
                          value={formData.p_address}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="p_pincode"
                        >
                          Pin Code
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="p_pincode"
                          value={formData.p_pincode}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="P_country"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="p_country"
                          value={formData.p_country}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="p_state"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="p_state"
                          value={formData.p_state}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="p_district"
                        >
                          District
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="p_district"
                          value={formData.p_district}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-12 mt-2 mb-3">
                        <h6 className="custom">
                          <span className="custo-head">
                            Corresponding Address
                          </span>
                        </h6>
                      </div>

                      <div className="form-group col-md-12 ml-4 d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="correspondingAddressSameAsPermanent"
                          name="correspondingAddressSameAsPermanent"
                          onChange={() => fillAddress()}
                          checked={correspondingAddressSameAsPermanent}
                        />

                        <label
                          className="form-check-label"
                          htmlFor="correspondingAddressSameAsPermanent"
                        >
                          Corresponding Address Same as Permanent{" "}
                        </label>
                      </div>

                      <div className="form-group col-md-8">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_address"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="c_address"
                          value={formData.c_address}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_pincode"
                        >
                          Pin Code
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="c_pincode"
                          value={formData.c_pincode}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_country"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="c_country"
                          value={formData.c_country}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_state"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="c_state"
                          value={formData.c_state}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_district"
                        >
                          District
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="c_district"
                          value={formData.c_district}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-12 mt-2 mb-3">
                        <h6 className="custom">
                          <span className="custo-head">Other Details</span>
                        </h6>
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="emergency_contact"
                        >
                          Emergency Contact{" "}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="emergency_contact"
                          value={formData.emergency_contact}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label
                          className="font-weight-semibold"
                          htmlFor="specialization"
                        >
                          Specialization
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-2">
                        <label
                          className="font-weight-semibold"
                          htmlFor="joining_date"
                        >
                          Joining Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="joining_date"
                          value={formData.joining_date}
                          onChange={handleChange}
                        />
                      </div>

                      {!id && (
                        <div className="form-group col-md-4">
                          <label
                            className="font-weight-semibold"
                            htmlFor="c_pass"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="c_pass"
                            value={formData.c_pass}
                            onChange={handleChange}
                          />
                        </div>
                      )}

                      <div className="form-group col-md-4">
                        <label
                          className="font-weight-semibold"
                          htmlFor="exp_yrs"
                        >
                          Experience{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="exp_yrs"
                          value={formData.exp_yrs}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-2 d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="show_email_on_website"
                          name="show_email_on_website"
                          onChange={() =>
                            setFormData((prevState) => ({
                              ...prevState,
                              show_email_on_website:
                                !prevState.show_email_on_website,
                            }))
                          }
                          checked={formData.show_email_on_website}
                        />

                        <label
                          className="form-check-label"
                          htmlFor="show_email_on_website"
                        >
                          Show email on website{" "}
                        </label>
                      </div>
                      <div className="form-group col-md-2 d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="show_contact_on_website"
                          name="show_contact_on_website"
                          onChange={() =>
                            setFormData((prevState) => ({
                              ...prevState,
                              show_contact_on_website:
                                !prevState.show_contact_on_website,
                            }))
                          }
                          checked={formData.show_contact_on_website}
                        />

                        <label
                          className="form-check-label"
                          htmlFor="show_contact_on_website"
                        >
                          Show contact on website{" "}
                        </label>
                      </div>
                      <div className="form-group col-md-12">
                        <label
                          className="font-weight-semibold"
                          htmlFor="c_discription"
                        >
                          Description
                        </label>
                        <textarea
                          type="text"
                          className="form-control"
                          name="c_discription"
                          value={formData.c_discription}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-12 me-auto d-flex justify-content-between align-items-center">
                        {isSubmit ? (
                          <button
                            type="submit"
                            className="btn btn-light btn-block"
                            disabled
                          >
                            Submiting
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-dark btn-block"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyForm;
