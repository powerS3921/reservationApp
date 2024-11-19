import React from "react";
import { Link } from "react-router-dom";
import "../style/ContentMainPage.sass";

const ContentMainPage = ({ showNav, username }) => {
  return (
    <div className="mainWrapperContent" style={showNav ? { marginTop: "100vh" } : { marginTop: "106vh" }}>
      {/* Sekcja z opisem aplikacji */}
      <section className="about-section">
        <h1>Witaj w naszej aplikacji rezerwacyjnej!</h1>
        <p>Oferujemy łatwe i szybkie rezerwacje obiektów sportowych w Twojej okolicy. Wybierz miasto, rodzaj sportu i dostępny termin – resztą zajmiemy się my!</p>
        <Link to={`${username ? "/reservation" : "/login"}`} className="cta-button">
          Zarezerwuj teraz
        </Link>
      </section>

      {/* Sekcja z korzyściami */}
      <section className="benefits-section">
        <h2>Dlaczego warto korzystać z naszej aplikacji?</h2>
        <ul>
          <li>Szybka i intuicyjna obsługa</li>
          <li>Natychmiastowe potwierdzenie rezerwacji</li>
          <li>Przejrzysty wybór obiektów</li>
          <li>Możliwość filtrowania według miasta i sportu</li>
        </ul>
      </section>

      {/* Sekcja z funkcjami */}
      <section className="features-section">
        <h2>Co oferujemy?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Rezerwacje online</h3>
            <p>Bez wychodzenia z domu, wszystko załatwisz w kilka kliknięć.</p>
          </div>
          <div className="feature-item">
            <h3>Elastyczność</h3>
            <p>Znajdź wolny termin dostosowany do Twojego grafiku.</p>
          </div>
          <div className="feature-item">
            <h3>Bezpieczeństwo</h3>
            <p>Twoje dane są u nas w pełni bezpieczne.</p>
          </div>
        </div>
      </section>

      {/* Sekcja z opiniami */}
      <section className="reviews-section">
        <h2>Opinie naszych użytkowników</h2>
        <div className="reviews">
          <blockquote>
            <p>"Najlepsza aplikacja do rezerwacji obiektów sportowych! Prosta w obsłudze i bardzo szybka."</p>
            <footer>- Anna K.</footer>
          </blockquote>
          <blockquote>
            <p>"Znalazłem idealne boisko do gry w piłkę nożną w moim mieście. Gorąco polecam!"</p>
            <footer>- Tomasz W.</footer>
          </blockquote>
        </div>
      </section>

      {!username ? (
        <section className="call-to-action">
          <h2>Nie czekaj – zacznij już dziś!</h2>
          <p>Dołącz do setek zadowolonych użytkowników, którzy zarezerwowali swoje ulubione obiekty sportowe za pomocą naszej aplikacji.</p>
          <Link to="/register" className="cta-button">
            Załóż konto
          </Link>
        </section>
      ) : null}
    </div>
  );
};

export default ContentMainPage;
