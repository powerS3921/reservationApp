import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../style/SlimHeader.sass";
import "../style/Home.sass";

const Header = ({ username, h1, h2 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = ["/images/first.png", "/images/second.jpg", "/images/third.jpg"];
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  const handleDotClick = (index) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <>
      <div className="slimHeaderSliderContainer">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5 }}
            className="header"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          ></motion.div>
        </AnimatePresence>

        <div className="dots-container">
          {images.map((_, index) => (
            <span key={`dot-${index}`} className={`dot ${currentIndex === index ? "active" : ""}`} onClick={() => handleDotClick(index)} />
          ))}
        </div>

        <div className="headerCapture">
          <h1>{h1}</h1>
          <h2>{h2}</h2>
        </div>
      </div>
    </>
  );
};

export default Header;
