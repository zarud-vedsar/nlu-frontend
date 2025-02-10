import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  dataFetchingPost,
  goBack,
} from "../../../site-components/Helper/HelperFunction";
import { FormField } from "../../../site-components/admin/assets/FormField";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Select from "react-select";
import { capitalizeFirstLetter } from "../../../site-components/Helper/HelperFunction";
function UpdateVacateDate() {
  const { id: dbId } = useParams();
  const initialData = {
    roomAllotedId: dbId,
    block: "",
    roomNo: "",
    courseid: "",
    semesterid: "",
    allotDate: "",
    studentId: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState({ field: "", msg: "" }); // Error state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state
  const [block, setBlock] = useState([]);
  const [blockRoomNo, setBlockRoomNo] = useState([]);
  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [semesterListing, setSemesterListing] = useState([]); // on course and year selection
  const [studentListing, setStudentListing] = useState([]); // on course and year selection
  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    console.log(formData);
   

    if (!formData.allotDate) {
      errorMsg("allotDate", "Allot date is required.");
      toast.error("Allot date is required.");
      return setIsSubmit(false);
    }
    if (!formData.vacateDate) {
      errorMsg("vacateDate", "Vacate Date is required.");
      toast.error("Vacate Date is required.");
      return setIsSubmit(false);
    }
    let allotDate = new Date(formData?.allotDate);
    let vacateDate = new Date(formData?.vacateDate);
    if (allotDate>vacateDate) {
      errorMsg("vacateDate", "Vacate Date must be valid.");
      toast.error("Vacate Date must be valid.");
      return setIsSubmit(false);
    }


    try {
      formData.loguserid = secureLocalStorage.getItem("login_id");
      formData.login_type = secureLocalStorage.getItem("loginType");
      
      // submit to the API here
      const response = await axios.post(
        `${NODE_API_URL}/api/hostel-management/admin/room-update-vacate-date`,
        formData
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        toast.success(response.data.message);
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
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };
  const fetchDataForupdateBasedOnId = async (dbId) => {
    console.log(dbId);
    if (!dbId || parseInt(dbId, 10) <= 0) {
      toast.error("Invalid ID.");
      return;
    }
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/hostel-management/admin/room-allotment-fetch-filter`,
        { dbId }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        const data = response.data[0];
        console.log(data);
        setFormData((prev) => ({
          ...prev,
          dbId: data.id,
          block: data.block,
          roomNo: data.roomNo,
          allotDate: data.allotDate.split("T")[0],
          studentId: data.studentId,
          courseid: data.courseid,
          semesterid: data.semesterid,
        }));
        if (data.block) {
          fetchRoomNoBasedOnBlock(data.block);
        }
        if (data.courseid) {
          fetchSemesterBasedOnCourse(data.courseid);
        }
        return response;
      } else {
        toast.error("Data not found.");
        return null;
      }
    } catch (error) {
      return null;
    }
  };
  const fetchRoomNoBasedOnBlock = async (block) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/hostel-management/room/room-no-based-on-block/${block}`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setBlockRoomNo(response.data);
        return null;
      } else {
        toast.error("Data not found.");
        return [];
      }
    } catch (error) {
      return [];
    }
  };
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

  useEffect(() => {
    courseListDropdown();
    fetchStudent();
  }, []);

  const fetchSemesterBasedOnCourse = async (courseid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return toast.error("Invalid course ID.");
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          courseid: courseid,
          column: "id, semtitle",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSemesterListing(response.data);
      } else {
        toast.error("Semester not found.");
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
    }
  };

  useEffect(() => {
    fetchDistinctBlock();
    if (dbId) fetchDataForupdateBasedOnId(dbId);
  }, [dbId]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `${NODE_API_URL}/api/student-detail/get-student`
      );
      console.log(response);
      if (
        response?.data?.statusCode === 200 &&
        response?.data?.data.length > 0
      ) {
        setStudentListing(response?.data?.data);
      } else {
        toast.error("Data not found.");
        setStudentListing([]);
      }
    } catch (error) {
      console.log(error);
      setStudentListing([]);
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Hostel Management
                  </a>
                  
                  
                  <span className="breadcrumb-item active">
                    {"Update Vacate Date"}
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">
                  { "Update Vacate Date"}
                </h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 goBack mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  <Link to="/admin/alloted-room-history">
                    <button className="ml-2 btn-md btn border-0 btn-secondary">
                      Alloted History <i className="fas fa-list"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 col-lg-4 form-group">
                      <label className="font-weight-semibold">Block</label>
                      <Select
                      disabled={true} 
                        options={block.map((item) => ({
                          value: item.block,
                          label: item.block,
                        }))}
                       
                        value={
                          block.find((item) => item.block === formData.block)
                            ? {
                                value: formData.block,
                                label: block.find(
                                  (item) => item.block === formData.block
                                ).block,
                              }
                            : { value: formData.block, label: "Select" }
                        }
                        isDisabled={true}
                      />

                      
                    </div>
                    <div className="col-md-4 col-lg-4 form-group">
                      <label className="font-weight-semibold">Room No</label>
                      <Select
                        options={blockRoomNo.map((item) => ({
                          value: item.roomNo,
                          label: item.roomNo,
                        }))}
                        
                        value={
                          blockRoomNo.find(
                            (item) => item.roomNo === formData.roomNo
                          )
                            ? {
                                value: formData.roomNo,
                                label: blockRoomNo.find(
                                  (item) => item.roomNo === formData.roomNo
                                ).roomNo,
                              }
                            : { value: formData.roomNo, label: "Select" }
                        }
                        isDisabled={true}
                      />

                      
                    </div>
                    <div className="col-md-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Course
                      </label>
                      <Select
                        options={courseListing.map((item) => ({
                          value: item.id,
                          label: item.coursename,
                          year: item.duration,
                        }))}
                        
                        value={
                          courseListing.find(
                            (item) => item.id === parseInt(formData.courseid)
                          )
                            ? {
                                value: parseInt(formData.courseid),
                                label: courseListing.find(
                                  (item) =>
                                    item.id === parseInt(formData.courseid)
                                ).coursename,
                              }
                            : { value: formData.courseid, label: "Select" }
                        }
                        isDisabled={true}
                      />

                
                    </div>

                    <div className="col-md-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Semester 
                      </label>
                      <Select
                        options={semesterListing.map((item) => ({
                          value: item.id,
                          label: capitalizeFirstLetter(item.semtitle),
                        }))}
                        
                        value={
                          semesterListing.find(
                            (item) => item.id === formData.semesterid
                          )
                            ? {
                                value: formData.semesterid,
                                label: capitalizeFirstLetter(
                                  semesterListing.find(
                                    (item) => item.id === formData.semesterid
                                  ).semtitle
                                ),
                              }
                            : {
                                value: formData.semesterid,
                                label: "Select",
                              }
                        }
                        isDisabled={true}
                      />
                     
                    </div>

                    <div className="col-md-4 col-12 form-group">
                      <label className="font-weight-semibold">
                        Select Student 
                      </label>
                      <Select
                        options={
                          studentListing?.map((student) => ({
                            value: student.id,
                            label: `${student.sname} (${student.enrollmentNo})`,
                          })) || []
                        }
                        
                        value={
                          formData.studentId
                            ? {
                                value: formData.studentId,
                                label:
                                  studentListing?.find(
                                    (student) =>
                                      student.id === formData.studentId
                                  )?.sname || "Select",
                              }
                            : { value: "", label: "Select" }
                        }
                        isDisabled={true}
                      />
                       
                    </div>

                    {/* Visit Date */}
                    <FormField
                      
                      label="Allot Date"
                      name="allotDate"
                      id="allotDate"
                      type="date"
                      value={formData.allotDate}
                      
                      column="col-md-4 col-lg-4"
                      disabled={true}
                      
                    />
                    <FormField
                      borderError={error.field === "vacateDate"}
                      errorMessage={error.field === "vacateDate" && error.msg}
                      label="Vacate Date"
                      name="vacateDate"
                      id="vacateDate"
                      type="date"
                      value={formData.vacateDate}
                      onChange={handleChange}
                      column="col-md-4 col-lg-4"
                      required
                      
                    />

                    <div className="col-md-12 col-lg-12 col-12">
                      <button
                        disabled={isSubmit}
                        className="btn btn-dark col-12"
                        type="submit"
                      >
                        Submit{" "}
                        {isSubmit && (
                          <>
                            &nbsp; <div className="loader-circle"></div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateVacateDate;
