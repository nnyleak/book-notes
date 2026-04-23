import { useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../auth";
import "./Nav.css";

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
          <button onClick={() => navigate("/")}>/home</button>
          {isLoggedIn() && (
            <button onClick={() => navigate("/add")}>/add</button>
          )}
        </div>

        <div className="nav-group">
          <p className="folder">/account</p>
          {!isLoggedIn() && (
            <button onClick={() => navigate("/login")}>/login</button>
          )}
          {isLoggedIn() && <button onClick={handleLogout}>/logout</button>}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
