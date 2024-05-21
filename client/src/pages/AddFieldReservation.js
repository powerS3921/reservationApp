import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AddFieldReservation = () => {
  const { id } = useParams();
  const [fieldId, setFieldId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
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
    <form onSubmit={handleSubmit}>
      <h1>Add Field Reservation</h1>
      <label>
        Field ID:
        <input type="text" value={fieldId} onChange={(e) => setFieldId(e.target.value)} />
      </label>
      <label>
        Start Time:
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </label>
      <label>
        End Time:
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </label>
      <button type="submit">Add Reservation</button>
    </form>
  );
};

export default AddFieldReservation;
