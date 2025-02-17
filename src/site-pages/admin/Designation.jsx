import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { FormField } from "../../site-components/admin/assets/FormField";
import axios from "axios";
import Select from "react-select"; // Dropdown component
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  dataFetchingDelete,
  dataFetchingGet,
  dataFetchingPatch,
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../site-components/Helper/HelperFunction";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import secureLocalStorage from "react-secure-storage";
function Designation() {
    const [toggleShow, setToggleShow] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [DesignationList, setDesignationList] = useState([]);
    const [DepartmentList, setDepartmentList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(''); // State for the search box
    const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
    const iniatialForm = {
        dbId: "",
        title: "",
        department_id: ''
    };
    const [formData, setFormData] = useState(iniatialForm);
    const fetchList = async () => {
        setIsFetching(true);
        try {
            const response = await dataFetchingPost(`${NODE_API_URL}/api/department/fetch`,
                {
                    deleteStatus: 0,
                    status: 1,
                    column: "id, dtitle"
                });
            if (response?.statusCode === 200 && response.data.length > 0) {
                setDepartmentList(response.data);
            } else {
                toast.error("Department not found.");
                setDepartmentList([]);
            }
        } catch (error) {
            setDepartmentList([]);
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        } finally {
            setIsFetching(false);
        }
    }
    const fetchDesignationList = async (deleteStatus = 0) => {
        setIsFetching(true);
        try {
            const response = await dataFetchingGet(`${NODE_API_URL}/api/designation/retrieve-all-designation-with-department/${deleteStatus}`);
            if (response?.statusCode === 200 && response.data.length > 0) {
                console.log(response.data);

                setDesignationList(response.data);
            } else {
                toast.error("Data not found.");
                setDesignationList([]);
            }
        } catch (error) {
            setDesignationList([]);
            const statusCode = error.response?.data?.statusCode;
            if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
                toast.error(error.response.message || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        } finally {
            setIsFetching(false);
        }
    }
    useEffect(() => {
        fetchDesignationList(0);
        fetchList();
    }, []);
    const showRecyleBin = () => {
        setRecycleTitle(recycleTitle === "Show Recycle Bin" ? "Hide Recycle Bin" : "Show Recycle Bin");
        fetchDesignationList(recycleTitle === "Show Recycle Bin" ? 1 : 0);
    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const submitForm = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setTitleError('');
        if (!formData.department_id) {
            toast.error("Department is required.");
            return setIsSubmit(false);
        }
        if (!formData.title) {
            setTitleError("Title is required.");
            return setIsSubmit(false);
        }
        try {
            formData.loguserid = secureLocalStorage.getItem('login_id');
            formData.login_type = secureLocalStorage.getItem('loginType');
            // submit to the API here
            const response = await axios.post(`${NODE_API_URL}/api/designation/save-update-designation`, formData);
            if (response.data?.statusCode === 200 || response.data?.statusCode === 201) {
                toast.success(response.data.message);
                setTitleError('');
                fetchList(0);
                setToggleShow(false);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            const statusCode = error.response?.data?.statusCode;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        setTitleError(error.response.data.message);
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
  const handleToggleShow = () => {
    setToggleShow(!toggleShow);
    setFormData(iniatialForm);
    setTitleError("");
  };
  const handleToggleStatus = async (dbId, currentStatus) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      // Toggle the status (currentStatus is the current checkbox state)
      const loguserid = secureLocalStorage.getItem("login_id");
      const login_type = secureLocalStorage.getItem("loginType");
      const response = await dataFetchingPatch(
        `${NODE_API_URL}/api/designation/active-inactive-designation/${dbId}/${loguserid}/${login_type}`
      );
      if (response?.statusCode === 200) {
        toast.success(response.message);
        // Update the notice list to reflect the status change
        setDesignationList((prevList) =>
          prevList.map((item) =>
            item.id === dbId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        setTitleError(error.response.message);
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const deleteStatus = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    try {
      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const loguserid = secureLocalStorage.getItem("login_id");
        const login_type = secureLocalStorage.getItem("loginType");
        const response = await dataFetchingDelete(
          `${NODE_API_URL}/api/designation/delete-designation/${dbId}/${loguserid}/${login_type}`
        );
        if (response?.statusCode === 200) {
          toast.success(response.message);
          setTitleError("");
          if (response.data == 1) {
            fetchDesignationList(1);
          } else {
            fetchDesignationList(0);
          }
          showRecyleBin();
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        setTitleError(error.response.message);
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    try {
      const response = await dataFetchingGet(
        `${NODE_API_URL}/api/designation/retrieve-designation-by-id/${dbId}`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        toast.success(response.message);
        setFormData((prev) => ({
          ...prev,
          dbId: response.data[0].id,
          title: response.data[0].title,
          department_id: response.data[0].department_id,
        }));
        setToggleShow(!toggleShow);
      } else {
        toast.error("Data not found.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        setTitleError(error.response.message);
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
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
                                        <i className="fas fa-home m-r-5" />
                                        Learning Management
                                    </a>
                                    
                                    <span className="breadcrumb-item active">Designation</span>
                                </nav>
                            </div>
                        </div>
                        <div className="card bg-transparent mb-2">
                            <div className="card-header d-flex justify-content-between align-items-center px-0">
                                <h5 className="card-title h6_new">Designation List</h5>
                                <div className="ml-auto">
                                    <button
                                        className="ml-auto btn-md btn border-0 btn-light mr-2"
                                        onClick={() => goBack()}
                                    >
                                        <i className="fas fa-arrow-left" /> Go Back
                                    </button>
                                    <button
                                        className="ml-2 btn-md btn border-0 btn-secondary"
                                        onClick={handleToggleShow}
                                    >
                                        <i className="fas fa-plus" /> Add New
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                {/* Search Box */}
                                <div className='row'>
                                    <div className="col-md-8 col-lg-8 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                                        <div className='search-icon'><i className="pi pi-search" /></div>
                                        <InputText
                                            type="search"
                                            value={globalFilter}
                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                            placeholder="Search"
                                            className="form-control dtsearch-input"
                                        />
                                    </div>
                                    <div className='col-md-4 col-lg-4 col-10 col-sm-4'>
                                        <button className={`btn ${recycleTitle === "Show Recycle Bin" ? 'btn-secondary' : 'btn-danger'}`} onClick={showRecyleBin}>{recycleTitle} <i className="fa fa-recycle"></i></button>
                                    </div>
                                </div>
                                <div className={`table-responsive ${isFetching ? 'form' : ''}`}>
                                    <DataTable
                                        value={DesignationList}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50, 100, 500]}
                                        globalFilter={globalFilter} // Bind global filter
                                        emptyMessage="No records found"
                                        className="p-datatable-custom"
                                        tableStyle={{ minWidth: '50rem' }}
                                        sortMode="multiple"
                                    >
                                        <Column field="title" header="Title" sortable />
                                        <Column field="haruki_department_name" header="Department" sortable />
                                        <Column field="created_at"
                                            body={(row) => formatDate(row.created_at)}
                                            header="Created At" sortable />
                                        {
                                            recycleTitle !== "Show Recycle Bin" && (
                                                <Column field="deleted_at"
                                                    body={(row) => row.deleted_at && row.deleted_at != '0000-00-00' && formatDate(row.deleted_at)}
                                                    header="Deleted At" sortable />
                                            )
                                        }
                                        <Column
                                            header="Action"
                                            body={(rowData) => (
                                                <div className="d-flex">
                                                    <div className="switch mt-1 w-auto">
                                                        <input type="checkbox"
                                                            checked={rowData.status === 1}
                                                            onChange={() => handleToggleStatus(rowData.id, rowData.status)} // Pass the id and current status
                                                            id={`switch${rowData.id}`} />
                                                        <label className="mt-0" htmlFor={`switch${rowData.id}`}></label>
                                                    </div>
                                                    <div onClick={() => updateDataFetch(rowData.id)} className="avatar avatar-icon avatar-md avatar-orange">
                                                        <i className="fas fa-edit"></i>
                                                    </div>
                                                    {
                                                        parseInt(rowData.deleteStatus) == 0 ?
                                                            (
                                                                <OverlayTrigger
                                                                    placement="botom"
                                                                    overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}
                                                                >
                                                                    <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                                                                        <i className="fas fa-trash-alt" onClick={() => deleteStatus(rowData.id)}></i>
                                                                    </div>
                                                                </OverlayTrigger>
                                                            ) :
                                                            (
                                                                <OverlayTrigger
                                                                    placement="bottom"
                                                                    overlay={<Tooltip id="button-tooltip-2">Restore</Tooltip>}
                                                                >
                                                                    <div className="avatar ml-2 avatar-icon avatar-md avatar-lime">
                                                                        <i className="fas fa-recycle" onClick={() => deleteStatus(rowData.id)}></i>
                                                                    </div>
                                                                </OverlayTrigger>
                                                            )
                                                    }

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
            <Modal show={toggleShow} onHide={handleToggleShow}>
                <Modal.Header>
                    <Modal.Title>{formData.dbId ? "Update Designation" : "Add New Designation"} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className='row'>
                            <div className="col-md-12 form-group">
                                <label>Department: <span className="text-danger">*</span></label>
                                <Select
                                    options={[
                                        { value: '', label: 'Select' },
                                        ...DepartmentList.map(page => ({ value: page.id, label: page.dtitle })),
                                    ]}
                                    value={
                                        DepartmentList.find(page => page.id === parseInt(formData.department_id))
                                            ? {
                                                value: parseInt(formData.department_id),
                                                label: DepartmentList.find(page => page.id === parseInt(formData.department_id)).dtitle
                                            }
                                            : { value: formData.department_id, label: 'Select' }
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({ ...formData, department_id: selectedOption.value })
                                    }
                                />



                            </div>
                            <FormField label="Title" name="title" id="title" borderError={titleError ? true : false} errorMessage={titleError} value={formData.title} column='col-md-12' onChange={handleChange} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className='d-flex nowrap justify-content-between'>
                    <Button variant="light" onClick={handleToggleShow}>
                        Close
                    </Button>
                    <Button variant="dark" className='d-flex justify-content-center align-items-center' onClick={submitForm}>
                        Save{" "} {isSubmit && (
                            <>
                                &nbsp; <div className="loader-circle"></div>
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Designation;
