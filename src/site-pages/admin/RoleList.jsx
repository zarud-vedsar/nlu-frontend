import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PHP_API_URL,
  NODE_API_URL,
} from "../../site-components/Helper/Constant";
import {
  capitalizeEachLetter,
  capitalizeFirstLetter,
  dataFetchingDelete,
  dataFetchingPatch,
  goBack
} from "../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { toast } from "react-toastify";
import validator from "validator";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";

function NoticeList() {
  const [role, setRole] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const navigate = useNavigate();
  const fetchRoleList = async () => {
    const sendFormData = new FormData();
    sendFormData.append("data", "RoleList");

    try {
      const response = await axios.post(
        `${PHP_API_URL}/role_permission.php`,
        sendFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response);
      
      if (response.data?.status === 200) {
        setRole(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "A server error occurred.");
    }
  };
useEffect(() => {
  fetchRoleList(); // Pass a valid dbId if required
}, []);

   const handleToggleStatus = async (dbId, currentStatus) => {
     if (
       !dbId ||
       !Number.isInteger(parseInt(dbId, 10)) ||
       parseInt(dbId, 10) <= 0
     ) {
       return toast.error("Invalid ID.");
     }

     // Toggle the status (currentStatus is the current checkbox state)
     const newStatus = currentStatus === 1 ? 0 : 1;

     try {
       const loguserid = secureLocalStorage.getItem("login_id");
       const login_type = secureLocalStorage.getItem("loginType");
       const response = await dataFetchingPatch(
         `${NODE_API_URL}/api/role/status/${dbId}/${loguserid}/${login_type}`
       );
       if (response?.statusCode === 200) {
         toast.success(response.message);
         // Update the role list to reflect the status change
         setRole((prevList) =>
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
     ) {
       return toast.error("Invalid ID.");
     }
     console.log(dbId);
     
     try {
       const deleteAlert = await DeleteSweetAlert();
       if (!deleteAlert) return;

       const loguserid = secureLocalStorage.getItem("login_id");
       const login_type = secureLocalStorage.getItem("loginType");
       const response = await dataFetchingDelete(
         `${NODE_API_URL}/api/role/deleteStatus/${dbId}/${loguserid}/${login_type}`
       );

       if (response?.statusCode === 200) {
         toast.success(response.message);
         setRole((prev) => prev.filter((item) => item.id !== dbId));
       } else {
         toast.error("An error occurred. Please try again.");
       }
     } catch (error) {
       console.error("Error:", error);
       toast.error(error.response?.data?.message || "A server error occurred.");
     }
   };

        const updateDataFetch = (dbId) => {
          if (dbId) {
             navigate(`/admin/add-role`, {
               state: { dbId },
               replace: false,
             });
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
                  <Link to="/admin/home" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </Link>
                  <span className="breadcrumb-item">Role & Permission</span>
                  <span className="breadcrumb-item active">List</span>
                </nav>
              </div>
            </div>
            <div className="card border-0 bg-transparent mb-2">
              <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Role List</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <button
                    onClick={() =>
                      navigate("/admin/add-role", { replace: false })
                    }
                    className="ml-2 btn border-0 btn-secondary"
                  >
                    <i className="fas fa-plus" /> Add New
                  </button>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                {/* Search Box */}
                <div className="row align-items-center">
                  <div className="col-md-8 col-lg-8 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                </div>
                <div className={`table-responsive`}>
                  <DataTable
                    value={role}
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
                      body={(row) => capitalizeEachLetter(row.role_name)}
                      header="Notice Type"
                      sortable
                    />
                    <Column
                      field="title"
                      header="Title"
                      sortable
                      body={(rowData) => {
                        let permission = [];

                        try {
                          permission =
                            typeof rowData.role === "string"
                              ? JSON.parse(rowData.role)
                              : rowData.role;
                        } catch (error) {
                          console.error("Error parsing role data:", error);
                        }
                       return (
                         <div>
                           {permission?.map((roleObj, index) => {
                             const roleName = Object.keys(roleObj)[0];
                             return (
                               <li key={index}>
                                 <strong>{roleName}</strong>:{" "}
                                 <hr style={{padding: '0', margin: '0', borderTop: '1px solid #ccc'}} />
                                 {roleObj[roleName]?.map(
                                   ({ subRole, crud }, index1) => (
                                     <p className="ml-4 mb-1" key={index1}>
                                       <strong>{subRole}</strong>:{" "}
                                       {crud?.length > 0 &&
                                         crud.map((data, ind) => (
                                           <span key={ind}>
                                             {capitalizeFirstLetter(data)}
                                             ,&nbsp;
                                           </span>
                                         ))}
                                     </p>
                                   )
                                 )}
                               </li>
                             );
                           })}
                         </div>
                       );

                      }}
                    />

                    <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          <div className="switch mt-1 w-auto">
                            <input
                              type="checkbox"
                              checked={rowData.status === 1} // This ensures the checkbox reflects the correct status
                              onChange={() =>
                                handleToggleStatus(rowData.id, rowData.status)
                              } // Pass the id and current status
                              id={`switch${rowData.id}`}
                            />
                            <label
                              className="mt-0"
                              htmlFor={`switch${rowData.id}`}
                            ></label>
                          </div>
                          <div
                            onClick={() => updateDataFetch(rowData.id)}
                            className="avatar avatar-icon avatar-md avatar-orange"
                          >
                            <i className="fas fa-edit"></i>
                          </div>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="button-tooltip-2">Delete</Tooltip>
                            }
                          >
                            <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                              <i
                                className="fas fa-trash-alt"
                                onClick={() => deleteStatus(rowData.id)}
                              ></i>
                            </div>
                          </OverlayTrigger>
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
    </>
  );
}
export default NoticeList;