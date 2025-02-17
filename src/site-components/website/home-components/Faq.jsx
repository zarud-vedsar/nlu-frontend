import React, { useState, useEffect } from "react";
import axios from "axios";
import { PHP_API_URL } from "../../Helper/Constant";
import faqBg from "..//assets/Images/faq-bg.jpg"
const FAQ = () => {
  const [faq, setFaq] = useState([]);
  async function getFaq() {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_faq");
      const response = await axios.post(
        `${PHP_API_URL}/faq.php`,
        bformData
      );
      setFaq(response.data.data);
    } catch (error) {
    }
  }
  useEffect(() => {
    getFaq();
  }, []);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleToggle = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };
  return (
    <>
      <section className="section faq-overley" style={{ background: `url(${faqBg}) no-repeat`, backgroundSize: 'cover' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-start">
              <h2 className="heading-primary2 text-white">Why to study at RPNLUP?</h2>
              <div className="heading-divider"></div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="faq-container">
                {faq.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div
                      className="question gorditas-regular"
                      onClick={() => handleToggle(index)}
                    >
                      <span>{faq.title}</span>
                      <span className="icon">
                        {activeIndex === index ? "-" : "+"}
                      </span>
                    </div>
                    {activeIndex === index && (
                      <div className="answer">
                        <p>{faq.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;