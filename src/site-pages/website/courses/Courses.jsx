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
      fun: "about", title: "ABOUT"
    },
    {
      fun: "load_sllaybus", title: "SYLLABUS"
    },
    {
      fun: "load_seminar", title: "SEMINAR/WORKSHOP"
    },
    {
      fun: "load_timetable", title: "TIME TABLE"
    },
    {
      fun: "load_activity", title: "ACTIVITY"
    },
    {
      fun: "load_feestructure", title: "FEE STRUCTURE"
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
                <p className="heading-primary2 butler-regular text-white text-center">{activeSidebar == 'about' ? courseData.coursename : pageTitle}</p>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li><Link to="/">Home</Link> <FaAngleRight /></li> 
                    <li><span>Courses</span> <FaAngleRight /></li>
                    <li>Course Details</li>
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
              <ul className="mcd-menu " style={{ position: "relative" }}>
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
            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3 className='heading-primary2 butler-regulary mt-3'>
                    {
                      activeSidebar == 'about' && (
                        <>
                          {
                            id == 1 && (
                              <span>B.A. LL.B. (Hons.) at Dr. Rajendra Prasad National Law University, Prayagraj</span>
                            )
                          }
                          {
                            id == 2 && (
                              <span>Ph.D. (Law) at Dr. Rajendra Prasad National Law University, Prayagraj</span>
                            )
                          }
                          {
                            id == 3 && (
                              <span>LL.M. at Dr. Rajendra Prasad National Law University, Prayagraj</span>
                            )
                          }
                        </>
                      )
                    }
                    {activeSidebar != 'about' && (pageTitle)}</h3>
                </div>
              </div>
              {activeSidebar == 'about' ? (<>
                <div className="row">
                  <div className="col-lg-12 mb-2">
                    <div className='row'>
                      <div className='col-md-12 col-lg-12 text-center'>
                        <img src={courseData.thumbnail} className='img-fluid mx-auto rounded-3' />
                      </div>
                      <div className='col-md-12 col-lg-12'>
                        <div className="course-card-body">
                          {
                            id == 1 && (
                              <>
                                <h2 className='heading-primary2'>Overview of B.A. LL.B. (Hons.)</h2>
                                <p className='heading-para'>
                                  Dr. Rajendra Prasad National Law University, Prayagraj, offers a prestigious five-year integrated B.A. LL.B. (Hons.) program, designed to provide students with a comprehensive understanding of law and social sciences. This course combines the study of arts and humanities with legal education, preparing students for successful careers in the legal profession, judiciary, corporate sector, and public administration.
                                </p>
                                <h2 className='heading-primary2'>Why Choose B.A. LL.B. (Hons.) at Dr. Rajendra Prasad National Law University?</h2>
                                <p className='heading-para'><strong>Holistic Curriculum:</strong> The program integrates subjects from Arts (Political Science, Sociology, Economics, History) with core legal subjects (Constitutional Law, Criminal Law, Civil Law, International Law, and Corporate Law).</p>
                                <p className='heading-para'><strong>Expert Faculty:</strong> Learn from experienced professors, legal scholars, and practicing advocates who provide practical insights and real-world perspectives..</p>
                                <p className='heading-para'><strong>Moot Court Sessions: </strong> Participate in regular moot court sessions, debates, and seminars to enhance advocacy skills and legal reasoning.</p>
                                <p className='heading-para'><strong>Internship Opportunities: </strong> Gain practical experience through internships at reputed law firms, corporate legal departments, NGOs, and under judicial authorities.</p>
                                <p className='heading-para'><strong>Career Development:</strong>The university provides dedicated career counseling and placement support, ensuring students are well-prepared for their professional journey.</p>
                                <h2 className='heading-primary2'>Course Structure and Curriculum</h2>
                                <p className='heading-para'>The B.A. LL.B. (Hons.) program is divided into ten semesters over five years, covering:</p>
                                <p className='heading-para'>
                                  <strong>Arts and Humanities Subjects:</strong> Political Science, Sociology, Economics, History, and English.
                                </p>
                                <p className='heading-para'><strong>Core Law Subjects:</strong> Constitutional Law, Criminal Law, Civil Law, Family Law, Property Law, Contract Law, and Environmental Law.</p>
                                <p className='heading-para'><strong>Specialized Law Subjects:</strong> Intellectual Property Rights, Cyber Law, International Trade Law, and Corporate Law.</p>
                                <p className='heading-para'><strong>Practical Training:</strong> Moot Court exercises, legal aid clinics, and internships.</p>
                                <h2 className='heading-primary2'>Eligibility Criteria & Admission Process</h2>
                                <p className='heading-para'>Please refer the below displayed brochure.</p>
                                <h2 className='heading-primary2'>Career Opportunities After B.A. LL.B. (Hons.)</h2>
                                <p className='heading-para'>Graduates of B.A. LL.B. (Hons.) from Dr. Rajendra Prasad National Law University can pursue rewarding careers in:</p>
                                <p className='heading-para'>
                                  <strong>Advocacy and Litigation:</strong> Practicing as lawyers in various courts.
                                </p>
                                <p className='heading-para'><strong>Judiciary:</strong> Appearing for judicial services examinations to become judges.</p>
                                <p className='heading-para'><strong>Corporate Sector:</strong> Working as legal advisors, compliance officers, or in-house counsels.</p>
                                <p className='heading-para'><strong>Civil Services:</strong> Pursuing careers in Indian Administrative Services (IAS), Indian Police Services (IPS), and other government services.</p>
                                <p className='heading-para'><strong>Academia and Research:</strong> Becoming law professors or legal researchers.</p>
                                <h2 className='heading-primary2'>Conclusion</h2>
                                <p className='heading-para'>Embark on a journey of knowledge and excellence with the B.A. LL.B. (Hons.) program at Dr. Rajendra Prasad National Law University, Prayagraj. Develop a strong legal foundation, enhance your analytical skills, and build a successful career in law and justice.</p>
                                <p className='heading-para'> <strong>Enroll today and become a part of the next generation of legal leaders!</strong></p>
                              </>
                            )
                          }
                          {
                            id == 2 && (
                              <>
                                <h2 className='heading-primary2'>Overview of Ph.D. (Law) Program</h2>
                                <p className='heading-para'>
                                  Dr. Rajendra Prasad National Law University, Prayagraj, offers a prestigious Doctor of Philosophy (Ph.D.) program in Law, designed for legal scholars, academicians, and practitioners aiming to contribute to advanced legal research and scholarship. This program is ideal for those who wish to explore complex legal issues, develop new legal theories, and influence public policy through impactful research.
                                </p>
                                <h2 className='heading-primary2'>Why Pursue Ph.D. (Law) at Dr. Rajendra Prasad National Law University?</h2>
                                <p className='heading-para'><strong>Research Excellence: </strong> Engage in high-quality research under the guidance of experienced faculty and legal experts.</p>
                                <p className='heading-para'><strong>Diverse Specializations:</strong>Explore various areas of law, including Constitutional Law, International Law, Criminal Law, Corporate Law, Human Rights, and Environmental Law.</p>
                                <p className='heading-para'><strong>Access to Resources: </strong> Utilize state-of-the-art research facilities, extensive law libraries, and access to legal databases.</p>
                                <p className='heading-para'><strong>Academic Recognition: </strong> Publish research papers in reputed national and international law journals and present findings at conferences.</p>
                                <p className='heading-para'><strong>Career Advancement:</strong> Establish a career in academia, legal research, public policy, or senior legal advisory roles in public and private sectors.</p>
                                <h2 className='heading-primary2'>Specializations Offered</h2>
                                <p className='heading-para'>The Ph.D. (Law) program at Dr. Rajendra Prasad National Law University provides flexibility to pursue research in a variety of legal fields, including:</p>
                                <p className='heading-para'><strong>Constitutional Law and Governance</strong></p>
                                <p className='heading-para'><strong>Corporate and Commercial Law</strong></p>
                                <p className='heading-para'><strong>Criminal Law and Criminology</strong></p>
                                <p className='heading-para'><strong>International Law and Relations</strong></p>
                                <p className='heading-para'><strong>Human Rights Law</strong></p>
                                <p className='heading-para'><strong>Intellectual Property Law</strong></p>
                                <p className='heading-para'><strong>Environmental Law and Policy</strong></p>
                                <p className='heading-para'><strong>Cyber Law and Information Technology</strong></p>
                                <h2 className='heading-primary2'><strong>Program Structure and Duration</strong> </h2>
                                <p className='heading-para'><strong>Coursework:</strong> The program begins with mandatory coursework to strengthen research methodology and legal theories.</p>

                                <p className='heading-para'><strong>Research Proposal and Registration:</strong> Scholars submit a detailed research proposal and undergo a rigorous review process.</p>
                                <p className='heading-para'><strong>Thesis Writing and Submission:</strong> Scholars engage in independent research under the guidance of a research supervisor and submit a thesis for evaluation.</p>
                                <p className='heading-para'><strong>Viva Voce Examination:</strong> The program culminates with a viva voce (oral defense) to evaluate the research findings.</p>
                                <p className='heading-para'><strong>Duration:</strong> The minimum duration is 3 years, and the maximum is 6 years.</p>
                                <h2 className='heading-primary2'>Research Opportunities and Facilities</h2>
                                <p className='heading-para'> <strong>Access to Legal Databases: </strong>Scholars receive access to national and international legal databases, research papers, and journals.</p>
                                <p className='heading-para'> <strong>Workshops and Seminars:</strong> Participate in workshops, seminars, and conferences to enhance research skills and network with legal scholars.</p>
                                <p className='heading-para'> <strong> • Interdisciplinary Research:</strong> Collaborate with other academic departments and institutions for interdisciplinary research opportunities.</p>

                                <h2 className='heading-primary2'>Career Prospects After Ph.D. (Law)</h2>
                                <p className='heading-para'> Completing a Ph.D. (Law) from Dr. Rajendra Prasad National Law University opens up a world of opportunities, including:</p>
                                <p className='heading-para'> <strong>Academia and Teaching: </strong>Become a law professor, lecturer, or academic researcher in leading universities and law schools.</p>
                                <p className='heading-para'> <strong>Legal Research and Policy Making:</strong> Work as a legal researcher, policy advisor, or consultant in governmental and non-governmental organizations.</p>
                                <p className='heading-para'> <strong>Judiciary and Legal Practice: </strong>Pursue a career as a judge, legal consultant, or senior advocate.</p>
                                <p className='heading-para'> <strong>Corporate Sector: </strong>Take up roles as legal advisors, compliance officers, or legal strategists in corporate firms.</p>
                                <p className='heading-para'> <strong>International Organizations:</strong> Contribute as a legal expert or policy analyst in international organizations, such as the United Nations, World Bank, and international NGOs.</p>

                                <h2 className='heading-primary2'> Why Choose Dr. Rajendra Prasad National Law University?</h2>
                                <p className='heading-para'> <strong>Reputed Faculty and Mentorship:</strong> Learn from eminent legal scholars and experienced research supervisors.</p>
                                <p className='heading-para'> <strong>Dynamic Research Community:</strong> Engage with a vibrant research community of scholars, academics, and legal practitioners.</p>
                                <p className='heading-para'> <strong>Location and Infrastructure:</strong> Situated in the culturally rich city of Prayagraj, the university offers a conducive environment for legal research and academic growth.</p>
                                <h2 className='heading-primary2'>Conclusion</h2>
                                <p className='heading-para'>Pursue advanced legal research and make a meaningful contribution to the legal fraternity with a Ph.D. (Law) from Dr. Rajendra Prasad National Law University, Prayagraj. Develop your expertise, publish influential research, and become a leader in the field of law and justice.</p>
                                <h3 className='heading-para'><strong>Enroll today and shape the future of legal education and policy!</strong></h3>
                              </>
                            )
                          }
                          {
                            id == 3 && (
                              <>
                                <h2 className='heading-primary2'>Overview of LL.M. Program</h2>
                                <p className='heading-para'>Dr. Rajendra Prasad National Law University, Prayagraj, offers a distinguished Master of Laws (LL.M.) program designed for legal professionals and graduates seeking advanced knowledge and expertise in specialized areas of law. This one-year postgraduate program provides an in-depth understanding of legal principles, research methodologies, and contemporary legal issues, preparing students for leadership roles in academia, judiciary, corporate sectors, and international organizations.</p>
                                <h2 className='heading-primary2'>Why Choose LL.M. at Dr. Rajendra Prasad National Law University?</h2>
                                <p className='heading-para'> <strong>Specialized Curriculum:</strong> Choose from a wide range of specializations, including Constitutional Law, Corporate Law, Criminal Law, International Law, and Human Rights Law.</p>
                                <p className='heading-para'> <strong>Expert Faculty and Mentors:</strong> Learn from renowned legal scholars, experienced practitioners, and industry experts who provide practical insights and academic guidance.</p>
                                <p className='heading-para'> <strong>Research Opportunities:</strong> Engage in rigorous legal research, participate in national and international conferences, and publish papers in reputed legal journals.</p>
                                <p className='heading-para'> <strong>Interactive Learning Environment:</strong> Benefit from interactive lectures, case studies, moot courts, and workshops that enhance critical thinking and analytical skills.</p>
                                <p className='heading-para'> <strong>Career Support and Placement Assistance:</strong> The university offers dedicated career counseling and placement support, helping students pursue successful careers in academia, legal practice, corporate sectors, and public services.</p>

                                <h2 className='heading-primary2'>Course Structure and Specializations</h2>
                                <p className='heading-para'> The LL.M. program is structured to provide both theoretical knowledge and practical experience. The course includes:</p>
                                <p className='heading-para'> <strong>Core Subjects:</strong> Advanced Jurisprudence, Research Methodology, Comparative Public Law, and Legal Education.</p>
                                <p className='heading-para'>
                                  <strong>Specializations Offered:</strong>
                                  <br />
                                  <p className='heading-para' style={{ marginLeft: '20px' }}> <strong>Constitutional Law:</strong> In-depth study of constitutional principles, judicial review, and human rights.</p>
                                  <p className='heading-para' style={{ marginLeft: '20px' }}> <strong>Corporate Law:</strong> Corporate governance, mergers and acquisitions, and international trade law.</p>
                                  <p className='heading-para' style={{ marginLeft: '20px' }}> <strong>Criminal Law:</strong> Advanced criminology, criminal justice, and human rights in criminal proceedings.</p>
                                  <p className='heading-para' style={{ marginLeft: '20px' }}> <strong>International Law:</strong> Public international law, international trade law, and human rights law.</p>
                                  <p className='heading-para' style={{ marginLeft: '20px' }}> <strong>Human Rights Law:</strong> National and international human rights standards, advocacy, and enforcement mechanisms.</p>
                                </p>
                                <p className='heading-para'><strong>Dissertation and Research Work:</strong> Students undertake independent research under faculty supervision, culminating in a dissertation on a contemporary legal issue.</p>
                                <h2 className='heading-primary2'>Eligibility Criteria & Admission Process</h2>
                                <p className='heading-para'>Please refer the below displayed brochure.</p>
                                <h2 className='heading-primary2'>Career Opportunities After LL.M.</h2>
                                <p className='heading-para'>An LL.M. degree from Dr. Rajendra Prasad National Law University opens up diverse career opportunities in:</p>
                                <p className='heading-para'><strong>Judiciary and Legal Practice:</strong> Pursuing careers as judges, advocates, or legal consultants.</p>
                                <p className='heading-para'><strong>Corporate Sector:</strong> Working as legal advisors, compliance officers, or corporate counsels.</p>
                                <p className='heading-para'><strong>International Organizations:</strong> Opportunities in United Nations agencies, international NGOs, and human rights organizations.</p>
                                <p className='heading-para'><strong>Public Service and Civil Services: </strong>Joining governmental agencies, policy-making bodies, or public administration.</p>
                                <h2 className='heading-primary2'>Conclusion</h2>
                                <p className='heading-para'>Advance your legal career with the LL.M. program at Dr. Rajendra Prasad National Law University, Prayagraj. Develop specialized expertise, enhance your research capabilities, and build a successful career in the legal profession.</p>
                                <p className='heading-para'><strong>Enroll today and shape the future of law and justice!</strong></p>
                              </>
                            )
                          }
                        </div>
                      </div>
                    </div>
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

