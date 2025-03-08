import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import rpnl_logo from "../../../site-components/website/assets/Images/rpnl_logo.png";
import {
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";

import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function VisitorPass() {
  const { dbId } = useParams();
  const navigate = useNavigate();
  const [visitorHistory, setVisitorHistory] = useState([]);
  const initialData = {
    deleteStatus: 0,
    status: 1,
  };
  const [formData, setFormData] = useState(initialData);
  const [isFetching, setIsFetching] = useState(false);

  const initializeFilter = {
    visitorId: "",
    passId: "",
    fromDate: "",
    toDate: "",
    startDateFrom: "",
    endDateFrom: "",
    startDateTo: "",
    endDateTo: "",
    visitorPhone: "",
    visitorName: "",
    hostDetails: "",
  };

  const updateDataFetch = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    navigate(`/admin/add-genrate-pass/${dbId}`, { replace: true });
  };
  const handleSubmit = async (applyFilter = false, e = false) => {
    if (e) e.preventDefault();

    if (applyFilter) {
      bformData = filters;
    }
    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/campus/visitor/campus-pass-list`,
        {
          visitorId: dbId 
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {

        setVisitorHistory(response.data.data[0]);
      } else {
        setVisitorHistory([]);
      }
      setIsFetching(false);
    } catch (error) {
      setVisitorHistory([]);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, []);
  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Dashboard
                  </a>
                  <span className="breadcrumb-item">Visitor Management</span>
                  <span className="breadcrumb-item active">Visitor Pass</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Visitor Pass</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-md-5">
                <div className="card">
                  <div className="card-body id-card-body-padd">
                    <h5
                      className="card-title h6_new d-flex id-b-b"
                      style={{ fontSize: "1.2cm" }}
                    >
                      <img
                        src={rpnl_logo}
                        alt="logo"
                        style={{
                          width: "2cm",
                          height: "2cm",
                          marginRight: "0.5cm",
                        }}
                      />
                      <div className="" style={{ fontSize: "0.4cm" }}>
                        <p>
                          Dr. Rajendra Prasad National Law University Prayagraj
                        </p>
                        <p className="d-flex justify-content-end mb-0">
                      <span className="id-text-dark">DATE:</span>{formatDate(visitorHistory.created_at)}
                    </p>
                      </div>
                    </h5>

                    <div className="" style={{ fontSize: "0.cm" }}>
                      <p className="d-flex justify-content-between mb-0">
                        <p className="mb-0">
                          {" "}
                          <span className="id-text-dark ">
                            From DATE:{" "}
                          </span>{" "}
                          {formatDate(visitorHistory.fromDate)}
                        </p>
                        <p className="mb-0">
                          {" "}
                          <span className="id-text-dark ">To DATE: </span>
                          {formatDate(visitorHistory.toDate)}
                        </p>
                      </p>
                      <p className="d-flex justify-content-flex-start">
                        <span className="id-title-w">Name: </span>Khan Shad{" "}
                      </p>
                      <p className="d-flex justify-content-flex-start">
                        {" "}
                        <span className="id-title-w">Pass Type: </span> {visitorHistory.passType}
                      </p>
                      <p className="d-flex justify-content-flex-start">
                        {" "}
                        <span className="id-title-w">Phone No:</span> {visitorHistory.visitorPhone}
                      </p>
                      <p className="d-flex justify-content-flex-start">
                        <span className="id-title-w">Host Details:</span>{" "}
                       {visitorHistory.hostDetails}
                      </p>
                    </div>
                  </div>
                  <p className="text-center id-color-b">Thanks for visiting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .modal-right .modal-dialog {
            position: absolute;
            top: 0;
            right: 0;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
          }

          .modal-right.show .modal-dialog {
            transform: translateX(0);
          }
          .id-title-w {
            display: inline-block;
            width: 100px;
          }
          .id-text-dark {
            font-weight: 600;
            color: black;
            margin-right: 10px;
          }
          .id-color-b {
            color: black;
          }
          .id-b-b {
            border-bottom: 1px solid black;
          }
            .id-card-body-padd{
            padding: 12px 20px 10px}
        `}
      </style>
    </>
  );
}
export default VisitorPass;
