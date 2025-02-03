import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
const SettingSideBar = () => {
  const { '*' : id } = useParams();
  console.log(id);
  return (
    <>
    <ul className="nav flex-column bg-white mb-0 py-3">
      <li className={`nav-item ${id=='brand-setting'?'mark':''}`}>
        <Link to="/admin/brand-setting" className="nav-link text-dark ">
          Brand Setting
        </Link>
      </li>
      <li className={`nav-item ${id=='email-setting'?'mark':''}`}>
        <Link to="/admin/email-setting"  className="nav-link text-dark ">
          Email Setting
        </Link>
      </li>
      {/* <li className={`nav-item ${id=='seo-setting'?'mark':''}`}>
        <Link to="/admin/seo-setting"  className="nav-link text-dark ">
          SEO Setting
        </Link>
      </li> */}
      <li className={`nav-item ${id=='contact-setting'?'mark':''}`}>
        <Link to="/admin/contact-setting"  className="nav-link text-dark ">
          Contact Setting
        </Link>
      </li>
      <li className={`nav-item ${id=='social-media-setting'?'mark':''}`}>
        <Link to="/admin/social-media-setting"  className="nav-link text-dark ">
          Social Media
        </Link>
      </li>
      <li className={`nav-item ${id=='contact-icon-setting'?'mark':''}`}>
        <Link to="/admin/contact-icon-setting"  className="nav-link text-dark ">
          Contact Icon
        </Link>
      </li>
    </ul>

        <style jsx>{
`.mark{
background: #bbefff;
}`
}</style>
    </>
  );
};

export default SettingSideBar;
