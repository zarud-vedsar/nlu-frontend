import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Spinner,
} from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";

import { formatDate } from "../../site-components/Helper/HelperFunction";

import { Link } from "react-router-dom";
import {
  FILE_API_URL,
  PHP_API_URL,
} from "../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";

const IssueBook = () => {
  const navigate = useNavigate();

  const [internshipList, setInternshipList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    if (selectedInternship != null) {
      setModalShow(true);
    }
  }, [selectedInternship]);

  useEffect(() => {
    loadInternshipsData();
  }, []);

  const loadInternshipsData = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_book_issue");
      bformData.append("delete_status", 0);

      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.status === 200) {
        setInternshipList(response.data.data);
      }
    } catch (error) {
      setInternshipList([]);
    } finally {
      setLoading(false);
    }
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
                                   <span className="breadcrumb-item active">
                                   Library Management
                                   </span>

                <span className="breadcrumb-item active">Issue Book</span>
              </nav>
            </div>

            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Issue List</h5>
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
                    to="/admin/issue-book-add"
                  >
                    <i className="fas">
                      <IoMdAdd />
                    </i>{" "}
                    Add Issue Book
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
                </div>

                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <DataTable
                      value={internshipList}
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
                        header="Info"
                        body={(rowData) => (
                          <div
                            className="info-column d-flex align-items-center
                    "
                          >
                            <div className="info-image mr-4">
                              {rowData?.spic ? (
                                <img
                                  src={`${FILE_API_URL}/student/${rowData?.student_id}${rowData?.registrationNo}/${rowData?.spic}`}
                                  alt=""
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className="rounded-circle d-flex justify-content-center align-items-center"
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#e6fff3",
                                    fontSize: "20px",
                                    color: "#00a158",
                                  }}
                                  className="rounded-circle d-flex justify-content-center align-items-center"
                                >
                                  {rowData?.sname[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="info-name">
                                <span>{`${rowData?.sname}`}</span>
                              </div>

                              <div className="info-email">
                                <span>{rowData?.enrollmentNo}</span>
                              </div>
                              <div className="info-phone">
                                <span>{rowData?.sphone}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        sortable
                      />


                      <Column
                        field="issue_books_no"
                        header="Issue Books No"
                        sortable
                      />
                      <Column
                        field="issue_books_date"
                        header="Issue Books Date"
                        sortable
                        body={(rowData) => formatDate(rowData?.issue_books_date)}
                      />


                      <Column
                        header="Return Book"
                        
                        body={(rowData, { rowIndex }) => (
                          <div className="d-flex justify-content-around">
                            {rowData?.issue_books_status == 1 ? (
                              <Link
                                className="btn  btn-primary"
                                to={`/admin/return-book/${rowData.id}`}
                              >
                                Return Book
                              </Link>
                            ) : (
                              <span
                                className="text-success"

                              >
                                All book are returned
                              </span>
                            )}
                          </div>
                        )}
                      />All Book are Return

                      <Column
                        header="Action"
                        body={(rowData, { rowIndex }) => (
                          <div className="d-flex justify-content-around">

                            <div className="d-flex">
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="button-tooltip-2">
                                    View books status
                                  </Tooltip>
                                }
                              >
                                <Link className="avatar avatar-icon avatar-md avatar-orange" to={`/admin/book-status/${rowData.id}}`}>
                                  <i
                                    className="fa-solid fa-eye"
                                  ></i>
                                </Link>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="button-tooltip-2">
                                    View slip
                                  </Tooltip>
                                }
                              >
                                <Link className="avatar avatar-icon avatar-md avatar-orange" to={`/admin/issue-book-receipt/${rowData.id}`}>
                                  <i className="fa-solid fa-print"></i>
                                </Link>
                              </OverlayTrigger>

                            </div>
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

export default IssueBook;
