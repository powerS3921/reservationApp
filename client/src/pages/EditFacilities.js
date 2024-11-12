import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../style/AddFacility.sass";

const EditFacilities = ({ showNav }) => {
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
  const location = useLocation();

  useEffect(() => {
    fetchCities();
    // If editing an existing facility, populate form fields with its data
    if (location.state && location.state.facility) {
      const facility = location.state.facility;
      setName(facility.name);
      setSelectedCity(facility.CityId);
      setAddress(facility.address);
      setOpenMonday(facility.open_monday);
      setCloseMonday(facility.close_monday);
      setOpenTuesday(facility.open_tuesday);
      setCloseTuesday(facility.close_tuesday);
      setOpenWednesday(facility.open_wednesday);
      setCloseWednesday(facility.close_wednesday);
      setOpenThursday(facility.open_thursday);
      setCloseThursday(facility.close_thursday);
      setOpenFriday(facility.open_friday);
      setCloseFriday(facility.close_friday);
      setOpenSaturday(facility.open_saturday);
      setCloseSaturday(facility.close_saturday);
      setOpenSunday(facility.open_sunday);
      setCloseSunday(facility.close_sunday);
    }
  }, [location.state]);

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
    const payload = {
      name,
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
    };

    // Use PUT if editing or POST if creating a new facility
    const request =
      location.state && location.state.facility
        ? axios.put(`http://localhost:3001/api/sportfacility/${location.state.facility.id}`, payload)
        : axios.post("http://localhost:3001/api/sportfacility", payload);

    request
      .then((response) => {
        console.log("Facility saved:", response.data);
        navigateTo("/admin");
      })
      .catch((error) => {
        console.error("Error saving sports facility:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mainWrapper" style={showNav ? { marginTop: "-1vh" } : { marginTop: "5vh" }}>
      <h1 className="h1Header">Edytuj obiekt sportowy</h1>
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
          Zapisz
        </button>
      </div>
    </form>
  );
};

export default EditFacilities;
