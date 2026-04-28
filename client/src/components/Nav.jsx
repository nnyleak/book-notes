import { useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../auth";
import "./Nav.css";
import arrowIcon from "../assets/chevron-right-svgrepo-com.svg";

function Nav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <nav className="sidebar">
        <h1 className="logo">kae/archive</h1>

        <div className="nav-group">
          <p className="folder">/archive</p>
          <button onClick={() => navigate("/")}>
            <img className="icon" src={arrowIcon} alt="arrow icon" />
            /home
          </button>
          {isLoggedIn() && (
            <button onClick={() => navigate("/add")}>
              <img className="icon" src={arrowIcon} alt="arrow icon" />
              /add
            </button>
          )}
        </div>

        <div className="nav-group">
          <p className="folder">/account</p>
          {!isLoggedIn() && (
            <button onClick={() => navigate("/login")}>
              <img className="icon" src={arrowIcon} alt="arrow icon" />
              /login
              </button>
          )}
          {isLoggedIn() && (
            <button onClick={handleLogout}>
              <img className="icon" src={arrowIcon} alt="arrow icon" />
              /logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
