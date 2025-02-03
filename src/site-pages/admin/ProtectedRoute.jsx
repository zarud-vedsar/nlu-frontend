import React from "react";
import { Navigate } from "react-router-dom";
import IsAdminLoggedIn from "./IsAdminLoggedIn";

const ProtectedRoute = ({ element }) => {
    const isLoggedIn = IsAdminLoggedIn();
    if (!isLoggedIn) {
        return <Navigate to='/admin/' replace />
    }
    return element;
}
export default ProtectedRoute