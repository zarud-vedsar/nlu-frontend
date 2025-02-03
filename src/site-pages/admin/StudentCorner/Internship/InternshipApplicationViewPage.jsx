import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import {
  PHP_API_URL,
  NODE_API_URL,
} from "../../../../site-components/Helper/Constant";
import { Modal, Spinner } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";

const decodeHtml = async (html) => {
  try {
    const response = await axios.post(
      `${PHP_API_URL}/page.php`,
      {
        data: "decodeData",
        html,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error decoding HTML:", error);
    return "";
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

function ViewMessageModal(props) {
  const [decodedMessage, setDecodedMessage] = useState();
  useEffect(() => {
    if (props.selectedMessage?.message) {
      decodeHtml(props.selectedMessage?.message).then((decoded) => {
        setDecodedMessage(decoded);
      });
    }
  }, [props.selectedMessage]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.selectedMessage?.subject}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive d-flex flex-wrap">
          <div
            dangerouslySetInnerHTML={{ __html: decodedMessage }}
          />
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

const MyVerticallyCenteredModal = (props = {}) => {
  const [loading, setLoading] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [detail, setDetail] = useState({
    email: "",
    subject: "",
    message: "",
    appid: "",
    application_status: 0,
    sendonmail:null,
  });

  useEffect(() => {
    setSendMail(false)
    if (props?.detail) {
      setDetail((prevDetail) => ({
        ...prevDetail,
        email: props?.detail?.email || "",
        mail_subject: "",
        message: "",
        appid: props?.detail?.id || "",
        application_status: props?.detail?.application_status || 0,
      }));
    }
  }, [props.detail]);

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setDetail((prev) => ({
      ...prev,
      application_status: value,
    }));
  };

  const handleSubmit = async () => {
    if (sendMail && !detail?.mail_subject) {
      toast.error("Please enter mail_subject");
      return;
    }
    if (sendMail && !detail?.message) {
      toast.error("Please enter message");
      return;
    }
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "actionresponse");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      bformData.append("appid", detail?.appid);
      bformData.append("application_status", detail?.application_status);

      if (sendMail) {
        bformData.append("sendonmail", 1);
        bformData.append("email", detail?.email);
        bformData.append("subject", detail?.mail_subject);
        bformData.append("description", detail?.message);
      }

      
  
      const response = await axios.post(
        `${PHP_API_URL}/internshipApplication.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success(response?.data?.msg);
        setDetail({
          email: "",
          mail_subject: "",
          message: "",
          application_status: "",
          appid: "",
          sendonmail:null
        });
        setSendMail(false)
        props?.submit();
      } else {
        toast.error("Failed to submit content");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Reply</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group col-md-12">
          <label className="font-weight-semibold">Application Status</label>
          <select
            name="application_status"
            id="application_status"
            className="form-control"
            value={detail?.application_status}
            onChange={handleStatusChange}
          >
            <option value="0">Select</option>
            <option value="1">Shortlisted</option>
            <option value="2">Rejected</option>
          </select>
        </div>
        <div className="form-group col-md-12 d-flex">
          <input
            name="sendMail"
            checked={sendMail}
            type="checkbox"
            onChange={() => setSendMail(!sendMail)}
          />
          <span className="font-weight-semibold pl-1">Send On Mail</span>
        </div>

        {sendMail && (
          <>
            <div className="form-group col-md-12">
              <label className="font-weight-semibold">Recipient</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={detail?.email}
                disabled={true}
              />
            </div>
            <div className="form-group col-md-12">
              <label className="font-weight-semibold" htmlFor="mail_subject">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                name="mail_subject"
                value={detail.mail_subject}
                onChange={(e) =>
                  setDetail((pre) => ({
                    ...pre,
                    mail_subject: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </div>
            <div className="form-group col-md-12">
              <label className="font-weight-semibold" htmlFor="message">
                Message
              </label>
              <input
                type="text"
                className="form-control"
                name="message"
                value={detail.message}
                onChange={(e) =>
                  setDetail((pre) => ({
                    ...pre,
                    message: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="mx-auto">
          <Button
            onClick={props?.close}
            className="btn btn-danger"
            disabled={loading}
          >
            Close
          </Button>{" "}
          <Button
            onClick={handleSubmit}
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const InternshipApplicationViewPage = () => {
  const { id } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);

  const [customerDetail, setCustomerDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [decodedDescriptions, setDecodedDescriptions] = useState();

  

  useEffect(() => {
    if (selectedMessage != null) {
    }
  }, [selectedMessage]);

  const viewAllImages = (index) => {
    const currentSetMessage = conversation[index];
    setSelectedMessage(currentSetMessage);
    setViewShow(true);
  };

  useEffect(() => {
    if (id) {
      loadConversationHistory();
      getCandidateDetail();
    }
  }, [id]);

  const loadConversationHistory = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "internshipmailreply");
      bformData.append("appid", id);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      const response = await axios.post(
        `${PHP_API_URL}/internshipApplication.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setConversation(response.data.data);
    } catch (error) {
      setConversation([]);
      console.error("Error fetching internship mail data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCandidateDetail = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_internship_application");
      bformData.append("appid", id);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      
      const res = await axios.post(
        `${PHP_API_URL}/internshipApplication.php`,
        bformData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data?.status === 200) {
        setCustomerDetail(res?.data?.data[0]);
        await decodeHtml(res?.data?.data[0]?.description).then((res)=>{
          setDecodedDescriptions(res)
        })
      } else {
        throw new Error(res.data?.msg || "Failed to fetch details");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "An error occurred while fetching details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
      <div className="container-fluid">
      <div className="">
              <nav className="breadcrumb breadcrumb-dash">
                <a href="/" className="breadcrumb-item">
                  Internship
                </a>

                <span className="breadcrumb-item active">Internship Applications</span>
              </nav>
            </div>
       

        <div className="card bg-transparent mb-2">
            <div className="card-header d-flex justify-content-between align-items-center px-0">
              <h5 className="card-title h6_new">Internship Application Detail</h5>
              <div className="ml-auto">
              <Button
              variant="light"
              className="mb-2 mb-md-0"
              onClick={() => window.history.back()}
            >
              <i className="fas">
                <FaArrowLeft />
              </i>{" "}
              Go Back
            </Button>
              </div>
            </div>
          </div>

        

        <div className="row ant-card-body ">
          <div className="col-md-12 align-items-center ng-star-inserted">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : customerDetail ? (
              <div className="card">
                <div className="card-body py-3">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="d-md-flex align-items-start">
                        <div className="text-center text-sm-left mt-3">
                          <div
                            className="avatar avatar-badge avatar-icon avatar-green d-flex align-items-center rounded-circle"
                            style={{ width: "80px", height: "80px" }}
                          >
                            {customerDetail?.photo ? (
                              <span className="m-auto ">
                                <img
                                  src={`${NODE_API_URL}/public/upload/resume/${customerDetail?.photo}`}
                                  className="rounded-circle"
                                  alt=""
                                  style={{ width: "80px", height: "80px" }}
                                />
                              </span>
                            ) : (
                              <span className="m-auto">
                                {customerDetail?.name?.charAt(0) || ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-center text-sm-left m-v-15 p-l-30">
                          <h6 className="m-b-5 h6_new mr-2 font-15">
                            {`${customerDetail?.title} ${customerDetail?.name}` ||
                              "No name"}
                          </h6>
                          <p className="mb-0 font-12">
                            <span className="text-dark font-weight-semibold">
                              Submitted Date:
                            </span>{" "}
                            <span className="font-12">
                              {customerDetail?.created_at
                                ? new Date(
                                    customerDetail?.created_at
                                  ).toLocaleDateString("en-GB")
                                : "N/A"}
                            </span>
                          </p>
                          <p className="mb-0 font-12">
                            <span className="text-dark font-weight-semibold">
                              Application Status:
                            </span>{" "}
                            <span className="font-12">
                              <span className=" ">
                                {customerDetail?.application_status === 0 && (
                                  <div className="badge badge-warning">
                                    Pending
                                  </div>
                                )}
                                {customerDetail?.application_status === 1 && (
                                  <div className="badge badge-success">
                                    Accepted
                                  </div>
                                )}
                                {customerDetail?.application_status === 2 && (
                                  <div className="badge badge-danger">
                                    Rejected
                                  </div>
                                )}
                              </span>
                            </span>
                          </p>
                          <button
                            type="button"
                            className="text-start mx-1 mt-3 btn btn-primary btn-tone"
                            onClick={() => setModalShow(true)}
                          >
                            Action
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-4">
                      <div className="row">
                        <div className="d-md-block d-none border-left col-1"></div>
                        <div className="col p-0">
                          <ul className="list-unstyled m-t-10">
                            <li className="row">
                              <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                <i
                                  className="fa-solid fa-user m-r-10 "
                                  style={{ color: "#3f87f5" }}
                                ></i>
                                <span>First Name:</span>
                              </p>
                              <p className="col font-12 font-weight-semibold">
                                {customerDetail?.fname || "N/A"}
                              </p>
                            </li>
                            <li className="row">
                              <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                <i
                                  className="fa-solid fa-user m-r-10 "
                                  style={{ color: "#3f87f5" }}
                                ></i>
                                <span>Middle Name:</span>
                              </p>
                              <p className="col font-12 font-weight-semibold">
                                {customerDetail?.middleName || "N/A"}
                              </p>
                            </li>
                            <li className="row">
                              <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                <i
                                  className="fa-solid fa-user m-r-10 "
                                  style={{ color: "#3f87f5" }}
                                ></i>
                                <span>Last Name:</span>
                              </p>
                              <p className="col font-12 font-weight-semibold">
                                {customerDetail?.lname || "N/A"}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="row">
                        <div className="d-md-block d-none border-left col-1"></div>
                        <div className="col p-0">
                          <ul className="list-unstyled m-t-10">
                            <li className="row">
                              <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                <i
                                  className="fa fa-envelope m-r-10 "
                                  style={{ color: "#3f87f5" }}
                                ></i>
                                <span>Email:</span>
                              </p>
                              <p className="col font-12 font-weight-semibold">
                                {customerDetail?.email || "N/A"}
                              </p>
                            </li>
                            <li className="row">
                              <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                <i
                                  className="fa-solid fa-mobile m-r-10 "
                                  style={{ color: "#3f87f5" }}
                                ></i>
                                <span>Phone:</span>
                              </p>
                              <p className="col font-12 font-weight-semibold">
                                {customerDetail?.phone || "N/A"}
                              </p>
                            </li>
                            <li className="row">
                              <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                <i
                                  className="fa-solid fa-mobile m-r-10 "
                                  style={{ color: "#3f87f5" }}
                                ></i>
                                <span>Alternative Phone:</span>
                              </p>
                              <p className="col font-12 font-weight-semibold">
                                {customerDetail?.alternatePhone || "N/A"}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                No application details available.
              </div>
            )}
          </div>
        </div>

        <div className="row">
          {/* <div className="col-md-6 col-sm-12 col-12 col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title h6_new">Application Questions</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <p className="text-dark">
                      1. Have you been convicted by law in any court of india or
                      outside?
                    </p>
                    <p>Ans: {customerDetail?.app_law_convicted}</p>
                  </div>
                  <div className="col-md-12">
                    <p className="text-dark">
                      2. Have you been interviewed by us or any of our group
                      companies in the past?
                    </p>
                    <p>Ans: {customerDetail?.app_any_interviewed}</p>
                  </div>
                  <div className="col-md-12">
                    <p className="text-dark">
                      3. Have you worked with Indian Ports Association (IPA)?
                    </p>
                    <p>Ans: {customerDetail?.app_worked_before}</p>
                  </div>
                  <div className="col-md-12">
                    <p className="text-dark">
                      4. Are you related to any employee of Indian Ports
                      Association (IPA)?
                    </p>
                    <p>Ans: {customerDetail?.app_any_employee}</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="col-md-6 col-sm-12 col-12 col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title h6_new">Documents</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <p>Resume</p>
                    <a
                      href={`${NODE_API_URL}/public/upload/resume/${customerDetail?.resume}`}
                      target="_blank"
                      className="btn btn-dark"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                  </div>
                  {customerDetail?.cover_letter && (
                    <div className="col-md-3 ">
                      <p>Cover Letter</p>
                      <a
                        href={`${NODE_API_URL}/public/upload/resume/${customerDetail?.cover_letter}`}
                        target="_blank"
                        className="btn btn-dark"
                      >
                        <i className="fas fa-eye"></i>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-12 col-12 col-lg-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title h6_new">Internship Detail</h5>
              </div>
              <div className="card-body">
                <ul className="list-group row flex-row pb-3 px-3 pt-0">
                  {/* <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Category
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.cat_title}
                    </div>
                  </li> */}
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Position
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.position}
                    </div>
                  </li>
                  {/* <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Job Type
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.job_type}
                    </div>
                  </li> */}
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Post Date
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {new Date(customerDetail.post_date).toLocaleDateString()}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Post Last Date
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {new Date(
                        customerDetail.post_last_date
                      ).toLocaleDateString()}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Education Level
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.education_level}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Gender
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.gender}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Salary From
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.salary_starting}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Salary To
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.salary_to}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      State
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.state}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      City
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.city}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-4 col-lg-4 col-6 col-sm-6 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Address
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail.address}
                    </div>
                  </li>
                  <li className="list-group-item p-0 border-0 col-md-12 col-lg-12 col-12 col-sm-12 mt-2">
                    <div className="m-b-0 text-dark font-weight-semibold">
                      Description
                    </div>
                    <div className="m-b-0 opacity-07 font-size-13">
                      {customerDetail?.description
                        ? <div dangerouslySetInnerHTML={{ __html: decodedDescriptions }}></div>
                        : ""}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title h6_new">Mail Sent History</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-8 col-lg-8 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="table-responsive">
                <DataTable
                  value={conversation}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  globalFilter={globalFilter}
                  emptyMessage="No records found"
                  className="p-datatable-custom"
                  tableStyle={{ minWidth: "50rem" }}
                  sortMode="multiple"
                >
                  <Column
                    body={(rowData, { rowIndex }) => rowIndex + 1}
                    header="#"
                    sortable
                  />

                  <Column field="email" header="Email" sortable />

                  <Column field="subject" header="Subject" sortable />

                  <Column
                    field="created_at"
                    header="Date"
                    sortable
                    body={(rowData) => formatDate(rowData.created_at)}
                  />
                  <Column
                    style={{ width: "10%" }}
                    header="Action"
                    body={(rowData, { rowIndex }) => (
                      <div className="d-flex justify-content-around">
                        <div
                          onClick={() => viewAllImages(rowIndex)}
                          className="avatar avatar-icon avatar-md avatar-orange"
                        >
                          <i className="fas fa-eye"></i>
                        </div>
                      </div>
                    )}
                    sortable
                  />
                </DataTable>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        detail={customerDetail}
        close={() => setModalShow(false)}
        submit={() => {
          setModalShow(false);
          getCandidateDetail();
          loadConversationHistory();
        }}
      />
      <ViewMessageModal
        show={viewShow}
        onHide={() => setViewShow(false)}
        selectedMessage={selectedMessage}
      />
    </div>
  );
};

export default InternshipApplicationViewPage;
