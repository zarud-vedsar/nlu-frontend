import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import {
  dataFetchingDelete,
  dataFetchingPatch,
  dataFetchingPost,
  formatDate,
  goBack,
  productUnits,
} from "../../../site-components/Helper/HelperFunction";
import { DeleteSweetAlert } from "../../../site-components/Helper/DeleteSweetAlert";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { toast } from "react-toastify";
import { Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormField } from "../../../site-components/admin/assets/FormField";
import secureLocalStorage from "react-secure-storage";
import validator from "validator";
import Select from "react-select";
function ProductList() {
  const [ProductList, setProductList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [categoryList, setCategoryList] = useState([]);
  const [productDropdown, setproductDropdown] = useState([]);
  const navigate = useNavigate();
  // initialize form fields
  const initialData = {
    catId: "",
    pId: "",
    stockInDate: "",
    stockInDateStart: "",
    stockInDateEnd: "",
  };

  const formatDateForMonth = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const getFirstDayOfMonth = () => {
    const now = new Date();
    return formatDateForMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const getLastDayOfMonth = () => {
    const now = new Date();
    return formatDateForMonth(
      new Date(now.getFullYear(), now.getMonth() + 1, 0)
    );
  };

  const [formData, setFormData] = useState({
    ...initialData,
    stockInDateStart: getFirstDayOfMonth(), // Example: "2025-02-01"
    stockInDateEnd: getLastDayOfMonth(), // Example: "2025-02-29"
  });
  const [isSubmit, setIsSubmit] = useState(false);
  // handle Input fields data and stored them in the formData
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchproductDropdown = async () => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/inventory/product/fetch-for-dropdown`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setproductDropdown(response.data);
      } else {
        toast.error("Data not found.");
        setproductDropdown([]);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setproductDropdown([]);
    }
  };
  useEffect(() => {
    fetchproductDropdown();
  }, []);
  const fetchCategoryList = async () => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/inventory/category/fetch`,
        { all: true }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setCategoryList(response.data);
      } else {
        setCategoryList([]);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setCategoryList([]);
    }
  };
  useEffect(() => {
    fetchCategoryList();
    fetchList();
  }, []);
  const fetchList = async () => {
    setIsFetching(true);
    setIsSubmit(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/inventory/stock/in/list`,
        {
          catId: formData.catId,
          pId: formData.pId,
          stockInDate: formData.stockInDate,
          stockInDateStart: formData.stockInDateStart,
          stockInDateEnd: formData.stockInDateEnd,
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setProductList(response.data);
      } else {
        toast.error("Data not found.");
        setProductList([]);
      }
    } catch (error) {
      setProductList([]);

      const statusCode = error?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsFetching(false);
      setIsSubmit(false);
    }
  };
  useEffect(() => {
    navigate(window.location.pathname, { replace: false });
  }, []);
  const handleFilter = (e) => {
    e.preventDefault();
    fetchList();
  };
  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Dashboard
                  </a>
                  <span className="breadcrumb-item">Inventory Management</span>
                  <span className="breadcrumb-item active">
                    Stock In 
                  </span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Stock In History</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/inventory/product/add-stock/">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus"></i> Add New Stock
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                {/* Search Box */}
                <div className="row align-items-center">
                  <div className="col-md-11 col-lg-11 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                  <div className="col-md-1 col-lg-1 col-10 mb-3 col-sm-4 d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-info text-white"
                      onClick={handleShow}
                    >
                      <i className="fa fa-filter"></i>
                    </button>
                  </div>
                </div>
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={ProductList}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    globalFilter={globalFilter} // Bind global filter
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column
                      header="Product"
                      sortable
                      body={(rowData) => validator.unescape(rowData.pname)}
                    />
                    <Column
                      header="Unit"
                      sortable
                      body={(rowData) =>
                        rowData?.punit
                          ? validator.unescape(rowData.punit)
                          : rowData.punit
                      }
                    />
                    <Column
                      header="Brand"
                      sortable
                      body={(rowData) =>
                        rowData.pbrand
                          ? validator.unescape(rowData.pbrand)
                          : rowData.pbrand
                      }
                    />
                    <Column
                      header="Quantity"
                      sortable
                      body={(rowData) => rowData.quantity}
                    />
                    <Column
                      body={(row) =>
                        row.stockInDate
                          ? formatDate(row.stockInDate)
                          : row.stockInDate
                      }
                      header="Stock In Date"
                      sortable
                    />
                    <Column
                      body={(row) =>
                        row.created_at
                          ? formatDate(row.created_at)
                          : row.created_at
                      }
                      header="Created At"
                      sortable
                    />
                    <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          <Link
                            to={`/admin/inventory/product/add-stock/${rowData.id}`}
                            className="avatar avatar-icon avatar-md avatar-orange"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                        </div>
                      )}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Records</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleFilter}>
            <div className="row">
              <div className="col-md-12 col-lg-12 form-group">
                <label className="font-weight-semibold">Category</label>
                <Select
                  options={categoryList.map((item) => ({
                    value: item.id,
                    label: item.ctitle,
                  }))}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      catId: selectedOption.value,
                    });
                  }}
                  value={
                    categoryList.find(
                      (item) => item.id === parseInt(formData.catId)
                    )
                      ? {
                          value: parseInt(formData.catId),
                          label: categoryList.find(
                            (item) => item.id === parseInt(formData.catId)
                          ).ctitle,
                        }
                      : { value: formData.catId, label: "Select" }
                  }
                />
              </div>
              <div className="col-md-12 col-lg-12 form-group">
                <label className="font-weight-semibold">Product</label>
                <Select
                  options={productDropdown.map((item) => ({
                    value: item.id,
                    label: `${item.pname} (${item.pcode}) (${item.pbrand})`,
                  }))}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      pId: selectedOption.value, // Update formData with selected product ID
                    });
                  }}
                  value={
                    productDropdown.find((item) => item.id === formData.pId)
                      ? {
                          value: formData.pId,
                          label: `${
                            productDropdown.find(
                              (item) => item.id === formData.pId
                            ).pname
                          } (${
                            productDropdown.find(
                              (item) => item.id === formData.pId
                            ).pcode
                          }) (${
                            productDropdown.find(
                              (item) => item.id === formData.pId
                            ).pbrand
                          })`,
                        }
                      : { value: "", label: "Select" }
                  }
                />
              </div>
              <FormField
                label="Stock In Date"
                name="stockInDate"
                id="stockInDate"
                type="date"
                value={formData.stockInDate}
                onChange={handleChange}
                column="col-md-12 col-lg-12"
              />
              <FormField
                label="Stock In Date From"
                name="stockInDateStart"
                id="stockInDateStart"
                type="date"
                value={formData.stockInDateStart}
                onChange={handleChange}
                column="col-md-6 col-lg-6"
              />
              <FormField
                label="Stock In Date To "
                name="stockInDateEnd"
                id="stockInDateEnd"
                type="date"
                value={formData.stockInDateEnd}
                onChange={handleChange}
                column="col-md-6 col-lg-6"
              />
              <div className="col-md-12 col-lg-12 col-12 d-flex align-items-center justify-content-center">
                <button
                  onClick={() => setFormData(initialData)}
                  className="mt-2 btn btn-secondary btn-block d-flex justify-content-center align-items-center"
                  type="button"
                >
                  Reset
                </button>
                <button
                  className="btn btn-primary ml-2 btn-block d-flex justify-content-center align-items-center"
                  type="submit"
                >
                  Apply Filter{" "}
                  {isSubmit && (
                    <>
                      &nbsp; <div className="loader-circle"></div>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default ProductList;
