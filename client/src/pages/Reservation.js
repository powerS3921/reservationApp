import React from "react";
import Footer from "../components/Footer";
import SlimHeader from "../components/SlimHeader";

import ReservationBox from "../components/ReservationBox";

const Reservation = ({ showNav }) => {
  return (
    <>
      <SlimHeader h1={"Cieszymy się że tutaj jesteś!"} h2={"Zarezerwuj wybrane przez siebie boisko :)"} />
      <ReservationBox showNav={showNav} />
      <Footer />
    </>
  );
};

export default Reservation;
