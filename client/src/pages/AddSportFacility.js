import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style/AddFacility.sass";

const AddSportsFacility = ({ showNav }) => {
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [openMonday, setOpenMonday] = useState("");
  const [closeMonday, setCloseMonday] = useState("");
  const [openTuesday, setOpenTuesday] = useState("");
  const [closeTuesday, setCloseTuesday] = useState("");
  const [openWednesday, setOpenWednesday] = useState("");
  const [closeWednesday, setCloseWednesday] = useState("");
  const [openThursday, setOpenThursday] = useState("");
  const [closeThursday, setCloseThursday] = useState("");
  const [openFriday, setOpenFriday] = useState("");
  const [closeFriday, setCloseFriday] = useState("");
  const [openSaturday, setOpenSaturday] = useState("");
  const [closeSaturday, setCloseSaturday] = useState("");
  const [openSunday, setOpenSunday] = useState("");
  const [closeSunday, setCloseSunday] = useState("");
  const navigateTo = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/cities");
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/api/sportfacility", {
        name: name,
        cityId: selectedCity,
        address,
        open_monday: openMonday,
        close_monday: closeMonday,
        open_tuesday: openTuesday,
        close_tuesday: closeTuesday,
        open_wednesday: openWednesday,
        close_wednesday: closeWednesday,
        open_thursday: openThursday,
        close_thursday: closeThursday,
        open_friday: openFriday,
        close_friday: closeFriday,
        open_saturday: openSaturday,
        close_saturday: closeSaturday,
        open_sunday: openSunday,
        close_sunday: closeSunday,
      })
      .then((response) => {
        console.log("Facility added:", response.data);
        navigateTo(`/admin`);
      })
      .catch((error) => {
        console.error("Error adding sports facility:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mainWrapper" style={showNav ? { marginTop: "-1vh" } : { marginTop: "5vh" }}>
      <h1 className="h1Header">Dodaj obiekt sportowy</h1>
      <div className="wrapperInput">
        <input className="defaultInput" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa obiektu..." required />
        <select className="defaultInput" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required>
          <option value="">Wybierz miasto</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <input className="defaultInput" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adres..." required />

        <h2 className="h2Header">Godziny otwarcia</h2>
        <div className="day-hours">
          <h3>Poniedziałek</h3>
          <input type="time" value={openMonday} onChange={(e) => setOpenMonday(e.target.value)} required />
          <input type="time" value={closeMonday} onChange={(e) => setCloseMonday(e.target.value)} required />
        </div>
        <div className="day-hours">
          <h3>Wtorek</h3>
          <input type="time" value={openTuesday} onChange={(e) => setOpenTuesday(e.target.value)} required />
          <input type="time" value={closeTuesday} onChange={(e) => setCloseTuesday(e.target.value)} required />
        </div>
        <div className="day-hours">
          <h3>Środa</h3>
          <input type="time" value={openWednesday} onChange={(e) => setOpenWednesday(e.target.value)} required />
          <input type="time" value={closeWednesday} onChange={(e) => setCloseWednesday(e.target.value)} required />
        </div>
        <div className="day-hours">
          <h3>Czwartek</h3>
          <input type="time" value={openThursday} onChange={(e) => setOpenThursday(e.target.value)} required />
          <input type="time" value={closeThursday} onChange={(e) => setCloseThursday(e.target.value)} required />
        </div>
        <div className="day-hours">
          <h3>Piątek</h3>
          <input type="time" value={openFriday} onChange={(e) => setOpenFriday(e.target.value)} required />
          <input type="time" value={closeFriday} onChange={(e) => setCloseFriday(e.target.value)} required />
        </div>
        <div className="day-hours">
          <h3>Sobota</h3>
          <input type="time" value={openSaturday} onChange={(e) => setOpenSaturday(e.target.value)} required />
          <input type="time" value={closeSaturday} onChange={(e) => setCloseSaturday(e.target.value)} required />
        </div>
        <div className="day-hours">
          <h3>Niedziela</h3>
          <input type="time" value={openSunday} onChange={(e) => setOpenSunday(e.target.value)} required />
          <input type="time" value={closeSunday} onChange={(e) => setCloseSunday(e.target.value)} required />
        </div>

        <button type="submit" className="button">
          Dodaj Obiekt
        </button>
      </div>
    </form>
  );
};

export default AddSportsFacility;
