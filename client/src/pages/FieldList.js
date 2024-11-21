import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style/FieldList.sass";

const FieldList = ({ showNav }) => {
  const [fields, setFields] = useState([]);
  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id: sportsFieldId } = useParams();

  useEffect(() => {
    fetchCities();
    fetchSports();
    fetchFields(); // Fetch all fields initially
  }, [sportsFieldId]);

  // Fetch fields based on optional filters
  const fetchFields = () => {
    const params = {};
    if (sportsFieldId) params.sportsFacilityId = sportsFieldId;
    if (selectedCity) params.city = selectedCity;
    if (selectedSport) params.sport = selectedSport;

    setLoading(true); // Set loading state
    axios
      .get("http://localhost:3001/fields", { params })
      .then((response) => {
        setFields(response.data);
        setLoading(false); // Reset loading state
      })
      .catch((error) => {
        console.error("Error fetching fields:", error);
        setLoading(false); // Reset loading state
      });
  };

  const fetchCities = () => {
    axios
      .get("http://localhost:3001/api/cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };

  const fetchSports = () => {
    axios
      .get("http://localhost:3001/api/sports")
      .then((response) => {
        setSports(response.data);
      })
      .catch((error) => console.error("Error fetching sports:", error));
  };

  const handleEdit = (field) => {
    navigate(`/edit-field/${field.id}`, { state: { field } });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/fields/${id}`)
      .then(() => {
        fetchFields();
      })
      .catch((error) => console.error("Error deleting field:", error));
  };

  return (
    <div className="mainWrapper" style={showNav ? { marginTop: "0vh" } : { marginTop: "6vh" }}>
      <h1 className="h1Header">Boiska</h1>

      <div className="filters">
        {/* <label className="filterLabel">
          <p className="filterCaption">Miasto</p>
          <select value={selectedCity} className="filterSelect" onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="" className="filterOption">
              Wszystkie miasta
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id} className="filterOption">
                {city.name}
              </option>
            ))}
          </select>
        </label> */}

        <label className="filterLabel">
          <p className="filterCaption">Sport</p>
          <select value={selectedSport} className="filterSelect" onChange={(e) => setSelectedSport(e.target.value)}>
            <option value="" className="filterOption">
              Wszystkie sporty
            </option>
            {sports.map((sport) => (
              <option key={sport.id} className="filterOption" value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
        </label>

        <button onClick={fetchFields} className="adminButton">
          Szukaj
        </button>
      </div>

      {/* List of fields */}
      <ul className="listOfFields">
        {loading ? (
          <p className="loadingParagraph">Ładowanie...</p>
        ) : fields.length === 0 ? (
          <p className="fieldsParagraph">Brak dostępnych boisk</p>
        ) : (
          fields.map((field) => (
            <li key={field.id} className="fieldContainer">
              <div className="spanContainer">
                <span className="span">{field.Sport.name}</span>
                <span className="span">{field.fieldSize.size}</span>
                <span className="span">{field.price} PLN/h</span>
              </div>
              <div className="buttonContainer">
                <button className="fieldContainerButton" onClick={() => handleEdit(field)}>
                  Edit
                </button>
                <button className="fieldContainerButton" onClick={() => handleDelete(field.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FieldList;
