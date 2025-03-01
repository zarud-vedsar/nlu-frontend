import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";

import { FaArrowLeft } from "react-icons/fa6";

import { NODE_API_URL } from "../../site-components/Helper/Constant";

import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

import pdf_image from "../../site-components/admin/assets/images/avatars/pdf-icon.webp";

const MyVerticallyCenteredModal = (props = {}) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [submit, setSubmit] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if (id === "file") {
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload file");
      return;
    }
    setSubmit(true);
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("title", title);
      bformData.append("pdf_file", file);

      const response = await axios.post(
        `${NODE_API_URL}/api/file-manager/register`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        toast.success(response?.data?.message);
        setTitle("");
        props?.submit();
      } else {
        toast.error("Failed to submit content");
      }
    } catch (error) {
      if (
        error.response.data?.statusCode === 400 ||
        error.response.data?.statusCode === 500
      ) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setSubmit(false);
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
        <Modal.Title id="contained-modal-title-vcenter">
          Upload File
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group col-md-12">
          <label className="font-weight-semibold" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submit}
          />
        </div>
        <div className="form-group col-md-12 ">
          <label>
            File <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            id="file"
            className="form-control"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="mx-auto">
          <Button
            onClick={props?.close}
            className="btn btn-danger"
            disabled={submit}
          >
            Close
          </Button>{" "}
          <Button
            onClick={handleSubmit}
            className="btn btn-success"
            disabled={submit}
          >
            {submit ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const FileManager = () => {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    load_vendor();
  }, []);

  const load_vendor = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${NODE_API_URL}/api/file-manager/fetch`
      );
      if (
        response?.data?.statusCode === 200 &&
        response?.data?.data.length > 0
      ) {
        setMessages(
          response.data.data
            .map((data) => ({
              ...data,
              link: `${NODE_API_URL}/public/upload/${data.pdf_file}`,
            }))
            .reverse()
        );
      } else {
        setMessages([]);
      }
    } catch (error) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (link, index) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="">
              <nav className="breadcrumb">
                <a href="/admin/" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" />
                  Dashboard
                </a>

                <span className="breadcrumb-item active">File Manager</span>
              </nav>
            </div>

            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new">File List</h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    onClick={() => window.history.back()}
                    className="mb-2 mb-md-0 btn mr-2 btn-light"
                  >
                    <i className="fas">
                      <FaArrowLeft />
                    </i>{" "}
                    Go Back
                  </button>

                  <button
                    className="btn btn-success py-2"
                    onClick={() => setModalShow(true)}
                  >
                    {" "}
                    Upload File{" "}
                    <i className="fa fa-upload" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="row">
                {messages.map((item, index) => (
                  <div key={index} className="col-md-3 mt-3 flex-wrap">
                    <div className="card">
                      <div className="card-body">
                        <div className="row ">
                          <div className="rs-container">
                            <img
                              src={pdf_image}
                              style={{
                                width: "auto",
                                maxWidth: "100%",
                                height: "150px",
                              }}
                              alt="Avatar"
                              className="rs-image mx-auto border_10"
                            />
                          </div>
                        </div>
                        <div className="row px-2 d-flex justify-content-between">
                          <div >
                            <h6 className="h6_new card-title mt-2 ">
                              {item.title || " "}
                            </h6>
                          </div>
                       
                            <div className="">
                              {copiedIndex === index ? (
                                <span className="text-success">Copied!</span>
                              ) : (
                                <button
                                  className="btn btn-warning"
                                  onClick={() => copyToClipboard(item.link, index)}
                                >
                                  <i class="fa-solid fa-copy"></i>
                                </button>
                              )}
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <MyVerticallyCenteredModal
          show={modalShow}
          close={() => setModalShow(false)}
          submit={() => {
            setModalShow(false);
            load_vendor();
          }}
        />
      </div>
    </>
  );
};

export default FileManager;
