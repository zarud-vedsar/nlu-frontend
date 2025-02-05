import React, { useEffect, useState } from "react";
import { PHP_API_URL, FILE_API_URL } from "../../Helper/Constant";
import axios from "axios";
import validator from 'validator';
const Banner = () => {
  const [banner, setBanner] = useState([]);
  const fetchBanner = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_banner_front");

      const response = await axios.post(
        `${PHP_API_URL}/banner.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        setBanner(response.data.data);
      }
    } catch (error) { /* empty */ }
  };
  useEffect(() => {
    fetchBanner();
  }, []);
  return (
    <>
      <div className="slider-areaytutyi">
        <div id="wowslider-container1">
          <div className="ws_images">
            <ul>
              {
                banner && banner.map((dData, index) => (
                  <li key={index}>
                    <img
                      src={`${FILE_API_URL}/banner/${dData.banner}`}
                      alt="#"
                      className="sliderimg"
                      title=""
                      id={`wows1_[${index}]`}
                    />
                    <div className="banner-text-sec">
                      <div className="banner-text">
                        <h1>{dData?.btitle ? validator.unescape(dData.btitle) : ''}</h1>
                        <p>{dData?.bshort ? validator.unescape(dData.bshort) : ''}</p>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="ws_shadow" />
        </div>
      </div>
    </>
  );
};

export default Banner;
