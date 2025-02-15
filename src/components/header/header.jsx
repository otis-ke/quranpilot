import React from "react";
import "./header.css";
import logo from "../assets/Qp-logo.webp"; // Fixed import path

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        {/* Logo on the left */}
        <div className="logo">
          <img src={logo} alt="Qp Logo" />
        </div>

        {/* Navigation links on the right */}
      
      </div>
    </header>
  );
};

export default Header;
