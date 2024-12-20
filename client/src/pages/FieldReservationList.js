import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/FieldReservationList.sass";

const FieldReservationList = ({ showNav }) => {
  const [reservations, setReservations] = useState([]);
  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);
  const [filters, setFilters] = useState({
    city: "all",
    sport: "all",
    isPaid: "all",
    isActive: "all",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
    fetchSports();
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    axios
      .get("http://localhost:3001/reservations", { params: filters })
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  };

  const fetchCities = () => {
    axios
      .get("http://localhost:3001/api/cities")
      .then((response) => setCities(response.data))
      .catch((error) => console.error("Error fetching cities:", error));
  };

  const fetchSports = () => {
    axios
      .get("http://localhost:3001/api/sports")
      .then((response) => setSports(response.data))
      .catch((error) => console.error("Error fetching sports:", error));
  };

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

  const formatDateTime = (timeString) => {
    // Rozdziel ciąg "19:00:00" na części
    const [hours, minutes] = timeString.split(":");
    // Zwróć tylko godzinę i minuty
    return `${hours}:${minutes}`;
  };

  return (
    <div className="mainWrapper" style={showNav ? { marginTop: "0vh" } : { marginTop: "6vh" }}>
      <h1 className="h1Header">Field Reservations</h1>
      <div className="filters">
        <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <select value={filters.sport} onChange={(e) => setFilters({ ...filters, sport: e.target.value })}>
          <option value="all">All Sports</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
        <select value={filters.isPaid} onChange={(e) => setFilters({ ...filters, isPaid: e.target.value })}>
          <option value="all">All</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
        <select value={filters.isActive} onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}>
          <option value="all">All</option>
          <option value="true">Active</option>
          <option value="false">Historical</option>
        </select>
        <button onClick={fetchReservations}>Filter</button>
      </div>
      <ul className="reservationList">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <li key={reservation.id} className="reservationListItem">
              <span>Użytkownik: {reservation.User.username}</span>
              <span>Nazwa obiektu: {reservation.Field.sportsFacility.name}</span>
              <span>Ulica: {reservation.Field.sportsFacility.address}</span>
              <span>Miasto: {reservation.Field.sportsFacility.City.name}</span>
              <span>Sport: {reservation.Field.Sport.name}</span>
              <span>Data: {reservation.reservationDate}</span>
              <span>Godzina startu rezerwacji: {formatDateTime(reservation.startTime)}</span>
              <span>Godzina końca rezerwacji: {formatDateTime(reservation.endTime)}</span>
              <button onClick={() => handleEdit(reservation)}>Edit</button>
              <button onClick={() => handleDelete(reservation.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No reservations found.</p>
        )}
      </ul>
    </div>
  );
};

export default FieldReservationList;
