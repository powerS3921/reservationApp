import React from "react";
import Footer from "../components/Footer";
import SlimHeader from "../components/SlimHeader";
import "../style/About.sass";

const About = ({ showNav }) => {
  return (
    <>
      <SlimHeader h1={"Dowiedz się więcej o nas!"} />
      <div className="aboutWrapper" style={showNav ? { marginTop: "50vh" } : { marginTop: "50vh" }}>
        {/* Sekcja wstępna */}
        <section className="intro-section">
          <h1>Kim jesteśmy?</h1>
          <p>
            Jesteśmy zespołem pasjonatów sportu i technologii, którzy stworzyli aplikację, by ułatwić rezerwację obiektów sportowych na wyciągnięcie ręki. Naszą misją jest
            promowanie aktywnego stylu życia i wspieranie lokalnych społeczności.
          </p>
        </section>

        {/* Sekcja misji */}
        <section className="mission-section">
          <h2>Nasza misja</h2>
          <p>
            Wierzymy, że sport jednoczy ludzi i buduje lepsze społeczności. Dlatego dążymy do tego, aby każdy mógł łatwo i szybko znaleźć miejsce do uprawiania swojego ulubionego
            sportu.
          </p>
        </section>

        {/* Sekcja z zespołem */}
        <section className="team-section">
          <h2>Nasz zespół</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="/images/people/image1.jpg" alt="Team Member 1" />
              <h3>Anna Kowalska</h3>
              <p>CEO & Założycielka</p>
            </div>
            <div className="team-member">
              <img src="/images/people/image2.jpg" alt="Team Member 2" />
              <h3>Jan Nowak</h3>
              <p>Główny programista</p>
            </div>
            <div className="team-member">
              <img src="/images/people/image3.jpg" alt="Team Member 3" />
              <h3>Katarzyna Wiśniewska</h3>
              <p>Specjalistka ds. marketingu</p>
            </div>
          </div>
        </section>

        {/* Sekcja dlaczego warto */}
        <section className="why-us-section">
          <h2>Dlaczego warto nas wybrać?</h2>
          <ul>
            <li>Łatwa i szybka rezerwacja w kilku kliknięciach</li>
            <li>Najlepsze obiekty sportowe w Twojej okolicy</li>
            <li>Transparentność cen i dostępności</li>
            <li>Wsparcie klienta 24/7</li>
          </ul>
        </section>

        {/* Sekcja kontakt */}
        <section className="contact-section">
          <h2>Skontaktuj się z nami</h2>
          <p>Jeśli masz pytania, sugestie lub potrzebujesz pomocy, skontaktuj się z nami:</p>
          <a href="mailto:kontakt@twoja-aplikacja.pl" className="email-link">
            kontakt@twoja-aplikacja.pl
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
