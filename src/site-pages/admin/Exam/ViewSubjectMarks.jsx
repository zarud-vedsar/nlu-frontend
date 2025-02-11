import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { goBack } from "../../../site-components/Helper/HelperFunction";
import { PHP_API_URL,FILE_API_URL } from "../../../site-components/Helper/Constant";
import validator from "validator";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

function ViewSubjectMarks() {
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
    sendFormData.append("data", "view_exam_marks");
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
        if(examType === 'mid-term'){
            const initialMarks = {};
            response.data.data.forEach((student) => {
                initialMarks[student.stid] = {
                    mid_term: student.mid_term || 0,
                    max_mid: student.max_mid || 0,
                    marksid: student.marksid || null,
                    sessionsemester: student.sessionsemester,
                    subject_id: student.subject_id,
                };
            });
            setMarksData(initialMarks);
        }else{
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
          max_p: student.max_p || 0,
          max_end: student.max_end || 0,
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

const exportExcel = async() => {
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
        
      } catch (error) {
        toast.error("An error occurred.");
      }finally{
        setLoader(false);
      }
}
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-0">
            <nav className="breadcrumb breadcrumb-dash">
              <Link to="/admin/" className="breadcrumb-item">
                <i className="fas fa-home m-r-5" />
                Exam Management
              </Link>
              <Link to="/admin/" className="breadcrumb-item">
                
                Exam Paper
              </Link>
              
              <span className="breadcrumb-item active">Student Marks</span>
            </nav>
          </div>
          <div className="card border-0 bg-transparent mb-0">
            <div className="card-header bg-transparent mb-0 px-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title h6_new font-16">Student Marks</h5>
              <div className="ml-auto">
                <button className="btn goback" onClick={goBack}>
                  <i className="fas fa-arrow-left"></i> Go Back
                </button>
                {examType === "end-term" && (
                  <button
                    className="btn btn-primary ml-2"
                    onClick={exportExcel}
                  >
                    <i className="fas fa-sync-alt mr-2"></i> Export Marks
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
                      <h5 className="card-title h6_new ">
                        Student List (Mid Term Marks)
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
                          filters={{ global: { value: globalFilter, matchMode: "contains" } }} 
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
                              marksData[rowData.stid]?.max_mid || ""
                            )}
                            filterField="max_mid"
                          />
                          <Column
                            header="MT Obtained  Marks"
                            sortable
                            body={(rowData) => (
                              marksData[rowData.stid]?.mid_term || ""
                            )}
                            filterField="mid_term"
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
                        Student List (End Term Marks )
                      </h5>
                    </div>
                    <DataTable
                      value={studentList}
                      globalFilter={globalFilter}
                      emptyMessage="No records found"
                      className="p-datatable-custom"
                      tableStyle={{ minWidth: "50rem" }}
                      sortMode="multiple"
                    >
                      <Column
                        header="Student Name"
                        sortable
                        filterField="sname"
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
                      />
                      <Column
                        header="Roll No"
                        sortable
                        body={(rowData) => rowData.roll_no}
                        filterField="roll_no"
                      />
                      
                      <Column
                        header="Mid Max"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.max_mid || ""}
                        filterField="max_mid"
                      />
                      <Column
                        header="Mid Obt"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.mid_term || ""}
                        filterField="mid_term"
                      />
                      <Column
                        header="Proj Max"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.max_p || ""}
                        filterField="max_p"
                      />
                      
                      <Column
                        header="Proj Writ"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.p_written || ""}
                        filterField="p_written"
                      />
                      <Column
                        header="PPT"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.p_ppt || ""}
                        filterField="p_ppt"
                      />
                      <Column
                        header="Viva"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.p_viva || ""}
                        filterField="p_viva"
                      />
                      <Column
                        header="Attnd"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.attendance || ""}
                        filterField="attendance"
                      />
                      <Column
                        header="End Max:"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.max_end || ""}
                        filterField="max_end"
                      />
                      <Column
                        header="End Obt:"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.end_term || ""}
                        filterField="end_term"
                      />
                      <Column
                        header="Total Obt"
                        sortable
                        body={(rowData) => marksData[rowData.stid]?.grand_total || ""}
                        filterField="grand_total"
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

export default ViewSubjectMarks;
