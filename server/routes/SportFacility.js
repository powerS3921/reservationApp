const express = require("express");
const router = express.Router();
const { SportsFacility, City } = require("../models"); // Dodaj również model City

// POST route to create a sports facility
router.post("/", async (req, res) => {
  const {
    name,
    address,
    cityId,
    open_monday,
    close_monday,
    open_tuesday,
    close_tuesday,
    open_wednesday,
    close_wednesday,
    open_thursday,
    close_thursday,
    open_friday,
    close_friday,
    open_saturday,
    close_saturday,
    open_sunday,
    close_sunday,
  } = req.body;

  try {
    // Tworzenie nowego obiektu sportowego
    const sportsFacility = await SportsFacility.create({
      name,
      address,
      CityId: cityId,
      open_monday,
      close_monday,
      open_tuesday,
      close_tuesday,
      open_wednesday,
      close_wednesday,
      open_thursday,
      close_thursday,
      open_friday,
      close_friday,
      open_saturday,
      close_saturday,
      open_sunday,
      close_sunday,
    });
    res.status(201).json(sportsFacility);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the sports facility." });
  }
});

// GET route to fetch all sports facilities (with optional city filtering)
router.get("/", async (req, res) => {
  const { city } = req.query; // Pobieranie parametru miasta (opcjonalnie)

  try {
    // Opcjonalne filtrowanie po mieście, jeśli parametr `city` został przekazany
    const condition = city ? { CityId: city } : {};

    // Pobieranie obiektów sportowych wraz z informacjami o mieście
    const sportsFacilities = await SportsFacility.findAll({
      where: condition,
      include: [{ model: City, attributes: ["name"] }], // Dołączenie informacji o mieście
    });

    res.status(200).json(sportsFacilities);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching sports facilities." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sportsFacility = await SportsFacility.findByPk(id, {
      attributes: [
        "name",
        "address",
        "open_monday",
        "close_monday",
        "open_tuesday",
        "close_tuesday",
        "open_wednesday",
        "close_wednesday",
        "open_thursday",
        "close_thursday",
        "open_friday",
        "close_friday",
        "open_saturday",
        "close_saturday",
        "open_sunday",
        "close_sunday",
      ],
    });

    if (!sportsFacility) {
      return res.status(404).json({ error: "Obiekt nie został znaleziony." });
    }

    res.status(200).json(sportsFacility);
  } catch (error) {
    console.error("Błąd przy pobieraniu danych obiektu:", error);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu danych obiektu." });
  }
});

// PUT route to update a sports facility
router.put("/:id", async (req, res) => {
  const {
    name,
    address,
    cityId,
    open_monday,
    close_monday,
    open_tuesday,
    close_tuesday,
    open_wednesday,
    close_wednesday,
    open_thursday,
    close_thursday,
    open_friday,
    close_friday,
    open_saturday,
    close_saturday,
    open_sunday,
    close_sunday,
  } = req.body;

  try {
    // Aktualizacja istniejącego obiektu sportowego
    const sportsFacility = await SportsFacility.findByPk(req.params.id);
    if (!sportsFacility) {
      return res.status(404).json({ error: "Sports facility not found." });
    }

    // Aktualizacja wartości
    await sportsFacility.update({
      name,
      address,
      CityId: cityId,
      open_monday,
      close_monday,
      open_tuesday,
      close_tuesday,
      open_wednesday,
      close_wednesday,
      open_thursday,
      close_thursday,
      open_friday,
      close_friday,
      open_saturday,
      close_saturday,
      open_sunday,
      close_sunday,
    });

    res.status(200).json(sportsFacility);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the sports facility." });
  }
});

module.exports = router;
