


import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { PHP_API_URL, CKEDITOR_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor

const AddInternshipForm = () => {
  const { id } = useParams();

  const [errorKey, setErrorKey] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const initialization = {
    data: "internship_add",
    position: "",
    job_type: "",
    vacancy: "",
    post_date: "",
    post_last_date: "",
    gender: "",
    state: "",
    city: "",
    address: "",
    education_level: "",
    salary_starting: "",
    salary_to: "",
    description: "",
  };
  const [formData, setFormData] = useState(initialization);
  // Jodit editor configuration
  const config = {
    readonly: false,
    placeholder: 'Enter your description here...',
    spellcheck: true,
    language: 'pt_br',
    defaultMode: '1',
    minHeight: 400,
    maxHeight: -1,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
  };
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        getInternshipDetail();
      }
    };

    loadData();
  }, []);
  const getInternshipDetail = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_internship_by_id");
      bformData.append("id", id);
      const result = await axios.post(
        `${PHP_API_URL}/internship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedFormData = {
        updateid: id,
        position: result?.data?.data[0]?.position,
        job_type: result?.data?.data[0]?.job_type,
        vacancy: result?.data?.data[0]?.vacancy,
        post_date: result?.data?.data[0]?.post_date,
        post_last_date: result?.data?.data[0]?.post_last_date,
        gender: result?.data?.data[0]?.gender,
        state: result?.data?.data[0]?.state,
        city: result?.data?.data[0]?.city,
        address: result?.data?.data[0]?.address,
        education_level: result?.data?.data[0]?.education_level,
        salary_starting: result?.data?.data[0]?.salary_starting,
        salary_to: result?.data?.data[0]?.salary_to,
        description: validator.unescape(result?.data?.data[0]?.description || ""),
      };
      setFormData((prev) => ({ ...prev, ...updatedFormData }));


      if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
        window.CKEDITOR.instances['editor1'].setData(
          validator.unescape(validator.unescape(result?.data?.data[0].description)) // Ensure content is unescaped properly
        );
      }
    } catch (error) {
    } finally {
    }
  };

  const handleChange = async (e) => {
    const { name, value, type } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!formData.position) {
      setErrorMessage("Please enter position");
      toast.error("Please enter position");
      setErrorKey(".position");
      isValid = false;
    } else if (!formData.vacancy) {
      setErrorMessage("Please enter number of vacancy");
      toast.error("Please enter number of vacancy");
      setErrorKey(".vacancy");
      isValid = false;
    } else if (!formData.post_date) {
      setErrorMessage("Please pick post date");
      toast.error("Please pick post date");
      setErrorKey(".post_date");
      isValid = false;
    } else if (!formData.post_last_date) {
      setErrorMessage("Please pick last date to apply");
      toast.error("Please pick last date to apply");
      setErrorKey(".post_last_date");
      isValid = false;
    } else if (!formData.gender) {
      setErrorMessage("Please select gender");
      toast.error("Please select gender");
      setErrorKey(".gender");
      isValid = false;
    } else if (!formData.state) {
      setErrorMessage("Please enter state");
      toast.error("Please enter state");
      setErrorKey(".state");
      isValid = false;
    } else if (!formData.city) {
      setErrorMessage("Please enter city");
      toast.error("Please enter city");
      setErrorKey(".city");
      isValid = false;
    } else if (!formData.address) {
      setErrorMessage("Please enter address");
      toast.error("Please enter address");
      setErrorKey(".address");
      isValid = false;
    } else if (!formData.education_level) {
      setErrorMessage("Please enter education_level");
      toast.error("Please enter education_level");
      setErrorKey(".education_level");
      isValid = false;
    }

    if (isValid)  {
      setErrorMessage("");
      setErrorKey("");
    }
    if (isValid) {
      const bformData = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        bformData.append(key, value);
      });

      // bformData.append("description", formData["description"]);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "internship_add");

      // Log FormData using FormData.entries()

      try {
        const response = await axios.post(
          `${PHP_API_URL}/internship.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data?.status === 200 || response.data?.status === 201) {
          toast.success(response.data.msg);
          setFormData(initialization);
          if (response.data.status === 200) {
            window.history.back();
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        const status = error.response?.data?.status;

        if (status === 500) {
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
      }
    }
  };

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      description: newContent,
    }));
  }
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="">
            <nav className="breadcrumb breadcrumb-dash">
            <a href="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>

              <span className="breadcrumb-item active">Student Corner</span>

              <span className="breadcrumb-item active">Internship</span>
            </nav>
          </div>
          <div className="card bg-transparent mb-2">
            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
              <h5 className="card-title h6_new"> {id ? "Update Internship" : "Add New Internship"}</h5>
              <div className="ml-auto id-mobile-go-back">
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
                <Link
                  to="/admin/internship"
                  className="ml-2 btn-md btn border-0 btn-secondary"
                >
                  <i className="fas fa-list" /> Internship List
                </Link>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="">
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">


                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="position"
                      >
                        Position <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="position"
                        placeholder="Enter Position"
                        value={formData.position}
                        onChange={handleChange}
                      />
                      {errorKey === ".position" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>



                    <div className="form-group col-md-4">
                      <label className="font-weight-semibold" htmlFor="vacancy">
                        No. of Vacancy <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="vacancy"
                        placeholder="10"
                        value={formData.vacancy}
                        onChange={handleChange}
                      />
                      {errorKey === ".vacancy" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>



                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="post_date"
                      >
                        Post Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="post_date"
                        value={formData.post_date}
                        onChange={handleChange}
                      />
                      {errorKey === ".post_date" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="post_last_date"
                      >
                        Last date to apply{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="post_last_date"
                        value={formData.post_last_date}
                        onChange={handleChange}
                      />
                      {errorKey === ".post_last_date" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group col-md-4">
                      <label className="font-weight-semibold" htmlFor="gender">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        className="form-control"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="both">Both Male & Female</option>
                      </select>
                      {errorKey === ".gender" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="salary_starting"
                      >
                        {"Salary From: (Optional) "}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="salary_starting"
                        placeholder="Enter Minimum Salary"
                        value={formData.salary_starting}
                        onChange={handleChange}
                      />
                      {errorKey === ".salary_starting" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="salary_to"
                      >
                        {"Salary To: (Optional) "}{" "}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="salary_to"
                        placeholder="Enter Maximum Salary"
                        value={formData.salary_to}
                        onChange={handleChange}
                      />
                      {errorKey === ".salary_to" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        className="font-weight-semibold"
                        htmlFor="education_level"
                      >
                        Education Level <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="education_level"
                        placeholder="Enter Education Requirment"
                        value={formData.education_level}
                        onChange={handleChange}
                      />
                      {errorKey === ".education_level" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group col-md-4">
                      <label className="font-weight-semibold" htmlFor="state">
                        State <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        placeholder="Enter State"
                        value={formData.state}
                        onChange={handleChange}
                      />
                      {errorKey === ".state" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                    <div className="form-group col-md-4">
                      <label className="font-weight-semibold" htmlFor="city">
                        City <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                         placeholder="Enter City"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      {errorKey === ".city" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

                    <div className="form-group col-md-8">
                      <label className="font-weight-semibold" htmlFor="address">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                         placeholder="Enter Addressx"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errorKey === ".address" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>


                    <div className="form-group col-md-12">


                      <div className='col-md-12 px-0'>
                        <label className='font-weight-semibold'>Description</label>
                        <JoditEditor
                          value={formData?.description ? validator.unescape(formData.description) : ""}
                          config={config}
                          onBlur={handleEditorChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 me-auto d-flex justify-content-between align-items-center">
                      <button type="submit" className="btn btn-dark btn-block">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInternshipForm;
