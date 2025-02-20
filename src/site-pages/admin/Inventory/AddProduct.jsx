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
        catId: "",
        pname: "",
        threshhold_limit: 0,
        pcode: "",
        punit: "",
        pbrand: "",
        pdesc: "",
    };
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState({ field: "", msg: "" }); // Error state
    const [isSubmit, setIsSubmit] = useState(false); // Form submission state
    const [categoryList, setCategoryList] = useState([]);
    const errorMsg = (field, msg) => {
        setError((prev) => ({
            ...prev,
            field: field,
            msg: msg,
        }));
    };
    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const fetchCategoryList = async () => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/category/fetch`, { all: true });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setCategoryList(response.data);
            } else {
                toast.error("Data not found.");
                setCategoryList([]);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setCategoryList([]);
        }
    }
    useEffect(() => {
        fetchCategoryList();
    }, []);
    const fetchProductForUpdate = async (dbId) => {
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/inventory/product/fetch`, { dbId });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    dbId: response.data[0].id,
                    catId: response.data[0].catId,
                    pname: response.data[0].pname,
                    threshhold_limit: response.data[0].threshhold_limit,
                    pcode: response.data[0].pcode,
                    punit: response.data[0].punit,
                    pbrand: response.data[0].pbrand,
                    pdesc: response.data[0].pdesc
                }));
            } else {
                toast.error("Data not found.");
                setCategoryList([]);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setCategoryList([]);
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
        if (!formData.catId) {
            errorMsg("catId", "Product category is required.");
            toast.error("Product category is required.");
            return setIsSubmit(false);
        }
        if (!formData.pname) {
            errorMsg("pname", "Product name is required.");
            toast.error("Product name is required.");
            return setIsSubmit(false);
        }
        if (!formData.threshhold_limit || formData.threshhold_limit < 0) {
            errorMsg("threshhold_limit", "Threshold limit should be a positive number.");
            toast.error("Threshold limit should be a positive number.");
            return setIsSubmit(false);
        }
        if (!formData.punit) {
            errorMsg("punit", "Product unit is required.");
            toast.error("Product unit is required.");
            return setIsSubmit(false);
        }
        try {
            formData.loguserid = secureLocalStorage.getItem("login_id");
            formData.login_type = secureLocalStorage.getItem("loginType");
            const response = await axios.post(
                `${NODE_API_URL}/api/inventory/product/create`,
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
                                        {dbId ? "Update Product Detail" : "Add New Product"}
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                                <h5 className="card-title h6_new pt-2">
                                    {dbId ? "Update Product Detail" : "Add New Product"}
                                </h5>
                                <div className="ml-auto id-mobile-go-back">
                                    <button
                                        className="mr-auto btn-md btn border-0 goBack mr-2"
                                        onClick={goBack}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <Link to="/admin/inventory/product">
                                        <button className="ml-2 btn-md btn border-0 btn-secondary">
                                        <i className="fas fa-list"></i>  Product List  
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
                                            <label className="font-weight-semibold">Category <span className="text-danger">*</span></label>
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
                                                        (item) =>
                                                            item.id === parseInt(formData.catId)
                                                    )
                                                        ? {
                                                            value: parseInt(formData.catId),
                                                            label: categoryList.find(
                                                                (item) =>
                                                                    item.id === parseInt(formData.catId)
                                                            ).ctitle,
                                                        }
                                                        : { value: formData.catId, label: "Select" }
                                                }
                                            />
                                            {error.field === "catId" && (<span className="text-danger">{error.msg}</span>)}
                                        </div>
                                        {/* Product Name */}
                                        <FormField
                                            borderError={error.field === "pname"}
                                            errorMessage={error.field === "pname" && error.msg}
                                            label="Product Name"
                                            name="pname"
                                            id="pname"
                                            placeholder="Enter Product Name"
                                            value={formData.pname}
                                            onChange={handleChange}
                                            column="col-md-6 col-lg-6"
                                            required
                                        />
                                        {/* Product Threshold */}
                                        <FormField
                                            borderError={error.field === "threshhold_limit"}
                                            errorMessage={error.field === "threshhold_limit" && error.msg}
                                            label="Threshold Limit"
                                            name="threshhold_limit"
                                            id="threshhold_limit"
                                            value={formData.threshhold_limit}
                                            onChange={handleChange}
                                            column="col-md-2 col-lg-2"
                                            required
                                        />
                                        {/* Product Code */}
                                        <FormField
                                            borderError={error.field === "pcode"}
                                            errorMessage={error.field === "pcode" && error.msg}
                                            label="Product Code"
                                            name="pcode"
                                            id="pcode"
                                            placeholder="012345"
                                            value={formData.pcode}
                                            onChange={handleChange}
                                            column="col-md-3 col-lg-3"
                                        />
                                        <div className="col-md-5 col-lg-5 form-group">
                                            <label className="font-weight-semibold">Unit <span className="text-danger">*</span></label>
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

                                            {error.field === "punit" && (<span className="text-danger">{error.msg}</span>)}
                                        </div>
                                        {/* Product Brand */}
                                        <FormField
                                            borderError={error.field === "pbrand"}
                                            errorMessage={error.field === "pbrand" && error.msg}
                                            label="Product Brand"
                                            name="pbrand"
                                            id="pbrand"
                                            placeholder="Enter Product Brand"
                                            value={formData.pbrand}
                                            onChange={handleChange}
                                            column="col-md-4 col-lg-4"
                                        />
                                        {/* Product Description */}
                                        <TextareaField
                                            borderError={error.field === "pdesc"}
                                            errorMessage={error.field === "pdesc" && error.msg}
                                            label="Product Description"
                                            name="pdesc"
                                            id="pdesc"
                                            placeholder="Enter your description here..."
                                            value={formData.pdesc}
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