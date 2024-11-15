import React from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { formatDistanceToNow } from "date-fns"; // Pomocna funkcja do obliczeń różnicy czasu

const ReservationsTable = ({ unActiveReservations, userID, setUnActiveReservations }) => {
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
  ];

  return <DataTable columns={columns} data={unActiveReservations} pagination className="table" />;
};

export default ReservationsTable;
