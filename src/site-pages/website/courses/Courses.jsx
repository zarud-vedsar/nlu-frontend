import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PHP_API_URL } from '../../../site-components/Helper/Constant';
import { useParams } from 'react-router-dom';
import { dataFetchingPost } from '../../../site-components/Helper/HelperFunction';
import { NODE_API_URL } from '../../../site-components/Helper/Constant';
import secureLocalStorage from 'react-secure-storage';
import { FaAngleRight } from 'react-icons/fa6';
import LlmCourseImg from '../../../site-components/website/assets/Images/course/llm.png';
import PhdCourseImg from '../../../site-components/website/assets/Images/course/phd.png';
import BaLlbCourseImg from '../../../site-components/website/assets/Images/ba-llb.png';
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
          setTimeout(() => setCoursePage(decodedHtml), 400);
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
        setTimeout(() => setCoursePage(decodedHtml), 400);
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
              <h3 className="heading-primary2 butler-regular source-font">Course Details</h3>
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
                  <h3 className='heading-primary2 butler-regulary mt-3 source-font'>
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
                              <span>LL.M. in PUBLIC LAW | AY 2025-26
                                ONE YEAR LL.M. PROGRAMME</span>
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
                        <>
                          {
                            id == 1 && (
                              <img src={BaLlbCourseImg} className='img-fluid mx-auto rounded-3' />

                            )
                          }
                          {
                            id == 2 && (
                              <img src={PhdCourseImg} className='img-fluid mx-auto rounded-3' />

                            )
                          }
                          {
                            id == 3 && (
                              <img src={LlmCourseImg} className='img-fluid mx-auto rounded-3' />

                            )
                          }
                        </>



                      </div>
                      <div className='col-md-12 col-lg-12'>
                        <div className="course-card-body">
                          {
                            id == 1 && (
                              <>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Overview of B.A. LL.B. (Hons.)</h2>
                                <p className='heading-para'>
                                  Dr. Rajendra Prasad National Law University, Prayagraj, offers a prestigious five-year integrated B.A. LL.B. (Hons.) program, designed to provide students with a comprehensive understanding of law and social sciences. This course combines the study of arts and humanities with legal education, preparing students for successful careers in the legal profession, judiciary, corporate sector, and public administration.
                                </p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Why Choose B.A. LL.B. (Hons.) at Dr. Rajendra Prasad National Law University?</h2>
                                <p className='heading-para'><strong>Holistic Curriculum:</strong> The program integrates subjects from Arts (Political Science, Sociology, Economics, History) with core legal subjects (Constitutional Law, Criminal Law, Civil Law, International Law, and Corporate Law).</p>
                                <p className='heading-para'><strong>Expert Faculty:</strong> Learn from experienced professors, legal scholars, and practicing advocates who provide practical insights and real-world perspectives..</p>
                                <p className='heading-para'><strong>Moot Court Sessions: </strong> Participate in regular moot court sessions, debates, and seminars to enhance advocacy skills and legal reasoning.</p>
                                <p className='heading-para'><strong>Internship Opportunities: </strong> Gain practical experience through internships at reputed law firms, corporate legal departments, NGOs, and under judicial authorities.</p>
                                <p className='heading-para'><strong>Career Development:</strong>The university provides dedicated career counseling and placement support, ensuring students are well-prepared for their professional journey.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Course Structure and Curriculum</h2>
                                <p className='heading-para'>The B.A. LL.B. (Hons.) program is divided into ten semesters over five years, covering:</p>
                                <p className='heading-para'>
                                  <strong>Arts and Humanities Subjects:</strong> Political Science, Sociology, Economics, History, and English.
                                </p>
                                <p className='heading-para'><strong>Core Law Subjects:</strong> Constitutional Law, Criminal Law, Civil Law, Family Law, Property Law, Contract Law, and Environmental Law.</p>
                                <p className='heading-para'><strong>Specialized Law Subjects:</strong> Intellectual Property Rights, Cyber Law, International Trade Law, and Corporate Law.</p>
                                <p className='heading-para'><strong>Practical Training:</strong> Moot Court exercises, legal aid clinics, and internships.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Eligibility Criteria & Admission Process</h2>
                                <p className='heading-para'>Please refer the below displayed brochure.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Career Opportunities After B.A. LL.B. (Hons.)</h2>
                                <p className='heading-para'>Graduates of B.A. LL.B. (Hons.) from Dr. Rajendra Prasad National Law University can pursue rewarding careers in:</p>
                                <p className='heading-para'>
                                  <strong>Advocacy and Litigation:</strong> Practicing as lawyers in various courts.
                                </p>
                                <p className='heading-para'><strong>Judiciary:</strong> Appearing for judicial services examinations to become judges.</p>
                                <p className='heading-para'><strong>Corporate Sector:</strong> Working as legal advisors, compliance officers, or in-house counsels.</p>
                                <p className='heading-para'><strong>Civil Services:</strong> Pursuing careers in Indian Administrative Services (IAS), Indian Police Services (IPS), and other government services.</p>
                                <p className='heading-para'><strong>Academia and Research:</strong> Becoming law professors or legal researchers.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Conclusion</h2>
                                <p className='heading-para'>Embark on a journey of knowledge and excellence with the B.A. LL.B. (Hons.) program at Dr. Rajendra Prasad National Law University, Prayagraj. Develop a strong legal foundation, enhance your analytical skills, and build a successful career in law and justice.</p>
                                <p className='heading-para'> <strong>Enroll today and become a part of the next generation of legal leaders!</strong></p>
                              </>
                            )
                          }
                          {
                            id == 2 && (
                              <>
                                <p className='source-font heading-para mb-2'>The University offers full time Ph.D. in Law.</p>
                                <p className='source-font heading-para'>Total No of Seats- 3 (1- UR, 1- OBC_NCL of UP, 1- SC of UP)</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Eligibility Criteria</h2>
                                <p className='source-font heading-para'>⊙ Eligibility will be based on and in conformity with University Grants Commission (Minimum Standards and Procedures for the Award of Ph.D. Degree) Regulations, 2022 and No. F. 4-1 (UGC-NET Review Committee)/2024 (NET)/140648 dated 28th March 2024.</p>
                                <p className='source-font heading-para'>⊙ Candidates who have completed: a Master’s degree in Law or a professional degree declared equivalent to the Master’s degree in Law by the corresponding statutory regulatory body, with at least 55% marks in aggregate or its equivalent grade ‘B’ in the UGC 7-point scale (or an equivalent grade in a point scale wherever grading system is followed) or an equivalent degree from a foreign educational institution accredited by an Assessment and Accreditation Agency which is approved, recognized or authorized by an authority, established or incorporated under a law in its home country or any other statutory authority in that country for the purpose of assessing, accrediting, or assuring quality and standards of educational institutions.</p>
                                <p className='source-font heading-para'>⊙ A relaxation of 5% marks or its equivalent grade may be allowed for those belonging to SC/ST/OBC (non-creamy layer)/Differently-Abled, Economically Weaker Section (EWS) of Uttar Pradesh and other categories of candidates as per the decision of the Government of Uttar Pradesh from time to time.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Admission Process</h2>
                                <p className='source-font heading-para'>⊙ Candidates, who have qualified NET/JRF or qualified for admission to Ph.D. based on the UGC NET examination are eligible for the Ph.D. Admission as per the UGC Guidelines.</p>
                                <p className='source-font heading-para'>⊙ Those who are employed anywhere will submit No Objection Certificate (NOC) from their respective employer clearly mentioning that the Applicant/candidate will be granted/allowed leave for Ph.D. Course Work. Without such certificate, the application shall be rejected, and the fee shall not be refunded. Further if any candidate is found that the forged certificate has been submitted at any period before or after admission, his/her admission shall be cancelled at any time and penalised as well. The Candidates are advised not to call and embarrass on this issue before or after the admission process. The Ph.D. Course work is full-time program.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Duration of the Programme</h2>
                                <p className='source-font heading-para'>⊙ The University offers full time Ph.D. in Law.</p>
                                <p className='source-font heading-para'>⊙ Ph.D. Programme shall be for a minimum duration of three (3) years, including course work, and a maximum duration of six (6) years from the date of admission to the Ph.D. programme.</p>
                                <p className='source-font heading-para'>⊙ A maximum of an additional two (2) years can be given through a process of re-registration as per the Statute/Ordinance of the University; provided, however, that the total period for completion of a Ph.D. programme should not exceed eight (8) years from the date of admission in the Ph.D. programme. Provided further that, female Ph.D. scholars and Persons with Disabilities (having more than 40% disability) may be allowed an additional relaxation of two (2) years; however, the total period for completion of a Ph.D. programme in such cases should not exceed ten (10) years from the date of admission in the Ph.D. programme.</p>
                                <p className='source-font heading-para'>⊙ Female Ph.D. Scholars may be provided Maternity Leave/Child Care Leave for up to 240 days in the entire duration of the Ph.D. programme.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Duration of the Programme</h2>
                                <table className='table-custom'>
                                  <tr>
                                    <thead>
                                      <th>Sr. No</th>
                                      <th>Details</th>
                                      <th>Important Dates</th>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>1</td>
                                        <td>Starting of Downloading Application Form</td>
                                        <td>1st June 2025</td>
                                      </tr>
                                      <tr>
                                        <td>2</td>
                                        <td>Last date of Submission of Application form along with Synopsis</td>
                                        <td>30th June 2025</td>
                                      </tr>
                                      <tr>
                                        <td>3</td>
                                        <td>Announcement of Short-listed candidates</td>
                                        <td>15th July 2025</td>
                                      </tr>
                                      <tr>
                                        <td>4</td>
                                        <td>Date of Interview and Presentation</td>
                                        <td>1st August 2025</td>
                                      </tr>
                                      <tr>
                                        <td>5</td>
                                        <td>Starting of Downloading Application Form</td>
                                        <td>Academic Block, Dr. Rajendra Prasad National Law University, Prayagraj Gaddopur, Phaphamau, Prayagraj, UP- 211013</td>
                                      </tr>
                                    </tbody>
                                  </tr>
                                </table>
                                <p className='source-font heading-para'>Admission to Ph.D in Law is subject to verification of all relevant original documents at the time of interview/interaction.</p>
                                <p className='source-font heading-para'><strong>Contact us: </strong> Email: <a href='mailto: admission@rpnlup.ac.in'>admission@rpnlup.ac.in</a></p>
                                <p>Sd/- <br />Registrar</p>
                              </>
                            )
                          }
                          {/* {
                            id == 2 && (
                              <>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Overview of Ph.D. (Law) Program</h2>
                                <p className='heading-para'>
                                  Dr. Rajendra Prasad National Law University, Prayagraj, offers a prestigious Doctor of Philosophy (Ph.D.) program in Law, designed for legal scholars, academicians, and practitioners aiming to contribute to advanced legal research and scholarship. This program is ideal for those who wish to explore complex legal issues, develop new legal theories, and influence public policy through impactful research.
                                </p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Why Pursue Ph.D. (Law) at Dr. Rajendra Prasad National Law University?</h2>
                                <p className='heading-para'><strong>Research Excellence: </strong> Engage in high-quality research under the guidance of experienced faculty and legal experts.</p>
                                <p className='heading-para'><strong>Diverse Specializations:</strong>Explore various areas of law, including Constitutional Law, International Law, Criminal Law, Corporate Law, Human Rights, and Environmental Law.</p>
                                <p className='heading-para'><strong>Access to Resources: </strong> Utilize state-of-the-art research facilities, extensive law libraries, and access to legal databases.</p>
                                <p className='heading-para'><strong>Academic Recognition: </strong> Publish research papers in reputed national and international law journals and present findings at conferences.</p>
                                <p className='heading-para'><strong>Career Advancement:</strong> Establish a career in academia, legal research, public policy, or senior legal advisory roles in public and private sectors.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Specializations Offered</h2>
                                <p className='heading-para'>The Ph.D. (Law) program at Dr. Rajendra Prasad National Law University provides flexibility to pursue research in a variety of legal fields, including:</p>
                                <p className='heading-para'><strong>Constitutional Law and Governance</strong></p>
                                <p className='heading-para'><strong>Corporate and Commercial Law</strong></p>
                                <p className='heading-para'><strong>Criminal Law and Criminology</strong></p>
                                <p className='heading-para'><strong>International Law and Relations</strong></p>
                                <p className='heading-para'><strong>Human Rights Law</strong></p>
                                <p className='heading-para'><strong>Intellectual Property Law</strong></p>
                                <p className='heading-para'><strong>Environmental Law and Policy</strong></p>
                                <p className='heading-para'><strong>Cyber Law and Information Technology</strong></p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'><strong>Program Structure and Duration</strong> </h2>
                                <p className='heading-para'><strong>Coursework:</strong> The program begins with mandatory coursework to strengthen research methodology and legal theories.</p>

                                <p className='heading-para'><strong>Research Proposal and Registration:</strong> Scholars submit a detailed research proposal and undergo a rigorous review process.</p>
                                <p className='heading-para'><strong>Thesis Writing and Submission:</strong> Scholars engage in independent research under the guidance of a research supervisor and submit a thesis for evaluation.</p>
                                <p className='heading-para'><strong>Viva Voce Examination:</strong> The program culminates with a viva voce (oral defense) to evaluate the research findings.</p>
                                <p className='heading-para'><strong>Duration:</strong> The minimum duration is 3 years, and the maximum is 6 years.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Research Opportunities and Facilities</h2>
                                <p className='heading-para'> <strong>Access to Legal Databases: </strong>Scholars receive access to national and international legal databases, research papers, and journals.</p>
                                <p className='heading-para'> <strong>Workshops and Seminars:</strong> Participate in workshops, seminars, and conferences to enhance research skills and network with legal scholars.</p>
                                <p className='heading-para'> <strong> • Interdisciplinary Research:</strong> Collaborate with other academic departments and institutions for interdisciplinary research opportunities.</p>

                                <h2 className='heading-primary2 source-font id-font-weight-500'>Career Prospects After Ph.D. (Law)</h2>
                                <p className='heading-para'> Completing a Ph.D. (Law) from Dr. Rajendra Prasad National Law University opens up a world of opportunities, including:</p>
                                <p className='heading-para'> <strong>Academia and Teaching: </strong>Become a law professor, lecturer, or academic researcher in leading universities and law schools.</p>
                                <p className='heading-para'> <strong>Legal Research and Policy Making:</strong> Work as a legal researcher, policy advisor, or consultant in governmental and non-governmental organizations.</p>
                                <p className='heading-para'> <strong>Judiciary and Legal Practice: </strong>Pursue a career as a judge, legal consultant, or senior advocate.</p>
                                <p className='heading-para'> <strong>Corporate Sector: </strong>Take up roles as legal advisors, compliance officers, or legal strategists in corporate firms.</p>
                                <p className='heading-para'> <strong>International Organizations:</strong> Contribute as a legal expert or policy analyst in international organizations, such as the United Nations, World Bank, and international NGOs.</p>

                                <h2 className='heading-primary2 source-font id-font-weight-500'> Why Choose Dr. Rajendra Prasad National Law University?</h2>
                                <p className='heading-para'> <strong>Reputed Faculty and Mentorship:</strong> Learn from eminent legal scholars and experienced research supervisors.</p>
                                <p className='heading-para'> <strong>Dynamic Research Community:</strong> Engage with a vibrant research community of scholars, academics, and legal practitioners.</p>
                                <p className='heading-para'> <strong>Location and Infrastructure:</strong> Situated in the culturally rich city of Prayagraj, the university offers a conducive environment for legal research and academic growth.</p>
                                <h2 className='heading-primary2 source-font'>Conclusion</h2>
                                <p className='heading-para'>Pursue advanced legal research and make a meaningful contribution to the legal fraternity with a Ph.D. (Law) from Dr. Rajendra Prasad National Law University, Prayagraj. Develop your expertise, publish influential research, and become a leader in the field of law and justice.</p>
                                <h3 className='heading-para source-font'><strong>Enroll today and shape the future of legal education and policy!</strong></h3>
                              </>
                            )
                          } */}
                          {
                            id == 3 && (
                              <>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Overview of LL.M. Program</h2>
                                <p className='heading-para'>Dr. Rajendra Prasad National Law University, Prayagraj, offers a distinguished Master of Laws (LL.M.) program designed for legal professionals and graduates seeking advanced knowledge and expertise in specialized areas of law. This one-year postgraduate program provides an in-depth understanding of legal principles, research methodologies, and contemporary legal issues, preparing students for leadership roles in academia, judiciary, corporate sectors, and international organizations.</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Why Choose LL.M. at Dr. Rajendra Prasad National Law University?</h2>
                                <p className='heading-para'> <strong>Specialized Curriculum:</strong> Choose from a wide range of specializations, including LL.M. in PUBLIC LAW.</p>
                                <p className='heading-para'> <strong>Expert Faculty and Mentors:</strong> Learn from renowned legal scholars, experienced practitioners, and industry experts who provide practical insights and academic guidance.</p>
                                <p className='heading-para'> <strong>Research Opportunities:</strong> Engage in rigorous legal research, participate in national and international conferences, and publish papers in reputed legal journals.</p>
                                <p className='heading-para'> <strong>Interactive Learning Environment:</strong> Benefit from interactive lectures, case studies, moot courts, and workshops that enhance critical thinking and analytical skills.</p>
                                <p className='heading-para'> <strong>Career Support and Placement Assistance:</strong> The university offers dedicated career counseling and placement support, helping students pursue successful careers in academia, legal practice, corporate sectors, and public services.</p>

                                <h2 className='heading-primary2 source-font id-font-weight-500'>Eligibility Criteria & Admission Process</h2>
                                <p className='heading-para source-font'><strong>The admission shall be based on the performance in the Common Law
                                  Admission Test- Post Graduate (CLAT- PG)-2025 Examination.</strong></p>
                                <p className='heading-para source-font'>To qualify for admission, the candidates: Must have completed Graduation in Law
                                  (Either Three year or Five years Integrated Law, or an equivalent examination thereof,
                                  securing in aggregate not less than 50% of marks or its equivalent grade (45% marks or
                                  its equivalent grade in case of SC/ST/PwD candidates of U. P.).</p>
                                <p className='heading-para source-font'>The Candidates, who have appeared in the qualifying examination in April or May, 2025
                                  and are awaiting for their results, may also eligible for the admission which shall be
                                  subject to the fulfilment of the above requirement at the time of admission.</p>
                                <h3 className='heading-primary2 source-font id-font-weight-500'>Intake and Reservation:</h3>
                                <p className='heading-para source-font'>The intake of students for LL.M. in Public Law for the academic year 2025 -26 is 10 (Ten)
                                  seats with the following breakup:
                                </p>
                                <table className='table-custom'>
                                  <thead>
                                    <tr>
                                      <th>Sr. No</th>
                                      <th>Category</th>
                                      <th>No. Of Seats</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Unreserved</td>
                                      <td>4</td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>EWS*</td>
                                      <td>1</td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>OBC-NCL*</td>
                                      <td>3</td>
                                    </tr>
                                    <tr>
                                      <td>4</td>
                                      <td>Scheduled Caste*</td>
                                      <td>2</td>
                                    </tr>
                                    <tr>
                                      <th></th>
                                      <th>Total</th>
                                      <th>10</th>
                                    </tr>
                                  </tbody>
                                </table>
                                <p><strong>*Reservations are applicable to SC, OBC (NCL) and EWS of Uttar Pradesh Only.
                                </strong></p>
                                <table className='table-custom'>
                                  <thead>
                                    <tr>
                                      <th>Sr. No</th>
                                      <th>Category</th>
                                      <th>No. Of Seats</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Female</td>
                                      <td>20%</td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>PwD of UP*</td>
                                      <td>5%</td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>Dependent of Freedom Fighters of UP</td>
                                      <td>2%</td>
                                    </tr>
                                    <tr>
                                      <td>4</td>
                                      <td>Sons, Daughters of Defence Personnels deployed in UP either killed/retired/disabled in action</td>
                                      <td>5%</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p><strong>*Only the candidates having permanent disability certificate will consider for admission in
                                  the RPNLU, Prayagraj, under this category as per the decision in the writ petiotion no.
                                  3647/2024 Aakarsh Matta Vs Consortium of National Law Universities.

                                </strong></p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Course Structure:</h2>
                                <p className='heading-para source-font'>The one year LL.M. programme shall have 24 credits with three mandatory courses of 3
                                  credits each (making a total of nine credits), six optional courses of 2 credits each (making a
                                  total of 12 credits) and a dissertation of 3 credits. University may increase credits for
                                  dissertation up to 5 credits as per UGC norms.</p>
                                <p className='mb-1 heading-para source-font'><strong>A. Mandatory Papers (3 credits each)</strong></p>
                                <p className='ps-2 source-font'><span className='fw-bold'>1. Research Methodology (Semester I)</span> <br />
                                  <span className='fw-bold'>2. Comparative Public Law (Semester I)</span> <br />
                                  <span className='fw-bold'>3. Law and Justice in a Globalizing World (Semester I)</span></p>
                                <p className='mb-1 source-font'><strong>B. Optional Papers (2 credits each)</strong></p>
                                <p className='ps-2 source-font'>
                                  <span className='fw-bold'>1. Optional Paper 1 (Semester I)</span> <br />
                                  <span className='fw-bold'>2. Optional Paper 2 (Semester I)</span> <br />
                                  <span className='fw-bold'>3. Optional Paper 3 (Semester II)</span> <br />
                                  <span className='fw-bold'>4. Optional Paper 4 (Semester II)</span> <br />
                                  <span className='fw-bold'>5. Optional Paper 5 (Semester II)</span> <br />
                                  <span className='fw-bold'>6. Optional Paper 6 (Semester II)</span>
                                </p>
                                <p className='heading-para source-font'><strong>Note:</strong> Students are free to choose any six optional papers from the subjects which are
                                  offered by the University subject to the requirement of minimum number of students per
                                  paper</p>
                                <h2 className='heading-primary2 source-font id-font-weight-500'>Optional Papers:</h2>
                                <p className='heading-para source-font mb-1'>The following papers are being offered to students in: Semester I (The students may choose any
                                  two papers)
                                </p>
                                <p className='ps-2 source-font'>
                                  <span className='fw-bold'>1. Comparative Constitutional Law (Semester-I)</span> <br />
                                  <span className='fw-bold'>2. International Environmental Law & Policy (Semester-I)</span> <br />
                                  <span className='fw-bold'>3. Criminal Law & Contemporary Issues (Semester-I)</span> <br />
                                  <span className='fw-bold'>4. International Human Rights Law (Semester-I)</span>
                                  <span className='fw-bold'>5. Media Law</span>
                                </p>
                                <p className='heading-para source-font'><strong>Note:</strong> The above-mentioned lists of optional papers are not exhaustive and may include other
                                  public law papers as well. The paper will be offered subject to the requirement of minimum
                                  students as prescribed by the University and the availability of teachers in that paper.</p>
                                <p className='heading-para source-font mb-1'>Semester II (The students may choose any four papers)</p>
                                <p className='ps-2 source-font'>
                                  <span className='fw-bold'>1. Comparative Law (Semester-II)</span> <br />
                                  <span className='fw-bold'>2. Alternative Dispute Resolution (Semester-II)</span> <br />
                                  <span className='fw-bold'>3. Business and Human Rights (Semester-II)</span> <br />
                                  <span className='fw-bold'>4.Transportation Law (Semester-II)</span>
                                  <span className='fw-bold'>5. Constitutional Theory and Judicial Process (Semester-II)</span>
                                  <span className='fw-bold'>6. International Humanitarian Law (Semester-II)</span>
                                  <span className='fw-bold'>7. Gender Justice (Semester-II)</span>
                                  <span className='fw-bold'>8. Constitutional Claims and Contemporary Issues under Personal Laws (Semester II)</span>
                                  <span className='fw-bold'>9. Disability Law and Policy in India: Contemporary Issues and Challenges (Semester-II)</span>
                                </p>
                                <p className='heading-para source-font'>Note: The above-mentioned lists of optional papers are not exhaustive and may include other
                                  public law papers as well. The paper will be offered subject to the requirement of minimum
                                  students as prescribed by the University and the availability of teachers in that paper.
                                </p>
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
                    <div className="col-md-12">
                      <div className="heading-para gorditas-regular text-justify w-100" dangerouslySetInnerHTML={{ __html: validator.unescape(coursePage) }}></div>
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

            `
          }
        </style>
      </div >
    </>
  )
}

export default Courses;

