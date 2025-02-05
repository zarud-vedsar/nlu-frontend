import React, { useEffect, useState } from "react";
import { dataFetchingPost } from "../../site-components/Helper/HelperFunction";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import axios from "axios";
import { useParams } from "react-router-dom";
import validator from 'validator';
const DetailSpeciality = () => {
  const [speciality, setSpeciality] = useState([]);
  const [decodedDescriptions, setDecodedDescriptions] = useState();
  const { id } = useParams();

  const decodeHtml = async (html) => {
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
      setDecodedDescriptions(response.data);
    } catch (error) {

    }
  };

  useEffect(() => {
    if (id) {
      fetchSpeciality();
    }
  }, []);

  const fetchSpeciality = async (deleteStatus = 0) => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/speciality/fetch`,
        {
          listing: "yes",
          deleteStatus,
          dbId: id,
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSpeciality(response.data[0]);

        if (response.data[0]?.description) {
          await decodeHtml(response.data[0]?.description);
        }
      } else {
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
      } else {

      }
    }
  };


  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Our Speciality</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <a href="default.html">Home</a>
                    </li>
                    <li>{capitalizeFirstLetter(speciality.title)}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-padding">


        <div className="speciality-content-wrapper">
          <div className="speciality-image">
            <img
              src={speciality.image}
              alt="Speciality"
              style={{
                display: "block",
                margin: "0 auto",
                maxWidth: "60%",
                height: "auto",
              }}
            />
          </div>
          <div className="speciality-description">
            <h3
              style={{
                textAlign: "center",
                color: "#332f2f",
                fontSize: "1.5rem",
              }}
            >
              <span dangerouslySetInnerHTML={{
                __html: speciality?.title ?
                  validator.unescape(validator.unescape(speciality.title)) : ''
              }}></span>

            </h3>
            <p
              style={{
                fontSize: "20px",
                padding: "30px 10px",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: decodedDescriptions ? validator.unescape(validator.unescape(decodedDescriptions)) : '' }}></div>

            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .speciality-content-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-top: 60px;
          margin-bottom: 50px;
          padding:50%
          flex-wrap: wrap;
        }

        .speciality-image {
          flex: 1;
        }

        .speciality-description {
          flex: 2;
          padding-right:200px;
        }

          @media screen and (max-width: 1330px) {
          
            .speciality-description {
          flex: 2;
          padding-right:50px;
        }
      }

        @media screen and (max-width: 768px) {
          .speciality-content-wrapper {
            flex-direction: column;
            align-items: center;
          }
            .speciality-description {
          flex: 2;
          padding-right:0px;
        }

          .speciality-image {
            margin-right: 0;
            margin-bottom: 20px;
          }

          h3 {
            font-size: 1.2rem;
          }

          .breadcrumb-bar {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .breadcrumb-text h1 {
            font-size: 1.8rem;
          }

          .breadcrumb-bar ul {
            padding: 0;
            list-style: none;
            font-size: 0.9rem;
          }

          .section-title h3 {
            font-size: 1.5rem;
          }

          p {
            font-size: 18px;
            line-height: 1.5;
          }
        }

        @media screen and (max-width: 480px) {
          .breadcrumb-text h1 {
            font-size: 1.5rem;
          }

          .section-title h3 {
            font-size: 1.3rem;
          }

          p {
            font-size: 16px;
          }

          .breadcrumb-bar ul {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default DetailSpeciality;
