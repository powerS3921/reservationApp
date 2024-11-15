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
const { Reservation, Field, SportsFacility } = require("../models");
const { Op } = require("sequelize");
const sgMail = require("@sendgrid/mail");
const db = require("../db");
require("dotenv").config();

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

router.get("/get-email-status/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const reservation = await Reservation.findOne({
      where: { sessionId },
      attributes: ["emailSent"], // Pobierz tylko kolumnę emailSent
    });

    if (!reservation) {
      return res.status(404).json({ message: "Rezerwacja nie została znaleziona" });
    }

    res.status(200).json({ emailSent: reservation.emailSent });
  } catch (error) {
    console.error("Błąd podczas pobierania statusu emailSent:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
});

router.post("/send-confirmation-email", async (req, res) => {
  console.log("POST /send-confirmation-email wywołany");
  const { sessionId } = req.body;
  console.log("Session ID:", sessionId);

  try {
    // Pobranie informacji o rezerwacji i użytkowniku na podstawie sessionId
    const reservation = await db.query(
      `SELECT u.email, r.emailSent
       FROM reservations r
       JOIN users u ON r.userId = u.id
       WHERE r.sessionId = ? LIMIT 1`, // Use placeholder for sessionId
      {
        replacements: [sessionId], // Provide sessionId as parameter
        type: db.QueryTypes.SELECT, // Specify query type to return the result as a select
      }
    );

    if (!reservation.length || reservation[0].emailSent) {
      return res.status(404).json({ message: "Rezerwacja nie została znaleziona" });
    }

    const { email } = reservation[0];

    const apiKey = process.env.SENDGRID_API_KEY;
    // Używanie klucza z .env

    if (!apiKey) {
      return res.status(500).json({ message: "Brak klucza API SendGrid" });
    }

    sgMail.setApiKey(apiKey);

    const msg = {
      to: email, // Adres odbiorcy
      from: "opielowski.maciek0309@outlook.com", // Adres nadawcy
      subject: "Potwierdzenie rezerwacji",
      text: "Twoja rezerwacja została potwierdzona i opłacona. Dziękujemy!",
      html: "<strong>Twoja rezerwacja została potwierdzona i opłacona. Dziękujemy!</strong>",
    };

    await sgMail.send(msg);
    console.log("Email sent");
    await db.query(`UPDATE reservations SET emailSent = true WHERE sessionId = ?`, {
      replacements: [sessionId],
      type: db.QueryTypes.UPDATE,
    });
    res.status(200).json({ message: "E-mail został wysłany" });
  } catch (error) {
    console.error("Błąd przy wysyłaniu e-maila:", error);
    res.status(500).json({ message: "Błąd przy wysyłaniu e-maila" });
  }
});

router.get("/active-reservation", async (req, res) => {
  try {
    const { id } = req.query;
    const today = new Date();
    const reservations = await Reservation.findAll({
      where: {
        czyZaplacono: true,
        UserId: id,
        [Op.or]: [
          { reservationDate: { [Op.gt]: today } }, // Rezerwacje w przyszłości
          {
            reservationDate: today, // Rezerwacje na dziś
            startTime: { [Op.gt]: today.toTimeString().slice(0, 5) }, // późniejsze niż obecna godzina
          },
        ],
      },
      include: [
        {
          model: Field,
          as: "Field",
          include: [
            {
              model: SportsFacility,
              as: "sportsFacility",
              attributes: ["name"],
            },
          ],
        },
      ],
      // Dodaj informacje o powiązanych tabelach
    });
    res.json(reservations);
  } catch (error) {
    console.error("Błąd podczas pobierania rezerwacji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.get("/unpayment-reservation", async (req, res) => {
  try {
    const { id } = req.query;
    const reservations = await Reservation.findAll({
      where: {
        czyZaplacono: false,
        UserId: id,
      },
      include: [
        {
          model: Field,
          as: "Field",
          include: [
            {
              model: SportsFacility,
              as: "sportsFacility",
              attributes: ["name"],
            },
          ],
        },
      ],
      // Dodaj informacje o powiązanych tabelach
    });
    res.json(reservations);
  } catch (error) {
    console.error("Błąd podczas pobierania rezerwacji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.get("/unactive-reservation", async (req, res) => {
  try {
    const { id } = req.query;
    const today = new Date();

    // Zmieniamy zapytanie, aby uwzględniało rezerwacje dzisiejsze i przeszłe
    const reservations = await Reservation.findAll({
      where: {
        czyZaplacono: true,
        UserId: id,
        [Op.and]: [
          {
            reservationDate: { [Op.lte]: today }, // Rezerwacje dzisiejsze lub wcześniejsze
          },
          {
            [Op.or]: [
              {
                reservationDate: { [Op.lt]: today }, // Rezerwacje przeszłe (data)
              },
              {
                reservationDate: today, // Dzisiaj
                startTime: { [Op.lt]: today.toTimeString().slice(0, 5) }, // Rezerwacje dzisiejsze, które miały miejsce przed obecną godziną
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Field,
          as: "Field",
          include: [
            {
              model: SportsFacility,
              as: "sportsFacility",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    res.json(reservations);
  } catch (error) {
    console.error("Błąd podczas pobierania rezerwacji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
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
