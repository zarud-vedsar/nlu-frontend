import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import NluPrg from "../assets/Images/nlu-prayagraj.jpg";
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import nluPrayagraj from "../assets/Images/nlu-prayagraj.jpg";
const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);
  return (
    <>
      <section className='section'>
        <div className="container">
          <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
          <div className='col-md-6 col-lg-6 col-12 col-sm-12 order-md-1 order-sm-1 order-1' data-aos="fade-left">
              <div className='about-img-bx'>
                <img src={nluPrayagraj} className='img-fluid nlu-prayagraj about-img' alt='Dr. Rajendra Prasad National Law University campus in Prayagraj, with modern architecture and lush greenery.' />
              </div>
            </div>
            <div className='col-md-6 col-lg-6 col-12 col-sm-12 order-md-1 order-sm-2 order-2' data-aos="fade-right" data-aos-delay="50">
              <h2 className="abthead butler-regular mb-3">
                Welcome to Dr. Rajendra Prasad National Law University, Prayagraj
              </h2>
              <p className='mb-3'>Uttar Pradesh National Law University, Prayagraj, established in 2020 by Uttar Pradesh National Law University Act, 2020 (U.P. Act no 26 of 2020) and renamed as Dr Rajendra Prasad National Law University by the amendment in August 2023 (U.P. Act no. 11 of 2023), is the newest law institution dedicated to legal excellence that meets an unparalleled environment for aspiring lawyers, judges, academia and other professionals.</p>
              <p className='mb-3'>Nested in the Prayagraj, a city which has been known for her academic legacy and where knowledge, aspiration and justice confluence like the three rivers, NLU, Prayagraj offers extraordinary opportunities for students to embark on a transformative journey into the world of law.</p>
              
              <Link to={'/about'} className='btn btn-primary border border-primary d-flex justify-content-center align-items-center w-fit about-read-more'>Read More &nbsp; <FaArrowRightLong /></Link>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
export default About;