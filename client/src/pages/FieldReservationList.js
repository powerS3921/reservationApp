import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FieldReservationList = () => {
  const { id } = useParams();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/reservations")
      .then((response) => {
        const filteredReservations = response.data.filter((reservation) => reservation.UserId === parseInt(id, 10));
        setReservations(filteredReservations);
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <div>
      <h1>Field Reservations</h1>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            Field ID: {reservation.FieldId}, User ID: {reservation.UserId}, Start: {reservation.startDate}, End: {reservation.endDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldReservationList;
