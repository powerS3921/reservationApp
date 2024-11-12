import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/ReservationBox.sass";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const images = ["/images/third.jpg", "/images/first.png", "/images/second.jpg"];

const ReservationBox = ({ showNav }) => {
  const [selectedCity, setSelectedCity] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [selectedSports, setSelectedSports] = useState("");
  const [activeSports, setActiveSports] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [fields, setFields] = useState([]);
  const [visibleH2, setVisibleH2] = useState(0);
  const navigate = useNavigate();

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setActiveCity(city);
    setSelectedSports("");
    setActiveSports("");
    setSelectedDate("");
    setFields([]);
  };

  const handleSportClick = (sport) => {
    setSelectedSports(sport);
    setActiveSports(sport);
    setFields([]);
    setVisibleH2(0);
  };

  const fetchFacilities = async () => {
    if (!selectedCity || !selectedSports || !selectedDate) {
      alert("Proszę wybrać miasto, sport oraz datę.");
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    if (selectedDateOnly < currentDate) {
      setFields([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:3001/fields/available-fields", {
        params: {
          city: selectedCity,
          sport: selectedSports,
          date: selectedDate.toISOString(),
        },
      });

      setFields(response.data);
      setVisibleH2(1);
      console.log(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania boisk:", error);
    }
  };

  const addReservation = (id) => {
    const selectedField = fields.find((field) => field.id === id);
    navigate(`/submit-resservation/${id}`, { state: { selectedField, selectedDate } });
  };

  return (
    <>
      <div className="reservationBox" style={showNav ? { marginTop: "44vh" } : { marginTop: "50vh" }}>
        <h1 className="headerh1">Rezerwacja</h1>
        <h2 className="headerh2">Wybierz miasto w którym chcesz dokonać rezerwacji</h2>
        <div className="city">
          <p className={`cityName button ${activeCity === 1 ? "active" : ""}`} onClick={() => handleCityClick(1)}>
            Kraków
          </p>
          <p className={`cityName button ${activeCity === 2 ? "active" : ""}`} onClick={() => handleCityClick(2)}>
            Warszawa
          </p>
          <p className={`cityName button ${activeCity === 3 ? "active" : ""}`} onClick={() => handleCityClick(3)}>
            Katowice
          </p>
          <p className={`cityName button ${activeCity === 4 ? "active" : ""}`} onClick={() => handleCityClick(4)}>
            Lublin
          </p>
        </div>
        <div className="sports">
          {selectedCity !== "" && (
            <>
              <h2 className="headerh2">Wybierz sport, w który chcesz zagrać</h2>
              <div className="cracov citySection">
                <div className="sport">
                  <div className="image">
                    <img src={`${images[0]}`} alt="basketball" />
                  </div>
                  <p className={`sportsName cracov ${activeSports === 1 ? "active" : ""}`} onClick={() => handleSportClick(1)}>
                    Wybierz!
                  </p>
                </div>
                <div className="sport">
                  <div className="image">
                    <img src={`${images[1]}`} alt="squash" />
                  </div>
                  <p className={`sportsName cracov ${activeSports === 2 ? "active" : ""}`} onClick={() => handleSportClick(2)}>
                    Wybierz!
                  </p>
                </div>
                <div className="sport">
                  <div className="image">
                    <img src={`${images[2]}`} alt="tenis" />
                  </div>
                  <p className={`sportsName cracov ${activeSports === 3 ? "active" : ""}`} onClick={() => handleSportClick(3)}>
                    Wybierz!
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="calendar">
          {selectedSports !== "" && (
            <>
              <h2 className="headerh2">Wybierz dzień, w którym chcesz dokonać rezerwacji</h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd.MM.yyyy"
                placeholderText="Wybierz datę"
                className="my-custom-datepicker"
              />
              <p className="button" onClick={fetchFacilities}>
                Szukaj
              </p>
            </>
          )}
        </div>
        {fields.length > 0 && selectedSports !== "" && selectedDate !== "" && (
          <div className="fields">
            <h2 className="headerh2">Dostępne boiska</h2>

            <ul className="fieldWrapper">
              {fields.map((field) => (
                <li key={field.id} className="fieldContainer">
                  <div className="fieldImage" style={{ backgroundImage: `url(${images[selectedSports - 1]})` }}></div>

                  <div className="spanContainer">
                    <span className="span">{field.sportsFacility.name}</span>
                    <span className="span">{field.sportsFacility.City.name}</span>
                    <span className="span">{field.sportsFacility.address}</span>
                    <span className="span">{field.fieldSize.size}</span>
                    <span className="span">Cena: {field.price} PLN/h</span>
                  </div>
                  <div className="buttonContainer">
                    <button className="fieldContainerButton" onClick={() => addReservation(field.id)}>
                      Rezerwuj
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {fields.length === 0 && visibleH2 === 1 && <h2 className="headerh2">Brak dostępnych boisk w wybranych przez ciebie kryteriach</h2>}
      </div>
    </>
  );
};

export default ReservationBox;
