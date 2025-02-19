// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  capitalizeFirstLetter,
  dataFetchingDelete,
  capitalizeEachLetter,
  dataFetchingPatch,
  dataFetchingPost,
  extractGoogleDriveId,
  formatDate,
  goBack,
  googleDriveUrl,
} from "../../../../site-components/Helper/HelperFunction";
import { DeleteSweetAlert } from "../../../../site-components/Helper/DeleteSweetAlert";
import "../../../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import validator from "validator";

import {
  Modal,
  Button,
  Form,
  Table,
  Spinner,
  Col,
  Row,
  InputGroup,
} from "react-bootstrap";

function MyVerticallyCenteredModal(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const res = props?.linkpreview?.description ? validator.unescape(props?.linkpreview?.description) : " ";
    setData(res);
  }, [props?.linkpreview?.description])
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props?.linkpreview?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data &&
          <div className="table-responsive d-flex flex-wrap" dangerouslySetInnerHTML={{
            __html: data,
          }}>

          </div>
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

function ResourceLiveClassUrlList() {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(true);
  const [ResourceLiveClassUrlList, setResourceLiveClassUrlListing] = useState(
    []
  );
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [subjectListing, setSubjectListing] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [recycleTitle, setRecycleTitle] = useState("Trash");
  const [globalFilter, setGlobalFilter] = useState(""); // State for the search box
  const [modalShow, setModalShow] = useState(false);
  const [linkpreview, setLinkPreview] = useState(null);

  const initialData = {
    courseid: "",
    semesterid: "",
    subjectid: "",
    deleteStatus: 0,
    status: 1,
  };
  const [formData, setFormData] = useState(initialData);
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

  useEffect(() => {
    courseListDropdown();
  }, []);

  const fetchSemesterBasedOnCourseAndYear = async (courseid) => {
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
  const handleToggleStatus = async (dbId, currentStatus) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    // Toggle the status (currentStatus is the current checkbox state)
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const loguserid = secureLocalStorage.getItem("login_id");
      const login_type = secureLocalStorage.getItem("loginType");
      const response = await dataFetchingPatch(
        `${NODE_API_URL}/api/resource-live-class/status/${dbId}/${loguserid}/${login_type}`
      );
      if (response?.statusCode === 200) {
        toast.success(response.message);
        // Update the notice list to reflect the status change
        setResourceLiveClassUrlListing((prevList) =>
          prevList.map((item) =>
            item.id === dbId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
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
  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/add-resource-video/${dbId}`, { replace: false });
  };
  const viewPreview = (index) => {
    const resource = ResourceLiveClassUrlList[index];
    setLinkPreview(resource);
    setModalShow(true);

  };
  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();
    setIsSubmit(true);
    try {
      if (!formData.courseid) {
        toast.error("Course is required.");
        return setIsSubmit(false);
      }

      if (!formData.semesterid) {
        toast.error("Semester is required.");
        return setIsSubmit(false);
      }

      if (!formData.subjectid) {
        toast.error("Subject is required.");
        return setIsSubmit(false);
      }
      const response = await axios.post(
        `${NODE_API_URL}/api/resource/live-class/resource-live-class-list`,
        {
          courseid: formData.courseid,
          semesterid: formData.semesterid,
          subjectid: formData.subjectid,
          deleteStatus: formData.deleteStatus,
          status: formData.status,
          defaultCurrentList: "yes",
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setResourceLiveClassUrlListing(response.data.data);
      } else {
        setResourceLiveClassUrlListing([]);
      }
    } catch (error) {
      setResourceLiveClassUrlListing([]);
    } finally {
      setIsSubmit(false);
    }
  };
  const deleteStatus = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    try {
      const deleteAlert = await DeleteSweetAlert(" ");
      if (deleteAlert) {
        const loguserid = secureLocalStorage.getItem("login_id");
        const login_type = secureLocalStorage.getItem("loginType");
        const response = await dataFetchingDelete(
          `${NODE_API_URL}/api/resource/live-class/resource-live-class/deleteStatus/${dbId}/${loguserid}/${login_type}`
        );
        if (response?.statusCode === 200) {
          toast.success(response.message);
          handleSubmit();
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
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
  const showRecyleBin = () => {
    setRecycleTitle(recycleTitle === "Trash" ? "Hide Trash" : "Trash");
    setFormData((prev) => ({
      ...prev,
      deleteStatus: recycleTitle === "Trash" ? 1 : 0,
    }));
    handleSubmit();
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
                  <span className="breadcrumb-item">Resource</span>
                  <span className="breadcrumb-item">Live Class</span>
                  <span className="breadcrumb-item active">
                    Live Class List
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Live Class List</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link
                    to={"/admin/add-resource-live-class-url"}
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-plus" /> Add New
                  </Link>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center position-relative py-0 px-3">
                <h6 className="h6_new card-title">Filter Records</h6>
                <button
                  className="btn btn-info"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  {showFilter ? (
                    <i className="fas fa-times" /> // Close icon
                  ) : (
                    <i className="fas fa-filter" /> // Filter icon
                  )}
                </button>
              </div>
              <div className={`card-body px-3 ${showFilter ? "" : "d-none"}`}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Course <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={courseListing.map((item) => ({
                          value: item.id,
                          label: item.coursename,
                          year: item.duration,
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            courseid: selectedOption.value,
                          });
                          fetchSemesterBasedOnCourseAndYear(
                            selectedOption.value
                          );
                        }}
                        value={
                          courseListing.find(
                            (item) => item.id === parseInt(formData.courseid)
                          )
                            ? {
                              value: parseInt(formData.courseid),
                              label: courseListing.find(
                                (item) =>
                                  item.id === parseInt(formData.courseid)
                              ).coursename,
                            }
                            : { value: formData.courseid, label: "Select" }
                        }
                      />
                    </div>

                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Semester <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={semesterListing.map((item) => ({
                          value: item.id,
                          label: capitalizeFirstLetter(item.semtitle),
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            semesterid: selectedOption.value,
                          });
                          fetchSubjectBasedOnCourseAndSemeter(
                            formData.courseid,
                            selectedOption.value
                          );
                        }}
                        value={
                          semesterListing.find(
                            (item) => item.id === formData.semesterid
                          )
                            ? {
                              value: formData.semesterid,
                              label: capitalizeFirstLetter(
                                semesterListing.find(
                                  (item) => item.id === formData.semesterid
                                ).semtitle
                              ),
                            }
                            : {
                              value: formData.semesterid,
                              label: "Select",
                            }
                        }
                      />
                    </div>

                    <div className="col-md-4 col-lg-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Subject <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={subjectListing.map((item) => ({
                          value: item.id,
                          label: capitalizeFirstLetter(item.subject),
                        }))}
                        onChange={(selectedOption) => {
                          setFormData({
                            ...formData,
                            subjectid: selectedOption.value,
                          });
                        }}
                        value={
                          subjectListing.find(
                            (item) => item.id === formData.subjectid
                          )
                            ? {
                              value: formData.subjectid,
                              label: capitalizeFirstLetter(
                                subjectListing.find(
                                  (item) => item.id === formData.subjectid
                                ).subject
                              ),
                            }
                            : { value: formData.subjectid, label: "Select" }
                        }
                      />
                    </div>
                    <div className="col-md-2 col-lg-2 col-12 d-flex justify-content-between align-items-center mt-2">
                      <button
                        disabled={isSubmit}
                        className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                        type="submit"
                      >
                        Search{" "}
                        {isSubmit && (
                          <>
                            &nbsp; <div className="loader-circle"></div>
                          </>
                        )}
                      </button>
                      <button
                        style={{ whiteSpace: "nowrap" }}
                        className={`btn ${recycleTitle === "Trash"
                            ? "btn-secondary"
                            : "btn-danger"
                          }`}
                        onClick={showRecyleBin}
                      >
                        {recycleTitle} <i className="fa fa-recycle"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  {/* <div className="col-md-8 col-lg-8 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                                </div> */}
                </div>
                <div className={`table-responsive ${isSubmit ? "form" : ""}`}>
                  {ResourceLiveClassUrlList.length > 0 ? (
                    <DataTable
                      value={ResourceLiveClassUrlList}
                      removableSort
                      paginator
                      rows={10}
                      rowsPerPageOptions={[10, 25, 50]}
                      emptyMessage="No records found"
                      className="p-datatable-custom"
                      tableStyle={{ minWidth: "50rem" }}
                      sortMode="multiple"
                      globalFilter={globalFilter}
                    >
                      <Column
                        body={(row, { rowIndex }) => rowIndex + 1}
                        header="#"
                        sortable
                      />
                      <Column
                      field="avtar"
                        header="Thumbnail"
                        body={(rowData) => (
                          <div
                            className="info-column d-flex align-items-center
                                                                  "
                          >
                            <div className="info-image mr-4">
                              {rowData.avtar ? (
                                <img
                                  src={rowData.thumbnail}
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
                                  {rowData?.title[0]}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        sortable
                      />

                      <Column
                        body={(row) => capitalizeFirstLetter(row.title)}
                        header="Title"
                        sortable
                        field="title"
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.coursename)}
                        header="Course"
                        sortable
                        field="coursename"
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.semtitle)}
                        header="Semester"
                        sortable
                        field="semtitle"
                      />
                      <Column
                        body={(row) => capitalizeFirstLetter(row.subject)}
                        header="Subject"
                        sortable
                        field="subject"
                      />

                      <Column
                        body={(row) => capitalizeFirstLetter(row.liveUrl)}
                        header="Live Url"
                        sortable
                        field="liveUrl"
                      />
                      <Column
                        header="Live Date"
                        body={(row) => formatDate(row.liveDate)}
                        sortable
                        field="liveDate"
                      />

                      <Column
                        body={(row) => row.endTime}
                        header="End Time"
                        sortable
                        field="endTime"
                      />
                      <Column
                        body={(row) => row.startTime}
                        header="Start Time"
                        sortable
                        field="startTime"
                      />

                      <Column
                        header="Created At"
                        body={(row) => formatDate(row.created_at)}
                        sortable
                        field="created_at"
                      />

                      <Column
                        header="Action"
                        body={(rowData, { rowIndex }) => (
                          <>
                            <div className="d-flex justify-content-center">
                              <div
                                onClick={() => viewPreview(rowIndex)}
                                className="avatar avatar-icon avatar-md avatar-orange"
                              >
                                <i className="fas fa-eye"></i>
                              </div>

                              <Link
                                to={`/admin/add-resource-live-class-url/${rowData.id}`}
                                className="avatar avatar-icon avatar-md avatar-orange"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              {rowData.deleteStatus == 0 ? (
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="button-tooltip-2">
                                      Delete
                                    </Tooltip>
                                  }
                                >
                                  <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                                    <i
                                      className="fas fa-trash-alt"
                                      onClick={() => deleteStatus(rowData.id)}
                                    ></i>
                                  </div>
                                </OverlayTrigger>
                              ) : (
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="button-tooltip-2">
                                      Restore
                                    </Tooltip>
                                  }
                                >
                                  <div className="avatar ml-2 avatar-icon avatar-md avatar-lime">
                                    <i
                                      className="fas fa-recycle"
                                      onClick={() => deleteStatus(rowData.id)}
                                    ></i>
                                  </div>
                                </OverlayTrigger>
                              )}
                            </div>
                          </>
                        )}
                      />
                    </DataTable>
                  ) : (
                    <>
                      <div className="col-md-12 alert alert-danger">
                        Data not available
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        linkpreview={linkpreview}
      />
    </>
  );
}
export default ResourceLiveClassUrlList;
