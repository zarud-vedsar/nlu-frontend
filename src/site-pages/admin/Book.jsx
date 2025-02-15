import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,

  Spinner,

} from "react-bootstrap";

import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";


import { Link } from "react-router-dom";
import {
  FILE_API_URL,
  NODE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

const MyVerticallyCenteredModal = (props = {}) => {
  const [vendor, setVendor] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [submit, setSubmit] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;
    if (id === "csvFile") {
      setCsvFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!csvFile) {
      toast.error("Please select csv file");
      return;
    }
    setSubmit(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "bulk_book_add");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("vendor", vendor);
      bformData.append("csvfile", csvFile);

      for (let [key, value] of bformData) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success(response?.data?.msg);
        setVendor("");
        props?.submit();
      } else {
        toast.error("Failed to submit content");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred. Please try again later.");
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
          Import File
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group col-md-12">
          <label className="font-weight-semibold" htmlFor="vendor">
            Vendor Name
          </label>
          <input
            type="text"
            className="form-control"
            name="vendor"
            value={vendor}
            onChange={(e) => setContent(e.target.value)}
            disabled={submit}
          />
        </div>
        <div className="form-group col-md-12 ">
          <label>
            File <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            id="csvFile"
            accept=""
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group col-md-12">
          <p>
            Download PDF
            <a
              href={`${FILE_API_URL}/bulk_bookSample.csv`}
              download="bulk_bookSample.csv"
            >
              {" "}
              bulk_bookSample.csv
            </a>
          </p>
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
const UploadBookModal = (props = {}) => {
  const [file, setfile] = useState(null);
  const [submit, setSubmit] = useState(false);

  console.log(props);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;
    if (!file) return;
    if (id === "file") {
      setfile(file);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select file");
      return;
    }
    setSubmit(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "book_pdf_update");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("book_id", props?.book?.id);
      bformData.append("pdffile", file);
      bformData.append(
        "old_pdf",
        props?.book?.pdf_file ? props?.book?.pdf_file : null
      );

      for (let [key, value] of bformData) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success(response?.data?.msg);
        setfile(null);
        props?.submit();
      } else {
        toast.error("Failed to submit content");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred. Please try again later.");
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
        <div className="form-group col-md-12 ">
          <label>
            File <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            className="form-control"
            onChange={handleFileChange}
          />
          {props?.book?.pdf_file && (
            <p className="text-danger">File is already uploaded</p>
          )}
        </div>
        {props?.book?.pdf_file && (
          <div className="form-group col-md-12">
            <p>
              View File
              <a
                href={`${FILE_API_URL}/lib_books/${props?.book?.pdf_file}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {props?.book?.pdf_file}
              </a>
            </p>
          </div>
        )}
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

const Book = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [uploadBookModal, setUploadBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(false);

  useEffect(() => {
    load_vendor();
  }, []);

  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin" ? getDeletedUserList() : load_vendor();
  };
  const getDeletedUserList = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_book");
      bformData.append("delete_status", 1);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessages(response.data.data);
    } catch (error) {
      setMessages([]);
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const load_vendor = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_book");

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setMessages(response.data.data);
    } catch (error) {
      setMessages([]);

      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const editDetail = (id) => {
    navigate(`/admin/edit-book-detail/${id}`);
  };

  const deleteMessage = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_book");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert(" ");
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/lib_books.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == "200") {
          toast.success(response.data.msg);
          recycleTitle === "Show Recycle Bin"
            ? load_vendor()
            : getDeletedUserList();
        }
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else if (status == 400) {
        toast.error(error.response.data.msg);
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
    }
  };
  const updateStatus = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "toggle_status");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == "200") {
        const updatedFaculty = messages?.map((faculty) =>
          faculty.id === id ? { ...faculty, status: !faculty.status } : faculty
        );
        toast.success(response.data.msg);

        setMessages(updatedFaculty);
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else if (status == 400) {
        toast.error(error.response.data.msg);
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="">
              <nav className="breadcrumb">
                <a href="/" className="breadcrumb-item">
                  Library
                </a>

                <span className="breadcrumb-item active">Book</span>
              </nav>
            </div>

            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Book List</h5>
                <div className="ml-auto">
                  <Button
                    variant="light"
                    onClick={() => window.history.back()}
                    className="mb-2 mb-md-0"
                  >
                    <i className="fas">
                      <FaArrowLeft />
                    </i>{" "}
                    Go Back
                  </Button>

                  <Link
                    className="ml-2 mb-2 mb-md-0 btn btn-secondary"
                    to="/admin/add-book"
                  >
                    <i className="fas">
                      <IoMdAdd />
                    </i>{" "}
                    Add New
                  </Link>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-7 col-lg-7 col-12 col-sm-8 p-input-icon-left mb-3 d-flex justify-content-start align-items-center">
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
                  <div className="col-md-5 col-lg-5 col-5 col-sm-2  ">
                    <button
                      className={`btn mr-2 ${recycleTitle === "Show Recycle Bin"
                          ? "btn-secondary"
                          : "btn-danger"
                        }`}
                      onClick={showRecyleBin}
                    >
                      {recycleTitle} <i className="fa fa-recycle"></i>
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => setModalShow(true)}
                    >
                      {" "}
                      Import Books{" "}
                      <i className="fa fa-upload" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <DataTable
                      value={messages}
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

                      <Column
                        header="Book"
                        body={(rowData) => (
                          <div
                            className="info-column d-flex align-items-center
"
                          >
                            <div className="info-image mr-4 d-flex justify-content-center align-items-center">
                              {rowData.image ? (
                                <img
                                  src={`${FILE_API_URL}/books/${rowData.image}`}
                                  alt=""
                                  style={{
                                    width: "40px",
                                    height: "60px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className=" d-flex justify-content-center align-items-center "
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "40px",
                                    height: "60px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className=" d-flex justify-content-center align-items-center"
                                >
                                  {rowData?.book_name[0].toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        sortable
                      />
                      <Column field="book_name" header="Book Name" sortable />

                      <Column field="isbn_no" header="ISBN Number" sortable />
                      <Column field="qty" header="Quantity" sortable />
                      <Column field="price" header="Price" sortable />
                      <Column
                        header="Upload PDF"
                        body={(rowData) => (
                          <>
                            {rowData?.pdf_file ? (
                              <div className="d-flex justify-content-around">
                                <button
                                  className="btn btn-warning"
                                  onClick={() => {
                                    setUploadBookModal(true),
                                      setSelectedBook(rowData);
                                  }}
                                >
                                  <i className="fa-solid fa-file-pen"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex justify-content-around">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    setUploadBookModal(true),
                                      setSelectedBook(rowData);
                                  }}
                                >
                                  <i
                                    className="fa fa-upload"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      />

                      <Column
                        style={{ width: "10%" }}
                        header="Action"
                        body={(rowData) => (
                          <div className="d-flex justify-content-around">
                            <div className="switch mt-1 w-auto">
                              <input
                                type="checkbox"
                                checked={rowData.status == 1 ? true : false}
                                onChange={() => updateStatus(rowData.id)}
                                className="facultydepartment-checkbox"
                                id={`switch${rowData.id}`}
                              />
                              <label
                                className="mt-0"
                                htmlFor={`switch${rowData.id}`}
                              ></label>
                            </div>
                            <div
                              onClick={() => editDetail(rowData.id)}
                              className="avatar avatar-icon avatar-md avatar-orange"
                            >
                              <i className="fas fa-edit"></i>
                            </div>
                            {rowData.delete_status == 0 ? (
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
                                    onClick={() => deleteMessage(rowData.id)}
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
                                    onClick={() => deleteMessage(rowData.id)}
                                  ></i>
                                </div>
                              </OverlayTrigger>
                            )}
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
          close={() => setModalShow(false)}
          submit={() => {
            setModalShow(false);
            load_vendor();
          }}
        />
        <UploadBookModal
          show={uploadBookModal}
          close={() => setUploadBookModal(false)}
          submit={() => {
            setUploadBookModal(false);
            load_vendor();
          }}
          book={selectedBook}
        />
      </div>
    </>
  );
};

export default Book;
