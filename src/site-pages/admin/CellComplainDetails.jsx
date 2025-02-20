import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { capitalizeFirstLetter, formatDate } from "../../site-components/Helper/HelperFunction";
import {
  PHP_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";

const CellComplainDetails = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { id } = useParams();

  const getComplainDetails = async () => {
    try {
      const bformData = new FormData();
      bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
      bformData.append("login_type", secureLocalStorage.getItem("loginType"));
      bformData.append("data", "cell_message_by_id");
      bformData.append("id", id);
      const res = await axios.post(
        `${PHP_API_URL}/cell_messages.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data.data[0]);
      if (res?.data?.status === 200 || res?.data?.status === 201) {
        setData(res.data.data[0]);
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    if (id) {
      getComplainDetails();
    }
  }, []);

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="">
              <nav className="breadcrumb breadcrumb-dash">
                <a href="/" className="breadcrumb-item">
                  Dashboard
                </a>

                <span className="breadcrumb-item active">Cell Complain</span>
              </nav>
            </div>

            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Cell Complain Detail</h5>
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
                   <Link
                                      to="/admin/cell-complain-list"
                                      className="ml-2 btn-md btn border-0 btn-secondary"
                                    >
                                      <i className="fas fa-list" /> Cell Complain List
                                    </Link>
                </div>
              </div>
            </div>

            <div className="row ant-card-body ">
              <div className="col-md-12 align-items-center ng-star-inserted">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : data ? (
                  <div className="card">
                    <div className="card-body py-3">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <div className="row">
                            <div className="d-md-block d-none col-1"></div>
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
                                    {capitalizeFirstLetter(data?.fname) || "N/A"}
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
                                    {capitalizeFirstLetter(data?.lname) || "N/A"}
                                  </p>
                                </li>
                                <li className="row">
                                  <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                    <i
                                      className="fa fa-envelope m-r-10 "
                                      style={{ color: "#3f87f5" }}
                                    ></i>
                                    <span>Email:</span>
                                  </p>
                                  <p className="col font-12 font-weight-semibold">
                                    {data?.email || "N/A"}
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="row">
                            <div className="d-md-block d-none border-left col-1"></div>
                            <div className="col p-0">
                              <ul className="list-unstyled m-t-10">
                                <li className="row">
                                  <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                    <i
                                      className="fa-solid fa-mobile m-r-10 "
                                      style={{ color: "#3f87f5" }}
                                    ></i>
                                    <span>Phone:</span>
                                  </p>
                                  <p className="col font-12 font-weight-semibold">
                                    {data?.phone || "N/A"}
                                  </p>
                                </li>
                                <li className="row">
                                  <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                    <i
                                      class="fa-solid fa-school  m-r-10"
                                      style={{ color: "#3f87f5" }}
                                    ></i>
                                   
                                    <span>Batch:</span>
                                  </p>
                                  <p className="col font-12 font-weight-semibold">
                                    {capitalizeFirstLetter(data?.batch) || "N/A"}
                                  </p>
                                </li>
                                <li className="row">
                                  <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                    <i

                                      className="fa-solid fa-graduation-cap m-r-10 "
                                      style={{ color: "#3f87f5" }}
                                    ></i>
                                    <span>Semester:</span>
                                  </p>
                                  <p className="col font-12 font-weight-semibold">
                                    {capitalizeFirstLetter(data?.semester) || "N/A"}
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="row">
                            <div className="d-md-block d-none border-left col-1"></div>
                            <div className="col p-0">
                              <ul className="list-unstyled m-t-10">
                               
                                <li className="row">
                                  <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                    <i
                                      className="fa-solid fa-calendar m-r-10 "
                                      style={{ color: "#3f87f5" }}
                                    ></i>
                                    <span>Date:</span>
                                  </p>
                                  <p className="col font-12 font-weight-semibold">
                                    {formatDate(data?.created_at) || "N/A"}
                                  </p>
                                </li>
                                <li className="row">
                                  <p className="col-sm-4 px-0 font-13 col-4 font-weight-semibold text-dark m-b-5">
                                    <i
                                      className="fa-solid fa-table-cells-row-unlock m-r-10 "
                                      style={{ color: "#3f87f5" }}
                                    ></i>
                                    <span>Cell:</span>
                                  </p>
                                  <p className="col font-12 font-weight-semibold">
                                    {data?.cell || "N/A"}
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
                    No Cell Complain Details available.
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-sm-12 col-12 col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                      <div className="d-flex">
                                  <p className=" px-0 font-13 font-weight-semibold text-dark m-b-5">
                                    <i
                                      className="fa-solid fa-book mr-1 "
                                      style={{ color: "#3f87f5" }}
                                    ></i>
                                    <span>Subject:</span>
                                  </p>
                                  <p className="col font-12 font-weight-semibold">
                                    {capitalizeFirstLetter(data?.subject) || "N/A"}
                                  </p>
                                </div>
                        <p className="text-dark"> <i
                                      className="fa-solid fa-message mr-1"
                                      style={{ color: "#3f87f5" }}
                                    ></i><span>Message:</span></p>
                        <p>{capitalizeFirstLetter(data.message)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {data.upload_file && (
                <div className="col-md-12 col-sm-12 col-12 col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <iframe
                        src={`${FILE_API_URL}/${data?.upload_file}`}
                        title="PDF Preview"
                        className="mt-3"
                        style={{ width: "100%", height: 400 }}
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CellComplainDetails;
