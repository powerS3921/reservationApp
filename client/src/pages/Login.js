import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import "../style/Login.sass";

const Login = ({ showNav }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const navigateTo = useNavigate();

  const login = () => {
    const data = { username, password };
    axios
      .post("http://localhost:3001/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({ username: response.data.username, id: response.data.id, status: true });
          navigateTo("/");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Wystąpił błąd. Jeśli nie zaaktywowałeś swojego konta, zrób to!");
      });
  };

  return (
    <div className="mainWrapperLogin" style={showNav ? { marginTop: "-6vh" } : { marginTop: "0vh" }}>
      <div className="loginContainer">
        <h1 className="loginTitle">GameGalaxy</h1>
        <p className="loginSubtitle">Welcome back! Please log in to continue.</p>
        <div className="wrapperInput">
          <input className="defaultInput" onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input className="defaultInput" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <Link to="/resetpassword" className="forgotPassword">
            Forgot password?
          </Link>
          <button onClick={login} className="button">
            Login
          </button>
        </div>
        <p className="registerPrompt">
          Don't have an account?{" "}
          <Link to="/register" className="registerLink">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
