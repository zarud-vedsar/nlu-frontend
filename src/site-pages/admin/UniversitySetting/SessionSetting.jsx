import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import {
  PHP_API_URL,
  NODE_API_URL,
} from "../../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import Select from "react-select";

import SettingSideBar from "../SettingSideBar";
import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";

const SessionSetting = () => {
  const [sessionList, setSessionList] = useState([]);
  useEffect(() => {
    fetchList();
    getCurrentSession();
  }, []);
  const fetchList = async (deleteStatus = 0) => {
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
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  const [formData, setFormData] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);

  const getCurrentSession = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_currentsession");

      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setFormData(response?.data?.data[0]?.currentsession);
      }
    } catch (error) {
      const status = error.response?.data?.status;
      setFormData(0);
      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const sendFormData = new FormData();
    sendFormData.append("data", "currentsession");
    sendFormData.append("currentsession", formData);
    sendFormData.append("loguserid", secureLocalStorage.getItem("login_id"));
    sendFormData.append("login_type", secureLocalStorage.getItem("loginType"));

    try {
      const response = await axios.post(
        `${PHP_API_URL}/sitesetting.php`,
        sendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === 201 || response.data?.status === 200) {
        toast.success(response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-0">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash">
                <a className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Setting
                </a>
                <a href="" className="breadcrumb-item">
                  <i className="fas " /> University Settings
                </a>
                <span className="breadcrumb-item active">
                  Sessioin Setting
                </span>
              </nav>
            </div>
          </div>

          <div className="d-flex col-12 mx-auto mt-5">
            <div className="col-md-2 mr-2">
              <SettingSideBar />
            </div>

            <form onSubmit={handleSubmit} className="col-md-5 col-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="form-group col-md-12">
                          <label className="font-weight-semibold">
                            Select Session
                          </label>
                          <Select
                            name="application_status"
                            id="application_status"
                            onChange={(s) => setFormData(s.value)}
                            options={sessionList}
                            value={
                              sessionList.find(
                                (session) => session.value === formData
                              ) || null
                            }
                          />
                        </div>
                        <div className="col-md-12 col-lg-12 col-12">
                          <button
                            className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                            type="submit"
                          >
                            Save{" "}
                            {isSubmit && (
                              <>
                                &nbsp; <div className="loader-circle"></div>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSetting;
