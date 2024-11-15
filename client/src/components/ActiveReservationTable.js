import React from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { formatDistanceToNow } from "date-fns"; // Pomocna funkcja do obliczeń różnicy czasu

const ReservationsTable = ({ activeReservations, userID, setActiveReservations }) => {
  // Funkcja sprawdzająca, czy rezerwacja jest do anulowania (pozostało więcej niż 24 godziny)
  const isCancelable = (startTime) => {
    const now = new Date();
    const reservationStartTime = new Date(startTime);
    const difference = reservationStartTime - now; // Wartość w milisekundach
    return difference > 24 * 60 * 60 * 1000; // 24 godziny w milisekundach
  };

  // Funkcja do usuwania rezerwacji
  const handleDeleteReservation = async (reservationId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/reservations/${reservationId}`);
      if (response.status === 200) {
        setActiveReservations(activeReservations.filter((res) => res.id !== reservationId));
      }
    } catch (error) {
      console.error("Błąd podczas usuwania rezerwacji:", error);
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
      name: "Odwołaj rezerwację",
      cell: (row) => (
        <button
          onClick={() => handleDeleteReservation(row.id)}
          disabled={!isCancelable(row.reservationDate)} // Przycisk aktywny tylko jeśli pozostało >24 godziny
          className={`deleteButton ${isCancelable(row.reservationDate) ? "active" : "disabled"}`}
        >
          Odwołaj
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} data={activeReservations} pagination className="table" />;
};

export default ReservationsTable;
