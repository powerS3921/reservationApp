import React, { useState, useEffect } from "react";
import axios from "axios";

const FieldList = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/fields")
      .then((response) => {
        setFields(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Fields</h1>
      <ul>
        {fields.map((field) => (
          <li key={field.id}>
            {field.id} - {field.name} - {field.location} - {field.capacity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldList;
