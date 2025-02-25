import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Make sure to install react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling
import '../site-components/website/assets/css/bootstrap.min.css';//Bootstrap CSS
import '../site-components/website/assets/css/color-switcher.css';//Color Swithcer CSS
import '../site-components/website/assets/css/font-awesome.min.css';//Fontawsome CSS
import '../site-components/website/assets/css/owl.carousel.css';//Owl Carousel CSS
import '../site-components/website/assets/css/jquery-ui.css';// jquery-ui CSS
import '../site-components/website/assets/css/animated-headlines.css';//Animated Headlines CSS
import '../site-components/website/assets/css/nivo-slider/css/nivo-slider.css';//  Nivo slider CSS
import '../site-components/website/assets/css/nivo-slider/css/preview.css';// -----------
import '../site-components/website/assets/css/material-design-iconic-font.css'; //Metarial Iconic Font CSS
import '../site-components/website/assets/css/material-design-iconic-font.min.css';
import '../site-components/website/assets/css/slick.css';//Slick CSS
import '../site-components/website/assets/css/jquery.mb.YTPlayer.css';//Video CSS
import '../site-components/website/assets/css/style.css';// style css
import '../site-components/website/assets/css/color.css';//Color CSS
import '../site-components/website/assets/css/responsive9dd4.css';//Responsive CSS
import '../site-components/website/assets/css/vertical-news-ticker/css/vertical.news.slider.css';
import '../site-components/website/assets/css/dynamics/BreakingNews/breaking-news-ticker.css';
import '../site-components/website/assets/css/dynamics/Wowslider/engine1/style9001.css';
import '../site-components/website/assets/css/dynamics/Wowslider/engine1/jquery.js';
import '../site-components/website/assets/css/dynamics/LatestNews/css/site.css';
import '../site-components/website/assets/css/dynamics/Flyer/DDS_FlyerStyle.css';
import '../site-components/website/assets/css/Custom9dd4.css';
import '../site-components/website/assets/css/Custom.css';
import '../site-components/website/assets/css/magnific-popup.css';
import '../site-components/website/assets/css/dynamics/ImageZoom/style.css';
import '../site-components/website/assets/css/dynamics/SideBar.css';
import '../site-components/website/assets/css/dynamics/Left_Menu/Style_Css.css';
import '../site-components/website/assets/css/dynamics/LatestNews/css/site.css';
import '../site-components/website/assets/css/dynamics/dds_News.css';

const KeyNote = lazy(() => import('../site-components/website/home-components/KeyNote.jsx'));
const Home = lazy(() => import('../site-pages/website/Home'));
const EqualOpportunityCell = lazy(() => import('../site-pages/website/EqualOpportunityCell'));
const AcademicCalendar = lazy(() => import('../site-pages/website/AcademicCalendar'));
const Header = lazy(() => import('../site-components/website/common/Header'));
const SideChipkaHuaTag = lazy(() => import('../site-components/website/common/SideChipkaHuaTag'));
const Footer = lazy(() => import('../site-components/website/common/Footer'));
const About = lazy(() => import('../site-pages/website/About'));
const VisionMission = lazy(() => import('../site-pages/website/VisionMission.jsx'));
const EmblemMotto = lazy(() => import('../site-pages/website/EmblemMotto'));
const Chairperson = lazy(() => import('../site-pages/website/Chairperson.jsx'));
const AllNotice = lazy(() => import('../site-pages/website/AllNotice'));
const NoticeDetails = lazy(() => import('../site-pages/website/NoticeDetails'));
const AllEvent = lazy(() => import('../site-pages/website/AllEvent'));
const EventDetails = lazy(() => import('../site-pages/website/EventDetails'));
const AllPublication = lazy(() => import('../site-pages/website/AllPublication'));
const PublicationDetials = lazy(() => import('../site-pages/website/PublicationDetials'));
const ContactUs = lazy(() => import('../site-pages/website/ContactUs'));
const Feedback = lazy(() => import('../site-pages/website/Feedback'));
const Grievance = lazy(() => import('../site-pages/website/Grievence'));
const Faculty = lazy(() => import('../site-pages/website/Faculty'));
const CopyRightPolicy = lazy(() => import('../site-pages/website/CopyRightPolicy'));
const TermOfUse = lazy(() => import('../site-pages/website/TermOfUse'));
const PrivacyPolicy = lazy(() => import('../site-pages/website/PrivacyPolicy'));
const AntiRaggingPolicy = lazy(() => import('../site-pages/website/AntiRaggingPolicy'));
const TermCondition = lazy(() => import('../site-pages/website/TermCondition'));
const DetailSpeciality = lazy(() => import('../site-pages/website/DetailSpeciality'));
const DetailFaculty = lazy(() => import('../site-pages/website/DetailFaculty'));
const Scholarship = lazy(() => import('../site-pages/website/Scholarship'));
const PlacementViewpage = lazy(() => import('../site-pages/website/PlacementViewpage'));
const Courses = lazy(() => import('../site-pages/website/courses/Courses.jsx'));
const Page = lazy(() => import('../site-pages/website/Page.jsx'));
const Career = lazy(() => import('../site-pages/website/Career/Career.jsx'));
const Job = lazy(() => import('../site-pages/website/Career/Job.jsx'));
const InternshipDetail = lazy(() => import('../site-pages/website/StudentCorner/Internship/InternshipDetail.jsx'));
const PlacementDetail = lazy(() => import('../site-pages/website/StudentCorner/Placement/PlacementDetail.jsx'));
const ApplicationForm = lazy(() => import('../site-pages/website/Career/ApplicationForm.jsx'));
const InternshipForm = lazy(() => import('../site-pages/website/StudentCorner/Internship/InternshipForm.jsx'));
const JobDetailForm = lazy(() => import('../site-pages/website/Career/JobDetailForm.jsx'));
const VideoGallery = lazy(() => import('../site-pages/website/VideoGallery.jsx'));
const ImageGallery = lazy(() => import('../site-pages/website/ImageGallery'));
const ImageGalleryViewAll = lazy(() => import('../site-pages/website/ImageGalleryViewAll'));
const ViewAllGalleryVideo = lazy(() => import('../site-pages/website/ViewAllGalleryVideo.jsx'));
const AboutDrRajendraPrasad = lazy(() => import('../site-pages/website/AboutDrRajendraPrasad.jsx'))
const MessageViceChancellor = lazy(() => import('../site-pages/website/MessageViceChancellor.jsx'))
import SuspensionLoader from '../SuspensionLoader.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import ViewInterviewVc from '../site-pages/website/ViewInterviewVc.jsx';
import LegalExcellence from '../site-pages/website/LegalExcellence.jsx';

function WebsiteRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SuspensionLoader />}>
        <Header />
        <SideChipkaHuaTag />
        <ToastContainer
          autoClose={5000}
          position='top-right'
          hideProgressBar={false}
          draggable
          pauseOnHover
          closeOnClick
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/dr-rajendra-prasad' element={<AboutDrRajendraPrasad />} />
          <Route path='/vision-mission' element={<VisionMission />} />
          <Route path='/emblem-motto' element={<EmblemMotto />} />
          <Route path='/message/:id' element={<Chairperson />} />
          <Route path='/chairperson' element={<Chairperson />} />
          <Route path='/speciality/:id' element={<DetailSpeciality />} />
          <Route path='/faculty/:id' element={<DetailFaculty />} />
          <Route path='/page/:cid/:slug' element={<Page />} />
          <Route path='/video-gallery' element={<VideoGallery />} />
          <Route path='/image-gallery' element={<ImageGallery />} />
          <Route path='/image-view-all/:id' element={<ImageGalleryViewAll />} />
          <Route path='/viewall-videogallery/:id' element={<ViewAllGalleryVideo />} />
          <Route path='/courses/:id' element={<Courses />} />
          <Route path='/view-all/:id' element={<AllNotice />} />
          <Route path='/notice-details/:id' element={<NoticeDetails />} />
          <Route path='/all-event' element={<AllEvent />} />
          <Route path='/event-details' element={<EventDetails />} />
          <Route path='/message-vice-chancellor' element={<MessageViceChancellor />} />
          
          <Route path='/all-publication' element={<AllPublication />} />
          <Route path='/publication-details' element={<PublicationDetials />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/grievance' element={<Grievance />} />
          <Route path='/faculty' element={<Faculty />} />
          <Route path='/copyright-policy' element={<CopyRightPolicy />} />
          <Route path='/termof-use' element={<TermOfUse />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/term-condition' element={<TermCondition />} />
          <Route path='/anti-ragging-policy' element={<AntiRaggingPolicy />} />
          <Route path='/placement/job/:id' element={<PlacementDetail />} />
          <Route path='/placement/:id' element={<PlacementViewpage />} />
          <Route path='/internship/:id' element={<InternshipDetail />} />
          <Route path='/internship/apply/:id' element={<InternshipForm />} />
          <Route path='/scholarship' element={<Scholarship />} />
          <Route path='/career' element={<Career />} />
          <Route path='/placement' element={<Navigate to="../student" />} />
          <Route path='/internship' element={<Navigate to="../student" />} />
          <Route path='/job/:id' element={<Job />} />
          <Route path='/job/verify/:id' element={<ApplicationForm />} />
          <Route path='/job/apply/:id' element={<JobDetailForm />} />
          <Route path='/marquee/:mrId' element={<KeyNote />} />
          <Route path='/equal-opportunity-cell' element={<EqualOpportunityCell />} />
          <Route path='/academic-calendar' element={<AcademicCalendar />} />
          <Route path='/view-interview-vc' element={<ViewInterviewVc />} />
          <Route path='/legal-excellence' element={<LegalExcellence />} />
          <Route path="*" element={<Navigate to="/page-not-found" />} />
        </Routes>
        <Footer />
      </Suspense>
    </ErrorBoundary>

  );
}

export default WebsiteRoute;