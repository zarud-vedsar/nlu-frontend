import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    dataFetchingPost,
    goBack,
    productUnits,
} from "../../../site-components/Helper/HelperFunction";
import {
    FormField,
    TextareaField,
} from "../../../site-components/admin/assets/FormField";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Select from "react-select";

function Registration() {
    const { dbId } = useParams();

    // Initial form data
    const initialData = {
        dbId: "",
        pId: "",
        stockOutDate: "",
        quantity: 0,
        facultyId: "",
        remark: "",
    };

    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState({ field: "", msg: "" });
    const [isSubmit, setIsSubmit] = useState(false);
    const [productDropdown, setProductDropdown] = useState([]);
    const [facultyList, setFacultyList] = useState([]);

    const errorMsg = (field, msg) => {
        setError({ field, msg });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate quantity
        if (name === "quantity" && value !== "" && value <= 0) {
            toast.error("Quantity should be greater than 0.");
            errorMsg("quantity", "Quantity should be greater than 0.");
            return;
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fetchProductDropdown = async () => {
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/inventory/product/fetch-for-dropdown`
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                setProductDropdown(response.data);
            } else {
                toast.error("No products found.");
                setProductDropdown([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProductDropdown([]);
        }
    };

    const fetchFacultyDropdown = async () => {
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/inventory/faculty-list`
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                setFacultyList(response.data);
            } else {
                toast.error("No faculties found.");
                setFacultyList([]);
            }
        } catch (error) {
            console.error("Error fetching faculties:", error);
            setFacultyList([]);
        }
    };

    useEffect(() => {
        fetchProductDropdown();
        fetchFacultyDropdown();
    }, []);

    const fetchProductForUpdate = async (dbId) => {
        try {
            const response = await dataFetchingPost(
                `${NODE_API_URL}/api/inventory/stock/out/list`,
                { dbId }
            );
            if (response?.statusCode === 200 && response.data.length > 0) {
                const product = response.data[0];
                setFormData({
                    dbId: product.id,
                    pId: product.pId,
                    facultyId: product.facultyId,
                    stockOutDate: product.stockOutDate
                        ? product.stockOutDate.split("T")[0]
                        : "",
                    quantity: product.quantity,
                    remark: product.remark,
                });
            } else {
                toast.error("Product details not found.");
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    useEffect(() => {
        if (dbId) {
            fetchProductForUpdate(dbId);
        }
    }, [dbId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);

        // Validations
        if (!formData.pId) {
            errorMsg("pId", "Please select a product.");
            toast.error("Please select a product.");
            return setIsSubmit(false);
        }
        if (!formData.facultyId) {
            errorMsg("facultyId", "Faculty is required.");
            toast.error("Faculty is required.");
            return setIsSubmit(false);
        }
        if (!formData.stockOutDate) {
            errorMsg("stockOutDate", "Stock Out Date is required.");
            toast.error("Stock Out Date is required.");
            return setIsSubmit(false);
        }
        if (!formData.quantity) {
            errorMsg("quantity", "Quantity is required.");
            toast.error("Quantity is required.");
            return setIsSubmit(false);
        }

        try {
            const userId = secureLocalStorage.getItem("login_id");
            const loginType = secureLocalStorage.getItem("loginType");

            const payload = { ...formData, loguserid: userId, login_type: loginType };

            const response = await axios.post(
                `${NODE_API_URL}/api/inventory/stock/out`,
                payload
            );

            if (response.data?.statusCode === 200 || response.data?.statusCode === 201) {
                toast.success(response.data.message);
                if (response.data?.statusCode === 201) {
                    setFormData(initialData); // Reset form
                }
            } else {
                toast.error(response.data?.message || "An error occurred.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;
            const errorField = error.response?.data?.errorField;

            if (statusCode && errorField) {
                errorMsg(errorField, error.response?.data?.message);
            }
            toast.error(error.response?.data?.message || "Server error occurred.");
        } finally {
            setIsSubmit(false);
        }
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
                                        {dbId ? "Update Stock Out Details" : "Add Stock Out"}
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                                <h5 className="card-title h6_new pt-2">
                                    {dbId ? "Update Stock Out Details" : "Add Stock Out"}
                                </h5>
                                <div className="ml-auto id-mobile-go-back">
                                    <button
                                        className="mr-auto btn-md btn border-0 goBack mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <Link to="/admin/inventory/product/stockout/history">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            Stock Out History  <i className="fas fa-list"></i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 col-lg-6 form-group">
                                            <label className="font-weight-semibold">Product <span className="text-danger">*</span></label>
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
                                                            label: `${productDropdown.find((item) => item.id === formData.pId).pname} (${productDropdown.find((item) => item.id === formData.pId).pcode}) (${productDropdown.find((item) => item.id === formData.pId).pbrand})`,
                                                        }
                                                        : { value: "", label: "Select" }
                                                }
                                            />

                                            {error.field === "pId" && (<span className="text-danger">{error.msg}</span>)}
                                        </div>
                                        <div className="col-md-6 col-lg-6 form-group">
                                            <label className="font-weight-semibold">Staff <span className="text-danger">*</span></label>
                                            <Select
                                                options={facultyList.map((item) => ({
                                                    value: item.id,
                                                    label: `${item?.facultyName} (${item?.u_email})`,
                                                }))}
                                                onChange={(selectedOption) => {
                                                    setFormData({
                                                        ...formData,
                                                        facultyId: selectedOption.value, // Update formData with selected product ID
                                                    });
                                                }}
                                                value={
                                                    facultyList.find((item) => item.id === formData.facultyId)
                                                        ? {
                                                            value: formData.facultyId,
                                                            label: `${facultyList.find((item) => item.id === formData.facultyId)?.facultyName} (${facultyList.find((item) => item.id === formData.facultyId)?.u_email})`
                                                        }
                                                        : { value: "", label: "Select" }
                                                }
                                            />

                                            {error.field === "facultyId" && (<span className="text-danger">{error.msg}</span>)}
                                        </div>

                                        {/* Stock Out Date */}
                                        <FormField
                                            borderError={error.field === "stockOutDate"}
                                            errorMessage={error.field === "stockOutDate" && error.msg}
                                            label="Stock Out Date"
                                            name="stockOutDate"
                                            id="stockOutDate"
                                            type="date"
                                            value={formData.stockOutDate}
                                            onChange={handleChange}
                                            column="col-md-6 col-lg-6"
                                            required
                                        />
                                        {/* Quantity */}
                                        <FormField
                                            borderError={error.field === "quantity"}
                                            errorMessage={error.field === "quantity" && error.msg}
                                            label="Quantity"
                                            name="quantity"
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            column="col-md-6 col-lg-6"
                                            required
                                        />
                                        <TextareaField
                                            borderError={error.field === "remark"}
                                            errorMessage={error.field === "remark" && error.msg}
                                            label="Remark"
                                            name="remark"
                                            id="remark"
                                            placeholder="Enter Remark"
                                            value={formData.remark}
                                            onChange={handleChange}
                                            column="col-md-12 col-lg-12"
                                        />
                                        <div className="col-md-12 col-lg-12 col-12">
                                            <button
                                                disabled={isSubmit}
                                                className="btn btn-dark d-flex justify-content-center align-items-center"
                                                type="submit"
                                            >
                                                Submit{" "}
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
export default Registration;