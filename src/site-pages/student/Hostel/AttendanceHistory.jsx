import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { goBack } from "../../../site-components/Helper/HelperFunction";

import "../../../../node_modules/primeicons/primeicons.css";
import axios from "axios";

import secureLocalStorage from "react-secure-storage";

function AttendanceHistory() {
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const initializeFilter = {
    year: new Date().getFullYear(),
    studentId: secureLocalStorage.getItem("studentId"),
  };

  const [filters, setFilters] = useState(initializeFilter);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: 6 },
    (_, index) => currentYear - index
  );

  useEffect(() => {
    handleSubmit();
  }, [filters]);

  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();

    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/attendance-record-for-student`,
        {
          ...filters,
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        toast.success(response?.data?.message);
        generateCompleteAttendance(response.data.data);
      } else {
        setAttendanceHistory([]);
      }
      setIsFetching(false);
    } catch (error) {
      setAttendanceHistory([]);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, []);

  function generateCompleteAttendance(attendanceData) {
    setAttendanceHistory([]);
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

      if (year != filters?.year) return;
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
        let absentCount = 0;

        let studentRecord = {
          studentId: months.studentId,
          enrollmentNo: months.enrollmentNo,
          sname: months.sname,
          attendance: new Array(daysInMonth[m - 1]).fill(null).map((_, i) => {
            const attendanceData =
              months[m] && months[m][i]
                ? months[m][i]
                : { year: filters?.year, month: m, day: i + 1, present: 2 };

            if (attendanceData.present == 1) {
              presentCount++;
            }
            if (attendanceData.present == 0) {
              absentCount++;
            }

            return attendanceData;
          }),
          presentCount: presentCount,
          absentCount: absentCount,
        };

        monthAttendance.students.push(studentRecord);
      });

      finalAttendance.push(monthAttendance);
    }
    setAttendanceHistory(finalAttendance);
  }

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
                  <a className="breadcrumb-item">Alloted Room</a>
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
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* Search Box */}
                <div className="row">
                  <div className="col-md-10 col-lg-10 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                    <div className="mb-3 d-flex align-items-center">
                      <label className="form-label mr-2" style={{ width: "auto" }}>
                        Select Year
                      </label>
                      <select
                        className="selectpicker form-control"
                        id="yearPicker"
                        value={filters.year}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            year: e.target.value,
                          }))
                        }
                        style={{ width: "auto" }}
                      >
                        {availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
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
                                <p className="text-dark">{month.month}</p>
                                <table className="mb-5">
                                  <thead>
                                    <tr>
                                      {month?.students[0]?.attendance?.map(
                                        (day) => (
                                          <th key={day.dat} scope="col">
                                            {day.day}
                                          </th>
                                        )
                                      )}
                                      <th scope="col" style={{ backgroundColor: "rgb(231 227 227)", paddingLeft: "10px" }}>T-P</th>
                                      <th scope="col" style={{ backgroundColor: "rgb(231 227 227)", paddingRight: "10px" }}>T-A</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {month?.students.map((student, index) => (
                                      <tr key={index}>
                                        {student?.attendance.map(
                                          (day, index) => (
                                            <td key={index}>
                                              {day && (
                                                <>
                                                  {day?.present == 1 && (
                                                    <span className="badge badge-success">
                                                      P
                                                    </span>
                                                  )}
                                                  {day?.present == 0 && (
                                                    <span className="badge badge-danger">
                                                      A
                                                    </span>
                                                  )}
                                                  {day?.present == 2 && (
                                                    <span className="badge badge-light">
                                                      N
                                                    </span>
                                                  )}
                                                </>
                                              )}
                                            </td>
                                          )
                                        )}
                                        <td className="text-center" style={{ backgroundColor: "rgb(231 227 227)", paddingLeft: "10px" }}>{student?.presentCount}</td>
                                        <td className="text-center" style={{ backgroundColor: "rgb(231 227 227)", paddingRight: "10px" }}>{student?.absentCount}</td>
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
                      filters?.year && (
                        <span className="text-danger">Data Not Available</span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
export default AttendanceHistory;
