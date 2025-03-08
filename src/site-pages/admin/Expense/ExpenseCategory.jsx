import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { PHP_API_URL } from "../../../site-components/Helper/Constant";
import "../../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { DeleteSweetAlert } from "../../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import useRolePermission from "../../../site-components/admin/useRolePermission";
import { useNavigate } from "react-router-dom";

const MyVerticallyCenteredModal = (props = {}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const id = props?.selectedmarque?.id;

  useEffect(() => {
    setContent(props?.selectedmarque?.cat_title || "");
  }, [props.selectedmarque]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "AddExpenseCategory");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("cat_title", content);

      

      if (id) {
        bformData.append("updateid", id);
      }

      const response = await axios.post(
        `${PHP_API_URL}/expense.php`,
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
        <Modal.Title id="contained-modal-title-vcenter">
         {id ? "Update Expense Category" : "Add New Expense Category"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group col-md-12">
          <label className="font-weight-semibold" htmlFor="content">
            Expense Category Name
          </label>
          <input
            type="text"
            className="form-control"
            name="content"
            placeholder="Enter Expense Category"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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

const ExpenseCategory = () => {
  const [MarqueList, setMarqueList] = useState([]);
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");

  const [loading, setLoading] = useState(false);
  const [selectedmarque, setSelectedMarque] = useState(null);
  const [modalShow, setModalShow] = useState(false);

   const { RolePermission, hasPermission } = useRolePermission();
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() => {
      if (RolePermission && RolePermission.length > 0) {
        if (!hasPermission("Expense Category", "create")) {
          navigate("/forbidden");
        }
      }
    }, [RolePermission, hasPermission]);

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
      bformData.append("delete_status", 1);
      bformData.append("data", "load_ExpenseCategory");

      const response = await axios.post(
        `${PHP_API_URL}/expense.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMarqueList(response.data.data);
    } catch (error) {
      setMarqueList([]);

      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarqueList = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_ExpenseCategory");

      const response = await axios.post(
        `${PHP_API_URL}/expense.php`,
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
      bformData.append("data", "delete_category");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert(" ");
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/expense.php`,
          bformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == 200) {
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
      bformData.append("data", "toggle_expenseCategory");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/expense.php`,
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="">
              <nav className="breadcrumb breadcrumb-dash">
              <a href="/admin/" className="breadcrumb-item">
                                     <i className="fas fa-home m-r-5" />
                                    Dashboard
                                   </a>
                                   <span className="breadcrumb-item active">
                                   Expense Management
                                   </span>
                <span className="breadcrumb-item active">
                  Expense Category{" "}
                </span>
              </nav>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new pt-2"> Expense Category</h5>
                <div className="mr-auto id-mobile-go-back">
                  <Button
                    variant="light"
                    onClick={() => window.history.back()}
                    className="mb-2 mb-md-0 mr-2"
                  >
                    <i className="fas">
                      <FaArrowLeft />
                    </i>{" "}
                    Go Back
                  </Button>
                  {hasPermission("Expense Category","recycle bin") && (
                  <Button
                    className={`btn ${
                      recycleTitle === "Show Recycle Bin"
                        ? "btn-secondary"
                        : "btn-danger"
                        
                    } ml-auto`}
                    onClick={showRecyleBin}
                  >
                    {!isMobile && recycleTitle} <i className="fa fa-recycle"></i>
                  </Button>
                  )}
                  {hasPermission("Expense Category","create") && (
                  <Button
                    className="ml-2  mb-md-0 btn btn-secondaary"
                    onClick={() => setModalShow(true)}
                  >
                    <i className="fas">
                      <IoMdAdd />
                    </i>{" "}
                    Add New
                  </Button>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="table-responsive d-flex flex-wrap">
                {MarqueList.map((item, index) => (
                  <div key={index} className="col-md-4  flex-wrap">
                    <div className="card">
                      <div
                        className="card-body d-flex justify-content-between"
                        style={{
                          padding: "10px",
                        }}
                      >
                        <h6 className="d-flex align-items-center  justify-content-start">
                          {capitalizeFirstLetter(item.cat_title)}
                        </h6>

                        <div className="d-flex align-items-center  justify-content-start">
                          {hasPermission("Expense Category","status") && (
                          <div className="switch ">
                            <input
                              type="checkbox"
                              checked={item.status == 1 ? true : false}
                              onChange={() => updateStatus(item.id)}
                              className="facultydepartment-checkbox"
                              id={`switch${item.id}`}
                            />
                            <label
                              className="mt-0"
                              htmlFor={`switch${item.id}`}
                            ></label>
                          </div>
                          )}

                            {hasPermission("Expense Category","update") && (
                          <div className="d-flex ">
                            <div
                              onClick={() => editMarque(index)}
                              className="avatar avatar-icon avatar-md avatar-orange"
                            >
                              <i className="fas fa-edit"></i>
                            </div>
                          </div>
                          )}
                           
                          {hasPermission("Expense Category","delete") && item.delete_status == 0 ? (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">Delete</Tooltip>
                              }
                            >
                              <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                                <i
                                  className="fas fa-trash-alt"
                                  onClick={() => deleteMarque(item.id)}
                                ></i>
                              </div>
                            </OverlayTrigger>
                          ) : (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">Restore</Tooltip>
                              }
                            >
                              <div className="avatar ml-2 avatar-icon avatar-md avatar-lime">
                                <i
                                  className="fas fa-recycle"
                                  onClick={() => deleteMarque(item.id)}
                                ></i>
                              </div>
                            </OverlayTrigger>
                          )}
                        
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        close={() => {
          setModalShow(false);
          setSelectedMarque(null);
        }}
        submit={() => {
          loadMarqueList();
          setSelectedMarque(null);
          setModalShow(false);
        }}
        selectedmarque={selectedmarque}
      />
    </>
  );
};

export default ExpenseCategory;
