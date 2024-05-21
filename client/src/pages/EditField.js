import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const EditField = () => {
  const { id } = useParams();
  const location = useLocation();
  const [field, setField] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  useEffect(() => {
    if (location.state?.field) {
      setField(location.state.field);
    } else {
      axios
        .get(`http://localhost:3001/fields/${id}`)
        .then((response) => {
          setField(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField((prevField) => ({
      ...prevField,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3001/fields/${id}`, field)
      .then((response) => {
        console.log("Field updated:", response.data);
        // Możesz przekierować użytkownika do innej strony po pomyślnym zapisie
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Edit Field</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={field.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Location:
          <input type="text" name="location" value={field.location} onChange={handleChange} />
        </label>
        <br />
        <label>
          Capacity:
          <input type="number" name="capacity" value={field.capacity} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditField;
