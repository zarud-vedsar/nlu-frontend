import React, { useState, useEffect } from "react";
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import AboutBg from "../assets/Images/university.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { PHP_API_URL } from "../../Helper/Constant";

const MarqueeSlider = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [animationClass, setAnimationClass] = useState("marqueew");

  useEffect(() => {
    const fetchData = async () => {
      if (items.length > 0) return; // Prevent fetching if data is already loaded
      try {
        const formData = new FormData();
        formData.append("data", "load_mrq_slider");
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        Next();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const resetAnimation = () => {
    setAnimationClass("");
    setTimeout(() => {
      setAnimationClass("marqueew");
    }, 1);
  };

  const Next = () => {
    resetAnimation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const Prev = () => {
    resetAnimation();
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  return (
    <div
      className="container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="row">
        <div className="col-lg-9 id-marquee-wrapper">
          <div className="id-mrq-content">
            <p className={`${animationClass} marquee-text`}>
              <a
                href={items[currentIndex]?.link}
              >
                {items[currentIndex]?.content}{" "}

              </a>


            </p>
          </div>
          <div className="marquee-ctrl-btn ddd-flex">
            <button onClick={Prev} className="btn-left">
              <FaLongArrowAltLeft className="i" />
            </button>
            <button onClick={Next} className="btn-right">
              <FaLongArrowAltRight className="i" />
            </button>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card border-0 shadow-none cardimlink imp-link-card">
            <div
              className="card-body imp-card-body id-imp-card-body"
              style={{ padding: "0" }}
            >
              <div
                className="imlink id-imp-link"
                style={{ justifyContent: "flex-start", paddingLeft: "20px" }}
              >
                <div className="imimg">
                  <img
                    src={AboutBg}
                    className="img-fluid"
                    style={{ width: "60%", marginRight: "0" }}
                  />
                </div>
                <Link
                  to="/about"
                  className="text-white"
                >
                  <i className="fas"><FaLongArrowAltRight /></i>
                  <span style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }} className="text-white">About University &nbsp; <FaLongArrowAltRight /></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeSlider;
