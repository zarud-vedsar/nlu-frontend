// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  goBack,
  capitalizeEachLetter,
} from "../../site-components/Helper/HelperFunction";
import "../../../node_modules/primeicons/primeicons.css";
import axios from "axios";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import secureLocalStorage from "react-secure-storage";
import { FormField } from "../../site-components/admin/assets/FormField";

function UserLogList() {
  const [showFilter, setShowFilter] = useState(true);
  const [logList, setLogList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [facultyListing, setFacultyListing] = useState([]);
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

  const initialData = {
    log_type: "",
    userid: "",
    start_date: getFirstDayOfMonth(),
    end_date: getLastDayOfMonth(),
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    loadFacultyData();
    handleSubmit();
  }, []);

  const loadFacultyData = async () => {
    setIsFetching(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_userPage");
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
     
      setFacultyListing(response.data.data);
    } catch (error) {
      setFacultyListing([]);
      console.error("Error fetching faculty data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();
    setLogList([]);
    setIsFetching(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_log");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      Object.entries(formData).forEach(([key, value]) => {
        bformData.append(key, value);
      });

      const response = await axios.post(`${PHP_API_URL}/log.php`, bformData);
      
      if (response.data?.status === 200 && response.data.data.length > 0) {
        toast.success(response?.data?.msg);
        setLogList(response?.data?.data);
      } else {
        setLogList([]);
      }
    } catch (error) {
      setLogList([]);
    } finally {
      setIsFetching(false);
    }
  };

  const resetFilter = () => {
    setFormData(initialData);
    handleSubmit();
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
                  <span className="breadcrumb-item active">User Log</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new"> User Log</h5>
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
                <h6 className="h6_new card-title">Filter Record</h6>
                <button
                  className="btn btn-info"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  {showFilter ? (
                    <i className="fas fa-times" />
                  ) : (
                    <i className="fas fa-filter" />
                  )}
                </button>
              </div>
              <div className={`card-body px-3 ${showFilter ? "" : "d-none"}`}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3 col-lg-3 col-12 form-group">
                      <label className="font-weight-semibold">
                        Select Student
                      </label>

                      <Select
                        options={facultyListing.map((faculty) => ({
                          value: faculty.id, // Use faculty id as the value
                          label: `${faculty.first_name} ${faculty.last_name}`, // Assuming faculty has first_name and last_name fields
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            userid: selectedOption.value, // Save selected faculty id
                          });
                        }}
                        value={
                          facultyListing.find(
                            (faculty) => faculty.id === formData.userid
                          )
                            ? {
                                value: formData.userid,
                                label: `${
                                  facultyListing.find(
                                    (faculty) => faculty.id === formData.userid
                                  ).first_name
                                } ${
                                  facultyListing.find(
                                    (faculty) => faculty.id === formData.userid
                                  ).last_name
                                }`,
                              }
                            : {
                                value: formData.userid,
                                label: "Select",
                              }
                        }
                      />
                    </div>
                    <div className="col-md-3 col-lg-3 col-12 form-group">
                      <label className="font-weight-semibold">Log Type</label>

                      <Select
                        options={[
                          "login",
                          "create",
                          "update",
                          "delete",
                          "status",
                          "failed",
                        ].map((log) => ({
                          value: log,
                          label: capitalizeEachLetter(log),
                        }))}
                        onChange={(e) => {
                          
                          setFormData((prev) => ({
                            ...prev,
                            log_type: e.value,
                          }));
                        }}
                        value={
                          formData.log_type
                            ? {
                                value: formData.log_type,
                                label: capitalizeEachLetter(formData.log_type),
                              }
                            : { value: "", label: "Select" }
                        }
                      />
                    </div>

                    <FormField
                      label="From Date"
                      name="start_date"
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      column="col-md-2 col-lg-2"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          start_date: e.target.value,
                        }))
                      }
                    />
                    <FormField
                      label="To Date"
                      name="end_date"
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      column="col-md-2 col-lg-2"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          end_date: e.target.value,
                        }))
                      }
                    />

                    <div className="col-12 d-flex  mt-2">
                      <button
                        disabled={isFetching}
                        className="btn btn-dark mr-2"
                        type="submit"
                      >
                        Search{" "}
                        {isFetching && (
                          <>
                            &nbsp; <div className="loader-circle"></div>
                          </>
                        )}
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
            <div className="card">
              <div className="card-body">
                {/* Search Box */}

                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  {logList.length > 0 ? (
                    <DataTable
                      value={logList}
                      removableSort
                      paginator
                      rows={50}
                      rowsPerPageOptions={[50, 100, 200]}
                      emptyMessage="No records found"
                      className="p-datatable-custom"
                      tableStyle={{ minWidth: "50rem" }}
                      sortMode="multiple"
                    >
                      <Column
                        body={(row, { rowIndex }) => rowIndex + 1}
                        header="#"
                        sortable
                      />

                      <Column
                        body={(row) => capitalizeFirstLetter(row.username)}
                        header="User"
                        sortable
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.user_type)}
                        header="User Type"
                        sortable
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.log_type)}
                        header="Log Type"
                        sortable
                      />
                      <Column
                        body={(row) => row.ip_address}
                        header="IP Address"
                        sortable
                      />
                      <Column
                        header="Log Detail"
                        body={(row) => capitalizeFirstLetter(row.log_details)}
                      />
                    </DataTable>
                  ) : (
                    <>
                      <div className="col-md-12 alert alert-danger">
                        Data not available
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default UserLogList;
