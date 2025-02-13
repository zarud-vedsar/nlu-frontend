import React, { useState, useEffect } from "react";
import AOS from "aos";
import { FILE_API_URL, PHP_API_URL } from "../../Helper/Constant";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 
import axios from "axios";
import defaultImage from "../assets/Images/useful-1.png";
import { slugify } from "../../Helper/HelperFunction";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const UseFullLinks = () => {
  const [usefulLinks, setUsefullLinks] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });

    getUsefulLink();
  }, []);

  const getUsefulLink = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_link");
      const response = await axios.post(
        `${PHP_API_URL}/useful_link.php`,
        bformData
      );
      setUsefullLinks(response.data.data);
    } catch (error) {
      console.error("Error fetching useful links:", error);
    }
  };

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

  return (
    <>
      {usefulLinks && usefulLinks.length > 0 && (
        <section className="usefulllnk" data-aos="fade-up" data-aos-delay="100">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h2 className="heading-primary2">Useful Links</h2>
                <div className="heading-divider"></div>
              </div>
            </div>
            <div className="usefullcontainer mt-4">
              <Slider {...sliderSettings}>
                {usefulLinks
                  .filter((link) => link.status === 1 && link.delete_status === 0)
                  .map((link, index) => (
                    <div key={index} className="slider-item">
                      <a
                        href={
                          link.link_other_link
                            ? link.link_other_link
                            : `/page/${link.link_link}/${slugify(link.link_title)}`
                        }
                        className="useful-link-col"
                        target={link.target}
                        rel="noopener noreferrer"
                      >
                        <img
                          className="linkiimg"
                          src={
                            link?.image_file
                              ? `${FILE_API_URL}/${link.image_file}`
                              : defaultImage
                          }
                          alt={link.link_title}
                        />
                        <p className="linkttx mt-3">{link.link_title}</p>
                      </a>
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
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  width: 100%;
                  max-width: 250px;
                }

    .linkiimg {
  display: block;
  width: 100%; /* Ensure the image stretches full width */
  height: 200px; /* Set a fixed height for consistent aspect ratio */
  object-fit: cover; /* Ensures the image fully fills its container */
  border-radius: 10px; /* Optional, for rounded corners */
}

                .linkttx {
                  font-size: 16px;
                  font-weight: 500;
                  margin-top: 10px;
                }
        
              `}
            </style>
          </div>
        </section>
      )}
    </>
  );
};

export default UseFullLinks;




// import { React, useState, useEffect } from 'react';
// import AOS from "aos";
// import { FILE_API_URL, PHP_API_URL } from '../../Helper/Constant';
// import axios from 'axios';
// import defaultImage from '../assets/Images/useful-1.png';
// import { slugify } from '../../Helper/HelperFunction';
// const UseFullLinks = () => {
//   const [usefulLinks, setUsefullLinks] = useState([]);
//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       easing: "ease-out-cubic",
//     });
//   }, []);

//   const getUsefulLink = async () => {
//     try {
//       const bformData = new FormData();
//       bformData.append("data", "load_link");
//       const response = await axios.post(
//         `${PHP_API_URL}/useful_link.php`,
//         bformData
//       );
//       setUsefullLinks(response.data.data);
//     } catch (error) { /* empty */ }
//   };

//   useEffect(() => {
//     getUsefulLink();
//   }, []);
//   return (
//     <>
//       {usefulLinks && usefulLinks.length > 0 && (
//         <section className="usefulllnk" data-aos="fade-up" data-aos-delay="100">
//           <div className="container">
//             <div className="row">
//               <div className="col-md-12 text-center">
//                 <h2 className="heading-primary2">Useful Links</h2>
//                 <div className="heading-divider"></div>
//               </div>
//             </div>
//             <div className="usefullcontainer mt-4">
//               <div className="row">
//                 {usefulLinks &&
//                   usefulLinks.map((link, index) => {
//                     if (link.status == 1 && link.delete_status == 0) {
//                       return (
//                         <div
//                           className="col-12 col-md-3 mt-3 col-lg-3 text-center"
//                           key={index}
//                         >
//                           <a
//                             href={
//                               link.link_other_link
//                                 ? link.link_other_link
//                                 : `/page/${link.link_link}/${slugify(link.link_title)}`
//                             }
//                             className="useful-link-col"
//                             target={link.target}
//                             rel="noopener noreferrer"
//                           >
//                             <img
//                               className="linkiimg"
//                               src={
//                                 link?.image_file
//                                   ? `${FILE_API_URL}/${link.image_file}`
//                                   : defaultImage
//                               }
//                               alt={link.link_title}
//                             />
//                             <p className="linkttx mt-3">{link.link_title}</p>
//                           </a>
//                         </div>
//                       )
//                     } else {
//                       return null;
//                     }
//                   })}
//               </div>
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// export default UseFullLinks;
