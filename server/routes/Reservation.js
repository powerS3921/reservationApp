/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API endpoints for managing reservations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - fieldId
 *         - userId
 *         - startDate
 *         - endDate
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the reservation
 *         fieldId:
 *           type: integer
 *           description: The id of the field being reserved
 *         userId:
 *           type: integer
 *           description: The id of the user making the reservation
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the reservation
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The end date and time of the reservation
 */

const express = require("express");
const router = express.Router();
const { Reservation } = require("../models");
const { Op } = require("sequelize");

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Pobierz listę rezerwacji
 *     tags: [Reservations]
 *     responses:
 *       '200':
 *         description: Pomyślnie pobrano listę rezerwacji
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */

router.get("/", async (req, res) => {
  const reservations = await Reservation.findAll();
  res.json(reservations);
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Dodaj nową rezerwację
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       '201':
 *         description: Pomyślnie dodano nową rezerwację
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */

router.post("/", async (req, res) => {
  const { fieldId, userId, reservationDate, startTime, endTime } = req.body;

  try {
    // Create the reservation
    const reservation = await Reservation.create({
      FieldId: fieldId,
      UserId: userId,
      reservationDate: reservationDate,
      startTime: startTime,
      endTime: endTime,
      czyZaplacono: false, // default value
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Błąd podczas tworzenia rezerwacji:", error);
    res.status(500).json({ error: "Nie udało się utworzyć rezerwacji." });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Aktualizuj informacje o rezerwacji
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID rezerwacji
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       '200':
 *         description: Pomyślnie zaktualizowano informacje o rezerwacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */

router.put("/:id/update-session", async (req, res) => {
  const { id } = req.params;
  const { sessionId } = req.body;

  try {
    // Update the reservation with the sessionId
    await Reservation.update({ sessionId }, { where: { id } });
    res.status(200).json({ message: "Reservation updated with sessionId" });
  } catch (error) {
    console.error("Error updating reservation with sessionId:", error);
    res.status(500).json({ error: "Failed to update reservation with sessionId." });
  }
});

router.put("/update-payment", async (req, res) => {
  const { sessionId } = req.body;

  try {
    // Sprawdzamy, czy rezerwacja z sessionId już została opłacona
    const reservation = await Reservation.findOne({ where: { sessionId } });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Jeśli rezerwacja już jest opłacona, nie aktualizujemy
    if (reservation.czyZaplacono) {
      return res.status(400).json({ error: "Reservation already paid" });
    }

    // Aktualizujemy status płatności
    await Reservation.update({ czyZaplacono: true }, { where: { sessionId } });

    res.status(200).json({ message: "Payment confirmed and reservation updated" });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Usuń rezerwację
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID rezerwacji
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Pomyślnie usunięto rezerwację
 *       '404':
 *         description: Rezerwacja nie została znaleziona
 */

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Reservation.destroy({ where: { id } });
  res.json({ success: true });
});

module.exports = router;
