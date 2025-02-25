import React, { useRef, useEffect, useState } from 'react';
import AOS from "aos";
import { Link, useParams } from 'react-router-dom';
import { FaAngleRight, FaArrowRightLong } from 'react-icons/fa6';
import axios from 'axios';
import { PHP_API_URL, FILE_API_URL } from '../../Helper/Constant';
import validator from 'validator';
const KeyNote = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  const params = useParams();
  const mrId = params?.mrId;
  const [keyNoteData, setKeyNoteData] = useState([]);
  const [marqueeTitle, setMarqueeTitle] = useState([]);
  const fetchKeyNote = async (mrId) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_keynote_front");
      bformData.append("mrq_slider_id", mrId);

      const response = await axios.post(
        `${PHP_API_URL}/keynote_speaker.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        setKeyNoteData(response.data.data);
      }
    } catch (error) {
      /** empty */
    }
  };
  const fetchMarqueeTitle = async (mrId) => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_mrq_slider_title");
      bformData.append("id", mrId);

      const response = await axios.post(
        `${PHP_API_URL}/mrq_slider.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200 && response.data.data.length > 0) {
        setMarqueeTitle(response.data.data[0]);
      }
    } catch (error) {
      /** empty */
    }
  };
  useEffect(() => {
    if (mrId && parseInt(mrId, 10) > 0) {
      fetchKeyNote(mrId);
      fetchMarqueeTitle(mrId);
    }
  }, [mrId]);
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center heading-primary butler-regular text-white">Keynote Speakers</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link><FaAngleRight />
                    </li>
                    <li>Important Updates <FaAngleRight /></li>
                    <li>Keynote Speakers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="section"
        style={{ background: "#F5F5F5" }} data-aos="fade-up" data-aos-delay="100">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-5 text-center">
              <h2 className="heading-primary2 source-font id-title-font-size  id-title-font-size-mobile-device">Keynote Speakers</h2>
              <div className="heading-divider"></div>
              <p className='text-center mt-3 mb-1 source-font id-sub-title id-sub-title-mobile-view'>{marqueeTitle?.content ? validator.unescape(validator.unescape(marqueeTitle?.content)) : ''}</p>
            </div>
          </div>
          <div className="row mt-3">
            {keyNoteData && keyNoteData.map((note) => (
              <div className="col-md-4 mt-3 mb-5" key={note.id}>
                <div
                  className="sldrcard card border-0 soft-shadow"
                  style={{
                    width: "90%",
                    borderRadius: "10px",
                    margin: "0 auto",
                  }}
                >
                  <div className="sldritem">
                    <div className="sldrbimgbx">
                      <img src={`${FILE_API_URL}/keynote/${note?.keynote_photo}`} className="sldrbimg" />
                    </div>

                    <div className="ms-3">
                      <h5 className="card-title mt-0 source-font text-center">
                        {note?.keynote_name ? validator.unescape(note.keynote_name) : ''}
                      </h5>
                      <p
                        className="card-text source-font"
                        style={{ textAlign: "center" }}
                      >
                        {note?.keynote_content ? validator.unescape(note.keynote_content) : ''}
                      </p>
                      <div className="text-center">
                        <Link target="_blank" className="btn-link source-font" to={note?.keynote_link ? validator.unescape(note.keynote_link) : ''}>
                          Read More &nbsp;
                          <FaArrowRightLong />{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyNote;
