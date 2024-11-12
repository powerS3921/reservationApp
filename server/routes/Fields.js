const express = require("express");
const router = express.Router();
const { Field, Reservation, City, Sport, FieldSize, SportsFacility } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

router.get("/", async (req, res) => {
  const { city, sport, date, sportsFacilityId } = req.query;

  const whereClause = {}; // Główna część where dla tabeli Field
  if (sport) whereClause.SportId = sport; // Filtr dla sportu
  if (sportsFacilityId) whereClause.SportsFacilityId = sportsFacilityId;

  try {
    const fields = await Field.findAll({
      where: whereClause,
      include: [
        {
          model: Sport,
          as: "Sport",
          attributes: ["name"],
        },
        {
          model: FieldSize,
          as: "fieldSize",
          attributes: ["size"],
        },
        {
          model: SportsFacility,
          as: "sportsFacility",
          attributes: ["name", "address"],
          where: city ? { CityId: city } : {}, // Filtr dla miasta w SportsFacility
          include: [
            {
              model: City,
              as: "City",
              attributes: ["name"], // Pobieranie nazwy miasta
            },
          ],
        },
      ],
    });

    res.json(fields);
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({ message: "Error fetching fields." });
  }
});

router.get("/available-fields", async (req, res) => {
  const { city, sport, date, sportsFacilityId } = req.query;

  const whereClause = {};
  if (sport) whereClause.SportId = sport;
  if (sportsFacilityId) whereClause.SportsFacilityId = sportsFacilityId;

  if (!date) {
    return res.status(400).json({ message: "Date is required." });
  }

  const selectedDate = moment(date);
  const today = moment().startOf("day");
  const isToday = selectedDate.isSame(today, "day");
  const currentTime = moment();

  const dayOfWeek = selectedDate.format("dddd").toLowerCase(); // e.g., "monday"

  try {
    const fields = await Field.findAll({
      where: whereClause,
      include: [
        {
          model: Sport,
          as: "Sport",
          attributes: ["name"],
        },
        {
          model: FieldSize,
          as: "fieldSize",
          attributes: ["size"],
        },
        {
          model: SportsFacility,
          as: "sportsFacility",
          attributes: ["name", "address", `open_${dayOfWeek}`, `close_${dayOfWeek}`],
          include: [
            {
              model: City,
              as: "City",
              attributes: ["name"],
              where: city ? { id: city } : {},
            },
          ],
        },
      ],
    });

    const availableFields = [];

    for (const field of fields) {
      const openingHour = field.sportsFacility[`open_${dayOfWeek}`];
      const closingHour = field.sportsFacility[`close_${dayOfWeek}`];

      if (!openingHour || !closingHour) continue;

      let openingTime = moment(openingHour, "HH:mm");
      const closingTime = moment(closingHour, "HH:mm");

      if (isToday && currentTime.isAfter(openingTime)) {
        openingTime = moment.max(currentTime.clone(), openingTime);
      }

      const totalAvailableSlots = Math.floor(closingTime.diff(openingTime, "hours"));

      const reservationsCount = await Reservation.count({
        where: {
          FieldId: field.id,
          reservationDate: date,
          startTime: {
            [Op.gte]: openingTime.format("HH:mm"),
          },
          endTime: {
            [Op.lte]: closingTime.format("HH:mm"),
          },
        },
      });

      if (reservationsCount < totalAvailableSlots) {
        availableFields.push(field);
      }
    }

    res.json(availableFields);
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({ message: "Error fetching fields." });
  }
});

router.get("/field/:fieldId/date/:date", async (req, res) => {
  const { fieldId, date } = req.params;

  try {
    const reservations = await Reservation.findAll({
      where: {
        FieldId: fieldId,
        reservationDate: date,
      },
      attributes: ["startTime"],
    });

    const reservedHours = reservations.map(
      (reservation) => reservation.startTime.substring(0, 5) // Przykład konwersji do formatu HH:mm
    );

    res.status(200).json(reservedHours);
  } catch (error) {
    console.error("Błąd przy pobieraniu rezerwacji:", error);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu rezerwacji." });
  }
});

router.post("/", async (req, res) => {
  const { sportId, sizeId, price, SportsFacilityId } = req.body; // Dodaj sizeId
  console.log(req.body);
  try {
    const field = await Field.create({ SportId: sportId, sizeId, price, SportsFacilityId });
    res.status(201).json(field);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating field." });
  }
});

router.put("/:id", async (req, res) => {
  const { sportId, sizeId, price, SportsFacilityId } = req.body;
  try {
    const field = await Field.update({ SportId: sportId, sizeId, price, SportsFacilityId }, { where: { id: req.params.id } });

    if (field[0] === 0) {
      return res.status(404).json({ error: "Field not found." });
    }
    const updatedField = await Field.findByPk(req.params.id);
    res.json(updatedField);
  } catch (error) {
    console.error("Error updating field:", error);
    res.status(500).json({ error: "An error occurred while updating field." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Reservation.destroy({ where: { FieldId: id } });
  await Field.destroy({ where: { id } });
  res.json({ success: true });
});

module.exports = router;
