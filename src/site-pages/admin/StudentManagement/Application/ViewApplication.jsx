import React, { useEffect, useState, useRef } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  getDocument,
  studentRecordById,
} from "../../../../site-components/student/GetData";
import rpnlLogo from "../../../../site-components/website/assets/Images/rpnl-logo.png";
import {
  FILE_API_URL,
  NODE_API_URL,
  PHP_API_URL,
} from "../../../../site-components/Helper/Constant";
import {
  dataFetchingPost,
  formatDate,
} from "../../../../site-components/Helper/HelperFunction";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../../site-components/Helper/HelperFunction";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FormField } from "../../../../site-components/admin/assets/FormField";
// import html2canvas from "html2canvas";
import Select from "react-select";

const MyVerticallyCenteredModal = (props = {}) => {
  const [loading, setLoading] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const navigate = useNavigate();
  const [detail, setDetail] = useState({
    email: "",
    subject: "",
    message: "",
    id: null,
    approved: null,
    exam_type: "regular",
    roll_no: null,
    sendonmail: null,
    session: null,
  });

  useEffect(() => {
    fetchList();

    setSendMail(false);
    if (props?.detail) {
      setDetail((prevDetail) => ({
        ...prevDetail,
        email: props?.detail?.email || "",
        mail_subject: "",
        message: "",
        id: props?.detail?.id || "",
        approved: props?.detail?.approved || 0,
        roll_no: props?.detail?.roll_no || null,
        exam_type: props?.detail?.exam_type || "regular",
      }));
    }
  }, [props.detail]);

  const handleStatusChange = (e) => {
    const { value, name } = e.target;
    setDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendmail = async () => {
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
      bformData.append("data", "adminformmailsend");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      bformData.append("id", detail?.id);
      bformData.append("approved", detail?.approved);

      if (sendMail) {
        bformData.append("sendonmail", 1);
        bformData.append("email", detail?.email);
        bformData.append("subject", detail?.mail_subject);
        bformData.append("message", detail?.message);
      }

      const response = await axios.post(
        `${PHP_API_URL}/StudentSet.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        // toast.success(response?.data?.msg);
        await updateApproved();

        setDetail({
          email: "",
          mail_subject: "",
          message: "",
          approved: "",
          id: "",
          sendonmail: null,
        });
        setSendMail(false);
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

  const updateApproved = async () => {
    setLoading(true);
    
    if (detail?.approved == "1") {
      if (!detail?.roll_no) {
        toast.error("Roll no is required");
        return setLoading(false);
      }
      if (!detail?.exam_type) {
        toast.error("Exam type is required");
        return setLoading(false);
      }
    }
    try {
      let formData = {};
      formData.id = detail?.id;
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      formData.approved = detail?.approved;
      formData.subject = detail?.mail_subject;
      formData.message = detail?.message;
      formData.session = detail?.session;
      formData.exam_type = detail?.exam_type;
      formData.roll_no = detail?.roll_no;

      if (detail?.approved == "1" && !detail?.session) {
        formData.session = localStorage.getItem("session");
      }

      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/adminResponse`,
        formData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        toast.success(response?.data?.message);
        if (formData?.approved == 2) {
          navigate("/admin/application-list");
        }
        props?.submit();
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        // toast.error(
        //   "An error occurred. Please check your connection or try again."
        // );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (detail?.approved == 0) {
      toast.error("Please select application status");
      return;
    }
    if (!sendMail && detail?.approved != 0) {
      await updateApproved();
    }
    if (sendMail) {
      await sendmail();
    }
  };

  const [isFetching, setIsFetching] = useState(false);
  const [sessionList, setSessionList] = useState([]);

  const fetchList = async (deleteStatus = 0) => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/session/fetch`,
        {
          deleteStatus,
          column: "id, dtitle, created_at, status, deleted_at, deleteStatus",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        const tempCat = response.data.map((dep) => ({
          value: dep.id,
          label: dep.dtitle,
        }));

        setSessionList(tempCat);
      } else {
        toast.error("Data not found.");
        setSessionList([]);
      }
    } catch (error) {
      setSessionList([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        setTitleError(error.response.message);
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

  const handleSessionChange = (e) => {
    setDetail((prev) => ({ ...prev, session: e.value }));
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
            name="approved"
            id="approved"
            className="form-control"
            value={detail?.approved}
            onChange={handleStatusChange}
          >
            <option value="0">Select</option>
            <option value="1">Approved</option>
            <option value="2">Rejected</option>
          </select>
        </div>
        {detail?.approved == "1" && (
          <>
            <FormField
              type="text"
              label="Roll No."
              column="col-md-12"
              id="roll_no"
              name="roll_no"
              value={detail?.roll_no}
              onChange={handleStatusChange}
            />
            <div className="form-group col-md-12">
              <label className="font-weight-semibold">Exam Type</label>
              <select
                name="exam_type"
                id="exam_type"
                className="form-control"
                value={detail?.exam_type}
                onChange={handleStatusChange}
              >
                <option value="regular">Regular</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="form-group col-md-12">
              <label className="font-weight-semibold">Select Session</label>
              <Select
                name="session"
                id="session"
                onChange={handleSessionChange}
                options={sessionList}
                value={
                  detail?.session
                    ? sessionList?.find(
                        (session) => session.value == detail?.session
                      ) || null
                    : sessionList?.find(
                        (session) =>
                          session.value == localStorage.getItem("session")
                      ) || null
                }
              ></Select>
            </div>
          </>
        )}
        <div className="form-group col-md-12 d-flex">
          <label className="font-weight-semibold ml-1 " htmlFor="sendMail">
            <input
              id="sendMail"
              name="sendMail"
              checked={sendMail}
              type="checkbox"
              className="mr-2"
              onChange={() => setSendMail(!sendMail)}
            />
            Send On Mail
          </label>
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
            onClick={()=> { props?.close()}}
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

function ViewApplication() {
  const { sid } = useParams();
  const [personalDetails, setPersonalDetails] = useState([]);
  const [document, setDocument] = useState([]);
  const [currentCourse, setCurrentCourse] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [dataForMail, setDataFormMail] = useState();
  const [loading, setLoading] = useState();
  const [allPreviousRegisterSemester, setAllPreviousRegisterSemester] =
    useState([]);

  const divRef = useRef(null);

  const handleDownload = async () => {
    // if (!divRef.current) return;
    // const canvas = await html2canvas(divRef.current);
    // const imgData = canvas.toDataURL("image/png");
    // const link = document.createElement("a");
    // link.href = imgData;
    // link.download = "download.png";
    // link.click();
  };

  useEffect(() => {
    setDataFormMail((prev) => ({
      ...prev,
      ...currentCourse,
      email: personalDetails?.semail,
    }));
  }, [currentCourse, personalDetails]);

  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = sid;
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetchCurrentCourse`,
        formData
      );
      
      if (response.data?.statusCode === 200) {
        const {
          id,
          coursename,
          semtitle,
          groupName,
          subGroupName,
          subject1,
          subject2,
          subject3,
          subject4,
          subject5,
          subject6,
          preview,
          approved,
          level,
          roll_no,
          session,
          exam_type,
        } = response.data?.data || {};
        setCurrentCourse((prev) => ({
          ...prev,
          id,
          preview: preview,
          approved: approved,
          level: level,
          roll_no: roll_no,
          session: session,
          exam_type: exam_type,
          coursename: capitalizeFirstLetter(coursename),
          semtitle: capitalizeFirstLetter(semtitle),
          groupName: capitalizeFirstLetter(groupName),
          subGroupName: capitalizeFirstLetter(subGroupName),
          subject1: capitalizeFirstLetter(subject1),
          subject2: capitalizeFirstLetter(subject2),
          subject3: capitalizeFirstLetter(subject3),
          subject4: capitalizeFirstLetter(subject4),
          subject5: capitalizeFirstLetter(subject5),
          subject6: capitalizeFirstLetter(subject6),
        }));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getStudentSelectedCourse();
  }, []);

  const getStudentPreviewDetail = () => {
    if (sid) {
      studentRecordById(sid).then((res) => {
        if (res.length > 0) {
          setPersonalDetails(res[0]);
        }
      });
    } else {
      setPersonalDetails([]);
      setDocument([]);
    }
  };

  useEffect(() => {
    if (currentCourse?.id) {
      getDocument(currentCourse?.id).then((res) => {
        if (res.length > 0) {
          setDocument(res[0]);
        }
      });
    }
  }, [currentCourse?.id]);

  useEffect(() => {
    getStudentPreviewDetail();
    getAllApprovedSemeter();
  }, [sid]);

  const getAllApprovedSemeter = async () => {
    setLoading(true);
    try {
      let formData = {
        loguserid: secureLocalStorage.getItem("login_id"),
        login_type: secureLocalStorage.getItem("loginType"),
        sid: sid,
        preview: 1,
        approved: 1,
        listing: "Yes",
      };

      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetchAllApprovedSemeter`,
        formData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        setAllPreviousRegisterSemester(response?.data?.data);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        // toast.error(
        //   "An error occurred. Please check your connection or try again."
        // );
      }
    } finally {
      setLoading(false);
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
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </a>
                  <span className="breadcrumb-item">Application list</span>
                  <span className="breadcrumb-item active">
                    View Application
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Student Detail</h5>
                <div className="ml-auto d-flex">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>

                  {currentCourse.approved === 0 && (
                    <>
                      <Link
                        className="btn btn-secondary mr-2"
                        to={`/admin/view-addmission-application/edit/${sid}`}
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Edit
                      </Link>
                      <button
                        className="btn btn-secondary mr-2"
                        onClick={() => setModalShow(true)}
                      >
                        Approved/Reject
                      </button>
                    </>
                  )}
                  {currentCourse.approved === 0 && (
                    <>
                      <button className="btn btn-warning mr-2">Pending</button>
                    </>
                  )}
                  {currentCourse.approved === 1 && (
                    <>
                      <button className="btn btn-success mr-2">Approved</button>
                    </>
                  )}
                  {currentCourse.approved === 2 && (
                    <>
                      <button className="btn btn-danger mr-2">Rejected</button>
                    </>
                  )}

                  <button
                    className="btn btn-dark mr-2"
                    onClick={handleDownload}
                  >
                    <i className="fa-solid fa-print mr-2"></i> Download
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="card-title">Previous Semester Detail</div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Course</th>
                      <th scope="col">Semester</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  {allPreviousRegisterSemester.length > 0 && (
                    <tbody>
                      {allPreviousRegisterSemester.map((data, index) => (
                        <tr key={index}>
                          <td scope="row">{index + 1}</td>{" "}
                          {/* Added +1 to start index from 1 */}
                          <td>{capitalizeFirstLetter(data?.coursename)}</td>
                          <td>{capitalizeFirstLetter(data?.semtitle)}</td>
                          <td>
                            <Link
                              className="btn btn-dark"
                              to={`/admin/application/preview-previous-registration/${sid}/${data.id}`}
                            >
                              Preview
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>

            {currentCourse && (
              <div className="card mt-2" id="pdiv" ref={divRef}>
                <div className="card-body">
                  <div className="row header-top">
                    <div className="col-md-6 col-lg-6 d-flex justify-content-start align-items-center">
                      <img
                        src={rpnlLogo}
                        alt="logo"
                        style={{ width: "35%" }}
                        className="img-fluid"
                      />
                      <div>
                        <h5 className="font-14" style={{ color: "#8F0F50" }}>
                          Dr. Rajendra Prasad National Law University
                        </h5>
                        <h6 className="font-12" style={{ color: "#9E3264" }}>
                          Gaddopur, Phaphamau, Prayagraj, Uttar Pradesh 211013
                        </h6>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6 text-right">
                      <img
                        src={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${personalDetails.spic}`}
                        alt="photograph"
                        style={{ width: "100px", height: "90px" }}
                        className="img-fluid slogo"
                      />
                      <img
                        src={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${personalDetails.ssign}`}
                        alt="photograph"
                        style={{ width: "100px", height: "90px" }}
                        className="img-fluid ml-2 slogo"
                      />
                    </div>
                    <div className="col-md-12 text-center">
                      <h2 className="h2_new">Preview</h2>
                      <hr />
                    </div>
                    <div className="col-md-12">
                      <p className="mb-0">
                        <strong>Registration No:</strong>{" "}
                        {personalDetails.registrationNo}
                      </p>
                      <p>
                        <strong>Enrollment No:</strong>{" "}
                        {personalDetails.enrollmentNo}
                      </p>
                    </div>
                    {/* <div className="col-md-12">
                                        <div className="card">
                                            <div className="alert alert-danger text-danger" role="alert">
                                                <i className="fas fa-exclamation-circle font-18" /> Registration
                                                Rejected.
                                            </div>
                                            <div className="col-md-12">
                                                <p>
                                                    <strong>Note: </strong> Rejection note goes here.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="alert alert-warning text-warning" role="alert">
                                            <i className="fas fa-exclamation-circle font-18" /> Pending.
                                        </div>
                                        <div className="alert alert-success text-success" role="alert">
                                            <i className="fas fa-check-circle font-18" /> Registration Approved.
                                        </div>
                                    </div> */}
                    <div className="col-md-12">
                      <table className="table w-100">
                        <div className="row">
                          <div className="col-md-12">
                            <h6 className="custom font-12">
                              <span className="custo-head">
                                Personal Details
                              </span>
                            </h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Name:</strong> <br />{" "}
                            {personalDetails.sname}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Date Of Birth</strong>{" "}
                            <br />
                            {formatDate(personalDetails.sdob)}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              Father&apos;s Name:
                            </strong>{" "}
                            <br /> {personalDetails.sfather}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              Mother&apos;s Name:
                            </strong>{" "}
                            <br /> {personalDetails.smother}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Gender:</strong> <br />{" "}
                            {personalDetails.sgender}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Religion:</strong>{" "}
                            <br /> {personalDetails.sreligion}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Category: </strong>{" "}
                            <br /> {personalDetails.scategory}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Caste: </strong> <br />{" "}
                            {personalDetails.scaste}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Sub Caste: </strong>{" "}
                            <br /> {personalDetails.ssubcaste}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">ABC Id:</strong> <br />{" "}
                            {personalDetails.sabcid}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Aadhaar No:</strong>{" "}
                            <br /> {personalDetails.saadhaar}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <h6 className="custom font-12">
                              <span className="custo-head">
                                Contact Details
                              </span>
                            </h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Email:</strong> <br />{" "}
                            {personalDetails.semail}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Phone No:</strong>{" "}
                            <br /> {personalDetails.sphone}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              Alternate Phone No:
                            </strong>{" "}
                            <br /> {personalDetails.salterphone}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Whatsapp No:</strong>{" "}
                            <br /> {personalDetails.swhatsapp}
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div className="col-md-12">
                            <h6 className="custom font-12">
                              <span className="custo-head">Address</span>
                            </h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 border">
                            <strong>Address:</strong> <br />{" "}
                            {personalDetails.saddress}
                          </div>
                          <div className="col-md-4 border">
                            <strong>Pin Code:</strong> <br />{" "}
                            {personalDetails.spincode}
                          </div>
                          <div className="col-md-4 border">
                            <strong>City:</strong> <br />{" "}
                            {personalDetails.scity}
                          </div>
                          <div className="col-md-4 border">
                            <strong>State:</strong> <br />{" "}
                            {personalDetails.sstate}
                          </div>
                        </div>
                        {/* Course Section */}
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <h6 className="custom font-12 mt-2">
                              <span className="custo-head">Course</span>
                            </h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Course</strong> <br />{" "}
                            {currentCourse.coursename}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Semester</strong> <br />{" "}
                            {currentCourse.semtitle}
                          </div>
                        </div>
                        {currentCourse?.groupName &&
                          currentCourse?.subGroupName && (
                            <>
                              <div className="row mt-3">
                                <div className="col-md-12">
                                  <h6 className="custom font-12 mt-2">
                                    <span className="custo-head">Group</span>
                                  </h6>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-3 border">
                                  <strong className="font-12">
                                    Group Name
                                  </strong>{" "}
                                  <br /> {currentCourse.groupName}
                                </div>
                                <div className="col-md-3 border">
                                  <strong className="font-12">
                                    Sub Group Name
                                  </strong>{" "}
                                  <br /> {currentCourse.subGroupName}
                                </div>
                              </div>{" "}
                            </>
                          )}

                        {/* Subject Section */}
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <h6 className="custom font-12 mt-2">
                              <span className="custo-head">Subject</span>
                            </h6>
                          </div>
                        </div>
                        <div className="row">
                          {currentCourse.subject1 && (
                            <div className="col-md-4 border">
                              <strong className="font-12">Subject 1</strong>{" "}
                              <br /> {currentCourse.subject1}
                            </div>
                          )}
                          {currentCourse.subject2 && (
                            <div className="col-md-4 border">
                              <strong className="font-12">Subject 2</strong>{" "}
                              <br /> {currentCourse.subject2}
                            </div>
                          )}
                          {currentCourse.subject3 && (
                            <div className="col-md-4 border">
                              <strong className="font-12">Subject 3</strong>{" "}
                              <br /> {currentCourse.subject3}
                            </div>
                          )}
                          {currentCourse.subject4 && (
                            <div className="col-md-4 border">
                              <strong className="font-12">Subject 4</strong>{" "}
                              <br /> {currentCourse.subject4}
                            </div>
                          )}
                          {currentCourse.subject5 && (
                            <div className="col-md-4 border">
                              <strong className="font-12">Subject 5</strong>{" "}
                              <br /> {currentCourse.subject5}
                            </div>
                          )}
                          {currentCourse.subject6 && (
                            <div className="col-md-4 border">
                              <strong className="font-12">Subject 6</strong>{" "}
                              <br /> {currentCourse.subject6}
                            </div>
                          )}
                        </div>

                        {/* High School Details */}
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <h6 className="custom font-12 mt-2">
                              <span className="custo-head">
                                High School Details
                              </span>
                            </h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Roll No</strong> <br />{" "}
                            {document.hroll}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Total Marks</strong>{" "}
                            <br /> {document.htotal_marks}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Marks Obtained</strong>{" "}
                            <br /> {document.hmarks_obtained}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Percentage (%)</strong>{" "}
                            <br /> {document.hpercent}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Board</strong> <br />{" "}
                            {document.hboard}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              School/College/Institution
                            </strong>{" "}
                            <br /> {document.hcollege}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Passing year</strong>{" "}
                            <br /> {document.hpassing_year}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              Marksheet/Certificate
                            </strong>{" "}
                            <br />
                            <Link
                              target="_blank"
                              to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.hmarksheet}`}
                            >
                              <button
                                type="button"
                                className="btn btn-secondary text-white mt-4"
                              >
                                <i className="fas fa-eye text-white"></i>
                              </button>
                            </Link>
                          </div>
                        </div>

                        {/* Intermediate Details */}
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <h6 className="custom font-12 mt-2">
                              <span className="custo-head">
                                Intermediate Details
                              </span>
                            </h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Roll No</strong> <br />{" "}
                            {document.iroll}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Total Marks</strong>{" "}
                            <br /> {document.itotal_marks}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Marks Obtained</strong>{" "}
                            <br /> {document.imarks_obtained}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Percentage (%)</strong>{" "}
                            <br /> {document.ipercent}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">Board</strong> <br />{" "}
                            {document.iboard}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              School/College/Institution
                            </strong>{" "}
                            <br /> {document.icollege}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 border">
                            <strong className="font-12">Passing year</strong>{" "}
                            <br /> {document.ipassing_year}
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              Marksheet/Certificate
                            </strong>{" "}
                            <br />
                            <Link
                              target="_blank"
                              to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.imarksheet}`}
                            >
                              <button
                                type="button"
                                className="btn btn-secondary text-white mt-4"
                              >
                                <i className="fas fa-eye text-white"></i>
                              </button>
                            </Link>
                          </div>
                        </div>

                        {/* Previous Semester/Year Details */}
                        {currentCourse?.semtitle &&
                          currentCourse?.semtitle.toLowerCase() !==
                            "semester 1" && (
                            <>
                              {" "}
                              <div className="row mt-3">
                                <div className="col-md-12">
                                  <h6 className="custom font-12 mt-2">
                                    <span className="custo-head">
                                      Previous Passing Semester/Year Details
                                    </span>
                                  </h6>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-3 border">
                                  <strong className="font-12">Roll No</strong>{" "}
                                  <br /> {document.plroll}
                                </div>
                                <div className="col-md-3 border">
                                  <strong className="font-12">
                                    Total Marks
                                  </strong>{" "}
                                  <br /> {document.pltotal_marks}
                                </div>
                                <div className="col-md-3 border">
                                  <strong className="font-12">
                                    Marks Obtained
                                  </strong>{" "}
                                  <br /> {document.plmarks_obtained}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-3 border">
                                  <strong className="font-12">
                                    Percentage (%)
                                  </strong>{" "}
                                  <br /> {document.plpercent}
                                </div>
                                <div className="col-md-3 border">
                                  <strong className="font-12">Board</strong>{" "}
                                  <br /> {document.plboard}
                                </div>
                                <div className="col-md-3 border">
                                  <strong className="font-12">
                                    School/College/Institution
                                  </strong>{" "}
                                  <br /> {document.plcollege}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-3 border">
                                  <strong className="font-12">
                                    Passing year
                                  </strong>{" "}
                                  <br /> {document.plpassing_year}
                                </div>
                                <div className="col-md-3 border">
                                  <strong className="font-12">
                                    Marksheet/Certificate
                                  </strong>{" "}
                                  <br />
                                  <Link
                                    target="_blank"
                                    to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.plmarksheet}`}
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-secondary text-white mt-4"
                                    >
                                      <i className="fas fa-eye text-white"></i>
                                    </button>
                                  </Link>
                                </div>
                              </div>{" "}
                            </>
                          )}
                        {/* Graduation Details */}
                        {currentCourse?.level === "PG" && (
                          <>
                            <div className="row mt-3">
                              <div className="col-md-12">
                                <h6 className="custom font-12 mt-2">
                                  <span className="custo-head">
                                    Graduation Details
                                  </span>
                                </h6>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-3 border">
                                <strong className="font-12">Roll No</strong>{" "}
                                <br /> {document.groll}
                              </div>
                              <div className="col-md-3 border">
                                <strong className="font-12">Total Marks</strong>{" "}
                                <br /> {document.gtotal_marks}
                              </div>
                              <div className="col-md-3 border">
                                <strong className="font-12">
                                  Marks Obtained
                                </strong>{" "}
                                <br /> {document.gmarks_obtained}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-3 border">
                                <strong className="font-12">
                                  Percentage (%)
                                </strong>{" "}
                                <br /> {document.gpercent}
                              </div>
                              <div className="col-md-3 border">
                                <strong className="font-12">Board</strong>{" "}
                                <br /> {document.gboard}
                              </div>
                              <div className="col-md-3 border">
                                <strong className="font-12">
                                  School/College/Institution
                                </strong>{" "}
                                <br /> {document.gcollege}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-3 border">
                                <strong className="font-12">
                                  Passing year
                                </strong>{" "}
                                <br /> {document.gpassing_year}
                              </div>
                              <div className="col-md-3 border">
                                <strong className="font-12">
                                  Marksheet/Certificate
                                </strong>{" "}
                                <br />
                                <Link
                                  target="_blank"
                                  to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.gmarksheet}`}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-secondary text-white mt-4"
                                  >
                                    <i className="fas fa-eye text-white"></i>
                                  </button>
                                </Link>
                              </div>
                            </div>{" "}
                          </>
                        )}
                        {/* Additional Documents */}
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <h6 className="custom font-12 mt-2">
                              <span className="custo-head">Document</span>
                            </h6>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-3 border">
                            <strong className="font-12">TC</strong> <br />
                            <Link
                              target="_blank"
                              to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.dtc}`}
                            >
                              <button
                                type="button"
                                className="btn btn-secondary text-white mt-4"
                              >
                                <i className="fas fa-eye text-white"></i>
                              </button>
                            </Link>
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              Character Certificate
                            </strong>{" "}
                            <br />
                            <Link
                              target="_blank"
                              to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.character_certificate}`}
                            >
                              <button
                                type="button"
                                className="btn btn-secondary text-white mt-4"
                              >
                                <i className="fas fa-eye text-white"></i>
                              </button>
                            </Link>
                          </div>
                          <div className="col-md-3 border">
                            <strong className="font-12">
                              Cast Certificate
                            </strong>{" "}
                            <br />
                            <Link
                              target="_blank"
                              to={`${FILE_API_URL}/student/${personalDetails.id}${personalDetails.registrationNo}/${document.caste_certificate}`}
                            >
                              <button
                                type="button"
                                className="btn btn-secondary text-white mt-4"
                              >
                                <i className="fas fa-eye text-white"></i>
                              </button>
                            </Link>
                          </div>
                        </div>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        detail={dataForMail}
        close={() => setModalShow(false)}
        submit={() => {
          setModalShow(false);
          getStudentSelectedCourse();
        }}
      />
    </>
  );
}

export default ViewApplication;
