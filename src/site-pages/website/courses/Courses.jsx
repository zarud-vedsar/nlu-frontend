import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PHP_API_URL } from '../../../site-components/Helper/Constant';
import { useParams } from 'react-router-dom';
import { dataFetchingPost } from '../../../site-components/Helper/HelperFunction';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import secureLocalStorage from 'react-secure-storage';
import { FaAngleRight } from 'react-icons/fa6';
import validator from 'validator';
const Courses = () => {
  const { id } = useParams();

  const [coursePage, setCoursePage] = useState("");

  const content = [
    {
      fun: "about", title: "about"
    },
    {
      fun: "load_sllaybus", title: "syllabus"
    },
    {
      fun: "load_seminar", title: "seminar/workshop"
    },
    {
      fun: "load_timetable", title: "Time Table"
    },
    {
      fun: "load_activity", title: "Activity"
    },
    {
      fun: "load_feestructure", title: "Fee Structure"
    },
  ];

  const fetchData = async (data, title) => {
    if (data === "about") {
      setActiveSidebar(data)
      return
    }
    try {
      setPageTitle(title)
      setActiveSidebar(data)
      await getDetail(data, id);
    } catch (error) { /* empty */ }
  };

  const getDetail = async (data, id) => {
    const bformData = new FormData();
    bformData.append("loguserid", secureLocalStorage.getItem("login_id"));
    bformData.append("login_type", secureLocalStorage.getItem("loginType"));
    bformData.append("data", data);
    bformData.append("course_id", id);

    try {
      const response = await axios.post(`${PHP_API_URL}/course.php`, bformData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200) {
        const fieldMapping = {
          load_sllaybus: 'sllaybus',
          load_seminar: 'seminar',
          load_activity: 'activity',
          load_timetable: 'timetable',
          load_feestructure: 'fee_structure'
        };
        const field = fieldMapping[data];
        if (field) {
          const decodedHtml = await decodeHtml(response.data.data[0][field]);
          setCoursePage(decodedHtml)
        }
      }
    } catch (error) {
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
      return response.data;
    } catch (error) { }
  };


  const [courseData, setCourseData] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState("about");
  const [pageTitle, setPageTitle] = useState("");

  const getCourse = async () => {
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/course/fetch`,
        { dbId: id }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        const decodedHtml = await decodeHtml(validator.unescape(response.data[0].description));
        setCoursePage(decodedHtml)
        setCourseData(response.data[0])
      }
    } catch (error) {
      console.error("Error:", error);
      const statusCode = error.response?.data?.statusCode;
    }
  };

  useEffect(() => {
    if (id) {
      getCourse();
    }

  }, [id]);

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="heading-primary2 butler-regular text-white text-center">{activeSidebar == 'about' ? courseData.coursename : pageTitle}</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link></li> <FaAngleRight />
                    <li>{activeSidebar == 'about' ? courseData.coursename : pageTitle}</li>
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
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 leftpart">
              <h3 className="heading-primary2 butler-regular">Course Details</h3>
              <div className="heading-divider mb-3"></div>
              <ul className="mcd-menu " style={{position:"relative"}}>
                  <div className='borderbottomdiveder'>
                    <hr></hr>
                  </div>
                {content &&
                  content.map((post, index) => (
                    <li key={index}>
                      <Link
                        className={post.fun == activeSidebar ? "active" : ""}
                        onClick={() => fetchData(post.fun, post.title)}
                      >
                        <i className="fa fa-university" />
                        <strong>{post.title}</strong>
                        <small>National Law University Prayagraj</small>
                      </Link>
                    </li>
                  ))}
                
              </ul>

            </div>
            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 rightpart">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3 className='heading-primary2 butler-regulary mt-3'>{activeSidebar == 'about' ? courseData.coursename : pageTitle}</h3>
                </div>
              </div>
              {activeSidebar == 'about' ? (<>
                <div className="row">
                  <div className="col-lg-12 mb-2">
                    <div className='row'>
                      <div className='col-md-6 col-lg-6'>
                        <img src={courseData.thumbnail} className='img-fluid mx-auto rounded-3' />
                        <div style={{padding:"20px"}}>
                          <h6 className="heading-para mb-2 gorditas-regular" >
                          <span className="course-text-bold c-width">Qualification: </span>{" "}
                          {courseData.qualification}
                        </h6>
                        <h6 className="heading-para mb-2 gorditas-regular">
                          <span className="course-text-bold c-width">Medium: </span>{" "}
                          {courseData.medium}
                        </h6>
                        <h6 className="heading-para mb-2 gorditas-regular">
                          <span className="course-text-bold c-width">Duration: </span>{" "}
                          {courseData.duration}
                        </h6>
                        <h6 className="heading-para mb-2 gorditas-regular">
                          <span className="course-text-bold c-width">Level: </span>{" "}
                          {courseData.level}
                        </h6>
                    </div>
                      </div>
                      <div className='col-md-6 col-lg-6'>
                      <div className="course-card-body contentestsec" >
                      <div className="heading-para gorditas-regular text-justify w-100" dangerouslySetInnerHTML={{ __html: coursePage }}></div>
                    </div>
                
                
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    {/* <h6 className="heading-para mb-2 gorditas-regular">
                          <span className="course-text-bold c-width">Qualification: </span>{" "}
                          {courseData.qualification}
                        </h6>
                        <h6 className="heading-para mb-2 gorditas-regular">
                          <span className="course-text-bold c-width">Medium: </span>{" "}
                          {courseData.medium}
                        </h6>
                        <h6 className="heading-para mb-2 gorditas-regular">
                          <span className="course-text-bold c-width">Duration: </span>{" "}
                          {courseData.duration}
                        </h6>
                        <h6 className="heading-para mb-2 gorditas-regular">
                          <span className="course-text-bold c-width">Level: </span>{" "}
                          {courseData.level}
                        </h6> */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <iframe
                      src={courseData?.pdf_file || ''}
                      width="100%"
                      height="600px"
                      title="course PDF"
                    />
                  </div>
                </div>
              </>) : (
                <>
                  <div className='row'>
                    <div className="col-md-12">
                      <div className="heading-para gorditas-regular text-justify w-100" dangerouslySetInnerHTML={{ __html: coursePage }}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <style>
          {
            `

            .contentestsec{
              height: 400px;
         overflow-y: auto;
  scrollbar-width: none; /* Firefox */
            }

            .contentestsec::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

          .rightpart, .leftpart {
  height: 500px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
}

.rightpart::-webkit-scrollbar, 
.leftpart::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}


            `
          }
        </style>
      </div>
    </>
  )
}

export default Courses;

