import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt, FaBook, FaHome } from "react-icons/fa";
import "./user.css";
import ReactRecorder from "../../components/ReactRecorder";
import logo from "../../components/assets/Qp-logo.webp";

function UserDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userInitial = userData?.firstName?.charAt(0).toUpperCase() || "?";

  const logoutUser = useCallback(() => {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("userData");
    navigate("/login", { state: { message: "You have been logged out" } });
  }, [navigate]);

  useEffect(() => {
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
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          <FaTimes />
        </button>
        <div className="sidebar-profile">
          <div className="profile-circle">{userInitial}</div>
          <p>{userData?.firstName} {userData?.lastName}</p>
          <p className="email">{userData?.email}</p>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/")}> <FaHome /> Home</button>
          <button> <FaBook /> Courses</button>
        </nav>
        <button className="logout-btn" onClick={logoutUser}><FaSignOutAlt /> Logout</button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <img src={logo} alt="Logo" className="dashboard-logo" onClick={() => navigate("/")} />
        </header>

        <h2 className="dashboard-greeting">{greeting}, {userData?.firstName}!</h2>

        <div className="courses-container">
          <div className="course-card"><h3>Basic Quran Reading</h3><p>Learn proper pronunciation.</p></div>
          <div className="course-card"><h3>Tajweed Course</h3><p>Master Tajweed rules.</p></div>
          <div className="course-card"><h3>Quran Memorization</h3><p>Start your journey to memorization.</p></div>
        </div>

        <br></br><br></br>
        <ReactRecorder />
      </main>
    </div>
  );
}

export default UserDashboard;
