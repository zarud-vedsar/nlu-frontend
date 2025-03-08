import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  dataFetchingPatch,
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import secureLocalStorage from "react-secure-storage";
import { Column } from "primereact/column";
import { Link, useNavigate } from "react-router-dom";
import { EMailSweetAlert } from "../../../site-components/Helper/DeleteSweetAlert";

const EmailStatus = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
  
    try {
      const EmailAlert = await EMailSweetAlert('');
      if (EmailAlert) {
        // Static content for email subject and HTML template
        const staticMailSubject = "Timetable Update Notification"; // Static email subject
        const staticHtmlTemplate = "<p>Dear Student,</p><p>Your timetable has been updated. Please check the new schedule.</p><p>Best regards,</p><p>RPNLU</p>"; // Static email content (HTML)
    
        const requestPayload = {
          loguserid: secureLocalStorage.getItem("login_id"),
          login_type: secureLocalStorage.getItem("loginType"),
          timeTableChartId: dbId,
          htmlTemplate: staticHtmlTemplate, // Static HTML content for the email
          mailSubject: staticMailSubject, // Static email subject
        };
        const response = await axios.post(`${NODE_API_URL}/api/time-table/table-chart/notify-students-for-time-table-update`,
             requestPayload, {
          headers: {
            "Content-Type": "application/json", // Sending JSON data
          },
        });
        if (response?.data?.statusCode === 200) {
          toast.success(response?.data?.message);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again later.";
      toast.error(errorMessage);
    }
  };

function List() {
  // State variables
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [TimeTableList, setTimeTableList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const iniatialForm = {
    dbId: null,
    courseid: null,
    semesterid: null,
  };
  const [formData, setFormData] = useState(iniatialForm);

  // Fetch data function
  const fetchList = async () => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/time-table/table-chart/fetch-course-semester`,
        formData
      );
      if (response?.statusCode === 200) setTimeTableList(response.data || []);
      else toast.error("Data not found.");
    } catch (error) {
      const errorMsg = error.response?.message || "An error occurred.";
      toast.error(errorMsg);
      setTimeTableList([]);
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch list on component mount
  useEffect(() => {
    fetchList();
  }, []);
  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/add-new-time-table/${dbId}`, { replace: false });
  };
  const handleToggleStatus = async (dbId, currentStatus) => {
    if (!dbId || !Number.isInteger(+dbId) || +dbId <= 0)
      return toast.error("Invalid ID.");

    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const loguserid = secureLocalStorage.getItem("login_id");
      const login_type = secureLocalStorage.getItem("loginType");
      const response = await dataFetchingPatch(
        `${NODE_API_URL}/api/time-table/table-chart/status/${dbId}/${loguserid}/${login_type}`
      );
      if (response?.statusCode === 200) {
        toast.success(response.message);
        setTimeTableList((prevList) =>
          prevList.map((item) =>
            item.id === dbId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred. Please check your connection or try again."
      );
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
                    Dashboard
                  </a>
                  <span className="breadcrumb-item">Time Table Management</span>
                  <span className="breadcrumb-item active">
                    Time Table List
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new pt-2">Time Table List</h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 goback mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link to={"/admin/add-new-time-table"}>
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus" /> Add New
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* Search Box */}
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={TimeTableList}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    globalFilter={globalFilter} // Bind global filter
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column field="coursename" header="Course" sortable />
                    <Column field="semtitle" header="Semester" sortable />
                    <Column
                      field="classroom"
                      header="Classroom/Floor"
                      sortable
                    />
                    <Column
                      field="created_at"
                      body={(row) => formatDate(row.created_at)}
                      header="Created At"
                      sortable
                    />
                    <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          <div className="switch mt-2 w-auto">
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
                          <Link to={`/admin/time-table-print/${rowData.id}`}>
                            <div className="avatar avatar-md avatar-blue ml-2">
                              <i className="fas fa-print"></i>
                            </div>
                          </Link>
                          <div
                            onClick={() => updateDataFetch(rowData.id)}
                            className="avatar avatar-icon avatar-md avatar-orange ml-2 "
                          >
                            <i className="fas fa-edit"></i>
                          </div>
                          <div
                             onClick={() => EmailStatus(rowData.id)}
                            className="avatar avatar-icon avatar-md avatar-blue ml-2 "
                          >
                            <i
                              className="fa fa-envelope"
                            ></i>
                          </div>
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
export default List;
