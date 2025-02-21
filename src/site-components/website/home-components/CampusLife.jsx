import React, { useEffect } from "react";
import AOS from "aos";
import { GoArrowUpRight } from "react-icons/go";
import CampusBg from "../assets/Images/campus-life/cl-1.webp";
import Hostelbg from "../assets/Images/campus-life/hostel.jpg";
import HealthBg from "../assets/Images/campus-life/health.webp";
import SportBg from "../assets/Images/campus-life/sport.webp";
import FacilitiesBg from "../assets/Images/campus-life/facilities.jpg";

const CampusLife = () => {
    useEffect(() => {
      AOS.init({
        duration: 1000,
        easing: "ease-out-cubic",
      });
    }, []);
  return (
    <section className="campus">
      <div className="container">
        <div className="row">
          <div className="col-lg-4" data-aos="fade-right" data-aos-delay="100">
            <div className="campus-life-content-wrapper">
              <h2 className="heading-primary2 mb-0 butler-regular">
                Campus Life
              </h2>
              <div className="heading-divider mb-4"></div>
              <p>
                The university offers a vibrant and inclusive campus environment
                where academic rigor blends seamlessly with co-curricular
                activities. It fosters a supportive community of talented
                students and experienced faculty, creating a space for holistic
                growth.
              </p>
              <img
                loading="lazy"
                decoding="async"
                width="136"
                height="199"
                src={CampusBg}
                className="attachment-large size-large wp-image-916 mb-3"
                alt=""
              />
            </div>
          </div>
          <div className="col-lg-8">
            <div className="row">
              <div className="col-lg-6 mb-3" data-aos="fade-up" data-aos-delay="100">
                <div className="campus__life--single item_box">
                  <div className="campus__life--single--bg">
                    <img decoding="async" src={Hostelbg} alt="Campus" />
                  </div>
                  <div className="campus__life--single--flex">
                    <div className="campus__life--single--content">
                      <h3 className="campus__life--single--title title">
                        <a
                          aria-label="service"
                          href="#"
                          className="heading-primary3 gorditas-regular"
                        >
                          Hostel Life
                        </a>
                      </h3>
                      <p className="campus__life--single--description des">
                        Modern and comfortable hostels provide a safe and homely
                        atmosphere for students. With well-maintained facilities
                        and opportunities for bonding, the hostels encourage a
                        sense of community while ensuring personal space.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-3" data-aos="fade-up" data-aos-delay="100">
                <div className="campus__life--single item_box">
                  <div className="campus__life--single--bg">
                    <img decoding="async" src={HealthBg} alt="Campus" />
                  </div>
                  <div className="campus__life--single--flex">
                    <div className="campus__life--single--content">
                      <h3 className="campus__life--single--title title">
                        <a
                          aria-label="service"
                          href="#"
                          className="heading-primary3 gorditas-regular"
                        >
                          Health and Wellness
                        </a>
                      </h3>
                      <p className="campus__life--single--description des">
                        On-campus medical facilities, regular health check-ups,
                        and mental wellness programs ensure that students remain
                        in good health, both physically and mentally, throughout
                        their academic journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-3" data-aos="fade-up" data-aos-delay="100">
                <div className="campus__life--single item_box">
                  <div className="campus__life--single--bg">
                    <img decoding="async" src={FacilitiesBg} alt="Campus" />
                  </div>
                  <div className="campus__life--single--flex">
                    <div className="campus__life--single--content">
                      <h3 className="campus__life--single--title title">
                        <a
                          aria-label="service"
                          href="#"
                          className="heading-primary3 gorditas-regular"
                        >
                          Connectivity and Facilities
                        </a>
                      </h3>
                      <p className="campus__life--single--description des">
                        An active alumni network provides valuable guidance
                        through mentorship and career support. Alumni
                        engagements open doors to internships, placements, and
                        lifelong connections.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-3" data-aos="fade-up" data-aos-delay="100">
                <div className="campus__life--single item_box">
                  <div className="campus__life--single--bg">
                    <img decoding="async" src={SportBg} alt="Campus" />
                  </div>
                  <div className="campus__life--single--flex">
                    <div className="campus__life--single--content">
                      <h3 className="campus__life--single--title title">
                        <a
                          aria-label="service"
                          href="#"
                          className="heading-primary3 gorditas-regular"
                        >
                          Sports and Recreation
                        </a>
                      </h3>
                      <p className="campus__life--single--description des">
                        The campus boasts facilities for various sports,
                        including basketball, tennis, and cricket, along with a
                        fully equipped gym. Recreational spaces encourage
                        students to relax and maintain a healthy balance in
                        their routines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusLife;
