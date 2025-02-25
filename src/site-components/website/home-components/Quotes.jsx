import React, { useRef } from 'react';
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import QuotesBg from '../assets/Images/quotesbg.png'

const Quotes = () => {
  const sliderRef = useRef(null);

  const Quotes = [
    {
      name: '- Hon’ble President of India Smt. Droupadi Murmu',
      quotes: 'I am confident that RPNLU, Prayagraj will go beyond imparting knowledge of statutes and judgments and will instill in its students ethical values, sense of responsibility, and commitment to serve the nation.',

    },

    {
      name: '— Hon’ble Prime Minister Shri Narendra Modi',
      quotes: 'Just as the city of Prayagraj sits at the confluence of holy rivers, a similar convergence of the streams of interdisciplinary learning, practical approach and a result-oriented curriculam is taking place at the University. This ensures the optimal academic development for the aspiring law students, fostering an environment of intellectual vitality and diverse perspective.',

    },

    {
      name: '— Hon’ble Dr. Justice D. Y. Chandrachud, The Chief Justice of India',
      quotes: 'It is commendable that the University has committed to designing an innovative curriculum withCourses that navigate contemporary legal issues such as technology and privacy law, corporate ethicsand governance, bioethics and healthcare law, sports law, entertainment law, and global rightsissues. Further, its vision for the integration of cutting-edge technology into its teaching methodology is promising and imperative in present times.',

    },
    {
      name: '— श्री योगी आदित्यनाथ जी, माननीय मुख्यमंत्री, उत्तर प्रदेश सरकार',
      quotes: 'अमृतकाल में डॉ राजेन्द्र प्रसाद राष्ट्रीय विधि विश्वविद्यालय, प्रयागराज का उद्घाटन समारोह एक पवन प्रेरणा लेकर आया है मुझे पूर्ण विश्वास है कि विश्विद्यालय के योग्य अध्यापकों द्वारा चारित्रिक, बौद्धिक, एवं मानसिक रूप से परिपक्व किये गये छात्र-छात्राएं न्याय की उपलब्धता सशक्त करते हुए विकसित राष्ट्र की नींव रखने में अपना सर्वश्रेष्ठ योगदान देंगे',

    },
    {
      name: '— Hon’ble Mr. Justice Manoj Misra, Judge Supreme Court of India, & Visitor, RPNLUP',
      quotes: 'The establishment of Dr Rajendra Prasad National Law University at Prayagraj is a step in the right direction and marks a moment in the time where Allahabad’s glorious past meets with the promise of the future',

    },
    {
      name: '— Hon’ble Mr. Justice Arun Bhansali, Chief Justice, Allahabad High Court & Chancellor, RPNLUP',
      quotes: 'The University is poised to set exemplary standards in education, and administrative practices, as an ideal of academic excellence This commitment is expected to provide aspiring lawyers exposure, both at national and international levels, in an adaptive learning environment',

    },
    {
      name: '— Hon’ble Mr. Justice Manoj Kumar Gupta, Judge, Allahabad High Court & Member, General Council, RPNLUP',
      quotes: 'I applaud the University for its inventive approach to shaping the curriculum and incorporating new courses keeping in view the rapidly changing relationship between law and technology Simultaneously, the emphasis on social justice, marginalised communities and the practical aspects of legal education program is poised to significantly enhance the holistic development of students',

    },
    {
      name: '— Sh. Ajay Kumar Mishra, Advocate General, UP. Govt, & Member General Council, RPNLUP',
      quotes: 'May this institution be a beacon of legal scholarship, producing future leaders who champion justice and uphold the rule of law.',

    },
    {
      name: '— Sh Manan Kumar Mishra, Chairman, Bar Council of India & Member, General Council, RPNLUP',
      quotes: 'The establishment of this university marks a significant milestone, reflecting the culmination of tireless dedication and vision from yourself and all involved Your commitment towards advancing excellence is commendable, and I applaud the collective effort that has brought this institution to fruition',

    },
    {
      name: '— Prof. (Dr.) Vijender Kumar, President, Consortium of National Law Universities',
      quotes: 'The creation of Dr Rajendra Prasad National Law University, Prayagraj reflects a commitment to advancing legal education, promoting academic rigor, and nurturing the next generation of legal professionals',

    },
    {
      name: '— Prof. Mamidala Jagadesh Kumar, Chairman, UGC',
      quotes: 'I am confident that Dr Rajendra Prasad National Law University, Prayagraj will uphold the highest standards of academic integrity and contribute significantly to the advancement of legal scholarship',

    },


  ];

  const CustomArrow = ({ onClick, direction }) => {
    const isMobile = window.innerWidth <= 768; // Check for mobile view

    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          top: "50%",
          [direction]: isMobile ? "-15px" : "0px", // Adjust based on screen width
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
        {direction === "left" ? (
          <FaChevronLeft color="white" />
        ) : (
          <FaChevronRight color="white" />
        )}
      </div>
    );
  };


  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, // Enable auto-scroll
    centerMode: false,
    autoplaySpeed: 4000, // Change slides every 3 seconds
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1, centerMode: false } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: false } },
    ],
    // responsive: [
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     },
    //   },
    // ],
  };

  return (
    <>

      <section className="section" data-aos="fade-up" data-aos-delay="100">
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-lg-10 mx-auto">
              <div className="faculty-slider-container shadow px-3" style={{ borderRadius: '20px' }}>
                <Slider ref={sliderRef} {...settings2}>
                  {Quotes.map((quote, index) => (
                    <div className="id-quotes-wrapper py-3 " key={index}>
                      <p className="source-font mb-3 text-center heading-para text-primary" style={{ fontSize: "18px" }}>
                        {quote.quotes}
                      </p>
                      <h6 className="card-title source-font text-dark" style={{ fontSize: '20px' }}>
                        {quote.name}
                      </h6>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Quotes;
