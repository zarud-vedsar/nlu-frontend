// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useState } from "react";
import { NODE_API_URL, CKEDITOR_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { Link } from "react-router-dom";
import validator from "validator";
import useRolePermission from "../../../site-components/admin/useRolePermission";
import JoditEditor from "jodit-react"; // Import Jodit editor
function AssignmentAddNew() {
  const initialForm = {
    dbId: "",
    courseid: "",
    semesterid: "",
    subject: "",
    assignment_title: "",
    deadline_date: "",
    number_of_question: "",
    minus_mark: 0,
    total_marks: "",
    marks_per_question: "",
    description: "",
    pdf_file: "",
    question_type: "",
    session: localStorage.getItem("session")
  };
  const { assignmentId } = useParams();
  const [formData, setFormData] = useState(initialForm); // Form state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [subjectListing, setSubjectListing] = useState([]);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  /**
  * ROLE & PERMISSION
  */
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate

  const [session, setSession] = useState([]);
  const sessionListDropdown = async () => {
    try {
      const { data } = await axios.post(`${NODE_API_URL}/api/session/fetch`, {
        status: 1,
        column: "id, dtitle",
      });
      data?.statusCode === 200 && data.data.length
        ? setSession(data.data) // Populate session list
        : (toast.error("Session not found."), setSession([])); // Error handling
    } catch {
      setSession([]); // Clear list on failure
    }
  };


  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {

      if (formData.dbId && hasPermission("Assignment", "update")) { /* empty */ }
      else if (hasPermission("Assignment", "create")) { /* empty */ }
      else {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission, formData.dbId]);
  /**
   * THE END OF ROLE & PERMISSION
   */
  // Jodit editor configuration
  const config = {
    readonly: false,
    placeholder: '',
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
  const questionTypes = ["mcq", "scq", "image", "description"];
  const courseListDropdown = async () => {
    try {
      const response = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setCourseListing(response.data.data);
      } else {
        toast.error("Course not found.");
        setCourseListing([]);
      }
    } catch (error) {
      setCourseListing([]);
    }
  };
  useEffect(() => {
    courseListDropdown();
    sessionListDropdown();
  }, []);

  const fetchSemesterBasedOnCourse = async (courseid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          courseid: courseid,
          column: "id, semtitle",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSemesterListing(response.data);
      } else {
        toast.error("Semester not found.");
        setSemesterListing([]);
      }
    } catch (error) {
      setSemesterListing([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const fetchSubjectBasedOnCourseAndSemeter = async (courseid, semesterid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          column: "id, subject",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSubjectListing(response.data);
      } else {
        toast.error("Semester not found.");
        setSubjectListing([]);
      }
    } catch (error) {
      setSubjectListing([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const updateFetchData = async (assignmentId) => {
    if (
      !assignmentId ||
      !Number.isInteger(parseInt(assignmentId, 10)) ||
      parseInt(assignmentId, 10) <= 0
    ) {
      toast.error("Invalid ID.");
      return null;
    }
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/assignment/fetch`,
        { dbId: assignmentId }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        toast.success(response.message);
        const data = response.data[0];
        setFormData((prev) => ({
          ...prev,
          dbId: data.id,
          courseid: data.courseid,
          semesterid: data.semesterid,
          subject: data.subject,
          assignment_title: data.assignment_title,
          deadline_date: data.deadline_date,
          total_marks: data.total_marks,
          number_of_question: data.number_of_question,
          minus_mark: data.minus_mark,
          marks_per_question: data.marks_per_question,
          question_type: data?.question_type,
          pdf_file: data.pdf_file ? validator.unescape(data.pdf_file) : "",
          description: validator.unescape(data.description || " "),
          session: data?.session
        }));
        if (data.pdf_file) setPreviewPdf(validator.unescape(data.pdf_file));
        return response;
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;
    if (id === "pdf_file") {
      if (file.type === "application/pdf") {
        setPreviewPdf(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, pdf_file: file }));
      } else {
        toast.error("Invalid PDF format. Only .pdf and .pdfx are allowed.");
      }
    }
  };

  useEffect(() => {
    errorMsg("", "");
    if (
      formData.number_of_question &&
      (!/^\d+$/.test(formData.number_of_question) ||
        parseInt(formData.number_of_question) < 1)
    ) {
      errorMsg("number_of_question", "Please enter valid number of question.");
      toast.error("Please enter valid number of question.");
      return;
    }

    if (
      formData.marks_per_question &&
      (!/^\d+$/.test(formData.marks_per_question) ||
        parseInt(formData.marks_per_question) < 1)
    ) {
      errorMsg("marks_per_question", "Please enter valid Marks per question.");
      toast.error("Please enter valid Marks per question.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      total_marks: formData.number_of_question * formData.marks_per_question,
    }));
  }, [formData.number_of_question, formData.marks_per_question]);

  // Handle input field change
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  // Handle form submission
  const handleSubmit = async (step) => {

    setIsSubmit(true);
    errorMsg("", "");
    if (!formData.courseid) {
      errorMsg("courseid", "Course is required.");
      toast.error("Course is required.");
      return setIsSubmit(false);
    }
    if (!formData.semesterid) {
      errorMsg("semesterid", "Semester is required.");
      toast.error("Semester is required.");
      return setIsSubmit(false);
    }
    if (!formData.subject) {
      errorMsg("subject", "Subject is required.");
      toast.error("Subject is required.");
      return setIsSubmit(false);
    }
    if (!formData.assignment_title) {
      errorMsg("assignment_title", "Assignment title is required.");
      toast.error("Assignment Title is required.");
      return setIsSubmit(false);
    }
    if (!formData.deadline_date) {
      errorMsg("deadline_date", "Deadline date is required.");
      toast.error("Deadline Date is required.");
      return setIsSubmit(false);
    }
    if (!formData.number_of_question) {
      errorMsg("number_of_question", "Number of question is required.");
      toast.error("Number of question is required.");
      return setIsSubmit(false);
    }
    if (
      parseInt(formData.minus_mark) <= -1) {
      errorMsg("minus_mark", "Please enter valid negative marks.");
      toast.error("Please enter valid negative marks.");
      return setIsSubmit(false);
    }

    if (!formData.total_marks) {
      errorMsg("total_marks", "Total marks is required.");
      toast.error("Total Marks is required.");
      return setIsSubmit(false);
    }
    if (!formData.question_type) {
      errorMsg("question_type", "Question Type is required.");
      toast.error("Question Type is required.");
      return setIsSubmit(false);
    }

    if (!formData.description) {
      errorMsg("description", "Description is required.");
      toast.error("Description is required.");
      return setIsSubmit(false);
    }

    try {
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      const bformData = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        bformData.append(key, value);
      }

      const response = await axios.post(
        `${NODE_API_URL}/api/assignment/register`,
        bformData
      );

      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);

        if (response?.data?.statusCode === 201) {
          setFormData({ ...formData, assignment_title: "" });

          if (step === "next") {
            navigate(`/admin/assignment/add-question/${response?.data?.data?.dbId}`)
          }
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

  useEffect(() => {
    if (assignmentId) {
      updateFetchData(assignmentId).then((response) => {
        if (response?.statusCode === 200 && response.data.length > 0) {
          const { courseid, semesterid } = response.data[0];
          fetchSemesterBasedOnCourse(courseid);
          fetchSubjectBasedOnCourseAndSemeter(courseid, semesterid);
        }
      });
    }
  }, [assignmentId]);
  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      description: newContent,
    }));
  }
  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Exam Managemnt
                  </a>
                  <span className="breadcrumb-item">Assignment</span>
                  <span className="breadcrumb-item active">
                    {assignmentId ? "Update Assignment" : "Add New Assignment"}
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {assignmentId ? "Update Assignment" : "Add New Assignment"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {
                    hasPermission("Assignment", "list") && (
                      <Link to="/admin/assignment">
                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                          <i className="fas fa-list"></i> Assignment List
                        </button>
                      </Link>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <form >
                      <div className="row">
                        <div className="col-md-4 col-12 form-group">
                          <label className="font-weight-semibold">
                            Session
                          </label>
                          <Select
                            options={session?.map(({ id, dtitle }) => ({
                              value: id,
                              label: dtitle,
                            }))}
                            onChange={({ value }) => {
                              setFormData({ ...formData, session: value });
                            }}
                            value={
                              session.find(
                                ({ id }) => id === +formData.session
                              )
                                ? {
                                  value: +formData.session,
                                  label: session.find(
                                    ({ id }) => id === +formData.session
                                  ).dtitle,
                                }
                                : { value: formData.session, label: "Select" }
                            }
                          />
                        </div>
                        <div className="col-md-4 col-12 form-group">
                          <label
                            className="font-weight-semibold"
                            htmlFor="courseid"
                          >
                            Course <span className="text-danger">*</span>
                          </label>
                          <Select
                            id="courseid"
                            options={courseListing.map((item) => ({
                              value: item.id,
                              label: item.coursename,
                              year: item.duration,
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                courseid: selectedOption.value,
                              });
                              fetchSemesterBasedOnCourse(selectedOption.value);
                            }}
                            value={
                              courseListing.find(
                                (item) =>
                                  item.id === parseInt(formData.courseid)
                              )
                                ? {
                                  value: parseInt(formData.courseid),
                                  label: courseListing.find(
                                    (item) =>
                                      item.id === parseInt(formData.courseid)
                                  ).coursename,
                                }
                                : { value: formData.courseid, label: "Select" }
                            }
                          />

                          {error.field === "courseid" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-4 col-12 form-group">
                          <label
                            className="font-weight-semibold"
                            htmlFor="semesterid"
                          >
                            Semester <span className="text-danger">*</span>
                          </label>
                          <Select
                            id="semesterid"
                            options={semesterListing.map((item) => ({
                              value: item.id,
                              label: capitalizeFirstLetter(item.semtitle),
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                semesterid: selectedOption.value,
                                subject: "",
                              });
                              fetchSubjectBasedOnCourseAndSemeter(
                                formData.courseid,
                                selectedOption.value
                              );
                            }}
                            value={
                              semesterListing.find(
                                (item) => item.id === formData.semesterid
                              )
                                ? {
                                  value: formData.semesterid,
                                  label: capitalizeFirstLetter(
                                    semesterListing.find(
                                      (item) =>
                                        item.id === formData.semesterid
                                    ).semtitle
                                  ),
                                }
                                : {
                                  value: formData.semesterid,
                                  label: "Select",
                                }
                            }
                          />
                          {error.field === "semesterid" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-4 col-12 form-group">
                          <label
                            className="font-weight-semibold"
                            htmlFor="subject"
                          >
                            Subject <span className="text-danger">*</span>
                          </label>
                          <Select
                            id="subject"
                            options={subjectListing.map((item) => ({
                              value: item.id,
                              label: capitalizeFirstLetter(item.subject),
                            }))}
                            onChange={(selectedOption) => {
                              setFormData({
                                ...formData,
                                subject: selectedOption.value,
                              });
                            }}
                            value={
                              subjectListing.find(
                                (item) => item.id === formData.subject
                              )
                                ? {
                                  value: formData.subject,
                                  label: capitalizeFirstLetter(
                                    subjectListing.find(
                                      (item) => item.id === formData.subject
                                    ).subject
                                  ),
                                }
                                : { value: formData.subject, label: "Select" }
                            }
                          />
                          {error.field === "subject" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="form-group col-md-4 col-12">
                          <label htmlFor="assignment_title">
                            Assignment Title{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="assignment_title"
                            type="text"
                            placeholder="Enter Assignment"
                            className="form-control"
                            name="assignment_title"
                            value={formData.assignment_title}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                assignment_title: e.target.value,
                              });
                            }}
                          />
                          {error.field === "assignment_title" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        <div className="form-group col-md-4 col-12">
                          <label htmlFor="deadline_date">
                            Deadline Date <span className="text-danger">*</span>
                          </label>
                          <input
                            id="deadline_date"
                            type="date"
                            className="form-control"
                            name="deadline_date"
                            min={new Date().toISOString().split("T")[0]}
                            value={
                              formData.deadline_date
                                ? new Date(formData.deadline_date)
                                  .toISOString()
                                  .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                deadline_date: e.target.value,
                              });
                            }}
                          />
                          {error.field === "deadline_date" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        <div className="form-group col-md-4 col-12">
                          <label htmlFor="number_of_question">
                            Number of question{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="number_of_question"
                            type="number"
                            className="form-control"
                            name="number_of_question"
                            value={formData.number_of_question}
                            placeholder="0"
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                number_of_question: e.target.value,
                              });
                            }}
                          />
                          {error.field === "number_of_question" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        <div className="form-group col-md-4 col-12">
                          <label htmlFor="minus_mark">
                            Negative Marking per wrong question{" "}
                          </label>
                          <input
                            id="minus_mark"
                            type="text"
                            className="form-control"
                            name="minus_mark"
                            value={formData.minus_mark}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                minus_mark: e.target.value,
                              });
                            }}
                          />
                          {error.field === "minus_mark" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        <div className="form-group col-md-4 col-12">
                          <label htmlFor="marks_per_question">
                            Marks per question <span className="text-danger">*</span>
                          </label>
                          <input
                            id="marks_per_question"
                            type="number"
                            min="1"
                            className="form-control"
                            name="marks_per_question"
                            value={formData.marks_per_question}
                            placeholder="0"
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                marks_per_question: e.target.value,
                              });
                            }}
                          />
                          {error.field === "marks_per_question" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        <div className="form-group col-md-4 col-12">
                          <label htmlFor="total_marks">
                            Total Marks
                          </label>
                          <input
                            id="total_marks"
                            type="number"
                            min="1"
                            className="form-control"
                            name="total_marks"
                            value={formData.total_marks}
                            readOnly
                          />
                          {error.field === "total_marks" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-4 col-lg-4 form-group">
                          <label className="font-weight-semibold">
                            Question Type <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={questionTypes.map((item) => ({
                              value: item,
                              label: capitalizeFirstLetter(item),
                            }))}
                            onChange={(selectedOption) => {
                              setFormData((prev) => ({ ...prev, question_type: selectedOption.value }))
                            }}
                            value={
                              questionTypes.includes(formData?.question_type)
                                ? {
                                  value: formData.question_type,
                                  label: capitalizeFirstLetter(formData.question_type),
                                }
                                : { value: formData.question_type, label: "Select" }
                            }
                          />

                          {error.field === "question_type" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        <div className="col-md-4 col-12 form-group">
                          <label htmlFor="pdf_file">
                            Upload Cover Page (optional)
                          </label>
                          <input
                            type="file"
                            id="pdf_file"
                            accept=".pdf"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                        </div>
                        {previewPdf && (
                          <div className="col-12 form-group">
                            <iframe
                              src={previewPdf}
                              title="PDF Preview"
                              className="mt-3"
                              style={{ width: "100%", height: 300 }}
                            ></iframe>
                          </div>
                        )}
                        <div className='col-md-12 mb-2'>
                          <label className='font-weight-semibold'>Description</label>
                          <JoditEditor
                            value={formData?.description || ''}
                            config={{config,
                              placeholder: 'Enter your description here...'
                            }}
                            onBlur={handleEditorChange}
                          />
                        </div>
                        <div className="col-md-12 col-lg-12 col-12">
                          {!isSubmit ? (
                            <div className="d-flex ">
                              <button
                                className="btn btn-success mr-2 "

                                onClick={(e) => { e.preventDefault(); handleSubmit("save") }}
                              >
                                {assignmentId ? "Update" : "Save"}

                              </button>
                              {!assignmentId &&
                                <button
                                  className="btn btn-secondary  "

                                  onClick={(e) => { e.preventDefault(); handleSubmit("next") }}
                                >
                                  Save And Next{" "}
                                </button>
                              }
                            </div>
                          ) : (
                            <button
                              className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                              type="submit"
                              disabled
                            >
                              Saving &nbsp;{" "}
                              <div className="loader-circle"></div>
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AssignmentAddNew;
