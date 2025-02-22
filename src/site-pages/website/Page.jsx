import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FILE_API_URL, PHP_API_URL } from "../../site-components/Helper/Constant";
import axios from "axios";
const Page = () => {
  const param = useParams();
  const [pageData, setPageData] = useState();
  const [html, sethtml] = useState();
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
      sethtml(response.data);
    } catch (e) { /* empty */ }
  };

  useEffect(() => {
    getPageDetail();
  }, []);
  const getPageDetail = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "fetch_page");
      bformData.append("id", param.cid);
      const response = await axios.post(`${PHP_API_URL}/page.php`, bformData);
      decodeHtml(response?.data?.data[0].page_content);
      setPageData(response.data.data[0]);
      // eslint-disable-next-line no-unused-vars
    } catch (e) { /* empty */ }
  };
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">{pageData?.ptitle}</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <a href="Default-2.html">Home</a>
                    </li>
                    <FaAngleRight />
                     <li>About</li><FaAngleRight />
                    <li>{pageData?.ptitle}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="about-page-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3>{pageData?.ptitle}</h3>
                </div>
              </div>
              {pageData?.page_type != "pdf" && (
                <div className="about-text-container">
                  <p>
                    {" "}
                    {pageData?.image_file && (
                      <img
                        src={`${FILE_API_URL}/${pageData?.image_file}`}
                        className="thumbnail msg_ReghtImg"
                        style={{
                          maxWidth: "300px",
                          maxHeight: "300px",
                          width: "100%",
                          height: "auto",
                        }}
                      />
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: html,
                      }}
                    />{" "}
                  </p>
                </div>
              )}
              {/* {pageData?.page_type === "pdf" && (
  <iframe
    src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`)}`}
    style={{height: '500px', border: 'none' }}
    className="col-lg-12 col-md-12 col-sm-12 col-xs-12"

    title="PDF Viewer"
  ></iframe>
)} */}
              {pageData?.page_type === "pdf" && (
                <iframe
                  src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(
                    `${FILE_API_URL}/${pageData?.pdf_file}`
                  )}`}
                  className="col-lg-12 col-md-12 col-sm-12 col-xs-12"

                  style={{ height: "500px", border: "none" }}
                  title="PDF Viewer"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
