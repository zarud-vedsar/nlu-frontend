import React, { useEffect } from "react";
import AOS from "aos";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import LegalExcellence from '../../site-components/website/assets/society/Legal-Excellence-Society.png';
import JusticeAdvocasy from '../../site-components/website/assets/society/Justice-Advocacy-Forum.png';
import Constitutional from '../../site-components/website/assets/society/Constitutional-Law-Society.png';
import MootCourt from '../../site-components/website/assets/society/Moot-Court-ADR-Society.png';
import HumarRights from '../../site-components/website/assets/society/Human-Rights-Legal-Aid-Society.png';
import Corporate from '../../site-components/website/assets/society/Corporate-Business-Law-Society.png';
import CyberLaw from '../../site-components/website/assets/society/Cyber-Law-Technology-Forum.png';
import Environmental from '../../site-components/website/assets/society/Environmental-Law-Sustainability-Society.png';
import rpnl_logo from "../../site-components/website/assets/Images/rpnl_logo.png";

const OurSociety = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-out-cubic",
        });
    }, []);

    const CustomArrow = ({ onClick, direction }) => {
        const isMobile = window.innerWidth <= 768; // Check for mobile view

        return (
            <div
                onClick={onClick}
                style={{
                    position: "absolute",
                    top: "50%",
                    [direction]: isMobile ? "-15px" : "-40px", // Adjust based on screen width
                    transform: "translateY(-50%)",
                    background: "#2e3e50",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                }}
            >
                {direction === "left" ? <FaChevronLeft color="white" /> : <FaChevronRight color="white" />}
            </div>
        );
    };

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true, // ✅ Enable arrows
        prevArrow: <CustomArrow direction="left" />, // ✅ Custom Left Arrow
        nextArrow: <CustomArrow direction="right" />, // ✅ Custom Right Arrow
        pauseOnHover: false,
        centerMode: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };
    const society = [
        {
            id: 1,
            title: "Cultural Society",
            link: "https://www.aimoaiko.com",
            image_file: rpnl_logo,
        },
        {
            id: 2,
            title: "Sports Society",
            link: "https://www.justiceforum.com",
            image_file: rpnl_logo,
        },
        {
            id: 3,
            title: "Moot Court Society",
            link: "https://www.mootcourtadr.com",
            image_file: rpnl_logo,
        },
        {
            id: 4,
            title: "Legal Aid Society",
            link: "https://www.mootcourtadr.com",
            image_file: rpnl_logo,
        },
        {
            id: 5,
            title: "Internship and Externship Society",
            link: "https://www.mootcourtadr.com",
            image_file: rpnl_logo,
        },
        {
            id: 6,
            title: "Debate and Discussion Society",
            link: "https://www.humanrightslegal.com",
            image_file: rpnl_logo,
        },
        // {
        //     id: 6,
        //     title: "Corporate & Business Law Society",
        //     link: "https://www.corporatelawsociety.com",
        //     image_file: Corporate,
        // },
        // {
        //     id: 7,
        //     title: "Cyber Law & Technology Forum",
        //     link: "https://www.cyberlawforum.com",
        //     image_file: CyberLaw,
        // },
        // {
        //     id: 8,
        //     title: "Environmental Law & Sustainability Society",
        //     link: "https://www.environmentallawsociety.com",
        //     image_file: Environmental,
        // }
    ];

    return (
        <>
            {society && society.length > 0 && (
                <section className="oursos" data-aos="fade-up" data-aos-delay="100">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-12 text-center">
                                <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Our Societies</h2>
                                <div className='heading-divider'></div>
                                <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
                                    Explore our vibrant student societies fostering learning, leadership, and collaboration.
                                </p>
                            </div>
                        </div>
                        <div className="usefullcontainer mt-4">
                            <Slider {...sliderSettings}>
                                {society.map((link, index) => (
                                    <div className="socicard-bx" key={index}>
                                        <div className="socicard-bx-item-bx text-center">
                                            <div className="socicard-bx-item" style={{ display: 'flex !important' }}>
                                                <Link to={link.link}
                                                    className="socicard-bx-item-link"
                                                    target={link.target}
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        className="socicard-bx-item-linkimg"
                                                        src={link?.image_file}
                                                        alt={link.title}
                                                    />
                                                    <p className="linkttx mt-3">{link.title}</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <style>
                            {`
                .usefullcontainer {
                  width: 100%;
                  max-width: 1200px;
                  margin: 0 auto;
                }

                .slider-item {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-width: 250px;
                  max-width: 300px;
                  padding: 10px;
                }

                .slick-track {
                  display: flex;
                  gap: 20px;
                }

                .slick-slide {
                  display: flex;
                  justify-content: center;
                }

                .slick-list {
                  overflow: hidden;
                  padding: 0px !important;
                }

                .useful-link-col {
                  text-align: center;
                  display: flex;
                  flex-direction: column;
                  align-items: center;                  
                  padding: 15px;
                  background: #fff;
                  border-radius: 10px;
                  width: 100%;
                }

    .linkiimg {
  display: block;
  width: 100%; /* Ensure the image stretches full width */
  height: 200px; /* Set a fixed height for consistent aspect ratio */
  object-fit: contain; /* Ensures the image fully fills its container */
  border-radius: 10px; /* Optional, for rounded corners */
}

                .linkttx {
                  font-size: 16px;
                  font-weight: 500;
                  margin-top: 10px;
                }
                  @media (max-width: 768px) {
        .slick-track {
                
                  gap: 0px !important;
                }
              }
                  @media screen and (min-width:370px) and (max-width:420px){
  .gallery-img {
  margin-left:20px;
 }
        }
              `}
                        </style>
                    </div>
                </section>
            )}
        </>
    );
};

export default OurSociety;