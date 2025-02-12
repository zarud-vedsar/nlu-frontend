import React, { useEffect, useState } from "react";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../site-components/Helper/Constant";
import { goBack } from "../../../site-components/Helper/HelperFunction";
import Select from "react-select";

import "../../../../node_modules/primeicons/primeicons.css";
import axios from "axios";

import secureLocalStorage from "react-secure-storage";

function ClassAttendanceHistory() {
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [isFetching, setIsFetching] = useState(false);
  const [currentCourseDetail, setCurrentCourseDetail] = useState();
  const [subjectList, setSubjectList] = useState([]);
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
  const yearOptions = availableYears.map((year) => ({
    label: year,
    value: year,
  }));

  useEffect(() => {
    handleSubmit();
  }, [filters]);

  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();
    setIsFetching(true);
    try {
      const response = await axios.post(
        `${PHP_API_URL}/student_attendance.php`,
        {
          ...filters,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 200 && response.data.data.length > 0) {
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
  const getAllStudentSubject = async () => {
    setIsFetching(true);

    try {
      const bformData = new FormData();
      bformData.append("data", "getStSubjects");
      bformData.append("selectedcourse", currentCourseDetail?.id);

      const response = await axios.post(
        `${PHP_API_URL}/StudentSet.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 200 && response.data.data.length > 0) {
        setSubjectList(response.data.data);
      } else {
        setSubjectList([]);
      }
      setIsFetching(false);
    } catch (error) {
      setSubjectList([]);
      setIsFetching(false);
    }
  };

  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = secureLocalStorage.getItem("studentId");
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetch`,
        formData
      );

      if (
        response.data?.statusCode === 200 &&
        response?.data?.data[0]?.approved
      ) {
        setCurrentCourseDetail(response?.data?.data[0]);
        setFilters((prev) => ({
          ...prev,
          data: "view_self_attendence",
          session: response?.data?.data[0]?.session,
          course_id: response?.data?.data[0]?.courseid,
          semester_id: response?.data?.data[0]?.semesterid,
          subject_id: response?.data?.data[0]?.subject1,
        }));
      }
      //bformData("month", currentCourseDetail?. optional
    } catch (error) {}
  };
  useEffect(() => {
    handleSubmit();
    getAllStudentSubject();
  }, [currentCourseDetail]);
  useEffect(() => {
    getStudentSelectedCourse();
  }, []);

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
      let date = new Date(record.date);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (year != filters?.year) return;

      if (!studentAttendanceMap.has(record.student_id)) {
        studentAttendanceMap.set(record.student_id, {
          sname: record.sname,
          enrollmentNo: record.enrollmentNo,
          student_id: record.student_id,
        });
      }

      if (!studentAttendanceMap.get(record.student_id)[month]) {
        studentAttendanceMap.get(record.student_id)[month] = new Array(
          daysInMonth[month - 1]
        ).fill(null);
      }

      studentAttendanceMap.get(record.student_id)[month][day - 1] = {
        year,
        month,
        day,
        attendance: "A",
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
        let onDutyCount = 0;
        let absentCount = 0;
        let studentRecord = {
          studentId: months.studentId,
          enrollmentNo: months.enrollmentNo,
          sname: months.sname,
          attendance: new Array(daysInMonth[m - 1]).fill(null).map((_, i) => {
            const attendanceData =
              months[m] && months[m][i]
                ? months[m][i]
                : {
                    year: filters?.year,
                    month: m,
                    day: i + 1,
                    attendance: "N",
                  };

            if (attendanceData.attendance === "P") {
              presentCount++;
            }
            if (attendanceData.attendance === "A") {
              absentCount++;
            }
            if (attendanceData.attendance === "OD") {
              onDutyCount++;
            }

            return attendanceData;
          }),

          presentCount: presentCount,
          onDutyCount: onDutyCount,
          absentCount: absentCount,
          totalClass: presentCount + absentCount + onDutyCount,
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
                  <a className="breadcrumb-item">Attendance</a>
                  <span className="breadcrumb-item active">
                    Class Attendance History
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
                  <div className="col-md-2  form-group">
                    <label className="font-weight-semibold">Select Year</label>
                    <Select
                      options={yearOptions}
                      onChange={(selectedOption) => {
                        setFilters({
                          ...filters,
                          year: selectedOption.value,
                        });
                      }}
                      value={
                        yearOptions.find(
                          (option) => option.value === filters?.year
                        ) || { value: filters?.year, label: "Select" }
                      }
                    />
                  </div>

                  <div className="col-md-4  form-group">
                    <label className="font-weight-semibold">
                      Select Subject
                    </label>

                    <Select
                      options={subjectList.map((subject) => ({
                        label: subject?.name,
                        value: subject?.id,
                      }))}
                      onChange={(selectedOption) => {
                        setFilters({
                          ...filters,
                          subject_id: selectedOption?.value,
                        });
                      }}
                      value={
                        subjectList.some(
                          (subject) => subject?.id === filters?.subject_id
                        )
                          ? {
                              value: filters?.subject_id,
                              label: subjectList?.find(
                                (subject) => subject?.id === filters?.subject_id
                              )?.name,
                            }
                          : { value: filters?.subject_id, label: "Select" }
                      }
                    />
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
                                                                            <th scope="col" style={{backgroundColor:"rgb(231 227 227)" , paddingLeft:"10px"}}>Class</th>

                                      <th scope="col" style={{backgroundColor:"rgb(231 227 227)"}}>T-P</th>
                                      <th scope="col" style={{backgroundColor:"rgb(231 227 227)"}}>T-OD</th>
                                      <th scope="col" style={{backgroundColor:"rgb(231 227 227)" , paddingRight:"10px"}}>T-A</th>
                                      
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {month?.students.map((student, index) => (
                                      <tr key={index}>
                                        {student?.attendance.map(
                                          (day, index) => (
                                            <td key={index}>
                                              {day.attendance === "P" && (
                                                <span className="badge badge-success">
                                                  P
                                                </span>
                                              )}

                                              {day.attendance === "OD" && (
                                                <span className="badge badge-warning">
                                                  OD
                                                </span>
                                              )}

                                              {day.attendance === "A" && (
                                                <span className="badge badge-danger">
                                                  A
                                                </span>
                                              )}
                                              {day.attendance === "N" && (
                                                <span className="badge badge-light">
                                                  N
                                                </span>
                                              )}
                                            </td>
                                          )
                                        )}
                                        <td className="text-center" style={{backgroundColor:"rgb(231 227 227)" , paddingLeft:"10px"}}>{student?.totalClass}</td>
                                        <td className="text-center" style={{backgroundColor:"rgb(231 227 227)"}}>{student?.presentCount}</td>
                                        <td className="text-center" style={{backgroundColor:"rgb(231 227 227)"}}>{student?.onDutyCount}</td>
                                        <td className="text-center" style={{backgroundColor:"rgb(231 227 227)" , paddingRight:"10px"}}>{student?.absentCount}</td>
                                       
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
export default ClassAttendanceHistory;
