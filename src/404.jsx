import bg404 from './404bg.png';
import './404.css';
import { Link } from 'react-router-dom';
function NotFoundPage() {
  return (
    <div className='wrapper-404'>
      <img src={bg404} alt="Error 404" />
      <div className="content-wrap">
        <h1>Nothing to see here</h1>
        <p>
          The page you are trying to open does not exist. You may have mistyped the address, <br /> or the page has been moved to another URL. If you think this is an error, contact support.
        </p>
        <Link to={'/'}><button type='button'>Take me back to the home page</button></Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
