import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome!</h1>
      <Link to="/fields">
        <button>View Fields</button>
      </Link>
      <Link to="/add-field">
        <button>Add Field</button>
      </Link>
      <Link to="/field-reservations">
        <button>View Field Reservations</button>
      </Link>
      <Link to="/add-field-reservation">
        <button>Add Field Reservation</button>
      </Link>
    </div>
  );
};

export default Home;
