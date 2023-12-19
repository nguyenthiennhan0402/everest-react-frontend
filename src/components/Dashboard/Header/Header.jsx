import { useNavigate } from "react-router-dom";
import "styles/Header/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    navigate("/");
  };
  return (
    <div className="header-container">
      <div></div>
      <div>LOGO</div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Header;
