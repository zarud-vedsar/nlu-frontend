import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const SettingSideBar = () => {
  const { '*' : id } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={`sidebar-container ${isMobile ? "mobile-scroll" : ""}`}>
        <ul className={`nav d-flex ${isMobile ? "flex-row no-wrap" : "flex-column"} bg-white mb-0 py-3`}>
          <li className={`nav-item ${id === 'email-setting' ? 'mark' : ''}`}>
            <Link to="/admin/email-setting" className="nav-link text-dark">
              Email Setting
            </Link>
          </li>
          <li className={`nav-item ${id === 'contact-setting' ? 'mark' : ''}`}>
            <Link to="/admin/contact-setting" className="nav-link text-dark">
              Contact Setting
            </Link>
          </li>
          <li className={`nav-item ${id === 'social-media-setting' ? 'mark' : ''}`}>
            <Link to="/admin/social-media-setting" className="nav-link text-dark">
              Social Media
            </Link>
          </li>
          <li className={`nav-item ${id === 'contact-icon-setting' ? 'mark' : ''}`}>
            <Link to="/admin/contact-icon-setting" className="nav-link text-dark">
              Contact Icon
            </Link>
          </li>
          <li className={`nav-item ${id === 'session-setting' ? 'mark' : ''}`}>
            <Link to="/admin/session-setting" className="nav-link text-dark">
              Session Setting
            </Link>
          </li>
        </ul>
      </div>

      <style>
        {`
        .mark {
          background: #bbefff;
        }
        .sidebar-container {
          width: 100%;
        }
        .mobile-scroll {
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .mobile-scroll::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 10px;
        }
        .no-wrap {
          flex-wrap: nowrap !important;
        }
        `}
      </style>
    </>
  );
};

export default SettingSideBar;
