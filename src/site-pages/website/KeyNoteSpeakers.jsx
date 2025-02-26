import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleRight } from "react-icons/fa";
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
import P11 from '../../site-components/website/assets/Images/keynote/P11.jpg';
import P12 from '../../site-components/website/assets/Images/keynote/P12.jpg';
import P13 from '../../site-components/website/assets/Images/keynote/P13.jpg';
import P14 from '../../site-components/website/assets/Images/keynote/P14.jpg';
import { FaArrowRightLong } from 'react-icons/fa6';

function KeyNoteSpeakers() {
    // Define an array of keynote data
    const keyNotes = [
        {
            id: 2,
            name: 'Professor Klaus Bosselmann',
            imageUrl: P1,
            contactDetails: 'Faculty of Law, University of Auckland, New Zealand',
            link: 'https://profiles.auckland.ac.nz/k-bosselmann'
        },
        {
            id: 3,
            name: 'Professor Philippe Cullet',
            imageUrl: P2,
            contactDetails: 'SOAS, University of London, England',
            link: 'https://www.soas.ac.uk/about/philippe-cullet'
        },
        {
            id: 4,
            name: 'Dr. Ivano Alogna',
            imageUrl: P3,
            contactDetails: 'Senior Research Fellow in Environmental and Climate Change Law, BIICL, France',
            link: 'https://www.biicl.org/people/ivano-alogna'
        },
        {
            id: 5,
            name: 'Dr. Robert Russo',
            imageUrl: P4,
            contactDetails: 'Peter Allard School of Law, University of British Columbia, Vancouver, Canada',
            link: 'https://allard.ubc.ca/about-us/our-people/robert-russo'
        },
        {
            id: 6,
            name: 'Professor Leela Krishnan',
            imageUrl: P5,
            contactDetails: 'School of Legal Studies, Cochin University of Science and Technology',
            link: 'https://spaceshineone.co.in/page/6/Prof.-P.-Leelakrishnan'
        },
        {
            id: 7,
            name: 'Justice Rinzin Penjor',
            imageUrl: P6,
            contactDetails: 'Judge, Supreme Court of Bhutan; Vice Chairman, Bar Council of Bhutan',
            link: '#'
        },
        {
            id: 8,
            name: 'Professor K. Konasinghe',
            imageUrl: P7,
            contactDetails: 'Faculty of Law, University of Colombo, Sri Lanka',
            link: 'https://www.res.cmb.ac.lk/public.international.law/kokila/'
        },
        {
            id: 9,
            name: 'Professor Amber Pant',
            imageUrl: P8,
            contactDetails: 'University of Tribhuvan, Nepal',
            link: 'https://www.iucnael.org/en/81-about-us/members-of-the-governing-board/501-professor-amber-prasad-pant'
        },
        {
            id: 10,
            name: 'Michael D. Wilson',
            imageUrl: P9,
            contactDetails: 'Justice, Hawaii Supreme Court, USA',
            link: 'https://en.wikipedia.org/wiki/Michael_D._Wilson'
        },
        {
            id: 11,
            name: 'Professor Moon-Hyun Koh',
            imageUrl: P10,
            contactDetails: 'Professor, College of Law, Soongsil University, Seoul, Korea',
            link: 'https://law.ssu.ac.kr/web/sub1/sub1_prof_detail02.do'
        },
        {
            id: 14,
            name: 'Professor Jonathan O. Chimakonam',
            imageUrl: P13,
            contactDetails: 'Professor of Philosophy, University of Pretoria, South Africa',
            link: 'https://spaceshineone.co.in/page/3/Jonathan-Profile'
        },
        {
            id: 12,
            name: 'Prof Zozo Dyani-Mhango',
            imageUrl: P11,
            contactDetails: 'Chair, Internationalisation Centre for Environmental Justice in Africa University of Pretoria, South Africa',
            link: 'https://www.up.ac.za/public-law/article/3001415/prof-ntombizozuko-zozo-dyani-mhango'
        },
        {
            id: 13,
            name: 'Professor Mrs. Erimma G. Orie',
            imageUrl: P12,
            contactDetails: 'Professor National Open University of Nigeria',
            link: 'https://www.spaceshineone.co.in/page/4/DrErimmaGOrie'
        },
        {
            id: 1,
            name: 'Professor Dr. Usha Tandon',
            imageUrl: P14,
            contactDetails: 'Senior Professor, and Vice-Chancellor Dr. Rajendra Prasad National Law University Prayagraj',
            link: '/faculty/1'
        },
    ];
    return (
        <div className="section-padding py-4 mt-2 kn-position-realative" style={{ background: '#F2F2F2' }}>
            <div className="container">
                <div className="row">
                    <div className='col-md-12 mb-3 text-center'>
                        <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Keynote Speakers</h2>
                        <div className='heading-divider'></div>
                        <p className="text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view">
                            International Conference on "Law, Technology and Sustainable Development"
                        </p>
                    </div>
                </div>
                <div className="row mt-2">
                    {keyNotes.map((note) => (
                        <div className="col-md-4 mb-3 col-lg-4 col-12 col-sm-12" key={note.id}>
                            <div className="card border-0 soft-shadow" style={{ width: '90%', borderRadius: '10px', margin: '0 auto', minHeight: '160px' }}>
                                <div className="card-body d-flex justify-content-start align-items-start">
                                    <img src={note.imageUrl} className="card-img-top" style={{ maxWidth: '300px', aspectRatio: '1/1', borderRadius: '5px' }} />
                                    <div className='ms-3'>
                                        <h5 className="card-title mt-0 source-font" style={{ fontSize: '18px' }}>{note.name}</h5>
                                        <p className="card-text source-font" style={{ textAlign: 'start' }}>{note.contactDetails}</p>
                                        <Link target='_blank' className="btn btn-primary border-primary source-font" to={note.link}>View Profile &nbsp;<FaArrowRightLong /> </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                     <div className="col-lg-4 d-flex align-items-center">
                        <div className='d-flex justify-content-around' style={{ width: '90%', }}>
                            <Link to={'/marquee/5'} className='id-note-khow-more-btn'>
                            <span style={{marginRight:"15px"}}>Know More</span> <FaArrowCircleRight />
                            </Link>
                            </div>
                            </div>
                </div>
            </div>
        </div>
    );
};

export default KeyNoteSpeakers;
