import React, { useState, useEffect } from 'react';
import rpnl_logo from '../assets/Images/rpnlu.png';
import './header.css';
import { Link } from 'react-router-dom';
import { FaAngleDown } from 'react-icons/fa';
import { RxHamburgerMenu } from "react-icons/rx";
import { PHP_API_URL } from '../../Helper/Constant';
import axios from 'axios';
function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [message, setMessages] = useState([]);
  const [courseName, setCourseNames] = useState([]);
  const load_postname = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_message_names");
      const response = await axios.post(
        `${PHP_API_URL}/message.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessages(response.data.data);
    } catch (error) { /* empty */ }
  };
  const load_course_name = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_course_name");
      const response = await axios.post(
        `${PHP_API_URL}/page.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCourseNames(response.data.data);
    } catch (error) { /* empty */ }
  };

  // Sticky Menu Area
  useEffect(() => {
    load_postname();
    load_course_name();
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  /* Method that will fix header after a specific scrollable */
  const isSticky = () => {
    const header = document.querySelector(".page-mine-header");
    const scrollTop = window.scrollY;
    scrollTop >= 50
      ? header.classList.add("is-sticky")
      : header.classList.remove("is-sticky");
  };

  /* Toggle Menu Visibility */
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <div className="header-section">
        <div className="headermain">
          <div className="headermain-content  id-english">
            <div className="logosec">
              <div className="page-header-logo" >
                <Link to='/'>
                  <img
                    className="page-header-logo-img sm-mt-2"
                    src={rpnl_logo}
                    alt="RPNL Logo"
                  />
                </Link>
              </div>
              <div className="logotext">
                <Link to='/'>
                  <h2 className="header-heading2 mb-1">
                    {/* डॉ राजेन्द्र प्रसाद */}
                    Dr. Rajendra Prasad
                  </h2>
                  <h3 className="header-heading3">
                    {/* राष्ट्रीय विधि विश्वविद्यालय प्रयागराज */}
                    National Law University Prayagraj
                  </h3>
                </Link>
              </div>
            </div>
            <header className="page-mine-header">
              <nav
                className={`page-mine-header__bottom`}>
                <ul className={`${menuVisible ? 'navigation--visible' : 'navigation'}`}>
                  <li className="navigation__item"><Link to={'/'} className='navigation__item_link'>Home</Link></li>
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">About </Link>
                    <div className="navigation__item_dropdown-content">
                      <Link to="/about" className="navigation__item_drop_link">Introduction</Link>
                      <Link to="/dr-rajendra-prasad" className="navigation__item_drop_link">About Dr. Rajendra Prasad</Link>
                      <Link to="/emblem-motto" className="navigation__item_drop_link">Emblem and Motto</Link>
                      <Link to="/vision-mission" className="navigation__item_drop_link">Vision &amp; Mission</Link>
                      <Link to="/page/1/acts" className="navigation__item_drop_link">Acts</Link>
                    </div>
                  </li>
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">Governance </Link>
                    <div className="navigation__item_dropdown-content">
                      {message && message.map((post, index) => (
                        <Link to={`/message/${post.id}`} key={`${index}-message`} className="navigation__item_drop_link">{post.msg_from}</Link>
                      ))}
                    </div>
                  </li>
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">Courses </Link>
                    <div className="navigation__item_dropdown-content">
                      {courseName && courseName.map((course_data, index) => (
                        <Link to={`/courses/${course_data.id}`} key={`${index}-course`} className="navigation__item_drop_link">{course_data.coursename}</Link>
                      ))}
                    </div>
                  </li>
                  <li className="navigation__item"><Link to={'/career'} className='navigation__item_link'>Career</Link></li>
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">Media </Link>
                    <div className="navigation__item_dropdown-content">
                      <Link to="/image-gallery" className="navigation__item_drop_link">Photo Gallery</Link>
                      <Link to="/video-gallery" className="navigation__item_drop_link">Video Gallery</Link>
                    </div>
                  </li>
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">Student Corner </Link>
                    <div className="navigation__item_dropdown-content">
                      <Link to="/student" className="navigation__item_drop_link">Registration</Link>
                      <Link to="/internship" className="navigation__item_drop_link">Internship</Link>
                      <Link to="/placement" className="navigation__item_drop_link">Placement</Link>
                      <Link to="/scholarship" className="navigation__item_drop_link">Scholarship</Link>
                    </div>
                  </li>
                  <li className="navigation__item"><Link to={'/student/book-issued'} className='navigation__item_link'>Library</Link></li>
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">Contact </Link>
                    <div className="navigation__item_dropdown-content">
                      <Link to="/contact-us" className="navigation__item_drop_link">Contact Us</Link>
                      <Link to="/feedback" className="navigation__item_drop_link">Feedback</Link>
                      <Link to="/grievance" className="navigation__item_drop_link">Grievance</Link>
                    </div>
                  </li>
                </ul>
              </nav>
            </header>
            <div
              className="hamb"
              onClick={toggleMenu}
            >
              <RxHamburgerMenu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
