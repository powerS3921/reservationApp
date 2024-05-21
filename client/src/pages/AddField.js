import React, { useState } from "react";
import axios from "axios";

const AddField = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
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
    <form onSubmit={handleSubmit}>
      <h1>Add Field</h1>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Location:
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>
      <label>
        Size:
        <input type="text" value={size} onChange={(e) => setSize(e.target.value)} />
      </label>
      <button type="submit">Add Field</button>
    </form>
  );
};

export default AddField;
