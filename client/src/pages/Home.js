import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  let { id } = useParams();
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((res) => {
      setUsername(res.data.username);
    });
  }, [id]);

  return (
    <div className="wrapperHome">
      <h1>Welcome, {username}!</h1>
      <Link to={`/fields/${id}`}>
        <button className="homeButton">View Fields</button>
      </Link>
      <Link to={`/add-field/${id}`}>
        <button className="homeButton">Add Field</button>
      </Link>
      <Link to={`/field-reservations/${id}`}>
        <button className="homeButton">View Field Reservations</button>
      </Link>
      <Link to={`/add-field-reservation/${id}`}>
        <button className="homeButton">Add Field Reservation</button>
      </Link>
    </div>
  );
};

export default Home;
