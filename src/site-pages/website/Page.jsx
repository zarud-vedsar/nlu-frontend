import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
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
    } catch (error) { }
  };

  useEffect(() => {
    getPageDetail();
  }, []);
  const getPageDetail = async () => {
    console.log("run");
    try {
      const bformData = new FormData();
      bformData.append("data", "fetch_page");
      bformData.append("id", param.cid);
      const response = await axios.post(`${PHP_API_URL}/page.php`, bformData);
      decodeHtml(response?.data?.data[0].page_content);
      setPageData(response.data.data[0]);
      console.log(response.data.data[0]);
      console.log(pageData);
    } catch (e) {
      console.log(e);
    } finally {
    }
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
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3>Governance</h3>
                </div>
              </div>
              <ul className="mcd-menu">
                <li>
                  <Link to="/chairperson" className="active">
                    <i className="fa fa-university" />
                    <strong>Chairperson</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/visitor">
                    <i className="fa fa-university" />
                    <strong>Visitor</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/chancellor">
                    <i className="fa fa-university" />
                    <strong>Chancellor</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/vice-chancellor">
                    <i className="fa fa-university" />
                    <strong>Vice Chancellor</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/finance-controller">
                    <i className="fa fa-university" />
                    <strong>Finance Controller</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                {/* <li>
                  <Link to="/registrar">
                    <i className="fa fa-university" />
                    <strong>Registrar</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/general-council">
                    <i className="fa fa-university" />
                    <strong>General Council</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/executive-council">
                    <i className="fa fa-university" />
                    <strong>Executive Council</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/academic-council">
                    <i className="fa fa-university" />
                    <strong>Academic Council</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li> */}
                {/* <li>
                  <Link to="/finance-committee">
                    <i className="fa fa-university" />
                    <strong>Finance Committee</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li> */}
              </ul>
            </div>

            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
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
