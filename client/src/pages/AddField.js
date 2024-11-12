import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import "../style/AddField.sass";

const AddField = ({ showNav }) => {
  const { id } = useParams();
  const [size, setSize] = useState("");
  const [fieldSizes, setFieldSizes] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [SportsFacilityId, setSportsFacilityId] = useState(id);
  const [price, setPrice] = useState("");
  const navigateTo = useNavigate();

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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(SportsFacilityId, size, selectedSport, price);
    axios
      .post("http://localhost:3001/fields", {
        sizeId: size,
        sportId: selectedSport,
        price,
        SportsFacilityId,
      })
      .then((response) => {
        console.log(response.data);
        navigateTo(`/admin`);
      })
      .catch((error) => {
        console.error("Error adding field:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mainWrapper" style={showNav ? { marginTop: "19vh" } : { marginTop: "25vh" }}>
      <h1 className="h1Header">Dodaj boisko</h1>
      <div className="wrapperInput">
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
          Add Field
        </button>
      </div>
    </form>
  );
};

export default AddField;
