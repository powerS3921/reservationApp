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

router.post("/send-confirmation-email", async (req, res) => {
  const { sessionId } = req.body;

  try {
    const reservation = await db.query(
      `SELECT u.email, u.username, r.*, f.price, sf.name as NazwaObiektu, sf.address, s.name
       FROM reservations r
       JOIN users u ON r.userId = u.id
       JOIN fields f on r.FieldId = f.id
       JOIN sportsfacilities sf ON f.SportsFacilityId = sf.id
       JOIN sports s ON f.SportId = s.id
       WHERE r.sessionId = ? LIMIT 1`,
      {
        replacements: [sessionId],
        type: db.QueryTypes.SELECT,
      }
    );

    if (!reservation.length) {
      return res.status(404).json({ message: "Rezerwacja nie została znaleziona" });
    }
    console.log(reservation);
    const { email, username, reservationDate, startTime, endTime, price, name, address, NazwaObiektu } = reservation[0];

    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Brak klucza API SendGrid" });
    }

    sgMail.setApiKey(apiKey);

    let sportName = null;

    if (name === "Tennis") {
      sportName = "tenisa";
    } else if (name === "Koszykówka") {
      sportName = "koszykówki";
    } else {
      sportName = "squasha";
    }

    const msg = {
      to: email, // Adres odbiorcy
      from: "opielowski.maciek0309@outlook.com",
      subject: "Potwierdzenie rezerwacji",
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Potwierdzenie Rezerwacji</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Roboto Mono', monospace; background-color: #f4f4f4;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #931100; color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                          GameGalaxy
                        </td>
                      </tr>
                      <!-- Spacer -->
                      <tr>
                        <td style="height: 20px;">&nbsp;</td>
                      </tr>
                      <!-- Content -->
                      <tr>
                        <td align="center" style="padding: 20px 30px; font-size: 16px; line-height: 1.5; color: #333333;">
                          <h2 style="margin: 0; font-size: 22px; color: #931100;">Cześć ${username}!</h2>
                          <p>Obiekt <strong>${NazwaObiektu}</strong> potwierdza rezerwację boiska do <strong>${sportName}</strong> w dniu <strong>${reservationDate}</strong> o godzinie <strong>${startTime}</strong>.</p>
                          <p>Całkowita cena wynosi <strong>${price} zł</strong>.</p>
                          <p>Widzimy się pod adresem: <strong>${address}</strong>.</p>
                        </td>
                      </tr>
                      <!-- Spacer -->
                      <tr>
                        <td style="height: 20px;">&nbsp;</td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td align="center" style="padding: 10px; background-color: #931100; color: #ffffff; font-size: 14px;">
                          Pozdrawiamy, Zespół GameGalaxy
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>`,
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
