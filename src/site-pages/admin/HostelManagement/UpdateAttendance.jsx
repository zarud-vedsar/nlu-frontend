import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../../node_modules/primeicons/primeicons.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import { FormField } from "../../../site-components/admin/assets/FormField";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import secureLocalStorage from "react-secure-storage";
import useRolePermission from "../../../site-components/admin/useRolePermission";

function UpdateAttendance() {
  const [allotedroomHistory, setAllotedroomHistory] = useState([]);

  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [isFetching, setIsFetching] = useState(false);

  //for filter
  const [block, setBlock] = useState([]);
  const [blockRoomNo, setBlockRoomNo] = useState([]);

  const currentYear = new Date().getFullYear();
  /**
* ROLE & PERMISSION
*/
  const { RolePermission, hasPermission } = useRolePermission();
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Update Hostel Attendance", "update")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */
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

  const availableYears = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  );

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
    block: "",
    roomNo: "",
    year: "",
    studentId: "",
    attendance_date: "",
    attendanceStatus: 1,
    session: localStorage.getItem("session"),

  };

  const [session,setSession] = useState([]);
  const sessionListDropdown = async () => {
    try {
      const { data } = await axios.post(`${NODE_API_URL}/api/session/fetch`, {
        status: 1,
        column: "id, dtitle",
      });
      data?.statusCode === 200 && data.data.length
        ? setSession(data.data) // Populate session list
        : (toast.error("Session not found."), setSession([])); // Error handling
    } catch {
      setSession([]); // Clear list on failure
    }
  };

  const [filters, setFilters] = useState(initializeFilter);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFilters = () => {
    setFilters(initializeFilter);
    handleSubmit();
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

  const handleSubmit = async (applyFilter = false, e = false) => {
    if (e) e.preventDefault();
    let bformData = { listing: "yes" };
    if (applyFilter) {
      bformData = filters;
    }
    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/attendance-record-for-admin`,
        {
          ...bformData,
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        toast.success(response?.data?.message);
        setAllotedroomHistory(response.data.data);
      } else {
        setAllotedroomHistory([]);
      }
    } catch (error) {
      setAllotedroomHistory([]);
      if (
        error?.response?.data?.statusCode === 400 ||
        error?.response?.data?.statusCode === 404 ||
        error?.response?.data?.statusCode === 500
      ) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    handleSubmit();
    fetchStudent();
    fetchDistinctBlock();
    sessionListDropdown();
  }, []);

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
      const loguserid = secureLocalStorage.getItem("login_id");
      const login_type = secureLocalStorage.getItem("loginType");
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/admin/update-attendace-by-admin`,
        {
          login_type,
          loguserid,
          dbId,
          attendanceStatus: newStatus,
        }
      );
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        setAllotedroomHistory((prevList) =>
          prevList.map((item) =>
            item.id === dbId ? { ...item, present: newStatus } : item
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
                    <i className="fas fa-home m-r-5" /> Attendance Management
                  </a>
                  
                  <span className="breadcrumb-item active">
                    Update Hostel Attendance
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Update Hostel Attendance </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/hostel-management/mark-attendance">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus"></i> Mark Attendance
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
                    value={allotedroomHistory}
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
                      body={(row) => capitalizeFirstLetter(row?.enrollmentNo)}
                      header="Enrollment No."
                      field="enrollmentNo"
                      sortable
                    />
                    <Column field="studentId" header="Student ID" sortable />
                    <Column
                      body={(row) => capitalizeFirstLetter(row?.sname)}
                      header="Name"
                      field="sname"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row?.coursename)}
                      header="Course"
                      field="coursename"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row?.semtitle)}
                      header="Semester"
                      field="semtitle"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row?.block)}
                      header="Block"
                      field="block"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row?.roomNo)}
                      header="Room No"
                      field="roomNo"
                      sortable
                    />
                    <Column
                      body={(row) => capitalizeFirstLetter(row?.sphone)}
                      header="Phone Number"
                      field="sphone"
                      sortable
                    />
                    <Column
                      body={(row) => formatDate(row.attendance_date)}
                      header="Attendance Date"
                      field="attendance_date"
                      sortable
                    />
                    <Column
                      field="created_at"
                      body={(row) => formatDate(row.created_at)}
                      header="Created At"
                      sortable
                    />
                    <Column
                      field="created_at"
                      body={(row) => (
                        <>
                          {" "}
                          {row?.present === 1 && (
                            <span className="badge badge-success">Present</span>
                          )}
                          {row?.present !== 1 && (
                            <span className="badge badge-danger">Absent</span>
                          )}{" "}
                        </>
                      )}
                      header="Created At"
                      sortable
                    />
                    <Column
                      body={(row) => (
                        <>
                          {(row?.present === 1 || row?.present === 0) && (
                            <div className="switch mt-2 w-auto mr-2">
                              <input
                                type="checkbox"
                                checked={row.present === 1}
                                onChange={() =>
                                  handleToggleStatus(row.id, row.present)
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
                    =
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
            <div className="col-md-12 col-12 form-group">
                          <label className="font-weight-semibold">
                            Session 
                          </label>
                          <Select
                            options={session?.map(({ id, dtitle }) => ({
                              value: id,
                              label: dtitle,
                            }))}
                            onChange={({ value }) => {
                              setFilters({ ...filters, session: value });
                            }}
                            value={
                              session.find(
                                ({ id }) => id === +filters.session
                              )
                                ? {
                                    value: +filters.session,
                                    label: session.find(
                                      ({ id }) => id === +filters.session
                                    ).dtitle,
                                  }
                                : { value: filters.session, label: "Select" }
                            }
                          />
                        </div>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Attendance Status</Form.Label>
                  <Select
                    value={
                      [
                        { value: 1, label: "Present" },
                        { value: 0, label: "Absent" },
                      ].find((item) => item.value === filters.attendanceStatus)
                        ? {
                          value: filters.attendanceStatus,
                          label: [
                            { value: 1, label: "Present" },
                            { value: 0, label: "Absent" },
                          ].find(
                            (item) => item.value === filters.attendanceStatus
                          ).label,
                        }
                        : { value: filters.attendanceStatus, label: "Select" }
                    }
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        attendanceStatus: e.value,
                      }));
                    }}
                    options={[
                      { value: 1, label: "Present" },
                      { value: 0, label: "Absent" },
                    ]}
                    placeholder="Select Status"
                  />
                </Form.Group>
              </Col>

              <div className="col-md-12 col-12 form-group">
                <label className="font-weight-semibold">
                  Select Student
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
                            (student) =>
                              student.id === filters.studentId
                          )?.sname || "Select",
                      }
                      : { value: "", label: "Select" }
                  }
                />
              </div>

              <div className="col-md-12  form-group">
                <label className="font-weight-semibold">Select Year</label>
                <Select
                  options={availableYears.map((year) => ({
                    value: year,
                    label: year.toString(),
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      year: selectedOption.value,
                    });
                  }}
                  value={
                    availableYears.includes(filters.year)
                      ? { value: filters.year, label: filters.year.toString() }
                      : { value: "", label: "Select" }
                  }
                />
              </div>

              <div className="col-md-12  form-group">
                <label className="font-weight-semibold">Block</label>
                <Select
                  options={block.map((item) => ({
                    value: item.block,
                    label: item.block,
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      block: selectedOption.value,
                    });
                    fetchRoomNoBasedOnBlock(selectedOption.value);
                  }}
                  value={
                    block.find((item) => item.block === filters.block)
                      ? {
                        value: filters.block,
                        label: block.find(
                          (item) => item.block === filters.block
                        ).block,
                      }
                      : { value: filters.block, label: "Select" }
                  }
                />
              </div>
              <div className="col-md-12 form-group">
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

              <FormField
                label="Attendance Date"
                name="attendance_date"
                id="attendance_date"
                type="date"
                value={filters.attendance_date}
                onChange={handleChange}
                column="col-md-12"
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
export default UpdateAttendance;
