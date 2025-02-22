import React, { useEffect, useState } from "react";
import AOS from "aos";
import { dataFetchingPost } from "../../site-components/Helper/HelperFunction";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import validator from "validator";
import "./HarukiTabs.css";
import classroom from "../../site-components/website/assets/Images/classroom.png";
import lib from "../../site-components/website/assets/Images/library-64.png";
import judge from "../../site-components/website/assets/Images/judge-64.png";
import hostel from "../../site-components/website/assets/Images/hostel-64.png";
import football from "../../site-components/website/assets/Images/football-64.png";
import wifi from "../../site-components/website/assets/Images/wi-fi-64.png";
import research from "../../site-components/website/assets/Images/research-64.png";
const HarukiTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [speciality, setSpeciality] = useState([]);
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-out-cubic" });
    fetchSpeciality();
  }, []);

  const fetchSpeciality = async (deleteStatus = 0) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/speciality/fetch`,
        { listing: "yes", deleteStatus, status: 1 }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSpeciality(response.data);
      }
    } catch (error) { /* empty */ }
  };
  const facilities = [
    {
      title: 'Modern Classrooms',
      img: classroom
    },
    {
      title: 'Well-Stocked Library',
      img: lib
    },
    {
      title: 'Moot Courtrooms',
      img: judge
    },
    {
      title: 'Hostel Accommodation',
      img: hostel
    },
    // {
    //   title: 'Sports Complex',
    //   img: football
    // },
    {
      title: 'Wi-Fi Connectivity',
      img: wifi
    },
    {
      title: 'Research Centers',
      img: research
    }
  ]

  return (
    <div className="haruki_tabs-container mx-auto">
      <div className="haruki_tabs-header flex border-b">
        {["Specialities", "Facilities"].map((tab, index) => (
          <button
            key={index}
            className={`haruki_tab-button source-font transition-all ${activeTab === index
              ? "active"
              : ""
              }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="haruki_tabs-content p-4 text-gray-700">
        {activeTab === 0 && (
          <>
            <div className="row">
              {speciality &&
                speciality.map((item, index) => (
                  <div className="col-md-4 col-lg-4" key={index}>
                    <div className="speciality-img-card">
                      <img
                        src={item.image}
                        alt="Speciality"
                      />
                      <h3 className="source-font" dangerouslySetInnerHTML={{
                        __html: validator.unescape(validator.unescape(item.title))
                      }}></h3>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
        {activeTab === 1 && (
          <>
            <div className="row">
              {facilities &&
                facilities.map((item, index) => (
                  <div className="col-md-4 col-lg-4" key={index}>
                    <div className="speciality-img-card">
                      <img
                        src={item.img}
                        alt="Speciality"
                      />
                      <h3 className="source-font" dangerouslySetInnerHTML={{
                        __html: validator.unescape(validator.unescape(item.title))
                      }}></h3>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
        {activeTab === 2 && <div></div>}
      </div>
    </div>
  );
};

const Speciality = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className='col-md-12 mb-3 text-center'>
            <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Why Study at RPNLU?</h2>
            <div className='heading-divider'></div>
            <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
              Experience excellence in legal education with expert faculty, modern infrastructure, and career-focused learning.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <HarukiTabs />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speciality;
