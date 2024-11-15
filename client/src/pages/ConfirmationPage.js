import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "../style/ConfirmationPage.sass";

const ConfirmationPage = ({ showNav }) => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (sessionId && !isProcessing) {
          setIsProcessing(true); // Oznacz rozpoczęcie przetwarzania
          const { data } = await axios.get(`http://localhost:3001/reservations/get-email-status/${sessionId}`);

          if (!data.emailSent) {
            await axios.post("http://localhost:3001/reservations/send-confirmation-email", { sessionId });
            await axios.put("http://localhost:3001/reservations/update-payment", { sessionId });
          }
        }
      } catch (error) {
        console.error("Błąd przy aktualizacji statusu płatności lub wysyłaniu e-maila:", error);
      } finally {
        setIsProcessing(false); // Resetuj stan po zakończeniu
      }
    };

    confirmPayment();
  }, [sessionId, isProcessing]);

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
