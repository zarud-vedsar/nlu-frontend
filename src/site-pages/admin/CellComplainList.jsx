// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  goBack,
  capitalizeEachLetter,
  formatDate,
} from "../../site-components/Helper/HelperFunction";
import "../../../node_modules/primeicons/primeicons.css";
import axios from "axios";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import secureLocalStorage from "react-secure-storage";
import { FormField } from "../../site-components/admin/assets/FormField";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Modal, Button, Spinner } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";


function CellComplainList() {
  const [showFilter, setShowFilter] = useState(true);
  const [cellList, setCellList] = useState([]);
  const [cellTypeList, setCellTypeList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState();
  const [globalFilter, setGlobalFilter] = useState("");

  const viewMessage = (data) => {
   
    setModalMessage(data);
    setModalShow(true);
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
    return formatDateForMonth(new Date(now.getFullYear(), now.getMonth()-2, 1));
  };

  const getLastDayOfMonth = () => {
    const now = new Date();
    return formatDateForMonth(
      new Date(now.getFullYear(), now.getMonth() + 1, 0)
    );
  };

  const initialData = {
    cell: "",

    from_date: getFirstDayOfMonth(),
    to_date: getLastDayOfMonth(),
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    loadCellTypeList();
    handleSubmit();
  }, []);

  const loadCellTypeList = async () => {
    setIsFetching(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "cell_list");
      const response = await axios.post(
        `${PHP_API_URL}/cell_messages.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCellTypeList(response.data.data);
    } catch (error) {
      setCellTypeList([]);
      console.error("Error fetching faculty data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();
    setCellList([]);
    setIsFetching(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_complain_messages");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      Object.entries(formData).forEach(([key, value]) => {
        bformData.append(key, value);
      });

      const response = await axios.post(
        `${PHP_API_URL}/cell_messages.php`,
        bformData
      );

      if (response.data?.status === 200 && response.data.data.length > 0) {
        toast.success(response?.data?.msg || "Fetched");
        setCellList(response?.data?.data);
      } else {
        setCellList([]);
      }
    } catch (error) {
      setCellList([]);
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
                  <span className="breadcrumb-item active">Cell Complain</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new"> Complain List</h5>
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
                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Select Cell
                      </label>

                      <Select
                        options={cellTypeList.map((cell) => ({
                          value: cell,
                          label: capitalizeEachLetter(cell),
                        }))}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            cell: e.value,
                          }));
                        }}
                        value={
                          formData.cell
                            ? {
                                value: formData.cell,
                                label: capitalizeEachLetter(formData.cell),
                              }
                            : { value: "", label: "Select" }
                        }
                      />
                    </div>

                    <FormField
                      label="From Date"
                      name="from_date"
                      id="from_date"
                      type="date"
                      value={formData.from_date}
                      column="col-md-4 col-lg-4"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          from_date: e.target.value,
                        }))
                      }
                      required
                    />
                    <FormField
                      label="To Date"
                      name="to_date"
                      id="to_date"
                      type="date"
                      value={formData.to_date}
                      column="col-md-4 col-lg-4"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          to_date: e.target.value,
                        }))
                      }
                      required
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
                <div className="row align-items-center">
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
                  {cellList.length > 0 ? (
                    <DataTable
                      value={cellList}
                      removableSort
                      paginator
                      rows={50}
                      rowsPerPageOptions={[50, 100, 200]}
                      emptyMessage="No records found"
                      className="p-datatable-custom"
                      tableStyle={{ minWidth: "50rem" }}
                      sortMode="multiple"
                      globalFilter={globalFilter}
                      
                    >
                      <Column
                        body={(row, { rowIndex }) => rowIndex + 1}
                        header="#"
                        sortable
                      />

                      <Column
                        body={(row) => {
                          return `${
                            row.fname
                              ? capitalizeFirstLetter(row.fname)
                              : row.fname
                          }  ${
                            row.lname ? capitalizeFirstLetter(row.lname) : ""
                          }`;
                        }}
                        header="Name"
                        field="fname"
                        sortable
                      />

                      <Column
                        body={(row) => capitalizeFirstLetter(row.email)}
                        header="Email"
                        sortable
                        field="email"
                      />
                      <Column
                        body={(row) => row.phone}
                        header="Phone"
                        sortable
                        field="phone"
                      />
                      <Column
                        body={(row) => row.batch}
                        header="Batch"
                        sortable
                        field="batch"
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.semester)}
                        header="Semester"
                        sortable
                        field="semester"
                      />
                      <Column
                        body={(row) => formatDate(row.created_at)}
                        header="Date"
                        sortable
                        
                        field="created_at"
                      />
                      
                      <Column body={(row) => row.cell} header="Cell" sortable  field="cell" />
                      <Column body={(row) => row.subject} header="Subject" sortable  field="subject" />
                      <Column
                        header="View Complain"
                        body={(row) => (
                          <div className="d-flex justify-content-center">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">
                                  View Complain
                                </Tooltip>
                              }
                            >
                              <Link to={`/admin/cell-complain-details/${row.id}`} className="avatar avatar-icon avatar-md avatar-orange">
                                <i
                                  className="fa-solid fa-eye"
                                ></i>
                              </Link>
                            </OverlayTrigger>{" "}
                            
                          </div>
                        )}
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
export default CellComplainList;
