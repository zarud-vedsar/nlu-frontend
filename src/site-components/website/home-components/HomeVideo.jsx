import React, { useEffect, useState } from 'react';
import { IoMdPlay } from "react-icons/io";
import { NODE_API_URL } from '../../Helper/Constant';
import axios from 'axios';
import videoBg from "../assets/Images/video-background.jpg";
import validator from "validator";
function HomeVideo() {
    const [isOpen, setIsOpen] = useState(false); // State for modal visibility
    const [homeVideo, setHomeVideo] = useState([]);

    // Function to toggle modal visibility
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.post(`${NODE_API_URL}/api/website-home-video/fetch`);
                if (response?.data.statusCode === 200 && response.data.data.length > 0) {
                    setHomeVideo(response.data.data[0]);
                } else {
                    setHomeVideo([]);
                }
            } catch (error) { /* empty */ }
        }
        fetchVideo();
    }, []);
    return (
        <section
            className='section'
            style={{
                position: 'relative',
                backgroundImage: `url(${videoBg})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                transition: 'background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s',
                padding: '230px 0px 200px 0px',
                display: 'grid',
                placeContent: 'center'
            }}
        >
            <div className='home-video-section'>
                <button
                    className='home-video-btn'
                    onClick={toggleModal}
                    style={{
                        width: '88px',
                        height: '88px',
                        borderRadius: '50%',
                        position: 'relative',
                        zIndex: 1,
                        border: 'none',
                        display: 'grid',
                        placeContent: 'center',
                        background: '#fff',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
                        color: '#89064B',
                        fontSize: '30px',
                        cursor: 'pointer',
                        animation: 'pulse 1.5s infinite'
                    }}
                >
                    <IoMdPlay />
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                </button>
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}
                >
                    <div
                        className="modal-content"
                        style={{
                            position: 'relative',
                            width: '80%',
                            height: '80%',
                            backgroundColor: '#000',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            src={homeVideo.link ? validator.unescape(homeVideo.link) : ''}
                            title="YouTube Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <button
                            onClick={toggleModal}
                            className='butler-regular'
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '0px',
                                background: '#fff',
                                color: '#89064B',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                fontSize: '22px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default HomeVideo;
