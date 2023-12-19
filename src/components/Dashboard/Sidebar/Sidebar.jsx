import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "styles/Sidebar/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const pageMappings = {
    "/dashboard": { label: "Dashboard", icon: "fas fa-chart-bar" },
    "/campaign": { label: "Campaign", icon: "fas fa-bullhorn" },
    "/account": { label: "Account", icon: "fas fa-user" },
  };
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className={`dashboard_left ${isMenuOpen ? "" : "slide-out"}`}>
      <button className="toggle-button" onClick={toggleMenu}>
        <i className={`fas ${isMenuOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
        <p className="toggle-button__name">Toggle sidebar</p>
      </button>
      <div className="left-item__user-info">
        <div className="info-img"></div>
        <div className="info-name">{window.localStorage.getItem("username")}</div>
      </div>
      {Object.keys(pageMappings).map((path) => (
        <Link to={path} key={path} className={`left-item ${location.pathname === path ? "active" : ""}`}>
          <i className={pageMappings[path].icon}></i>
          <p className="info-name">{pageMappings[path].label}</p>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
