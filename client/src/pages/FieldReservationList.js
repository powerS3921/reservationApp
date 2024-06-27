import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FieldReservationList = () => {
  const { id } = useParams();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/reservations")
      .then((response) => {
        const filteredReservations = response.data.filter((reservation) => reservation.UserId === parseInt(id, 10));
        setReservations(filteredReservations);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleEdit = (reservation) => {
    navigate(`/edit-reservation/${reservation.id}`, { state: { reservation } });
  };

  const handleDelete = (reservationId) => {
    axios
      .delete(`http://localhost:3001/reservations/${reservationId}`)
      .then(() => {
        setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
      })
      .catch((error) => console.error(error));
  };

  const formatDateTime = (dateTimeString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
    return new Date(dateTimeString).toLocaleString("en-US", options);
  };

  const isToday = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    return today.getFullYear() === targetDate.getFullYear() && today.getMonth() === targetDate.getMonth() && today.getDate() === targetDate.getDate();
  };

  return (
    <div className="mainWrapper">
      <h1 className="h1Header">Field Reservations</h1>
      <ul>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <li key={reservation.id}>
              <span>Field ID: {reservation.FieldId}</span>
              <span>Start: {formatDateTime(reservation.startDate)}</span>
              <span>End: {formatDateTime(reservation.endDate)}</span>
              <button onClick={() => handleEdit(reservation)} disabled={isToday(reservation.startDate)}>
                Edit
              </button>
              <button onClick={() => handleDelete(reservation.id)} disabled={isToday(reservation.startDate)}>
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>Nie masz żadnej rezerwacji, zarezerwuj sobie coś!</p>
        )}
      </ul>
    </div>
  );
};

export default FieldReservationList;
