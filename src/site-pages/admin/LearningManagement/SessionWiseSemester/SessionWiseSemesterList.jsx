// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import "../../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

function SessionWiseSemesterList() {
  const [semesterListing, setSemesterListing] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const [sessionList, setSessionList] = useState([]);
  const [selectedSesssion, setSelectedSession] = useState(
    localStorage.getItem("session")
  );
  const fetchSemesterListing = async () => {
    if (!selectedSesssion) return;
    setIsFetching(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_session_semester");
      bformData.append("session", selectedSesssion);
      const response = await axios.post(
        `${PHP_API_URL}/semester.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response?.data?.status === 200 && response?.data?.data.length > 0) {
        setSemesterListing(response?.data?.data);
      } else {
        toast.error("Data not found.");
        setSemesterListing([]);
      }
    } catch (error) {
      setSemesterListing([]);
      const status = error.response?.data?.status;
      if (status === 400 || status === 401 || status === 500) {
        toast.error(error.response?.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsFetching(false);
    }
  };
  const fetchSessionList = async (deleteStatus = 0) => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/session/fetch`,
        {
          deleteStatus,
          column: "id, dtitle, created_at, status, deleted_at, deleteStatus",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSessionList(response.data);
      } else {
        toast.error("Data not found.");
        setSessionList([]);
      }
    } catch (error) {
      setSessionList([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        setTitleError(error.response.message);
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    fetchSessionList();
  }, []);

  useEffect(() => {
    fetchSemesterListing();
  }, [selectedSesssion]);

  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/learning-management/session-wise-semester/edit/${dbId}`, {
      replace: false,
    });
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                <a href="/admin/" className="breadcrumb-item">
                                     <i className="fas fa-home m-r-5" />
                                    Dashboard
                                   </a>
                                   <span className="breadcrumb-item active">
                                   Learning Management
                                   </span>
                  
                  <span className="breadcrumb-item active">
                    Session Wise Semester Class
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  Session Wise Semester Class List
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link
                    to={
                      "/admin/learning-management/session-wise-semester/add-new/"
                    }
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-plus" /> Add New
                  </Link>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* Search Box */}
                <div className="row">
                  <div className="col-md-2 col-12 form-group">
                    <label className="font-weight-semibold">
                      Select Session <span className="text-danger">*</span>
                    </label>
                    
                    <Select
                      options={sessionList.map((item) => ({
                        value: item.id,
                        label: capitalizeFirstLetter(item.dtitle),
                      }))}
                      onChange={(selectedOption) => {
                        setSelectedSession(selectedOption.value);
                      }}
                      value={
                        sessionList.find((item) => item.id == selectedSesssion)
                          ? {
                              value: selectedSesssion,
                              label: capitalizeFirstLetter(
                                sessionList.find(
                                  (item) => item.id == selectedSesssion
                                ).dtitle
                              ),
                            }
                          : {
                              value: selectedSesssion,
                              label: "Select",
                            }
                      }
                    />
                  </div>
                </div>
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={semesterListing}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column field="coursename" header="Course" sortable />
                    <Column
                    field="semtitle"
                      body={(row) => capitalizeFirstLetter(row.semtitle)}
                      header="Semester"
                      sortable
                    />
                    <Column
                      field="start_date"
                      body={(row) => formatDate(row.start_date)}
                      header="Start Date"
                      sortable
                    />
                    <Column
                      field="end_date"
                      body={(row) => row?.end_date}
                      header="End Date"
                      sortable
                    />

                    <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          <div
                            onClick={() => updateDataFetch(rowData.id)}
                            className="avatar avatar-icon avatar-md avatar-orange"
                          >
                            <i className="fas fa-edit"></i>
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
export default SessionWiseSemesterList;
