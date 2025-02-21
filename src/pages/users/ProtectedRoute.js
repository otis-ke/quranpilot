import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("userData");

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("userData"); // Clear data for security
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
