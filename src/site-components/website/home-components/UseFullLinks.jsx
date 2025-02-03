import { React, useState, useEffect } from 'react';
import { FILE_API_URL, PHP_API_URL } from '../../Helper/Constant';
import axios from 'axios';
import defaultImage from '../assets/Images/useful-1.png';
import { slugify } from '../../Helper/HelperFunction';
const UseFullLinks = () => {
  const [usefulLinks, setUsefullLinks] = useState([]);

  const getUsefulLink = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "load_link");
      const response = await axios.post(
        `${PHP_API_URL}/useful_link.php`,
        bformData
      );
      setUsefullLinks(response.data.data);
    } catch (error) { /* empty */ }
  };

  useEffect(() => {
    getUsefulLink();
  }, []);
  return (
    <>
      {usefulLinks && usefulLinks.length > 0 && (
        <section className="usefulllnk">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h2 className="heading-primary2">Useful Links</h2>
                <div className="heading-divider"></div>
              </div>
            </div>
            <div className="usefullcontainer mt-4">
              <div className="row">
                {usefulLinks &&
                  usefulLinks.map((link, index) => (
                    <div
                      className="col-12 col-md-3 mt-3 col-lg-3 text-center"
                      key={index}
                    >
                      <a
                        href={
                          link.link_other_link
                            ? link.link_other_link
                            : `/page/${link.link_link}/${slug(link.link_title)}`
                        }
                        className="useful-link-col"
                        target={link.target}
                        rel="noopener noreferrer"
                      >
                        <img
                          className="linkiimg"
                          src={
                            link?.mage_file
                              ? `${FILE_API_URL}/${link.image_file}`
                              : defaultImage
                          }
                          alt={link.link_title}
                        />
                        <p className="linkttx mt-3">{link.link_title}</p>
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default UseFullLinks;
