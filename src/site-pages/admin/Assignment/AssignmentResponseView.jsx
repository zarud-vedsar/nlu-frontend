import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FormField,
} from "../../../site-components/admin/assets/FormField";
import {
  capitalizeEachLetter,
  capitalizeFirstLetter,
  formatDate,
} from "../../../site-components/Helper/HelperFunction";
import {
  FILE_API_URL,
  NODE_API_URL,
  PHP_API_URL,
} from "../../../site-components/Helper/Constant";
import axios from "axios";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import useRolePermission from "../../../site-components/admin/useRolePermission";

const SuccessTextareaField = ({
  label = "",
  id = "",
  value = "",
  column = "col-md-6",
  labelClass = "font-weight-semibold",
  className = "form-control",
  borderError = false,
  borderSuccess = false,
  required = false
}) => {

  const borderShade = borderError
    ? "1px solid #FA5252"
    : borderSuccess
      ? "1px solid rgb(97, 245, 63)"
      : "";

  const divStyle = {
    border: borderShade || "1px solid #ced4da",
    padding: "10px",
    borderRadius: "5px",
    minHeight: "38px",
    backgroundColor: "#f8f9fa"
  };

  return (
    <div className={`${column} form-group`}>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div style={divStyle} id={id} className={className}>
        {value || "N/A"}
      </div>
    </div>
  );
};

const SuccessFormField = ({
  label = "",
  id = "",
  value = "",
  column = "col-md-6",
  colId = "",
  labelClass = "font-weight-semibold",
  className = "form-control",
  borderError = false,
  borderSuccess = false,
  required = false,
  readOnly = false,
}) => {
  // Conditional border styling
  const borderShade = borderError
    ? "1px solid #FA5252"
    : borderSuccess
      ? "1px solid rgb(97, 245, 63)"
      : "1px solid #ced4da";

  const divStyle = {
    border: borderShade,
    padding: "10px",
    borderRadius: "5px",
    minHeight: "38px",
    backgroundColor: "#f8f9fa",
    lineHeight: "1.5",
  };

  return (
    <div className={`${column} form-group`} id={colId}>
      <label className={labelClass} htmlFor={id}>
        {label}

      </label>
      <div style={divStyle} id={id} className={className}>
        {value || "N/A"}
      </div>
    </div>
  );
};

const SuccessSingleSelectField = ({ value = "" }) => {
  const divStyle = {
    border: "1px solid #ced4da",
    padding: "10px",
    borderRadius: "5px",
    minHeight: "38px",
    backgroundColor: "#f8f9fa",
    lineHeight: "1.5",
  };

  return (
    <div style={divStyle}>
      {value ? capitalizeFirstLetter(value) : "N/A"}
    </div>
  );
};


const SuccessMultiSelectField = ({ value = [] }) => {
  const divStyle = {
    border: "1px solid #ced4da",
    padding: "10px",
    borderRadius: "5px",
    minHeight: "38px",
    backgroundColor: "#f8f9fa",
    lineHeight: "1.5",
  };

  return (
    <div style={divStyle}>
      {value.length > 0
        ? value.map((item, index) => (
          <span key={index} className="badge badge-primary mr-2">
            {capitalizeFirstLetter(item)}
          </span>
        ))
        : "N/A"}
    </div>
  );
};



const McqForm = ({ item, index }) => {
  const [formData, setFormData] = useState({
    question_mcq: item?.question_mcq || "",
    option1_mcq: item?.option1_mcq || "",
    option2_mcq: item?.option2_mcq || "",
    option3_mcq: item?.option3_mcq || "",
    option4_mcq: item?.option4_mcq || "",
    answer_mcq: item?.answer_mcq ? item.answer_mcq : [],
    markedByStudent: item?.markedByStudent,
    description: item?.description || "",
  });
  /**
 * ROLE & PERMISSION
 */
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Assignment Response", "list")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */
  useEffect(() => {
    setFormData(item);
  }, [item]);

  return (
    <div className="row">
      <div className="col-md-12 mx-auto">
        <div className="card">
          <div className="card-body">
            <div className="card-title">Question {index + 1}</div>

            <div className=" row col-12 form-group">
              <SuccessTextareaField
                label="Question"
                name="question_mcq"
                id="question_mcq"
                type="text"
                value={formData.question_mcq}
                column="col-md-12 col-lg-12"
                readOnly
              />
              <SuccessTextareaField
                borderSuccess={
                  formData?.markedByStudent?.includes("option1") &&
                  formData?.answer_mcq?.includes("option1")
                }
                borderError={
                  formData?.markedByStudent?.includes("option1") &&
                  !formData?.answer_mcq?.includes("option1")
                }
                label="Option 1"
                name="option1_mcq"
                id="option1_mcq"
                type="text"
                value={formData.option1_mcq}
                column="col-md-3 col-lg-3"
                readOnly
              />

              <SuccessTextareaField
                borderSuccess={
                  formData?.markedByStudent?.includes("option2") &&
                  formData?.answer_mcq?.includes("option2")
                }
                borderError={
                  formData?.markedByStudent?.includes("option2") &&
                  !formData?.answer_mcq?.includes("option2")
                }
                label="Option 2"
                name="option2_mcq"
                id="option2_mcq"
                type="text"
                value={formData.option2_mcq}
                column="col-md-3 col-lg-3"
                readOnly
              />
              <SuccessTextareaField
                borderSuccess={
                  formData?.markedByStudent?.includes("option3") &&
                  formData?.answer_mcq?.includes("option3")
                }
                borderError={
                  formData?.markedByStudent?.includes("option3") &&
                  !formData?.answer_mcq?.includes("option3")
                }
                label="Option 3"
                name="option3_mcq"
                id="option3_mcq"
                type="text"
                value={formData.option3_mcq}
                column="col-md-3 col-lg-3"
                readOnly
              />
              <SuccessTextareaField
                borderSuccess={
                  formData?.markedByStudent?.includes("option4") &&
                  formData?.answer_mcq?.includes("option4")
                }
                borderError={
                  formData?.markedByStudent?.includes("option4") &&
                  !formData?.answer_mcq?.includes("option4")
                }
                label="Option 4"
                name="option4_mcq"
                id="option4_mcq"
                type="text"
                value={formData.option4_mcq}
                column="col-md-3 col-lg-3"
                readOnly
              />

              <SuccessFormField
                borderSuccess={
                  formData?.markedByStudent?.includes("option5") &&
                  formData?.answer_mcq?.includes("option5")
                }
                borderError={
                  formData?.markedByStudent?.includes("option5") &&
                  !formData?.answer_mcq?.includes("option5")
                }
                label="Option 5"
                name="option5_mcq"
                id="option5_mcq"
                type="text"
                value={"None of these"}
                column="col-md-6 col-lg-6"
              />
              <div className="col-md-6 col-lg-6 col-12 col-sm-12 form-group">
                <label className="font-weight-semibold">
                  Correct Answer
                </label>

                <SuccessMultiSelectField
                  value={
                    formData.answer_mcq
                  }
                />
              </div>
              <SuccessTextareaField
                label="Remark "
                name="description"
                id="description"
                type="text"
                value={formData.description}
                column="col-md-12 col-lg-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ScqForm = ({ item, index }) => {
  const [formData, setFormData] = useState({
    question_scq: item?.question_scq || "",
    option1_scq: item?.option1_scq || "",
    option2_scq: item?.option2_scq || "",
    option3_scq: item?.option3_scq || "",
    option4_scq: item?.option4_scq || "",
    answer_scq: item?.answer_scq ? item.answer_scq : [],
    markedByStudent: item?.markedByStudent,
    description: item?.description || "",
  });

  useEffect(() => {
    setFormData(item);
  }, [item]);

  return (
    <div className="row">
      <div className="col-md-12 mx-auto">
        <div className="card">
          <div className="card-body">
            <div className="card-title">Question {index + 1}</div>

            <div className=" row col-12 form-group">
              <SuccessTextareaField
                label="Question"
                name="question_scq"
                id="question_scq"
                type="text"
                value={formData.question_scq}
                column="col-md-12 col-lg-12"
                readOnly
              />
              <SuccessTextareaField
                borderSuccess={
                  formData?.markedByStudent == "option1" &&
                  "option1" == formData?.answer_scq
                }
                borderError={
                  formData?.markedByStudent == "option1" &&
                  "option1" != formData?.answer_scq
                }
                label="Option 1"
                name="option1_scq"
                id="option1_scq"
                type="text"
                value={formData.option1_scq}
                column="col-md-3 col-lg-3"
                readOnly
              />
              <SuccessTextareaField
                borderSuccess={
                  formData?.markedByStudent == "option2" &&
                  "option2" == formData?.answer_scq
                }
                borderError={
                  formData?.markedByStudent == "option2" &&
                  "option2" != formData?.answer_scq
                }
                label="Option 2"
                name="option2_scq"
                id="option2_scq"
                type="text"
                value={formData.option2_scq}
                column="col-md-3 col-lg-3"
                readOnly
              />
              <SuccessTextareaField
                borderSuccess={
                  formData?.markedByStudent == "option3" &&
                  "option3" == formData?.answer_scq
                }
                borderError={
                  formData?.markedByStudent == "option3" &&
                  "option3" != formData?.answer_scq
                }
                label="Option 3"
                name="option3_scq"
                id="option3_scq"
                type="text"
                value={formData.option3_scq}
                column="col-md-3 col-lg-3"
                readOnly
              />
              <SuccessTextareaField
                borderSuccess={
                  formData?.markedByStudent == "option4" &&
                  "option4" == formData?.answer_scq
                }
                borderError={
                  formData?.markedByStudent == "option4" &&
                  "option4" != formData?.answer_scq
                }
                label="Option 4"
                name="option4_scq"
                id="option4_scq"
                type="text"
                value={formData.option4_scq}
                column="col-md-3 col-lg-3"
                readOnly
              />

              <SuccessFormField
                borderSuccess={
                  formData?.markedByStudent == "option5" &&
                  "option5" == formData?.answer_scq
                }
                borderError={
                  formData?.markedByStudent == "option5" &&
                  "option5" != formData?.answer_scq
                }
                label="Option 5"
                name="option5_scq"
                id="option5_scq"
                type="text"
                value={"None of these"}
                column="col-md-6 col-lg-6"
              />
              <div className="col-md-6 col-lg-6 col-12 col-sm-12 form-group">
                <label className="font-weight-semibold">
                  Correct Answer
                </label>

                <SuccessSingleSelectField
                  value={
                    formData.answer_scq
                  }
                />
              </div>
              <SuccessTextareaField
                label="Remark "
                name="description"
                id="description"
                type="text"
                value={formData.description}
                column="col-md-12 col-lg-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ImageForm = ({ item, index }) => {
  const [formData, setFormData] = useState({
    question_image1: item?.question_image1 || "",
    option1: item?.option1 || "",
    option2: item?.option2 || "",
    option3: item?.option3 || "",
    option4: item?.option4 || "",
    unlink_question_image1: item?.unlink_question_image1 || "",
    unlink_option1: item?.unlink_option1 || "",
    unlink_option2: item?.unlink_option2 || "",
    unlink_option3: item?.unlink_option3 || "",
    unlink_option4: item?.unlink_option4 || "",
    markedByStudent: item?.markedByStudent,
    answer_image: item?.answer_image ? item.answer_image : [],
    description: item?.description || "",
  });

  const [previewQuestion, setPreviewQuestion] = useState();
  const [previewOption1, setPreviewOption1] = useState();
  const [previewOption2, setPreviewOption2] = useState();
  const [previewOption3, setPreviewOption3] = useState();
  const [previewOption4, setPreviewOption4] = useState();

  useEffect(() => {
    if (item?.updateid) {
      setFormData(item);

      setPreviewQuestion(
        `${FILE_API_URL}/assignment/${item?.unlink_question_image1}`
      );
      setPreviewOption1(
        `${FILE_API_URL}/assignment/${item?.unlink_option1}`
      );
      setPreviewOption2(
        `${FILE_API_URL}/assignment/${item?.unlink_option2}`
      );
      setPreviewOption3(
        `${FILE_API_URL}/assignment/${item?.unlink_option3}`
      );
      setPreviewOption4(
        `${FILE_API_URL}/assignment/${item?.unlink_option4}`
      );
    }
  }, []);

  return (
    <div className="row">
      <div className="col-md-12 mx-auto">
        <div className="card">
          <div className="card-body">
            <div className="card-title">Question {index + 1}</div>

            <div className="row col-12 form-group">

              {previewQuestion && (
                <div className="col-md-12 col-lg-12 d-flex justify-content-center">
                  <img
                    src={previewQuestion}
                    alt="Preview"
                    className="img-fluid  mb-3"
                    style={{ maxHeight: "300px", maxWidth: "300px" }}
                  />
                </div>
              )}

              <div className="col-12">
                <div className="row">
                  <div className="col-md-3 col-lg-3">
                    <SuccessFormField
                      borderSuccess={
                        formData?.markedByStudent == "option1" &&
                        "option1" == formData?.answer_image
                      }
                      borderError={
                        formData?.markedByStudent == "option1" &&
                        "option1" != formData?.answer_image
                      }
                      value="Option 1"
                      name="option1"
                      id="option1"
                      type="file"
                      column=""
                      accept=".png, .jpg, .jpeg, .webp"
                      readOnly
                    />
                    {previewOption1 && (
                      <div className="col-md-12 col-lg-12 d-flex justify-content-center">
                        <img
                          src={previewOption1}
                          alt="Preview"
                          className="img-fluid mt-3 mb-3"
                          style={{ maxHeight: "300px", maxWidth: "300px" }}
                        />{" "}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 col-lg-3">
                    <SuccessFormField
                      borderSuccess={
                        formData?.markedByStudent == "option2" &&
                        "option2" == formData?.answer_image
                      }
                      borderError={
                        formData?.markedByStudent == "option2" &&
                        "option2" != formData?.answer_image
                      }
                      value="Option 2"
                      name="option2"
                      id="option2"
                      type="file"
                      column=""
                      accept=".png, .jpg, .jpeg, .webp"
                      readOnly
                    />
                    {previewOption2 && (
                      <div className="col-md-12 col-lg-12 d-flex justify-content-center">
                        <img
                          src={previewOption2}
                          alt="Preview"
                          className="img-fluid mt-3 mb-3"
                          style={{ maxHeight: "300px", maxWidth: "300px" }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 col-lg-3">
                    <SuccessFormField
                      borderSuccess={
                        formData?.markedByStudent == "option3" &&
                        "option3" == formData?.answer_image
                      }
                      borderError={
                        formData?.markedByStudent == "option3" &&
                        "option3" != formData?.answer_image
                      }
                      value="Option 3"
                      name="option3"
                      id="option3"
                      type="file"
                      column=""
                      accept=".png, .jpg, .jpeg, .webp"
                      readOnly
                    />
                    {previewOption3 && (
                      <div className="col-md-12 col-lg-12 d-flex justify-content-center">
                        <img
                          src={previewOption3}
                          alt="Preview"
                          className="img-fluid mt-3 mb-3"
                          style={{ maxHeight: "300px", maxWidth: "300px" }}
                        />{" "}
                      </div>
                    )}
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <SuccessFormField
                      borderSuccess={
                        formData?.markedByStudent == "option4" &&
                        "option4" == formData?.answer_image
                      }
                      borderError={
                        formData?.markedByStudent == "option4" &&
                        "option4" != formData?.answer_image
                      }
                      value="Option 4"
                      name="option4"
                      id="option4"
                      type="file"
                      column=""
                      accept=".png, .jpg, .jpeg, .webp"
                      readOnly
                    />
                    {previewOption4 && (
                      <div className="col-md-12 col-lg-12 d-flex justify-content-center">
                        <img
                          src={previewOption4}
                          alt="Preview"
                          className="img-fluid mt-3 mb-3"
                          style={{ maxHeight: "300px", maxWidth: "300px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>




              <SuccessFormField
                borderSuccess={
                  formData?.markedByStudent == "option5" &&
                  "option5" == formData?.answer_image
                }
                borderError={
                  formData?.markedByStudent == "option5" &&
                  "option5" != formData?.answer_image
                }
                value="Option 5 (None of these)"
                name="option5_scq"
                id="option5_scq"
                type="text"
                column="col-md-6 col-lg-6"
                readOnly
              />
              <div className="col-md-6 col-lg-6 col-12 col-sm-12 form-group">
                <label className="font-weight-semibold">
                  Correct Answer
                </label>

                <SuccessSingleSelectField
                  value={
                    formData.answer_image
                  }
                />
              </div>
              <SuccessTextareaField
                label="Remark "
                name="description"
                id="description"
                type="text"
                value={formData.description}
                column="col-md-12 col-lg-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const DescriptionForm = ({ item, updateFormData, index }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(item);
  }, [item]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    updateFormData(index, updatedData);
  };

  return (
    <div className="row">
      <div className="col-md-12 mx-auto">
        <div className="card">
          <div className="card-body">
            <div className="card-title">Question {index + 1}</div>

            <div className=" row col-12 form-group">
              <SuccessTextareaField
                label="Question"
                name="question_desc"
                id="question_desc"
                type="text"
                value={formData?.question_desc}
                column="col-md-12 col-lg-12"
                readOnly
              />

              <FormField
                label="Remark"
                name="remark"
                id="remark"
                type="text"
                value={formData?.remark}
                onChange={handleChange}
                column="col-md-10 col-lg-10"
              />
              <FormField
                label="Marks"
                name="marks"
                id="marks"
                type="text"
                value={formData?.marks}
                onChange={handleChange}
                column="col-md-2 col-lg-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssignmentResponseView = () => {
  const [assignmentResponse, setAssignmentResponse] = useState([]);
  const [isFetching, setIsFetching] = useState([]);
  const { id } = useParams();

  const [assignmentId, setAssignmentId] = useState();
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignmentDetail, setAssignmentDetail] = useState();
  const [isSubmit, setIsSubmit] = useState();

  const fetchAssignmentDetail = async () => {
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
        response?.data?.data?.length > 0
      ) {
        setAssignmentDetail(response?.data?.data[0]);
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetail();

    }
  }, [assignmentId]);
  useEffect(() => {

    fetchQuestion();



  }, [assignmentDetail]);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("assignment_id", assignmentId);
      bformData.append("data", "load_assignment_questions");

      const response = await axios.post(
        `${PHP_API_URL}/assignment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200) {
        const questions = response?.data?.data;

        let answerSubmittedByStudent = {};

        if (assignmentDetail?.question_type !== "description") {
          assignmentResponse.response.map((question) => {
            answerSubmittedByStudent[question?.question_id] =
              question?.answer?.split("$;");
          });
        }

        if (assignmentDetail?.question_type === "description") {
          assignmentResponse.response.map((question) => {
            answerSubmittedByStudent[question?.question_id] = question;
          });
        }



        if (questions[0]?.question_type === "mcq") {
          const formattedQuestions = questions.map((question) => ({
            question_mcq: question?.question,
            option1_mcq: question?.option1,
            option2_mcq: question?.option2,
            option3_mcq: question?.option3,
            option4_mcq: question?.option4,
            answer_mcq: question?.answer.split("$;"),
            description: question?.description,
            markedByStudent: answerSubmittedByStudent[question?.id] || null,
            updateid: question?.id,
          }));

          setQuestionList((prev) => [...prev, ...formattedQuestions]);
        }

        if (questions[0]?.question_type === "scq") {
          const formattedQuestions = questions.map((question) => ({
            question_scq: question?.question,
            option1_scq: question?.option1,
            option2_scq: question?.option2,
            option3_scq: question?.option3,
            option4_scq: question?.option4,
            answer_scq: question?.answer,
            markedByStudent: answerSubmittedByStudent[question?.id] || null,
            description: question?.description,
            updateid: question?.id,
          }));

          setQuestionList((prev) => [...prev, ...formattedQuestions]);
        }

        if (questions[0]?.question_type === "image") {
          const formattedQuestions = questions.map((question) => ({
            question_image1: question?.question,
            option1: question?.option1,
            option2: question?.option2,
            option3: question?.option3,
            option4: question?.option4,
            unlink_question_image1: question?.question,
            unlink_option1: question?.option1,
            unlink_option2: question?.option2,
            unlink_option3: question?.option3,
            unlink_option4: question?.option4,
            answer_image: question?.answer,
            markedByStudent: answerSubmittedByStudent[question?.id] || null,
            description: question?.description,
            updateid: question?.id,
          }));

          setQuestionList((prev) => [...prev, ...formattedQuestions]);
        }
        if (questions[0]?.question_type === "description") {
          const formattedQuestions = questions.map((question) => ({
            question_desc: question?.question,
            answer_desc: question?.description,
            updateid: question?.id,
            remark: answerSubmittedByStudent[question?.id]?.remark || " ",
            marks: answerSubmittedByStudent[question?.id]?.marks || 0,
          }));

          setQuestionList((prev) => [...prev, ...formattedQuestions]);
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
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

    if (questionList.length < 1) {
      toast.error("Please add question");
      return setIsSubmit(false);
    }

    try {
      let formData = {};
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      formData.response_id = id;
      formData.data = "assignment_evaluate";

      const bformData = new FormData();
      const resArray = convertToStructuredArray(questionList);
      Object.keys(resArray).forEach((key) => {
        const value = resArray[key];
        value?.map((ele) => {
          if (key === "marks" || key === "remark") {
            bformData.append(`${key}[]`, ele);
          }
          if (key === "updateid") {
            bformData.append(`question_id[]`, ele);
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

        if (response?.data?.status === 201) {
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 401 || status === 500) {
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

  const fetchAssignmentusingResponsePhp = async () => {
    setIsFetching(true);
    if (!id) {
      toast.error("Please Get The Id");
      return setIsFetching(false);
    }

    try {
      let bformData = new FormData();

      bformData.append("data", "assignment_response_view_f");
      bformData.append("response_id", id);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));



      const response = await axios.post(
        `${PHP_API_URL}/assignment.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === 200 && response.data.data.length > 0) {
        // toast.success(response?.data?.msg);
        setAssignmentId(response?.data?.data[0]?.assignment_id);
        setAssignmentResponse(response?.data?.data[0]);
      } else {
        setAssignmentResponse([]);
      }
    } catch (error) {
      setAssignmentResponse([]);
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
    fetchAssignmentusingResponsePhp();
  }, []);
  const handleFormDataChange = (index, newFormData) => {
    const updatedQuestions = [...questionList];
    updatedQuestions[index] = newFormData;
    setQuestionList(updatedQuestions);
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Exam Management
                  </a>
                  <span className="breadcrumb-item">Assignment Response</span>
                  <span className="breadcrumb-item active">
                    View Assignment Response
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">View Assignment Response</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {hasPermission("Assignment","list") && (
                  <Link to="/admin/assignment-response">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-list mr-2"></i>Assignment Response
                      List
                    </button>
                  </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card px-2 py-2">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 card-title">
                        {capitalizeFirstLetter(
                          assignmentDetail?.assignment_title
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-between">
                      <div className="">
                        <div className="col-12 mb-1">
                          {" "}
                          Question Type :{" "}
                          {capitalizeFirstLetter(
                            assignmentDetail?.question_type
                          )}
                        </div>
                        <div className="col-12 mb-1">
                          {" "}
                          Total Marks : {assignmentDetail?.total_marks}
                        </div>
                        <div className="col-12 mb-1">
                          {" "}
                          Number of questions :{" "}
                          {assignmentDetail?.number_of_question}
                        </div>
                        <div className="col-12 mb-1">
                          {" "}
                          Marks per question :{" "}
                          {assignmentDetail?.marks_per_question}
                        </div>
                        {assignmentDetail?.minus_mark > 0 && (
                          <div className="col-12 mb-1">
                            {" "}
                            Marks per wrong answer :{" "}
                            {assignmentDetail?.minus_mark}
                          </div>
                        )}

                        <div className="col-12 ">
                          {" "}
                          Deadline Date :{" "}
                          <span className="text-danger">
                            {formatDate(assignmentDetail?.deadline_date)}{" "}
                          </span>
                        </div>
                      </div>
                      <div className="">
                        <div className="col-12 mb-1">
                          {" "}
                          Marks Obtain : {assignmentResponse?.marks}
                        </div>

                        {assignmentDetail?.question_type != "description" && (
                          <>
                            <div className="col-12 mb-1">
                              {" "}
                              Number of question attempted :{" "}
                              {assignmentResponse?.attempted}
                            </div>
                            <div className="col-12 mb-1">
                              {" "}
                              Number of wrong questions :{" "}
                              {assignmentResponse?.wrong}{" "}
                              <i className="fa-solid fa-xmark text-danger"></i>
                            </div>
                            <div className="col-12 mb-1">
                              {" "}
                              Number of right question :{" "}
                              {assignmentResponse?.right_}{" "}
                              <i className="fa-solid fa-check text-success"></i>
                            </div>{" "}
                          </>
                        )}
                        <div className="col-12">
                          {" "}
                          Submission Date{" "}
                          <span className="text-success">
                            {formatDate(assignmentResponse?.submission_date)}{" "}
                          </span>
                        </div>
                      </div>

                      <div className="">
                        <div className="row">
                          <div className="">
                            <div className="col-12 mb-1">
                              {" "}
                              <i className="fa-solid fa-circle-user mr-2"></i>
                              {capitalizeFirstLetter(assignmentResponse?.sname)}
                            </div>
                            <div className="col-12 mb-1">
                              {" "}
                              <i className="fa-solid fa-address-card mr-2"></i>{" "}
                              {capitalizeEachLetter(
                                assignmentResponse?.enrollmentNo
                              )}
                            </div>
                            <div className="col-12 mb-1">
                              {" "}
                              <i className="fa-solid fa-envelope mr-2"></i>{" "}
                              {capitalizeFirstLetter(
                                assignmentResponse?.semail
                              )}
                            </div>
                            <div className="col-12 ">
                              {" "}
                              <i className="fa-solid fa-phone mr-2"></i>{" "}
                              {capitalizeFirstLetter(
                                assignmentResponse?.sphone
                              )}
                            </div>
                          </div>
                          <div className="col-2">
                            <img
                              src={`${FILE_API_URL}/student/${assignmentResponse.student_id}${assignmentResponse.registrationNo}/${assignmentResponse.spic}`}
                              alt=""
                              className="mr-3"
                              style={{ width: "80px", height: "100px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!loading && assignmentDetail?.question_type !== "description" && (
              <>
                {assignmentDetail?.question_type === "mcq" &&
                  questionList &&
                  questionList.length > 0 &&
                  questionList.map((data, index) => (
                    <div key={index}>
                      <McqForm item={data} index={index} />
                    </div>
                  ))}
                {assignmentDetail?.question_type === "scq" &&
                  questionList &&
                  questionList.length > 0 &&
                  questionList.map((data, index) => (
                    <div key={index}>
                      <ScqForm item={data} index={index} />
                    </div>
                  ))}
                {assignmentDetail?.question_type === "image" &&
                  questionList &&
                  questionList.length > 0 &&
                  questionList.map((data, index) => (
                    <div key={index}>
                      <ImageForm item={data} index={index} />
                    </div>
                  ))}
              </>
            )}
            {!loading && assignmentDetail?.question_type === "description" && (
              <div className="row">
                <div className="col-6 description-container">
                  {assignmentDetail?.question_type === "description" &&
                    questionList &&
                    questionList.length > 0 &&
                    questionList.map((data, index) => (
                      <div key={index}>
                        <DescriptionForm
                          item={data}
                          updateFormData={handleFormDataChange}
                          index={index}
                        />
                      </div>
                    ))}
                  <div className="col-md-12 col-lg-12 col-12">
                    {!isSubmit ? (
                      <button className="btn btn-dark" onClick={handleSubmit}>
                        Save{" "}
                      </button>
                    ) : (
                      <button className="btn btn-dark " type="submit" disabled>
                        Saving &nbsp; <div className="loader-circle"></div>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-6 response-container">
                  {assignmentDetail?.question_type === "description" &&
                    questionList &&
                    questionList.length > 0 && (
                      <iframe
                        src={`${FILE_API_URL}/assignmentresponse/${assignmentResponse?.response_file}`}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                      ></iframe>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .card-body {
            padding: 10px;
          }
          .description-container,
          .response-container {
            max-height: 600px;
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 10px;
          }
        `}
      </style>
    </>
  );
};

export default AssignmentResponseView;
