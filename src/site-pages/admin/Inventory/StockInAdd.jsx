import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    dataFetchingPost,
    goBack, productUnits
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
    const initialData = {
        dbId: "",
        pId: "",
        stockInDate: "",
        quantity: 0,
        vendorName: "",
        vendorAddress: "",
        vendorContactNumber: "",
        remark: "",
    };
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [productDropdown, setproductDropdown] = useState([]);
    const errorMsg = (field, msg) => {
        setError((prev) => ({
            ...prev,
            field: field,
            msg: msg,
        }));
    };
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'quantity' && value != '' && value <= 0) {
            toast.error('Quantity should be greater than 0.');
            errorMsg('quantity', 'Quantity should be greater than 0.');
            return;
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const fetchproductDropdown = async () => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/fetch-for-dropdown`);
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
    }
    useEffect(() => {
        fetchproductDropdown();
    }, []);
    const fetchProductForUpdate = async (dbId) => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/stock/in/list`, { dbId });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    dbId: response.data[0].id,
                    pId: response.data[0].pId,
                    stockInDate: response.data[0].stockInDate ? response.data[0].stockInDate.split('T')[0] : response.data[0].stockInDate,
                    quantity: response.data[0].quantity,
                    vendorName: response.data[0].vendorName,
                    vendorAddress: response.data[0].vendorAddress,
                    vendorContactNumber: response.data[0].vendorContactNumber,
                    remark: response.data[0].remark,
                }));
            } else {
                toast.error("Data not found.");
                setproductDropdown([]);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setproductDropdown([]);
        }
    }
    useEffect(() => {
        if (dbId) {
            fetchProductForUpdate(dbId);
        }
    }, [dbId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        if (!formData.pId) {
            errorMsg("pId", "Please select the product.");
            toast.error("Please select the product.");
            return setIsSubmit(false);
        }
        if (!formData.stockInDate) {
            errorMsg("stockInDate", "Stock In Date is required.");
            toast.error("Stock In Date is required.");
            return setIsSubmit(false);
        }
        if (!formData.quantity) {
            errorMsg("quantity", "Quantity is required.");
            toast.error("Quantity is required.");
            return setIsSubmit(false);
        }
        try {
            formData.loguserid = secureLocalStorage.getItem("login_id");
            formData.login_type = secureLocalStorage.getItem("loginType");
            const response = await axios.post(
                `${NODE_API_URL}/api/inventory/stock/in`,
                formData
            );
            if (
                response.data?.statusCode === 200 ||
                response.data?.statusCode === 201
            ) {
                errorMsg("", "");
                toast.success(response.data.message);
                if (response.data?.statusCode === 201) {
                    setFormData(initialData);
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;
            const errorField = error.response?.data?.errorField;

            if ([400, 401, 404, 409, 500].includes(statusCode)) {
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
                    <div className="container">
                        <div className="page-header mb-0">
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                    <a href="./" className="breadcrumb-item">
                                        <i className="fas fa-home m-r-5" /> Dashboard
                                    </a>
                                    <span className="breadcrumb-item">Inventory Management</span>
                                    <span className="breadcrumb-item active">
                                        {dbId ? "Update Stock Details" : "Add Stock"}
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">
                                    {dbId ? "Update Stock Details" : "Add Stock"}
                                </h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 goBack mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <Link to="/admin/inventory/product/stockin/history">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                            Stock In History  <i className="fas fa-list"></i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-4 col-lg-4 form-group">
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
                                        {/* Stock In Date */}
                                        <FormField
                                            borderError={error.field === "stockInDate"}
                                            errorMessage={error.field === "stockInDate" && error.msg}
                                            label="Stock In Date"
                                            name="stockInDate"
                                            id="stockInDate"
                                            type="date"
                                            value={formData.stockInDate}
                                            onChange={handleChange}
                                            column="col-md-4 col-lg-4"
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
                                            column="col-md-4 col-lg-4"
                                            required
                                        />
                                        <div className="col-md-12 mt-2 mb-3">
                                            <h6 className="custom">
                                                <span className="custo-head"> Vendor Information (Optional)</span>
                                            </h6>
                                        </div>
                                        {/* Vendor Name*/}
                                        <FormField
                                            borderError={error.field === "vendorName"}
                                            errorMessage={error.field === "vendorName" && error.msg}
                                            label="Vendor Name"
                                            name="vendorName"
                                            id="vendorName"
                                            value={formData.vendorName}
                                            onChange={handleChange}
                                            column="col-md-8 col-lg-8"
                                        />
                                        {/* Vendor Contact Number*/}
                                        <FormField
                                            borderError={error.field === "vendorContactNumber"}
                                            errorMessage={error.field === "vendorContactNumber" && error.msg}
                                            label="Vendor Contact Number"
                                            name="vendorContactNumber"
                                            id="vendorContactNumber"
                                            value={formData.vendorContactNumber}
                                            onChange={handleChange}
                                            column="col-md-4 col-lg-4"
                                        />
                                        {/* Vendor Address*/}
                                        <FormField
                                            borderError={error.field === "vendorAddress"}
                                            errorMessage={error.field === "vendorAddress" && error.msg}
                                            label="Vendor Address"
                                            name="vendorAddress"
                                            id="vendorAddress"
                                            value={formData.vendorAddress}
                                            onChange={handleChange}
                                            column="col-md-12 col-lg-12"
                                        />
                                        <TextareaField
                                            borderError={error.field === "remark"}
                                            errorMessage={error.field === "remark" && error.msg}
                                            label="Remark"
                                            name="remark"
                                            id="remark"
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
                </div >
            </div >
        </>
    );
}
export default Registration;