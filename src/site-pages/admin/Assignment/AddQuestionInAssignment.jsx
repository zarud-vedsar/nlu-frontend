import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FormField,
  TextareaField,
} from "../../../site-components/admin/assets/FormField";
import Select from "react-select";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import {
  FILE_API_URL,
  NODE_API_URL,
  PHP_API_URL,
} from "../../../site-components/Helper/Constant";
import axios from "axios";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import useRolePermission from "../../../site-components/admin/useRolePermission";
const McqForm = ({ item, updateFormData, removeQuestion, index }) => {
  const [formData, setFormData] = useState({
    question_mcq: item?.question_mcq || "",
    option1_mcq: item?.option1_mcq || "",
    option2_mcq: item?.option2_mcq || "",
    option3_mcq: item?.option3_mcq || "",
    option4_mcq: item?.option4_mcq || "",
    answer_mcq: item?.answer_mcq ? item.answer_mcq : [],
    description: item?.description || "",
  });
  /**
 * ROLE & PERMISSION
 */
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      const showSubMenu = hasPermission("Assignment", "add question");
      if (!showSubMenu) {
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
              <TextareaField
                label="MCQ: (Write question here)"
                name="question_mcq"
                id="question_mcq"
                type="text"
                value={formData.question_mcq}
                onChange={handleChange}
                column="col-md-12 col-lg-12"
                required
              />
              <TextareaField
                label="Option 1"
                name="option1_mcq"
                id="option1_mcq"
                type="text"
                value={formData.option1_mcq}
                onChange={handleChange}
                column="col-md-3 col-lg-3"
                required
              />
              <TextareaField
                label="Option 2"
                name="option2_mcq"
                id="option2_mcq"
                type="text"
                value={formData.option2_mcq}
                onChange={handleChange}
                column="col-md-3 col-lg-3"
                required
              />
              <TextareaField
                label="Option 3"
                name="option3_mcq"
                id="option3_mcq"
                type="text"
                value={formData.option3_mcq}
                onChange={handleChange}
                column="col-md-3 col-lg-3"
                required
              />
              <TextareaField
                label="Option 4"
                name="option4_mcq"
                id="option4_mcq"
                type="text"
                value={formData.option4_mcq}
                onChange={handleChange}
                column="col-md-3 col-lg-3"
                required
              />

              <FormField
                label="Option 5"
                name="option5_mcq"
                id="option5_mcq"
                type="text"
                value={"None of these"}
                column="col-md-6 col-lg-6"
                readOnly
              />
              <div className="col-md-6 col-lg-6 col-12 col-sm-12 form-group">
                <label className="font-weight-semibold">
                  Select Answer: <strong className="text-danger">*</strong>
                </label>

                <Select
                  isMulti
                  options={[
                    "option1",
                    "option2",
                    "option3",
                    "option4",
                    "option5",
                  ].map((item) => ({
                    value: item,
                    label: capitalizeFirstLetter(item),
                  }))}
                  onChange={(selectedOptions) => {
                    const updatedData = {
                      ...formData,
                      answer_mcq: selectedOptions.map((option) => option.value),
                    };
                    setFormData(updatedData);
                    updateFormData(index, updatedData);
                  }}
                  value={
                    formData.answer_mcq?.length
                      ? formData.answer_mcq.map((value) => ({
                        value,
                        label: capitalizeFirstLetter(value),
                      }))
                      : []
                  }
                />
              </div>
              <TextareaField
                label="Remark (Optional)"
                name="description"
                id="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                column="col-md-12 col-lg-12"
              />
              <div className="col-md-4 col-lg-6">
                <button
                  className="btn btn-danger"
                  onClick={() => removeQuestion(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ScqForm = ({ item, updateFormData, removeQuestion, index }) => {
  const [formData, setFormData] = useState({
    question_scq: item?.question_scq || "",
    option1_scq: item?.option1_scq || "",
    option2_scq: item?.option2_scq || "",
    option3_scq: item?.option3_scq || "",
    option4_scq: item?.option4_scq || "",
    answer_scq: item?.answer_scq ? item.answer_scq : [],
    description: item?.description || "",
  });

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
              <TextareaField
                label="SCQ: (Write question here)"
                name="question_scq"
                id="question_scq"
                type="text"
                value={formData.question_scq}
                onChange={handleChange}
                column="col-md-12 col-lg-12"
                required
              />
              <TextareaField
                label="Option 1"
                name="option1_scq"
                id="option1_scq"
                type="text"
                value={formData.option1_scq}
                onChange={handleChange}
                column="col-md-3 col-lg-3"
                required
              />
              <TextareaField
                label="Option 2"
                name="option2_scq"
                id="option2_scq"
                type="text"
                value={formData.option2_scq}
                onChange={handleChange}
                column="col-md-3 col-lg-3"
                required
              />
              <TextareaField
                label="Option 3"
                name="option3_scq"
                id="option3_scq"
                type="text"
                value={formData.option3_scq}
                onChange={handleChange}
                column="col-md-3 col-lg-3"
                required
              />
              <TextareaField
                label="Option 4"
                name="option4_scq"
                id="option4_scq"
                type="text"
                value={formData.option4_scq}
                onChange={handleChange}
                column="col-md-3 col-lg-3"
                required
              />

              <FormField
                label="Option 5"
                name="option5_scq"
                id="option5_scq"
                type="text"
                value={"None of these"}
                column="col-md-6 col-lg-6"
                readOnly
              />
              <div className="col-md-6 col-lg-6 col-12 col-sm-12 form-group">
                <label className="font-weight-semibold">
                  Select Answer: <strong className="text-danger">*</strong>
                </label>

                <Select
                  options={[
                    "option1",
                    "option2",
                    "option3",
                    "option4",
                    "option5",
                  ].map((item) => ({
                    value: item,
                    label: capitalizeFirstLetter(item),
                  }))}
                  onChange={(selectedOption) => {
                    const updatedData = {
                      ...formData,
                      answer_scq: selectedOption.value,
                    };
                    setFormData(updatedData);
                    updateFormData(index, updatedData);
                  }}
                  value={
                    formData.answer_scq?.length
                      ? {
                        value: formData.answer_scq,
                        label: capitalizeFirstLetter(formData.answer_scq),
                      }
                      : []
                  }
                />
              </div>
              <TextareaField
                label="Remark (Optional)"
                name="description"
                id="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                column="col-md-12 col-lg-12"
              />
              <div className="col-md-4 col-lg-6">
                <button
                  className="btn btn-danger"
                  onClick={() => removeQuestion(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ImageForm = ({ item, updateFormData, removeQuestion, index }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    updateFormData(index, updatedData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const previewFile = URL.createObjectURL(file);
      if (id === "question_image1") {
        setPreviewQuestion(previewFile);
      }
      if (id === "option1") {
        setPreviewOption1(previewFile);
      }
      if (id === "option2") {
        setPreviewOption2(previewFile);
      }
      if (id === "option3") {
        setPreviewOption3(previewFile);
      }
      if (id === "option4") {
        setPreviewOption4(previewFile);
      }
      const updatedData = { ...formData, [id]: file };
      setFormData(updatedData);
      updateFormData(index, updatedData);
    } else {
      toast.error(
        "Invalid image format. Only png, jpeg, jpg, and webp are allowed."
      );
    }
  };

  return (
    <div className="row">
      <div className="col-md-12 mx-auto">
        <div className="card">
          <div className="card-body">
            <div className="card-title">Question {index + 1}</div>

            <div className="row col-12 form-group">
              <FormField
                label="Image Based Question: (Upload question image)"
                name="question_image1"
                id="question_image1"
                type="file"
                column="col-md-12 col-lg-12"
                onChange={handleFileChange}
                accept=".png, .jpg, .jpeg, .webp"
                required
              />

              {previewQuestion && (
                <div className="col-md-12 col-lg-12 d-flex justify-content-center">
                  <img
                    src={previewQuestion}
                    alt="Preview"
                    className="img-fluid mt-3 mb-3"
                    style={{ maxHeight: "300px", maxWidth: "300px" }}
                  />
                </div>
              )}

              <div className="col-12">
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <FormField
                      label="Option 1"
                      name="option1"
                      id="option1"
                      type="file"
                      column=""
                      onChange={handleFileChange}
                      accept=".png, .jpg, .jpeg, .webp"
                      required
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
                  <div className="col-md-6 col-lg-6">
                    <FormField
                      label="Option 2"
                      name="option2"
                      id="option2"
                      type="file"
                      column=""
                      onChange={handleFileChange}
                      accept=".png, .jpg, .jpeg, .webp"
                      required
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
                </div>
              </div>

              <div className="col-12">
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <FormField
                      label="Option 3"
                      name="option3"
                      id="option3"
                      type="file"
                      column=""
                      onChange={handleFileChange}
                      accept=".png, .jpg, .jpeg, .webp"
                      required
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
                  <div className="col-md-6 col-lg-6">
                    <FormField
                      label="Option 4"
                      name="option4"
                      id="option4"
                      type="file"
                      column=""
                      onChange={handleFileChange}
                      accept=".png, .jpg, .jpeg, .webp"
                      required
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

              <FormField
                label="Option 5"
                name="option5_scq"
                id="option5_scq"
                type="text"
                value={"None of these"}
                column="col-md-6 col-lg-6"
                readOnly
              />
              <div className="col-md-6 col-lg-6 col-12 col-sm-12 form-group">
                <label className="font-weight-semibold">
                  Select Answer: <strong className="text-danger">*</strong>
                </label>

                <Select
                  options={[
                    "option1",
                    "option2",
                    "option3",
                    "option4",
                    "option5",
                  ].map((item) => ({
                    value: item,
                    label: capitalizeFirstLetter(item),
                  }))}
                  onChange={(selectedOption) => {
                    const updatedData = {
                      ...formData,
                      answer_image: selectedOption.value,
                    };
                    setFormData(updatedData);
                    updateFormData(index, updatedData);
                  }}
                  value={
                    formData.answer_image?.length
                      ? {
                        value: formData.answer_image,
                        label: capitalizeFirstLetter(formData.answer_image),
                      }
                      : []
                  }
                />
              </div>
              <TextareaField
                label="Remark (Optional)"
                name="description"
                id="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                column="col-md-12 col-lg-12"
              />
              <div className="col-md-4 col-lg-6">
                <button
                  className="btn btn-danger"
                  onClick={() => removeQuestion(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const DescriptionForm = ({ item, updateFormData, removeQuestion, index }) => {
  const [formData, setFormData] = useState({
    question_desc: item?.question_desc || "",
    answer_desc: item?.answer_desc || "",
  });

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
              <TextareaField
                label="Descriptive: (Write question here)"
                name="question_desc"
                id="question_desc"
                type="text"
                value={formData.question_desc}
                onChange={handleChange}
                column="col-md-12 col-lg-12"
                required
              />

              <TextareaField
                label="Sample Answer"
                name="answer_desc"
                id="answer_desc"
                type="text"
                value={formData.answer_desc}
                onChange={handleChange}
                column="col-md-12 col-lg-12"
              />
              <div className="col-md-4 col-lg-6">
                <button
                  className="btn btn-danger"
                  onClick={() => removeQuestion(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddQuestionInAssignment = () => {
  const mcqStructure = [
    {
      question_mcq: null,
      option1_mcq: null,
      option2_mcq: null,
      option3_mcq: null,
      option4_mcq: null,
      answer_mcq: null,
      description: null,
    },
  ];
  const scqStructure = [
    {
      question_scq: null,
      option1_scq: null,
      option2_scq: null,
      option3_scq: null,
      option4_scq: null,
      answer_scq: null,
      description: null,
    },
  ];
  const imageqStructure = [
    {
      question_image1: null,
      option1: null,
      option2: null,
      option3: null,
      option4: null,
      unlink_question_image1: null,
      unlink_option1: null,
      unlink_option2: null,
      unlink_option3: null,
      unlink_option4: null,
      answer_image: null,
      description: null,
    },
  ];

  const descriptionStructure = [
    {
      question_desc: null,
      answer_desc: null,
    },
  ];

  const { assignmentId } = useParams();
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [questionType, setQuestionType] = useState();
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numberOfQuestion, setNumberOfQuestion] = useState(0);
  const questionTypes = ["mcq", "scq", "image", "description"];
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };

  const updateFetchData = async () => {
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
        setNumberOfQuestion(response?.data?.data[0]?.number_of_question);
        setQuestionType(response?.data?.data[0]?.question_type);
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleFormDataChange = (index, newFormData) => {
    const updatedQuestions = [...questionList];
    updatedQuestions[index] = newFormData;
    setQuestionList(updatedQuestions);
  };
  useEffect(() => {
    fetchQuestion();
    updateFetchData();
  }, [assignmentId]);
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

        if (questions[0]?.question_type === "mcq") {
          const formattedQuestions = questions.map((question) => ({
            question_mcq: question?.question,
            option1_mcq: question?.option1,
            option2_mcq: question?.option2,
            option3_mcq: question?.option3,
            option4_mcq: question?.option4,
            answer_mcq: question?.answer.split("$;"),
            description: question?.description,
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
    setIsSubmit(true);
    errorMsg("", "");
    if (numberOfQuestion > questionList.length) {
      toast.error(`Please submit ${numberOfQuestion} question`);
      return setIsSubmit(false);
    }
    if (!questionType) {
      errorMsg("questionType", "Question Type is required.");
      toast.error("Question Type is required.");
      return setIsSubmit(false);
    }
    if (questionList.length < 1) {
      toast.error("Please add question");
      return setIsSubmit(false);
    }

    if (questionType === "mcq") {
      questionList.forEach((data, index) => {
        if (!data.question_mcq) {
          toast.error(`Question ${index + 1} is required.`);
          return setIsSubmit(false);
        } else if (
          !data.option1_mcq ||
          !data.option2_mcq ||
          !data.option3_mcq ||
          !data.option4_mcq
        ) {
          toast.error(`All options for Question ${index + 1} must be filled.`);
          return setIsSubmit(false);
        }
        if (!data.answer_mcq) {
          toast.error(`Answer for Question ${index + 1} must be selected.`);
          return setIsSubmit(false);
        }
      });
    }
    if (questionType === "scq") {
      questionList.forEach((data, index) => {
        if (!data.question_scq) {
          toast.error(`Question ${index + 1} is required.`);
          return setIsSubmit(false);
        } else if (
          !data.option1_scq ||
          !data.option2_scq ||
          !data.option3_scq ||
          !data.option4_scq
        ) {
          toast.error(`All options for Question ${index + 1} must be filled.`);
          return setIsSubmit(false);
        }
        if (!data.answer_scq) {
          toast.error(`Answer for Question ${index + 1} must be selected.`);
          return setIsSubmit(false);
        }
      });
    }

    if (questionType === "image") {
      questionList.forEach((data, index) => {
        if (!data.question_image1) {
          toast.error(`Question ${index + 1} is required.`);
          return setIsSubmit(false);
        } else if (
          !data.option1 ||
          !data.option2 ||
          !data.option3 ||
          !data.option4
        ) {
          toast.error(`All options for Question ${index + 1} must be filled.`);
          return setIsSubmit(false);
        }
        if (!data.answer_image) {
          toast.error(`Answer for Question ${index + 1} must be selected.`);
          return setIsSubmit(false);
        }
      });
    }
    if (questionType === "description") {
      questionList.forEach((data, index) => {
        if (!data.question_desc) {
          toast.error(`Question ${index + 1} is required.`);
          return setIsSubmit(false);
        }
      });
    }

    errorMsg(" ", " ");

    try {
      let formData = {};
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      formData.questionType = questionType;
      formData.assignment_id = assignmentId;
      formData.data = "savequestion";

      const bformData = new FormData();
      const resArray = convertToStructuredArray(questionList);
      Object.keys(resArray).forEach((key) => {
        const value = resArray[key];
        value?.map((ele) => {
          if (key !== "answer_mcq") {
            if (ele !== undefined) {
              bformData.append(`${key}[]`, ele);
            }
          }

          if (key === "answer_mcq") {
            const temp = ele.join("$;");

            bformData.append(`${key}[]`, temp);
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
        errorMsg("", "");
        toast.success(response.data.msg);

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

  const addQuestion = () => {
    if (numberOfQuestion <= questionList.length) {
      toast.error(`Only ${numberOfQuestion} question are allowed`);
      return;
    }
    if (!questionType) {
      errorMsg("questionType", "Question Type is required.");
      toast.error("Question Type is required.");
      return;
    }
    errorMsg(" ", " ");
    if (questionType) {
      if (questionType === "mcq") {
        setQuestionList((prev) => [...prev, ...mcqStructure]);
      }
      if (questionType === "scq") {
        setQuestionList((prev) => [...prev, ...scqStructure]);
      }
      if (questionType === "image") {
        setQuestionList((prev) => [...prev, ...imageqStructure]);
      }
      if (questionType === "description") {
        setQuestionList((prev) => [...prev, ...descriptionStructure]);
      }
    }
  };

  const removeQuestion = (index) => {
    setQuestionList((prev) => prev.filter((_, i) => i !== index));
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
                  <span className="breadcrumb-item">Assignment</span>
                  <span className="breadcrumb-item active">Add Question</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Add Question</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {hasPermission("Assignment","list") && (
                  <Link to="/admin/assignment">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-list"></i> Assignment List
                    </button>
                  </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 col-lg-4 form-group">
                        <label className="font-weight-semibold">
                          Question Type <span className="text-danger">*</span>
                        </label>
                        <Select
                          options={questionTypes.map((item) => ({
                            value: item,
                            label: capitalizeFirstLetter(item),
                          }))}
                          isDisabled={true}
                          value={
                            questionTypes.includes(questionType)
                              ? {
                                value: questionType,
                                label: capitalizeFirstLetter(questionType),
                              }
                              : { value: questionType, label: "Select" }
                          }
                        />

                        {error.field === "questionType" && (
                          <span className="text-danger">{error.msg}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!loading && (
              <>
                {questionType === "mcq" &&
                  questionList &&
                  questionList.length > 0 &&
                  questionList.map((data, index) => (
                    <div key={index}>
                      <McqForm
                        item={data}
                        updateFormData={handleFormDataChange}
                        removeQuestion={removeQuestion}
                        index={index}
                      />
                    </div>
                  ))}
                  
                {questionType === "scq" &&
                  questionList &&
                  questionList.length > 0 &&
                  questionList.map((data, index) => (
                    <div key={index}>
                      <ScqForm
                        item={data}
                        updateFormData={handleFormDataChange}
                        removeQuestion={removeQuestion}
                        index={index}
                      />
                    </div>
                  ))}
                {questionType === "image" &&
                  questionList &&
                  questionList.length > 0 &&
                  questionList.map((data, index) => (
                    <div key={index}>
                      <ImageForm
                        item={data}
                        updateFormData={handleFormDataChange}
                        removeQuestion={removeQuestion}
                        index={index}
                      />
                    </div>
                  ))}
                {questionType === "description" &&
                  questionList &&
                  questionList.length > 0 &&
                  questionList.map((data, index) => (
                    <div key={index}>
                      <DescriptionForm
                        item={data}
                        updateFormData={handleFormDataChange}
                        removeQuestion={removeQuestion}
                        index={index}
                      />
                    </div>
                  ))}
              </>
            )}
            <div className="col-md-12 col-lg-12 col-12">
              <button className="btn btn-secondary mr-2" onClick={addQuestion}>
                Add Question
              </button>
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
        </div>
      </div>

      <style jsx>
        {`
          .card-body {
            padding: 10px;
          }
        `}
      </style>
    </>
  );
};

export default AddQuestionInAssignment;
