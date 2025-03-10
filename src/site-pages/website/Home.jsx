import React from "react";
import Banner from "../../site-components/website/home-components/Banner";
import About from "../../site-components/website/home-components/About";
import Courses from "../../site-components/website/home-components/Courses";
import NoticeEventPublication from "../../site-components/website/home-components/NoticeEventPublication";
import CampusLife from "../../site-components/website/home-components/CampusLife";
import Message from "../../site-components/website/home-components/Message";
import UseFullLinks from "../../site-components/website/home-components/UseFullLinks";
import SocialMedia from "../../site-components/website/home-components/SocialMedia";
import WhyChoose from "../../site-components/website/home-components/WhyChoose";
import MarqueeSlider from "../../site-components/website/home-components/MarqueeSlider";
import Speciality from "./Speciality";
import FacultySlider from "./FacultySlider";
import Gallery from "../../site-components/website/home-components/Gallery";
import Achivement from "../../site-components/website/home-components/Achivement";
import ContactIcon from "../../site-components/website/home-components/ContactIcon";
import PopupNotice from "../../site-components/website/home-components/PopupNotice";
import Quotes from "../../site-components/website/home-components/Quotes";
import UserTestimonials from "./UserTestimoinals";
import OurSociety from "./OurSociety";
import KeyNoteSpeakers from "./KeyNoteSpeakers";
import PublicationsNotice from "../../site-components/website/home-components/Publication";
function Home() {
  return (
    <>
      <PopupNotice />
      <Banner />
      <MarqueeSlider />
      <Quotes />
      <KeyNoteSpeakers />
      <About />
      <Message />
      <NoticeEventPublication />
      <Courses />
      <WhyChoose />
      <FacultySlider />
      <CampusLife />
      <Speciality />
      <Achivement />
      <Gallery />
      <PublicationsNotice />
      <SocialMedia />
      <ContactIcon />
      <UserTestimonials />
      <OurSociety />
      <UseFullLinks />
    </>
  );
}
export default Home;