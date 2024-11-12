import React from "react";
import "../style/Footer.sass";
import { FaFacebookF } from "react-icons/fa6";
import { FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";

const Footer = () => {
  return (
    <div className="footerWrapper">
      <div className="mainFooter">
        <div className="leftFooter">
          <h1 className="logoInFooter">GameGalaxy</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium numquam quo ratione quasi aliquid accusamus assumenda optio esse cumque quas? Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Officiis unde recusandae voluptatum nemo, nostrum perspiciatis et excepturi ex enim velit alias fugiat ipsam earum ducimus iste
          </p>
          <ul className="icons">
            <li>
              <a href="http://www.facebook.com" target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
            </li>
            <li>
              <a href="http://www.linkedin.com" target="_blank" rel="noreferrer">
                <FaLinkedinIn />
              </a>
            </li>
            <li>
              <a href="http://www.twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
            </li>
            <li>
              <a href="http://www.youtube.com" target="_blank" rel="noreferrer">
                <FaYoutube />
              </a>
            </li>
          </ul>
        </div>
        <div className="rightFooter">
          <h1>Kontakt</h1>
          <h2>Napisz do nas:</h2>
          <div className="email">
            <IoIosMail className="icon" />
            <a href="mailto:contact@gamegalaxy.pl">contact@gamegalaxy.pl</a>
          </div>
          <h2>Nasze lokalizacje:</h2>
          <div className="writeToUs">
            <div className="location">
              <IoLocationSharp className="icon" />
              <div className="address">
                <span>Kraków</span>
                <span>ul. Księcia Józefa 45</span>
                <span>31-546 Kraków</span>
                <span>+48 588 788 955</span>
              </div>
            </div>
            <div className="location">
              <IoLocationSharp className="icon" />
              <div className="address">
                <span>Warszawa</span>
                <span>ul. Kordylewskiego 88</span>
                <span>35-888 Warszawa</span>
                <span>+48 654 987 444</span>
              </div>
            </div>
            <div className="location">
              <IoLocationSharp className="icon" />
              <div className="address">
                <span>Katowice</span>
                <span>ul. Podkarpacka 102</span>
                <span>30-456 Katowice</span>
                <span>+48 222 111 333</span>
              </div>
            </div>
            <div className="location">
              <IoLocationSharp className="icon" />
              <div className="address">
                <span>Lublin</span>
                <span>ul. Zielona 42</span>
                <span>35-888 Lublin</span>
                <span>+48 874 545 222</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">&copy; GameGalaxy 2024 Wszelkie prawa zastrzeżone</div>
    </div>
  );
};

export default Footer;
