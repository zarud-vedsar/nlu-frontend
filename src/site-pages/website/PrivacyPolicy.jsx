import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PHP_API_URL } from '../../site-components/Helper/Constant';
import { FaAngleRight } from 'react-icons/fa6';
import validator from 'validator';
const PrivacyPolicy = () => {
  const [privacyData, setPrivacyData] = useState([]);
  const [pcontent, setpcontent] = useState('');

  async function getPrivacyContent() {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_latest_privacy");

      const response = await axios.post(
        `${PHP_API_URL}/privacy_policy.php`,
        bformData
      );
      if (response.data?.data[0]?.content) {
        const response2 = await axios.post(
          `${PHP_API_URL}/page.php`,
          { data: 'decodeData', html: response.data.data[0].content },
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setpcontent(response2.data);
      }
      setPrivacyData(response.data.data[0]);
    } catch (error) {
      console.error("Error occurred:");
    }
  }

  useEffect(() => {
    getPrivacyContent();
  }, []);

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center heading-primary2 butler-regular text-white">Privacy Policy</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li>Privacy Policy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className='copyright-wrapper'>
                <p dangerouslySetInnerHTML={{ __html: pcontent ? validator.unescape(validator.unescape(pcontent)) : '' }}></p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default PrivacyPolicy;
