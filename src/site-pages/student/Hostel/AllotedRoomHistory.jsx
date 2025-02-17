import React, { useEffect, useState } from "react";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {
  formatDate,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import "../../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { dataFetchingPost } from "../../../site-components/Helper/HelperFunction";
import secureLocalStorage from "react-secure-storage";
function AllotedRoomHistory() {
  const [allotedroomHistory, setAllotedroomHistory] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [courseListing, setCourseListing] = useState([]);
  const [semesterListing, setSemesterListing] = useState([]);

  const fetchDistinctBlock = async () => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/hostel-management/room/distinct-blocks`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setBlock(response.data);

        return null;
      } else {
        toast.error("Data not found.");
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const handleSubmit = async (e = false) => {
    if (e) e.preventDefault();
    let bformData = {
      listing: "yes",
      studentId: secureLocalStorage.getItem("studentId"),
    };

    setIsFetching(true);
    try {
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/student/room-allotment-details-by-studentId`,
        {
          ...bformData,
        }
      );
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setAllotedroomHistory(response.data.data);
      } else {
        setAllotedroomHistory([]);
      }
      setIsFetching(false);
    } catch (error) {
      setAllotedroomHistory([]);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    handleSubmit();
    fetchDistinctBlock();
    courseListDropdown();
    fetchSemesterListing();
  }, []);

  const courseListDropdown = async () => {
    try {
      const response = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setCourseListing(response.data.data);
      } else {
        toast.error("Course not found.");
        setCourseListing([]);
      }
    } catch (error) {
      setCourseListing([]);
    }
  };

  const fetchSemesterListing = async (deleteStatus = 0) => {
    setIsFetching(true);
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          deleteStatus,
          listing: "yes",
        }
      );

      if (response?.statusCode === 200 && response.data.length > 0) {
        setSemesterListing(response.data);
      } else {
        toast.error("Data not found.");
        setSemesterListing([]);
      }
    } catch (error) {
      setSemesterListing([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsFetching(false);
    }
  };

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
                  <a href="./" className="breadcrumb-item">
                    Allot Room
                  </a>
                  <span className="breadcrumb-item active">
                    Alloted Room History
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Alloted Room History</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {!secureLocalStorage.getItem("sguardianemail") &&
                  <Link to="/student/raise-query">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      <i className="fas fa-plus"></i> Raise Query For Room
                    </button>
                  </Link>
}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className={`table-responsive ${isFetching ? "form" : ""}`}>
                  <DataTable
                    value={allotedroomHistory}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    emptyMessage="No records found"
                    className="p-datatable-custom"
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                  >
                    <Column
                      body={(row, { rowIndex }) => ++rowIndex}
                      header="#"
                      sortable
                    />
                    <Column field="block" header="Block" sortable />
                    <Column field="roomNo" header="Room No" sortable />

                    <Column
                      body={(row) =>
                        courseListing?.find(
                          (item) => item.id === parseInt(row?.courseid)
                        )
                          ? courseListing?.find(
                              (item) => item.id === parseInt(row.courseid)
                            ).coursename
                          : " "
                      }
                      header="Course"
                      sortable
                    />
                    <Column
                      body={(row) =>
                        semesterListing?.find(
                          (item) => item.id === parseInt(row?.semesterid)
                        )
                          ? semesterListing?.find(
                              (item) => item.id === parseInt(row.semesterid)
                            ).semtitle
                          : " "
                      }
                      header="Semester"
                      sortable
                    />

                    <Column
                      body={(row) => formatDate(row.allotDate)}
                      header="Alloted Date"
                      sortable
                    />

                    
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AllotedRoomHistory;
