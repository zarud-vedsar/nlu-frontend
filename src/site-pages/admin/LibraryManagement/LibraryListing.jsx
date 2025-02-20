import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FILE_API_URL, NODE_API_URL } from "../../../site-components/Helper/Constant";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { goBack } from "../../../site-components/Helper/HelperFunction";
import { Link, useParams } from "react-router-dom";

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
  const [filteredData, setFilteredData] = useState([]); // Stores filtered data

  // Fetch initial table data
  useEffect(() => {
    fetchTableData();
  }, []); // Empty dependency array to run only once

  const fetchTableData = async () => {
    const payload = { listing: "yes" };

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/library-management/fetch-book-stock-history`,
        payload
      );
      if (response.data?.statusCode === 200) {
        const data = response.data.data;
        setTableData(data);
        setFilteredData(data); // Initially show all data
        processDropdownOptions(data);
      } else {
        toast.error("No data found.");
      }
    } catch (error) {
      toast.error("Error fetching table data.");
    }
  };

  // Extract unique values for dropdowns
  const processDropdownOptions = (data) => {
    const uniqueBooks = [...new Map(data.map((item) => [item.book_id, item])).values()];
    const uniqueUsers = [...new Map(data.map((item) => [item.user_id, item])).values()];
    const uniqueIsbns = [...new Map(data.map((item) => [item.isbn_no, item])).values()];

    setBookOptions(uniqueBooks.map((book) => ({ label: book.book_name, value: book.book_id })));
    setUserOptions(uniqueUsers.map((user) => ({ label: `${user.first_name} ${user.last_name}`, value: user.user_id })));
    setIsbnOptions(uniqueIsbns.map((isbn) => ({ label: isbn.isbn_no, value: isbn.isbn_no })));
  };

  // Search function
  const handleSearch = () => {
    let filtered = tableData;

    if (selectedBook) {
      filtered = filtered.filter((item) => item.book_id === selectedBook);
    }
    if (selectedUser) {
      filtered = filtered.filter((item) => item.user_id === selectedUser);
    }
    if (selectedIsbn) {
      filtered = filtered.filter((item) => item.isbn_no === selectedIsbn);
    }
    if (fromDate) {
      filtered = filtered.filter((item) => new Date(item.issue_date) >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter((item) => new Date(item.issue_date) <= toDate);
    }

    setFilteredData(filtered);
  };

  // Reset function
  const handleReset = () => {
    setSelectedBook(null);
    setSelectedUser(null);
    setSelectedIsbn(null);
    setFromDate(null);
    setToDate(null);
    setFilteredData(tableData); // Reset to original table data
  };

  // Image Template for the Table

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
       
      </div> <div className="col-md-8">
          <div>{rowData.first_name} {rowData.last_name}</div>
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
                  <span className="breadcrumb-item active">
                  Book Stock History
                  </span>
                </nav>
              </div>
            </div>
        <div className="p-4">
              <div className="card bg-transparent mb-2">
                        <div className="card-header d-flex justify-content-between align-items-center px-0">
                          <h5 className="card-title h6_new">Book Stock History</h5>
                          <div className="ml-auto">
                            <button
                              className="ml-auto btn-md btn border-0 goBack mr-2"
                              onClick={goBack}
                            >
                              <i className="fas fa-arrow-left"></i> Go Back
                            </button>
                          
                            
                          </div>
                        </div>
                      </div>
      <div className="card p-4">
  <div className="row">
            <div className="col-md-4 col-12">
              <div className="labletexts">Select Book</div>
              <Dropdown
                value={selectedBook}
                options={bookOptions}
                onChange={(e) => setSelectedBook(e.value)}
                placeholder="Select a book"
                className="w-full drpdown"
              />
            </div>

            <div className="col-md-4 col-12">
              <div className="labletexts">Select User</div>
              <Dropdown
                value={selectedUser}
                options={userOptions}
                onChange={(e) => setSelectedUser(e.value)}
                placeholder="Select a user"
                className="w-full drpdown"
              />
            </div>

            <div className="col-md-4 col-12">
              <div className="labletexts">Select ISBN</div>
              <Dropdown
                value={selectedIsbn}
                options={isbnOptions}
                onChange={(e) => setSelectedIsbn(e.value)}
                placeholder="Select an ISBN"
                className="w-full drpdown"
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-4 col-12">
              <div className="labletexts">From Date</div>
              <Calendar
                value={fromDate}
                onChange={(e) => setFromDate(e.value)}
                dateFormat="yy-mm-dd"
                showIcon
                className="w-full formDates"
              />
            </div>

            <div className="col-md-4 col-12">
              <div className="labletexts">To Date</div>
              <Calendar
                value={toDate}
                onChange={(e) => setToDate(e.value)}
                dateFormat="yy-mm-dd"
                showIcon
                className="w-full toDates"
              />
            </div>

            <div className="col-md-4 col-12 btnsection">
              <button className="searchbtn" onClick={handleSearch}>Search</button>
              <button className="resetsbtn" onClick={handleReset}>Reset</button>
            </div>
          </div>
      </div>
        

          {/* Data Table */}
          <div className="card p-4">

            {/* <h3 className="text-lg font-semibold mb-2 mt-5">User Details</h3> */}
            <DataTable value={filteredData} paginator rows={5} className="custTable tableCust custCheckBox"
              scrollable responsiveLayout="scroll" style={{ width: "100%" }}
              paginatorTemplate="CurrentPageReport RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
              currentPageReportTemplate="Rows per page  {first}-{last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]}>
 <Column field="isbn_no" header="ISBN Number" sortable />
  <Column header="Faculty Name" body={facultyTemplate}  style={{ minWidth: "25rem" }}/>
  <Column field="book_name" header="Book Name" sortable   style={{ minWidth: "15rem" }}/>
  <Column field="description" header="Description" sortable  style={{ minWidth: "15rem" }} />
  <Column field="qty" header="Quantity" sortable />
  <Column field="created_at" header="Created At" sortable />
              {/* <Column field="first_name" header="First Name" sortable />
              <Column field="last_name" header="Last Name" sortable />
              <Column field="uid" header="UID" sortable />
              <Column header="User Image" body={imageTemplate} /> */}
            </DataTable>
          </div>

        </div>
      </div>
          <style jsx>{


`

.btnsection {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
}
button.searchbtn {
    background: black;
    color: white;
    font-weight: 500;
    padding: 3px 15px;
    border-radius: 4px;
}
button.resetsbtn {
      background-color: #886cff !important;
    border-color: #886cff !important;
    color: #fff !important;
    color: white;
    font-weight: 500;
    padding: 3px 15px;
    border-radius: 4px;
}
.drpdown{
    margin: 0px;
    width:100%;
}
.labletexts {
    color: #53535f;
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 8px;
}
.toDates{
width:100%;

}
.formDates{
width:100%;
}

.toDates button.p-datepicker-trigger.p-button.p-component.p-button-icon-only{
background:#02d3ef;
border:1px solid #02d3ef;

}
.formDates button.p-datepicker-trigger.p-button.p-component.p-button-icon-only{
background:#02d3ef;
border:1px solid #02d3ef;
}
.toDates input.p-inputtext.p-component {
    padding: 7px 10px;
    font-size: 14px;
    background: #eeeeee;
   
}
.formDates input.p-inputtext.p-component {
    padding: 7px 10px;
    font-size: 14px;
 background: #eeeeee;
}
.p-sidebar-right .viewuserspopup.p-sidebar { width: 94%;}
.custTable.p-treetable .p-treetable-thead tr th  {
    position: relative;
}
   .custTable .p-column-header-content {
    font-size: 15px;
    font-weight: 500;
}
.custTable.p-treetable .p-sortable-column-icon {
    position: absolute;
    right: 10px;
}
    .custTable .p-paginator-bottom {
     margin-top: 0px; 
}



.custTable.p-datatable .pi-filter:before {
    font-family: 'cgupod' !important;
    content: "\e93e";
}


/* Data Table start */

.custTable .p-datatable-tbody tr:hover {
     background: #F0E9EA !important;
    color: #424242 !important;
}
.custTable .p-datatable-tbody .p-checkbox.p-component {
    width: 0.938vw;
    height: 0.938vw;
}
.custTable.p-datatable .p-datatable-thead>tr>th .p-column-filter-menu-button {
    width: 0.833vw;
    height: 0.833vw;
    border-radius: 0;
}
.custTable.p-datatable .p-datatable-thead>tr>th .p-column-filter-menu-button::after {
    content: '\e93e';
    font-family: 'cgupod' !important;
    display: block;
    font-size: 14px;
}
.custTable.p-datatable .p-sortable-column .p-column-title{
    padding-right: 15px;
}
.custTable.p-datatable .p-sortable-column .p-column-title,.custTable .p-datatable .p-sortable-column .p-sortable-column-icon, .p-datatable .p-sortable-column .p-sortable-column-badge{
    font-weight: 500;
}
.custTable.p-datatable .p-datatable-thead > tr > th{
    font-weight: 500;
}
.custTable.p-datatable .p-datatable-tbody>tr>td {
    color: #424242;
    font-size: 14px;
    font-weight: 400;
    padding: 0.417vw 1.042vw;
    border-bottom: 1px solid #F2EEEE;
}
.custTable.p-datatable.p-datatable-selectable .p-datatable-tbody > tr.p-selectable-row:not(.p-highlight):not(.p-datatable-emptymessage):hover {
    background: #F0E9EA;
    color: #424242;
}
.custTable.p-datatable .pi-filter-icon.pi-filter, .custTable.p-datatable .p-sortable-column-icon.pi-sort-alt {
    color: #424242;    
    font-size: 0.729vw;
    font-weight: 500;
}
.custTable.p-datatable .p-sortable-column-icon {
    /* position: absolute;
    right: 0; */
    height: 10px;
    width: 10px;
}
.custTable.p-datatable .p-datatable-tbody>tr:nth-child(even) {
    background: #FCF5F6;
}
.custTable.p-datatable .p-datatable-thead>tr>th {
    border-bottom: 1px solid #F2EEEE;
    background: #F0E9EA;
    color: #262626;
    font-weight: 600;
    font-size: 16px;
    // padding: 0.625vw 1.042vw;
}
.custTable.p-datatable .p-sortable-column:not(.p-highlight):not(.p-sortable-disabled):hover {
    background: #F0E9EA;
    color: #424242;
}
.custTable.p-datatable .p-column-header-content {
    width: 100%;
    justify-content: normal;
    position: relative;
}
.action-shadow-table {
    box-shadow: 0px 20px 25px -5px rgba(0, 0, 0, 0.1);
}
.rememberme .p-checkbox .p-checkbox-box {
    border: 2px solid #ced4da !important;
    background: #ffffff;
    width: 1.938vw !important;
    height: 1.3vw !important;
    color: #495057;
    border-radius: 4px;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.rememberme .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover {
    border-color: #AF1E27 !important;
}
.custTable .p-datatable-tbody .p-checkbox .p-checkbox-box .p-checkbox-icon{
    width: 0.938vw;
    height: 0.938vw;
    color: #495057;
    border-radius: 4px;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.custTable .p-datatable-tbody .p-checkbox .p-checkbox-box .p-checkbox-icon {
    transition-duration: 0.2s;
    color: #ffffff;
    font-size: 8px;
}
.custTable .p-datatable-thead .p-checkbox .p-checkbox-box {
    border: 1px solid #ced4da;
    background: #ffffff;
    color: #495057;
    border-radius: 4px;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    width: 0.938vw;
    height: 0.938vw;
}
.custTable .p-datatable-thead .p-checkbox .p-checkbox-box .p-checkbox-icon {
    transition-duration: 0.2s;
    color: #ffffff;
    font-size: 8px;
}
.tableCust .p-paginator {
    justify-content: end;
    border: 0;
    padding: 0;
    padding-top: 16px;
}
.tableCust .p-paginator .p-paginator-first, .tableCust .p-paginator .p-paginator-prev, .tableCust .p-paginator .p-paginator-next, .tableCust .p-paginator .p-paginator-last, .tableCust .p-paginator .p-paginator-pages .p-paginator-page {
    border: 1px solid #EAE0E0;
    border-radius: 0;
    width: 1.719vw;
    height: 1.819vw;
    margin: 0;
    min-width: inherit;    
    font-size: 14px;
}
.tableCust .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
    border: 1px solid #EAE0E0;
    background-color: #FCF5F6;
    color: #262626;
    font-weight: 500;
}
.tableCust .p-link:focus {
    box-shadow: none;
}
.tableCust .p-paginator .p-paginator-pages .p-paginator-page:not(.p-highlight):hover, .tableCust .p-paginator .p-paginator-first:not(.p-disabled):not(.p-highlight):hover, .tableCust .p-paginator .p-paginator-prev:not(.p-disabled):not(.p-highlight):hover, .tableCust .p-paginator .p-paginator-next:not(.p-disabled):not(.p-highlight):hover, .tableCust .p-paginator .p-paginator-last:not(.p-disabled):not(.p-highlight):hover {
    background-color: #FCF5F6;
    border-color: #EAE0E0;
}
.tableCust .p-paginator .p-paginator-prev {
    border-radius: 4px 0 0 4px;
    width: 2.917vw;
}
.tableCust .p-paginator .p-paginator-next {
    border-radius: 0 4px 4px 0;
    width: 2.917vw;
}
.tableCust .pi-angle-left:before{

    content: "Previous" !important;
    font-size: 0.833vw;
}
.tableCust .pi-angle-right:before {

    content: "Next" !important;
    font-size: 0.833vw;
}
.tableCust .p-paginator-pages button {
    font-size: 0.833vw;
}
.custTable.p-datatable .p-paginator-bottom{
    border: 0;
    border-top: 1px solid #F2EEEE;
    border-radius: 0 0 12px 12px;
    padding: 16px;
}
.custTable.p-datatable .p-paginator-current{
    position: absolute;
    left: 0;
    color: #888888;
    font-weight: 400;
    font-size: 13px;
}
    
element.style {
    max-height: 200px;
}
    .p-dropdown-panel.p-component.p-ripple-disabled.p-connected-overlay-enter-done {
    z-index: 1001;
    min-width: 58.2656px;
    transform-origin: center bottom;
    top: 488.234px;
    left: 288.531px;
}
    .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
    padding: 6px 10px !important;
    font-size: 14px !important;
}
    .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
    margin: 0;
    padding: 0.75rem 1.25rem;
    border: 0 none;
    color: #495057;
    background: transparent;
    transition: box-shadow 0.2s;
    border-radius: 0;
}
    .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    color: #4338CA;
    background: #EEF2FF;
}
    .custTable .p-paginator .p-dropdown {
    height: 2.083vw;
    position: absolute;
    left: 11.021vw;
       background: transparent !important;
    border: 1px solid #EAE0E0;
}
    .p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}
    .custTable .p-dropdown .p-dropdown-trigger {
    background: #FFF;
    color: #888888;
}
    .custTable .p-dropdown .p-dropdown-trigger {
    width: 2rem;
}
    .custTable .p-dropdown .p-dropdown-label {
    background: #FFF;
    color: #888888;
    font-size: 0.833vw;
    font-weight: 400;
    justify-content: flex-start;
}
`
}</style>
    </div>
  );
}

export default LibraryListing;
