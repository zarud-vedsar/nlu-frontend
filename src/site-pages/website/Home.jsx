import React from "react";
import Banner from "../../site-components/website/home-components/Banner";
import About from "../../site-components/website/home-components/About";
import Courses from "../../site-components/website/home-components/Courses";
import NoticeEventPublication from "../../site-components/website/home-components/NoticeEventPublication";
import CampusLife from "../../site-components/website/home-components/CampusLife";
import Message from "../../site-components/website/home-components/Message";
import UseFullLinks from "../../site-components/website/home-components/UseFullLinks";
import SocialMedia from "../../site-components/website/home-components/SocialMedia";
import KeyNote from "../../site-components/website/home-components/KeyNote";
import WhyChoose from "../../site-components/website/home-components/WhyChoose";
import ContactFeatures from "../../site-components/website/home-components/ContactFeatures";
import MarqueeSlider from "../../site-components/website/home-components/MarqueeSlider";
import Speciality from "./Speciality"
import FacultySlider from "./FacultySlider"
import Gallery from "../../site-components/website/home-components/Gallery";
import HomeVideo from "../../site-components/website/home-components/HomeVideo";
import Achivement from "../../site-components/website/home-components/Achivement";
import ContactIcon from "../../site-components/website/home-components/ContactIcon";
import PopupNotice from "../../site-components/website/home-components/PopupNotice";
import Facilities from "../../site-components/website/home-components/Facilities";
import UserTestimonials from "./UserTestimoinals";

function Home() {
  return (
    <>
      <PopupNotice />
      <Banner />
      <MarqueeSlider />
      <About />
      <Message />
      <NoticeEventPublication />
      <Courses />
      <HomeVideo />
      <WhyChoose />
      <FacultySlider />
      <CampusLife />
      <Speciality />
      <ContactFeatures />
      <KeyNote />
      <Achivement />
      <Facilities />
      <Gallery />
      <SocialMedia />
      <ContactIcon />
      <UserTestimonials/>
      <UseFullLinks />

    </>
  );
}
export default Home;