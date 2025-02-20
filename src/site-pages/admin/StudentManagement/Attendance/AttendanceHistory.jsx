import React, { useEffect, useState } from "react";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { goBack } from "../../../../site-components/Helper/HelperFunction";
import "../../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import { dataFetchingPost } from "../../../../site-components/Helper/HelperFunction";
import { capitalizeFirstLetter } from "../../../../site-components/Helper/HelperFunction";
import secureLocalStorage from "react-secure-storage";
import useRolePermission from "../../../../site-components/admin/useRolePermission";

function AttendanceHIstory() {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [studentListing, setStudentListing] = useState([]);
  const [courseListing, setCourseListing] = useState([]);
  const [semesterListing, setSemesterListing] = useState([]);
  const [subjectListing, setSubjectListing] = useState([]);

  const [isFetching, setIsFetching] = useState(false);
  const session = localStorage.getItem("session");
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

  const initializeFilter = {
    course_id: "",
    semester_id: "",
    subject_id: "",
    year: new Date().getFullYear(),
    month: "",
    studentId: "",
    session:session,
  };

  const [filters, setFilters] = useState(initializeFilter);
 
  const [filterYear, setFilterYear] = useState(null);
  const [dataAvailable,setDataAvailable] = useState("not fetched yet");
  /**
* ROLE & PERMISSION
*/
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Class Attendance History", "list")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFilters = () => {
    setDataAvailable("not fetched yet");
    setFilters(initializeFilter);
    
    
  };

  const applyFilters = () => {
    
    setFilterYear(filters?.year);
    handleSubmit(true, false);
  };

  // Fetch and set the session list for the dropdown
  const [SessionList,setSessionList] = useState([]);
  const sessionListDropdown = async () => {
    try {
      const { data } = await axios.post(`${NODE_API_URL}/api/session/fetch`, {
        status: 1,
        column: "id, dtitle",
      });
      data?.statusCode === 200 && data.data.length
        ? setSessionList(data.data) // Populate session list
        : (toast.error("Session not found."), setSessionList([])); // Error handling
    } catch {
      setSessionList([]); // Clear list on failure
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
  const fetchSubjectBasedOnCourseAndSemeter = async (courseid, semesterid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          column: "id, subject",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSubjectListing(response.data);
      } else {
        toast.error("Semester not found.");
        setSubjectListing([]);
      }
    } catch (error) {
      setSubjectListing([]);
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
  useEffect(() => {
    courseListDropdown();
    sessionListDropdown();
  }, []);

  const fetchSemesterBasedOnCourse = async (courseid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await axios.post(`${NODE_API_URL}/api/semester/fetch`, {
        courseid: courseid,
        column: "id, semtitle",
      });
      if (
        response?.data?.statusCode === 200 &&
        response?.data?.data.length > 0
      ) {
        setSemesterListing(response?.data?.data);
      } else {
        toast.error("Semester not found.");
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
    }
  };

  
  const fetchStudentBasedOnCourseAndSemester = async (courseid, semesterid) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/student-detail/get-student-based-on-course-and-semester`,
        {
          courseid,
          semesterid,
          approved: 1,
          session
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setStudentListing(response?.data);
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
      let date = new Date(record.date);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (year !== filters?.year) return;

      if (!studentAttendanceMap.has(record.student_id)) {
        studentAttendanceMap.set(record.student_id, { sname: record.sname, enrollmentNo: record.enrollmentNo, student_id: record.student_id });

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
                : { year: filters?.year, month: m, day: i + 1, attendance: "N" };

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

  const selectedStudent = studentListing?.find(
    (student) => student.id === filters?.studentId
  );

  const handleSubmit = async (applyFilter = false, e = false) => {
    if (e) e.preventDefault() ;

    setIsFetching(true);
    if(!filters.session){
      toast.error("Session is required");
      return setIsFetching(false);
    }
    if(!filters.course_id){
      toast.error("Course is required");
      return setIsFetching(false);
    }
    if(!filters.semester_id){
      toast.error("Semester is required");
      return setIsFetching(false);
    }
    if(!filters.subject_id){
      toast.error("Subject is required");
      return setIsFetching(false);
    }

    try {
      let bformData = new FormData();

      if (applyFilter) {
        Object.keys(filters).forEach((key) => {
          const value = filters[key];
          if (value !== "") {
            bformData.append(key, value);
          }
        });
      }

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "view_student_attendence");


      const response = await axios.post(
        `${PHP_API_URL}/student_attendance.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (response.data?.status === 200 && response.data.data.length > 0) {
        toast.success(response?.data?.msg);
        generateCompleteAttendance(response?.data?.data)
        setDataAvailable("data fetched")
      } else {
          setDataAvailable("data not available");
        
        setAttendanceHistory([]);
      }
    } catch (error) {
      setAttendanceHistory([]);
      setDataAvailable("data not available");
      if (
        error?.response?.data?.status === 400 ||
        error?.response?.data?.status === 404 ||
        error?.response?.data?.status === 500
      ) {
        toast.error(error?.response?.data?.msg);
      }
    } finally {
      setIsFetching(false);
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
                <a href="/admin/" className="breadcrumb-item">
                                     <i className="fas fa-home m-r-5" />
                                    Dashboard
                                   </a>
                                   <span className="breadcrumb-item active">
                                   Attendance Management
                                   </span>
                  
                  <span className="breadcrumb-item active">
                    Class Attendance History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new pt-2">Class Attendance History</h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 goBack"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>

                  <Button
                    variant="primary"
                    className="ml-2  mb-md-0"
                    onClick={handleShow}
                  >
                    <span>
                      <FaFilter /> 
                    </span>
                  </Button>
                  <Link to="/admin/student-management/mark-attendance">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus"></i> Mark Attendance
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                {attendanceHistory.length > 0 && dataAvailable === "data fetched" && (
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
                               {/* {[...Array(31 - (month?.students[0]?.attendance?.length || 0))].map((_, index) => (
  <th key={index} scope="col">
    {index + 1} 
  </th>
))} */}

                                  <th scope="col" style={{backgroundColor:"rgb(231 227 227)" , paddingLeft:"10px"}}>Class</th>
                                  <th scope="col"  style={{backgroundColor:"rgb(231 227 227)"}}>T-P</th>
                                  <th scope="col"  style={{backgroundColor:"rgb(231 227 227)"}}>T-OD</th>
                                  <th scope="col"  style={{backgroundColor:"rgb(231 227 227)",paddingRight:"10px"}}>T-A</th>

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

                                    ))}
                                    <td className="text-center" style={{backgroundColor:"rgb(231 227 227)" , paddingLeft:"10px"}} >{student?.totalClass}</td>
                                    <td className="text-center" style={{backgroundColor:"rgb(231 227 227)" }} >{student?.presentCount}</td>
                                    <td className="text-center" style={{backgroundColor:"rgb(231 227 227)" }}>{student?.onDutyCount}</td>

                                    <td className="text-center" style={{backgroundColor:"rgb(231 227 227)",paddingRight:"10px" }}>{student?.absentCount}</td>
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
                { dataAvailable == "not fetched yet" && (
                    <span className="text-danger">
                      Provide Session , Course , Semester , Subject And Year in filter
                    </span>
                  )}
                { dataAvailable === "data not available" && (
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
        <Modal.Body style={{overflow:"auto"}}>
          <Form id="filteruserlist">
            <Row>

            <div className="col-md-12 col-12 form-group">
                          <label className="font-weight-semibold">
                            Session <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={SessionList?.map(({ id, dtitle }) => ({
                              value: id,
                              label: dtitle,
                            }))}
                            onChange={({ value }) => {
                              setFilters({ ...filters, session: value });
                            }}
                            value={
                              SessionList.find(
                                ({ id }) => id === +filters.session
                              )
                                ? {
                                    value: +filters.session,
                                    label: SessionList.find(
                                      ({ id }) => id === +filters.session
                                    ).dtitle,
                                  }
                                : { value: filters.session, label: "Select" }
                            }
                          />
                        </div>

                        <div className="col-md-12 col-12 form-group">
                          <label className="font-weight-semibold">
                          Course <span className="text-danger">*</span>
                          </label>
              
                  <Select
                    options={courseListing.map((item) => ({
                      value: item.id,
                      label: item.coursename,
                    }))}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        course_id: selectedOption.value,
                      });

                      fetchSemesterBasedOnCourse(selectedOption.value);
                    }}
                    value={
                      courseListing.find(
                        (item) => item.id === parseInt(filters.course_id)
                      )
                        ? {
                          value: parseInt(filters.course_id),
                          label: courseListing.find(
                            (item) => item.id === parseInt(filters.course_id)
                          ).coursename,
                        }
                        : { value: filters.course_id, label: "Select" }
                    }
                  />
                </div>
                <div className="col-md-12 col-12 form-group">
                          <label className="font-weight-semibold">
                          Semester <span className="text-danger">*</span>
                          </label>
           
                  <Select
                    options={semesterListing.map((item) => ({
                      value: item.id,
                      label: capitalizeFirstLetter(item.semtitle),
                    }))}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        semester_id: selectedOption.value,
                      });
                      fetchStudentBasedOnCourseAndSemester(
                        filters.course_id,
                        selectedOption.value
                      );
                      fetchSubjectBasedOnCourseAndSemeter(
                        filters.course_id,
                        selectedOption.value
                      );
                    }}
                    value={
                      semesterListing.find(
                        (item) => item.id === filters.semester_id
                      )
                        ? {
                          value: filters.semester_id,
                          label: capitalizeFirstLetter(
                            semesterListing.find(
                              (item) => item.id === filters.semester_id
                            ).semtitle
                          ),
                        }
                        : {
                          value: filters.semester_id,
                          label: "Select",
                        }
                    }
                  />
                </div>
              
              <div className="col-md-12 col-12 form-group">
                <label className="font-weight-semibold" htmlFor="subject_id">
                  Subject  <span className="text-danger">*</span>
                </label>
                <Select
                  id="subject_id"
                  options={subjectListing.map((item) => ({
                    value: item.id,
                    label: capitalizeFirstLetter(item.subject),
                  }))}
                  onChange={(selectedOption) => {
                    setFilters({
                      ...filters,
                      subject_id: selectedOption.value,
                    });
                  }}
                  value={
                    subjectListing.find(
                      (item) => item.id === filters.subject_id
                    )
                      ? {
                        value: filters.subject_id,
                        label: capitalizeFirstLetter(
                          subjectListing.find(
                            (item) => item.id === filters.subject_id
                          ).subject
                        ),
                      }
                      : {
                        value: filters.subject_id,
                        label: "Select",
                      }
                  }
                />
              </div>
              <div className="col-md-12  form-group">
                <label className="font-weight-semibold">Select Year <span className="text-danger">*</span></label>
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
                    availableYears.includes(filters?.year)
                      ? { value: filters?.year, label: filters?.year.toString() }
                      : { value: "", label: "Select" }
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
