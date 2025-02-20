import React, { useState, useEffect } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import AboutBg from "../assets/Images/university.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { PHP_API_URL } from "../../Helper/Constant";
import validator from 'validator';
const MarqueeSlider = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (items.length > 0) return;
      try {
        const formData = new FormData();
        formData.append("data", "load_mrq_slider_front");
        const marQueeResponse = await axios.post(
          `${PHP_API_URL}/mrq_slider.php`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (marQueeResponse?.data?.status === 200) {
          setItems(marQueeResponse?.data?.data);
        } else {
          console.error("Failed to fetch notices");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [items]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="container">
      <div className="row">
        <div className={`col-lg-9  id-marquee-wrapper overflow-hidden ${isMobile?"mb-3":""}`}>
          <div className="id-mrq-content">
            <div className="marquee-wrapper">
              <div className="marquee">
                {items.map((item, index) => (
                  <span key={index} className="marquee-item ml-2">
                    <Link to={`/marquee/${item.id}`}>
                      {item?.content ? validator.unescape(item.content) : ''}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card border-0 shadow-none cardimlink imp-link-card">
            <div className="card-body imp-card-body id-imp-card-body" style={{ padding: "0" }}>
              <div className="imlink id-imp-link" style={{ justifyContent: "flex-start", paddingLeft: "20px" }}>
                <div className="imimg">
                  <img src={AboutBg} className="img-fluid" style={{ width: "60%", marginRight: "0" }} />
                </div>
                <Link to="/about" className="text-white">
                  <span className="text-white">About University <FaLongArrowAltRight /></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
      .id-mrq-content{
      width:100%;
      }
        .marquee-wrapper {
          white-space: nowrap;
          overflow: hidden;
          position: relative;
        }

        .marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 32s linear infinite;
          height:fit-content;
        }

        .marquee-item {
          display: inline-block;
          margin-right: 50px;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }

        
      `}</style>
    </div>
  );
};

export default MarqueeSlider;
