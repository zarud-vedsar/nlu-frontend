import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
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
import secureLocalStorage from "react-secure-storage";
import { Modal, Button, Spinner } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import validator from "validator";

function MyVerticallyCenteredModal(props) {

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <div className="table-responsive d-flex flex-wrap">
          {props?.modalMessage?.message}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="mx-auto">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function RaisedRoomQueries() {
  const [raisedRoomQueries, setRaisedRoomQueries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [courseListing, setCourseListing] = useState([]);
  const [semesterListing, setSemesterListing] = useState([]);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
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

    if (!formData.startDate) {
      errorMsg("startDate", "Start Date is required.");
      toast.error("Start Date is required.");
      return setIsSubmit(false);
    }
    if (!formData.endDate) {
      errorMsg("endDate", "End Date is required.");
      toast.error("End Date is required.");
      return setIsSubmit(false);
    }
    errorMsg("", "");

    let bformData = {
      listing: "yes",
      studentId: secureLocalStorage.getItem("studentId"),
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/raised-query-list`,
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
  }, []);

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
                    Allot Room
                  </a>
                  <span className="breadcrumb-item active">
                    Raised Room Queries
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Raised Room Queries</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {!secureLocalStorage.getItem("sguardianemail")  &&
                  <Link to="/student/raise-query">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus"></i> Raise Query For Room
                    </button>
                  </Link>
}
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
                    field="courseid"
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
                    field="semesterid"
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
                      header="Query Date"
                      sortable
                    />
                    <Column
                      field="message"
                      body={(row, { rowIndex }) => (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="button-tooltip-2">
                              View Message
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
                      header="Message"
                      sortable
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
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
export default RaisedRoomQueries;
