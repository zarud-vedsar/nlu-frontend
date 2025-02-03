import React, { useEffect, useState } from "react";
import { NODE_API_URL, CKEDITOR_URL, PHP_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import {
  FormField,
  TextareaField,
} from "../../../site-components/admin/assets/FormField";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import validator from "validator";

function AddExpense() {
  // Initial form state
  const initialForm = {
    cat_id:"",
amount:"",
date:"",
remark: "",
creditto: "",
mobileno: ""
  };
  const { expenseId } = useParams();
  const [formData, setFormData] = useState(initialForm); // Form state
  const [expenseCategory, setExpenseCategory] = useState([]); // Department list
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [error, setError] = useState({ field: "", msg: "" }); // Error state



  // Fetch department list
  const fetchDepartmentList = async (deleteStatus = 0) => {
    try {
        const bformData = new FormData();
        bformData?.append("data","load_ExpenseCategory_front")
      const response = await dataFetchingPost(
        `${PHP_API_URL}/expense.php`,
        bformData,
        {headers:{
            "Content-Type":"multipart/form-data"
        }}
      );
      console.log(response)
      if (response.statusCode === 200) {
        setDepartment(response.data || []);
      } else {
        toast.error("No department data found.");
      }
    } catch (error) {
      toast.error("Error fetching departments. Check your connection.");
    }
  };

  useEffect(() => {
    fetchDepartmentList(); // Load departments on mount
  }, []);
//   const updateFetchData = async (courseId) => {
//     if (
//       !courseId ||
//       !Number.isInteger(parseInt(courseId, 10)) ||
//       parseInt(courseId, 10) <= 0
//     )
//       return toast.error("Invalid ID.");

//     try {
//       const response = await dataFetchingPost(
//         `${NODE_API_URL}/api/course/fetch`,
//         { dbId: courseId }
//       );
//       console.log(response);
//       if (response?.statusCode === 200 && response.data.length > 0) {
//         toast.success(response.message);
//         setFormData((prev) => ({
//           ...prev,
//           dbId: response.data[0].id,
//           cat_id: response.data[0].cat_id,
//           short_description: validator.unescape(
//             response.data[0].short_description
//           ),
//           coursename: response.data[0].coursename,
//           coursecode: response.data[0].coursecode,
//           qualification: response.data[0].qualification,
//           duration: response.data[0].duration
//             ? response.data[0].duration.split(",")
//             : [response.data[0].duration],
//           medium: response.data[0].medium,
//           level: response.data[0].level,
//           description: validator.unescape(response.data[0].description),
//           pdf_file: validator.unescape(response.data[0].pdf_file),
//           thumbnail: validator.unescape(response.data[0].thumbnail),

//         }));

//         setPreviewPdf(validator.unescape(response.data[0].pdf_file));
//         setPreviewImage(validator.unescape(response.data[0].thumbnail));

//         if (window.CKEDITOR && window.CKEDITOR.instances['editor1']) {
//           window.CKEDITOR.instances['editor1'].setData(
//             validator.unescape(validator.unescape(response.data[0].description)) // Ensure content is unescaped properly
//           );
//         }
//       } else {
//         toast.error("Data not found.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       const statusCode = error.response?.data?.statusCode;

//       if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
//         toast.error(error.response.message || "A server error occurred.");
//       } else {
//         toast.error(
//           "An error occurred. Please check your connection or try again."
//         );
//       }
//     }
//   };
  useEffect(() => {
    if (expenseId) {
      updateFetchData(expenseId);
    }
  }, [expenseId]);
  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setError((prev) => ({
      ...prev,
      field: "",
      msg: "",
    }));

    if (!formData.cat_id) {
      toast.error("Category is required.");
      errorMsg("cat_id", "Category is required.");
      return setIsSubmit(false);
    }
    if (!formData.amount) {
      toast.error("Amount is required.");
      errorMsg("amount", "Amount is required.");
      return setIsSubmit(false);
    }
    
    if (!formData.date) {
      toast.error("Date is required.");
      errorMsg("date", "Date is required.");
      return setIsSubmit(false);
    }
    if (!formData.remark) {
      toast.error("Remark is required.");
      errorMsg("remark", "Remark is required.");
      return setIsSubmit(false);
    }
    const highLevelData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
     highLevelData.append(key, value);
    });
    highLevelData.append("data", "AddExpense");
    highLevelData.append("loguserid", secureLocalStorage.getItem("login_id"));
    highLevelData.append("login_type", secureLocalStorage.getItem("loginType"));
    if(expenseId){
        highLevelData.append("updateid",expenseId)
    }
    try {
      // submit to the API here
      const response = await axios.post(
        `${PHP_API_URL}/expense.php`,
        highLevelData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response)
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        if (response.data?.statusCode === 201) {
          // Reset form data to initial state
          setFormData({ ...initialForm });
        }
        else if (response.data?.statusCode === 200) {
          // Reset form data to initial state
          setFormData({ ...initialForm });
          goBack();
        }
        toast.success(response.data.message);
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

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Dashboard
                  </a>
                  <span className="breadcrumb-item">Expense Management</span>
                  <span className="breadcrumb-item active">Add New Expense</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {expenseId ? "Update Expense" : "Add New Expense"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link
                    to="/admin/course"
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-list" /> Expense List
                  </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 form-group">
                      <label className="font-weight-semibold">
                        Expense Category <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={expenseCategory.map((item) => ({
                          value: item.id,
                          label: item.dtitle,
                        }))}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            cat_id: selectedOption.value,
                          })
                        }
                        value={
                          department.find(
                            (page) =>
                              page.id === parseInt(formData.cat_id)
                          )
                            ? {
                              value: parseInt(formData.cat_id),
                              label: department.find(
                                (page) =>
                                  page.id === parseInt(formData.cat_id)
                              ).dtitle,
                            }
                            : { value: formData.cat_id, label: "Select" }
                        }
                      />
                      {error.field === "cat_id" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>

                    <FormField
                      borderError={error.field === "amount"}
                      errorMessage={error.field === "amount" && error.msg}
                      label="Amount"
                      name="amount"
                      id="amount"
                      type="text"
                      value={formData.amount}
                      onChange={handleChange}
                      column="col-md-4"
                      required
                    />

                    <FormField
                      borderError={error.field === "date"}
                      errorMessage={error.field === "date" && error.msg}
                      label="Date"
                      name="date"
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      column="col-md-4"
                      required
                    />

                   


                    <TextareaField
                      borderError={error.field === "remark"}
                      errorMessage={
                        error.field === "remark" && error.msg
                      }
                      label="Remark "
                      name="remark"
                      id="remark"
                      required={true}
                      value={formData.remark}
                      onChange={handleChange}
                      column="col-md-12 form-group"
                    />


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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddExpense;
