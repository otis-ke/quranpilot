import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiDollarSign, FiUser, FiBell, FiMenu, FiLogOut } from "react-icons/fi";
import "./dash.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    setUserData(storedUserData);
  }, []);

  // Redirect to overview if no specific dashboard sub-route is provided
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/overview");
    }
  }, [location.pathname, navigate]);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("userData");
    navigate("/Adminlogin", { state: { message: "You have been logged out" } });
  }, [navigate]);

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="header">
        <button className="toggle-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FiMenu size={24} />
        </button>
        <h1 className="header-title">
          {location.pathname === "/dashboard/overview" && "Overview"}
          {location.pathname === "/dashboard/messages" && "Messages"}
          {location.pathname === "/dashboard/payments" && "Payments"}
          {location.pathname === "/dashboard/students" && "Students"}
          {location.pathname === "/dashboard/notifications" && "Notifications"}
        </h1>
      </div>

      {/* Sidebar */}
      <div className={`side-menu ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="user-profile">
          <div className="profile-circle">{userData?.firstName?.charAt(0).toUpperCase() || "U"}</div>
          <p className="user-name">{userData?.firstName} {userData?.lastName}</p>
          <p className="user-email">{userData?.email}</p>
        </div>

        <ul>
          <li
            onClick={() => navigate("/dashboard/overview")}
            className={location.pathname === "/dashboard/overview" ? "menu-item-active" : ""}
          >
            <FiHome size={20} /> Overview
          </li>
          <li
            onClick={() => navigate("/dashboard/messages")}
            className={location.pathname === "/dashboard/messages" ? "menu-item-active" : ""}
          >
            <FiHome size={20} /> Messages
          </li>
          <li
            onClick={() => navigate("/dashboard/payments")}
            className={location.pathname === "/dashboard/payments" ? "menu-item-active" : ""}
          >
            <FiDollarSign size={20} /> Payments
          </li>
          <li
            onClick={() => navigate("/dashboard/students")}
            className={location.pathname === "/dashboard/students" ? "menu-item-active" : ""}
          >
            <FiUser size={20} /> Students
          </li>
          <li
            onClick={() => navigate("/dashboard/notifications")}
            className={location.pathname === "/dashboard/notifications" ? "menu-item-active" : ""}
          >
            <FiBell size={20} /> Account
          </li>
        </ul>

        <button className="logout-btn" onClick={logoutUser}>
          <FiLogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content (Child Routes will be displayed here) */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
