import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";

import { IoMdAdd } from "react-icons/io";

import { Link } from "react-router-dom";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

const MyVerticallyCenteredModal = (props = {}) => {
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const id = props?.selectedmarque?.id;

  useEffect(() => {
    setContent(props?.selectedmarque?.content || "");
    setLink(props?.selectedmarque?.link || "");
  }, [props.selectedmarque]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    if (!link.trim()) {
      toast.error("Link cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "mrq_slider_add");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("content", content);
      bformData.append("link", link);

      if (id) {
        bformData.append("updateid", id);
      }

      const response = await axios.post(
        `${PHP_API_URL}/mrq_slider.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success(response?.data?.msg);
        setContent("");
        setLink("");
        props.submit();
      } else {
        toast.error("Failed to submit");
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
        <Modal.Title id="contained-modal-title-vcenter">{id ? "Update Slider" : "Add New Slider"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group col-md-12">
          <label className="font-weight-semibold" htmlFor="content">
            Content
          </label>
          <textarea
            type="text"
            className="form-control"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group col-md-12 d-none">
          <label className="font-weight-semibold" htmlFor="link">
            Link
          </label>
          <input
            type="text"
            className="form-control"
            name="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={loading}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="mx-auto">
          <Button
            onClick={props.close}
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

const MarqueSlide = () => {
  const navigate = useNavigate();

  const [MarqueList, setMarqueList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [loading, setLoading] = useState(false);
  const [selectedmarque, setSelectedMarque] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const editMarque = (index) => {
    const currentLob = MarqueList[index];
    setSelectedMarque(currentLob);
  };
  useEffect(() => {
    if (selectedmarque != null) {
      setModalShow(true);
    }
  }, [selectedmarque]);

  useEffect(() => {
    loadMarqueList();
  }, []);

  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin" ? getDeletedMarque() : loadMarqueList();
  };

  const getDeletedMarque = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_mrq_slider");
      bformData.append("delete_status", 1);

      const response = await axios.post(
        `${PHP_API_URL}/mrq_slider.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMarqueList(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarqueList = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_mrq_slider");

      const response = await axios.post(
        `${PHP_API_URL}/mrq_slider.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMarqueList(response.data.data);
    } catch (error) {
      console.error("Error fetching  data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMarque = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_mrq_slider");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/mrq_slider.php`,
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
            ? loadMarqueList()
            : getDeletedMarque();
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
        `${PHP_API_URL}/mrq_slider.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == "200") {
        const updatedMarques = MarqueList?.map((marque) =>
          marque.id === id ? { ...marque, status: !marque.status } : marque
        );
        toast.success(response.data.msg);

        setMarqueList(updatedMarques);
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
            <div className="mt-0">
              <nav className="breadcrumb">
              <a href="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </a>

                <span className="breadcrumb-item active">CMS</span>
                <span className="breadcrumb-item active">Important Update Sliders</span>
              </nav>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Important Update Sliders List</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Button
                    variant="dark"
                    className="ml-2 mb-2 mb-md-0 btn-secondary"
                    onClick={() => setModalShow(true)}
                  >
                    <i className="fas">
                      <IoMdAdd />
                    </i>{" "}
                    Add New
                  </Button>
                </div>
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
                  <div className="col-md-4 col-lg-4 col-10 col-sm-4">
                    <button
                      className={`btn ${recycleTitle === "Show Recycle Bin"
                        ? "btn-secondary"
                        : "btn-danger"
                        }`}
                      onClick={showRecyleBin}
                    >
                      {recycleTitle} <i className="fa fa-recycle"></i>
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
                      value={MarqueList}
                      paginator
                      rows={10}
                      rowsPerPageOptions={[10, 25, 50]}
                      globalFilter={globalFilter}
                      emptyMessage="No records found"
                      className="p-datatable-custom"
                      tableStyle={{ minWidth: "10rem" }}
                      sortMode="multiple"
                    >
                      <Column
                        body={(rowData, { rowIndex }) => rowIndex + 1}
                        header="#"
                        style={{ width: "5%" }}
                        sortable
                      />

                      <Column field="content" header="Marque" sortable />

                      <Column
                        style={{ width: "15%" }}
                        header="Add Keynote"
                        body={(rowData, { rowIndex }) => (
                          <div className="d-flex justify-content-around">
                            <Link
                              to={`/admin/add-keynote-speaker/${rowData.id}`}
                              variant="dark"
                              className="px-3 py-1 btn-secondary rounded"
                            >
                              Keynote
                            </Link>
                          </div>
                        )}
                        sortable
                      />
                      <Column
                        style={{ width: "15%" }}
                        header="Action"
                        body={(rowData, { rowIndex }) => (
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
                              onClick={() => editMarque(rowIndex)}
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
                                    onClick={() => deleteMarque(rowData.id)}
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
                                    onClick={() => deleteMarque(rowData.id)}
                                  ></i>
                                </div>
                              </OverlayTrigger>
                            )}
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">
                                  Keynote list
                                </Tooltip>
                              }
                            >
                              <Link
                                className="avatar ml-2 avatar-icon avatar-md avatar-lime"
                                to={`/admin/keynote-speaker-list/${rowData.id}`}
                              >
                                <i className="fas fa-list"></i>
                              </Link>
                            </OverlayTrigger>
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
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        close={() => setModalShow(false)}
        submit={() => {
          loadMarqueList();
          setModalShow(false);
        }}
        selectedmarque={selectedmarque}
      />
    </>
  );
};

export default MarqueSlide;
