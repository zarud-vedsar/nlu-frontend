import React, { useEffect } from "react";
import AOS from "aos";
import { GoArrowUpRight } from "react-icons/go";
import Hostelbg from "../assets/campus/hostel.png";
import HealthBg from "../assets/campus//health.png";
import SportBg from "../assets/campus//sport.png";

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
          <div className="col-md-10 col-lg-10 col-12 col-sm-12 mx-auto mb-3 text-center">
            <h2 className="heading-primary2 source-font" style={{ fontSize: '55px' }}>Campus Life</h2>
            <div className="heading-divider"></div>
            <p className=" text-center mt-3 mb-1" style={{ fontSize: '28px' }}>
              Bringing together a dynamic network of talented and innovative individuals from every corner of the globe.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-lg-4">
            <figcaption>
              <picture>
                <img src={Hostelbg} className="img-fluid w-100" />
              </picture>
            </figcaption>
            <h3 style={{ fontSize: '1.25em', color: '#000' }} className="mt-3 source-font">Hostel Life</h3>
            <p className="heading-para mt-2 source-font" style={{ textAlign: 'left' }}>
              Modern and comfortable hostels provide a safe and homely
              atmosphere for students. With well-maintained facilities
              and opportunities for bonding, the hostels encourage a
              sense of community while ensuring personal space.
            </p>
          </div>
          <div className="col-md-4 col-lg-4">
            <figcaption>
              <picture>
                <img src={HealthBg} className="img-fluid w-100" />
              </picture>
            </figcaption>
            <h3 style={{ fontSize: '1.25em', color: '#000' }} className="mt-3 source-font">Health and Wellness</h3>
            <p className="heading-para mt-2 source-font" style={{ textAlign: 'left' }}>
              On-campus medical facilities, regular health check-ups,
              and mental wellness programs ensure that students remain
              in good health, both physically and mentally, throughout
              their academic journey.
            </p>
          </div>
          <div className="col-md-4 col-lg-4">
            <figcaption>
              <picture>
                <img src={SportBg} className="img-fluid w-100" />
              </picture>
            </figcaption>
            <h3 style={{ fontSize: '1.25em', color: '#000' }} className="mt-3 source-font">Sports and Recreation</h3>
            <p className="heading-para mt-2 source-font" style={{ textAlign: 'left' }}>
              The campus boasts facilities for various sports,
              including basketball, tennis, and cricket, along with a
              fully equipped gym. Recreational spaces encourage
              students to relax and maintain a healthy balance in
              their routines.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CampusLife;
