import React, { useEffect, useState } from "react";
import {
 
  PHP_API_URL,
} from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import Select from "react-select";
import {
  FormField,
} from "../../../site-components/admin/assets/FormField";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import "../../../../node_modules/primeicons/primeicons.css";
import { Modal, Button, Form, Row } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { InputText } from "primereact/inputtext";
import { FaFilter } from "react-icons/fa";
import { DeleteSweetAlert } from "../../../site-components/Helper/DeleteSweetAlert";

function ExpenseList() {
  // Initial form state
  const phoneRegex = /^(?:\d{10})?$/; // Allows 10 digits or empty

  const initialForm = {
    cat_id: "",
    fromdate: "",
    todate: "",
  };
  const [filters, setFilters] = useState(initialForm);
  const [expenseList, setExpenseList] = useState([]); // Form state
  const [expenseCategory, setExpenseCategory] = useState([]); 
  const [isFetching, setIsFetching] = useState(false); // Form submission state
  const [showFilter, setShowFilter] = useState(false);

    const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  
   

  const handleClose = () => setShowFilter(false);
  const handleShow = () => setShowFilter(true);
  const resetFilters = () => {
    setFilters(() => ({ ...initialForm}));
    fetchList();
  };

  const applyFilters = () => {
    fetchList(false,true);
  };
  const fetchCategoryList = async () => {
    try {
      const bfilters = new FormData();
      bfilters?.append("data", "load_ExpenseCategory_front");
      const response = await dataFetchingPost(
        `${PHP_API_URL}/expense.php`,
        bfilters,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setExpenseCategory(response.data || []);
      } else {
        toast.error("No data found.");
      }
    } catch (error) {
      setExpenseCategory([]);
      toast.error("Error fetching data. Check your connection.");
    }
  };

  useEffect(() => {
    fetchCategoryList();
    fetchList();
  }, []);

  const fetchList = async (e = false , filter=false) => {
    if (e) {
      e.preventDefault();
    }
    setIsFetching(true);

    const highLevelData = new FormData();
    Object.entries(filters).forEach(([key, value]) => {
      highLevelData.append(key, value);
    });
    highLevelData.append("data", "load_Expense");
    highLevelData.append("loguserid", secureLocalStorage.getItem("login_id"));
    highLevelData.append("login_type", secureLocalStorage.getItem("loginType"));

    if(filter){
        Object.entries(filters).forEach(([key,value])=>{
            highLevelData.append(key,value);
        })
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

        setExpenseList(response?.data?.data);

        //toast.success(response.data?.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      setExpenseList([]);
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
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const deleteExpense = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_expense");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert(" ");
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/expense.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == 200) {
          toast.success(response.data.msg);
          fetchList()
        }
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else if (status == 400) {
        toast.error(error.response.data.msg);
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
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
                  <span className="breadcrumb-item active">Expense List</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Expense List</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                   
                  <Link
                    to="/admin/expense/add-new"
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-plus" /> Add New
                  </Link>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-7 col-lg-7 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                    <div className="search-icon">
                      <i className="pi pi-search" />
                    </div>
                    <InputText
                      type="search"
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      placeholder="Search"
                      className="form-control dtsearch-input"
                    />
                  </div>
                  <div className="">
                    <Button
                      variant="primary"
                      className=" mb-2 mb-md-0"
                      onClick={handleShow}
                    >
                      <span>
                        <FaFilter /> Filter
                      </span>
                    </Button>
                  </div>
                </div>

                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={expenseList}
                    globalFilter={globalFilter}

                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column
                      body={(row, { rowIndex }) => ++rowIndex}
                      header="#"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(expenseCategory?.find((category) => category?.id === row?.cat_id)?.cat_title)}
                      header="Category"
                      field="cat_id"
                      sortable
                    />
                    <Column
                      body={(row) => row.amount}
                      header="Amount"
                      field="amount"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.date)}
                      header="Date"
                      field="date"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row.creditto || "")}
                      header="Creditor Name"
                      field="creditto"
                      sortable
                    />
                    <Column
                      body={(row) => row.mobileno}
                      header="Creditor Phone"
                      field="mobileno"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.created_at)}
                      header="Created Date"
                      field="created_at"
                      sortable
                    />
         

                   

                    <Column
                      field="Action"
                      body={(row, { rowIndex }) => (
                        <div className="d-flex">
                          
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="button-tooltip-2">
                                Edit Expense
                              </Tooltip>
                            }
                          >
                            <Link className="avatar avatar-icon avatar-md avatar-orange" to={`../expense/edit/${row.id}`}>
                              <i
                                className="fa-solid fa-edit"
                               
                              ></i>
                            </Link>
                          </OverlayTrigger>
                          
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">Delete</Tooltip>
                              }
                            >
                              <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                                <i
                                  className="fas fa-trash-alt"
                                  onClick={() => deleteExpense(row.id)}
                                ></i>
                              </div>
                            </OverlayTrigger>
                          
                        </div>
                        
                      )}
                      header="Action"
                      
                    />
                  </DataTable>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </div>
      <Modal
              show={showFilter}
              onHide={handleClose}
              className="modal-right"
            >
              <Modal.Header closeButton>
                <Modal.Title>Filter</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form id="filteruserlist">
                  <Row>
                    <div className="col-md-12 form-group">
                      <label className="font-weight-semibold">
                        Expense Category 
                      </label>
                      <Select
                        options={expenseCategory.map((item) => ({
                          value: item.id,
                          label: capitalizeFirstLetter(item.cat_title || ""),
                        }))}
                        onChange={(selectedOption) =>
                          setFilters({
                            ...filters,
                            cat_id: selectedOption.value,
                          })
                        }
                        value={
                          expenseCategory.find(
                            (category) =>
                              category.id === parseInt(filters.cat_id)
                          )
                            ? {
                                value: parseInt(filters.cat_id),
                                label: capitalizeFirstLetter(
                                  expenseCategory.find(
                                    (category) =>
                                      category.id === parseInt(filters.cat_id)
                                  ).cat_title || ""
                                ),
                              }
                            : { value: filters.cat_id, label: "Select" }
                        }
                      />
                    </div>

                    <FormField
                      label="From Date"
                      name="fromdate"
                      id="fromdate"
                      type="date"
                      value={filters.fromdate}
                      onChange={handleChange}
                      column="col-md-6"
                      
                    />
                    <FormField
                      label="To Date"
                      name="todate"
                      id="todate"
                      type="date"
                      value={filters.todate}
                      onChange={handleChange}
                      column="col-md-6"
                      
                    />
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  className="w-50"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  className="w-50"
                  onClick={applyFilters}
                >
                  Apply
                </Button>
              </Modal.Footer>
            </Modal>
    </>
  );
}
export default ExpenseList;
