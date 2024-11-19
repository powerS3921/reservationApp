import React from "react";
import Footer from "../components/Footer";
import SlimHeader from "../components/SlimHeader";
import "../style/Offert.sass";

const Offert = ({ showNav }) => {
  return (
    <>
      <SlimHeader h1={"Zapoznaj się z naszą ofertą!"} />
      <div className="offerWrapper" style={showNav ? { marginTop: "50vh" } : { marginTop: "56vh" }}>
        {/* Wstępna sekcja */}
        <section className="intro-section">
          <h1>Nasza oferta</h1>
          <p>
            Oferujemy szeroki wybór obiektów sportowych, dostosowanych do potrzeb każdej osoby – od amatorów po profesjonalistów. Znajdź idealne miejsce do gry, treningu lub
            rekreacji.
          </p>
        </section>

        {/* Rodzaje obiektów */}
        <section className="types-section">
          <h2>Rodzaje obiektów sportowych</h2>
          <div className="types-grid">
            <div className="type-item">
              <img src="/images/facility/image1.jpg" alt="Boisko do piłki nożnej" />
              <h3>Boiska do piłki nożnej</h3>
              <p>Idealne dla drużyn amatorskich i profesjonalnych.</p>
            </div>
            <div className="type-item">
              <img src="/images/facility/image2.jpg" alt="Boisko do koszykówki" />
              <h3>Boiska do koszykówki</h3>
              <p>Znajdź najlepsze miejsce na rzuty za trzy punkty.</p>
            </div>
            <div className="type-item">
              <img src="/images/facility/image3.jpg" alt="Korty tenisowe" />
              <h3>Korty tenisowe</h3>
              <p>Rezerwuj korty o idealnych nawierzchniach.</p>
            </div>
            <div className="type-item">
              <img src="/images/facility/image4.jpg" alt="Baseny" />
              <h3>Baseny</h3>
              <p>Doskonałe warunki do pływania i relaksu.</p>
            </div>
          </div>
        </section>

        {/* Zalety naszej oferty */}
        <section className="benefits-section">
          <h2>Dlaczego warto skorzystać z naszej oferty?</h2>
          <ul>
            <li>Obiekty sportowe najwyższej jakości</li>
            <li>Dostępność w dogodnych godzinach</li>
            <li>Prosta i szybka rezerwacja online</li>
            <li>Transparentność cen i dostępności</li>
          </ul>
        </section>

        {/* Wezwanie do działania */}
        <section className="cta-section">
          <h2>Zarezerwuj już teraz!</h2>
          <p>Nie czekaj – znajdź idealne miejsce do gry i zarezerwuj je w kilka kliknięć.</p>
          <a href="/login" className="cta-button">
            Przeglądaj obiekty
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Offert;
