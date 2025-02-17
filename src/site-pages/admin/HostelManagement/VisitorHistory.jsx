import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  dataFetchingGet,
  formatDate,
  goBack
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import { Modal, Button, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import { FormField } from "../../../site-components/admin/assets/FormField";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";

function VisitorHistory() {
  const navigate = useNavigate();
  const [visitorHistory, setVisitorHistory] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [isFetching, setIsFetching] = useState(false);
  //for filter
  const [block, setBlock] = useState([]);
  const [blockRoomNo, setBlockRoomNo] = useState([]);
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "vehicle_no" && value != "") {
      value = value.toUpperCase();
    }
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const initializeFilter = {
    blockId: "",
    roomNo: "",
    visitorType: "",
    name: "",
    contact_number: "",
    visit_in_date: "",
    visit_out_date: "",
    vehicle_no: "",
    StudentId: "",
    visit_in_date_start:"",
    visit_in_date_end:"",
    visit_out_date_start:"",
    visit_out_date_end:"",
  };
  const [studentList, setStudentList] = useState([]);
  const [filters, setFilters] = useState(initializeFilter);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const fetchStudent = async (block, roomNo) => {
    try {
      const response = await dataFetchingGet(`${NODE_API_URL}/api/hostel-management/student-list/${block}/${roomNo}`);
      if (response?.statusCode === 200 && response.data.length > 0) {
        setStudentList(response.data);
        return null;
      } else {
        toast.error("Data not found.");
        return [];
      }
    } catch (error) {
      return [];
    }
  }
  useEffect(() => {
    if (filters.blockId && filters.roomNo) {
      fetchStudent(filters.blockId, filters.roomNo);
    }
  }, [filters.blockId, filters.roomNo]);
  const resetFilters = () => {
    setFilters(initializeFilter);
    handleSubmit();
    handleClose();
  };

  const applyFilters = () => {
    
    handleSubmit(true, false);
  };

  const fetchRoomNoBasedOnBlock = async (block) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/hostel-management/room/room-no-based-on-block/${block}`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setBlockRoomNo(response.data);
        return null;
      } else {
        toast.error("Data not found.");
        return [];
      }
    } catch (error) {
      return [];
    }
  };
  const fetchDistinctBlock = async () => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/hostel-management/room/distinct-blocks`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setBlock(response.data);

        return null;
      } else {
        toast.error("Data not found.");
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/visitor-entry/${dbId}`, { replace: false });
  };
  const handleSubmit = async (applyFilter = false, e = false) => {
    if (e) e.preventDefault();
    let bformData = { listing: "yes" };
    if (applyFilter) {
      bformData = filters;
    }
    
    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/visitor/fetch`,
        {
          ...bformData,
        }
      );
      
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        

        setVisitorHistory(response.data.data);
      } else {
        setVisitorHistory([]);
      }
      setIsFetching(false);
    } catch (error) {
      setVisitorHistory([]);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    handleSubmit();
    fetchDistinctBlock();
  }, []);
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
                  <span className="breadcrumb-item">Hostel Management</span>
                  <span className="breadcrumb-item active">
                    Visitor History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Visitor History</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/visitor-entry">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus"></i> Add New Entry
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* Search Box */}
                <div className="row">
                  <div className="col-md-10 col-lg-10 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                  <div className="">
                    <Button
                      variant="primary"
                      className=" mb-2 mb-md-0"
                      onClick={handleShow}
                    >
                      <span>
                        <FaFilter /> Filter
                      </span>
                    </Button>
                  </div>
                </div>
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={visitorHistory}
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
                      body={(row, { rowIndex }) => ++rowIndex}
                      header="#"
                      sortable
                    />

                    <Column
                      body={(row) => validator.unescape(row.visitorType)}
                      header="Visitor Type"
                      sortable
                    />
                    <Column
                      body={(row) => validator.unescape(row.name)}
                      header="Name"
                      sortable
                    />
                    <Column
                      body={(row) => validator.unescape(row.contact_number)}
                      header="Contact No"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.visit_in_date)}
                      header="Visit In Date"
                      sortable
                    />
                    <Column
                      body={(row) =>
                        row.visit_out_date
                          ? formatDate(row.visit_out_date)
                          : row.visit_out_date
                      }
                      header="Visit Out Date"
                      sortable
                    />
                    <Column
                      body={(row) => row.time_in}
                      header="Visit In Time"
                      sortable
                    />
                    <Column
                      body={(row) => row.time_out}
                      header="Visit Out Time"
                      sortable
                    />
                    <Column field="blockId" header="Block" sortable />
                    <Column field="roomNo" header="Room No" sortable />
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

      <Modal show={show} onHide={handleClose} className="modal-right">
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="filteruserlist">
            <Row>
              <FormField
                label="Visitor Name"
                name="name"
                id="name"
                value={filters.name}
                onChange={handleChange}
                column="col-md-12"
              />
              {/* Contact No */}
              <FormField
                label="Contact No"
                name="contact_number"
                id="contact_number"
                value={filters.contact_number}
                onChange={handleChange}
                column="col-md-12"
              />

              {/* Visit Date */}
              <FormField
                label="Visit In Date"
                name="visit_in_date"
                id="visit_in_date"
                type="date"
                value={filters.visit_in_date}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="Visit Out Date"
                name="visit_out_date"
                id="visit_out_date"
                type="date"
                value={filters.visit_out_date}
                onChange={handleChange}
                column="col-md-6"
              />
              <FormField
                label="Visit In Date From"
                name="visit_in_date_start"
                id="visit_in_date_start"
                type="date"
                value={filters.visit_in_date_start}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="Visit In Date To"
                name="visit_in_date_end"
                id="visit_in_date_end"
                type="date"
                value={filters.visit_in_date_end}
                onChange={handleChange}
                column="col-md-6"
              />
              <FormField
                label="Visit Out Date From"
                name="visit_out_date_start"
                id="visit_out_date_start"
                type="date"
                value={filters.visit_out_date_start}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit Out Date */}
              <FormField
                label="Visit Out Date To"
                name="visit_out_date_end"
                id="visit_out_date_end"
                type="date"
                value={filters.visit_out_date_end}
                onChange={handleChange}
                column="col-md-6"
              />
              {/* Visit In Time */}

              {/* Vehicle No */}
              <FormField
                label="Vehicle No (if Any)"
                name="vehicle_no"
                placeholder="UP70CV0000"
                id="vehicle_no"
                value={filters.vehicle_no}
                onChange={handleChange}
                column="col-12 "
              />
              <div className="col-12 form-group">
                <label className="font-weight-semibold">Block</label>
                <Select
                  options={block.map((item) => ({
                    value: item.block,
                    label: item.block,
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      blockId: selectedOption.value,
                    });
                    fetchRoomNoBasedOnBlock(selectedOption.value);
                  }}
                  value={
                    block.find((item) => item.block === filters.blockId)
                      ? {
                        value: filters.blockId,
                        label: block.find(
                          (item) => item.block === filters.blockId
                        ).block,
                      }
                      : { value: filters.blockId, label: "Select" }
                  }
                />
              </div>
              <div className="col-12 form-group">
                <label className="font-weight-semibold">Room No</label>
                <Select
                  options={blockRoomNo.map((item) => ({
                    value: item.roomNo,
                    label: item.roomNo,
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      roomNo: selectedOption.value,
                    });
                  }}
                  value={
                    blockRoomNo.find((item) => item.roomNo === filters.roomNo)
                      ? {
                        value: filters.roomNo,
                        label: blockRoomNo.find(
                          (item) => item.roomNo === filters.roomNo
                        ).roomNo,
                      }
                      : { value: filters.roomNo, label: "Select" }
                  }
                />
              </div>
              <div className="col-12 form-group">
                <label className="font-weight-semibold">
                  Students
                </label>
                <Select
                  options={[
                    { value: "", label: "Select" }, // Default reset option
                    ...studentList.map((item) => ({
                      value: item.id,
                      label: `${item.sname} (${item.sphone})`,
                    })),
                  ]}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      StudentId: selectedOption.value,
                    });
                  }}
                  value={
                    studentList.find((item) => item.id === filters.StudentId)
                      ? {
                        value: filters.StudentId,
                        label: studentList.find(
                          (item) => item.id === filters.StudentId
                        ).sname,
                      }
                      : { value: "", label: "Select" }
                  }
                />
              </div>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="w-50" onClick={resetFilters}>
            Reset
          </Button>
          <Button variant="primary" className="w-50" onClick={applyFilters}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>
        {`
          .modal-right .modal-dialog {
            position: absolute;
            top: 0;
            right: 0;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            height:fit-content;
          }

          .modal-right.show .modal-dialog {
            transform: translateX(0);
          }
        `}
      </style>
    </>
  );
}
export default VisitorHistory;
