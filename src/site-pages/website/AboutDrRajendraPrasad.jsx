import React from 'react';
import { FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import drranjendra from "../../site-components/website/assets/Images/dr-rajendra.png";
function AboutDrRajendraPrasad() {
    return (
        <>
            <div className="breadcrumb-banner-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-text">
                                <h1 className="heading-primary2 butler-regular text-white text-center">About Dr. Rajendra Prasad</h1>
                                <div className="breadcrumb-bar">
                                    <ul className="breadcrumb text-center">
                                        <li><Link to="/">Home</Link></li> <FaAngleRight />
                                          <li>About</li><FaAngleRight />
                                        <li>About Dr. Rajendra Prasad</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className='section'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-4 col-lg-4 col-12 col-sm-12'>
                            <img src={drranjendra} className='img-fluid rounded-3' />
                        </div>
                        <div className='col-md-8 col-lg-8 col-12 col-sm-12'>
                            <h2 className='heading-primary2 butler-bold mt-3 text-primary'>Dr. Rajendra Prasad</h2>
                            <p className='heading-para gorditas-regular'>Dr. Rajendra Prasad (1884–1963) affectionately addressed as ‘Rajen Babu’, was the First President of independent India from 1950 to 1962, navigating the nation through its formative years. Dr. Rajendra Prasad was a renowned freedom fighter, an eminent jurist, an eloquent Parliamentarian, an able administrator, a statesman par excellence, and above all, a humanitarian to the core. Dr. Prasad’s legacy endures through his multifaceted contributions, reflecting the values of integrity, statesmanship, and a commitment to social welfare that continue to inspire generations in the journey of a vibrant, democratic India.</p>
                            <p className='heading-para gorditas-regular'>Dr. Rajendra Prasad, a doctorate from Allahabad University, initially practiced law at different High Courts. Mahatma Gandhi enlisted his support in 1917 for a campaign aimed at improving the plight of peasants exploited by British indigo planters in Bihar. In 1920, Dr. Prasad abandoned his legal career to join the non-cooperation movement.</p>
                            <p className='heading-para gorditas-regular'>Transitioning into journalism, he actively wrote for the nationalist cause, contributing to English publications like ‘Searchlight’ and founding and editing the Hindi weekly Desh (“Country”). Dr. Prasad faced multiple incarcerations by the British authorities due to his non-cooperation activities, with a significant period spent in jail from August 1942 to June 1945. He played a pivotal role in shaping the Indian Constitution as President of Constitution Committee and was one of the chief architects of Modern India.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutDrRajendraPrasad