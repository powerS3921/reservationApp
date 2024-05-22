import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const navigateTo = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({ username: response.data.username, id: response.data.id, status: true });
        navigateTo(`/${response.data.id}`);
      }
    });
  };
  return (
    <div className="mainWrapper mainWrapperLogin">
      <div className="wrapperInput">
        <input
          className="defaultInput"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          id="inputLogin"
          name="login"
          placeholder="Login..."
        />
        <input
          className="defaultInput"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          id="inputPassword"
          name="password"
          placeholder="Password..."
        />
        <Link to="/resetpassword" className="link">
          Forgot password?
        </Link>
        <button onClick={login} className="button">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
