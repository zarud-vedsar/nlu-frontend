import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { Calendar } from "primereact/calendar";
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
import { Link, useParams } from "react-router-dom";
import { FormField } from "../../../site-components/admin/assets/FormField";

function LibraryListing() {
  const [bookOptions, setBookOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [isbnOptions, setIsbnOptions] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIsbn, setSelectedIsbn] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
    fetchTableData();
  }, []);
  const [isFetching, setIsFetching] = useState(false);
  const fetchTableData = async () => {
    setIsFetching(true);
    

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/library-management/fetch-book-stock-history`,
        {...filters}
      );
      if (response.data?.statusCode === 200) {
        const data = response.data.data;

        setTableData(data);
        setFilteredData(data);
        processDropdownOptions(data);
      } else {
        toast.error("No data found.");
      }
    } catch (error) {
      toast.error("Error fetching table data.");
    } finally {
      setIsFetching(false);
    }
  };

  const processDropdownOptions = (data) => {
    const uniqueBooks = [
      ...new Map(data.map((item) => [item.book_id, item])).values(),
    ];
    const uniqueUsers = [
      ...new Map(data.map((item) => [item.user_id, item])).values(),
    ];
    const uniqueIsbns = [
      ...new Map(data.map((item) => [item.isbn_no, item])).values(),
    ];

    setBookOptions(
      uniqueBooks.map((book) => ({
        label: book.book_name,
        value: book.book_id,
      }))
    );
    setUserOptions(
      uniqueUsers.map((user) => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.user_id,
      }))
    );
    setIsbnOptions(
      uniqueIsbns.map((isbn) => ({ label: isbn.isbn_no, value: isbn.isbn_no }))
    );
  };

  const handleSearch = () => {
    let filtered = tableData;

    if (selectedBook) {
      filtered = filtered.filter((item) => item.book_id === selectedBook.value);
    }
    if (selectedUser) {
      filtered = filtered.filter((item) => item.user_id === selectedUser.value);
    }
    if (selectedIsbn) {
      filtered = filtered.filter((item) => item.isbn_no === selectedIsbn.value);
    }
    if (fromDate) {
      filtered = filtered.filter(
        (item) => new Date(item.issue_date) >= fromDate
      );
    }
    if (toDate) {
      filtered = filtered.filter((item) => new Date(item.issue_date) <= toDate);
    }

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSelectedBook(null);
    setSelectedUser(null);
    setSelectedIsbn(null);
    setFromDate(null);
    setToDate(null);
    setFilteredData(tableData);
  };
  const facultyTemplate = (rowData) => {
    return (
      <>
        <div className="row">
          <div className=" col-md-2">
            <img
              src={`${FILE_API_URL}/books/${rowData.userImage}`}
              alt=""
              className=""
            />
          </div>{" "}
          <div className="col-md-8">
            <div>
              {rowData.first_name} {rowData.last_name}
            </div>
            <div className="text-sm text-gray-500">UID: {rowData.uid}</div>
          </div>
        </div>
      </>
    );
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
            <div className="col-md-4">
              <label>Select Book</label>
              <Select
                options={bookOptions}
                value={selectedBook}
                onChange={setSelectedBook}
              />
            </div>
            <div className="col-md-4">
              <label>Select User</label>
              <Select
                options={userOptions}
                value={selectedUser}
                onChange={setSelectedUser}
              />
            </div>
            <div className="col-md-4">
              <label>Select ISBN</label>
              <Select
                options={isbnOptions}
                value={selectedIsbn}
                onChange={setSelectedIsbn}
              />
            </div>
          </div>
          <div className="row mt-3">
            <FormField
              label="From Date"
              name="fromDate"
              id="fromDate"
              type="date"
              value={filters.fromDate}
              column="col-md-3 col-lg-3"
              onChange={(e) =>
                setFormData((prev) => ({
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
                setFormData((prev) => ({
                  ...prev,
                  toDate: e.target.value,
                }))
              }
            />
            <div className="col-md-4 mt-4 pt-1 ">
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

                  <Column field="isbn_no" header="ISBN Number" sortable />
                  <Column
                    header="Faculty Name"
                    body={facultyTemplate}
                    style={{ minWidth: "17rem" }}
                  />
                  <Column
                    field="book_name"
                    header="Book Name"
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column
                    field="description"
                    header="Description"
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column field="qty" header="Quantity" sortable />
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
