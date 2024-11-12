const express = require("express");
const router = express.Router();
const { Sport } = require("../models"); // Adjust the path if necessary

router.get("/", async (req, res) => {
  try {
    const sports = await Sport.findAll();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching sports." });
  }
});

module.exports = router;
