import React, { useEffect ,useState } from "react";
import { useParams } from "react-router-dom";
import PersonalDetail from "./PersonalDetail";
import CourseDetail from "./CourseDetail";
import EducationDetail from "./EducationDetail";
import DocumentDetail from "./DocumentDetail";
import axios from "axios";
import { NODE_API_URL } from "../../../../site-components/Helper/Constant";

const EditApplication = () => {

  const { sid } = useParams();
  const [currentCourse, setCurrentCourse] = useState({});
  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = sid;
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetchCurrentCourse`,
        formData
      );
      if (response.data?.statusCode === 200) {
        const {
          
          approved,
        } = response.data?.data || {};

        setCurrentCourse((prev) => ({
          ...prev,
         
          approved: approved,
         
        }));
      }
    } catch (error) {}
  };
  const [trigger, setTrigger] = useState(false); // Boolean to trigger re-render

    const update = () => {
        console.log('Update function called');
        setTrigger(prev => !prev); 
    };

  useEffect(()=>{getStudentSelectedCourse()},[])
  
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
                  <span className="breadcrumb-item">Application list</span>
                  <span className="breadcrumb-item active">Edit Detail</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Edit Detail</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                </div>
              </div>
            </div>
            <PersonalDetail sid={sid}/>
            {currentCourse?.approved === 0 && (
              <>
            <CourseDetail sid={sid} update={update}/>
            <EducationDetail sid={sid} trigger={trigger}/>
            <DocumentDetail sid={sid}/>
            </>)
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default EditApplication;
