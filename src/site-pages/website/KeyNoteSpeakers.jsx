import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import P1 from '../../site-components/website/assets/Images/keynote/P1.jpg';
import P2 from '../../site-components/website/assets/Images/keynote/P2.jpg';
import P3 from '../../site-components/website/assets/Images/keynote/P3.jpg';
import P4 from '../../site-components/website/assets/Images/keynote/P4.jpg';
import P5 from '../../site-components/website/assets/Images/keynote/P5.png';
import P6 from '../../site-components/website/assets/Images/keynote/P6.png';
import P7 from '../../site-components/website/assets/Images/keynote/P7.jpg';
import P8 from '../../site-components/website/assets/Images/keynote/P8.jpg';
import P9 from '../../site-components/website/assets/Images/keynote/P9.jpg';
import P10 from '../../site-components/website/assets/Images/keynote/P10.jpg';
import { FaArrowRightLong } from 'react-icons/fa6';

function KeyNoteSpeakers() {
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
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
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
        <div className="latest-area section-padding-20 kn-position-realative" style={{ background: '#F2F2F2' }}>
            <div className="container">
                <div className="row">
                    <div className='col-md-12 mb-3 text-center'>
                    <h2 className="heading-primary2 source-font" style={{ fontSize: '55px' }}>Keynote Speakers</h2>
                        <div className='heading-divider'></div>
                        <p className='heading-para text-center mt-4'>International Conference on "Law, Technology and Sustainable Development"</p>
                    </div>
                </div>
                <div className="row mt-3">
                    {keyNotes.map((note) => (
                        <div className="col-md-4 mb-3 col-lg-4 col-12 col-sm-12" key={note.id}>
                            <div className="card border-0 soft-shadow" style={{ width: '90%', borderRadius: '10px', margin: '0 auto', minHeight: '180px' }}>
                                <div className="card-body d-flex justify-content-start align-items-start">
                                    <img src={note.imageUrl} className="card-img-top" style={{ maxWidth: '300px', aspectRatio: '1/1', borderRadius: '10px 10px 0 0' }} />
                                    <div className='ms-3'>
                                        <h5 className="card-title mt-0 gorditas">{note.name}</h5>
                                        <p className="card-text" style={{ textAlign: 'start' }}>{note.contactDetails}</p>
                                        <Link target='_blank' className="btn btn-primary border-primary" to={note.link}>View Profile &nbsp;<FaArrowRightLong /> </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KeyNoteSpeakers;
