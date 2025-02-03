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
} from "../../site-components/Helper/Constant";
import { dataFetchingPost } from "../../site-components/Helper/HelperFunction";
import { Modal, Spinner } from "react-bootstrap";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
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
    if (props.selectedMessage?.msg) {
      decodeHtml(props.selectedMessage?.msg).then((decoded) => {
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
          {props.selectedMessage?.sub}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive d-flex flex-wrap">
          <div
            dangerouslySetInnerHTML={{ __html: props?.selectedMessage?.msg }}
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
  const [detail, setDetail] = useState({
    email: "",
    subject: "",
    message: "",
    conId: "",
  });

  useEffect(() => {
    if (props?.detail) {
      setDetail((prevDetail) => ({
        ...prevDetail,
        email: props?.detail?.email || "",
        mail_subject: "",
        message: "",
        conId: props?.detail?.id || "",
      }));
    }
  }, [props.detail]);

  const handleSubmit = async () => {
    if (!detail?.mail_subject) {
      toast.error("Please enter mail_subject");
      return;
    }
    if (!detail?.message) {
      toast.error("Please enter message");
      return;
    }
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "send_contact_Email");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("email", detail?.email);
      bformData.append("mail_subject", detail?.mail_subject);
      bformData.append("message", detail?.message);
      bformData.append("conId", detail?.conId);

      for (let [key, value] of bformData) {
        console.log(key, value);
      }
      const response = await axios.post(`${PHP_API_URL}/front.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success(response?.data?.msg);
        setDetail({
          email: "",
          mail_subject: "",
          message: "",
        });
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

const ContactHistory = () => {
  const { id } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);

  const [customerDetail, setCustomerDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

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
      getFacultyDetail();
    }
  }, [id]);

  const loadConversationHistory = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "get_contact_reply");
      bformData.append("id", id);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      const response = await axios.post(`${PHP_API_URL}/front.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setConversation(response.data.data);
    } catch (error) {
      setConversation([]);
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFacultyDetail = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "get_contact_by_id");
      bformData.append("id", id);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const res = await axios.post(`${PHP_API_URL}/front.php`, bformData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.status === 200) {
        setCustomerDetail(res?.data?.data[0]);
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
            <nav className="breadcrumb">
              <a href="/" className="breadcrumb-item">
                Inquery
              </a>

              <span className="breadcrumb-item active">Contact</span>
            </nav>
          </div>
        

        <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Contact Info</h5>
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
                            className="avatar avatar-badge avatar-icon avatar-green d-flex align-items-center"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <span className="m-auto">
                              {customerDetail?.name?.charAt(0) || ""}
                            </span>
                          </div>
                        </div>
                        <div className="text-center text-sm-left m-v-15 p-l-30">
                          <h6 className="m-b-5 h6_new mr-2 font-15">
                            {customerDetail?.name || "No name"}
                          </h6>
                          <p className="mb-0 font-12">
                            <span className="text-dark font-weight-semibold">
                              Contact Date:
                            </span>{" "}
                            <span className="font-12">
                              {customerDetail?.date
                                ? new Date(
                                    customerDetail?.date
                                  ).toLocaleDateString("en-GB")
                                : "N/A"}
                            </span>
                          </p>
                          <button
                            type="button"
                            className="text-start mx-1 mt-3 btn btn-primary btn-tone"
                            onClick={() => setModalShow(true)}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                      <p>
                        <strong>Subject:</strong>{" "}
                        {customerDetail?.subject || "No subject"}
                      </p>
                      <p>
                        <strong>Message:</strong>{" "}
                        {customerDetail?.message || "No message"}
                      </p>
                    </div>
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
                                {customerDetail?.number || "N/A"}
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
              <div className="text-center">No contact details available.</div>
            )}
          </div>
        </div>

        <div className="card">
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

                  <Column field="uemail" header="Email" sortable />

                  <Column field="sub" header="Subject" sortable />

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

export default ContactHistory;
