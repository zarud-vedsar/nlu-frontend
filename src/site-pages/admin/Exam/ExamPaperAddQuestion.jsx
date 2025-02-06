import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import {
  NODE_API_URL,
 
} from "../../../site-components/Helper/Constant";
import validator from "validator";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Swal from "sweetalert2";
import JoditEditor from "jodit-react"; // Import Jodit editor

function AddExam() {
  const location = useLocation();
  const dbId = location?.state?.dbId;

  const initialFormData = {
    examDate: "",
    sessionId: "",
    examType: "",
    courseId: "",
    semesterId: "",
    subjectId: "",
    paperCode: "",
    timeDuration: "",
    maxMarks: "",
    password: "",
    instruction: "",
    section: [],
    pass: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [questionForm, setQuestionForm] = useState({
    examId: "",
    section: [
      {
        title: "A",
        question: "",
      },
    ],
  });


  const [isSubmit, setIsSubmit] = useState(false);
  const [isrefresh, setisrefresh] = useState(false);

  const config = {
    readonly: false, // set to true if you want readonly mode
  };


 

  // Fetch and set the session list
  const fetchSavedQuestion = async () => {
    try {
      const { data } = await axios.post(
        `${NODE_API_URL}/api/exam/paper/question-list`,
        {
          examId: dbId,
        }
      );
      if (data?.statusCode === 200 && data.data.length) {
        setQuestionForm((prev) => ({
          ...prev,
          examId: dbId,
        }));
        const questions = JSON.parse(data.data[0].questions);
        setQuestionForm((prev) => ({
          ...prev,
          section: prev.section.map((section) => ({
            ...section,
            question:
              questions.find((q) => q.title === section.title)?.question || "",
          })),
        }));
        setisrefresh(true);
      }
    } catch (error) {
      console.error("Error fetching saved questions", error);
    }
  };
  
  const fetchDataForUpdate = useCallback(async (id) => {
    if (!id || parseInt(id, 10) < 1) {
      toast.error("Invalid exam ID");
      return false;
    }
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/exam/paper/list`,
        { dbId: id }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        const fetchedData = response.data[0];
        setFormData({
          dbId: fetchedData.id,
          examDate: fetchedData.examDate?.split("T")[0] || "",
          sessionId: fetchedData.sessionId,
          examType: fetchedData.examType,
          courseId: fetchedData.courseId,
          semesterId: fetchedData.semesterId,
          subjectId: fetchedData.subjectId,
          paperCode: fetchedData.paperCode,
          timeDuration: fetchedData.timeDuration,
          maxMarks: fetchedData.maxMarks,
          instruction: fetchedData.instruction,
          section: JSON.parse(fetchedData.section),
          pass: 1,
        });
        const parsedSections = JSON.parse(fetchedData.section);
        setQuestionForm((prev) => ({
          ...prev,
          section: parsedSections.map((item) => ({
            title: item.title,
            question: "",
          })),
        }));
        setTimeout(() => {
          fetchSavedQuestion(dbId);
        }, 300);
      } else {
        toast.error("Data not found.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  }, []);

  const handleUpdate = useCallback(
    async (id) => {
      try {
        const { value: password } = await Swal.fire({
          title: "Enter Password to Edit Exam Details",
          input: "password",
          inputLabel: "Password",
          inputPlaceholder: "Enter your password",
          showCancelButton: true,
        });

        if (password) {
          const { data } = await axios.post(
            `${NODE_API_URL}/api/exam/paper/checkpass`,
            {
              dbId: id,
              password,
              loguserid: secureLocalStorage.getItem("login_id"),
              login_type: secureLocalStorage.getItem("loginType"),
            }
          );

          if (data?.statusCode === 200) {
            toast.success(data.message);
            fetchDataForUpdate(id);
          } else {
            toast.error(data?.message || "An error occurred.");
          }
        } else {
          Swal.fire("Password is required.");
        }
      } catch (error) {
        toast.error("A server error occurred.");
      }
    },
    [fetchDataForUpdate]
  );

  useEffect(() => {
    if (dbId && parseInt(dbId, 10) > 0) {
      handleUpdate(dbId);
    }
  }, [dbId, handleUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      const { data } = await axios.post(
        `${NODE_API_URL}/api/exam/paper/add-question`,
        {
          examId: dbId,
          section: questionForm.section,
          loguserid: secureLocalStorage.getItem("login_id"),
          login_type: secureLocalStorage.getItem("loginType"),
        }
      );

      if ([200, 201].includes(data?.statusCode)) {
        toast.success(data.message);
        if (data.statusCode === 201) setFormData(initialFormData); // Reset if a new exam is created
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error("A server error occurred.");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-0">
            <nav className="breadcrumb breadcrumb-dash">
              <Link to="/admin/" className="breadcrumb-item">
                <i className="fas fa-home m-r-5" />
                Announcement
              </Link>
              <span className="breadcrumb-item">Exam Management</span>
              <span className="breadcrumb-item active">
                {dbId ? "Update Exam Details" : "Add New Exam"}
              </span>
            </nav>
          </div>
          <div className="card border-0">
            <div className="card-body px-3">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {questionForm.section.map((item, index) => (
                    <div className="col-md-12 form-group" key={index}>
                      <label className="font-weight-semibold">
                        Section {item.title}
                      </label>
                      {console.log(item)}
                      <JoditEditor
                      value={item?.question || ''}
                      config={config}

                      onBlur={(newContent) => {
                        const updatedQuestionForm = { ...questionForm };
                        updatedQuestionForm.section[index].question = newContent;
                        setQuestionForm(updatedQuestionForm);
                      }}
                    />                    
                     
                    </div>
                  ))}
                 
                  <div className="col-md-12 col-12">
                    <button
                      className="btn btn-dark d-flex justify-content-center align-items-center"
                      type="submit"
                    >
                      Save {isSubmit && <div className="loader-circle"></div>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddExam;
