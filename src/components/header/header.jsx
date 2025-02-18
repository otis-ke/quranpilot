import React, { useState, useEffect } from "react";
import logo from "../assets/Qp-logo.webp";

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: isMobile ? "center" : "space-between",
    zIndex: 1000,
  };

  const logoStyle = {
    height: "50px",
  };

  return (
    <>
      <header style={headerStyle}>
        <div>
          <img src={logo} alt="Qp Logo" style={logoStyle} />
        </div>
      </header>
      {/* Spacer div to prevent content from being hidden under the fixed header */}
      <div style={{ paddingTop: "70px" }}></div>
    </>
  );
};

export default Header;
