import React from 'react'
import { FaAngleRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function LegalExcellence() {
    return (
        <>
            <div className="breadcrumb-banner-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-text">
                                <h1 className="heading-primary2 butler-regular text-white text-center"></h1>
                                <div className="breadcrumb-bar">
                                    <ul className="breadcrumb text-center">
                                        <li><Link to="/">Home</Link></li> <FaAngleRight />
                                        <li>The law institution dedicated to legal excellence...</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="section">
                <div className="container">
                    <div className="row">
                        <div className='col-md-10 mx-auto mb-3'>
                            <h2 className="heading-primary2 text-start source-font id-title-font-size  id-title-font-size-mobile-device">The law institution dedicated to legal excellence...</h2>
                            <div className='heading-divider'></div>
                            <p className="source-font text-justify mt-3">Uttar Pradesh National Law University, Prayagraj, established in 2020 by Uttar Pradesh National Law University Act, 2020 (U.P. Act no 26 of 2020) and renamed as Dr. Rajendra Prasad National Law University by the amendment in August 2023 (U.P. Act no. 11 of 2023), is a law institution dedicated to legal excellence that meets an unparalleled environment for aspiring lawyers, judges, academia and other professionals.</p>
                            <p className="source-font text-justify">Nested in the Prayagraj, a city which has been known for her academic legacy and where knowledge, aspiration and justice confluence like the three rivers, NLU, Prayagraj offers extraordinary opportunities for students to embark on a transformative journey into the world of law. It is dedicated to nurturing the legal minds of tomorrow through inter-disciplinary and innovative curriculum designed to provide comprehensive understanding of the law and its implications in contemporary society.</p>
                            <p className="source-font text-justify">The University aims to have students from diverse backgrounds, each bringing unique perspectives and experiences in classrooms. This diversity fosters an environment of intellectual vitality, encouraging lively debates and discussions both inside and outside the classroom. It aspires to culminate in a conducive environment where Professors, students, and industry share a strong sense of camaraderie, creating lasting connections that extend beyond graduation. Its commitment to mentorship and professional development ensures that every student is well-prepared for the legal profession and is a useful member of the society.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LegalExcellence