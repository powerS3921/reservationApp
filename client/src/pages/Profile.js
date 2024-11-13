import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import "../style/Profile.sass";
import { BsPersonCircle } from "react-icons/bs";

const Profile = ({ showNav, username }) => {
  const { id } = useParams();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchActiveReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/reservations/active-reservation", {
          params: { id },
        });
        setReservations(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania aktywnych rezerwacji:", error);
      }
    };

    fetchActiveReservations();
  }, []);

  return (
    <>
      <div className="profileWrapper" style={showNav ? { marginTop: "5vh" } : { marginTop: "11vh" }}>
        <div className="profileHeader">
          <BsPersonCircle className="profileHeaderImage" />
          <h2 className="profileHeaderCapture">{username}</h2>
        </div>
        <div className="reports">
          <div className="activeReservation">
            <h1 className="headerh2">Aktywne rezerwacje</h1>
            {reservations.length > 0 ? (
              <ul>
                {reservations.map((reservation) => (
                  <li key={reservation.id}>
                    Data: {reservation.reservationDate}, Godzina: {reservation.startTime} - {reservation.endTime}, Obiekt: {reservation.Field.sportsFacility.name} Cena:{" "}
                    {reservation.Field.price} PLN
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak aktywnych rezerwacji.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
