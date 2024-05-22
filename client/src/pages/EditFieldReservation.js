import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditFieldReservation = () => {
  const { state } = useLocation();
  const { reservation } = state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  // Funkcja do formatowania daty
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Formatowanie do "rrrr-mm-ddTHH:MM"
  };

  // Stan komponentu
  const [fieldId, setFieldId] = useState(reservation?.FieldId || "");
  const [startTime, setStartTime] = useState(formatDate(reservation?.startDate) || "");
  const [endTime, setEndTime] = useState(formatDate(reservation?.endDate) || "");
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (reservation) {
      setFieldId(reservation.FieldId);
      setStartTime(formatDate(reservation.startDate));
      setEndTime(formatDate(reservation.endDate));
    }
  }, [reservation]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/fields")
      .then((response) => {
        setFields(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // Obsługa wysłania formularza
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:3001/reservations/${id}`, {
        FieldId: fieldId,
        userId: reservation.userId,
        startDate: startTime,
        endDate: endTime,
      })
      .then(() => {
        navigate(`/${reservation.UserId}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mainWrapper">
      <h1 className="h1Header">Edit Field Reservation</h1>
      <div className="wrapperInput">
        <label>Field</label>
        <select className="defaultInput" value={fieldId} onChange={(e) => setFieldId(e.target.value)}>
          <option value="">Select a field</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
        </select>

        <label>Start Time</label>
        <input className="defaultInput" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

        <label>End Time</label>
        <input className="defaultInput" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <button type="submit" className="button">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditFieldReservation;
