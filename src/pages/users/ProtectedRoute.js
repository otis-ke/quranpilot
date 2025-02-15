import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("loggedInUserId");
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
