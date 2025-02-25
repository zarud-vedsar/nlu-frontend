import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import axios from "axios";
import { FILE_API_URL } from "../../site-components/Helper/Constant";
import { useParams } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import placeholderPerson from "../../site-components/website/assets/Images/person-placeholder.jpg";
const Chairperson = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [html, sethtml] = useState("");
  const [message, setMessages] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    load_postname();
  }, []);
  const load_postname = async () => {
    setLoading(true);
    try {
      const bformData = new FormData();
      bformData.append("data", "load_message_names");

      const response = await axios.post(
        `${PHP_API_URL}/message.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessages(response.data.data);
    } catch (error) {
      // console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getMessage = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "get_message");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/message.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        setFormData({
          name: response.data.data[0].name,
          from: response.data.data[0].msg_from,
          authority_img: response.data.data[0].image,
        });
        await decodeHtml(response.data.data[0].message);
        if (response.data.data[0].image) {
          setPreviewImage(
            `${FILE_API_URL}/our-authorities/${response.data.data[0].image}`
          );
        }
      }
    } catch (error) {
      const status = error.response?.data?.status;

      if (status === 400 || status === 500) {
        // toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        // toast.error(
        //   "An error occurred. Please check your connection or try again."
        // );
      }
    }
  };

  useEffect(() => {
    if (id) {
      getMessage();
    }
  }, [id]);

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">
                  {formData?.from}
                </h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link>
                    </li>{" "}
                    <FaAngleRight />
                    <li>
                      <span>People</span> <FaAngleRight />
                    </li>
                    <li>
                      <span>Governance</span> <FaAngleRight />
                    </li>
                    <li>{formData?.from}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 d-none d-sm-none d-md-block d-lg-block">
              <h3 className="heading-primary2 butler-regular source-font">
                Governance
              </h3>
              <div className="heading-divider mb-3"></div>
              <ul className="mcd-menu">
                {message &&
                  message.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`/message/${post.id}`}
                        className={post.id == id ? "active" : ""}
                      >
                        <i className="fa fa-university" />
                        <strong>{post.msg_from}</strong>
                        <small>National Law University Prayagraj</small>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3 className="heading-primary2 butler-regulary mt-3 source-font">
                    From the {formData?.from} Desk
                  </h3>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-12 col-12 col-sm-12">
                  <div className="align-image-with-content ">
                    <img
                      src={previewImage || placeholderPerson}
                      style={{
                        marginBottom: 3,
                        background: "#fff",
                        borderRadius: "10px",
                        border: "2px solid #BFB9B7",
                        padding: "20px",
                      }}
                    />
                    <h3 className="butler-regular mb-1 heading-primary3 mt-3 text-center">{`${formData.name}`}</h3>
                    <p className="heading-para gorditas-regular text-primary text-center">
                      {formData?.from}
                    </p>
                  </div>
                  <p
                    className="heading-para gorditas-regular text-justify"
                    dangerouslySetInnerHTML={{ __html: html }}
                  ></p>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>
        {`
          .align-image-with-content {
            float: right;
            margin-left: 25px;
            width: 250px;
          }

          @media only screen and (max-width: 767px) {
            .align-image-with-content {
              float: none;
              display: block;
              margin: 0 auto; /* Centers the image */
            }
          }
        `}
      </style>
    </>
  );
};

export default Chairperson;
