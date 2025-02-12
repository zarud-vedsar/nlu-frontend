

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { FILE_API_URL, PHP_API_URL } from "../../site-components/Helper/Constant";
import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function UserTestimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const bformData = new FormData();
        bformData.append("data", "load_testimonial_front");
        const response = await axios.post(
          `${PHP_API_URL}/std_testimonial.php`,
          bformData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.status === 200) {
          setTestimonials(response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    loadData();
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
  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < rating ? <FaStar key={i} className="text-warning me-1" /> : <FaRegStar key={i} className="text-secondary me-1" />
    );

  return (
    <div className="container pb-5 mb-4">
     
       <div className="row">
            <div className="col-md-12 mb-3 text-center">
              <h2 className="heading-primary2">What Our Students Say</h2>
              <div className="heading-divider"></div>
            </div>
          </div>
      {testimonials.length > 0 ? (
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="px-3 my-4">
              <div className="testimonial-card">
                <p className="testimonial-text mb-0 py-1">
                  "{testimonial.test_content.split(" ").slice(0, 10).join(" ")}
                  {testimonial.test_content.split(" ").length > 10 ? "..." : ""}"
                </p>
                <h5 className="fw-semibold mb-1 py-1">{testimonial.test_name}</h5>

                <div className="row align-items-center g-3 responsivebox">
                  <div className="col-12 col-md-4 d-flex1 justify-center items-center ">
                    {testimonial.test_photo && (
                      <img
                        src={`${FILE_API_URL}/testimonial/${testimonial.test_photo}`}
                        alt={testimonial.test_name}
                        className="rounded-circle border border-2 border-secondary"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      
                    )}

                  </div>

                  <div className="col-12 col-md-8 text-center text-md-start">
                    <p className="text-muted small mb-0">
                      {testimonial.test_occupation} at {testimonial.test_company}
                    </p>
                    <p className="text-muted small mb-0">{testimonial.email}</p>
                    <p className="text-muted small mb-0">{testimonial.phone}</p>
                  </div>
                </div>

                <div className="d-flex justify-content-center py-3">{renderStars(parseInt(testimonial.test_rating))}</div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center">No testimonials available.</p>
      )}

      {/* Internal CSS */}
      <style>
        {`
          .testimonial-card {
            background: white;
            border-radius: 10px;
       box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);

            padding: 20px;
            text-align: center;
            position: relative;
            min-height: 230px;
          }

          .testimonial-text {
            font-style: italic;
            color: #555;
            min-height: 100px;
          }

          .testimonial-user {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
          }

          .testimonial-img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #ccc;
          }

          .slick-prev, .slick-next {
            display: none !important;
          }

          @media (max-width: 768px) {
            .slick-prev {
    left: 0 !important;
  }

  .slick-next {
    right: 0 !important;
  }
            .testimonial-card {
              padding: 15px;
            }
              .responsivebox{
              flex-direction:column;
              justify-content:center;
              }
             .d-flex1 {
    display: flex !important;
    justify-content: center;
}
          }
        `}
      </style>
    </div>
  );
}

export default UserTestimonials;



// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import axios from "axios";
// import { FILE_API_URL, PHP_API_URL } from "../../site-components/Helper/Constant";
// import { FaStar, FaRegStar } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function UserTestimonials() {
//   const [testimonials, setTestimonials] = useState([]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const bformData = new FormData();
//         bformData.append("data", "load_testimonial_front");
//         const response = await axios.post(
//           `${PHP_API_URL}/std_testimonial.php`,
//           bformData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         if (response.data.status === 200) {
//           setTestimonials(response?.data?.data);
//         }
//       } catch (error) {
//         console.error("Error fetching testimonials:", error);
//       }
//     };

//     loadData();
//   }, []);

//   const CustomPrevArrow = (props) => {
//     const { className, style, onClick } = props;
//     return (
//       <div
//         className={className}
//         style={{
//           ...style,
//           background: "#2e3e50",
//           borderRadius: "50%",
//         //   padding: "10px",
//           width: "45px",
//           height: "45px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 1,
//         }}
//         onClick={onClick}
//       />
//     );
//   };
  
//   const CustomNextArrow = (props) => {
//     const { className, style, onClick } = props;
//     return (
//       <div
//         className={className}
//         style={{
//           ...style,
//           background: "#2e3e50",
//           borderRadius: "50%",
//         //   padding: "10px",
//           width: "45px",
//           height: "45px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 1,
//         }}
//         onClick={onClick}
//       />
//     );
//   };
  
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     prevArrow: <CustomPrevArrow />, // Custom Previous Button
//     nextArrow: <CustomNextArrow />, // Custom Next Button
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   // Function to generate star ratings
//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, i) =>
//       i < rating ? <FaStar key={i} className="text-warning me-1" /> : <FaRegStar key={i} className="text-secondary me-1" />
//     );
//   };

  
//   return (
//     <div className="container py-5">
//       <h2 className="text-center fw-bold mb-4">What Our Clients Say</h2>

//       {testimonials.length > 0 ? (
//         <Slider {...settings} >
//           {testimonials.map((testimonial, index) => (
//             <div key={index} className="px-3">
//               <div className="card border-0 shadow p-4 text-center my-3">
//                 {/* Profile Image */}
//                 {testimonial.test_photo && (
//                   <img
//                     src={`${FILE_API_URL}/testimonial/${testimonial.test_photo}`}
//                     alt={testimonial.test_name}
//                     className="rounded-circle border border-2 border-secondary mx-auto"
//                     style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                   />
//                 )}

//                 <p className="mt-3 fst-italic text-dark" style={{minHeight:"130px"}}>
//   "{testimonial.test_content.split(" ").slice(0, 15).join(" ")}
//   {testimonial.test_content.split(" ").length > 15 ? "..." : ""}"
// </p>
                
//                 {/* Name and Occupation */}
//                 <h5 className="text-muted small">{testimonial.email}</h5>
//                 <p className="text-muted small">{testimonial.test_company}</p>
//                 <p className="text-muted small">{testimonial.phone}</p>
//                 <h5 className="fw-semibold">{testimonial.test_name}</h5>
//                 <p className="text-muted small">{testimonial.test_occupation} at {testimonial.test_company}</p>

//                 {/* Star Rating */}
//                 <div className="d-flex justify-content-center">{renderStars(parseInt(testimonial.test_rating))}</div>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       ) : (
//         <p className="text-center">No testimonials available.</p>
//       )}
        
//     </div>
//   );
// }

// export default UserTestimonials;
