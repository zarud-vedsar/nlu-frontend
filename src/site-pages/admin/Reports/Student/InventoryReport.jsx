// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
  capitalizeEachLetter,
  productUnits,
} from "../../../../site-components/Helper/HelperFunction";
import "../../../../../node_modules/primeicons/primeicons.css";
import secureLocalStorage from "react-secure-storage";
import { PHP_API_URL } from "../../../../site-components/Helper/Constant";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
function InventoryReport() {
  const [showFilter, setShowFilter] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [productBrand, setProductBrand] = useState([]);

  const initialData = {
    punit: "",
    pbrand: "",
    catId: "",
  };
  const [formData, setFormData] = useState(initialData);
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

  const inventoryBrand = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "inventory_brand");
      const response = await axios.post(
        `${PHP_API_URL}/report.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProductBrand(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    inventoryBrand();
  }, []);

  const resetFilter = () => {
    setFormData(initialData);
    setSemesterListing([]);
    // handleSubmit();
  };

  // get the data form api ------------------------------------------------------------------------------------------
  const exportExcelFile = async (e) => {
    if (e) e.preventDefault();
    setIsFetching(true);
    if (!formData.courseid) {
    }

    try {
      // Create a new form element
      const form = document.createElement("form");
      form.action = `${PHP_API_URL}/report.php`;
      form.method = "POST";
      form.target = "hidden_iframe"; // Target the hidden iframe for submission

      // Append hidden input fields to the form
      const formDataEntries = [
        { name: "loguserid", value: secureLocalStorage.getItem("login_id") },
        { name: "login_type", value: secureLocalStorage.getItem("loginType") },
        { name: "data", value: "inventory_products" },
        { name: "punit", value: formData?.punit },
        { name: "pbrand", value: formData?.pbrand },
        { name: "catId", value: formData?.catId },
      ];

      formDataEntries.forEach((entry) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = entry.name;
        input.value = entry.value;
        form.appendChild(input);
      });

      // Create a hidden iframe
      const iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe"; // The iframe name must match the form's target
      iframe.style.display = "none"; // Hide the iframe from view
      document.body.appendChild(iframe);

      // Handle the iframe's onload event
      iframe.onload = function () {
        try {
          // Parse the iframe response (assuming the response is JSON)
          const iframeContent = iframe.contentWindow.document.body.innerText; // Get iframe body content
          const responseData = JSON.parse(iframeContent); // Parse JSON response

          // Handle different statuses based on responseData
          if (
            responseData?.statusCode === 200 ||
            responseData?.statusCode === 201
          ) {
            toast.success(responseData.msg); // Success message
            if (responseData.statusCode === 201) {
              setFormData({
                punit: "",
                pbrand: "",
                catId: "",
              });
            }
          } else if (responseData?.statusCode === 400) {
            toast.error("Student not found");
          } else if (responseData?.statusCode === 500) {
            toast.error("Internal server error. Please try again.");
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
        } catch (error) {
          console.error("Error parsing iframe response:", error);
          toast.error("An error occurred while processing the response.");
        } finally {
          // Clean up the iframe after processing
          document.body.removeChild(iframe);
        }
      };

      // Append the form to the body
      document.body.appendChild(form);

      // Submit the form to the hidden iframe (no page reload)
      form.submit();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsFetching(false); // Reset the fetching state
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
                  <span className="breadcrumb-item">Report</span>

                  <span className="breadcrumb-item active">
                    Inventory Report
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Inventory Report</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center position-relative py-0 px-3">
                <h6 className="h6_new card-title">Filter Records</h6>
              </div>
              <div className={`card-body px-3 ${showFilter ? "" : "d-none"}`}>
                <form>
                  <div className="row">
                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">Unit</label>
                      <Select
                        options={productUnits.map((item) => ({
                          value: item,
                          label: item,
                        }))} // Create an array of option objects
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            punit: selectedOption ? selectedOption.value : "", // Update state with selected value or empty string
                          });
                        }}
                        value={
                          formData.punit
                            ? { value: formData.punit, label: formData.punit } // Match selected value and label
                            : null // Set `null` if no value is selected
                        }
                      />
                    </div>

                    <div className="col-md-4 col-lg-4 col-12 form-group">
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
                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">Brand</label>
                      <Select
                        options={productBrand.map((item) => ({
                          value: item,
                          label: item,
                        }))} // Create an array of option objects
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            pbrand: selectedOption ? selectedOption.value : "", // Update state with selected value or empty string
                          });
                        }}
                        value={
                          formData.pbrand
                            ? { value: formData.pbrand, label: formData.pbrand } // Match selected value and label
                            : null // Set `null` if no value is selected
                        }
                      />
                    </div>

                    <div className="col-12 d-flex  mt-2">
                      <button
                        className="btn btn-dark mr-2"
                        onClick={exportExcelFile}
                      >
                        Export
                      </button>
                      <button
                        className="btn btn-secondary "
                        onClick={resetFilter}
                      >
                        Reset
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
export default InventoryReport;
