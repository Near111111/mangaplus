import React from "react";
import "../styles/Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <img src="/manwha_icon.png" alt="Manga" className="logo-icon" />
            <span className="logo-text">MANGA</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
