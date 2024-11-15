import React from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { formatDistanceToNow } from "date-fns"; // Pomocna funkcja do obliczeń różnicy czasu
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QIdm2B1QJBWRwyCwAlVxf9Pka47EsCpEZOlijDIhtmcD7giuyufgivfIlIkYPx4CTpVFaj1LExBQwhGsgis1Z3q00x1pLPDrI");

const UnPaymentReservationTable = ({ unPaymentReservation, userID, setUnPaymentReservation }) => {
  const handlePayment = async (reservationId, price) => {
    try {
      const sessionResponse = await axios.post("http://localhost:3002/create-checkout-session", {
        reservationId,
        price,
      });

      const { sessionId } = sessionResponse.data;

      // Aktualizacja rezerwacji z sessionId
      await axios.put(`http://localhost:3001/reservations/${reservationId}/update-session`, {
        sessionId,
      });

      // Przekierowanie do Stripe Checkout
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Błąd przy płatności:", error);
    }
  };

  const columns = [
    {
      name: "Data",
      selector: (row) => row.reservationDate,
      sortable: true,
    },
    {
      name: "Godzina",
      selector: (row) => `${row.startTime} - ${row.endTime}`,
      sortable: true,
    },
    {
      name: "Obiekt",
      selector: (row) => row.Field.sportsFacility.name,
      sortable: true,
    },
    {
      name: "Cena (PLN)",
      selector: (row) => row.Field.price,
      sortable: true,
    },
    {
      name: "Opłać rezerwację",
      cell: (row) => (
        <button className="deleteButton" onClick={() => handlePayment(row.id, row.Field.price)}>
          Opłać
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} data={unPaymentReservation} pagination className="table" />;
};

export default UnPaymentReservationTable;
