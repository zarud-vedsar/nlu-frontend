// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";
import { toast } from 'react-toastify';
import { capitalizeFirstLetter, dataFetchingDelete, dataFetchingPatch, dataFetchingPost, formatDate, goBack } from '../../../../site-components/Helper/HelperFunction';
import { DeleteSweetAlert } from '../../../../site-components/Helper/DeleteSweetAlert';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/Column';
import { InputText } from 'primereact/inputtext'; // Import InputText for the search box
import '../../../../../node_modules/primeicons/primeicons.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import pdfSample from "../../../../site-components/admin/assets/images/pdf.png"
import {
  Modal,
  Button,
  Form,
  Col,
  Row,
} from "react-bootstrap";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import axios from "axios";
function ResourcePdfList() {
  const [ResourcePdfListing, setResourcePdfListing] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(''); // State for the search box
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: null,
    courseid: null,
    semesterid: null,
    subjectid: null,

  });
  const [show, setShow] = useState(false);
  const [filterStatus, setFilterStatus] = useState();

  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [subjectListing, setSubjectListing] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFilters = () => {
    setFilters({
      status: null,
      courseid: null,
      semesterid: null,
      subjectid: null,

    });
    setFilterStatus(null);
    fetchResourcePdfListing({})

    handleClose();
  };

  const applyFilters = () => {
    fetchResourcePdfListing(filters)
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

  useEffect(() => {
    courseListDropdown();
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

  const fetchResourcePdfListing = async (filters = {}, deleteStatus = 0) => {
    setIsFetching(true);
    const { status, courseid, semesterid, subjectid } = filters;
    try {
      const response = await dataFetchingPost(`${NODE_API_URL}/api/resource/pdf/fetchResourcePdfWithCourseSemesterSubject`,
        {
          courseid, semesterid, subjectid, status,
          deleteStatus,
          listing: 'yes'
        });
      if (response?.statusCode === 200 && response.data.length > 0) {
        setResourcePdfListing(response.data);
      } else {
        setResourcePdfListing([]);
      }
    } catch (error) {
      setResourcePdfListing([]);
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
  }
  useEffect(() => {
    fetchResourcePdfListing();
  }, []);
  const showRecyleBin = () => {
    setRecycleTitle(recycleTitle === "Show Recycle Bin" ? "Hide Recycle Bin" : "Show Recycle Bin");
    fetchResourcePdfListing({}, recycleTitle === "Show Recycle Bin" ? 1 : 0);
  }

  const handleToggleStatus = async (dbId, currentStatus) => {
    if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
    // Toggle the status (currentStatus is the current checkbox state)
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const loguserid = secureLocalStorage.getItem('login_id');
      const login_type = secureLocalStorage.getItem('loginType');
      const response = await dataFetchingPatch(`${NODE_API_URL}/api/resource/pdf/status/${dbId}/${loguserid}/${login_type}`);
      if (response?.statusCode === 200) {
        toast.success(response.message);
        // Update the notice list to reflect the status change
        setResourcePdfListing(prevList =>
          prevList.map(item =>
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
  }
  const deleteStatus = async (dbId) => {
    if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
    try {
      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const loguserid = secureLocalStorage.getItem('login_id');
        const login_type = secureLocalStorage.getItem('loginType');
        const response = await dataFetchingDelete(`${NODE_API_URL}/api/resource/pdf/deleteStatus/${dbId}/${loguserid}/${login_type}`);
        if (response?.statusCode === 200) {
          toast.success(response.message);
          if (response.data == 1) {
            fetchResourcePdfListing(filters, 1);
          } else {
            fetchResourcePdfListing(filters, 0);
          }
          showRecyleBin()
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
  }
  const updateDataFetch = async (dbId) => {
    if (!dbId || (!Number.isInteger(parseInt(dbId, 10)) || parseInt(dbId, 10) <= 0)) return toast.error("Invalid ID.");
    navigate(`/admin/add-resource-pdf/${dbId}`, { replace: false });
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
                  <span className="breadcrumb-item">Resource</span>
                  
                  <span className="breadcrumb-item active">Pdf List</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new pt-2">Pdf List</h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 goback mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                    <Button
                      variant="primary"
                      className=" mb-md-0"
                      onClick={handleShow}
                    >
                      <span>
                        <FaFilter /> 
                      </span>
                    </Button>
                  <Link
                    to={'/admin/add-resource-pdf'}
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-plus" /> Add New
                  </Link>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* Search Box */}
                <div className='row'>
                  <div className="col-md-7 col-lg-7 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
                    <div className='search-icon'><i className="pi pi-search" /></div>
                    <InputText
                      type="search"
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      placeholder="Search"
                      className="form-control dtsearch-input"
                    />
                  </div>
                  
                  <div className='col-md-4 col-lg-4 col-10 col-sm-4 mb-3'>
                    <button className={`btn ${recycleTitle === "Show Recycle Bin" ? 'btn-secondary' : 'btn-danger'}`} onClick={showRecyleBin}>{recycleTitle} <i className="fa fa-recycle"></i></button>
                  </div>
                </div>
                <div className={`table-responsive ${isFetching ? 'form' : ''}`}>
                  <DataTable
                    value={ResourcePdfListing}
                    removableSort
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    globalFilter={globalFilter} // Bind global filter
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: '50rem' }}
                    sortMode="multiple"
                  >
                    <Column field="coursename" header="Course" sortable />
                    <Column field='semtitle' body={(row) => capitalizeFirstLetter(row.semtitle)} header="Semester" sortable />
                    <Column field='subject' body={(row) => capitalizeFirstLetter(row.subject)} header="Subject" sortable />
                    <Column
                      body={(row) => {
                        return (
                          <Link to={row.pdf} target='_blank'><img src={pdfSample} /></Link>
                        )
                      }}
                      header="PDF" sortable />
                    <Column field="created_at"
                      body={(row) => formatDate(row.created_at)}
                      header="Created At" sortable />
                    {
                      recycleTitle !== "Show Recycle Bin" && (
                        <Column field="deleted_at"
                          body={(row) => row.deleted_at && row.deleted_at != '0000-00-00' && formatDate(row.deleted_at)}
                          header="Deleted At" sortable />
                      )
                    }
                    <Column
                      header="Action"
                      body={(rowData) => (
                        <div className="d-flex">
                          <div className="switch mt-1 w-auto">
                            <input type="checkbox"
                              checked={rowData.status === 1}  // This ensures the checkbox reflects the correct status
                              onChange={() => handleToggleStatus(rowData.id, rowData.status)} // Pass the id and current status
                              className="facultydepartment-checkbox" id={`switch${rowData.id}`} />
                            <label className="mt-0" htmlFor={`switch${rowData.id}`}></label>
                          </div>
                          <div onClick={() => updateDataFetch(rowData.id)} className="avatar avatar-icon avatar-md avatar-orange">
                            <i className="fas fa-edit"></i>
                          </div>
                          {
                            rowData.deleteStatus == 0 ?
                              (
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}
                                >
                                  <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                                    <i className="fas fa-trash-alt" onClick={() => deleteStatus(rowData.id)}></i>
                                  </div>
                                </OverlayTrigger>
                              ) :
                              (
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={<Tooltip id="button-tooltip-2">Restore</Tooltip>}
                                >
                                  <div className="avatar ml-2 avatar-icon avatar-md avatar-lime">
                                    <i className="fas fa-recycle" onClick={() => deleteStatus(rowData.id)}></i>
                                  </div>
                                </OverlayTrigger>
                              )
                          }

                        </div>
                      )}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* filter modal */}
      <Modal show={show} onHide={handleClose} className="modal-right">
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="filteruserlist">
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Course</Form.Label>
                  <Select
                    options={courseListing.map((item) => ({
                      value: item.id,
                      label: item.coursename,
                    }))}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        courseid: selectedOption.value,
                      });

                      fetchSemesterBasedOnCourse(selectedOption.value);
                    }}
                    value={
                      courseListing.find(
                        (item) => item.id === parseInt(filters.courseid)
                      )
                        ? {
                          value: parseInt(filters.courseid),
                          label: courseListing.find(
                            (item) => item.id === parseInt(filters.courseid)
                          ).coursename,
                        }
                        : { value: filters.courseid, label: "Select" }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Semester</Form.Label>
                  <Select
                    options={semesterListing.map((item) => ({
                      value: item.id,
                      label: capitalizeFirstLetter(item.semtitle),
                    }))}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        semesterid: selectedOption.value,
                      });
                      fetchSubjectBasedOnCourseAndSemeter(
                        filters.courseid,
                        selectedOption.value
                      );
                    }}
                    value={
                      semesterListing.find(
                        (item) => item.id === filters.semesterid
                      )
                        ? {
                          value: filters.semesterid,
                          label: capitalizeFirstLetter(
                            semesterListing.find(
                              (item) => item.id === filters.semesterid
                            ).semtitle
                          ),
                        }
                        : {
                          value: filters.semesterid,
                          label: "Select",
                        }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Subject</Form.Label>
                  <Select
                    options={subjectListing.map((item) => ({
                      value: item.id,
                      label: capitalizeFirstLetter(item.subject),
                    }))}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        subjectid: selectedOption.value,
                      });

                    }}
                    value={
                      subjectListing.find((item) => item.id === filters.subjectid)
                        ? {
                          value: filters.subject,
                          label: capitalizeFirstLetter(
                            subjectListing.find(
                              (item) => item.id === filters.subjectid
                            ).subject
                          ),
                        }
                        : { value: filters.subject, label: "Select" }
                    }
                  />
                </Form.Group>
              </Col>


              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Status:</Form.Label>
                  <Select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e);
                      setFilters((prevState) => ({
                        ...prevState,
                        status: e.value,
                      }));
                    }}
                    options={[
                      { value: 1, label: "Active" },
                      { value: 0, label: "Inactive" },
                    ]}
                    placeholder="Select Status"
                  />
                </Form.Group>
              </Col>
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
          .modal-right .modal-dialog {
            position: absolute;
            top: 0;
            right: 0;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
          }

          .modal-right.show .modal-dialog {
            transform: translateX(0);
          }
        `}
      </style>
    </>
  )
}
export default ResourcePdfList;