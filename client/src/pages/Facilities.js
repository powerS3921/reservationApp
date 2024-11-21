import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style/Facilities.sass";

const SportsFacilityList = ({ showNav }) => {
  const [facilities, setFacilities] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchCities();
    fetchFacilities();
  }, []);

  const fetchFacilities = () => {
    const params = {};
    if (selectedCity) params.city = selectedCity;

    setLoading(true);
    axios
      .get("http://localhost:3001/api/sportfacility", { params })
      .then((response) => {
        setFacilities(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching facilities:", error);
        setLoading(false);
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

  const handleEdit = (facility) => {
    navigate(`/edit-facility/${facility.id}`, { state: { facility } });
  };

  const addField = (facility) => {
    navigate(`/add-field/${facility.id}`, { state: { facility } });
  };

  const searchFields = (facility) => {
    navigate(`/fields/${facility.id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/sports-facilities/${id}`)
      .then(() => {
        fetchFacilities();
      })
      .catch((error) => console.error("Error deleting facility:", error));
  };

  return (
    <div className="mainWrapper" style={showNav ? { marginTop: "-1vh" } : { marginTop: "5vh" }}>
      <h1 className="h1Header">Obiekty Sportowe</h1>

      <div className="filters">
        <label className="filterLabel">
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
        </label>

        <button onClick={fetchFacilities} className="adminButton">
          Szukaj
        </button>
      </div>

      {/* List of facilities */}
      <ul className="listOfFields">
        {loading ? (
          <p className="loadingParagraph">Ładowanie...</p>
        ) : facilities.length === 0 ? (
          <p className="fieldsParagraph">Brak dostępnych obiektów sportowych</p>
        ) : (
          facilities.map((facility) => (
            <li key={facility.id} className="fieldContainer facilityContainer">
              <div className="spanContainer">
                <span className="span">{facility.name}</span>
                <span className="span">{facility.City.name}</span>
                <span className="span">{facility.address}</span>
                <div className="openingHours">
                  <p className="span">
                    Poniedziałek: {facility.open_monday} - {facility.close_monday}
                  </p>
                  <p className="span">
                    Wtorek: {facility.open_tuesday} - {facility.close_tuesday}
                  </p>
                  <p className="span">
                    Środa: {facility.open_wednesday} - {facility.close_wednesday}
                  </p>
                  <p className="span">
                    Czwartek: {facility.open_thursday} - {facility.close_thursday}
                  </p>
                  <p className="span">
                    Piątek: {facility.open_friday} - {facility.close_friday}
                  </p>
                  <p className="span">
                    Sobota: {facility.open_saturday} - {facility.close_saturday}
                  </p>
                  <p className="span">
                    Niedziela: {facility.open_sunday} - {facility.close_sunday}
                  </p>
                </div>
              </div>
              <div className="buttonContainer">
                <button className="fieldContainerButton" onClick={() => addField(facility)}>
                  Dodaj boisko
                </button>
                <button className="fieldContainerButton" onClick={() => searchFields(facility)}>
                  Wyświetl boiska
                </button>
                <button className="fieldContainerButton" onClick={() => handleEdit(facility)}>
                  Edytuj
                </button>
                <button className="fieldContainerButton" onClick={() => handleDelete(facility.id)}>
                  Usuń
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SportsFacilityList;
