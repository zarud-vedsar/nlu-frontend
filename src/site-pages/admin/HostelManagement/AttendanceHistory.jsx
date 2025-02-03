import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { goBack } from "../../../site-components/Helper/HelperFunction";
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios, { all } from "axios";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";
import useRolePermission from "../../../site-components/admin/useRolePermission";

function AttendanceHIstory() {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [studentListing, setStudentListing] = useState([]);

  const [isFetching, setIsFetching] = useState(false);
  //for filter
  const [block, setBlock] = useState([]);
  const [blockRoomNo, setBlockRoomNo] = useState([]);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  );
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  /**
* ROLE & PERMISSION
*/
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Hostel Attendance History", "list")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */
  const initializeFilter = {
    block: "",
    roomNo: "",
    year: new Date().getFullYear(),
    month: "",
    studentId: "",
    session: localStorage.getItem("session")

  };

  // Fetch and set the session list for the dropdown
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
  const [filterMonth, setFilterMonth] = useState();
  const [filterYear, setFilterYear] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFilters = () => {
    setFilters(initializeFilter);
    handleSubmit();
  };

  const applyFilters = () => {
    setFilterMonth(filters.month);
    setFilterYear(filters.year);
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
  const fetchStudentBasedOnBlock = async (block) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/student-detail/get-student-based-on-block`,
        {
          block,
          approved: 1,
        }
      );
      setStudentListing(response?.data);
      if (response?.statusCode === 200 && response.data.length > 0) {
        return null;
      } else {
        toast.error("Data not found.");
        return [];
      }
    } catch (error) {
      return [];
    }
  };
  function generateCompleteAttendance(attendanceData) {
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let isLeapYear =
      (filters?.year % 4 === 0 && filters?.year % 100 !== 0) ||
      filters?.year % 400 === 0;
    if (isLeapYear) {
      daysInMonth[1] = 29;
    }

    let studentAttendanceMap = new Map();

    attendanceData.forEach((record) => {
      let date = new Date(record.attendance_date);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (year !== filters?.year) return;

      if (!studentAttendanceMap.has(record.studentId)) {
        studentAttendanceMap.set(record.studentId, {
          sname: record.sname,
          enrollmentNo: record.enrollmentNo,
          studentId: record.studentId,
        });
      }

      if (!studentAttendanceMap.get(record.studentId)[month]) {
        studentAttendanceMap.get(record.studentId)[month] = new Array(
          daysInMonth[month - 1]
        ).fill(null);
      }

      studentAttendanceMap.get(record.studentId)[month][day - 1] = {
        year,
        month,
        day,
        present: 0,
        ...record,
      };
    });

    let finalAttendance = [];

    let monthsList = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (let m = 1; m <= 12; m++) {
      if (filters?.month && m !== filters?.month) continue;

      let monthAttendance = {
        month: monthsList[m - 1],
        students: [],
      };
      studentAttendanceMap.forEach((months) => {
        let presentCount = 0;

        let studentRecord = {
          studentId: months.studentId,
          enrollmentNo: months.enrollmentNo,
          sname: months.sname,
          attendance: new Array(daysInMonth[m - 1]).fill(null).map((_, i) => {
            const attendanceData =
              months[m] && months[m][i]
                ? months[m][i]
                : { year: filters?.year, month: m, day: i + 1, present: 0 };

            if (attendanceData.present) {
              presentCount++;
            }

            return attendanceData;
          }),
          presentCount: presentCount,
          absentCount: daysInMonth[m - 1] - presentCount,
        };

        monthAttendance.students.push(studentRecord);
      });

      finalAttendance.push(monthAttendance);
    }
    console.log(finalAttendance);
    setAttendanceHistory(finalAttendance);
  }

  const selectedStudent = studentListing?.find(
    (student) => student.id === filters?.studentId
  );

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
      console.log(response)
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        toast.success(response?.data?.message);
        generateCompleteAttendance(response.data.data);
      } else {
        setAttendanceHistory([]);
      }
    } catch (error) {
      setAttendanceHistory([]);
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
    fetchDistinctBlock();
    sessionListDropdown();

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
                  <a className="breadcrumb-item">Hostel Management</a>
                  <span className="breadcrumb-item active">
                    Attendance History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Attendance History</h5>
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
                      <FaFilter /> Filter
                    </span>
                  </Button>
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
                {attendanceHistory.length > 0 && (
                  <div className={`table-responsive`}>
                    {filters?.year && (
                      <>
                        {attendanceHistory?.map((month, index) => (
                          <div key={index}>
                            <p className="text-dark">
                              {filterYear} {month.month}
                            </p>
                            <table className="mb-5">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Info</th>
                                  {month?.students[0]?.attendance?.map(
                                    (day) => (
                                      <th key={day.dat} scope="col">
                                        {day.day}
                                      </th>
                                    )
                                  )}
                                  <th scope="col">T-P</th>
                                  <th scope="col">T-A</th>
                                </tr>
                              </thead>
                              <tbody>
                                {month?.students.map((student, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {student.sname} <br />
                                      {student.enrollmentNo}
                                    </td>
                                    {student?.attendance.map((day, index) => (
                                      <td key={index}>
                                        {day ? (
                                          day.present ? (
                                            <span className="badge badge-success">
                                              P
                                            </span>
                                          ) : (
                                            <span className="badge badge-danger">
                                              A
                                            </span>
                                          )
                                        ) : (
                                          <span className="badge badge-danger">
                                            A
                                          </span>
                                        )}
                                      </td>
                                    ))}
                                    <td>{student?.presentCount}</td>
                                    <td>{student?.absentCount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
                {!(attendanceHistory && attendanceHistory.length > 0) &&
                  (!filters.block || !filters.roomNo) && (
                    <span className="text-danger">
                      Provide Block, Room No And Year in filter
                    </span>
                  )}
                {!(attendanceHistory && attendanceHistory.length > 0) &&
                  filters.block &&
                  filters.roomNo && (
                    <span className="text-danger">Data Not Available</span>
                  )}
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
                    fetchStudentBasedOnBlock(selectedOption.value);
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
                <label className="font-weight-semibold">Select Month</label>
                <Select
                  options={months.map((month) => month)}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      month: selectedOption.value,
                    });
                  }}
                  value={
                    months.find((month) => month.value === filters?.month)
                      ? {
                        value: filters?.month,
                        label: months.find(
                          (month) => month.value === filters?.month
                        ).label,
                      }
                      : { value: filters.month, label: "Select" }
                  }
                />
              </div>
              <div className="col-md-12 form-group">
                <label className="font-weight-semibold">Select Student</label>
                <Select
                  options={studentListing?.map((student) => ({
                    value: student?.id,
                    label: `${student?.sname} (${student?.enrollmentNo})`,
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      studentId: selectedOption.value,
                    });
                  }}
                  value={
                    selectedStudent
                      ? {
                        value: selectedStudent.id,
                        label: `${selectedStudent.sname} (${selectedStudent.enrollmentNo})`,
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
          td,
          th {
            padding: 4px;
          }
        `}
      </style>
    </>
  );
}
export default AttendanceHIstory;
