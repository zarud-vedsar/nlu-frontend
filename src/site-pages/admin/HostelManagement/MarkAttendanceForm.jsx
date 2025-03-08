import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  dataFetchingPost,
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { FormField } from "../../../site-components/admin/assets/FormField";
import {
  FILE_API_URL,
  NODE_API_URL,
} from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Select from "react-select";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import useRolePermission from "../../../site-components/admin/useRolePermission";
function MarkAttendanceForm() {
  const initialData = {
    block: "",
    roomNo: "",
    roomId: "",
    date: new Date().toISOString().split("T")[0],
  };
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [block, setBlock] = useState([]);
  const [blockRoomNo, setBlockRoomNo] = useState([]);

  const [studentListWithAttendance, setStudentListWithAttendance] = useState(
    []
  );

  /**
   * ROLE & PERMISSION
   */
  const { RolePermission, hasPermission } = useRolePermission();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Mark Hostel Attendance", "list")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
  /**
   * THE END OF ROLE & PERMISSION
   */

  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };

  const loadStudent = async (e = false) => {
    if (e) e.preventDefault();
    setIsSubmit(true);

    if (!formData.block) {
      errorMsg("block", "Block is required.");
      toast.error("Block is required.");
      return setIsSubmit(false);
    }
    if (!formData.roomNo) {
      errorMsg("roomNo", "Room is required.");
      toast.error("Room is required.");
      return setIsSubmit(false);
    }

    if (!formData.date) {
      errorMsg("date", "Visit In Date is required.");
      toast.error("Visit In Date is required.");
      return setIsSubmit(false);
    }

    errorMsg("", "");

    try {
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      // submit to the API here
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/admin/student-list`,
        formData
      );

      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);

        setStudentListWithAttendance(
          response?.data?.data.map((student) => ({
            ...student,
            date: formData?.date,
          }))
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      setStudentListWithAttendance([]);
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (
        statusCode === 400 ||
        statusCode === 403 ||
        statusCode === 404 ||
        statusCode === 409 ||
        statusCode === 500
      ) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
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
  const handleSubmit = async () => {
    setIsSubmit(true);
  
    if (!formData.block) {
      errorMsg("block", "Block is required.");
      toast.error("Block is required.");
      return setIsSubmit(false);
    }
    if (!formData.roomNo || !formData.roomId) {
      errorMsg("roomNo", "Room is required.");
      toast.error("Room is required.");
      return setIsSubmit(false);
    }

    if (!formData.date) {
      errorMsg("date", "Visit In Date is required.");
      toast.error("Visit In Date is required.");
      return setIsSubmit(false);
    }

    errorMsg("", "");

    try {
      const bformData = {
        loguserid: secureLocalStorage.getItem("login_id"),
        login_type: secureLocalStorage.getItem("loginType"),
        date: formData.date,
        block: formData.block,
        roomNo: formData.roomNo,
        roomId: formData.roomId,
      };
      let attendance = studentListWithAttendance.map((attendance) => ({
        present: attendance.present,
        studentId: attendance.sid,
      }));

      bformData.attendanceList = attendance;

      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/admin/mark-attendance`,
        bformData
      );
     

      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
     
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (
        statusCode === 400 ||
        statusCode === 403 ||
        statusCode === 404 ||
        statusCode === 409 ||
        statusCode === 500
      ) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
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

  useEffect(() => {
    fetchDistinctBlock();
  }, []);
  const markAll = (value) => {
    const updatedAttendanceList = studentListWithAttendance.map((student) => ({
      ...student,
      present: value,
    }));
    setStudentListWithAttendance(updatedAttendanceList);
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
                    {"Mark Hostel Attendance"}
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new pt-2">
                  {"Mark Hostel Attendance"}
                </h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {hasPermission("Hostel Attendance History","list") && (
                  <Link to="/admin/hostel-management/attendance-history">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                     <i className="fas fa-list"></i> Attendance History 
                    </button>
                  </Link>
                  )}
                </div>
              </div>
            </div> 
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={loadStudent}>
                  <div className="row">
                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Block <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={block.map((item) => ({
                          value: item.block,
                          label: item.block,
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            block: selectedOption.value,
                          });
                          fetchRoomNoBasedOnBlock(selectedOption.value);
                        }}
                        value={
                          block.find((item) => item.block === formData.block)
                            ? {
                                value: formData.block,
                                label: block.find(
                                  (item) => item.block === formData.block
                                ).block,
                              }
                            : { value: formData.block, label: "Select" }
                        }
                      />

                      {error.field === "block" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>

                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">Room No <span className="text-danger">*</span></label>
                      <Select
                        options={blockRoomNo.map((item) => ({
                          value: item.id,
                          label: item.roomNo,
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            roomNo: selectedOption.label,
                            roomId: selectedOption.value,
                          });
                        }}
                        value={
                          blockRoomNo.find(
                            (item) => item.roomNo === formData.roomNo
                          )
                            ? {
                                value: formData.roomId,
                                label: blockRoomNo.find(
                                  (item) => item.roomNo === formData.roomNo
                                ).roomNo,
                              }
                            : { value: formData.roomNo, label: "Select" }
                        }
                      />

                      {error.field === "roomNo" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>

                    <FormField
                      borderError={error.field === "date"}
                      errorMessage={error.field === "date" && error.msg}
                      label="Date"
                      name="date"
                      id="date"
                      type="date"
                      column="col-md-4 col-lg-4 col-12"
                      value={
                        formData.date || new Date().toISOString().split("T")[0]
                      }
                      onChange={(e) => {
                        const selectedDate = e.target.value;

                        const today = new Date();
                        const yesterday = new Date();

                        yesterday.setDate(yesterday.getDate() - 1);

                        const minDate = yesterday.toISOString().split("T")[0];
                        const maxDate = today.toISOString().split("T")[0];

                        const validDate =
                          selectedDate >= minDate && selectedDate <= maxDate
                            ? selectedDate
                            : maxDate;

                        setFormData((prev) => ({
                          ...prev,
                          date: validDate,
                        }));
                      }}
                      required
                    />

                    <div className="col-md-12 col-lg-12 col-12">
                      <button
                        disabled={isSubmit}
                        className="btn btn-dark"
                        type="submit"
                      >
                        Fetch{" "}
                        {isSubmit && (
                          <>
                            &nbsp; <div className="loader-circle"></div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className={` ${isSubmit ? "form" : ""} table-responsive`}>
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Enrollment No.</th>
                        <th>Name</th>
                        
                        <th>Attendance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentListWithAttendance.length > 0 ? (
                        studentListWithAttendance.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{capitalizeFirstLetter(row?.enrollmentNo)}</td>
                            <td>
                              <div
                                className="info-column d-flex align-items-center
                    "
                              >
                                <div className="info-image mr-4">
                                  {row.spic ? (
                                    <img
                                      src={`${FILE_API_URL}/student/${row.sid}${row.registrationNo}/${row.spic}`}
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
                                      {row?.sname[0]}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="info-name">
                                    <span>{`${row.sname}`}</span>
                                  </div>
                                  <div className="info-phone">
                                    <span>{row.sphone}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            <td>
                              <Select
                                value={
                                  [
                                    { value: 1, label: "Present" },
                                    { value: 0, label: "Absent" },
                                  ].find(
                                    (item) => item.value === row.present
                                  ) || {
                                    value: "select",
                                    label: "Select Status",
                                  }
                                }
                                onChange={(selectedOption) => {
                                  const updatedAttendanceList =
                                    studentListWithAttendance.map((student) =>
                                      student.sid === row.sid
                                        ? {
                                            ...student,
                                            present: selectedOption.value,
                                          }
                                        : student
                                    );
                                  setStudentListWithAttendance(
                                    updatedAttendanceList
                                  );
                                }}
                                options={[
                                  { value: 1, label: "Present" },
                                  { value: 0, label: "Absent" },
                                ]}
                                placeholder="Select Status"
                              />
                            </td>
                            <td>
                              {row?.present === 1 ? (
                                <div className="badge badge-success">
                                  Present
                                </div>
                              ) : row?.present === 0 ? (
                                <div className="badge badge-danger">Absent</div>
                              ) : (
                                <div className="badge badge-light">
                                  Not Marked
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="row ">
                    {studentListWithAttendance.length > 0 && (
                      <div className="col-12 d-flex justify-content-between">
                        <div>
                          <button
                            className="btn btn-success mr-2"
                            onClick={() => markAll(1)}
                          >
                            Mark All Present
                          </button>

                          <button
                            className="btn btn-danger mr-2"
                            onClick={() => markAll(0)}
                          >
                            Mark All Absent
                          </button>
                        </div>
                        <div className="d-flex">
                          {!isSubmit ? (
                            <button
                              className="btn btn-primary   mr-2"
                              onClick={loadStudent}
                            >
                              Reset{" "}
                            </button>
                          ) : (
                            <button
                              className="btn btn-dark  "
                              type="submit"
                              disabled
                            >
                              Loading &nbsp;{" "}
                              <div className="loader-circle"></div>
                            </button>
                          )}
                          {!isSubmit ? (
                            <button
                              className="btn btn-secondary d-flex justify-content-center align-items-center mr-2"
                              onClick={handleSubmit}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary d-flex justify-content-center align-items-center mr-2"
                              disabled
                            >
                              Saving &nbsp;
                              <div className="loader-circle"></div>
                            </button>
                          )}{" "}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MarkAttendanceForm;
