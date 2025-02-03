import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";
import uploadImg from "../../../../site-components/admin/assets/images/upload.png";
import { FaRegEdit } from "react-icons/fa";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../../site-components/Helper/Constant";
import "../../assets/custom.css";
import {
  capitalizeFirstLetter,
  formatDate,
} from "../../../../site-components/Helper/HelperFunction";
import { toast } from "react-toastify";
import { studentRecordById } from "../../../../site-components/student/GetData";
import { DeleteSweetAlert } from "../../../../site-components/Helper/DeleteSweetAlert";
import { useNavigate } from "react-router-dom";
function DescriptiveQuestion() {
  const sid = secureLocalStorage.getItem("studentId");
  const [courseSemester, setCourseSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [apiHit, setApiHit] = useState(false);
  const { courseId, semesterId, subjectId, assignmentId } = useParams();
  const [questionList, setQuestionList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [assignmentDetail, setAssignmentDetail] = useState();
  const [studentDetail, setStudentDetail] = useState();
  const [pdfName, setPdfName] = useState();
  const [pdfFile, setPdfFile] = useState();
   const [modalShow, setModalShow] = useState(false);
        const [selectedmarque, setSelectedMarque] = useState(null);
  const navigate = useNavigate();
  const inititalData = {
    courseId: courseId,
    subjectId: subjectId,
    semesterId: semesterId,
    studentId: sid,
  };
  const [formData, setFormData] = useState(inititalData);

  const fetchAllCourseAndSemester = async (sid) => {
    setApiHit(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/student/fetch-course-semester`,
        {
          sid,
          courseIdNameList: "yes",
          allotedCourseSemesterList: "yes",
        }
      );
      if (response.data.data) {
        const [firstCourse] = response.data.data;
        setCourseSemester(firstCourse);
        if (firstCourse?.courseIdName?.[0]?.id) {
          setFormData((prev) => ({
            ...prev,
            courseId: firstCourse.courseIdName[0].id,
          }));
        }
      } else {
        setCourseSemester(null);
      }
    } catch (error) {
      console.error("Error fetching course and semester data:", error);
      setCourseSemester(null);
    } finally {
      setApiHit(false);
    }
  };

  const fetchAssignmentQuestions = async () => {
    setIsFetching(true);
    try {
      let bformData = new FormData();

      bformData.append("data", "load_assignment_questions");
      bformData.append("assignment_id", assignmentId);

      const response = await axios.post(
        `${PHP_API_URL}/assignment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === 200 && response?.data?.data.length > 0) {
        // toast.success(response?.data?.msg);

        const modifiedData = response?.data?.data.map((question) => ({
          ...question,
          attempted: 0,
          answer: null,
        }));
        setQuestionList(modifiedData);
      } else {
        setQuestionList([]);
      }
    } catch (error) {
      setQuestionList([]);
      if (
        error?.response?.data?.status === 400 ||
        error?.response?.data?.status === 404 ||
        error?.response?.data?.status === 500
      ) {
        toast.error(error?.response?.data?.msg);
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (sid) {
      studentRecordById(sid).then((res) => {
        if (res.length > 0) {
          setStudentDetail(res[0]);
        }
      });
    }
  }, [sid]);

  const getSubject = async (subjectId) => {
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/student/get-subject-name-id`,
        {
          subjectId,
        }
      );
      if (response.data?.data && response.data.data.length > 0) {
        setSubject(response.data.data[0]);
      } else {
        setSubject([]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setSubject([]);
    }
  };

  useEffect(() => {
    if (sid) {
      fetchAllCourseAndSemester(sid);
      fetchAssignmentQuestions();
      getAssignmentDetail();
    }
  }, [sid]);

  useEffect(() => {
    getSubject(formData.subjectId);
  }, [formData.courseId, formData.semesterId, formData.subjectId]);

  const getAssignmentDetail = async () => {
    if (
      !assignmentId ||
      !Number.isInteger(parseInt(assignmentId, 10)) ||
      parseInt(assignmentId, 10) <= 0
    ) {
      toast.error("Invalid ID.");
      return null;
    }
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/assignment/fetch`,
        { dbId: assignmentId }
      );
      if (
        response?.data?.statusCode === 200 &&
        response?.data?.data.length > 0
      ) {
        setAssignmentDetail(response?.data?.data[0]);

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

  const convertToStructuredArray = (questions) => {
    const result = {};

    const keys = Object.keys(questions[0]);
    keys.forEach((key) => {
      result[key] = questions.map((question) => question[key]);
    });

    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (!pdfFile?.file) {
      return setIsSubmit(false);
    }

    const deleteAlert = await DeleteSweetAlert(" ");
    if (!deleteAlert) {
      return;
    }

    try {
      let formData = {};
      formData.student_id = secureLocalStorage.getItem("studentId");
      formData.assignment_id = assignmentId;
      formData.response_file = pdfFile?.file;
      formData.data = "st_assignment_submit";

      const bformData = new FormData();
      const resArray = convertToStructuredArray(questionList);
      Object.keys(resArray).forEach((key) => {
        const value = resArray[key];
        value?.map((ele) => {
          if (key === "question") {
            bformData.append(`${key}[]`, ele);
          }
        });
      });

      Object.keys(formData).forEach((key) => {
        bformData.append(key, formData[key]);
      });

      const response = await axios.post(
        `${PHP_API_URL}/assignment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
        setSelectedMarque((prev) => ({
          ...prev,
          course: courseSemester?.courseIdName?.[0]?.coursename,
          semester: semesterId
            ? courseSemester?.allotedCourseSemester?.find(
                (semester) => semester.semesterid == semesterId
              )?.semtitle
            : "",
          subject: subject?.subject,
          assignment: assignmentDetail?.assignment_title,
          questionList: questionList,
        }));
        setModalShow(true);


        if (response?.data?.status === 201) {
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;
      const errorField = error.response?.data?.errorField;

      if (status === 400 || status === 401 || status === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.msg);
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

  const cancel = async () => {
    const deleteAlert = await DeleteSweetAlert(" ");
    if (deleteAlert) {
      navigate(
        `/student/assignment-subject/${courseId}/${semesterId}/${subjectId}`
      );
    }
  };

  const uploadFileRef = useRef(null);

  const handleUploadClick = () => {
    uploadFileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPdfFile({
        name: file.name,
        fileURL: fileURL,
        file: file,
      });
    }
  };

  return (
    <>
      <div className="page">
        <div className="container-fluid ">
          <div className="card">
            <div className="card-header d-flex justify-content-between ">
              <div>
                <h5 className="card-title  h6_new font-14">
                  Course:{" "}
                  {courseSemester?.courseIdName?.[0]?.coursename ||
                    "Course name not available"}
                  {semesterId &&
                    courseSemester?.allotedCourseSemester?.find(
                      (semester) => semester.semesterid == semesterId
                    )?.semtitle &&
                    ` - ${capitalizeFirstLetter(
                      courseSemester.allotedCourseSemester.find(
                        (semester) => semester.semesterid == semesterId
                      ).semtitle
                    )}`}
                  <span> ({capitalizeFirstLetter(subject?.subject)})</span>
                  <span>
                    {" "}
                    -{" "}
                    {capitalizeFirstLetter(assignmentDetail?.assignment_title)}
                  </span>
                </h5>
                <div className="">
                  Deadline : {formatDate(assignmentDetail?.deadline_date)}
                </div>
              </div>
              <div className="p-3 d-flex justify-content-between  ">
                <div>
                  {" "}
                  {studentDetail?.sname} <br />
                  {studentDetail?.semail}{" "}
                </div>
                <div
                  className="text-danger ml-3"
                  style={{
                    fontSize: "20px",
                    padding: "10px",
                    background: "#d0d0d0",
                    borderRadius: "2px",
                  }}
                  onClick={cancel}
                >
                  <i className="fa-solid fa-xmark "></i>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-12 col-md-8 col-lg-8">
              <div className="card" style={{ minHeight: "70vh" }}>
                <div className="card-body">
                  {questionList.map((question, index) => (
                    <p className="id-question-p">
                      <span className="id-question-c">
                        Question {currentQuestion + index + 1} :{" "}
                        {question.question}
                      </span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Button Container */}
              <div
                className="d-flex justify-content-between"
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              ></div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-4">
              <div className="card" style={{ minHeight: "70vh" }}>
                <div className="card-body">
                  <div className="card-title">
                    <h6>
                      <span className="id-note-file-upload">Note:</span>{" "}
                      <span className="id-note-content">
                        This feature allows users to upload PDF files directly
                        to the application.{" "}
                      </span>
                    </h6>
                    {assignmentDetail?.pdf_file && (
                      <span className="id-note-content">
                        Download Cover Page{" "}
                        <a href={assignmentDetail?.pdf_file} download>
                          Click Here
                        </a>
                      </span>
                    )}
                  </div>
                  <div
                    className="form-group col-md-12"
                    style={{ border: "2px dotted", borderRadius: "10px" }}
                  >
                    <div
                      style={{
                        width: "110px",
                        height: "100px",
                        position: "relative",
                      }}
                      className="mx-auto"
                      onClick={handleUploadClick}
                    >
                      {formData.image ? (
                        <img
                          src={
                            "https://www.creativefabrica.com/wp-content/uploads/2021/04/05/Image-Upload-Icon-Graphics-10388650-1-1-580x386.jpg"
                          }
                          alt="Uploaded Preview"
                          style={{
                            width: "110px",
                            height: "100px",
                            position: "relative",
                          }}
                          className=""
                        />
                      ) : (
                        <div
                          className=""
                          style={{
                            width: "110px",
                            height: "100px",
                            position: "relative",
                          }}
                        >
                          {" "}
                        </div>
                      )}
                      <label
                        htmlFor="avatar-input"
                        className="rounded-circle d-flex justify-content-center  align-items-center"
                        style={{
                          position: "absolute",
                          bottom: "-3px",
                          right: "-21px",
                        }}
                      >
                        <img src={uploadImg} alt="" height={"100px"} />
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        ref={uploadFileRef}
                        onChange={handleFileChange}
                      />{" "}
                      <span className="mt-1 avtar_user"></span>
                    </div>
                  </div>
                  {pdfFile?.name && (
                    <>
                      <p>
                        Selected File: {pdfFile?.name}{" "}
                        <a
                          href={pdfFile?.fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2"
                        >
                          <i class="fa fa-eye" aria-hidden="true"></i>
                        </a>
                      </p>
                      <div>
                        <button
                          className="btn btn-dark mr-3"
                          style={{ width: "100px", height: "40px" }}
                          onClick={handleSubmit}
                        >
                          Submit <i class="fa-solid fa-chevron-right"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        close={() => {
          setModalShow(false);
          setSelectedMarque(null);
          navigate("/student/assignment-subject", { replace: true });
        }}
        selectedmarque={selectedmarque}
      />
      <style jsx>{`
        .page {
          background-color: #f5f5f5;

          min-height: 100vh;
          transition: all 0.2s ease;
          -webkit-transition: all 0.2s ease;
          -moz-transition: all 0.2s ease;
          -o-transition: all 0.2s ease;
          -ms-transition: all 0.2s ease;
        }
      `}</style>
    </>
  );
}

export default DescriptiveQuestion;
const MyVerticallyCenteredModal = (props = {}) => {
  
  const [loading, setLoading] = useState(false);
  const currentDate = new Date().toLocaleDateString();

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add New</Modal.Title>
      </Modal.Header> */}
        <Modal.Body>
          <div className="col-md-12">
            <h4 className="text-center text-success">Submit Successfully</h4>
          </div>
          <div className="col-md-12 d-flex justify-content-between">
            <div>
              <h4>{capitalizeFirstLetter(props.selectedmarque?.assignment)}</h4>
              <p>
                <strong className="id-width">Course: </strong>
                {props.selectedmarque?.course}
              </p>
              <p>
                <strong className="id-width">Semester: </strong>
                {capitalizeFirstLetter(props.selectedmarque?.semester)}
              </p>
              <p>
                <strong className="id-width">Subject: </strong>
                {capitalizeFirstLetter(props.selectedmarque?.subject)}
              </p>
            </div>


              <div className="get-current-date">
                <p className="mb-0" style={{fontSize:"17px", color:"#000;"}}>Submision Date</p>
                <p>{currentDate}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="mx-auto">
            <Button
              onClick={props.close}
              className="btn btn-danger"
              disabled={loading}
            >
              Exit
            </Button>{" "}
          </div>
        </Modal.Footer>
      </Modal>
      <style jsx>{`
        .id-width {
          display: inline-block;
          width: 70px;
        }
      `}</style>
    </>
  );
};
