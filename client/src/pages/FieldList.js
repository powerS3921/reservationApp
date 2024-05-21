import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const FieldList = () => {
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/fields")
      .then((response) => {
        setFields(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleEdit = (field) => {
    navigate(`/edit-field/${field.id}`, { state: { field } });
  };

  return (
    <div>
      <h1>Fields</h1>
      <ul>
        {fields.map((field) => (
          <li key={field.id}>
            {field.id} - {field.name} - {field.location} - {field.capacity}
            <button onClick={() => handleEdit(field)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldList;
