import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PHP_API_URL,
  NODE_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";
import { useParams } from "react-router-dom";
import { dataFetchingGet } from "../../site-components/Helper/HelperFunction";

const DetailFaculty = () => {
  const [facultyData, setFacultyData] = useState();
  const { id } = useParams();

  const fetchDepartment = async (id) => {
    try {
      const bformData = new FormData();
      const response = await axios.post(
        `${NODE_API_URL}/api/department/fetch`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data.data;
      const department = result.find((dept) => dept.id === id);
      if (department) {
        setFacultyData((prevData) => ({
          ...prevData,
          departmentid: department.dtitle,
        }));
      } else {
      }
    } catch (e) {}
  };

  const fetchDesignationList = async (id) => {
    const deleteStatus = 0;
    try {
      const response = await dataFetchingGet(
        `${NODE_API_URL}/api/designation/retrieve-all-designation-with-department/${deleteStatus}`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        const result = response.data;
        const designation = result.find((des) => des.id === id);
        if (designation) {
          setFacultyData((prevData) => ({
            ...prevData,
            designationid: designation.title,
          }));
        } else {
        }
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        console(error.response.message || "A server error occurred.");
      } else {
      }
    } finally {
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const loadFacultyData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "fetch_user");
      bformData.append("update_id", id);
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFacultyData(response.data.data[0]);

      fetchDepartment(response.data.data[0].departmentid);
      fetchDesignationList(response.data.data[0].designationid);
    } catch (error) {}
  };

  useEffect(() => {
    if (id) {
      loadFacultyData();
    }
  }, [id]);

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Our Faculty</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <a href="default.html">Home</a>
                    </li>
                    <li>Faculty</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {facultyData && (
        <section className="container section-padding">
          <div className="content">
            <div className="information">
              <div
                className="image"
                style={{
                  width: "250px",
                  borderRadius: "20px",
                }}
              >
                <img
                  src={
                    facultyData.avtar
                      ? `${FILE_API_URL}/user/${facultyData.uid}/${facultyData.avtar}`
                      : `${FILE_API_URL}/user/dummy.webp`
                  }
                  alt="faculty image"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "20px",
                  }}
                />
              </div>
              <div className="information" style={{ marginTop: "20px" }}>
                {facultyData?.first_name && (
                  <p style={{ fontSize: "30px" }}>{`${
                    facultyData.first_name
                  } ${facultyData.middle_name} ${facultyData.last_name}`}</p>
                )}
                {facultyData.designationid && (
                  <p style={{ marginTop: "5px", fontSize: "20px" }}>
                    {facultyData.designationid}
                  </p>
                )}

                {/* {facultyData.departmentid && (
                  <p style={{ marginTop: "5px" }}>{facultyData.departmentid}</p>
                )} */}
                {facultyData.qualification && (
                  <div style={{ marginTop: "7px" }}>
                    <span>Qualification</span>
                    <p>{`${facultyData.qualification}`}</p>
                  </div>
                )}

                {facultyData.specialization && (
                  <div style={{ marginTop: "7px" }}>
                    <span>Specialization</span>
                    <p>{`${facultyData.specialization}`}</p>
                  </div>
                )}
                {facultyData.exp_yrs && (
                  <div style={{ marginTop: "7px" }}>
                    <span>Experience</span>
                    <p>{`${facultyData.exp_yrs}`}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="description">
              {facultyData.discription && (
                <p style={{ marginBottom: "8px" }}>{facultyData.discription}</p>
              )}

              <div>
                {facultyData?.show_email_on_website && facultyData.u_email ? (
                  <p style={{ color: "#383838" }}>
                    Email : {facultyData.u_email}
                  </p>
                ) : null}

                {facultyData?.show_contact_on_website && facultyData.u_phone ? (
                  <p style={{ color: "#383838" }}>
                    Phone Number : {facultyData.u_phone}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      )}
      <style jsx>{`
        p {
          padding: 0px;
          margin: 0px;
        }
        .content {
          display: flex;
          gap: 40px;
        }
        .description {
          padding-top: 10px;
        }
        @media screen and (max-width: 800px) {
          .content {
            display: block;
          }
          .image {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

export default DetailFaculty;
