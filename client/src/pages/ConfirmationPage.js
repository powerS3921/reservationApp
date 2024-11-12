import React, { useEffect } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ConfirmationPage = () => {
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
      <div>Potwierdzona rezerwacja</div>
      <Footer />
    </>
  );
};

export default ConfirmationPage;
