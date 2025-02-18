import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  formatDate,
  goBack, formatTime
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormField } from "../../../site-components/admin/assets/FormField";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";
import secureLocalStorage from "react-secure-storage";
import { Modal, Button, Form, Row } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Select from "react-select";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import { FaFilter } from "react-icons/fa";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <span className="badge badge-secondary">Message</span>
        <div className="table-responsive d-flex flex-wrap pl-2">
          {props?.modalMessage?.reason}
        </div>

        <br />
        {props?.modalMessage?.admin_remark && (
          <>
            <span className="badge badge-success">Remark</span>

            <div className="table-responsive d-flex flex-wrap pl-2">
              {props?.modalMessage?.admin_remark}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="mx-auto">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function LeaveRequestList() {
  const [raisedRoomQueries, setRaisedRoomQueries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [block, setBlock] = useState([]);
  const [blockRoomNo, setBlockRoomNo] = useState([]);
  // for filter
  const initializefilter = {
    studentId: secureLocalStorage.getItem("studentId"),
    roomAllotedId: null,
    start_startDate: null,
    end_startDate: null,
    start_endDate: null,
    end_endDate: null,
    start_requestedDate: null,
    end_requestedDate: null,
  };
  const [filters, setFilters] = useState(initializefilter);
  const [showFilter, setShowFilter] = useState(false);
  const handleClose = () => setShowFilter(false);
  const handleShow = () => setShowFilter(true);

  const resetFilters = () => {
    setFilters(() => ({ ...initializefilter }));
    handleSubmit();
  };

  const applyFilters = () => {
    handleSubmit();
  };

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState();

  const viewMessage = (index) => {
    const currentQuery = raisedRoomQueries[index];
    setModalMessage(currentQuery);
    setModalShow(true);
  };

  
  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();

    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/leave-request-fetch`,
        {
          ...filters,
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setRaisedRoomQueries(response.data.data);
      } else {
        setRaisedRoomQueries([]);
      }
      setIsFetching(false);
    } catch (error) {
      setRaisedRoomQueries([]);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    handleSubmit();
    fetchDistinctBlock();
  }, []);

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

  const updateReturnStatus = async (dbId) => {
    try {
      
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const returnTime = `${hours}:${minutes}`;
        
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/hostel-management/student/leave-request-set-return-by-student`,
        { studentId: secureLocalStorage.getItem("studentId"), dbId ,returnTime:returnTime}
      );
      if (response?.statusCode === 200 || response?.statusCode === 201) {
        toast.success(response.message);
        handleSubmit();
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error?.response?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
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
                    <i className="fas fa-home m-r-5" /> Dashboard
                  </a>
                  <a href="./" className="breadcrumb-item">
                    Allot Room
                  </a>
                  <span className="breadcrumb-item active">
                    New Leave Request History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">New Leave Request History</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {!secureLocalStorage.getItem("sguardianemail") &&
                  <Link to="/student/leave-request">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus"></i> New Leave Request
                    </button>
                  </Link>
}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-7 col-lg-7 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                    value={raisedRoomQueries}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
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
                      body={(row) => row?.block}
                      header="Block"
                      sortable
                    />
                    <Column
                      body={(row) => row?.roomNo}
                      header="Room No"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row?.startDate)}
                      header="Start Date"
                      sortable
                    />
                    <Column
                      body={(row) => row.leavingTime? formatTime(row.leavingTime) :row.leavingTime}
                      header="Leaving Time"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row?.endDate)}
                      header="End Date"
                      sortable
                    />
                    <Column
                      body={(row) => row.returnTime? formatTime(row.returnTime) : row.returnTime}
                      header="Return Time"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row?.leaveType)}
                      header="Leave Type"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row?.requested_date)}
                      header="Requested Date"
                      sortable
                    />

                    <Column
                      body={(row) => (
                        <>
                          {row?.status === 1 && (
                            <span className="badge badge-danger">Rejected</span>
                          )}
                          {row?.status === 2 && (
                            <span className="badge badge-success">
                              Approved
                            </span>
                          )}
                          {row?.status === 0 && (
                            <span className="badge badge-warning">Pending</span>
                          )}
                        </>
                      )}
                      header="Status"
                      sortable
                    />
                    <Column
                      body={(row) => (
                        <>
                          {row?.returnStatus === 0 && row.status === 2 && (
                            <button
                              className="btn badge-warning"
                              onClick={() => updateReturnStatus(row.id)}
                            >
                              Pending
                            </button>
                          )}
                          {row?.returnStatus === 1 && row.status === 2 && (
                            <button className="btn badge-success">
                              Marked
                            </button>
                          )}
                        </>
                      )}
                      header="Mark as Return"
                      sortable
                    />

                    <Column
                      field="message"
                      body={(row, { rowIndex }) => (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="button-tooltip-2">
                              View Message
                            </Tooltip>
                          }
                        >
                          <div className="avatar avatar-icon avatar-md avatar-orange">
                            <i
                              className="fa-solid fa-eye"
                              onClick={() => viewMessage(rowIndex)}
                            ></i>
                          </div>
                        </OverlayTrigger>
                      )}
                      header="Message"
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        modalMessage={modalMessage}
      />

      {/* filter modal */}
      <Modal show={showFilter} onHide={handleClose} className="modal-right">
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="filteruserlist">
            <Row>
              <div className="col-12 col-sm-12 form-group">
                <label className="font-weight-semibold">
                  Select Leave Type:{" "}
                </label>

                <Select
                  options={["halfday", "fullday"].map((item) => ({
                    value: item,
                    label: capitalizeFirstLetter(item),
                  }))}
                  onChange={(selectedOption) => {
                    setFilters((prev) => ({
                      ...prev,
                      leaveType: selectedOption.value, // Store a single value
                    }));
                  }}
                  value={
                    filters?.leaveType
                      ? {
                          value: filters.leaveType,
                          label: capitalizeFirstLetter(filters.leaveType),
                        }
                      : null
                  }
                />
              </div>
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
                    value: item.id,
                    label: item.roomNo,
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      roomAllotedId: selectedOption.value,
                    });
                  }}
                  value={
                    blockRoomNo.find(
                      (item) => item.id === filters.roomAllotedId
                    )
                      ? {
                          value: filters.roomAllotedId,
                          label: blockRoomNo.find(
                            (item) => item.id === filters.roomAllotedId
                          ).roomNo,
                        }
                      : { value: filters.roomAllotedId, label: "Select" }
                  }
                />
              </div>

              <FormField
                label="Start Date From"
                name="start_startDate"
                id="start_startDate"
                type="date"
                value={filters.start_startDate || " "}
                column="col-6"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    start_startDate: e.target.value,
                  }))
                }
              />
              <FormField
                label="Start Date To"
                name="end_startDate"
                id="end_startDate"
                type="date"
                value={filters.end_startDate || " "}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    end_startDate: e.target.value,
                  }))
                }
                column="col-6"
              />
              <FormField
                label="End Date From"
                name="start_endDate"
                id="start_endDate"
                type="date"
                value={filters.start_endDate || " "}
                column="col-6"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    start_endDate: e.target.value,
                  }))
                }
              />
              <FormField
                label="End Date To"
                name="end_endDate"
                id="end_endDate"
                type="date"
                value={filters.end_endDate || " "}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    end_endDate: e.target.value,
                  }))
                }
                column="col-6"
              />
              <FormField
                label="Request Date From"
                name="start_requestedDate"
                id="start_requestedDate"
                type="date"
                value={filters.start_requestedDate || " "}
                column="col-6"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    start_requestedDate: e.target.value,
                  }))
                }
              />
              <FormField
                label="Request Date To"
                name="end_requestedDate"
                id="end_requestedDate"
                type="date"
                value={filters.end_requestedDate || " "}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    end_requestedDate: e.target.value,
                  }))
                }
                column="col-6"
              />
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
          }

          .modal-right.show .modal-dialog {
            transform: translateX(0);
          }
        `}
      </style>
    </>
  );
}
export default LeaveRequestList;
