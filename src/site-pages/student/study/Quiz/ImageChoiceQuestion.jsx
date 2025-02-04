import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";
import {
  FILE_API_URL,
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
import ReverseTimer from "./ReverseTimer";
function ImageChoiceQuestion() {
  const sid = secureLocalStorage.getItem("studentId");
  const [courseSemester, setCourseSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [apiHit, setApiHit] = useState(false);
  const { courseId, semesterId, subjectId, quizId } = useParams();
  const [questionList, setQuestionList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [quizDetail, setQuizDetail] = useState();
  const [studentDetail, setStudentDetail] = useState();
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

  const fetchQuizQuestions = async () => {
    setIsFetching(true);
    try {
      let bformData = new FormData();

      bformData.append("data", "load_quiz_questions");
      bformData.append("quiz_id", quizId);

      

      const response = await axios.post(
        `${PHP_API_URL}/quiz.php`,
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
      fetchQuizQuestions();
      getQuizDetail();
    }
  }, [sid]);

  useEffect(() => {
    getSubject(formData.subjectId);
  }, [formData.courseId, formData.semesterId, formData.subjectId]);

  const getQuizDetail = async () => {
    if (
      !quizId ||
      !Number.isInteger(parseInt(quizId, 10)) ||
      parseInt(quizId, 10) <= 0
    ) {
      toast.error("Invalid ID.");
      return null;
    }
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/quiz/fetch`,
        { dbId: quizId }
      );
      if (
        response?.data?.statusCode === 200 &&
        response?.data?.data.length > 0
      ) {
        setQuizDetail(response?.data?.data[0]);

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

  const markAnswer = (ans) => {
    let tempQuestionList = [...questionList];
    tempQuestionList[currentQuestion].answer = ans;
    tempQuestionList[currentQuestion].attempted = 1;
    setQuestionList(tempQuestionList);
  };

  const previousQuestion = () => {
    if (currentQuestion === 0) return;
    else {
      if (questionList[currentQuestion]?.attempted === 0) {
        let tempQuestionList = [...questionList];
        tempQuestionList[currentQuestion].attempted = 2;
        setQuestionList(tempQuestionList);
      }
      setCurrentQuestion((cur) => cur - 1);
    }
  };

  const nextQuestion = () => {
    if (questionList[currentQuestion]?.attempted === 0) {
      let tempQuestionList = [...questionList];
      tempQuestionList[currentQuestion].attempted = 2;
      setQuestionList(tempQuestionList);
    }
    setCurrentQuestion((cur) => cur + 1);
  };

  const convertToStructuredArray = (questions) => {
    const result = {};

    const keys = Object.keys(questions[0]);
    keys.forEach((key) => {
      result[key] = questions.map((question) => question[key]);
    });

    return result;
  };

  const handleSubmit = async (e=false) => {
    if(e){
      e.preventDefault();
    }
    setIsSubmit(true);
    if(e){
    const deleteAlert = await DeleteSweetAlert(" ");
    
    if (!deleteAlert ) {
      return;

    }
  }

    try {
      let formData = {};
      formData.student_id = secureLocalStorage.getItem("studentId");
      formData.quiz_id = quizId;
      formData.data = "st_quiz_submit";

      const bformData = new FormData();
      const resArray = convertToStructuredArray(questionList);
      Object.keys(resArray).forEach((key) => {
        const value = resArray[key];
        value?.map((ele) => {
          if (key === "answer") {
            bformData.append(`${key}[]`, ele);
          }
          if (key === "id") {
            bformData.append(`question_id[]`, ele);
          }
        });
      });

      Object.keys(formData).forEach((key) => {
        bformData.append(key, formData[key]);
      });

      
      const response = await axios.post(
        `${PHP_API_URL}/quiz.php`,
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
          quiz: quizDetail?.quiz_title,
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
        `/student/quiz-subject/${courseId}/${semesterId}/${subjectId}`
      );
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
                    {capitalizeFirstLetter(quizDetail?.quiz_title)}
                  </span>
                </h5>
                <div className="">
                  Duration : {quizDetail?.duration_in_min} Minutes
                </div>
              </div>
              <div className="p-3 d-flex justify-content-between  ">
            {quizDetail?.duration_in_min &&  <div className="mx-3"><ReverseTimer handleSubmit={handleSubmit} minute={parseInt(quizDetail?.duration_in_min)}/></div> }

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
              <div
                className="card"
                style={{ minHeight: "70vh", }}
              >
                <div className="card-body">
                  <div className="card-title">
                    <span> Question {currentQuestion + 1} : </span>
                  </div>
                  <div className="col-md-12 mb-4 d-flex justify-content-center">
                    <img
                      className="col-6 "
                      src={`${FILE_API_URL}/assignment/${questionList[currentQuestion]?.question}`}
                      // src={`https://static.vecteezy.com/system/resources/previews/000/370/016/non_2x/jigsaw-puzzle-game-with-kids-playing-in-the-room-vector.jpg`}
                      alt="question"
                      style={{ width: "40%", height: "40%" }}
                    />
                  </div>

                  <div className="row">
                      <div className="col-6 mb-4 text-center">
                      <h4 className="px-5" style={{textAlign:"left"}} >Option No: 1</h4>
                      <img
                        className="img-fluid"
                        src={`${FILE_API_URL}/assignment/${questionList[currentQuestion]?.option1}`}
                        // src={`https://play-lh.googleusercontent.com/ZpZeppBkhNtSE_IRrWN09fslhQXDBcANI0cVOIJOzfneUBV5wAW0MDW3_4R5hjfF2g=w526-h296-rw`}
                        alt="option1"
                        style={{
                          border: `${
                            questionList[currentQuestion]?.answer === "option1"
                              ? "2px solid #38bb38"
                              : ""
                          }`,
                          width: "300px",
                        }}
                        onClick={() => markAnswer("option1")}
                      />
                      </div>
                     
                        <div className="col-6 mb-4 text-center"> 
                        <h4 className="px-5" style={{textAlign:"left"}} >Option No: 2</h4>
                        <img
                        className="img-fluid"
                        src={`${FILE_API_URL}/assignment/${questionList[currentQuestion]?.option2}`}
                        // src={`https://play-lh.googleusercontent.com/ZpZeppBkhNtSE_IRrWN09fslhQXDBcANI0cVOIJOzfneUBV5wAW0MDW3_4R5hjfF2g=w526-h296-rw`}
                        alt="option2"
                        style={{
                          border: `${
                            questionList[currentQuestion]?.answer === "option2"
                              ? "2px solid #38bb38"
                              : ""
                          }`,
                          width: "300px",
                        }}
                        onClick={() => markAnswer("option2")}
                      />

                        </div>
                     
                     <div className="col-6 mb-4 text-center">
                     <h4 className="px-5" style={{textAlign:"left"}} >Option No: 3</h4>
                     <img
                        className="img-fluid"
                        src={`${FILE_API_URL}/assignment/${questionList[currentQuestion]?.option3}`}
                        // src={`https://play-lh.googleusercontent.com/ZpZeppBkhNtSE_IRrWN09fslhQXDBcANI0cVOIJOzfneUBV5wAW0MDW3_4R5hjfF2g=w526-h296-rw`}
                        alt="option3"
                        style={{
                          border: `${
                            questionList[currentQuestion]?.answer === "option3"
                              ? "2px solid #38bb38"
                              : ""
                          }`,
                          width: "300px",
                        }}
                        onClick={() => markAnswer("option3")}
                      />

                     </div>
                     
                     <div className="col-6 mb-4 text-center">
                     <h4 className="px-5" style={{textAlign:"left"}} >Option No: 4</h4>
                     <img className="img-fluid "
                        src={`${FILE_API_URL}/assignment/${questionList[currentQuestion]?.option4}`}
                        // src={`https://play-lh.googleusercontent.com/ZpZeppBkhNtSE_IRrWN09fslhQXDBcANI0cVOIJOzfneUBV5wAW0MDW3_4R5hjfF2g=w526-h296-rw`}
                        alt="option4"
                        style={{
                          border: `${
                            questionList[currentQuestion]?.answer === "option4"
                              ? "2px solid #38bb38"
                              : ""
                          }`,
                          width: "300px"
                        }}
                        onClick={() => markAnswer("option4")}
                      />

                     </div>
                      
                      <div className="col-6 mb-3 d-flex align-items-center">
                        <input
                          type="checkbox"
                          id="option5"
                          checked={
                            questionList[currentQuestion]?.answer === "option5"
                          }
                          onChange={() => markAnswer("option5")}
                          style={{ marginRight: "8px" }}
                        />
                        <label
                          htmlFor="option5"
                          style={{
                            cursor: "pointer",
                            
                            padding: "5px",
                          }}
                        >
                          None of these
                        </label>
                      </div>
                    </div>
                </div>
              </div>

              {/* Button Container */}
              <div
                className="d-flex justify-content-between"
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <div>
                  <button
                    className="btn btn-dark ml-3 d-flex align-items-center"
                    style={{ width: "100px", height: "40px" }}
                    onClick={previousQuestion}
                  >
                    <i class="fa-solid fa-chevron-left"></i>
                    {"  "} Previous
                  </button>
                </div>
                {questionList?.length > currentQuestion + 1 && (
                  <div>
                    <button
                      className="btn btn-dark mr-3"
                      style={{ width: "100px", height: "40px" }}
                      onClick={nextQuestion}
                    >
                      Next <i class="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}
                {questionList?.length <= currentQuestion + 1 && (
                  <div>
                    <button
                      className="btn btn-dark mr-3"
                      style={{ width: "100px", height: "40px" }}
                      onClick={handleSubmit}
                    >
                      Submit <i class="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-4">
              <div
                className="card d-flex"
                style={{
                  minHeight: "75vh",

                  paddingBottom: "20px",
                }}
              >
                <div className="card-body d-flex flex-column">
                  {/* Questions Grid */}
                  <div className="row">
                    {questionList?.map((question, index) => {
                      const statusMap = {
                        0: "btn btn-danger", // Not Attempted
                        1: "btn btn-success", // Attempted
                        2: "btn btn-warning", // Skipped
                      };

                      return (
                        <div
                          key={index}
                          className="col-md-3 col-lg-2 col-2 col-sm-2 px-2 mb-2"
                          style={{ height: "50px" }}
                        >
                          <div
                            className={`${
                              statusMap[question?.attempted]
                            } col-12 text-center align-items-center`}
                          >
                            {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Attempt Summary - Stays at Bottom */}
                  <div className="row mt-auto">
                    <div className="col-md-1 flex-end">
                      {" "}
                      <div
                        className="bg-success"
                        style={{ width: "14px", height: "14px" }}
                      ></div>
                    </div>

                    <div className="col-md-11 col-lg-11 text-success">
                      Attempted:{" "}
                      {
                        questionList.filter(
                          (question) => question?.attempted === 1
                        ).length
                      }
                    </div>
                    <div className="col-md-1 flex-end">
                      {" "}
                      <div
                        className="bg-danger"
                        style={{ width: "14px", height: "14px" }}
                      ></div>
                    </div>

                    <div className="col-md-11 col-lg-11 text-danger">
                      Not Attempted:{" "}
                      {
                        questionList.filter(
                          (question) => question?.attempted === 0
                        ).length
                      }
                    </div>
                    <div className="col-md-1 flex-end">
                      {" "}
                      <div
                        className="bg-warning"
                        style={{ width: "14px", height: "14px" }}
                      ></div>
                    </div>

                    <div className="col-md-11 col-lg-11 text-warning">
                      Skipped:{" "}
                      {
                        questionList.filter(
                          (question) => question?.attempted === 2
                        ).length
                      }
                    </div>
                  </div>
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
          navigate("/student/quiz-subject", { replace: true });
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
              <h4>{capitalizeFirstLetter(props.selectedmarque?.quiz)}</h4>
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

            <div className="">
              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                {" "}
                <div
                  className="bg-success"
                  style={{ width: "14px", height: "14px" }}
                ></div>
                <div className="text-success">
                  Attempted:{" "}
                  {
                    props.selectedmarque?.questionList.filter(
                      (question) => question?.attempted === 1
                    ).length
                  }
                </div>
              </div>

              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                {" "}
                <div
                  className="bg-danger"
                  style={{ width: "14px", height: "14px" }}
                ></div>
                <div className="text-danger">
                  Not Attempted:{" "}
                  {
                    props.selectedmarque?.questionList.filter(
                      (question) => question?.attempted === 0
                    ).length
                  }
                </div>
              </div>

              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                {" "}
                <div
                  className="bg-warning"
                  style={{ width: "14px", height: "14px" }}
                ></div>
                <div className="text-warning">
                  Skipped:{" "}
                  {
                    props.selectedmarque?.questionList.filter(
                      (question) => question?.attempted === 2
                    ).length
                  }
                </div>
              </div>

              <div className="get-current-date mt-3">
                <p className="mb-0" style={{color:"#0b2947;"}}>Submision Date</p>
                <p>{currentDate}</p>
              </div>
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

export default ImageChoiceQuestion;
