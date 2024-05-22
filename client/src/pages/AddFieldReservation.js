import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddFieldReservation = () => {
  const { id } = useParams();
  const [fieldId, setFieldId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [fields, setFields] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/fields")
      .then((response) => {
        setFields(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigateTo(`/${id}`);
    axios
      .post("http://localhost:3001/reservations", {
        fieldId,
        userId: id,
        startTime,
        endTime,
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
      <h1 className="h1Header">Add Field Reservation</h1>
      <div className="wrapperInput">
        <label>Field:</label>
        <select className="defaultInput" value={fieldId} onChange={(e) => setFieldId(e.target.value)}>
          <option value="">Select a field</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
        </select>
        <label>Start Time:</label>
        <input className="defaultInput" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <label>End Time:</label>
        <input className="defaultInput" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <button type="submit" className="button">
          Add Reservation
        </button>
      </div>
    </form>
  );
};

export default AddFieldReservation;
