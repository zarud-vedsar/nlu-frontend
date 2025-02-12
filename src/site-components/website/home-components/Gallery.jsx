import React, { useState, useEffect } from "react";
import AOS from "aos";
import { FILE_API_URL, PHP_API_URL } from "../../Helper/Constant";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { FaLongArrowAltRight } from "react-icons/fa";
const Gallery = () => {
  const [image, setImage] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
    getGallery();
  }, []);

  const getGallery = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getRandomGallery");
      const response = await axios.post(`${PHP_API_URL}/gallery.php`, bformData);
      setImage(response.data.data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
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
    arrows: true,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    pauseOnHover: false,
    centerMode: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="gallery-section" data-aos="fade-up" data-aos-delay="100">
      <div className="container  my-4 py-2">
        <div className="row">
          <div className="col-md-12 col-12 text-center" style={{position:"relative"}}>
            <h2 className="heading-primary2">Our Gallery</h2>
            <div className="heading-divider"></div>
          </div>
        </div>
        <Link to="/image-gallery" target='_blank' className='text-primary custom-link gorditas-regular ms-5 addtextoverlap'>View All <FaLongArrowAltRight /></Link>
        <div className="gallery-container mt-4 ">
          <Slider {...sliderSettings}>
            {image.map((img, index) => (
              <div key={index} className="slider-item col-12">
                <a href={`${FILE_API_URL}/gallery/${img}`} target="_blank" rel="noopener noreferrer">
                <img
  className="gallery-img1"
  src={`${FILE_API_URL}/gallery/${img}`}
  alt={`Gallery Image ${index + 1}`}
  style={{ 
    width: "100%", 
    maxWidth: "100%", 
   
    height: "200px", 
    objectFit: "cover", 
    borderRadius: "10px" 
  }}
/>
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>

  

<style>
        {`
 
  .addtextoverlap{
      position: absolute;
    right: 100px;
    top: 20px;
  }


.slider-item {
  display: flex;
  justify-content: center; /* Change from end to center */
  align-items: center;
  width: 100%; 
}

.gallery-img1 {
  width: 100%;
  max-width: 100%;
  height: 200px; 
  object-fit: cover;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .slider-item {
    display: flex;
    justify-content: center; /* Ensures the image is centered */
    align-items: center;
    width: 100%;
  }

  .gallery-img1 {
    width: 100%;
    max-width: 100%;
    height: auto; 
    object-fit: cover;
   
  }
}
 @media screen and (min-width:430px) and (max-width:500px){
  .gallery-img1 {
  margin-left:40px;
 }
        }
  @media screen and (min-width:370px) and (max-width:400px){
  .gallery-img1 {
  margin-left:20px;
 }

        }
   @media screen and (min-width:410px) and (max-width:430px){
  .gallery-img1 {
  margin-left:30px;
 }

    .addtextoverlap {
      position: absolute;
      right: 10%;
      top: 20px;
    }
        `}
        </style>
    </div>
  );
};

export default Gallery;


// import React, { useState, useEffect, useRef } from 'react';
// import AOS from "aos";
// import Slider from 'react-slick';
// import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
// import Img2 from '../assets/Images/img-2.jpg';
// import { FaLongArrowAltRight } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { PHP_API_URL } from '../../Helper/Constant';
// import { FILE_API_URL } from '../../Helper/Constant';

// import LightGallery from "lightgallery/react";
// import "lightgallery/css/lightgallery.css";
// import "lightgallery/css/lg-thumbnail.css";
// import "lightgallery/css/lg-zoom.css";
// import "lightgallery/css/lg-autoplay.css";
// import "lightgallery/css/lg-fullscreen.css";
// import "lightgallery/css/lg-share.css";
// import "lightgallery/css/lg-video.css";
// import "lightgallery/css/lg-pager.css";

// // Import all plugins
// import lgThumbnail from "lightgallery/plugins/thumbnail";
// import lgZoom from "lightgallery/plugins/zoom";
// import lgAutoplay from "lightgallery/plugins/autoplay";
// import lgFullscreen from "lightgallery/plugins/fullscreen";
// import lgShare from "lightgallery/plugins/share";
// import lgVideo from "lightgallery/plugins/video";
// import lgPager from "lightgallery/plugins/pager";
// const Gallery = () => {
//   const sliderRef = useRef(null);
//   const [image, setImage] = useState([]);
//     useEffect(() => {
//       AOS.init({
//         duration: 1000,
//         easing: "ease-out-cubic",
//       });
//     }, []);

//   const sliderSettings = {
//     infinite: true,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     dots: false,
//     arrows: false,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1,
//           centerMode: true,
//           centerPadding: '20px',
//         },
//       },
//     ],
//   };

//   const nextSlide = () => {
//     if (sliderRef.current) {
//       sliderRef.current.slickNext();
//     }
//   };

//   const prevSlide = () => {
//     if (sliderRef.current) {
//       sliderRef.current.slickPrev();
//     }
//   };

//   const getGallery = async () => {
//     try {
//       const bformData = new FormData();
//       bformData.append("data", "getRandomGallery");
//       const response = await axios.post(`${PHP_API_URL}/gallery.php`, bformData);
//       setImage(response.data.data);
//     } catch (error) { /* empty */ }
//   };
//   useEffect(() => {
//     getGallery()
//   }, [])
//   return (
//     <div className="latest-area section-padding-30 kn-position-realative" data-aos="fade-up" data-aos-delay="100">
//       <div className="container">
//         <div className="row">
//           <div className="col-md-12">
//             <div className="gal-section-title-wrapper">
//             <div className="row w-full">
//             <div className="col-md-12 mb-3 text-center">
//               <h2 className="heading-primary2">Our Gallery</h2>
//               <div className="heading-divider"></div>
//             </div>
//           </div>
             
//               <Link to="/image-gallery" target='_blank' className='text-primary custom-link gorditas-regular ms-5'>View All <FaLongArrowAltRight /></Link>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           {/* Prev button */}
//           <div className="col-2">
//             <button onClick={prevSlide} className="kn-prev kn-btn">
//               <FaChevronLeft />
//             </button>
//           </div>
//           <Slider ref={sliderRef} {...sliderSettings} className="kn-cards-contain">
//             {image.map((img, index) => (
//               <div className="col-md-3 mb-333 col-lg-3 col-12 col-sm-12" key={index}>
//                 <div style={{ width: '95%' }}>
//                   <LightGallery
//                     speed={500}
//                     plugins={[
//                       lgThumbnail,
//                       lgZoom,
//                       lgAutoplay,
//                       lgFullscreen,
//                       lgShare,
//                       lgVideo,
//                       lgPager,
//                     ]}
//                     mode="lg-fade">
//                     <a href={`${FILE_API_URL}/gallery/${img}`}>
//                       {/* {console.log(img)} */}
//                       <img src={`${FILE_API_URL}/gallery/${img}`} className="gal-image" />
//                     </a>
//                   </LightGallery>
//                 </div>
//               </div>
//             ))}

//           </Slider>

//           {/* Next button */}
//           <div className="col-2">
//             <button onClick={nextSlide} className="kn-next kn-btn">
//               <FaChevronRight />

//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Gallery;
