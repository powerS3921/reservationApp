const express = require("express");
const router = express.Router();
const { FieldSize } = require("../models"); // Upewnij się, że importujesz odpowiedni model

// GET: Pobierz rozmiary boisk na podstawie SportId
router.get("/", async (req, res) => {
  try {
    const { sportId } = req.query; // Pobierz sportId z zapytania

    // Wyszukiwanie rozmiarów boisk na podstawie sportId
    const fieldSizes = await FieldSize.findAll({
      where: {
        SportId: sportId, // Filtruj po SportId
      },
    });

    res.json(fieldSizes); // Zwróć znalezione rozmiary boisk
  } catch (error) {
    console.error("Error fetching field sizes:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
