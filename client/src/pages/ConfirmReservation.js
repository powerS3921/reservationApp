import React from "react";
import Footer from "../components/Footer";
import SlimHeader from "../components/SlimHeader";
import ConfirmReservationPanel from "../components/ConfirmReservationPanel";
import "../style/ConfirmReservation.sass";

const ConfirmReservation = ({ showNav, userID }) => {
  return (
    <>
      <SlimHeader h1={"Ostatni krok!"} h2={"Potwierdź swoją rezerwację i przejdź do płatności"} />
      <ConfirmReservationPanel showNav={showNav} userID={userID} />
      <Footer />
    </>
  );
};

export default ConfirmReservation;
