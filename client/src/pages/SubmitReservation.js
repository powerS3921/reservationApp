import React from "react";
import SlimHeader from "../components/SlimHeader";
import SubmitReservationPanel from "../components/SubmitReservationPanel";
import Footer from "../components/Footer";

const SubmitReservation = ({ showNav }) => {
  return (
    <>
      <SlimHeader h1={"Już prawie! "} h2={"Dokończ rezerwację tutaj"} />
      <SubmitReservationPanel showNav={showNav} />
      <Footer />
    </>
  );
};

export default SubmitReservation;
