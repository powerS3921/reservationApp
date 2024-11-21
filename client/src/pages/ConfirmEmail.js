import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../style/ConfirmEmail.sass";

const ConfirmEmail = ({ showNav }) => {
  const { token } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/confirm-email/${token}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response?.data?.error || "An error occurred.");
      }
    };

    confirmAccount();
  }, [token]);

  return (
    <div className="mainWrapperConfirmEmail" style={showNav ? { marginTop: "-6vh" } : { marginTop: "0vh" }}>
      <div className="confirmEmailContainer">
        <h1 className="confirmTitle">Potwierdzenie E-maila</h1>
        <p className="confirmMessage">E-mail został potwierdzony.</p>
        <Link to="/login" className="loginLink">
          Przejdź do logowania
        </Link>
      </div>
    </div>
  );
};

export default ConfirmEmail;
