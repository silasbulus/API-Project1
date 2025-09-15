const express = require("express");
const router = express.Router();

const {
  profile,
  changepassword,
  addaddress,
  getAddresses,
  updateAddress,
} = require("../controllers/accountController");
const {
  verifytoken,
  validatetoken,
} = require("../middlewares/authenticateMeddleware");

router.get("/profile", verifytoken, profile);
router.post("/change-password", verifytoken, changepassword);
router.post("/Address", verifytoken, addaddress);
router.get("/get-Addresses", verifytoken, getAddresses);
router.post("/update-Address/:id", verifytoken, updateAddress);

/**
 * @swagger
 * tags:
 *   name: ACCOUNT
 *   description: User account and address management
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [ACCOUNT]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Change the user's password
 *     tags: [ACCOUNT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /address:
 *   post:
 *     summary: Add a new address
 *     tags: [ACCOUNT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 example: Lagos
 *               state:
 *                 type: string
 *                 example: Lagos
 *               postalCode:
 *                 type: string
 *                 example: 100001
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /get-Addresses:
 *   get:
 *     summary: Get all addresses of the authenticated user
 *     tags: [ACCOUNT]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user addresses
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /update-Address/{id}:
 *   post:
 *     summary: Update an existing address
 *     tags: [ACCOUNT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 example: 456 New Road
 *               city:
 *                 type: string
 *                 example: Abuja
 *               state:
 *                 type: string
 *                 example: FCT
 *               postalCode:
 *                 type: string
 *                 example: 900001
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

router.get("/profile", verifytoken, profile);
router.post("/change-password", verifytoken, changepassword);
router.post("/Address", verifytoken, addaddress);
router.get("/get-Addresses", verifytoken, getAddresses);
router.post("/update-Address/:id", verifytoken, updateAddress);

module.exports = router;


// browser url
// http://localhost:5888/api-docs