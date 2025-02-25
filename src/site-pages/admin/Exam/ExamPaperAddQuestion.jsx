import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  capitalizeAllLetters,
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
  const paper_set = location?.state?.paper_set;
  const [examData, setExamData] = useState([]);
  const [questionForm, setQuestionForm] = useState({
    examId: "",
    section: [],
  });
  const [isSubmit, setIsSubmit] = useState(false);
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
  // Fetch and set the session list
  const fetchSavedQuestion = async (paper_set) => {
    try {
      const { data } = await axios.post(
        `${NODE_API_URL}/api/exam/paper/question-list`,
        {
          examId: dbId,
          paper_set
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
        setExamData(fetchedData);
        const parsedSections = JSON.parse(fetchedData.section);
        setQuestionForm((prev) => ({
          ...prev,
          section: parsedSections.map((item) => ({
            title: item.title,
            question: "",
          })),
        }));
        setTimeout(() => {
          fetchSavedQuestion(paper_set);
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
    if (dbId && parseInt(dbId, 10) > 0 && paper_set) {
      handleUpdate(dbId);
    } else {
      toast.error("Paper set or exam id is missing.");
    }
  }, [dbId, paper_set, handleUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      const { data } = await axios.post(
        `${NODE_API_URL}/api/exam/paper/add-question`,
        {
          examId: dbId,
          paper_set,
          section: questionForm.section,
          loguserid: secureLocalStorage.getItem("login_id"),
          login_type: secureLocalStorage.getItem("loginType"),
        }
      );

      if ([200, 201].includes(data?.statusCode)) {
        toast.success(data.message);
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
                Questions
              </span>
            </nav>
          </div>
          {/* Main Content Starts Here */}
          <div className="card border-0 bg-transparent mb-0">
            <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title h6_new font-16">
                Exam Paper Questions
              </h5>
              {/* The almighty 'Go Back' button */}
              <button className="btn goback" onClick={goBack}>
                <i className="fas fa-arrow-left"></i> Go Back
              </button>
              <Link to="/admin/exam-paper/list">
                <button className="ml-2 btn-md btn border-0 btn-secondary">
                  <i className="fas fa-list"></i> Exam Paper List
                </button>
              </Link>
            </div>
          </div>
          <div className="card border-0">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title h6_new font-16"> {examData?.coursename}, {examData?.semtitle ? capitalizeAllLetters(examData?.semtitle) : ''}
                <br /> {examData?.subject}
              </h5>
              <div>
                <p>Exam Type: {examData.examType ? capitalizeAllLetters(examData?.examType?.replace("-", " ")) : ''}</p>
                <p>Paper Code: {examData?.paperCode}</p>
                <p>Paper Set: {paper_set}</p>
              </div>
            </div>
            <div className="card-body px-3">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {questionForm.section.map((item, index) => (
                    <div className="col-md-12 form-group" key={index}>
                      <label className="font-weight-semibold">
                        Section {item.title}
                      </label>

                      <JoditEditor
                        value={item?.question ? validator.unescape(item?.question) : ''}
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
