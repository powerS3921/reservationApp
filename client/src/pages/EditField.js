import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import axios from "axios";

const EditField = ({ showNav }) => {
  const location = useLocation();
  const [size, setSize] = useState("");
  const [fieldSizes, setFieldSizes] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [price, setPrice] = useState("");
  const navigateTo = useNavigate();

  useEffect(() => {
    if (location.state && location.state.field) {
      setSelectedSport(location.state.field.SportId);
      setSize(location.state.field.sizeId);
      setPrice(location.state.field.price);
      fetchFieldSizes(location.state.field.SportId);
    }
  }, [location.state]);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/sports");
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const fetchFieldSizes = async (sportId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/fieldsizes?sportId=${sportId}`);
      setFieldSizes(response.data);
    } catch (error) {
      console.error("Error fetching field sizes:", error);
    }
  };

  const handleSportChange = (event) => {
    const sportId = event.target.value;
    setSelectedSport(sportId);
    fetchFieldSizes(sportId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedField = {
      sportId: selectedSport,
      sizeId: size,
      price,
    };

    axios
      .put(`http://localhost:3001/fields/${location.state.field.id}`, updatedField)
      .then((response) => {
        console.log("Field updated:", response.data);
        navigateTo("/fields");
      })
      .catch((error) => {
        console.error("Error updating field:", error);
      });
  };

  return (
    <div className="mainWrapper" style={showNav ? { marginTop: "19vh" } : { marginTop: "25vh" }}>
      <h1 className="h1Header">Edycja boiska</h1>
      <form onSubmit={handleSubmit} className="wrapperInput">
        <select className="defaultInput" value={selectedSport} onChange={handleSportChange}>
          <option value="">Wybierz sport</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
        <select className="defaultInput" value={size} onChange={(e) => setSize(e.target.value)} disabled={!selectedSport}>
          <option value="">Wybierz rozmiar</option>
          {fieldSizes.map((fieldSize) => (
            <option key={fieldSize.id} value={fieldSize.id}>
              {fieldSize.size}
            </option>
          ))}
        </select>
        <NumericFormat
          value={price}
          onValueChange={(values) => setPrice(values.value)}
          thousandSeparator={true}
          suffix=" PLN/h"
          decimalScale={2}
          fixedDecimalScale={true}
          allowNegative={false}
          placeholder="Cena..."
          className="defaultInput"
          displayType="input"
        />
        <button type="submit" className="button">
          Zatwierdź
        </button>
      </form>
    </div>
  );
};

export default EditField;
