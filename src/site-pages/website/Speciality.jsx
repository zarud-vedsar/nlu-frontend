import React, { useEffect, useState } from "react";
import AOS from "aos";
import { dataFetchingPost } from "../../site-components/Helper/HelperFunction";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validator from "validator";

const Speciality = () => {
  const [speciality, setSpeciality] = useState([]);
  const navigate = useNavigate();
  const [decodedDescriptions, setDecodedDescriptions] = useState({});
    useEffect(() => {
      AOS.init({
        duration: 1000,
        easing: "ease-out-cubic",
      });
    }, []);

  const decodeHtml = async (html, id) => {
    try {
      const response = await axios.post(
        `${PHP_API_URL}/page.php`,
        {
          data: "decodeData",
          html,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDecodedDescriptions((prevState) => ({
        ...prevState,
        [id]: response.data,
      }));
      // eslint-disable-next-line no-unused-vars
    } catch (error) { /* empty */ }
  };


  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetchSpeciality();
  }, []);

  const fetchSpeciality = async (deleteStatus = 0) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/speciality/fetch`,
        {
          listing: "yes",
          deleteStatus,
          status: 1,
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSpeciality(response.data);
        response.data.forEach((item) => {
          if (item.description) {
            decodeHtml(item.description, item.id);
          }
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) { /* empty */ }
  };

  return (<>
    {speciality.length > 0 && <div className="section-fac">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row">
          <div className="col-md-12">
            <div className='col-md-12 mb-3 text-center'>
            <h2 className="heading-primary2 source-font" style={{ fontSize: '55px' }}>Our Specialities</h2>
              <div className="heading-divider"></div>
            </div>
          </div>
        </div>
        <div className="speciality-sec">
          <div className="speciality-items">
            {speciality &&
              speciality.map((item, index) => (
                <div
                  className="speciality-item"
                  key={index}
                  onClick={() => navigate(`speciality/${item.id}`)}
                >
                  <div className="spec-itembx">
                    <div className="spec-imgbx">
                      <img
                        src={item.image}
                        alt={item.title}
                      />
                    </div>
                    <div className="spec-title-bx">
                      <h3 className="spec-title" dangerouslySetInnerHTML={{ __html: validator.unescape(validator.unescape(capitalizeFirstLetter(item.title))) }} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>}
  </>
  );
};
export default Speciality;