import React, { useEffect } from "react";
import AOS from "aos";
import { FaSquareXTwitter } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import facebook from "../assets/Images/facebook.png";
import instagram from "../assets/Images/instagram.png";
import youtube from "../assets/Images/youtube.png";

const SocialMedia = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);
  useEffect(() => {
    // Load Instagram's embed script dynamically
    const script = document.createElement('script');
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <section className="section" data-aos="fade-up" data-aos-delay="100">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2 className="heading-primary2 butler-regular">Our Social Media</h2>
              <div className="heading-divider"></div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-5 px-4">
              <div className="social-icon fb">
                <img src={facebook} alt="Facebook" style={{height:"30px"}}/>
                Facebook
              </div>
              <div className="social-media-col">
                <div className="social-details">
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Frpnlup&tabs=timeline
                    &width=425&height=480&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="facebook-page-plugin"
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-5 px-4">
              <div className="social-icon insta">
                <img src={instagram} alt="Instagram" />
                Instagram
              </div>
              <div className="social-media-col">

                <div className="social-details">
                  <div style={{ width: '100%', height: '100%', display: "flex", justifyContent: "center" }}>
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink="https://www.instagram.com/p/C7hFHZdpq77/"
                      data-instgrm-version="12">
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-12 col-sm-12 mb-5 px-4">
              <div className="social-icon you">
                <img src={youtube} alt="Youtube" />
                Youtube
              </div>
              <div className="social-media-col">

                <div className="social-details">
                  <iframe
                    src="https://www.youtube.com/embed?listType=playlist&list=UU0_JcSILgM0Jt2e4bADOycA"
                    width="560"
                    height="315"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowfullscreen
                  ></iframe>


                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default SocialMedia;
