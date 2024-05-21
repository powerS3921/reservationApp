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
  const { fieldId, userId, startTime, endTime } = req.body;
  const reservation = await Reservation.create({ FieldId: fieldId, UserId: userId, startDate: startTime, endDate: endTime });
  res.status(201).json(reservation);
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

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { fieldId, userId, startTime, endTime } = req.body;
  const reservation = await Reservation.update({ fieldId, userId, startDate: startTime, endDate: endTime }, { where: { id } });
  res.json(reservation);
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
