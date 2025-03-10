import React, { useEffect } from "react";
import StudyMaterial from "../../../../site-components/admin/assets/images/application.png";
import { Link, useNavigate } from "react-router-dom";
import useRolePermission from '../../../../site-components/admin/useRolePermission';

const Reports = () => {
  const navigate = useNavigate();
  const { RolePermission, hasPermission } = useRolePermission();
  useEffect(() => {
    if (RolePermission && RolePermission.length > 0) {
      if (!hasPermission("Reports", "list")) {
        navigate("/forbidden");
      }
    }
  }, [RolePermission, hasPermission]);
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
                  <a className="breadcrumb-item">Reports</a>
                </nav>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="card border-0 bg-transparent mb-2">
                  <div className="card-header border-0 bg-transparent py-1 d-flex justify-content-between align-items-center px-0">
                    <h5 className="card-title h6_new">
                      {/* {id
                        ? "Update Session Wise Semester"
                        : "Add Session Wise Semester"} */}
                     Reports
                    </h5>
                    <div className="ml-auto">
                      <button
                        className="ml-auto btn-md btn border-0 goback mr-2"
                        onClick={() => goBack()}
                      >
                        <i className="fas fa-arrow-left" /> Go Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-lg-3 col-12 id-card-custom-report mb-3">
                <Link to={"/admin/reports/student-report"}>
                <div className="id-report-wrapper d-flex align-items-center">
                  <span className="id-stu-report-icon"><img src={StudyMaterial} alt="" /></span>
                    <span className="id-report-stu-text">Student Report </span>
                    </div>
                </Link>
              </div>
              <div className="col-md-3 col-lg-3 col-12 id-card-custom-report mb-3">
                <Link to={"/admin/reports/subject-report"}>
                <div className="id-report-wrapper d-flex align-items-center">
                  <span className="id-stu-report-icon"><img src={StudyMaterial} alt="" /></span>
                    <span className="id-report-stu-text">Subject Report </span>
                    </div>
                </Link>
              </div>
              <div className="col-md-3 col-lg-3 col-12 id-card-custom-report mb-3">
                <Link to={"/admin/reports/inventory-report"}>
                <div className="id-report-wrapper d-flex align-items-center">
                  <span className="id-stu-report-icon"><img src={StudyMaterial} alt="" /></span>
                    <span className="id-report-stu-text">Inventory Report </span>
                    </div>
                </Link>
              </div>
              <div className="col-md-3 col-lg-3 col-12 id-card-custom-report mb-3">
                <Link to={"/admin/reports/library-report"}>
                <div className="id-report-wrapper d-flex align-items-center">
                  <span className="id-stu-report-icon"><img src={StudyMaterial} alt="" /></span>
                    <span className="id-report-stu-text">Library Report </span>
                    </div>
                </Link>
              </div>


             
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
