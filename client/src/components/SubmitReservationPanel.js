import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/SubmitReservationPanel.sass";

const SubmitReservationPanel = ({ showNav }) => {
  const location = useLocation();
  const sportsFacilityId = location.state?.selectedField.SportsFacilityId;
  const selectedDate = location.state.selectedDate;
  const [openingHours, setOpeningHours] = useState({});
  const [hourSlots, setHourSlots] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");
  const navigate = useNavigate();
  const reservationDate = new Date(selectedDate).toLocaleDateString("sv-SE");

  useEffect(() => {
    const fetchOpeningHoursAndReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/sportfacility/${sportsFacilityId}`);
        setOpeningHours(response.data);

        const dayOfWeek = new Date(selectedDate).getDay();
        const dayName = getDayName(dayOfWeek);
        const openTime = response.data[`open_${dayName}`];
        const closeTime = response.data[`close_${dayName}`];
        const slots = generateHourlySlots(openTime, closeTime);

        // Pobierz rezerwacje na wybraną datę
        const reservationsResponse = await axios.get(`http://localhost:3001/fields/field/${location.state.selectedField.id}/date/${reservationDate}`);
        const reservedHours = reservationsResponse.data;

        // Filtrowanie dostępnych godzin
        const availableSlots = slots.filter((slot) => !reservedHours.includes(slot));
        setHourSlots(availableSlots);
      } catch (error) {
        console.error("Błąd przy pobieraniu godzin otwarcia i rezerwacji:", error);
      }
    };

    fetchOpeningHoursAndReservations();
  }, [sportsFacilityId, selectedDate]);

  const getDayName = (dayNumber) => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[dayNumber];
  };

  const generateHourlySlots = (open, close) => {
    const slots = [];
    if (!open || !close) return slots;

    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const currentTime = new Date();

    let start = new Date();
    start.setHours(parseInt(open.split(":")[0], 10), parseInt(open.split(":")[1], 10), 0);

    const end = new Date();
    end.setHours(parseInt(close.split(":")[0], 10), parseInt(close.split(":")[1], 10), 0);

    while (start < end) {
      // For today, skip past hours
      if (!isToday || start > currentTime) {
        slots.push(start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
      start.setHours(start.getHours() + 1);
    }

    return slots;
  };

  const confirmReservation = () => {
    navigate(`/confirm-reservation`, {
      state: {
        selectedField: location.state.selectedField,
        selectedDate: location.state.selectedDate,
        selectedHour: hourSlots[selectedHour],
      },
    });
  };

  return (
    <div className="reservationBox" style={showNav ? { marginTop: "44vh" } : { marginTop: "50vh" }}>
      {hourSlots.length > 0 && (
        <>
          <h2 className="headerh2">Wybierz odpowiednią dla siebie godzinę!</h2>
          <ul className="hourWrapper">
            {hourSlots.map((time, index) => (
              <li key={index} className="hour">
                {time}{" "}
                <button className={index === selectedHour ? "active" : ""} onClick={() => setSelectedHour(index)}>
                  Wybierz
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {hourSlots.length === 0 && <h2 className="headerh2">Brak dostępnych boisk</h2>}
      <button className="fieldContainerButton" onClick={confirmReservation}>
        Rezerwuj
      </button>
    </div>
  );
};

export default SubmitReservationPanel;
