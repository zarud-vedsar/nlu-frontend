import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { goBack } from "../../site-components/Helper/HelperFunction";
import axios from "axios";
import {
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const AddScholarship = () => {
  const { id } = useParams();
  const initialForm = {
    title: "",
    eligibility: "",
    application_link: "",
    deadline_date: "",
    upload_file: "",
    hiddenfile: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [isSubmit, setIsSubmit] = useState(false);
  const [html, sethtml] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 

  const getScholarship = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_scholarship_by_id");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/scholarship.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setFormData({
          title: response.data.data[0].title,
          eligibility: response.data.data[0].eligibility,
          application_link: response.data.data[0].application_link,
          deadline_date: response.data.data[0].deadline_date?.split(" ")[0],
          upload_file: response.data?.data[0]?.upload_file,

          hiddenfile: response.data?.data[0]?.upload_file,
        });
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  useEffect(() => {
    if (id) {
      getScholarship();
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;
    if (id === "upload_file") {
      if (file.type.startsWith("")) {
        setFormData((formData) => ({ ...formData, upload_file: file }));
      } else {
        toast.error(
          "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (!formData.title) {
      toast.error("Titile is required.");
      return setIsSubmit(false);
    }
    if (!formData.eligibility) {
      toast.error("Eligibility is required.");
      return setIsSubmit(false);
    }
    if (!formData.application_link) {
      toast.error("Apply link  is required.");
      return setIsSubmit(false);
    }

    if (!formData.upload_file) {
      toast.error("File is required.");
      return setIsSubmit(false);
    }
    if (!formData.deadline_date) {
      toast.error("Deadline is required.");
      return setIsSubmit(false);
    }

    const sendFormData = new FormData();
    sendFormData.append("data", "scholarship_add");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    if (id) {
      sendFormData.append("updateid", id);
    }

    Object.keys(formData).map((key)=>{
      if(formData[key]){
      sendFormData.append(key, formData[key]);
      }
    })
    
  
    


    try {
      const response = await axios.post(
        `${PHP_API_URL}/scholarship.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      

      if (response.data?.status === 201 || response.data?.status === 200) {
        toast.success(response.data.msg);
        setFormData(initialForm);
        sethtml("");
        if (response.data?.status === 200) {
          window.history.back();
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      if (status === 400 || status === 500) {
        

        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-0">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash">
              <a href="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>

              <span className="breadcrumb-item active">Student Corner</span>
                <span className="breadcrumb-item active">Scholarship</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent mb-2  mx-auto">
            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
              <h5 className="card-title h6_new">
                {id ? "Update Scholarship" : "Add New Scholarship"}
              </h5>
              <div className="ml-auto id-mobile-go-back">
                <button
                  className="mr-auto btn-md btn border-0 btn-light mr-2"
                  onClick={() => goBack()}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link to="/admin/scholarship">
                  <button className="ml-auto btn-md btn border-0 btn-primary mr-2">
                    <i className="fa-solid fa-list"></i> Scholarship List
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Title"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label>
                          Eligibility <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="eligibility"
                          placeholder="Enter Eligibility"
                          value={formData.eligibility}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6 ">
                        <label>
                          File <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          id="upload_file"
                          accept=".pdf"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                      </div>

                      <div className="col-md-6 ">
                        <label
                          className="font-weight-semibold"
                          htmlFor="deadline_date"
                        >
                          Deadline <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="deadline_date"
                          value={formData.deadline_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-12">
                        <label>
                          Link <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="application_link"
                          placeholder="Enter Link"
                          value={formData.application_link}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-12 col-12">
                  <button
                    className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                    type="submit"
                  >
                    Save{" "}
                    {isSubmit && (
                      <>
                        &nbsp; <div className="loader-circle"></div>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddScholarship;
