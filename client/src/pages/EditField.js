import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EditField = () => {
  const { id, userId } = useParams();
  const location = useLocation();
  const [field, setField] = useState({
    name: "",
    location: "",
    capacity: "",
  });
  const navigateTo = useNavigate();

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
    navigateTo(`/${userId}`);
    axios
      .put(`http://localhost:3001/fields/${id}`, field)
      .then((response) => {
        console.log("Field updated:", response.data);
        // Możesz przekierować użytkownika do innej strony po pomyślnym zapisie
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="mainWrapper">
      <h1 className="h1Header">Edit Field</h1>
      <form onSubmit={handleSubmit} className="wrapperInput">
        <input className="defaultInput" type="text" name="name" value={field.name} onChange={handleChange} placeholder="Name..." />

        <input className="defaultInput" type="text" name="location" value={field.location} onChange={handleChange} placeholder="Location..." />
        <input className="defaultInput" type="number" name="capacity" value={field.capacity} onChange={handleChange} placeholder="Size..." />

        <button type="submit" className="button">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditField;
