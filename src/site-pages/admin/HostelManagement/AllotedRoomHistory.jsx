import React, { useEffect, useState } from "react";
import { FILE_API_URL, NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import { FormField } from "../../../site-components/admin/assets/FormField";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
function AllotedRoomHistory() {
  const navigate = useNavigate();
  const [allotedroomHistory, setAllotedroomHistory] = useState([]);

  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [isFetching, setIsFetching] = useState(false);
  const [courseListing, setCourseListing] = useState([]);
  const [semesterListing, setSemesterListing] = useState([]);
  const [semesterListingBasedOnCourse, setSemesterListingBasedOnCourse] =
    useState([]);

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
    block: "",
    roomNo: "",
    courseid: "",
    semesterid: "",
    allotDate: "",
    studentId: "",
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

  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/update-allot-room/${dbId}`, { replace: false });
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
        `${NODE_API_URL}/api/hostel-management/admin/room-allotment-fetch-filter`,
        {
          ...bformData,
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setAllotedroomHistory(response.data.data);
      } else {
        setAllotedroomHistory([]);
      }
      setIsFetching(false);
    } catch (error) {
      setAllotedroomHistory([]);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    handleSubmit();
    fetchDistinctBlock();
    courseListDropdown();
    fetchSemesterListing();
    fetchStudent()
  }, []);

  const [studentListing, setStudentListing] = useState([])
  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `${NODE_API_URL}/api/student-detail/get-student`
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

  const courseListDropdown = async () => {
    try {
      const response = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setCourseListing(response.data.data);
      } else {
        toast.error("Course not found.");
        setCourseListing([]);
      }
    } catch (error) {
      setCourseListing([]);
    }
  };

  const fetchSemesterListing = async (deleteStatus = 0) => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          deleteStatus,
          listing: "yes",
        }
      );

      if (response?.statusCode === 200 && response.data.length > 0) {
        setSemesterListing(response.data);
      } else {
        toast.error("Data not found.");
        setSemesterListing([]);
      }
    } catch (error) {
      setSemesterListing([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
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

  const fetchSemesterBasedOnCourse = async (courseid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          courseid: courseid,
          column: "id, semtitle",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSemesterListingBasedOnCourse(response.data);
      } else {
        toast.error("Semester not found.");
        setSemesterListingBasedOnCourse([]);
      }
    } catch (error) {
      setSemesterListingBasedOnCourse([]);
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
                  <span className="breadcrumb-item">Hostel Management</span>
                  <span className="breadcrumb-item active">
                    Alloted Room History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Alloted Room History</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/allot-room">
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
                            <div className="info-name">
                              <span>{`${rowData.sname}`}</span>
                            </div>

                            <div className="info-email">
                              <span>Enroll : {rowData.enrollmentNo}</span>
                            </div>

                          </div>
                        </div>
                      )}
                      sortable
                    />
                    <Column field="block" header="Block" sortable />
                    <Column field="roomNo" header="Room No" sortable />

                    <Column
                      body={(row) =>
                        courseListing?.find(
                          (item) => item.id === parseInt(row?.courseid)
                        )
                          ? courseListing?.find(
                            (item) => item.id === parseInt(row.courseid)
                          ).coursename
                          : " "
                      }
                      header="Course"
                      sortable
                    />
                    <Column
                      body={(row) =>
                        semesterListing?.find(
                          (item) => item.id === parseInt(row?.semesterid)
                        )
                          ? semesterListing?.find(
                            (item) => item.id === parseInt(row.semesterid)
                          ).semtitle
                          : " "
                      }
                      header="Semester"
                      sortable
                    />

                    <Column
                      body={(row) => formatDate(row.allotDate)}
                      header="Alloted Date"
                      sortable
                    />

                    <Column
                      field="created_at"
                      body={(row) => formatDate(row.created_at)}
                      header="Created At"
                      sortable
                    />

                    <Column
                      header="Vacate"
                      body={(rowData) => (
                        <div className="d-flex">
                          {rowData?.vacate_date ? formatDate(rowData?.vacate_date) :

                            <Link
                              to={`/admin/update-vacate-date/${rowData.id}`}
                              className="avatar avatar-icon avatar-md avatar-orange"
                            >
                              <i className="fa-solid fa-right-from-bracket"></i>
                            </Link>
                          } </div>
                      )}
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
              <div className="col-md-12 form-group">
                <label className="font-weight-semibold">Course</label>
                <Select
                  options={courseListing?.map((item) => ({
                    value: item.id,
                    label: item.coursename,
                    year: item.duration,
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      courseid: selectedOption.value,
                    });
                    const year = selectedOption.year
                      ? selectedOption.year.split(",")
                      : [];
                    fetchSemesterBasedOnCourse(selectedOption.value);
                  }}
                  value={
                    courseListing?.find(
                      (item) => item.id === parseInt(filters.courseid)
                    )
                      ? {
                        value: parseInt(filters.courseid),
                        label: courseListing?.find(
                          (item) => item.id === parseInt(filters.courseid)
                        ).coursename,
                      }
                      : { value: filters.courseid, label: "Select" }
                  }
                />
              </div>

              <div className="col-md-12 form-group">
                <label className="font-weight-semibold">Semester</label>
                <Select
                  options={semesterListingBasedOnCourse.map((item) => ({
                    value: item.id,
                    label: capitalizeFirstLetter(item.semtitle),
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      semesterid: selectedOption.value,
                    });
                  }}
                  value={
                    semesterListingBasedOnCourse.find(
                      (item) => item.id === filters.semesterid
                    )
                      ? {
                        value: filters.semesterid,
                        label: capitalizeFirstLetter(
                          semesterListingBasedOnCourse.find(
                            (item) => item.id === filters.semesterid
                          ).semtitle
                        ),
                      }
                      : {
                        value: filters.semesterid,
                        label: "Select",
                      }
                  }
                />
              </div>

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

              {/* Visit Date */}
              <FormField
                label="Alloted Date"
                name="allotDate"
                id="allotDate"
                type="date"
                value={filters.allotDate}
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
export default AllotedRoomHistory;
