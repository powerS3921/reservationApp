import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../style/Admin.sass";

const Admin = ({ showNav }) => {
  let { id } = useParams();

  return (
    <div className="wrapperAdmin" style={showNav ? { marginTop: "-6vh" } : { marginTop: "0vh" }}>
      <div className="headerText">
        <h1>Panel Admina</h1>
      </div>
      <div className="adminLinks">
        <Link to={`/fields`}>
          <button className="adminButton">Boiska</button>
        </Link>
        <Link to={`/add-facility`}>
          <button className="adminButton">Dodaj obiekt sportowy</button>
        </Link>
        <Link to={`/facility`}>
          <button className="adminButton">Obiekty sportowe</button>
        </Link>
        <Link to={`/field-reservations`}>
          <button className="adminButton">Rezerwacje</button>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
