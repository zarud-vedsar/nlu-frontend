import React, { useEffect, useState } from 'react'
import { RiFontSize } from "react-icons/ri";
import './SideChipkaHuaCss.css';
import { IoShareSocialOutline } from "react-icons/io5";
import { IoLanguage } from "react-icons/io5";
import InstaIcon from '../assets/Images/instagram.png';
import YouTubePng from '../assets/Images/youtube.png';
import TwitterPng from '../assets/Images/twitter.png';
import FacebookPng from '../assets/Images/facebook.png';
import { Link } from 'react-router-dom';
import { PHP_API_URL } from '../../Helper/Constant';
import axios from 'axios';
function SideChipkaHuaTag() {
    const [fontSize, setFontSize] = useState(16); // Default font size
    const [toggleSize, setToggleSize] = useState(false);
    const [toggleSocial, setToggleSocial] = useState(false);
    const [toggleLanguage, setToggleLanguage] = useState(false);
    const [iconLink, setIconLink] = useState([]);
    // Helper function to update all elements' font size
    const updateFontSize = (newFontSize) => {
        const allElements = document.querySelectorAll("*"); // Select all elements
        allElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el); // Get computed styles
            const currentSize = parseFloat(computedStyle.fontSize); // Get current font size
            el.style.fontSize = `${currentSize + newFontSize}px`; // Update font size
        });
    };

    // Function to increase font size
    const increaseFontSize = () => {
        updateFontSize(2); // Increment font size by 2px
        setFontSize(fontSize + 2);
    };

    // Function to reset font size
    const resetFontSize = () => {
        updateFontSize(-fontSize + 16); // Reset to default size (16px)
        setFontSize(16);
    };

    // Function to decrease font size
    const decreaseFontSize = () => {
        updateFontSize(-2); // Decrement font size by 2px
        setFontSize(fontSize - 2);
    };
    async function getSocialMediaLink() {
        try {
            const bformData = new FormData();
            bformData.append("data", "get_socialmedia_sett");
            const response = await axios.post(
                `${PHP_API_URL}/sitesetting.php`,
                bformData);
            setIconLink(response.data.data[0]);
            // console.log(response.data.data[0]);
        } catch (error) { /* empty */ }
    }
    useEffect(() => {
        getSocialMediaLink()
    }, []);
    return (
        <>
            <div className="side-chipka-hua-tag" style={{ background: '#B81365' }}>
                <div className='fontsize'>
                    <div onClick={() => setToggleSize(!toggleSize)} className='text-white heading-primary3'><RiFontSize /></div>
                    <div className={`itemfont ${toggleSize ? '' : 'd-none'}`}>
                        <div className="inc" onClick={increaseFontSize}>
                            A+
                        </div>
                        <div className="org" onClick={resetFontSize}>
                            A
                        </div>
                        <div className="dec" onClick={decreaseFontSize}>
                            A-
                        </div>
                    </div>
                </div>
                <div className='socialiconsize'>
                    <div onClick={() => setToggleSocial(!toggleSocial)} className='text-white heading-primary3'><IoShareSocialOutline /></div>
                    <div className={`itemSocial ${toggleSocial ? '' : 'd-none'}`}>
                        <Link to={iconLink?.facebook} target="_blank"><img src={FacebookPng} alt="" style={{ height: "25px" }} /></Link>
                        <Link to={iconLink?.twitter} target="_blank"><img src={TwitterPng} alt="" style={{ height: "25px" }} /></Link>
                        <Link to={iconLink?.instagram} target="_blank"><img src={InstaIcon} alt="" style={{ height: "25px" }} /></Link>
                        <Link to={iconLink?.youtube} target="_blank"><img src={YouTubePng} alt="" style={{ height: "25px" }} /></Link>
                    </div>
                </div>
                <div className='socialiconsize'>
                    <div onClick={() => setToggleLanguage(!toggleLanguage)} className='text-white heading-primary3'><IoLanguage /></div>
                    <div className={`itemSocial ${toggleLanguage ? '' : 'd-none'}`}>

                    </div>
                </div>
            </div>
        </>
    )
}

export default SideChipkaHuaTag