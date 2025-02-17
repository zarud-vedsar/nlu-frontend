import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  getDocument,
  studentRecordById,
} from "../../../site-components/student/GetData";
import rpnlLogo from "../../../site-components/website/assets/Images/rpnl-logo.png";
import {
  FILE_API_URL,
  NODE_API_URL,
  PHP_API_URL,
} from "../../../site-components/Helper/Constant";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
import { toast } from "react-toastify";

function ViewApplication() {
  const sid = secureLocalStorage.getItem("studentId");
  const [loading, setLoading] = useState();
  const [currentCourse,setCurrentCourse] = useState([]);
  const [allPreviousRegisterSemester, setAllPreviousRegisterSemester] =
    useState([]);

  useEffect(() => {
    getStudentSelectedCourse();
  }, [sid]);

  const getAllApprovedSemeter = async () => {
    setLoading(true);
    try {
      let formData = {
        loguserid: secureLocalStorage.getItem("login_id"),
        login_type: secureLocalStorage.getItem("loginType"),
        sid: sid,
        preview: 1,
        approved: 1,
        listing: "Yes",
      };

      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetchAllApprovedSemeter`,
        formData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        
        setAllPreviousRegisterSemester(response?.data?.data);
        
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        // toast.error(
        //   "An error occurred. Please check your connection or try again."
        // );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = secureLocalStorage.getItem("studentId");
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetchCurrentCourse`,
        formData
      );

      if (response.data?.statusCode === 200) {
        const { id, coursename, semtitle, approved } =
          response.data?.data || {};

        if((response?.data?.data?.preview === 1 &&  response?.data?.data?.approved === 0) || (response?.data?.data?.preview === 0 &&  response?.data?.data?.approved === 2) ){
        setCurrentCourse(
          [{
            id,
            approved: approved,
            coursename: capitalizeFirstLetter(coursename),
            semtitle: capitalizeFirstLetter(semtitle),
          }],
        );
      }
      }
    } catch (error) {
    } finally {
      getAllApprovedSemeter();
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
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </a>
                  <span className="breadcrumb-item">Previous Registraton </span>
                  <span className="breadcrumb-item active">List</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  Previous Registration List
                </h5>
                <div className="ml-auto d-flex">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                </div>
              </div>
            </div>
            {(allPreviousRegisterSemester.length > 0 || currentCourse.length>0) ? 
              <div className="card">
                <div className="card-body">
                  <div className="card-title">Previous Semester Detail</div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Course</th>
                        <th scope="col">Semester</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                    {currentCourse.map((data, index) => (
                        <tr key={index}>
                          <td scope="row">{index + 1}</td>{" "}
                          {/* Added +1 to start index from 1 */}
                          <td>{capitalizeFirstLetter(data?.coursename)}</td>
                          <td>{capitalizeFirstLetter(data?.semtitle)}</td>
                          
                          <td className={`${data?.approved===0?'text-warning':'text-danger' }`} >{data?.approved===0 ? 'Pending' : 'Rejected'}</td>
                          <td>
                            {data?.approved === 0 && (
                              <Link
                                className="btn btn-warning"
                                to={`/student/preview-previous-registration/${sid}/${data.id}`}
                              >
                                Preview
                              </Link>
                            )}
                            {data?.approved === 2 && (
                              <Link
                                className="btn btn-danger"
                                to={`/student/preview-previous-registration/${sid}/${data.id}`}
                              >
                                Preview
                              </Link>
                            )}
                            
                          </td>
                        </tr>
                      ))}
                      {allPreviousRegisterSemester.map((data, index) => (
                        <tr key={index}>
                          <td scope="row">{index + 1}</td>{" "}
                          {/* Added +1 to start index from 1 */}
                          <td>{capitalizeFirstLetter(data?.coursename)}</td>
                          <td>{capitalizeFirstLetter(data?.semtitle)}</td>
                          <td className="text-success" >Approved</td>

                          <td>
                            
                              <Link
                                className="btn btn-dark"
                                to={`/student/preview-previous-registration/${sid}/${data.id}`}
                              >
                                Preview
                              </Link>
                            
                          </td>
                        </tr>
                      ))}
                      
                      
                    </tbody>
                  </table>
                </div>
              </div>
              :
              <div className="row">
              
                    
                          <div className='col-md-12 alert alert-danger'>
                              Data not available
                          </div>
                    
                  
              </div>

            }
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewApplication;
