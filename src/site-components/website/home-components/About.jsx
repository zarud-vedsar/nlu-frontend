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
            <div className='col-md-6 col-lg-6 col-12 col-sm-12 order-md-1 order-sm-2 order-2' data-aos="fade-right" data-aos-delay="50">
              <h2 className="heading-primary butler-regular">
                Welcome to Dr. Rajendra Prasad National Law University, Prayagraj
              </h2>
              <p className='heading-para gorditas-regular'> Dr. Rajendra Prasad National Law University (est. 2020), Prayagraj, stands as a beacon of legal education and excellence.
                Renowned for its innovative and interdisciplinary curriculum, the University is dedicated to shaping future leaders in law,
                judiciary, and academia.
              </p>
              <p className='heading-para gorditas-regular'>Situated in Prayagraj, a city celebrated for its academic heritage, the University provides a transformative learning environment,
                fostering intellectual diversity, mentorship, and professional growth. With a focus on justice, knowledge, and collaboration,
                it nurtures well-rounded legal professionals equipped to impact society meaningfully.
              </p>
              <Link to={'/about'} className='btn btn-primary border border-primary d-flex justify-content-center align-items-center w-fit about-read-more'>Read More &nbsp; <FaArrowRightLong /></Link>
            </div>
            <div className='col-md-6 col-lg-6 col-12 col-sm-12 order-md-2 order-sm-1 order-1' data-aos="fade-left">
              <div className='about-img-bx'>
                <img src={nluPrayagraj} className='img-fluid nlu-prayagraj about-img' alt='Dr. Rajendra Prasad National Law University campus in Prayagraj, with modern architecture and lush greenery.' />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default About;