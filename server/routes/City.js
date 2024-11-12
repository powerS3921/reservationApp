const express = require("express");
const router = express.Router();
const { City } = require("../models"); // Ensure you're importing the City model correctly

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get a list of cities
 *     tags: [Cities]
 *     responses:
 *       '200':
 *         description: Successfully retrieved list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */

router.get("/cities", async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "An error occurred while fetching cities." });
  }
});

module.exports = router;
