import "./style/App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "./helpers/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Offert from "./pages/Offert";
import ResetPassword from "./pages/ResetPassword";
import FieldList from "./pages/FieldList";
import FieldReservationList from "./pages/FieldReservationList";
import AddField from "./pages/AddField";
import AddFieldReservation from "./pages/AddFieldReservation";
import HomeLogged from "./pages/HomeLogged";

function App() {
  const [authState, setAuthState] = useState({ username: "", id: "", status: false });
  const [activeClassNav, setActiveClassNav] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) setAuthState({ ...authState, status: false });
        else setAuthState({ username: response.data.username, id: response.data.id, status: true });
      });
  }, []);

  const switchClassActive = () => {
    setActiveClassNav(!activeClassNav);
  };

  const switchClassActiveToFalse = () => {
    setActiveClassNav(false);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    setActiveClassNav(false);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navBar">
            <div className="leftNavBarLinks">
              {!authState.status ? (
                <>
                  <Link to="/login" className="link" onClick={switchClassActiveToFalse}>
                    Login
                  </Link>
                  <Link to="/register" className="link" onClick={switchClassActiveToFalse}>
                    Register
                  </Link>
                </>
              ) : (
                <Link to="/login" className="link" onClick={logout}>
                  Logout
                </Link>
              )}
            </div>
            <div className={activeClassNav ? "rightNavBarLinks active" : "rightNavBarLinks"}>
              <Link to={!authState.status ? "/" : `/${authState.id}`} className="link" onClick={switchClassActiveToFalse}>
                Home
              </Link>
              <Link to="/offert" className="link" onClick={switchClassActiveToFalse}>
                Offert
              </Link>
              <Link to="/galeria" className="link" onClick={switchClassActiveToFalse}>
                Gallery
              </Link>
              <Link to="/about" className="link" onClick={switchClassActiveToFalse}>
                About
              </Link>
            </div>
            <div className="iconNavBar">
              {!activeClassNav ? <MenuIcon onClick={switchClassActive} style={{ fontSize: "30px" }} /> : <CloseIcon onClick={switchClassActive} style={{ fontSize: "30px" }} />}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<HomeLogged />} />
            <Route path="/:id" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/offert" element={<Offert />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/fields" element={<FieldList />} />
            <Route path="/field-reservations/:id" element={<FieldReservationList />} />
            <Route path="/add-field" element={<AddField />} />
            <Route path="/add-field-reservation/:id" element={<AddFieldReservation />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
