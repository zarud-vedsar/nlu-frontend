import React, { useEffect, useState } from "react";
import { PHP_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  capitalizeFirstLetter,
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

function AddExpense() {
  // Initial form state
  const phoneRegex = /^(?:\d{10})?$/;

  const initialForm = {
    cat_id: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    remark: "",
    creditto: "",
    mobileno: "",
  };
  const { expenseId } = useParams();
  const [formData, setFormData] = useState(initialForm); // Form state
  const [expenseCategory, setExpenseCategory] = useState([]); // Department list
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [error, setError] = useState({ field: "", msg: "" }); // Error state

  // Fetch department list
  const fetchCategoryList = async () => {
    try {
      const bformData = new FormData();
      bformData?.append("data", "load_ExpenseCategory_front");
      const response = await dataFetchingPost(
        `${PHP_API_URL}/expense.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setExpenseCategory(response.data || []);
      } else {
        toast.error("No department data found.");
      }
    } catch (error) {
      setExpenseCategory([]);
      toast.error("Error fetching departments. Check your connection.");
    }
  };

  useEffect(() => {
    fetchCategoryList(); // Load departments on mount
  }, []);
  const updateFetchData = async (courseId) => {
    if (
      !courseId ||
      !Number.isInteger(parseInt(courseId, 10)) ||
      parseInt(courseId, 10) <= 0
    )
      return toast.error("Invalid ID.");

    try {
      const bformData = new FormData();
      bformData.append("id", expenseId);
      bformData.append("data", "getExpenseById");
      const response = await dataFetchingPost(
        `${PHP_API_URL}/expense.php`,
        bformData
      );
      if (response?.status === 200 && response?.data?.length > 0) {
        //toast.success(response?.msg);
        let res = response?.data?.[0];
        setFormData({
          cat_id: res?.cat_id,
          amount: res?.amount,
          date: res?.date,
          remark: res?.remark,
          creditto: res?.creditto || "",
          mobileno: res?.mobileno || "",
        });
      } else {
        toast.error("Data not found.");
      }
    } catch (error) {
      setFormData(initialForm);
      const statusCode = error.response?.data?.status;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  useEffect(() => {
    if (expenseId) {
      updateFetchData(expenseId);
    }
  }, [expenseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      const regex = /^(?:\d+(\.\d*)?)?$/;

      if (!regex.test(value)) {
        return;
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        return;
      }
    }

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

    if (formData?.mobileno && !phoneRegex.test(formData?.mobileno)) {
      toast.error("Phone number must be 10 digits");

      errorMsg("mobileno", "Phone number must be 10 digits");
      return setIsSubmit(false);
    } else {
      errorMsg("", "");
    }

    const highLevelData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      highLevelData.append(key, value);
    });
    highLevelData.append("data", "AddExpense");
    highLevelData.append("loguserid", secureLocalStorage.getItem("login_id"));
    highLevelData.append("login_type", secureLocalStorage.getItem("loginType"));
    if (expenseId) {
      highLevelData.append("updateid", expenseId);
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
      if (response.data?.status === 200 || response.data?.status === 201) {
        errorMsg("", "");
        if (response.data?.status === 201) {
          // Reset form data to initial state
          setFormData({ ...initialForm });
        } else if (response.data?.status === 200) {
          // Reset form data to initial state
          setFormData({ ...initialForm });
          goBack();
        }
        toast.success(response.data?.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.status;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
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
                  <span className="breadcrumb-item active">
                  {expenseId ? "Update Expense" : "Add New Expense"}
                  </span>
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
                    to="/admin/expense/list"
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
                    <div className="col-md-7 form-group">
                      <label className="font-weight-semibold">
                        Expense Category <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={expenseCategory.map((item) => ({
                          value: item.id,
                          label: capitalizeFirstLetter(item.cat_title),
                        }))}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            cat_id: selectedOption.value,
                          })
                        }
                        value={
                          expenseCategory.find(
                            (category) =>
                              category.id === parseInt(formData.cat_id)
                          )
                            ? {
                                value: parseInt(formData.cat_id),
                                label: capitalizeFirstLetter(
                                  expenseCategory.find(
                                    (category) =>
                                      category.id === parseInt(formData.cat_id)
                                  ).cat_title
                                ),
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
                      placeholder="0"
                      type="text"
                      value={formData.amount}
                      onChange={handleChange}
                      column="col-md-5"
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
                    <FormField
                      label="Creditor Name"
                      name="creditto"
                      id="creditto"
                      placeholder="Enter Creditor Name"
                      type="text"
                      value={formData.creditto}
                      onChange={handleChange}
                      column="col-md-4"
                    />
                    <FormField
                      borderError={error.field === "mobileno"}
                      errorMessage={error.field === "mobileno" && error.msg}
                      label="Creditor Phone"
                      name="mobileno"
                      id="mobileno"
                      type="text"
                      placeholder="0123456789"
                      value={formData.mobileno}
                      onChange={handleChange}
                      column="col-md-4"
                    />

                    <TextareaField
                      borderError={error.field === "remark"}
                      errorMessage={error.field === "remark" && error.msg}
                      label="Remark "
                      name="remark"
                      id="remark"
                      placeholder="Enter Remark"
                      required={true}
                      value={formData.remark}
                      onChange={handleChange}
                      column="col-md-12 form-group"
                    />

                    <div className="col-md-12 col-lg-12 col-12">
                      <button
                        className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                        type="submit"
                        disabled={isSubmit}
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
