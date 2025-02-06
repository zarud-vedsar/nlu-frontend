import React, { useRef, useEffect } from 'react';
import AOS from "aos";
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import P1 from '../assets/Images/keynote/p1.jpg';
import P2 from '../assets/Images/keynote/p2.jpg';
import P3 from '../assets/Images/keynote/p3.jpg';
import P4 from '../assets/Images/keynote/p4.jpg';
import P5 from '../assets/Images/keynote/p5.png';
import P6 from '../assets/Images/keynote/p6.png';
import P7 from '../assets/Images/keynote/p7.jpg';
import P8 from '../assets/Images/keynote/p8.jpg';
import P9 from '../assets/Images/keynote/p9.jpg';
import P10 from '../assets/Images/keynote/p10.jpg';
import { FaArrowRightLong } from 'react-icons/fa6';

const KeyNote = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  const sliderRef = useRef(null);

  // Define an array of keynote data
  const keyNotes = [
    {
      id: 1,
      name: 'Professor Klaus Bosselmann',
      imageUrl: P1,
      contactDetails: 'Faculty of Law, University of Auckland, New Zealand',
      link: 'https://profiles.auckland.ac.nz/k-bosselmann'
    },
    {
      id: 2,
      name: 'Professor Philippe Cullet',
      imageUrl: P2,
      contactDetails: 'SOAS, University of London, England',
      link: 'https://www.soas.ac.uk/about/philippe-cullet'
    },
    {
      id: 3,
      name: 'Dr. Ivano Alogna',
      imageUrl: P3,
      contactDetails: 'Senior Research Fellow in Environmental and Climate Change Law, BIICL, France',
      link: 'https://www.biicl.org/people/ivano-alogna'
    },
    {
      id: 4,
      name: 'Dr. Robert Russo',
      imageUrl: P4,
      contactDetails: 'Peter Allard School of Law, University of British Columbia, Vancouver, Canada',
      link: 'https://allard.ubc.ca/about-us/our-people/robert-russo'
    },
    {
      id: 5,
      name: 'Professor Leela Krishnan',
      imageUrl: P5,
      contactDetails: 'School of Legal Studies, Cochin University of Science and Technology',
      link: 'https://www.rpnlup.ac.in/wp-content/uploads/2024/11/Prof.-P.-Leelakrishnan.pdf'
    },
    {
      id: 6,
      name: 'Justice Rinzin Penjor',
      imageUrl: P6,
      contactDetails: 'Judge, Supreme Court of Bhutan; Vice Chairman, Bar Council of Bhutan',
      link: 'blank'
    },
    {
      id: 7,
      name: 'Professor K. Konasinghe',
      imageUrl: P7,
      contactDetails: 'Faculty of Law, University of Colombo, Sri Lanka',
      link: 'https://www.res.cmb.ac.lk/public.international.law/kokila/'
    },
    {
      id: 8,
      name: 'Professor Amber Pant',
      imageUrl: P8,
      contactDetails: 'University of Tribhuvan, Nepal',
      link: 'https://www.iucnael.org/en/81-about-us/members-of-the-governing-board/501-professor-amber-prasad-pant'
    },
    {
      id: 9,
      name: 'Michael D. Wilson',
      imageUrl: P9,
      contactDetails: 'Justice, Hawaii Supreme Court, USA',
      link: 'https://en.wikipedia.org/wiki/Michael_D._Wilson'
    },
    {
      id: 10,
      name: 'Professor Moon-Hyun Koh',
      imageUrl: P10,
      contactDetails: 'Professor, College of Law, Soongsil University, Seoul, Korea',
      link: 'https://law.ssu.ac.kr/web/sub1/sub1_prof_detail02.do'
    },

  ];

  const sliderSettings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 30000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '20px',
        },
      },
    ],
  };

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  return (
    <div
      className="latest-area section-padding-20 kn-position-realative"
      style={{ background: "#F2F2F2" }} data-aos="fade-up" data-aos-delay="100">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-3 text-center">
            <h2 className="heading-primary2">Keynote Speakers</h2>
            <div className="heading-divider"></div>
          </div>
        </div>
        <div className="row mt-3">
          {/* Prev button */}
          <div className="col-2">
            <button onClick={prevSlide} className="kn-prev kn-btn">
              <FaChevronLeft />
            </button>
          </div>

          <Slider
            ref={sliderRef}
            {...sliderSettings}
            className="kn-cards-contain"
          >
            {keyNotes.map((note) => (
              <div className="sldrbx" key={note.id} style={{ margin: "auto" }}>
                <div
                  className="sldrcard card border-0 soft-shadow"
                  style={{
                    width: "90%",
                    borderRadius: "10px",
                    margin: "0 auto",
                  }}
                >
                  <div className="sldritem">
                    <div className="sldrbimgbx">
                      <img src={note.imageUrl} className="sldrbimg" />
                    </div>

                    <div className="ms-3">
                      <h5 className="card-title mt-0 xtitle kn-title text-center">
                        {note.name}
                      </h5>
                      <p
                        className="card-text threeeclips"
                        style={{ textAlign: "center" }}
                      >
                        {note.contactDetails}
                      </p>
                      <div className="text-center">
                        <Link target="" className="btn-link" to={note.link}>
                          Read More &nbsp;
                          <FaArrowRightLong />{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* Next button */}
          <div className="col-2">
            <button onClick={nextSlide} className="kn-next kn-btn">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyNote;
