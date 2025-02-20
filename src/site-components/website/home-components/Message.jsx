import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import axios from "axios";
import { PHP_API_URL, NODE_API_URL, FILE_API_URL } from "../../Helper/Constant.jsx";
import ImageProfile from '../assets/Images/profile-img.jpg';
import { capitalizeEachLetter } from "../../Helper/HelperFunction.jsx";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import Authority from "../assets/Images/authority.jpg";

import Slider from 'react-slick';

const Message = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  const [messageData, setMessageData] = useState([]);
  const [decodedMessages, setDecodedMessages] = useState({});
  const sliderRef = useRef(null);

  const getMessage = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_message");
      const response = await axios.post(`${PHP_API_URL}/message.php`, bformData);

      if (response.data && response.data.data && response.data.data.length > 0) {
        const decodedMessages = await Promise.all(response.data.data.map(async (item) => {
          const decodedContent = await decodeHtml(item.message, item.id);
          item.message = decodedContent;
          return item;
        }));
        setMessageData(decodedMessages);
      }
    } catch (error) {
      console.error("Error fetching message data:", error);
    }
  };

  // Decode HTML content from the server and cache the result
  const decodeHtml = async (html, messageId) => {
    try {
      // Check if message is already decoded
      if (decodedMessages[messageId]) {
        return decodedMessages[messageId];
      }

      const response = await axios.post(
        `${PHP_API_URL}/page.php`,
        { data: 'decodeData', html },
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error) {
      console.error("Error decoding HTML:", error);
      return html; // Return original content if decoding fails
    }
  };

  // Fetch the messages on mount
  useEffect(() => {
    getMessage();
  }, []);

  // Function to limit the message to the first 200 words
  const getTruncatedMessage = (message) => {
    const words = message.split(' ');
    if (words.length > 200) {
      return words.slice(0, 200).join(' ') + '...'; // Add ellipsis after 200 words
    }
    return message; // Return the original message if it's less than 200 words
  };

  const sliderSettings = {
    dots: true,
    infinite: true, // Set to true for looping, false if you want to stop at the last message
    speed: 500,
    slidesToShow: 1, // Show only one message at a time
    slidesToScroll: 1, // Scroll by one message at a time
    arrows: true, // Show next/prev arrows
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Time between each slide transition
    vertical: true,  // This setting makes it vertical, change to false for horizontal
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
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
    <>
      <section className="vicemsgsec" data-aos="fade-up" data-aos-delay="100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="vicemsgsec-bx">
                <div className="row">
                  <div className="col-md-4">
                    <div className="image-post">
                      <div className="vicemsgsec-img-sec">
                        <img src={Authority} className="vicemsgsec-img" />
                      </div>
                      <div className="postname text-center">
                        <h6>Sr. Prof. Dr. Usha Tandon</h6>
                        <p className="prsn-designation">Vice Chancellor</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="vicmsg-bx">
                      <h3 className="message-heading mb-3 mt-3">Vice Chancellor Message</h3>
                      <p className="gorditas-regular" style={{ textAlign: 'justify' }}>I extend a warm welcome to the aspiring students at Dr. Rajendra Prasad National Law University, Prayagraj, an institution dedicated to fostering the next generation of legal professionals poised to shape the future of the legal landscape and contribute significantly to societal improvement. Our university aspires to establish a distinguished tradition of academic excellence, an unwavering commitment to the highest ethical standards, and an ardent dedication to the pursuit of justice. Prayagraj, often referred to as the Judicial Capital of the State, stands as a guiding light for legal education, scholarly pursuit, and ethical leadership. With a rich heritage and a resolute commitment to academic brilliance, the city has once earned the fame of 'Oxford of the East' and has produced erudite legal scholars of national and international renown. Dr. Rajendra Prasad National Law University, Prayagraj is steadfast in its mission to revive this illustrious legacy and uphold the zenith of legal education, ensuring the cultivation of astute legal professionals. In navigating the ever-evolving realm of legal discourse, it is paramount that the students equip themselves not only with legal knowledge but also with the skills and wisdom to judiciously apply it. Our objective is to instill in our students a profound sense of justice, empathy, and an unwavering commitment to the principles of the rule of law. We firmly believe that the study of law transcends the mere mastery of statutes and cases; it involves a deep understanding of the profound impact that the law has on individuals, communities, and nations. We are dedicated to updated curriculum and integrated cutting-edge technology to ensure our students receive a world-class legal education. We earnestly encourage our students to engage in critical thinking, participate in rigorous and innovative research, and actively involve themselves in legal clinics and moot court competitions to gain invaluable practical experience. Our university places a strong emphasis on holistic education, extending beyond the confines of textbooks and courtrooms.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="latest-area  bg-white">
        <div className="container">
          <div className="row">
            {messageData.map((data, index) => (
              <div className="col-md-6" key={index}>
                <div className="alum-box">
                  <div className="row" >
                    <div className={`col-sm-7 col-md-7 col-12 ${index % 2 === 0 ? 'order-last text-right' : 'order-first text-start'}`}>
                      <div className='col-md-12 mb-1 d-flex justify-content-start align-items-center'>
                        <h3 className="message-heading">{`${data.msg_from} Message`}</h3>
                      </div>
                      <div className="chirmans-txt-container pt-4 pt-sm-0">
                        <div className="alum-msg">
                          <p className="gorditas-regular" dangerouslySetInnerHTML={{ __html: decodedMessages[data.id] || getTruncatedMessage(data.message) }} style={{ textAlign: "justify" }} />
                        </div>
                        <Link to={`message/${data.id}`} className='btn btn-primary border border-primary d-flex justify-content-center align-items-center w-fit about-read-more'>
                          Read More &nbsp; <FaArrowRightLong />
                        </Link>
                      </div>
                    </div>
                    <div className={`col-sm-5 d-flex justify-content-start align-items-center flex-column col-md-5 col-12 ${index % 2 === 0 ? 'order-first text-right' : 'order-last text-start'}`}>
                      <div className="alum-img-box">
                        <img
                          src={data.image ? `${FILE_API_URL}/our-authorities/${data.image}` : `${ImageProfile}`}
                          className="chirmans-img img-fluid mb-0"
                          alt="Chairman's Image"
                        />
                      </div>
                      <h6 className="messanger-name">{capitalizeEachLetter(data.name)}</h6>
                      <p className="prsn-designation gorditas-regular">{data.msg_from}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </>
  );
};

export default Message;
