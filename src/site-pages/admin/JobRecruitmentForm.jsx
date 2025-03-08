import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  PHP_API_URL,
  CKEDITOR_URL,
} from "../../site-components/Helper/Constant";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor
import secureLocalStorage from "react-secure-storage";
const JobRecruitmentForm = () => {
  const { id } = useParams();
  const [errorKey, setErrorKey] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [category, setCategory] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [minExperienceList, setMinExperienceList] = useState([]);
  const [loading, setLoading] = useState();
  const config = useMemo(()=>({
    readonly: false,
    placeholder: "Enter your content here...",
    spellcheck: true,
    language: "en",
    defaultMode: "1",
    minHeight: 400,
    maxHeight: -1,
    defaultActionOnPaste: "insert_as_html",
    defaultActionOnPasteFromWord: "insert_as_html",
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
  }),[]);
  const initialization = {
    data: "savejobpost",
    job_category: "",
    position: "",
    job_type: "",
    vacancy: "",
    job_experience: "",
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
 
  const updateCategory = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      job_category: e.value,
    }));
  };
  const updateJobType = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      job_type: e.value,
    }));
  };

  const updateMinExp = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      job_experience: e.value,
    }));
  };

  const loadCategory = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_jobCategory");

      const response = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const tempCat = response.data.data.map((dep) => ({
        value: dep.id,
        label: dep.cat_title,
      }));

      setCategory(tempCat);
    } catch (error) {
      setCategory([]);
    } finally {
      setLoading(false);
    }
  };
  const loadJobType = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "getJobType");

      const response = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const tempCat = response.data.data.map((type) => ({
        value: type,
        label: type,
      }));

      setJobTypes(tempCat);
    } catch (error) {
      setJobTypes([]);
    } finally {
      setLoading(false);
    }
  };
  const loadJobExperience = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "getJobExperience");

      const response = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const tempCat = response.data.data.map((type) => ({
        value: type,
        label: type,
      }));

      setMinExperienceList(tempCat);
    } catch (error) {
      setMinExperienceList([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      await loadCategory();
      await loadJobType();
      await loadJobExperience();
      if (id) {
        getInternshipDetail();
      }
    };

    loadData();
  }, []);

  const getInternshipDetail = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getJobById");
      bformData.append("id", id);
      const result = await axios.post(
        `${PHP_API_URL}/recrutment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedFormData = {
        updateid: id,
        job_category: result?.data?.data[0]?.job_category,
        position: result?.data?.data[0]?.position,
        job_type: result?.data?.data[0]?.job_type,
        vacancy: result?.data?.data[0]?.vacancy,
        job_experience: result?.data?.data[0]?.job_experience,
        post_date: result?.data?.data[0]?.post_date,
        post_last_date: result?.data?.data[0]?.post_last_date,
        gender: result?.data?.data[0]?.gender,
        state: result?.data?.data[0]?.state,
        city: result?.data?.data[0]?.city,
        address: result?.data?.data[0]?.address,
        education_level: result?.data?.data[0]?.education_level,
        salary_starting: result?.data?.data[0]?.salary_starting,
        salary_to: result?.data?.data[0]?.salary_to,
        description: validator.unescape(
          result?.data?.data[0]?.description || ""
        ),
      };
      setFormData((prev) => ({ ...prev, ...updatedFormData }));
    } catch (error) {}
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!formData.job_category) {
      setErrorMessage("Please select job category");
      toast.error("Please select job category");
      setErrorKey(".job_category");
      isValid = false;
    } else if (!formData.position) {
      setErrorMessage("Please enter position");
      toast.error("Please enter position");
      setErrorKey(".position");
      isValid = false;
    } else if (!formData.job_type) {
      setErrorMessage("Please select job type");
      toast.error("Please select job type");
      setErrorKey(".job_type");
      isValid = false;
    } else if (!formData.vacancy) {
      setErrorMessage("Please enter number of vacancy");
      toast.error("Please enter number of vacancy");
      setErrorKey(".vacancy");
      isValid = false;
    } else if (!formData.job_experience) {
      setErrorMessage("Please select job experience");
      toast.error("Please select job experience");
      setErrorKey(".job_experience");
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

    if (isValid) {
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
      bformData.append("data", "savejobpost");
      // Log FormData using FormData.entries()
      try {
        const response = await axios.post(
          `${PHP_API_URL}/recrutment.php`,
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
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="">
            <nav className="breadcrumb">
            <a href="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>

              <span className="breadcrumb-item active">Recruitment</span>

              <span className="breadcrumb-item active">Job</span>
            </nav>
          </div>
          <div className="card bg-transparent mb-2">
            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
              <h5 className="card-title h6_new"> {id ? "Update Job" : "Add New Job"}</h5>
              <div className="ml-auto id-mobile-go-back">
                <Button
                  variant="light"
                  className="mb-2 mb-md-0 goback"
                  onClick={() => window.history.back()}
                >
                  <i className="fas">
                    <FaArrowLeft />
                  </i>{" "}
                  Go Back
                </Button>
                <Link
                  to="/admin/job-recruitment"
                  className="ml-2 btn-md btn border-0 btn-secondary"
                >
                  <i className="fas fa-list" /> Job List
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
                        htmlFor="job_category"
                      >
                        Select Category <span className="text-danger">*</span>
                      </label>
                      <Select
                        value={category?.find(
                          (cat) => cat?.value == formData?.job_category
                        )}
                        options={category}
                        onChange={updateCategory}
                      />

                      {errorKey === ".job_category" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>

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
                      <label
                        className="font-weight-semibold"
                        htmlFor="job_type"
                      >
                        Job Type <span className="text-danger">*</span>
                      </label>

                      <Select
                        options={jobTypes}
                        value={jobTypes?.find(
                          (job) => job?.value == formData?.job_type
                        )}
                        onChange={updateJobType}
                      />

                      {errorKey === ".job_type" && (
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
                        htmlFor="job_experience"
                      >
                        Select Min Experience{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        value={minExperienceList?.find(
                          (ele) => ele.value == formData?.job_experience
                        )}
                        options={minExperienceList}
                        onChange={updateMinExp}
                      />

                      {errorKey === ".job_experience" && (
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
                        placeholder="Enter Minimum Salary"
                        value={formData.salary_to}
                        onChange={handleChange}
                      />
                      {errorKey === ".salary_to" && (
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

                    <div className="form-group col-md-12">
                      <label className="font-weight-semibold" htmlFor="address">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        placeholder="Enter Address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errorKey === ".address" && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                    <div className="form-group col-md-12">
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
                    


                    <div className="col-md-12">
                    {/* JoditEditor component */}
                    <label className="font-weight-semibold">
                      Description <span className="text-danger">*</span>
                    </label>
                    <JoditEditor
                      value={validator.unescape(formData?.description) || ""}
                      config={config}
                      onBlur={(newContent) => {
                        setFormData((prev) => ({
                          ...prev,
                          description: newContent,
                        }));
                      }}
                    />
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

export default JobRecruitmentForm;
