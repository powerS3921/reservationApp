import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style/EditFieldReservation.sass";

const EditFieldReservation = ({ showNav }) => {
  const { state } = useLocation();
  const { reservation } = state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservationDate, setReservationDate] = useState(reservation?.reservationDate || "");
  const [startTime, setStartTime] = useState(reservation?.startTime || "");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (reservationDate) {
      fetchOpeningHoursAndReservations();
    }
  }, [reservationDate]);

  const fetchOpeningHoursAndReservations = async () => {
    try {
      const facilityResponse = await axios.get(`http://localhost:3001/api/sportfacility/${reservation.Field.sportsFacility.id}`);
      const dayOfWeek = new Date(reservationDate).getDay();
      const dayName = getDayName(dayOfWeek);
      const openTime = facilityResponse.data[`open_${dayName}`];
      const closeTime = facilityResponse.data[`close_${dayName}`];

      const reservationsResponse = await axios.get(`http://localhost:3001/fields/field/${reservation.FieldId}/date/${reservationDate}`);
      const reservedHours = reservationsResponse.data;

      const availableSlots = generateHourlySlots(openTime, closeTime, reservedHours, reservationDate);

      setAvailableSlots(availableSlots);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAvailableSlots([]);
    }
  };

  const getDayName = (dayNumber) => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[dayNumber];
  };

  const generateHourlySlots = (open, close, reservedHours, reservationDate) => {
    const slots = [];
    if (!open || !close) return slots; // Jeśli brak danych o godzinach otwarcia, zwracamy pustą tablicę

    const currentDate = new Date();
    const isToday = new Date(reservationDate).toDateString() === currentDate.toDateString();
    const selectedDate = new Date(reservationDate);

    // Jeśli wybrana data jest w przeszłości, zwracamy pustą tablicę
    if (selectedDate < currentDate) {
      return slots;
    }

    const currentHour = currentDate.getHours();
    let start = parseInt(open.split(":")[0], 10);
    const end = parseInt(close.split(":")[0], 10);

    while (start < end) {
      const slot = `${start.toString().padStart(2, "0")}:00`;

      // Filtrujemy godziny wcześniejsze niż aktualna w dniu dzisiejszym
      if ((!isToday || start >= currentHour) && !reservedHours.includes(slot)) {
        slots.push(slot);
      }
      start++;
    }

    return slots;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Walidacja: czy wybrana godzina jest dostępna
    if (!availableSlots.includes(startTime)) {
      setErrorMessage("Selected time is not available. Please choose another slot.");
      return;
    }

    try {
      // Automatyczne obliczenie godziny końca rezerwacji
      const endTime = `${parseInt(startTime.split(":")[0], 10) + 1}:00`;

      // Wysłanie żądania PUT do serwera
      await axios.put(`http://localhost:3001/reservations/${id}`, {
        reservationDate,
        startTime,
        endTime,
      });

      // Przekierowanie do listy rezerwacji
      navigate(`/field-reservations`);
    } catch (error) {
      console.error("Error updating reservation:", error);

      // Obsługa błędów
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while updating the reservation.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mainWrapper" style={showNav ? { marginTop: "0vh" } : { marginTop: "6vh" }}>
      <h1 className="h1Header">Edit Reservation</h1>
      <div className="wrapperInput">
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}

        <label>Date</label>
        <input className="defaultInput" type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} required />

        <label>Start Time</label>
        <select className="defaultInput" value={startTime} onChange={(e) => setStartTime(e.target.value)} required>
          <option value="">Select Start Time</option>
          {availableSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <p>End Time: {startTime ? `${parseInt(startTime.split(":")[0], 10) + 1}:00` : "Select a start time to calculate"}</p>

        <button type="submit" className="button">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditFieldReservation;
