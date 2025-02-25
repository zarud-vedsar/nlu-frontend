import React, { useState, useEffect,useMemo } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { PHP_API_URL, CKEDITOR_URL } from "../../site-components/Helper/Constant";
import { toast, } from "react-toastify";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import validator from "validator";
import JoditEditor from "jodit-react"; // Import Jodit editor
const UpdateCourseContent = () => {
  const { id } = useParams();
  const [sllaybus, setSllaybus] = useState("");
  const [seminar, setSeminar] = useState("");
  const [activity, setActivity] = useState("");
  const [timetable, setTimetable] = useState("");
  const [feeStructure, setFeeStructure] = useState("");
  const getDetail = async (data, id) => {
    const bformData = new FormData();
    bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
    bformData.append("login_type", secureLocalStorage.getItem("loginType"));
    bformData.append("data", data);
    bformData.append("course_id", id);
    try {
      const response = await axios.post(`${PHP_API_URL}/course.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status === 200) {
        const fieldMapping = {
          load_sllaybus: 'sllaybus',
          load_seminar: 'seminar',
          load_activity: 'activity',
          load_timetable: 'timetable',
          load_feestructure: 'fee_structure'
        };
        const field = fieldMapping[data];
        if (field) {
          switch (data) {
            case "load_sllaybus":
              setSllaybus(validator.unescape(response.data.data[0][field] || ""));
              break;
            case "load_seminar":
              setSeminar(validator.unescape(response.data.data[0][field] || ""));
              break;
            case "load_activity":
              setActivity(validator.unescape(response.data.data[0][field] || ""));
              break;
            case "load_timetable":
              setTimetable(validator.unescape(response.data.data[0][field] || ""));
              break;
            case "load_feestructure":
              setFeeStructure(validator.unescape(response.data.data[0][field] || ""));
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error("An error occurred. Please check your connection or try again.");
      }
    }
  };
  useEffect(() => {
    const content = [
      "load_sllaybus",
      "load_seminar",
      "load_activity",
      "load_timetable",
      "load_feestructure",
    ];
    const fetchData = async () => {
      try {
        await Promise.all(content.map(data => getDetail(data, id)));
      } catch (error) {
        console.error("Error in fetching details", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (fieldName) => {
    const sendFormData = new FormData();
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("course_id", id);
    switch (fieldName) {
      case "sllaybus":
        sendFormData.append("sllaybus", sllaybus);
        sendFormData.append("data", "sllaybus_update");
        break;
      case "seminar":
        sendFormData.append("seminar", seminar);
        sendFormData.append("data", "seminar_update");
        break;
      case "activity":
        sendFormData.append("activity", activity);
        sendFormData.append("data", "activity_update");
        break;
      case "timetable":
        sendFormData.append("timetable", timetable);
        sendFormData.append("data", "timetable_update");
        break;
      case "feeStructure":
        sendFormData.append("fee_structure", feeStructure);
        sendFormData.append("data", "feestructure_update");
        break;
    }
    try {
      const response = await axios.post(
        `${PHP_API_URL}/course.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response.data?.status;
      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  // Jodit editor configuration
const config = useMemo(()=>({
    readonly: false,
    placeholder: 'Enter your description here...',
    spellcheck: true,
    defaultMode: '1',
    minHeight: 400,
    maxHeight: -1,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
    language: 'en',
  }),[]);
  return (
    <>
      <div className="page-container ">
        <div className="main-content">
          <div className=" mb-0 mt-0">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash ">
                <a href="./" className="breadcrumb-item  ">
                  <i className="anticon  m-r-5 "></i>Academic
                </a>
                <a href="./" className="breadcrumb-item  ">
                  <i className="anticon  m-r-5 "></i>Course
                </a>

                <span className="breadcrumb-item active">Update Content</span>
              </nav>
            </div>
          </div>

          <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
            <h2 className="card-title col-12 col-md-auto">Update Content</h2>
            <div className="col-12 col-md-auto d-flex justify-content-end">
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
          <div className="card">
            <div className="">
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 mt-2 mb-3">
                    <h6 className="custom">
                      <span className="custo-head">Syllabus</span>
                    </h6>
                  </div>
                  <div className="col-md-12">
                    <JoditEditor
                      value={sllaybus || ''}
                      config={config}
                      onChange={(newContent) => setSllaybus(newContent)}
                    />
                  </div>

                  <div className="col-md-12 me-auto d-flex justify-content-between align-items-center mt-3">
                    <button
                      type="submit"
                      className="btn btn-dark btn-block"
                      onClick={() => handleSubmit("sllaybus")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="">
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 mt-2 mb-3">
                    <h6 className="custom">
                      <span className="custo-head">Seminar</span>
                    </h6>
                  </div>
                  <div className="col-md-12 ">
                    <JoditEditor
                      value={seminar || ''}
                      config={config}
                      onChange={(newContent) => setSeminar(newContent)}
                    />
                  </div>

                  <div className="col-md-12 me-auto d-flex justify-content-between align-items-center mt-3">
                    <button
                      type="submit"
                      className="btn btn-dark btn-block"
                      onClick={() => handleSubmit("seminar")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="">
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 mt-2 mb-3">
                    <h6 className="custom">
                      <span className="custo-head">Activity</span>
                    </h6>
                  </div>
                  <div className="col-md-12 ">
                    <JoditEditor
                      value={activity || ''}
                      config={config}
                      onChange={(newContent) => setActivity(newContent)}
                    />
                  </div>
                  <div className="col-md-12 me-auto d-flex justify-content-between align-items-center mt-3">
                    <button
                      type="submit"
                      className="btn btn-dark btn-block"
                      onClick={() => handleSubmit("activity")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="">
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 mt-2 mb-3">
                    <h6 className="custom">
                      <span className="custo-head">Time Table</span>
                    </h6>
                  </div>
                  <div className="col-md-12">
                    <JoditEditor
                      value={timetable || ''}
                      config={config}
                      onChange={(newContent) => setTimetable(newContent)}
                    />
                  </div>
                  <div className="col-md-12 me-auto d-flex justify-content-between align-items-center mt-3">
                    <button
                      type="submit"
                      className="btn btn-dark btn-block"
                      onClick={() => handleSubmit("timetable")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="">
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 mt-2 mb-3">
                    <h6 className="custom">
                      <span className="custo-head">Fee Structure</span>
                    </h6>
                  </div>
                  <div className="col-md-12">
                    <JoditEditor
                      value={feeStructure || ''}
                      config={config}
                      onChange={(newContent) => setFeeStructure(newContent)}
                    />
                  </div>

                  <div className="col-md-12 me-auto d-flex justify-content-between align-items-center mt-3">
                    <button
                      type="submit"
                      className="btn btn-dark btn-block"
                      onClick={() => handleSubmit("feeStructure")}
                    >
                      Save
                    </button>
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

export default UpdateCourseContent;
