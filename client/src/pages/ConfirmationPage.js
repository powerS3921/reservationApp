import React, { useEffect } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "../style/ConfirmationPage.sass";

const ConfirmationPage = ({ showNav }) => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (sessionId) {
          await axios.put("http://localhost:3001/reservations/update-payment", {
            sessionId,
          });
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    };

    confirmPayment();
  }, [sessionId]);
  return (
    <>
      <div className="reservationBox" style={showNav ? { marginTop: "15vh" } : { marginTop: "21vh" }}>
        <h1 className="headerh2">Rezerwacja została potwierdzona oraz opłacona. Potwierdzenie zostało wysłane mailem</h1>
        <a href="/" className="link">
          Wróć na stronę główną
        </a>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmationPage;
