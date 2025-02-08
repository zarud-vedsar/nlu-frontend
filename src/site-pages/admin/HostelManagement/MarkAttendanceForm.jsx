import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { FormField } from "../../../site-components/admin/assets/FormField";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Select from "react-select";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import useRolePermission from "../../../site-components/admin/useRolePermission";
function MarkAttendanceForm() {
  const { id: dbId } = useParams();
  const initialData = {
    dbId: "",
    block: "",
    roomNo: "",
    date: new Date().toISOString().split("T")[0],
    studentId: "",
    attendanceStatus: 1
  };
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [block, setBlock] = useState([]);
  const [blockRoomNo, setBlockRoomNo] = useState([]);
  const [studentListing, setStudentListing] = useState([]);
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

  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `${NODE_API_URL}/api/student-detail/get-student`
      );
      console.log(response);
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
      console.log(error);
      setStudentListing([]);
    }
  };
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    console.log(formData)
    if (!formData.block) {
      errorMsg("block", "Block is required.");
      toast.error("Block is required.");
      return setIsSubmit(false);
    }
    if (!formData.roomNo) {
      errorMsg("roomNo", "Room No is required.");
      toast.error("Room No is required.");
      return setIsSubmit(false);
    }

    if (!formData.studentId) {
      errorMsg("studentId", "Student ID is required.");
      toast.error("Student ID is required.");
      return setIsSubmit(false);
    }

    if (!formData.date) {
      errorMsg("date", "Visit In Date is required.");
      toast.error("Visit In Date is required.");
      return setIsSubmit(false);
    }


    errorMsg("", "")

    try {
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      // submit to the API here
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/admin/mark-attendace`,
        formData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);
        setFormData((prev) => ({ ...prev, studentId: "" }));
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (
        statusCode === 400 ||
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
  const fetchDataForupdateBasedOnId = async (dbId) => {
    if (!dbId || parseInt(dbId, 10) <= 0) {
      toast.error("Invalid ID.");
      return;
    }
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/hostel-management/admin/room-allotment-fetch-filter`,
        { dbId }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        const data = response.data[0];
        setFormData((prev) => ({
          ...prev,
          dbId: data.id,
          block: data.block,
          roomNo: data.roomNo,
          date: data.date.split("T")[0],
          studentId: data.studentId,
        }));
        if (data.block) {
          fetchRoomNoBasedOnBlock(data.block);
        }
        if (data.courseid) {
          fetchSemesterBasedOnCourse(data.courseid);
        }
        return response;
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {
      return null;
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
  // const courseListDropdown = async () => {
  //   try {
  //     const response = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
  //     if (response.data?.statusCode === 200 && response.data.data.length > 0) {
  //       setCourseListing(response.data.data);
  //     } else {
  //       toast.error("Course not found.");
  //       setCourseListing([]);
  //     }
  //   } catch (error) {
  //     setCourseListing([]);
  //   }
  // };

  useEffect(() => {
    fetchStudent();
  }, []);

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
        setSemesterListing(response.data);
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

  useEffect(() => {
    fetchDistinctBlock();
    if (dbId) fetchDataForupdateBasedOnId(dbId);
  }, [dbId]);
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
                    {dbId ? "Update Data" : "Mark Hostel Attendance"}
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  {dbId ? "Update Data" : "Mark Hostel Attendance"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/hostel-management/attendance-history">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      Attendance History <i className="fas fa-list"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">Block</label>
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
                      <label className="font-weight-semibold">Room No</label>
                      <Select
                        options={blockRoomNo.map((item) => ({
                          value: item.roomNo,
                          label: item.roomNo,
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            roomNo: selectedOption.value,
                          });
                        }}
                        value={
                          blockRoomNo.find(
                            (item) => item.roomNo === formData.roomNo
                          )
                            ? {
                              value: formData.roomNo,
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

                    <div className="col-md-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Select Student <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={
                          studentListing?.map((student) => ({
                            value: student.id,
                            label: `${student.sname} (${student.enrollmentNo})`,
                          })) || []
                        }
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            studentId: selectedOption.value,
                          });
                        }}
                        value={
                          formData.studentId
                            ? {
                              value: formData.studentId,
                              label:
                                studentListing?.find(
                                  (student) =>
                                    student.id === formData.studentId
                                )?.sname || "Select",
                            }
                            : { value: "", label: "Select" }
                        }
                      />
                      {error.field === "studentId" && (
                        <span className="text-danger">{error.msg}</span>
                      )}
                    </div>



                    <div className="col-md-4 col-12 form-group">
                      <label
                        className="font-weight-semibold"
                        htmlFor="subject_id"
                      >
                        Select Status <span className="text-danger">*</span>
                      </label>
                      <Select
                        value={
                          [
                            { value: 1, label: "Present" },
                            { value: 0, label: "Absent" },
                          ].find((item) => item.value === formData.attendanceStatus)
                            ? {
                              value: formData.attendanceStatus,
                              label: [
                                { value: 1, label: "Present" },
                                { value: 0, label: "Absent" },
                              ].find(
                                (item) => item.value === formData.attendanceStatus
                              ).label,
                            }
                            : { value: formData.attendanceStatus, label: "Select" }
                        }
                        onChange={(e) => {
                          setFormData((prev) => ({
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
                      {error.field === "subject_id" && (
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
                        Mark Attendance{" "}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default MarkAttendanceForm;
