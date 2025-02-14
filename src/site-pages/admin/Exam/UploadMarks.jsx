import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { goBack } from "../../../site-components/Helper/HelperFunction";
import {
  PHP_API_URL,
  FILE_API_URL,
} from "../../../site-components/Helper/Constant";
import validator from "validator";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

function AddExam() {
  const location = useLocation();
  const dbId = location?.state?.dbId;
  const examType = location?.state?.examType;
  const [studentList, setStudentList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    if (dbId) {
      fetchStudentList(dbId);
    }
  }, [dbId]);

  const fetchStudentList = async (dbId) => {
    if (!dbId || dbId < 1) {
      toast.error("Invalid database ID.");
      return;
    }
    setIsFetching(true);
    const sendFormData = new FormData();
    sendFormData.append("data", "student_list");
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));
    sendFormData.append("paper_id", dbId);

    try {
      const response = await axios.post(
        `${PHP_API_URL}/exam_marks.php`,
        sendFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.status === 200) {
        setStudentList(response.data.data);

        // Initialize marksData with all required fields
        if (examType === "mid-term") {
          const initialMarks = {};
          response.data.data.forEach((student) => {
            initialMarks[student.stid] = {
              mid_term: student.mid_term || 0,
              max_mid: student.max_mid || student.maxmarks || 0,
              marksid: student.marksid || null,
              sessionsemester: student.sessionsemester,
              subject_id: student.subject_id,
            };
          });
          setMarksData(initialMarks);
        } else {
          const initialMarks = {};
          response.data.data.forEach((student) => {
            initialMarks[student.stid] = {
              mid_term: student.mid_term || 0,
              max_mid: student.max_mid || 0,
              p_written: student.p_written || 0,
              p_ppt: student.p_ppt || 0,
              p_viva: student.p_viva || 0,
              p_total: student.p_total || 0,
              attendance: student.attendance || 0,
              end_term: student.end_term || 0,
              grand_total: student.grand_total || 0,
              max_p: 25 ,
              max_end: student.max_end || student.maxmarks || 0,
              marksid: student.marksid || null,
              sessionsemester: student.sessionsemester,
              subject_id: student.subject_id,
            };
          });
          setMarksData(initialMarks);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "A server error occurred.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (stid, field, value) => {
    setMarksData((prev) => ({
      ...prev,
      [stid]: { ...prev[stid], [field]: value },
    }));
  };
  const handleUploadFinal = async (stid) => {
    const studentMarks = marksData[stid];
    if (!studentMarks) {
      toast.error("No data to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("data", "add_marks");
    formData.append("studentid", stid);
    let grandTotal =
      (parseFloat(studentMarks.end_term) || 0) +
      (parseFloat(studentMarks.attendance) || 0) +
      (parseFloat(studentMarks.p_written) || 0) +
      (parseFloat(studentMarks.p_ppt) || 0) +
      (parseFloat(studentMarks.p_viva) || 0) +
      (parseFloat(studentMarks.mid_term) || 0);

      


    formData.append("max_end_marks", studentMarks.max_end);
    formData.append("end_term_marks", studentMarks.end_term);
    formData.append("attendance_marks", studentMarks.attendance);
    formData.append("p_written", studentMarks.p_written);
    formData.append("ppt_marks", studentMarks.p_ppt);
    formData.append("viva_marks", studentMarks.p_viva);
    formData.append("max_p_marks", studentMarks.max_p);
    formData.append("grand_total", grandTotal);
    formData.append("marksid", studentMarks.marksid || ""); // In case marksid is null
    formData.append("sessionsemester", studentMarks.sessionsemester || ""); // In case sessionsemester is null
    formData.append("subject_id", studentMarks.subject_id || ""); // In case marksid is null
    formData.append("marks_type", "end_term");
    formData.append("loguserid", secureLocalStorage.getItem("login_id"));
    formData.append("login_type", secureLocalStorage.getItem("loginType"));
    try {
      const response = await axios.post(
        `${PHP_API_URL}/exam_marks.php`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data?.status === 200 || response.data?.status === 201) {
       
        toast.success("Marks updated successfully!");
        
        setMarksData((prev) => ({
          ...prev,
          [stid]: {
            ...prev[stid],
            marksid: response?.data?.data?.id,
            grand_total: grandTotal,
          },
        }));
      } else {
        toast.error(response.data?.msg || "Failed to update marks.");
      }
    } catch (error) {
      toast.error("Error uploading marks.");
    }
  };

  useEffect(()=>console.log(marksData),[marksData])

  
  const handleUpload = async (stid) => {
    const studentMarks = marksData[stid];
    if (!studentMarks) {
      toast.error("No data to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("data", "add_marks");
    formData.append("studentid", stid);
    formData.append("max_mid_marks", studentMarks.max_mid);
    formData.append("mid_term_marks", studentMarks.mid_term);
    formData.append("marksid", studentMarks.marksid || ""); // In case marksid is null
    formData.append("sessionsemester", studentMarks.sessionsemester || ""); // In case sessionsemester is null
    formData.append("subject_id", studentMarks.subject_id || ""); // In case marksid is null
    formData.append("marks_type", "mid_term");
    formData.append("loguserid", secureLocalStorage.getItem("login_id"));
    formData.append("login_type", secureLocalStorage.getItem("loginType"));
    try {
      const response = await axios.post(
        `${PHP_API_URL}/exam_marks.php`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success("Marks updated successfully!");
        let tempMarksData = marksData;
        tempMarksData[stid].marksid = response?.data?.data?.id;
        setMarksData(tempMarksData);
      } else {
        toast.error(response.data?.msg || "Failed to update marks.");
      }
    } catch (error) {
      
      toast.error("Error uploading marks.");
    }
  };
  const generateAttendance = async () => {
    if (!dbId || dbId < 1) {
      toast.error("Invalid database ID.");
      return;
    }
    setLoader(true);
    const formData = new FormData();
    formData.append("data", "generate_attendance_marks");
    formData.append("paper_id", dbId);
    formData.append("loguserid", secureLocalStorage.getItem("login_id"));
    formData.append("login_type", secureLocalStorage.getItem("loginType"));
    try {
      const response = await axios.post(
        `${PHP_API_URL}/exam_marks.php`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);

        let attendanceMarks = {};
        response?.data?.data?.forEach((mark) => {
          attendanceMarks[mark.student_id] = mark.marks || 0;
        });

        Object.entries(marksData).forEach(([key, value]) => {
          setMarksData((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              attendance: attendanceMarks[key] || 0, // Default to 0 if not found
            },
          }));
        });
      } else {
        toast.error(
          response.data?.msg || "Failed to generate attendace marks."
        );
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setLoader(false);
    }
  };

  
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-0">
            <nav className="breadcrumb breadcrumb-dash">
              <Link to="/admin/" className="breadcrumb-item">
                <i className="fas fa-home m-r-5" />
                Announcement
              </Link>
              <span className="breadcrumb-item">Exam Management</span>
              <span className="breadcrumb-item active">Student List</span>
            </nav>
          </div>
          <div className="card border-0 bg-transparent mb-0">
            <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title h6_new font-16">Student List</h5>
              <div className="ml-auto">
                <button className="btn goback" onClick={goBack}>
                  <i className="fas fa-arrow-left"></i> Go Back
                </button>
                {examType === "end-term" && (
                  <button
                    className="btn btn-primary ml-2"
                    onClick={generateAttendance}
                  >
                    <i className="fas fa-sync-alt mr-2"></i> Generate Attendance
                    Marks
                    {loader && <div className="loader-circle"></div>}
                  </button>
                )}
              </div>
            </div>
          </div>
          {examType === "mid-term" ? (
            <>
              <div className="row align-items-center">
                <div className="col-md-12 col-lg-12 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
              <div className="row">
                <div className="col-md-12">
                  <div className="card border-0">
                    <div className="card-header p-0 border-0 bg-transparent px-2">
                      <h5 className="card-title h6_new">
                        Student List (Mid Terms Marks Uploading)
                      </h5>
                    </div>
                    <div className="card-body px-2">
                      <div
                        className={`table-responsive ${
                          isFetching ? "form" : ""
                        }`}
                      >
                        <DataTable
                          value={studentList}
                          globalFilter={globalFilter}
                          emptyMessage="No records found"
                          className="p-datatable-custom"
                          tableStyle={{ minWidth: "50rem" }}
                          sortMode="multiple"
                          filters={{
                            global: {
                              value: globalFilter,
                              matchMode: "contains",
                            },
                          }}
                        >
                          <Column
                            header="Student Name"
                            sortable
                            body={(rowData) => (
                              <div className="rsd_container">
                                <div className="rsd_profile_img">
                                  <img
                                    src={`${FILE_API_URL}/student/${rowData?.stid}${rowData?.registrationNo}/${rowData?.spic}`}
                                  />
                                </div>
                                <div className="rsd_info">
                                  <div className="rsd_name">
                                    {validator.unescape(rowData.sname)}
                                  </div>
                                  <a href="#" className="rsd_file">
                                    {rowData.enrollmentNo}
                                  </a>
                                </div>
                              </div>
                            )}
                            filterField="sname"
                          />
                          <Column
                            header="Roll no"
                            sortable
                            body={(rowData) => rowData.roll_no}
                            filterField="roll_no"
                          />
                          <Column
                            header="MT Max Marks"
                            sortable
                            body={(rowData) => (
                              <div className="d-flex">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={marksData[rowData.stid]?.max_mid || ""}
                                  name={`max_mid${rowData.stid}`}
                                  placeholder="Enter Max Marks"
                                  onChange={(e) =>
                                    handleInputChange(
                                      rowData.stid,
                                      "max_mid",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}
                          />
                          <Column
                            header="MT Obtained  Marks"
                            sortable
                            body={(rowData) => (
                              <div className="d-flex">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={
                                    marksData[rowData.stid]?.mid_term || ""
                                  }
                                  name={`mid_term${rowData.stid}`}
                                  placeholder="Enter Obtained Marks"
                                  onChange={(e) =>
                                    handleInputChange(
                                      rowData.stid,
                                      "mid_term",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}
                          />
                          <Column
                            header="Action"
                            sortable
                            body={(rowData) => (
                              <div className="d-flex">
                                <button
                                  className="btn btn-primary ml-2"
                                  onClick={() => handleUpload(rowData.stid)}
                                >
                                  Upload
                                </button>
                              </div>
                            )}
                          />
                        </DataTable>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row align-items-center">
                <div className="col-md-12 col-lg-12 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
              <div className="row">
                <div className="col-md-12">
                  <div className="card border-0">
                    <div className="card-header p-0 border-0 bg-transparent px-2">
                      <h5 className="card-title h6_new">
                        Student List (End Terms Marks Uploading)
                      </h5>
                    </div>
                    <DataTable
                      value={studentList}
                      globalFilter={globalFilter}
                      emptyMessage="No records found"
                      className="p-datatable-custom"
                      tableStyle={{ minWidth: "50rem" }}
                      sortMode="multiple"
                      filters={{
                        global: { value: globalFilter, matchMode: "contains" },
                      }}
                    >
                      <Column
                        header="Student Name"
                        sortable
                        body={(rowData) => (
                          <div className="rsd_container">
                            <div className="rsd_profile_img">
                              <img
                                src={`${FILE_API_URL}/student/${rowData?.stid}${rowData?.registrationNo}/${rowData?.spic}`}
                              />
                            </div>
                            <div className="rsd_info">
                              <div className="rsd_name">
                                {validator.unescape(rowData.sname)}
                              </div>
                              <a href="#" className="rsd_file">
                                {rowData.enrollmentNo}
                              </a>
                            </div>
                          </div>
                        )}
                        filterField="sname"
                      />
                      <Column
                        header="Roll No"
                        sortable
                        body={(rowData) => rowData.roll_no}
                        filterField="roll_no"
                      />
                      <Column
                        header="Marks"
                        body={(rowData) => (
                          <div className="row">
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <label>Mid Max:</label>
                              <span>
                                {marksData[rowData.stid]?.max_mid || ""}
                              </span>
                              <br />
                              <label>Mid Obt:</label>
                              <span>
                                {marksData[rowData.stid]?.mid_term || ""}
                              </span>
                              <br />

                              <label>End Max: </label>
                              <span>
                                {" "}{marksData[rowData.stid]?.max_end || ""}
                              </span>
                            </div>
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <label>Proj Max: <strong className="text-danger">
            <i className="fas fa-eye" />
          </strong></label>
                              <input
                                type="number"
                                className="form-control"
                                value={marksData[rowData.stid]?.max_p || ""}
                                readOnly
                                
                              />
                            </div>
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <label>Proj Writ:</label>
                              <input
                                type="number"
                                className="form-control"
                                value={marksData[rowData.stid]?.p_written || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowData.stid,
                                    "p_written",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <label>PPT:</label>
                              <input
                                type="number"
                                className="form-control"
                                value={marksData[rowData.stid]?.p_ppt || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowData.stid,
                                    "p_ppt",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <label>Viva:</label>
                              <input
                                type="number"
                                className="form-control"
                                value={marksData[rowData.stid]?.p_viva || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowData.stid,
                                    "p_viva",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <label>Attnd: <strong className="text-danger">
            <i className="fas fa-eye" />
          </strong></label>
                              <input
                                type="number"
                                className="form-control"
                                value={marksData[rowData.stid]?.attendance}
                                readOnly
                              />
                            </div>
                           
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <label>End Obt:</label>
                              <input
                                type="number"
                                className="form-control"
                                value={marksData[rowData.stid]?.end_term || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowData.stid,
                                    "end_term",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <label>Total: <strong className="text-danger">
            <i className="fas fa-eye" />
          </strong></label>
                              <input
                                type="number"
                                className="form-control"
                                value={marksData[rowData.stid]?.grand_total || ""}
                                readOnly
                              />
                            </div>
                           
                            <div className="col-md-3 col-lg-3 col-12 mb-2">
                              <button
                                className="btn btn-primary"
                                onClick={() => handleUploadFinal(rowData.stid)}
                              >
                                Upload
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </DataTable>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddExam;
