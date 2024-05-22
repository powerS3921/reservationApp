import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = () => {
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
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then((response) => {
        setSuccessMessage(response.data.message);
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("Error changing password.");
        }
      });
  };

  return (
    <div className="mainWrapper mainWrapperLogin">
      <h2 className="h1Header">Change Password</h2>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      {successMessage && <p className="successMessage">{successMessage}</p>}
      <div className="wrapperInput">
        <label htmlFor="username">Username: </label>
        <input className="defaultInput" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="oldPassword">Old Password: </label>
        <input className="defaultInput" type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        <label htmlFor="newPassword">New Password: </label>
        <input className="defaultInput" type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <label htmlFor="confirmNewPassword">Confirm New Password: </label>
        <input className="defaultInput" type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
        <button onClick={handleChangePassword} className="button">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
