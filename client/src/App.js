import "./style/App.sass";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { AuthContext } from "./helpers/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Offert from "./pages/Offert";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import FieldList from "./pages/FieldList";
import FieldReservationList from "./pages/FieldReservationList";
import AddField from "./pages/AddField";
import AllFieldList from "./pages/AllFieldList";
import AddFieldReservation from "./pages/AddFieldReservation";
import HomeLogged from "./pages/HomeLogged";
import EditField from "./pages/EditField";
import EditFieldReservation from "./pages/EditFieldReservation";
import Reservation from "./pages/Reservation";
import Facilities from "./pages/Facilities";
import AddSportFacility from "./pages/AddSportFacility";
import EditFacilities from "./pages/EditFacilities";
import SubmitReservation from "./pages/SubmitReservation";
import ConfirmReservation from "./pages/ConfirmReservation";
import ConfirmationPage from "./pages/ConfirmationPage";
import Profile from "./pages/Profile";
import ConfirmEmail from "./pages/ConfirmEmail";

function App() {
  const [authState, setAuthState] = useState({ username: "", id: "", status: false });
  const [activeClassNav, setActiveClassNav] = useState(false);
  const [ifAdmin, setIfAdmin] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [usernameId, setUsernameId] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [activePeopleIcon, setActivePeopleIcon] = useState(false);

  const scrolling = useRef(false);

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

  useEffect(() => {
    if (authState.id) {
      axios.get(`http://localhost:3001/auth/basicinfo/${authState.id}`).then((res) => {
        setIfAdmin(res.data.role);
        setUsername(res.data.username);
        setUsernameId(res.data.id);
        setIsLoading(false);
      });
    }
  }, [authState.id]);

  const switchClassActive = () => {
    setActiveClassNav(!activeClassNav);
    setActivePeopleIcon(true);
  };

  const switchClassActiveToFalse = () => {
    setActiveClassNav(false);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    setActiveClassNav(false);
    setActivePeopleIcon(false);
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setShowNav(true);
      scrolling.current = true;
    } else {
      setShowNav(false);
      scrolling.current = false;
    }
  };

  const handleMouseMove = (event) => {
    if (!scrolling.current) {
      if (event.clientY < 300) {
        setShowNav(true);
      } else if (event.clientY > 100 && !scrolling.current) {
        setShowNav(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const switchPeopleClassActive = () => {
    setActivePeopleIcon(!activePeopleIcon);
    setActiveClassNav(false);
  };

  const switchPeopleClassActiveToFalse = () => {
    setActivePeopleIcon(false);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className={showNav ? "navBar active" : "navBar"}>
            <Link to="/" className="logo">
              GameGalaxy
            </Link>
            <div className={activeClassNav ? "linkAndLogin active" : "linkAndLogin"}>
              <div className="rightNavBarLinks">
                <Link to="/" className="link" onClick={switchClassActiveToFalse}>
                  Strona główna
                </Link>
                {authState.status ? (
                  <Link to="/reservation" className="link" onClick={switchClassActiveToFalse}>
                    Rezerwacja
                  </Link>
                ) : (
                  <Link to="/offert" className="link" onClick={switchClassActiveToFalse}>
                    Oferta
                  </Link>
                )}
                <Link to="/galeria" className="link" onClick={switchClassActiveToFalse}>
                  Galeria
                </Link>
                <Link to="/about" className="link" onClick={switchClassActiveToFalse}>
                  O nas
                </Link>
                {ifAdmin && authState.status ? (
                  <Link to="/admin" className="link" onClick={switchClassActiveToFalse}>
                    Panel admina
                  </Link>
                ) : null}
              </div>
              <div className={activePeopleIcon ? "active leftNavBarLinks" : "leftNavBarLinks"}>
                {!authState.status ? (
                  <>
                    <Link to="/login" className="link" onClick={switchPeopleClassActiveToFalse}>
                      Logowanie
                    </Link>
                    <Link to="/register" className="link" onClick={switchPeopleClassActiveToFalse}>
                      Rejestracja
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={`/profile/${authState.id}`} className="link" onClick={switchPeopleClassActiveToFalse}>
                      Mój profil
                    </Link>
                    <Link to="/" className="link" onClick={logout}>
                      Wyloguj
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="profileButton">
              <BsPersonCircle style={{ fontSize: "30px" }} className="linkProfileButtonPeople" onClick={switchPeopleClassActive} />
              {!activePeopleIcon ? (
                <AiOutlineLeft onClick={switchPeopleClassActive} style={{ fontSize: "20px" }} className="linkProfileButtonArrow" />
              ) : (
                <AiOutlineRight onClick={switchPeopleClassActive} style={{ fontSize: "20px" }} className="linkProfileButtonArrow" />
              )}
            </div>

            <div className="iconNavBar">
              {!activeClassNav ? <MenuIcon onClick={switchClassActive} style={{ fontSize: "30px" }} /> : <CloseIcon onClick={switchClassActive} style={{ fontSize: "30px" }} />}
            </div>
          </div>

          <Routes>
            <Route path="/" element={authState.status ? <HomeLogged username={username} showNav={showNav} /> : <Home showNav={showNav} />} />
            <Route path="/about" element={<About showNav={showNav} />} />
            <Route path="/galeria" element={<Gallery showNav={showNav} />} />
            <Route path="/login" element={<Login showNav={showNav} />} />
            <Route path="/register" element={<Register showNav={showNav} />} />
            <Route path="/offert" element={<Offert showNav={showNav} />} />
            <Route path="/reservation" element={<Reservation showNav={showNav} />} />
            <Route path="/Admin" element={<Admin showNav={showNav} />} />
            <Route path="/resetpassword" element={<ResetPassword showNav={showNav} />} />
            <Route path="/fields" element={<AllFieldList showNav={showNav} />} />
            <Route path="/fields/:id" element={<FieldList showNav={showNav} />} />
            <Route path="/field-reservations" element={<FieldReservationList showNav={showNav} />} />
            <Route path="/add-field/:id" element={<AddField showNav={showNav} />} />
            <Route path="/add-facility" element={<AddSportFacility showNav={showNav} />} />
            <Route path="/edit-facility/:id" element={<EditFacilities showNav={showNav} />} />
            <Route path="/facility" element={<Facilities showNav={showNav} />} />
            <Route path="/add-field-reservation/:id" element={<AddFieldReservation />} />
            <Route path="/edit-field/:id" element={<EditField showNav={showNav} />} />
            <Route path="/edit-reservation/:id" element={<EditFieldReservation showNav={showNav} />} />
            <Route path="/submit-resservation/:id" element={<SubmitReservation showNav={showNav} />} />
            <Route path="/confirm-reservation" element={<ConfirmReservation showNav={showNav} userID={usernameId} />} />
            <Route path="/confirmation-page" element={<ConfirmationPage showNav={showNav} />} />
            <Route path="/profile/:id" element={<Profile showNav={showNav} username={username} />} />
            <Route path="/confirm-email/:token" element={<ConfirmEmail showNav={showNav} />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
