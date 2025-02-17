import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AdminMailVerification = () => {
  const params = new URLSearchParams(location.search);
  const uid = params.get("uid");
  
  const navigate=useNavigate()

  const [status, setStatus] = useState("pending");

  const verify = async () => {
    try {
      const formData = new FormData();
      formData.append("data", "verify_email");
      formData.append("uid", uid);
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response?.data?.status == 200) {
        setStatus("verified");

        toast.success(response?.data?.msg);
        setTimeout(()=>{
          navigate('/admin/signin')
        },5000)
      }
    } catch (error) {
      setStatus("error");

    
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
    }
  };
  useEffect(() => {
    if (uid) {
      setTimeout(() => {
        verify();
      }, 5000);
    }
  }, []);

  return (
    <>
      {status == "pending" && (
        <div>
          <div
            style={{
              height:"95vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <p>Checking Status</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>

        </div>
      )}
      {status == "verified" && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <h3 className="text-success">Email Verified...</h3>
         
        </div>
      )}
      {status == "error" && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <h3 className="text-danger">Error...</h3>
         
        </div>
      )}
    </>
  );
};

export default AdminMailVerification;
