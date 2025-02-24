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
import validator from 'validator';


const MarqueSlide = () => {
  const navigate = useNavigate();

  const [MarqueList, setMarqueList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [loading, setLoading] = useState(false);


 

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
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new">Important Update Sliders List</h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link
                    className="ml-2 mb-2 mb-md-0 btn-secondary btn"
                    to="/admin/add-marque"
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
                  <div className="col-md-4 col-lg-4 col-10 col-sm-4 mb-3">
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

                      <Column body={(row) => validator.unescape(row?.content || "")} header="Marque" sortable />

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
                            <Link
                            to={`/admin/add-marque/${rowData.id}`}
                            
                              className="avatar avatar-icon avatar-md avatar-orange"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>

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
      
    </>
  );
};

export default MarqueSlide;
