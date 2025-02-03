import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { formatDate } from "../../site-components/Helper/HelperFunction";
import { Link } from "react-router-dom";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/Column";
import { InputText } from "primereact/inputtext"; // Import InputText for the search box
import "../../../node_modules/primeicons/primeicons.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import secureLocalStorage from "react-secure-storage";

const IssueList = () => {
  const [loading, setLoading] = useState();
  const [issuedBookList, setIssuedBookList] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      await loadIssueBookList();
    };
    loadData();
  }, []);

  const loadIssueBookList = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("data", "student_book_issue");
      formData.append("student_id", secureLocalStorage.getItem("studentId"));
      const response = await axios.post(
        `${PHP_API_URL}/lib_books.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response?.data?.status === 200) {
        setIssuedBookList(response?.data?.data);
      }
    } catch (error) {
      setIssuedBookList([]);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className=" mb-3 mt-0">
            <nav className="breadcrumb">
              <a href="/" className="breadcrumb-item">
                Library
              </a>

              <span className="breadcrumb-item active">Issued List</span>
            </nav>
          </div>
          <div className="card-header d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h2 className="card-title col-6">Issued List</h2>
            <div className="col-6 col-md-auto d-flex justify-content-start">
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
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <DataTable
                    value={issuedBookList}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
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
                      field="issue_books_no"
                      header="Issued No"
                      sortable
                    />
                    <Column
                      field="issue_books_date"
                      header="Issue Books Date"
                      sortable
                      body={(rowData) => formatDate(rowData?.issue_books_date)}
                    />
                    <Column field="duration" header="Duration" sortable />

                    <Column
                      field="return_books_date"
                      header="Return Date"
                      sortable
                      body={(rowData) => (
                        <div
                          className={`${
                            rowData?.return_books_date
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {rowData?.return_books_date
                            ? formatDate(rowData?.return_books_date)
                            : "Not Return"}
                        </div>
                      )}
                    />

                    <Column
                      header="View"
                      body={(rowData, { rowIndex }) => (
                        <div className="d-flex justify-content-around">
                          <div className="d-flex">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="button-tooltip-2">
                                  View Detail
                                </Tooltip>
                              }
                            >
                              <Link
                                className="avatar avatar-icon avatar-md avatar-orange"
                                to={`/student/issued-detail/${rowData.id}`}
                              >
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </OverlayTrigger>
                          </div>
                        </div>
                      )}
                    />
                  </DataTable>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueList;
