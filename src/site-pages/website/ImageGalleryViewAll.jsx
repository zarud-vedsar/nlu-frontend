import {React,useState,useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import Img2 from '../../site-components/website/assets/Images/img-2.jpg';
import LightGallery from "lightgallery/react";
import axios from 'axios';
import { PHP_API_URL } from '../../site-components/Helper/Constant';
import { FILE_API_URL } from '../../site-components/Helper/Constant';
import { capitalizeFirstLetter } from '../../site-components/Helper/HelperFunction';




import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-video.css";
import "lightgallery/css/lg-pager.css";

// Import all plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgShare from "lightgallery/plugins/share";
import lgVideo from "lightgallery/plugins/video";
import lgPager from "lightgallery/plugins/pager";



const ImageGalleryViewAll = () => {
  const {id} = useParams();

  const [galleryList, setGalleryList] = useState({
    title: "",
    gallery_images: [],
  });

  const getGalleryById = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "getGalleryById");
      bformData.append("id", id);

      const response = await axios.post(
        `${PHP_API_URL}/gallery.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        let splitedGallery =
          response.data?.data[0]?.gallery_images?.split("$;");

        setGalleryList((prev) => ({
          ...prev,
          title: response.data.data[0].title,
          gallery_images: splitedGallery,
        }));
      }
    } catch (error) {
      setGalleryList({});
      const status = error.response?.data?.status;
      if (status === 400 || status === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  useEffect(() => {
    if (id) {
      getGalleryById();
    }
  }, []);
   
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Image Gallery View-All</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>Image Gallery View-All</li>
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
                <div className="col-12 ">
                    <h4 className='gal-title'>{capitalizeFirstLetter(galleryList?.title)}</h4>
                </div>
          <div className="row">
          {galleryList?.gallery_images.map((image, index) => (
          <LightGallery
              speed={500}
              plugins={[
                lgThumbnail,
                lgZoom,
                lgAutoplay,
                lgFullscreen,
                lgShare,
                lgVideo,
                lgPager,
              ]}
              mode="lg-fade"
              key={index}
            >
                <a
                  href={`${FILE_API_URL}/gallery/${image}`}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 gal-mb-4"
                >
                  <img src={`${FILE_API_URL}/gallery/${image}`} alt={image.alt} className="gal-image"
                  style={{height:"350px"}} />
                </a>
             
            </LightGallery>
          ))}
          </div>
          </div>
         
        </div>
      </div>
    </>
  )
}

export default ImageGalleryViewAll