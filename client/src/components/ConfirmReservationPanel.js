import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Inicjalizacja Stripe poza renderem komponentu
const stripePromise = loadStripe("pk_test_51QIdm2B1QJBWRwyCwAlVxf9Pka47EsCpEZOlijDIhtmcD7giuyufgivfIlIkYPx4CTpVFaj1LExBQwhGsgis1Z3q00x1pLPDrI");

const ConfirmReservationPanel = ({ showNav, userID }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const { selectedField, selectedDate, selectedHour } = location.state;
      const reservationDate = new Date(selectedDate).toISOString();
      const startTime = `${selectedHour}`;
      let endTime = `${parseInt(selectedHour) + 1}:00:00`;

      // Sprawdzenie i zmiana endTime na 23:59:59, jeśli jest ustawione na 24:00:00
      if (endTime === "24:00:00") {
        endTime = "23:59:59";
      }

      // Krok 1: Tworzenie rezerwacji w bazie danych
      const reservationResponse = await axios.post("http://localhost:3001/reservations", {
        fieldId: selectedField.id,
        userId: userID,
        reservationDate,
        startTime,
        endTime,
        czyZaplacono: false,
      });

      const reservationId = reservationResponse.data.id;

      // Krok 2: Tworzenie sesji Stripe i przekazanie ID rezerwacji
      const sessionResponse = await axios.post("http://localhost:3002/create-checkout-session", {
        reservationId,
        price: selectedField.price,
      });

      const { sessionId } = sessionResponse.data;

      // Krok 3: Aktualizacja rezerwacji z sessionId
      await axios.put(`http://localhost:3001/reservations/${reservationId}/update-session`, {
        sessionId,
      });

      // Przekierowanie do Stripe Checkout
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Błąd przy tworzeniu rezerwacji i płatności:", error);
    }
  };

  const date = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(location.state.selectedDate));

  return (
    <div className="reservationBox" style={showNav ? { marginTop: "44vh" } : { marginTop: "50vh" }}>
      <h1 className="headerh2">Potwierdzenie rezerwacji</h1>
      <h2>Sport: {location.state.selectedField.Sport.name}</h2>
      <h2>Rozmiar: {location.state.selectedField.fieldSize.size}</h2>
      <h2>Cena: {location.state.selectedField.price} PLN/h</h2>
      <h2>Nazwa obiektu: {location.state.selectedField.sportsFacility.name}</h2>
      <h2>Adres obiektu: {location.state.selectedField.sportsFacility.address}</h2>
      <h2>Data: {date}</h2>
      <h2>Godzina: {location.state.selectedHour}</h2>

      <button className="fieldContainerButton" onClick={handlePayment}>
        Akceptuj i zapłać
      </button>
    </div>
  );
};

export default ConfirmReservationPanel;
