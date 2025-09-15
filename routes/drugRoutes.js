// routes/drugRoutes.js
const express = require("express");
const router = express.Router();
const product = require("../models/productModel");

router.get("/drugs", async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const drugs = await product.find(query);
    res.json({ status: 200, data: drugs });
  } catch (err) {
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

/**
 * @swagger
 * /drugs:
 *   get:
 *     summary: Search and filter drugs
 *     tags: [DRUGS]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search drugs by name (case-insensitive)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Antibiotic, Painkiller, Vitamin]
 *         description: Filter drugs by category
 *     responses:
 *       200:
 *         description: List of drugs matching filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64e9f34c1a2d45e7a1234567
 *                       name:
 *                         type: string
 *                         example: Paracetamol
 *                       category:
 *                         type: string
 *                         example: Painkiller
 *                       description:
 *                         type: string
 *                         example: Used to relieve pain and reduce fever.
 *                       price:
 *                         type: number
 *                         example: 5.99
 *       500:
 *         description: Server error
 */

router.get("/drugs", async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive
    }
    if (category) {
      query.category = category;
    }

    const drugs = await product.find(query);
    res.json({ status: 200, data: drugs });
  } catch (err) {
    res.status(500).json({ status: 500, message: "Server error" });
  }
});


// browser url
// http://localhost:5888/api-docs

module.exports = router;
