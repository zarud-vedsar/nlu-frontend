import React from 'react'
import { FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import drsonika from "../../site-components/website/assets/cells/dr-sonika.jpg";
import drsuhit from "../../site-components/website/assets/cells/dr-suchit.jpg";
import drdeepaksharma from "../../site-components/website/assets/cells/dr-deepak-sharma.jpg";
import CellForm from './CellForm';
function EqualOpportunityCell() {
    return (
        <>
            <div className="breadcrumb-banner-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-text">
                                <h1 className="text-center">Equal Opportunity Cell</h1>
                                <div className="breadcrumb-bar">
                                    <ul className="breadcrumb text-center">
                                        <li>
                                            <Link to="/">Home</Link> <FaAngleRight />
                                        </li>
                                        <li>Cells</li> <FaAngleRight />
                                        <li>Equal Opportunity Cell</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className='section py-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 text-center'>
                            <h1 className='heading-primary'>Equal Opportunity Cell</h1>
                        </div>
                        <div className='col-md-12'>
                            <div className='card border-0'>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <p className='text-justify'>
                                                Dr. Rajendra Prasad National Law University, Prayagraj (RPNLU) is committed to fostering an
                                                inclusive and equitable academic environment.
                                                In consideration of the UGC (Promotion of Equity in Higher Educational Institutions),
                                                Regulations, 2012 (notified vide GOI Notification dated 17th December, 2012),
                                                Honourable Vice Chancellor has constituted the <strong>Equal Opportunity Cell (EOC)</strong>. To address concerns related to marginalization and exclusion, The EOC aims to ensure that students, faculty, and staff from diverse backgrounds, including those marginalized based on caste, creed, religion, language, ethnicity, sexual orientation, gender, and disability, receive the necessary support and protection against discrimination.
                                            </p>
                                            <p>The advisory committee of RPNLU, Prayagraj comprises the following member(s):</p>
                                        </div>
                                        <div className='col-md-3'>
                                            <div className="faculty-slide border-0">
                                                <div className="facslider shadow-none border-0 p-0">
                                                    <div>
                                                        <div className="facimg-bx border-0">
                                                            <img
                                                                src={drsonika}
                                                                alt="Dr. Sonika"
                                                                className="facimg"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="facpost">
                                                        <h3 className="sldnn mb-1 mt-2">Dr. Sonika</h3>
                                                        <p className="facdesti">Convener</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3'>
                                            <div className="faculty-slide border-0">
                                                <div className="facslider shadow-none border-0 p-0">
                                                    <div>
                                                        <div className="facimg-bx border-0">
                                                            <img
                                                                src={drsuhit}
                                                                alt="Dr. Sonika"
                                                                className="facimg"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="facpost">
                                                        <h3 className="sldnn mb-1 mt-2">Dr. Suchit Kumar Yadav</h3>
                                                        <p className="facdesti">Member</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3'>
                                            <div className="faculty-slide border-0">
                                                <div className="facslider shadow-none border-0 p-0">
                                                    <div>
                                                        <div className="facimg-bx border-0">
                                                            <img
                                                                src={drdeepaksharma}
                                                                alt="Dr. Sonika"
                                                                className="facimg"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="facpost">
                                                        <h3 className="sldnn mb-1 mt-2">Dr. Deepak Sharma</h3>
                                                        <p className="facdesti">Member</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <h2 className='heading-primary2'>Mandate:</h2>
                                            <style jsx>
                                                {` ul.custom-list {
                                                    list - style: none; /* Removes default bullets */
                                                padding: 0;
  }

                                                ul.custom-list li {
                                                background: #F5F5F5; /* Light gray background */
                                                margin: 10px 0;
                                                padding: 8px 12px;
                                                border-radius: 5px; /* Rounded corners */
                                                font-size: 0.9em;
                                                line-height: 1.6;
                                                color: #000;
  }

                                                ul.custom-list li::before {
                                                    content: "✔"; /* Custom checkmark icon */
                                                color: #7A0F45;
                                                font-weight: bold;
                                                margin-right: 10px;
  }`}
                                            </style>

                                            <ul className="custom-list">
                                                <li>The EOC at RPNLU proactively works on formulating anti-discrimination policies, establishing grievance redressal mechanisms, and conducting sensitization programs to promote awareness and inclusivity within the university community.</li>
                                                <li>The University emphasizes fostering equality among students, faculty, and staff from all backgrounds.</li>
                                                <li>It aims to prevent and address any form of discrimination or harassment by strictly prohibiting such actions, implementing preventive and protective measures, and recommending appropriate disciplinary actions against offenders.</li>
                                                <li>It ensures the protection of the rights and interests of all members of the University community, irrespective of caste, creed, religion, language, ethnicity, gender, sexual orientation, or physical and mental ability.</li>
                                                <li>The University conducts compulsory orientation and sensitization programs for students, integrating these sessions into the orientation programs for newly admitted students each academic year.</li>
                                                <li>At the beginning of every academic year, the EOC shall organize orientation programs for faculty and staff to promote awareness and inclusivity.</li>
                                            </ul>
                                        </div>
                                        <div className='col-md-6'>
                                            <style jsx>
                                                {` .procedure-container {
                                                    font - family: Arial, sans-serif;
                                                margin: 20px auto;
                                                padding: 20px;
                                                background: #F5F5F5;
                                                border-radius: 5px;
  }

                                                .procedure-container h2 {
                                                    color: #7A0F45;
                                                border-bottom: 2px solid #7A0F45;
                                                padding-bottom: 5px;
                                                font-size: 1.4em;
  }
.procedure-container h3 {
                                                    color: #111;
                                                    margin-top: 10px;
                                                padding-bottom: 5px;
                                                font-size: 1.2em;
  }
                                                .procedure-container ul {
                                                    list - style: none;
                                                padding: 0;
  }

                                                .procedure-container li {
                                                    background: #ffffff;
                                                margin: 10px 0;
                                                padding: 8px 12px;
                                                border-radius: 5px;
                                                font-size: 0.9em;
                                                line-height: 1.6;
                                                position: relative;
                                                padding-left: 30px;
  }

                                                .procedure-container li::before {
                                                    content: "✔";
                                                color: #7A0F45;
                                                font-weight: bold;
                                                position: absolute;
                                                left: 10px;
  }`}
                                            </style>

                                            <div className="procedure-container">
                                                <h2>Procedure for Filing and Addressing Complaints</h2>

                                                <h3>Filing a Complaint:</h3>
                                                <ul>
                                                    <li>Any student or staff member of RPNLU, Prayagraj may report a complaint by filling the form given below or by emailing to <a href="mailto:sonika@rpnlup.ac.in">sonika@rpnlup.ac.in</a>.</li>
                                                </ul>

                                                <h3>Preliminary Inquiry:</h3>
                                                <ul>
                                                    <li>Upon receiving a complaint, the Equal Opportunity Cell (EOC) will conduct an initial inquiry.</li>
                                                    <li>Within 10 days, the EOC will determine the necessary follow-up actions, ensuring due process is followed.</li>
                                                    <li>The nature of the complaint and the parties involved will be considered before recommending further steps.</li>
                                                </ul>

                                                <h3>Possible Courses of Action:</h3>
                                                <ul>
                                                    <li>Counselling, Mediation, or Negotiation for an amicable resolution.</li>
                                                    <li>For complaints involving students, referral to the appropriate committee/authority under RPNLU, Prayagraj existing regulations.</li>
                                                    <li>For complaints involving faculty or staff, the Registrar will be requested to appoint a third member to the EOC, forming an Inquiry Committee. This committee will have the authority to enforce discipline and take appropriate disciplinary measures.</li>
                                                </ul>

                                                <h3>Appeal Process:</h3>
                                                <ul>
                                                    <li>In cases concerning faculty or staff, any person dissatisfied with the EOC’s recommendations may appeal to the Vice-Chancellor within 10 days from the date of the recommendation.</li>
                                                </ul>

                                                <h3>Timelines for Resolution:</h3>
                                                <ul>
                                                    <li>The entire process, from complaint submission to resolution, shall be completed within 60 days.</li>
                                                </ul>

                                                <h3>Annual Reporting:</h3>
                                                <ul>
                                                    <li>At the end of each academic year, the EOC will submit an Action Taken Report to the University administration.</li>
                                                    <li>This report will include the number of complaints received, actions taken, and policy recommendations for the upcoming academic year.</li>
                                                </ul>
                                            </div>

                                        </div>
                                        <div className='col-md-6 mt-3 bg-f5 py-3 px-4'>
                                            <h3 style={{ fontSize: '1.4em' }} className='heading-primary2 text-primary'>For grievance redressal or any concerns regarding discrimination, students, faculty, and staff can file complaint here-</h3>
                                            <CellForm type="equal-opportunity-cell" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default EqualOpportunityCell