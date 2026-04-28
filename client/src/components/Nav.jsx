import { useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../auth";
import "./Nav.css";
import arrowIcon from "../assets/chevron-right-svgrepo-com.svg";
import NavButton from "./NavButton";

function Nav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="nav-container">
      <nav className="sidebar">
        <h1 className="logo">kae/archive</h1>

        <div className="nav-group">
          <p className="folder">/archive</p>
          <NavButton navTo={"/"} text={"/home"} />
          {isLoggedIn() && <NavButton navTo={"/add"} text={"/add"} />}
        </div>

        <div className="nav-group">
          <p className="folder">/account</p>
          {isLoggedIn() && <NavButton navTo={"/logout"} text={"/logout"} />}
          {!isLoggedIn() && <NavButton navTo={"/login"} text={"/login"} />}
        </div>
      </nav>
      <div>
        <p className="footer">
          created by{" "}
          <a id="nnyleak" href="https://nnyleak.netlify.app" target="_blank">
            nnyleak
          </a>
          <br></br>© 2026
        </p>
      </div>
    </div>
  );
}

export default Nav;
