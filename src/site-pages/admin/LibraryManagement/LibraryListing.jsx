import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  FILE_API_URL,
  NODE_API_URL,
} from "../../../site-components/Helper/Constant";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { FormField } from "../../../site-components/admin/assets/FormField";

function LibraryListing() {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

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

  const filterData = {
    listing: "yes",
    book_id: "",
    user_id: "",
    isbn_no: "",
    fromDate: getFirstDayOfMonth(),
    toDate: getLastDayOfMonth(),
  };
  const [filters, setFilters] = useState(filterData);
  useEffect(() => {
    fetchTableData(filterData);
  }, []);

  const fetchTableData = async (filter) => {
    setIsFetching(true);

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/library-management/fetch-book-stock-history`,
        { ...filter }
      );
      if (response.data?.statusCode === 200) {
        const data = response.data.data;

        setFilteredData(data);
        console.log(tableData.length);
        if (tableData && tableData.length === 0) {
          setTableData(data);
        }
      } else {
        toast.error("No data found.");
      }
    } catch (error) {
      setFilteredData([]);
      toast.error("Error fetching table data.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleReset = () => {
    setFilters(filterData);
    fetchTableData(filterData);
  };
  const handleSearch = () => {
    fetchTableData(filters);
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="page-header mb-0">
          <div className="header-sub-title">
            <nav className="breadcrumb breadcrumb-dash">
              <a href="./" className="breadcrumb-item">
                <i className="fas fa-home m-r-5" /> Dashboard
              </a>
              <a href="./" className="breadcrumb-item">
                Library Management
              </a>
              <span className="breadcrumb-item active">Book Stock History</span>
            </nav>
          </div>
        </div>

        <div className="card bg-transparent mb-2">
          <div className="card-header d-flex justify-content-between align-items-center px-0">
            <h5 className="card-title h6_new"> Book Stock History</h5>
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
        <div className="card p-4">
          <div className="row">
            <div className="col-md-3">
              <label>Select Book</label>
              <Select
                options={Array.from(
                  new Map(
                    tableData.map((data) => [data.book_id, data])
                  ).values()
                ).map((data) => ({
                  value: data.book_id,
                  label: `${data.book_name} - ${data.isbn_no}`,
                }))}
                value={
                  tableData.find((data) => data.book_id === filters?.book_id)
                    ? {
                        value: filters?.book_id,
                        label: `${
                          tableData.find(
                            (data) => data.book_id === filters?.book_id
                          ).book_name
                        } - ${
                          tableData.find(
                            (data) => data.book_id === filters?.book_id
                          ).isbn_no
                        }`,
                      }
                    : { value: null, label: "Select" }
                }
                onChange={(selectedOption) => {
                  setFilters((prev) => ({
                    ...prev,
                    book_id: selectedOption.value,
                  }));
                }}
              />
            </div>
            <div className="col-md-3">
              <label>Select Employe</label>
              <Select
                options={Array.from(
                  new Map(
                    tableData.map((data) => [data.user_id, data])
                  ).values()
                ).map((data) => ({
                  value: data.user_id,
                  label: `${data.first_name}  ${data.last_name}`,
                }))}
                value={
                  tableData.find((data) => data.user_id === filters?.user_id)
                    ? {
                        value: filters?.user_id,
                        label: `${
                          tableData.find(
                            (data) => data.user_id === filters?.user_id
                          ).first_name
                        } ${
                          tableData.find(
                            (data) => data.user_id === filters?.user_id
                          ).last_name
                        }`,
                      }
                    : { value: null, label: "Select" }
                }
                onChange={(selectedOption) => {
                  setFilters((prev) => ({
                    ...prev,
                    user_id: selectedOption.value,
                  }));
                }}
              />
            </div>
            <FormField
              label="From Date"
              name="fromDate"
              id="fromDate"
              type="date"
              value={filters.fromDate}
              column="col-md-3 col-lg-3"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  fromDate: e.target.value,
                }))
              }
            />
            <FormField
              label="To Date"
              name="toDate"
              id="toDate"
              type="date"
              value={filters.toDate}
              column="col-md-3 col-lg-3"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  toDate: e.target.value,
                }))
              }
            />
          </div>
          <div className="row ">
            <div className="col-md-4 pt-1 ">
              <button
                onClick={handleSearch}
                className="btn btn-dark mr-2"
                type="submit"
              >
                Search{" "}
              </button>
              <button className="btn btn-secondary " onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {/* Search Box */}

            <div className={`table-responsive ${isFetching ? "form" : ""}`}>
              {filteredData.length > 0 ? (
                <DataTable
                  value={filteredData}
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
                    header="BooK"
                    body={(rowData) => (
                      <div
                        className="info-column d-flex align-items-center
                  "
                      >
                        <div className="info-image mr-4">
                          {rowData.bookImage ? (
                            <img
                              src={`${FILE_API_URL}/books/${rowData.bookImage}`}
                              alt=""
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#e6fff3",
                                fontSize: "20px",
                                color: "#00a158",
                              }}
                              className="rounded-circle d-flex justify-content-center align-items-center"
                            />
                          ) : (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#e6fff3",
                                fontSize: "20px",
                                color: "#00a158",
                              }}
                              className="rounded-circle d-flex justify-content-center align-items-center"
                            >
                              {rowData?.book_name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="info-name">
                            <span>{`${rowData.book_name} `}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    field="first_name"
                    sortable
                    style={{ minWidth: "17rem" }}
                  />
                  <Column
                    header="Employe"
                    body={(rowData) => (
                      <div
                        className="info-column d-flex align-items-center
                  "
                      >
                        <div className="info-image mr-4">
                          {rowData.userImage ? (
                            <img
                              src={`${FILE_API_URL}/user/${rowData.uid}/${rowData.userImage}`}
                              alt=""
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#e6fff3",
                                fontSize: "20px",
                                color: "#00a158",
                              }}
                              className="rounded-circle d-flex justify-content-center align-items-center"
                            />
                          ) : (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#e6fff3",
                                fontSize: "20px",
                                color: "#00a158",
                              }}
                              className="rounded-circle d-flex justify-content-center align-items-center"
                            >
                              {rowData?.first_name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="info-name">
                            <span>{`${rowData.first_name} ${rowData.last_name}`}</span>
                          </div>

                          <div className="info-email">
                            <span>{rowData.uid}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    field="first_name"
                    sortable
                    style={{ minWidth: "17rem" }}
                  />

<Column field="isbn_no" header="ISBN Number" sortable />
                  

                  
                  <Column field="qty" header="Quantity" sortable />
                  <Column field="vendor" header="Vendor" sortable />
                  <Column
                    field="description"
                    header="Remark"
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column
                    field="created_at"
                    header="Created At"
                    body={(rowData) => formatDate(rowData.created_at)}
                    sortable
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
  );
}

export default LibraryListing;
