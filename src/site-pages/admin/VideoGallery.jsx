import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Table,
  Spinner,
  Col,
  Row,
  InputGroup,
} from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import {
  NODE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../../site-components/Helper/HelperFunction";
import { Link } from "react-router-dom";
const VideoGallery = () => {
  const navigate = useNavigate();
  const [gallery, setGallery] = useState([]);
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
  const [category, setCategory] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData= async()=>{
    setLoading(true);
    await getGallery();
    await loadCategory();
    setLoading(false);
    }
    loadData()
  }, []);

  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    recycleTitle === "Show Recycle Bin" ? getDeletedGallery() : getGallery();
  };

  const getDeletedGallery = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getGallery");
      bformData.append("delete_status", 1);
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/video_gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      response.data.data.map((gallery) => {
        gallery.gallery_videos = gallery.gallery_videos.split("$;");
      });

      setGallery(response.data.data);
    } catch (error) {
      setGallery([]);
      console.error("Error fetching faculty data:", error);
    } finally {
    }
  };

  const getGallery = async () => {
    console.log("getgallery");

    try {
      const bformData = new FormData();
      bformData.append("data", "getVideoGallery");
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));

      const response = await axios.post(
        `${PHP_API_URL}/video_gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      response.data.data.map((gallery) => {
        gallery.gallery_videos = gallery.gallery_videos.split("$;");
      });
      
      setGallery(response.data.data);
      console.log(setGallery)
    } catch (error) {
      setGallery([]);

      console.error("Error fetching faculty data:", error);
    } finally {
    }
  };

  const editDetail = (id) => {
    console.log(`/admin/edit-video-gallery/${id}`);
    navigate(`/admin/edit-video-gallery/${id}`);
  };

  const deleteGallery = async (id) => {
    try {
      const bformData = new FormData();

      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "delete_gallery");
      bformData.append("id", id);

      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/video_gallery.php`,
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
            ? getGallery()
            : getDeletedGallery();
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
        `${PHP_API_URL}/video_gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == "200") {
        const updatedFaculty = gallery?.map((faculty) =>
          faculty.id === id ? { ...faculty, status: !faculty.status } : faculty
        );
        toast.success(response.data.msg);

        setGallery(updatedFaculty);
      }
    } catch (error) {
      setGallery([]);

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

  const loadCategory = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_mediaCategory");

      const response = await axios.post(
        `${PHP_API_URL}/gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const tempCat = response.data.data.reduce((acc, dep) => {
        acc[dep.id] = dep.cat_title;
        return acc;
      }, {});  
      setCategory(tempCat);

    } catch (error) {
      setCategory([]);
      console.error("Error fetching  data:", error);
    } finally {
    }
  };
  const getCategoryName = (cat_id)=>{
    if(category[cat_id]){
      const res = capitalizeFirstLetter(category[cat_id]);
      return res;
    }
    return " ";
  }
  if(loading){
    return (
      <div className="page-container">
      <div className="main-content ">
      <div className="container-fluid ">
      <div className="text-center">Loading...</div>
      </div>
      </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-container">
        <div className="main-content">
        <div className="container-fluid">
          <div className="">
            <nav className="breadcrumb">
              <a href="/" className="breadcrumb-item">
                CMS
              </a>

              <span className="breadcrumb-item active">Gallery Video</span>
            </nav>
          </div>
          <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Gallery Video</h5>
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

              <Button
                className={`btn ml-2 ${
                  recycleTitle === "Show Recycle Bin"
                    ? "btn-secondary"
                    : "btn-danger"
                }`}
                onClick={showRecyleBin}
              >
                {recycleTitle} <i className="fa fa-recycle"></i>
              </Button>

              <Link variant="dark" className="ml-2 mb-2 mb-md-0 btn btn-secondary" to='/admin/video-galleryform'>
                  <i className="fas">
                    <IoMdAdd />
                  </i>{" "}
                  Add New
              </Link>
                </div>
              </div>
            </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="table-responsive d-flex flex-wrap">
              {gallery.map((item, index) => (
                <div key={index} className="col-md-3 mt-3 flex-wrap">
                  <div className="card">
                    <div className="card-body">
                    <h6 className="badge " style={{backgroundColor:"#0100ff36",color:"#786969"}}>
                        {`# ${getCategoryName(item.cat_id)}`}
                      </h6>
                      
                      <div className="rs-container">
                      
                      <video
                                  style={{
                                    width: "auto",
                                    maxWidth: "100%",
                                    height: "150px",
                                  }}
                                  alt="Avatar"
                                  className="rs-image mx-auto border_10"
                                >
                                  <source  src={`${NODE_API_URL}/public/upload/vidGallery/${item.gallery_videos[0]}`} />
                                  Your browser does not support the video tag.
                                </video>
                             
                        <div className="rs-overlay">
                          <div className="rs-text">
                            <a
                              className="btn btn-dark"
                              onClick={() =>
                                navigate(`/admin/view-gallery-video/${item.id}`)
                              }
                            >
                              <i className="fas fa-eye"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <h6 className="h6_new card-title mt-2 ">
                        {capitalizeFirstLetter(item.title)}
                      </h6>
                      
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                      <div className="text-dark font-weight-semibold">
                        {item.gallery_videos.length > 9
                          ? "9+ Videos"
                          : `${item.gallery_videos.length} Video`}
                      </div>
                      <div className="d-flex align-items-center  justify-content-start">
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

                        <div className="d-flex ">
                          <div
                            onClick={() => editDetail(item.id)}
                            className="avatar avatar-icon avatar-md avatar-orange"
                          >
                            <i className="fas fa-edit"></i>
                          </div>
                        </div>
                        {item.delete_status == 0 ? (
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="button-tooltip-2">Delete</Tooltip>
                            }
                          >
                            <div className="avatar ml-2 avatar-icon avatar-md avatar-red">
                              <i
                                className="fas fa-trash-alt"
                                onClick={() => deleteGallery(item.id)}
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
                                onClick={() => deleteGallery(item.id)}
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
    </>
  );
};

export default VideoGallery;
