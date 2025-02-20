import React, { useState, useEffect } from 'react';
import rpnl_logo from '../assets/Images/rpnlu.png';
import './header.css';
import { Link, useLocation } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { PHP_API_URL } from '../../Helper/Constant';
import axios from 'axios';
function Header() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
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
    if(!isMobile) return;
    setMenuVisible(()=>!menuVisible);
  };



  useEffect(() => {
    setMenuVisible(false);
  }, [location.pathname]);

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
                  <h2 className="header-heading2">
                    {/* डॉ राजेन्द्र प्रसाद */}
                    Dr. Rajendra Prasad
                  </h2>
                  <h3 className="header-heading3">
                    {/* राष्ट्रीय विधि विश्वविद्यालय प्रयागराज */}
                    National Law University
                  </h3>
                  <h4 className='hd4'>Prayagraj </h4>
                </Link>
              </div>
            </div>
            <header className="page-mine-header">
              <div className="logosec">
                <div className='mmllg'>
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
                      <h2 className="header-heading2">
                        डॉ राजेन्द्र प्रसाद
                        {/* Dr. Rajendra Prasad */}
                      </h2>
                      <h3 className="header-heading3">
                        राष्ट्रीय विधि विश्वविद्यालय
                        {/* National Law University  */}
                      </h3>
                      <h4 className='hd4'>
                        {/* Prayagraj  */}
                        प्रयागराज
                      </h4>
                    </Link>
                  </div>
                </div>
                <div
                  className="hamb mini"
                  onClick={toggleMenu}
                >
                  <RxHamburgerMenu />
                </div>
              </div>

              <nav
                className={`page-mine-header__bottom`} style={{padding:`${isMobile?"15px 0px 0px 120px":"0px"}`}}>
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
                        <Link to={`/message/${post.id}`} key={`${index}-message`} className="navigation__item_drop_link ">{post.msg_from}</Link>
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
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">Media </Link>
                    <div className="navigation__item_dropdown-content">
                      <Link to="/image-gallery" className="navigation__item_drop_link">Photo Gallery</Link>
                      <Link to="/video-gallery" className="navigation__item_drop_link">Video Gallery</Link>
                    </div>
                  </li>
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">Student Corner</Link>
                    <div className="navigation__item_dropdown-content">
                      <Link to="/student" target='_blank' className="navigation__item_drop_link">Registration</Link>
                      <Link to="/student/internship" target='_blank' className="navigation__item_drop_link">Internship</Link>
                      <Link to="/student/joblist" target='_blank' className="navigation__item_drop_link">Placement</Link>
                      <Link to="/scholarship" target='_blank' className="navigation__item_drop_link">Scholarship</Link>
                    </div>
                  </li>
                  <li className="navigation__item"><Link to={'/student/book-issued'} target='_blank' className='navigation__item_link'>Library</Link></li>
                  <li className="navigation__item arr-li">
                    <Link className="navigation__item_link arr-true">Cells</Link>
                    <div className="navigation__item_dropdown-content">
                      <Link to="/equal-opportunity-cell" className="navigation__item_drop_link">Equal Opportunity Cell</Link>
                    </div>
                  </li>
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
