import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import ReactRecorder from "../../components/ReactRecorder";
import logo from '../../components/assets/Qp-logo.webp'

function Userdash() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userInitial = userData?.firstName?.charAt(0).toUpperCase() || "?";

  // Move logoutUser above useEffect and wrap it with useCallback
  const logoutUser = useCallback(() => {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("userData");
    navigate("/login", { state: { message: "You have been logged out" } });
  }, [navigate]);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        logoutUser();
      } else {
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    window.addEventListener("popstate", handleBackButton);
    window.history.pushState(null, null, window.location.pathname);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [logoutUser]); // Now logoutUser is stable

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        {/* Left: Profile Circle */}
        <div className="profile-circle" onClick={() => setMenuOpen(!menuOpen)}>
          {userInitial}
        </div>

        {/* Right: Logo (Click to Go Home) */}
        <img
         src={logo}
          alt="Logo"
          className="dashboard-logo"
          onClick={() => navigate("/")}
        />

        {/* Profile Dropdown Menu */}
        {menuOpen && (
          <div className="profile-menu">
            <button className="close-menu" onClick={() => setMenuOpen(false)}>×</button>
            <p className="user-name">{userData?.firstName} {userData?.lastName}</p>
            <p className="user-email">{userData?.email}</p>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        )}
      </header>

      {/* Greeting */}
      <h2 className="greeting">{greeting}, {userData?.firstName}!</h2>

      {/* Courses Section */}
      <div className="courses-container">
        <div className="course-card">
          
          <h3>Basic Quran Reading</h3>
          <p>Learn to read the Quran with correct pronunciation.</p>
        </div>

        <div className="course-card">
         
          <h3>Tajweed Course</h3>
          <p>Enhance your Quran recitation with proper Tajweed rules.</p>
        </div>

        <div className="course-card">
        
          <h3>Quran Memorization</h3>
          <p>Start your journey to memorizing the Quran with expert guidance.</p>
        </div>
      </div>
      <ReactRecorder />
      {/* Footer */}
    
    </div>
  );
}

export default Userdash;
