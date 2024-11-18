import React, { useState } from "react";
import axios from "axios";
import "../style/ResetPassword.sass";

const ResetPassword = ({ showNav }) => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!username || !oldPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    axios
      .put("http://localhost:3001/auth/changepassword", {
        username,
        oldPassword,
        newPassword,
      })
      .then((response) => {
        setSuccessMessage(response.data.message);
        setUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.error || "Error changing password.");
        } else {
          setErrorMessage("Error changing password.");
        }
      });
  };

  return (
    <div className="mainWrapperChangePassword" style={showNav ? { marginTop: "-6vh" } : { marginTop: "0vh" }}>
      <div className="changePasswordContainer">
        <h1 className="header">Change Password</h1>
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        {successMessage && <p className="successMessage">{successMessage}</p>}
        <div className="form">
          <label htmlFor="username">Username</label>
          <input className="defaultInput" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
          <label htmlFor="oldPassword">Old Password</label>
          <input
            className="defaultInput"
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your old password"
          />
          <label htmlFor="newPassword">New Password</label>
          <input
            className="defaultInput"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            className="defaultInput"
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm your new password"
          />
          <button onClick={handleChangePassword} className="button">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
