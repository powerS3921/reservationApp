import React from "react";
import { Link } from "react-router-dom";
import "../style/Admin.sass";

const Admin = ({ showNav }) => {
  return (
    <div className="wrapperAdmin" style={showNav ? { marginTop: "-6vh" } : { marginTop: "0vh" }}>
      <div className="headerText">
        <h1 className="adminTitle">Panel Administratora</h1>
        <p className="adminSubtitle">Zarządzaj obiektami sportowymi i rezerwacjami w jednym miejscu</p>
      </div>
      <div className="adminLinks">
        <Link to={`/fields`} className="adminLink">
          Boiska
        </Link>
        <Link to={`/add-facility`} className="adminLink">
          Dodaj Obiekt Sportowy
        </Link>
        <Link to={`/facility`} className="adminLink">
          Obiekty Sportowe
        </Link>
        <Link to={`/field-reservations`} className="adminLink">
          Rezerwacje
        </Link>
      </div>
    </div>
  );
};

export default Admin;
