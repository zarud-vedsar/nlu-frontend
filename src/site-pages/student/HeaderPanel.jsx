import { Link } from "react-router-dom";
import "./Index.css";
import "./assets/TempNavbar.css";

function HeaderPanel() {
  return (
    <div className="row header-top py-2 align-items-center custon-navbar opacity-0 alingItem">
      <div className="col-md-7 col-12 col-sm-12 text-start d-flex align-self-end">
        <div className="d-flex justify-content-center align-items-center logo-container">
          <img
            src="https://www.rpnlup.ac.in/wp-content/themes/rpnlup/assets/img/rpnlup_logo_glow.png"
            alt="logo"
            className="img-fluid logo-img"
          />
        </div>
        <div className="text-start fs-3 align-self-center justify-content-start">
          <p className="university-name">
            Dr. Rajendra Prasad National Law University
          </p>
          <p className="university-address">
            Gaddopur, Phaphamau, Prayagraj, Uttar Pradesh 211013
          </p>
        </div>
      </div>

      <div className="col-md-5 text-right d-flex justify-content-end hide-in-mobile navigation-links">
        <div className="row" />
    
        <div>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </div>
        <div>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </div>
        <div>
          <Link to="/feedback" className="nav-link">
            Feedback
          </Link>
        </div>
        <div>
          <Link to="/contact-us" className="nav-link">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeaderPanel;