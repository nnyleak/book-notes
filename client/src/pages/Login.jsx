import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import arrowIcon from "../assets/chevron-right-svgrepo-com.svg";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert("login failed");
    }
  };

  return (
    <form className="login-page" onSubmit={handleLogin}>
      <h1>kae/archive</h1>
      <p>sign in to continue --</p>

      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">
        <img src={arrowIcon} alt="arrow icon" className="icon" />
        login
      </button>
    </form>
  );
}

export default Login;
