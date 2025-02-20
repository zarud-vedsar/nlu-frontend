import React, { useEffect, useState } from "react";
import { FILE_API_URL, NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormField } from "../../../site-components/admin/assets/FormField";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";
import { Modal, Button, Spinner } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Select from "react-select";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <span className="badge badge-secondary">Message</span>
        <div className="table-responsive d-flex flex-wrap pl-2">
          {props?.modalMessage?.message}
        </div>
        
      <br/>
        {props?.modalMessage?.admin_remark && 
        <>
        <span className="badge badge-success">Remark</span>

        <div className="table-responsive d-flex flex-wrap pl-2">
          {props?.modalMessage?.admin_remark}
        
        </div>
        </>
}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="mx-auto">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function RaisedRoomComplain() {
  const [raisedRoomQueries, setRaisedRoomQueries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [courseListing, setCourseListing] = useState([]);
  const [semesterListing, setSemesterListing] = useState([]);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state

  const formatDateForMonth = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };
  
    
  const getFirstDayOfMonth = () => {
    const now = new Date();
    return formatDateForMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };
  
  const getLastDayOfMonth = () => {
    const now = new Date();
    return formatDateForMonth(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  };
  const [formData, setFormData] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getLastDayOfMonth(),
    studentId: "",
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState();

  const viewMessage = (index) => {
    const currentQuery = raisedRoomQueries[index];
    setModalMessage(currentQuery);
    setModalShow(true);
  };

  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
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

  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();
    setIsFetching(true)
    if (!formData.startDate) {
      errorMsg("startDate", "Start Date is required.");
      toast.error("Start Date is required.");
      return setIsFetching(false);
    }
    if (!formData.endDate) {
      errorMsg("endDate", "End Date is required.");
      toast.error("End Date is required.");
      return setIsFetching(false);
    }
    errorMsg("", "");

    let bformData = {
      listing: "yes",
      startDate: formData.startDate,
      endDate: formData.endDate,
    };
    if (formData?.studentId) {
      bformData.studentId = formData?.studentId;
    }

    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/admin/room-complaints-by-student`,
        {
          ...bformData,
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setRaisedRoomQueries(response.data.data);
      } else {
        setRaisedRoomQueries([]);
      }
      setIsFetching(false);
    } catch (error) {
      setRaisedRoomQueries([]);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    fetchDistinctBlock();
    courseListDropdown();
    fetchSemesterListing();
    fetchStudent();
  }, []);

  const [studentListing,setStudentListing] = useState([]);

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
                  <a href="./" className="breadcrumb-item">
                    Hostel Management
                  </a>
                  <span className="breadcrumb-item active">Room Complains</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new"> Room Complains</h5>
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
                <div className="row">
                  <FormField
                    borderError={error.field === "startDate"}
                    errorMessage={error.field === "startDate" && error.msg}
                    label="Start Date"
                    name="startDate"
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    column="col-md-4 col-lg-4"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    required
                  />
                  <FormField
                    borderError={error.field === "endDate"}
                    errorMessage={error.field === "endDate" && error.msg}
                    label="End Date"
                    name="endDate"
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    column="col-md-4 col-lg-4"
                    required
                  />
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
                    </div>

                  <div className="d-flex align-items-center col-md-4">
                    <button
                      className="btn btn-secondary"
                      style={{ height: "40px" }}
                      onClick={handleSubmit}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={raisedRoomQueries}
                    
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
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
                        field="sname"
                        sortable
                      />
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
                          ? capitalizeFirstLetter(
                              semesterListing?.find(
                                (item) => item.id === parseInt(row.semesterid)
                              ).semtitle
                            )
                          : " "
                      }
                      header="Semester"
                      sortable
                    />

                    <Column
                      field="created_at"
                      body={(row) => formatDate(row.created_at)}
                      header="Complain Date"
                      sortable
                    />
                    
                    <Column
                      field="message"
                      body={(row, { rowIndex }) => (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="button-tooltip-2">
                              View Complain And Remark
                            </Tooltip>
                          }
                        >
                          <div className="avatar avatar-icon avatar-md avatar-orange">
                            <i
                              className="fa-solid fa-eye"
                              onClick={() => viewMessage(rowIndex)}
                            ></i>
                          </div>
                        </OverlayTrigger>
                      )}
                      header="Complain & Remark"
                    />
                    <Column
                      body={(row, { rowIndex }) => (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="button-tooltip-2">
                              Remark
                            </Tooltip>
                          }
                        >
                          
                            <Link to={`/admin/view-complain/${row.studentId}/${row.id}`} className="avatar avatar-icon avatar-md avatar-orange">
                              <i className="fa-solid fa-edit"></i>
                            </Link>
                        </OverlayTrigger>
                      )}
                      header="Remark"
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>


        <style>

          {
            `
            @media screen and (max-width:768px) {
h5.card-title {
    font-size: 13px;
}
    button.btn.btn-secondary.mr-2 {
    font-size: 13px !important;
    padding: 5px !important;
}
    button.btn.btn-info.text-white.mr-2 {
    font-size: 13px !important;
    padding: 5px;
}
    button.btn.btn-secondary {
    font-size: 13px !important;
}
nav.breadcrumb.breadcrumb-dash {
font-size:13px;
}
nav.breadcrumb.breadcrumb-dash {
    font-size: 13px;
}
h5.card-title.h6_new {
    font-size: 14px !important;
}
    button.ml-auto.btn-md.btn.border-0.btn-light.mr-2 {
    font-size: 14px !important;
}
    button.ml-2.btn-md.btn.border-0.btn-secondary {
    font-size: 12px !important;
}
        }


        button.p-paginator-page.p-paginator-element.p-link.p-paginator-page-start.p-highlight {
    font-size: 13px;
    padding: 0px !important;
}
  .p-paginator {
    flex-wrap: no-wrap !important; /* Allow pagination buttons to wrap */
    justify-content: center; /* Center pagination controls */
  }
  .p-paginator .p-dropdown {
    width: 70px; /* Adjust dropdown width */
  }
    .p-dropdown.p-component.p-inputwrapper.p-inputwrapper-filled {
    padding: 0px;
    height: 31px;
    font-size: 13px !important;
}

    button.p-paginator-page.p-paginator-element.p-link.p-paginator-page-end.p-highlight {
    height: 30px !important;
    padding: 0px !important;
    margin: 0px !important;
}
    span.p-dropdown-label.p-inputtext {
    font-size: 13px;
    margin-top: 5px;
    padding-left: 5px;
}
    button.p-paginator-page.p-paginator-element.p-link.p-paginator-page-start.p-highlight {
    height: 30px !important;
}
    .p-paginator-element {
     margin: 0 !important; 
}
  button.ml-auto.btn-md.btn.border-0.goBack.mr-2 {
    font-size: 14px !important;
}

            
            `
          }
        </style>
      </div>

      {/* Filter Modal */}
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        modalMessage={modalMessage}
      />
    </>
  );
}
export default RaisedRoomComplain;
