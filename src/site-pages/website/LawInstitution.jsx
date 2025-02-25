import React from 'react'
import { FaRightLong } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

function LawInstitution() {
    return (
        <>
            <section className="section">
                <div className="container">
                    <div className="row">
                        <div className='col-md-12 mx-auto mb-3'>
                            <h2 className="heading-primary2 text-start source-font id-title-font-size id-title-font-size-mobile-device">The Law Institution Dedicated to Legal Excellence...</h2>
                            <div className='heading-divider'></div>
                            <p className="source-font text-justify mt-3">Uttar Pradesh National Law University, Prayagraj, established in 2020 by Uttar Pradesh National Law University Act, 2020 (U.P. Act no 26 of 2020) and renamed as Dr Rajendra Prasad National Law University by the amendment in August 2023 (U.P. Act no. 11 of 2023), is the newest law institution dedicated to legal excellence that meets an unparalleled environment for aspiring lawyers, judges, academia and other professionals.</p>
                            <p className="source-font text-justify">Nested in the Prayagraj, a city which has been known for her academic legacy and where knowledge, aspiration and justice confluence like the three rivers, NLU, Prayagraj offers extraordinary opportunities for students to embark on a transformative journey into the world of law. It is dedicated to nurturing the legal minds of tomorrow through inter-disciplinary and innovative curriculum designed to provide comprehensive understanding of the law and its implications in contemporary society.</p>
                            <Link
                                to="/legal-excellence"
                                target="_blank"
                                style={{ minWidth: '230px' }}
                                className="btn btn-primary border-0 px-4 py-2 source-font"
                            >
                                Read More <FaRightLong />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LawInstitution