/**
 * @swagger
 * tags:
 *   name: Fields
 *   description: API endpoints for managing fields
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Field:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - capacity
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the field
 *         name:
 *           type: string
 *           description: The name of the field
 *         location:
 *           type: string
 *           description: The location of the field
 *         capacity:
 *           type: integer
 *           description: The capacity of the field
 *     NewField:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the new field
 *         location:
 *           type: string
 *           description: The location of the new field
 */

const express = require("express");
const router = express.Router();
const { Field, Reservation } = require("../models");

/**
 * @swagger
 * /fields:
 *   get:
 *     summary: Pobierz listę boisk
 *     tags: [Fields]
 *     responses:
 *       '200':
 *         description: Pomyślnie pobrano listę boisk
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Field'
 */

router.get("/", async (req, res) => {
  const fields = await Field.findAll();
  res.json(fields);
});

/**
 * @swagger
 * /fields:
 *   post:
 *     summary: Dodaj nowe boisko
 *     tags: [Fields]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewField'
 *     responses:
 *       '201':
 *         description: Pomyślnie dodano nowe boisko
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Field'
 */

router.post("/", async (req, res) => {
  const { name, location, size } = req.body;
  const field = await Field.create({ name, location, capacity: size });
  res.status(201).json(field);
});

/**
 * @swagger
 * /fields/{id}:
 *   put:
 *     summary: Aktualizuj informacje o boisku
 *     tags: [Fields]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID boiska
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Field'
 *     responses:
 *       '200':
 *         description: Pomyślnie zaktualizowano informacje o boisku
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Field'
 */

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, location, capacity } = req.body;
  const field = await Field.update({ name, location, capacity }, { where: { id } });
  res.json(field);
});

/**
 * @swagger
 * /fields/{id}:
 *   delete:
 *     summary: Usuń boisko
 *     tags: [Fields]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID boiska
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Pomyślnie usunięto boisko
 *       '404':
 *         description: Boisko nie zostało znalezione
 */

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Reservation.destroy({ where: { FieldId: id } });
  await Field.destroy({ where: { id } });
  res.json({ success: true });
});

module.exports = router;
