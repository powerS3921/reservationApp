import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FieldList = () => {
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = () => {
    axios
      .get("http://localhost:3001/fields")
      .then((response) => {
        setFields(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleEdit = (field) => {
    navigate(`/edit-field/${field.id}/${userId}`, { state: { field } });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/fields/${id}`)
      .then((response) => {
        console.log("Field deleted:", response.data);
        fetchFields();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="mainWrapper">
      <h1 className="h1Header">Fields</h1>
      <ul>
        {fields.map((field) => (
          <li key={field.id}>
            <span>Typ boiska: {field.name}</span> <span>Lokalizacja: {field.location}</span> <span>Pojemność: {field.capacity} osoby/osób</span>
            <button onClick={() => handleEdit(field)}>Edit</button>
            <button onClick={() => handleDelete(field.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldList;
