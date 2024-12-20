import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import "../style/Profile.sass";
import { BsPersonCircle } from "react-icons/bs";
import ActiveReservationTable from "../components/ActiveReservationTable";
import UnActiveReservationTable from "../components/UnActiveReservationTable";
import UnPaymentReservationTable from "../components/UnPaymentReservationTable";

const Profile = ({ showNav, username }) => {
  const { id } = useParams();
  const [activeReservations, setActiveReservations] = useState([]);
  const [unActiveReservations, setUnActiveReservations] = useState([]);
  const [unPaymentReservation, setUnPaymentReservation] = useState([]);

  useEffect(() => {
    const fetchActiveReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/reservations/active-reservation", {
          params: { id },
        });
        setActiveReservations(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania aktywnych rezerwacji:", error);
      }
    };

    fetchActiveReservations();
  }, []);

  useEffect(() => {
    const fetchUnActiveReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/reservations/unactive-reservation", {
          params: { id },
        });
        setUnActiveReservations(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania aktywnych rezerwacji:", error);
      }
    };

    fetchUnActiveReservations();
  }, []);

  useEffect(() => {
    const fetchUnPaymentReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/reservations/unpayment-reservation", {
          params: { id },
        });
        setUnPaymentReservation(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania aktywnych rezerwacji:", error);
      }
    };

    fetchUnPaymentReservations();
  }, []);

  return (
    <>
      <div className="profileWrapper" style={showNav ? { marginTop: "5vh" } : { marginTop: "11vh" }}>
        <div className="profileHeader">
          <BsPersonCircle className="profileHeaderImage" />
          <h2 className="profileHeaderCapture">{username}</h2>
        </div>
        <div className="reports">
          {activeReservations.length > 0 || unActiveReservations > 0 || unPaymentReservation > 0 ? (
            <>
              <div className="activeReservation">
                {activeReservations.length > 0 ? (
                  <>
                    <h1 className="headerh2">Aktywne rezerwacje</h1>

                    <ActiveReservationTable activeReservations={activeReservations} setActiveReservations={setActiveReservations} />
                  </>
                ) : null}
              </div>
              <div className="unActiveReservation">
                {unActiveReservations.length > 0 ? (
                  <>
                    <h1 className="headerh2">Historyczne rezerwacje</h1>

                    <UnActiveReservationTable unActiveReservations={unActiveReservations} setUnActiveReservations={setUnActiveReservations} />
                  </>
                ) : null}
              </div>
              <div className="unPaymentReservation">
                {unPaymentReservation.length > 0 ? (
                  <>
                    <h1 className="headerh2">Nieopłacone rezerwacje</h1>

                    <UnPaymentReservationTable unPaymentReservation={unPaymentReservation} setUnPaymentReservation={setUnPaymentReservation} />
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <h1 className="headerh2">Brak rezerwacji, zarezerwuj coś!</h1>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
