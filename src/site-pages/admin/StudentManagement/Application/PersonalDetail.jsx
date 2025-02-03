import React, { useEffect, useState } from "react"; // Importing React hooks for managing state and lifecycle events.
import { studentRecordById } from "../../../../site-components/student/GetData"; // Importing components and data-fetching functions.
import "../../../../site-components/student/assets/css/custom.css"; // Importing custom CSS for styling.
import secureLocalStorage from "react-secure-storage"; // Importing secure storage for storing sensitive data.
import { toast } from "react-toastify"; // Importing library for displaying toast notifications.
import { FormField } from "../../../../site-components/admin/assets/FormField"; // Importing custom form field component.
import {
  PHP_API_URL,
  FILE_API_URL,
} from "../../../../site-components/Helper/Constant";
import { indianStates } from "../../../../site-components/Helper/HelperFunction";
import axios from "axios";
function PersonalDetail( {sid} ) {
  // Initial form data structure
  const initialData = {
    sname: "",
    salterphone: "",
    sdob: "",
    sfather: "",
    smother: "",
    sgender: "",
    sreligion: "",
    scategory: "",
    scaste: "",
    ssubcaste: "",
    swhatsapp: "",
    sabcid: "",
    saadhaar: "",
    saddress: "",
    spincode: "",
    scity: "",
    sstate: "",
    spic: "",
    hspic: "",
    ssign: "",
    hssign: "",
    aadhaarfront: "",
    aadhaarback: "",
    sguardianphone: "",
  };

  // State declarations
  const [student, setstudent] = useState([]); // For storing student details.
  const [formData, setFormData] = useState(initialData); // State for form data.
  const [previewSpic, setPreviewSpic] = useState(null); // For previewing student photo.
  const [previewSsign, setPreviewSsign] = useState(null); // For previewing signature.
  const [previewAadhaarFront, setPreviewAadhaarFront] = useState(null); // For previewing Aadhaar front.
  const [previewAadhaarBack, setPreviewAadhaarBack] = useState(null); // For previewing Aadhaar back.
  const [errors, setErrors] = useState({ field: "", msg: "" }); // For handling and displaying field errors.
  const [isSubmit, setIsSubmit] = useState(false);
  const [checkPinCode, setCheckPinCode] = useState(false);
  const [showCourseLink, setShowCourseLink] = useState(false);
  // Function to handle and set error messages
  const errorMsg = (field, value) => {
    setErrors((prev) => ({ ...prev, field: field, msg: value }));
  };
  const fetchPinCodeStateCity = async (pincode) => {
    setCheckPinCode(true);
    try {
      // API के लिए FormData बनाएँ और आवश्यक डेटा जोड़ें
      const formData = new FormData();
      formData.append("data", "pin_code"); // API के लिए ऑपरेशन की पहचान करें
      formData.append("pincode", pincode); // छात्र आईडी जोड़ें
      // API को पोस्ट रिक्वेस्ट भेजें
      const response = await axios.post(
        `${PHP_API_URL}/StudentSet.php`, // API endpoint
        formData, // डेटा
        {
          headers: {
            "Content-Type": "multipart/form-data", // फॉर्म डेटा के लिए हेडर सेट करें
          },
        }
      );
      const cityRenamingMap = {
        Osmanabad: "Dharashiv",
        Aurangabad: "Chhatrapati Sambhajinagar",
        Hoshangabad: "Narmadapuram",
        "New Raipur": "Atal Nagar",
        Allahabad: "Prayagraj",
        Gurgaon: "Gurugram",
        Rajahmundry: "Rajahmahendravaram",
        Mangalore: "Mangaluru",
        Bellary: "Ballari",
        Bijapur: "Vijayapura",
        Chikmagalur: "Chikkamagaluru",
        Gulbarga: "Kalaburagi",
        Mysore: "Mysuru",
        Hospet: "Hosapete",
        Shimoga: "Shivamogga",
        Hubli: "Hubballi",
        Tumkur: "Tumakuru",
        Belgaum: "Belagavi",
        Bangalore: "Bengaluru",
        Daltonganj: "Medininagar",
      };

      if (response.data?.status === 200) {
        // Check if the district exists in the renaming map, else use the original name
        const renamedCity =
          cityRenamingMap[response.data.data.District] ||
          response.data.data.District;

        setFormData((prev) => ({
          ...prev,
          sstate: response.data.data.State,
          scity: renamedCity, // Set the renamed city name here
        }));

        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
      errorMsg("", "");
    } catch (error) {
      const status = error.response?.data?.status;
      errorMsg("", "");
      if (status === 400) {
        toast.error(error.response.data.msg || "A server error occurred.");
        if (error.response.data.key) {
          errorMsg(error.response.data.key, error.response.data.msg);
        }
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setCheckPinCode(false);
    }
  };
  // Function to handle changes in form inputs
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (
      name === "salterphone" ||
      name === "sguardianphone" ||
      name === "swhatsapp"
    ) {
      value = sliceLength(value, 10, "number");
    }
    if (name === "sabcid") {
      value = sliceLength(value, 12, "");
    }
    if (name === "saadhaar") {
      value = sliceLength(value, 12, "number");
    }
    if (name === "spincode") {
      value = sliceLength(value, 6, "number");
    }
    if (name === "spincode") {
      const value = e.target.value.replace(/[^0-9]/g, "");

      if (value.length > 5) {
        fetchPinCodeStateCity(value);
      }
    }
    setFormData({
      ...formData,
      [name]: value, // Updating formData state dynamically based on input name.
    });
  };

  // Function to handle file input changes and previews
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Accessing the uploaded file.
    const { id } = e.target; // Getting the input field ID.

    if (!file) return; // If no file is uploaded, exit.

    // Validate and preview the uploaded image
    if (file.type.startsWith("image/")) {
      if (id === "spic") {
        setPreviewSpic(URL.createObjectURL(file)); // Generate preview URL for the photo.
        setFormData((formData) => ({ ...formData, spic: file })); // Update formData with the photo file.
      }
      if (id === "ssign") {
        setPreviewSsign(URL.createObjectURL(file)); // Generate preview URL for the signature.
        setFormData((formData) => ({ ...formData, ssign: file })); // Update formData with the signature file.
      }
      if (id === "aadhaarfront") {
        setPreviewAadhaarFront(URL.createObjectURL(file)); // Generate preview URL for Aadhaar front.
        setFormData((formData) => ({ ...formData, aadhaarfront: file })); // Update formData with Aadhaar front file.
      }
      if (id === "aadhaarback") {
        setPreviewAadhaarBack(URL.createObjectURL(file)); // Generate preview URL for Aadhaar back.
        setFormData((formData) => ({ ...formData, aadhaarback: file })); // Update formData with Aadhaar back file.
      }
    } else {
      toast.error(
        "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
      ); // Display error for invalid file format.
    }
  };
  const sliceLength = (value, length, type) => {
    if (type === "number") {
      // Extract only the digits and slice them to the specified length
      const newValue = value.replace(/\D+/g, ""); // \D+ removes all non-digit characters
      return newValue.slice(0, length); // Slice the number string to the specified length
    } else {
      // Return the original value if it's not a number
      return value.slice(0, length);
    }
  };

  // useEffect to fetch student data if student ID exists
  useEffect(() => {
    if (sid) {
      studentRecordById(sid).then((res) => {
        if (res.length > 0) {
          setstudent(res[0]); // Set fetched student data in state.
          setFormData((formData) => ({
            ...formData,
            sname: res[0].sname,
            semail: res[0].semail,
            sphone: res[0].sphone,
            salterphone: res[0].salterphone,
            sdob: res[0].sdob,
            sfather: res[0].sfather,
            smother: res[0].smother,
            sgender: res[0].sgender,
            sreligion: res[0].sreligion,
            scategory: res[0].scategory,
            scaste: res[0].scaste,
            ssubcaste: res[0].ssubcaste,
            swhatsapp: res[0].swhatsapp,
            sabcid: res[0].sabcid,
            saadhaar: res[0].saadhaar,
            saddress: res[0].saddress,
            spincode: res[0].spincode,
            scity: res[0].scity,
            sstate: res[0].sstate,
            spic: res[0].spic,
            hspic: res[0].spic,
            ssign: res[0].ssign,
            hssign: res[0].ssign,
            aadhaarfront: res[0].aadhaarfront,
            haadhaarfront: res[0].aadhaarfront,
            aadhaarback: res[0].aadhaarback,
            haadhaarback: res[0].aadhaarback,
            sguardianphone: res[0].sguardianphone,
          }));
          if (res[0].spincode) {
            setShowCourseLink(true);
          }
          if (res[0].spic) {
            setPreviewSpic(
              `${FILE_API_URL}/student/${res[0].id}${res[0].registrationNo}/${res[0].spic}`
            );
          }
          if (res[0].ssign) {
            setPreviewSsign(
              `${FILE_API_URL}/student/${res[0].id}${res[0].registrationNo}/${res[0].ssign}`
            );
          }
          if (res[0].aadhaarfront) {
            setPreviewAadhaarFront(
              `${FILE_API_URL}/student/${res[0].id}${res[0].registrationNo}/${res[0].aadhaarfront}`
            );
          }
          if (res[0].aadhaarback) {
            setPreviewAadhaarBack(
              `${FILE_API_URL}/student/${res[0].id}${res[0].registrationNo}/${res[0].aadhaarback}`
            );
          }
        }
      });
    }
  }, [sid]); // Dependency array ensures effect runs when sid changes.
  const handleSubmit = async (e) => {
    e.preventDefault();
    errorMsg("", "");
    setIsSubmit(true);
    const requiredFields = [
      { key: "spic", message: "Please upload the photo." },
      { key: "ssign", message: "Please upload the signature." },
      { key: "sname", message: "Please enter the full name." },
      { key: "sdob", message: "Please enter the date of birth." },
      { key: "sfather", message: "Please enter the father's name." },
      { key: "smother", message: "Please enter the mother's name." },
      { key: "sgender", message: "Please select the gender." },
      { key: "sreligion", message: "Please select the religion." },
      { key: "scategory", message: "Please select the category." },
      { key: "scaste", message: "Please enter the caste." },
      { key: "ssubcaste", message: "Please enter the sub caste." },
      {
        key: "sguardianphone",
        message: "Please enter the guardian's phone number.",
      },
      { key: "sabcid", message: "Please enter the ABC ID." },
      { key: "saadhaar", message: "Please enter the Aadhaar number." },
      {
        key: "aadhaarfront",
        message: "Please upload the Aadhaar front image.",
      },
      { key: "aadhaarback", message: "Please upload the Aadhaar back image." },
      { key: "saddress", message: "Please enter the address." },
      { key: "spincode", message: "Please enter the pin code." },
      { key: "sstate", message: "Please select the state." },
      { key: "scity", message: "Please enter the city." },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key]) {
        toast.error(field.message);
        errorMsg(field.key, field.message);
        setIsSubmit(false);
        return;
      }
    }

    const sendFormData = new FormData();
    for (let key in formData) {
      sendFormData.append(key, formData[key]);
    }
    sendFormData.append("data", "admupdatestudentdata");
    sendFormData.append("aadhaarback", formData.aadhaarback);
    sendFormData.append("aadhaarfront", formData.aadhaarfront);
    sendFormData.append("spic", formData.spic);
    sendFormData.append("ssign", formData.ssign);
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("sid", sid); // Append student ID to the form data for update
    try {
      // submit to the API here
      const response = await axios.post(
        `${PHP_API_URL}/StudentSet.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 200) {
        toast.success(response.data.msg);
       
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      errorMsg("", "");
      setIsSubmit(false);
      if (status === 400 || status === 401 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
        if (error.response.data.key) {
          errorMsg(error.response.data.key, error.response.data.msg);
        }
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };
  // Component's render output
  return (
    <>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Personal Details Section */}
              <div className="col-md-12 mt-2 mb-3">
                <h6 className="custom">
                  <span className="custo-head">Personal Details</span>
                </h6>
              </div>

              {/* Photo Upload */}
              <div className="form-group mb-3 col-md-6">
                <label>
                  Photo{" "}
                  <strong className="text-danger">
                    (.jpg, .jpeg, .png, .webp)
                  </strong>
                </label>
                <input
                  type="file"
                  id="spic"
                  name="spic"
                  accept=".png, .jpg, .jpeg, .webp"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <div className="text-danger">
                  {errors.field === "spic" && errors.msg}
                </div>
                {previewSpic && (
                  <img
                    src={previewSpic}
                    alt="Preview"
                    className="preview-image mt-3"
                  />
                )}
              </div>

              {/* Signature Upload */}
              <div className="form-group mb-3 col-md-6">
                <label>
                  Signature{" "}
                  <strong className="text-danger">
                    (.jpg, .jpeg, .png, .webp)
                  </strong>
                </label>
                <input
                  type="file"
                  id="ssign"
                  name="ssign"
                  accept=".png, .jpg, .jpeg, .webp"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <div className="text-danger">
                  {errors.field === "ssign" && errors.msg}
                </div>
                {previewSsign && (
                  <img
                    src={previewSsign}
                    alt="Preview"
                    className="preview-image mt-3"
                  />
                )}
              </div>

              {/* Name Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "sname"} // Highlight border if there's an error.
                errorMessage={errors.field === "sname" && errors.msg} // Display error message if applicable.
                label="Full Name"
                required={true}
                name="sname"
                id="sname"
                value={formData.sname}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Email Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "semail"} // Highlight border if there's an error.
                errorMessage={errors.field === "semail" && errors.msg} // Display error message if applicable.
                label="Email"
                type="email"
                name="semail"
                id="semail"
                readOnly={true}
                value={formData.semail}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Phone No Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "sphone"} // Highlight border if there's an error.
                errorMessage={errors.field === "sphone" && errors.msg} // Display error message if applicable.
                label="Phone No"
                type="tel"
                name="sphone"
                id="sphone"
                readOnly={true}
                value={formData.sphone}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Alternate Phone No Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "salterphone"} // Highlight border if there's an error.
                errorMessage={errors.field === "salterphone" && errors.msg} // Display error message if applicable.
                label="Alternate Phone No"
                type="tel"
                name="salterphone"
                id="salterphone"
                value={formData.salterphone}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Date Of Birth Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "sdob"} // Highlight border if there's an error.
                errorMessage={errors.field === "sdob" && errors.msg} // Display error message if applicable.
                label="Date Of Birth"
                type="date"
                name="sdob"
                id="sdob"
                required={true}
                value={formData.sdob}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Father's Name Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "sfather"} // Highlight border if there's an error.
                errorMessage={errors.field === "sfather" && errors.msg} // Display error message if applicable.
                label="Father's Name"
                name="sfather"
                id="sfather"
                required={true}
                value={formData.sfather}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Mother's Name Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "smother"} // Highlight border if there's an error.
                errorMessage={errors.field === "smother" && errors.msg} // Display error message if applicable.
                label="Mother's Name"
                name="smother"
                id="smother"
                required={true}
                value={formData.smother}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              <div className="col-md-4 form-group mb-3">
                <label htmlFor="sgender" className="font-weight-semibold">
                  Gender <strong className="text-danger">*</strong>
                </label>
                <select
                  name="sgender"
                  id="sgender"
                  value={formData.sgender}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <span className="text-danger">
                  {errors.field === "sgender" && errors.msg}
                </span>
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="sreligion" className="font-weight-semibold">
                  Religion <strong className="text-danger">*</strong>
                </label>
                <select
                  name="sreligion"
                  id="sreligion"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.sreligion} // Binding selected value to state
                >
                  <option value="">Select</option>
                  <option value="hindu">Hindu</option>
                  <option value="muslim">Muslim</option>
                  <option value="christianity">Christianity</option>
                  <option value="buddhism">Buddhism</option>
                  <option value="other">Other</option>
                </select>
                <span className="text-danger">
                  {errors.field === "sreligion" && errors.msg}
                </span>
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="scategory" className="font-weight-semibold">
                  Category <strong className="text-danger">*</strong>
                </label>
                <select
                  name="scategory"
                  id="scategory"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.scategory} // Binding selected value to state
                >
                  <option value="">Select</option>
                  <option value="General">General</option>
                  <option value="Obc">Obc</option>
                  <option value="Sc">Sc</option>
                  <option value="St">St</option>
                  <option value="Ews">Ews</option>
                </select>
                <span className="text-danger">
                  {errors.field === "scategory" && errors.msg}
                </span>
              </div>
              {/* Caste Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "scaste"} // Highlight border if there's an error.
                errorMessage={errors.field === "scaste" && errors.msg} // Display error message if applicable.
                label="Caste"
                name="scaste"
                id="scaste"
                required={true}
                value={formData.scaste}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Sub Caste Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "ssubcaste"} // Highlight border if there's an error.
                errorMessage={errors.field === "ssubcaste" && errors.msg} // Display error message if applicable.
                label="Sub Caste"
                name="ssubcaste"
                id="ssubcaste"
                required={true}
                value={formData.ssubcaste}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Whatsapp No Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "swhatsapp"} // Highlight border if there's an error.
                errorMessage={errors.field === "swhatsapp" && errors.msg} // Display error message if applicable.
                label="Whatsapp No"
                name="swhatsapp"
                id="swhatsapp"
                value={formData.swhatsapp}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Guardian Phone No Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "sguardianphone"} // Highlight border if there's an error.
                errorMessage={errors.field === "sguardianphone" && errors.msg} // Display error message if applicable.
                label="Guardian Phone No"
                name="sguardianphone"
                id="sguardianphone"
                required={true}
                value={formData.sguardianphone}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* ABC Id Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "sabcid"} // Highlight border if there's an error.
                errorMessage={errors.field === "sabcid" && errors.msg} // Display error message if applicable.
                label="ABC Id"
                name="sabcid"
                id="sabcid"
                required={true}
                value={formData.sabcid}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Aadhaar No Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "saadhaar"} // Highlight border if there's an error.
                errorMessage={errors.field === "saadhaar" && errors.msg} // Display error message if applicable.
                label="Aadhaar No"
                name="saadhaar"
                id="saadhaar"
                required={true}
                value={formData.saadhaar}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              {/* Aadhaar Front Image Upload */}
              <div className="form-group mb-3 col-md-4">
                <label>
                  Aadhaar Front Image{" "}
                  <strong className="text-danger">
                    * (.jpg, .jpeg, .png, .webp)
                  </strong>
                </label>
                <input
                  type="file"
                  id="aadhaarfront"
                  name="aadhaarfront"
                  accept=".png, .jpg, .jpeg, .webp"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <span className="text-danger">
                  {errors.field === "aadhaarfront" && errors.msg}
                </span>
                {previewAadhaarFront && (
                  <img
                    src={previewAadhaarFront}
                    alt="Preview"
                    className="preview-image mt-3"
                  />
                )}
              </div>
              {/* Aadhaar Back Image Upload */}
              <div className="form-group mb-3 col-md-4">
                <label>
                  Aadhaar Back Image{" "}
                  <strong className="text-danger">
                    * (.jpg, .jpeg, .png, .webp)
                  </strong>
                </label>
                <input
                  type="file"
                  id="aadhaarback"
                  name="aadhaarback"
                  accept=".png, .jpg, .jpeg, .webp"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <span className="text-danger">
                  {errors.field === "aadhaarback" && errors.msg}
                </span>
                {previewAadhaarBack && (
                  <img
                    src={previewAadhaarBack}
                    alt="Preview"
                    className="preview-image mt-3"
                  />
                )}
              </div>
              <div className="col-md-12 mt-2 mb-3">
                <h6 className="custom">
                  <span className="custo-head">Address</span>
                </h6>
              </div>
              {/* Address Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "saddress"} // Highlight border if there's an error.
                errorMessage={errors.field === "saddress" && errors.msg} // Display error message if applicable.
                label="Address"
                name="saddress"
                id="saddress"
                required={true}
                value={formData.saddress}
                column="col-md-12 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              <div className="col-md-4">
                <div className="row px-0">
                  {/* Pin Code Input Field */}
                  <FormField
                    bottom={true}
                    borderError={errors.field === "spincode"} // Highlight border if there's an error.
                    errorMessage={errors.field === "spincode" && errors.msg} // Display error message if applicable.
                    label="Pin Code"
                    name="spincode"
                    id="spincode"
                    required={true}
                    value={formData.spincode}
                    column="col-md-10 mb-0"
                    onChange={handleChange} // Handle input change.
                  />
                  <div className="col-md-2 d-flex justify-content-center align-items-center">
                    {checkPinCode && (
                      <>
                        &nbsp;{" "}
                        <div
                          className="loader-circle"
                          style={{ width: "40px", height: "40px" }}
                        ></div>
                      </>
                    )}
                  </div>
                  {checkPinCode && (
                    <div className="col-md-12">
                      <span className="text-warning">
                        Please wait, fetching state and district details...
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* State Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "sstate"} // Highlight border if there's an error.
                errorMessage={errors.field === "sstate" && errors.msg} // Display error message if applicable.
                label="State"
                name="sstate"
                id="sstate"
                list="gdlist"
                required={true}
                value={formData.sstate}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              <datalist id="gdlist">
                {indianStates.map((state) => (
                  <option value={state} key={state} />
                ))}
              </datalist>
              {/* City Input Field */}
              <FormField
                bottom={true}
                borderError={errors.field === "scity"} // Highlight border if there's an error.
                errorMessage={errors.field === "scity" && errors.msg} // Display error message if applicable.
                label="City"
                name="scity"
                id="scity"
                required={true}
                value={formData.scity}
                column="col-md-4 form-group mb-3"
                onChange={handleChange} // Handle input change.
              />
              <div className="col-md-12 col-lg-12 col-12 d-flex">
                <button
                  disabled={isSubmit}
                  className="btn btn-dark btn-block"
                  type="submit"
                >
                  Update{" "}
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
    </>
  );
}

export default PersonalDetail;
