import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddField = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const navigateTo = useNavigate();
  const { id } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigateTo(`/${id}`);
    axios
      .post("http://localhost:3001/fields", {
        name,
        location,
        size,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mainWrapper">
      <h1 className="h1Header">Add Field</h1>
      <div className="wrapperInput">
        <input className="defaultInput" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name..." />
        <input className="defaultInput" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location..." />
        <input className="defaultInput" type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Size..." />
        <button type="submit" className="button">
          Add Field
        </button>
      </div>
    </form>
  );
};

export default AddField;
