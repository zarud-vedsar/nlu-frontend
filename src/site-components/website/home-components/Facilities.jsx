import React, { useEffect, useState } from "react";
import AOS from "aos";
import classroom from "../assets/Images/classroom.png";
import lib from "../assets/Images/library-64.png";
import judge from "../assets/Images/judge-64.png";
import hostel from "../assets/Images/hostel-64.png";
import football from "../assets/Images/football-64.png";
import wifi from "../assets/Images/wi-fi-64.png";
import research from "../assets/Images/research-64.png";
import dance from "../assets/Images/dance-64.png";

const Facilities = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <section className="facilities-sec" data-aos="fade-up" data-aos-delay="100">
        <div className="container id-position-relative">
          <div className="row">
            <div className="col-md-12 mb-3 text-center">
              <h2 className="heading-primary2 source-font" style={{ fontSize: '55px' }}>Our Facilities</h2>
              <div className="heading-divider"></div>
            </div>
          </div>
          <div className="faccontainer">
            <div className="facitems-sec">
              <ul className="facitems">
                <li className="facitem" data-aos={`${isMobile ? "fade-up" : "fade-right"}`} data-aos-delay="100">
                  <div className="item-cont">
                    <div className="ico-bx">
                      <img className="icoimg" src={classroom} />
                    </div>
                    <div className="facttx">
                      <h6>Modern Classrooms:</h6>
                      <p>
                        Equipped with multimedia tools for interactive learning.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="facitem" data-aos="fade-up" data-aos-delay="100">
                  <div className="item-cont">
                    <div className="ico-bx">
                      <img className="icoimg" src={lib} />
                    </div>
                    <div className="facttx">
                      <h6>Well-Stocked Library:</h6>
                      <p>
                        Extensive collection of legal texts, journals, and
                        e-resources.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="facitem" data-aos="fade-up" data-aos-delay="100">
                  <div className="item-cont">
                    <div className="ico-bx">
                      <img className="icoimg" src={judge} />
                    </div>
                    <div className="facttx">
                      <h6>Moot Courtrooms:</h6>
                      <p>
                        Dedicated spaces for practical legal training and mock
                        trials.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="facitem" data-aos={`${isMobile ? "fade-up" : "fade-right"}`} data-aos-delay="100">
                  <div className="item-cont">
                    <div className="ico-bx">
                      <img className="icoimg" src={hostel} />
                    </div>
                    <div className="facttx">
                      <h6>Hostel Accommodation:</h6>
                      <p>Comfortable living spaces for students.</p>
                    </div>
                  </div>
                </li>
                <li className="facitem" data-aos="fade-up" data-aos-delay="100">
                  <div className="item-cont">
                    <div className="ico-bx">
                      <img className="icoimg" src={football} />
                    </div>
                    <div className="facttx">
                      <h6>Sports Complex:</h6>
                      <p>Facilities for various indoor and outdoor sports.</p>
                    </div>
                  </div>
                </li>
                <li className="facitem" data-aos="fade-up" data-aos-delay="100">
                  <div className="item-cont">
                    <div className="ico-bx">
                      <img className="icoimg" src={wifi} />
                    </div>
                    <div className="facttx">
                      <h6>Wi-Fi Connectivity:</h6>
                      <p>
                        High-speed internet for academic research and
                        communication.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="facitem" data-aos="fade-up" data-aos-delay="100">
                  <div className="item-cont">
                    <div className="ico-bx">
                      <img className="icoimg" src={research} />
                    </div>
                    <div className="facttx">
                      <h6>Research Centers:</h6>
                      <p>Specialized areas for legal and policy research.</p>
                    </div>
                  </div>
                </li>
                <li className="facitem" data-aos={`${isMobile ? "fade-up" : "fade-right"}`} data-aos-delay="100">
                  <div className="item-cont">
                    <div className="ico-bx">
                      <img className="icoimg" src={dance} />
                    </div>
                    <div className="facttx">
                      <h6>Cultural Zone:</h6>
                      <p>
                        Platforms for student clubs, events, and cultural
                        activities.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Facilities;
