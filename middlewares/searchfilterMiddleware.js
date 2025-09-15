// routes/drugRoutes.js
const express = require("express");
const router = express.Router();
const Drug = require("../models/drugModel");

router.get("/search", async (req, res) => {
  try {
    const { q, category } = req.query;

    let query = {};

    if (q) {
      query.name = { $regex: q, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const drugs = await Drug.find(query);
    res.json(drugs);
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
