import React, { useEffect, useState } from "react";
import { FILE_API_URL, NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  formatDate,
  formatTime,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import "../../../../node_modules/primeicons/primeicons.css";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FormField,
  TextareaField,
} from "../../../site-components/admin/assets/FormField";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";
import { Modal, Button, Form, Row } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Select from "react-select";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import { FaFilter } from "react-icons/fa";
import secureLocalStorage from "react-secure-storage";

const ResponseModal = (props = {}) => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({
    response: "",
    id: null,
    status: null,
  });

  const [error, setError] = useState({ field: "", msg: "" }); // Error state

  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };

  useEffect(() => {
    if (props?.detail) {
      setDetail((prevDetail) => ({
        ...prevDetail,
        response: props?.detail?.admin_remark || "",
        id: props?.detail?.id || "",
        status: props?.detail?.status || 0,
      }));
    }
  }, [props.detail]);

  const handleSubmit = async () => {
    setLoading(true);
    if (!detail?.response) {
      errorMsg("response", "Remark is required");
      toast.error("Remark is required");
    }
    try {
      let formData = {};
      formData.dbId = detail?.id;
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      formData.status = detail?.status;
      formData.response = detail?.response;

      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/admin/leave-request-set-response`,
        formData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        toast.success(response?.data?.message);
        props?.submit();
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Reply</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group col-md-12">
          <label className="font-weight-semibold">Application Status</label>
          <span className="text-danger">*</span>
          <select
            name="status"
            id="status"
            className="form-control"
            value={detail?.status}
            onChange={(e) => {
              setDetail((prev) => ({
                ...prev,
                status: e.target.value,
              }));
            }}
          >
            <option value="0">Select</option>
            <option value="2">Approved</option>
            <option value="1">Rejected</option>
          </select>
        </div>

        <TextareaField
          borderError={error.field === "response"}
          errorMessage={error.field === "response" && error.msg}
          label="Remark"
          name="response"
          id="response"
          placeholder="Enter Remark"
          value={detail.response}
          onChange={(e) =>
            setDetail((pre) => ({
              ...pre,
              response: e.target.value,
            }))
          }
          column="col-md-12"
          required
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="mx-auto">
          <Button
            onClick={props?.close}
            className="btn btn-danger"
            disabled={loading}
          >
            Close
          </Button>{" "}
          <Button
            onClick={handleSubmit}
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

function MessageModal(props) {
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
    studentId: null,
    roomAllotedId: null,
    leaveType: null,
    start_startDate: null,
    end_startDate: null,
    start_endDate: null,
    end_endDate: null,
    start_requestedDate: null,
    end_requestedDate: null,
    blockId: null,
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
  const [modalMessage, setModalMessage] = useState(false);
  const [responseModal, setResponseModal] = useState(false);
  const [dataForMail, setDataFormMail] = useState();

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
  const [studentListing, setStudentListing] = useState([]);
  const fetchStudent = async () => {
    try {
      let session = localStorage.getItem("session");
      const response = await axios.post(
        `${NODE_API_URL}/api/student-detail/get-student`,
        {session:session}
      );
      if (
        response?.data?.statusCode === 200 &&
        response?.data?.data.length > 0
      ) {
        setStudentListing(response?.data?.data);
      } else {
        toast.error("Data not found.");
        setStudentListing([]);
      }
    } catch (error) {
      setStudentListing([]);
    }
  };

  useEffect(() => {
    handleSubmit();
    fetchDistinctBlock();
    fetchStudent();
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

  const handleToggleStatus = async (dbId, currentStatus) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    // Toggle the status (currentStatus is the current checkbox state)
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const returnTime = `${hours}:${minutes}`;

      const loguserid = secureLocalStorage.getItem("login_id");
      const login_type = secureLocalStorage.getItem("loginType");
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/leave-request-set-return-by-admin`,
        {
          login_type,
          loguserid,
          dbId,
          returnStatus: newStatus,
          returnTime:newStatus ? returnTime : "",
        }
      );
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        setRaisedRoomQueries((prevList) =>
          prevList.map((item) =>
            item.id === dbId ? { ...item, returnStatus: newStatus ,returnTime: newStatus?returnTime:""} : item
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
                    Hostel Management
                  </a>
                  <span className="breadcrumb-item active">
                    Leave Request List
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Leave Request List</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                    <Button
                      variant="primary"
                      className=" mb-2 mb-md-0"
                      onClick={handleShow}
                    >
                      <span>
                        <FaFilter /> 
                      </span>
                    </Button>
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
                 
                </div>

                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={raisedRoomQueries}
                    globalFilter={globalFilter}
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
                                            header="Student"
                                            body={(rowData) => (
                                              <div
                                                className="info-column d-flex align-items-center
                                        "
                                              >
                                                <div className="info-image mr-4">
                                                  {rowData.spic ? (
                                                    <img
                                                      src={`${FILE_API_URL}/student/${rowData.studentId}${rowData.registrationNo}/${rowData.spic}`}
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
                                                      {rowData?.sname[0]}
                                                    </div>
                                                  )}
                                                </div>
                                                <div>
                                                  <div className="info-name" style={{width:"15em"}}>
                                                    <span>{`${rowData.sname}`}</span>
                                                  </div>
                    
                                                  <div className="info-email">
                                                    <span>Enroll : {rowData.enrollmentNo}</span>
                                                  </div>
                                                  
                                                </div>
                                              </div>
                                            )}
                                            field="sname"
                                            sortable
                                          />
                    
                    <Column
                      body={(row) => row.block}
                      header="Block"
                      field="block"
                      sortable
                    />
                    <Column
                      body={(row) => row.roomNo}
                      header="Room No"
                      field="roomNo"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.startDate)}
                      header="Start Date"
                      field="startDate"
                      sortable
                    />
                    
                    <Column
                      body={(row) => row.leavingTime? formatTime(row.leavingTime) : row.leavingTime}
                      header="Leaving Time"
                      field="leavingTime"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.endDate)}
                      header="End Date"
                      field="endDate"
                      sortable
                    />
                    <Column
                      body={(row) => row.returnTime? formatTime(row.returnTime) : row.returnTime}
                      header="Return Time"
                      field="returnTime"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row.leaveType)}
                      header="Leave Type"
                      field="leaveType"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.requested_date)}
                      header="Requested Date"
                      field="requested_date"
                      sortable
                    />
                    <Column
                      body={(row) => (
                        <>
                          {row.status === 1 && (
                            <span className="badge badge-danger">Rejected</span>
                          )}
                          {row.status === 2 && (
                            <span className="badge badge-success">
                              Approved
                            </span>
                          )}
                          {row.status === 0 && (
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
                          {row?.status === 2 && (
                            <div className="switch mt-2 w-auto mr-2">
                              <input
                                type="checkbox"
                                checked={row.returnStatus === 1}
                                onChange={() =>
                                  handleToggleStatus(row.id, row.returnStatus)
                                }
                                id={`switch${row.id}`}
                              />
                              <label
                                className="mt-0"
                                htmlFor={`switch${row.id}`}
                              ></label>
                            </div>
                          )}
                        </>
                      )}
                      header="Mark as Return"
                    />

                    <Column
                      field="Action"
                      body={(row, { rowIndex }) => (
                        <div className="d-flex">
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
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="button-tooltip-2">
                                Add Response
                              </Tooltip>
                            }
                          >
                            <div className="avatar avatar-icon avatar-md avatar-orange">
                              <i
                                className="fa-solid fa-edit"
                                onClick={() => {
                                  setDataFormMail(row), setResponseModal(true);
                                }}
                              ></i>
                            </div>
                          </OverlayTrigger>
                        </div>
                      )}
                      header="Action"
                      sortable
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <MessageModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        modalMessage={modalMessage}
      />
      <ResponseModal
        show={responseModal}
        detail={dataForMail}
        close={() => setResponseModal(false)}
        submit={() => {
          setResponseModal(false);
          handleSubmit();
        }}
      />

      {/* filter modal */}
      <Modal show={showFilter} onHide={handleClose} className="modal-right">
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="filteruserlist">
            <Row>
              <div className="col-12 form-group">
                <label className="font-weight-semibold">
                  Student <span className="text-danger">*</span>
                </label>
                <Select
                  options={
                    studentListing?.map((student) => ({
                      value: student.id,
                      label: `${student.sname} (${student.enrollmentNo})`,
                    })) || []
                  }
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      studentId: selectedOption.value,
                    });
                  }}
                  value={
                    filters.studentId
                      ? {
                          value: filters.studentId,
                          label:
                            studentListing?.find(
                              (student) => student.id === filters.studentId
                            )?.sname || "Select",
                        }
                      : { value: "", label: "Select" }
                  }
                />
              </div>

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
          .modal-content {
            height: auto !important;
          }
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

           @media screen and (max-width:768px) {
h5.card-title {
font-size: 13px;
}
button.btn.btn-secondary.mr-2 {
font-size: 13px !important;
padding: 5px !important;
}
button.btn.btn-info.text-white.mr-2 {
font-size: 13px !important;
padding: 5px;
}
button.btn.btn-secondary {
font-size: 13px !important;
}
nav.breadcrumb.breadcrumb-dash {
font-size:13px;
}
nav.breadcrumb.breadcrumb-dash {
font-size: 13px;
}
h5.card-title.h6_new {
font-size: 14px !important;
}
button.ml-auto.btn-md.btn.border-0.btn-light.mr-2 {
font-size: 14px !important;
}
button.ml-2.btn-md.btn.border-0.btn-secondary {
font-size: 12px !important;
}
}


button.p-paginator-page.p-paginator-element.p-link.p-paginator-page-start.p-highlight {
font-size: 13px;
padding: 0px !important;
}
.p-paginator {
flex-wrap: no-wrap !important; /* Allow pagination buttons to wrap */
justify-content: center; /* Center pagination controls */
}
.p-paginator .p-dropdown {
width: 70px; /* Adjust dropdown width */
}
.p-dropdown.p-component.p-inputwrapper.p-inputwrapper-filled {
padding: 0px;
height: 31px;
font-size: 13px !important;
}

button.p-paginator-page.p-paginator-element.p-link.p-paginator-page-end.p-highlight {
height: 30px !important;
padding: 0px !important;
margin: 0px !important;
}
span.p-dropdown-label.p-inputtext {
font-size: 13px;
margin-top: 5px;
padding-left: 5px;
}
button.p-paginator-page.p-paginator-element.p-link.p-paginator-page-start.p-highlight {
height: 30px !important;
}
.p-paginator-element {
margin: 0 !important; 
}
button.ml-auto.btn-md.btn.border-0.goBack.mr-2 {
font-size: 14px !important;
}
button.mb-2.mb-md-0.btn.btn-primary {
    font-size: 12px !important;
    margin: 0px !important;
}
        `}
      </style>

    </>
  );
}
export default LeaveRequestList;
