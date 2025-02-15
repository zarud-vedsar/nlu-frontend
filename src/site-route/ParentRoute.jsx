import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Make sure to install react-toastify
import "react-toastify/dist/ReactToastify.css";
import "../site-components/admin/assets/css/App.min.css";
import "../site-components/admin/assets/css/Custom.css";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling
import SuspensionLoader from '../SuspensionLoader.jsx';
const Signin = lazy(() => import('../site-pages/parent/Signin.jsx'));
function ParentRoute() {
  return (
    <Suspense fallback={<SuspensionLoader />}>
      <ToastContainer
        autoClose={5000}
        position='top-right'
        hideProgressBar={false}
        draggable
        pauseOnHover
        closeOnClick
      />
      <Routes>
        <Route path="/" element={<Navigate to="/parent/signin" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="*" element={<Navigate to="/page-not-found" />} />
      </Routes>
    </Suspense>
  );
}

export default ParentRoute;