const express = require("express");
const router = express.Router();
const roleMiddleware = require("../middlewares/roleMeddleware");
const dashboardController = require("../controllers/dashboardController");

const {
  initializePayment,
  verifyPayment,
  verify,
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/ordersController");
const {
  verifytoken,
  checkuser,
  checkadmin,
} = require("../middlewares/authenticateMeddleware");

router.post("/place-order", verifytoken, placeOrder);
router.get("/orders", verifytoken, getMyOrders);
router.get("/orders/:id", verifytoken, getOrderById);
router.get("/checkout/:addressid", verifytoken, initializePayment);
router.get("/verify", verifytoken, verifyPayment);
router.get("/web-verify", verify);

router.get(
  "/user",
  verifytoken,
  roleMiddleware(["user", "admin"]),
  dashboardController.userStats
);

/**
 * @swagger
 * tags:
 *   name: ORDER
 *   description: Order and checkout management
 */
/**
 * @swagger
 * /checkout/{addressid}:
 *   get:
 *     summary: Initialize payment for checkout
 *     tags: [ORDER]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressid
 *         required: true
 *         schema:
 *           type: string
 *         description: The address ID for checkout
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /verify:
 *   get:
 *     summary: Verify payment
 *     tags: [ORDER]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /web-verify:
 *   get:
 *     summary: Verify payment via web (no authentication required)
 *     tags: [ORDER]
 *     responses:
 *       200:
 *         description: Web verification successful
 *       400:
 *         description: Invalid or expired verification
 */

/**
 * @swagger
 * /place-order:
 *   post:
 *     summary: Place a new order
 *     tags: [ORDER]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64e9f34c1a2d45e7a1234567
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               addressId:
 *                 type: string
 *                 example: 64e9f34c1a2d45e7a7654321
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders of the authenticated user
 *     tags: [ORDER]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [ORDER]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: "Get dashboard stats for user (roles: user, admin)"
 *     tags: [ORDER]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       403:
 *         description: Forbidden – insufficient role
 *       401:
 *         description: Unauthorized
 */


router.get("/place-order", verifytoken, placeOrder);
router.get("/orders", verifytoken, getMyOrders);
router.get("/orders/:id", verifytoken, getOrderById);
router.get("/checkout/:addressid", verifytoken, initializePayment);
router.get("/verify", verifytoken, verifyPayment);
router.get("/web-verify", verify);

router.get(
  "/user",
  verifytoken,
  roleMiddleware(["user", "admin"]),
  dashboardController.userStats
);

module.exports = router;

// {
//   "items": [
//     {
//       "productId": "68c055559414d438dedd3986",
//       "quantity": 2,
//       "price": 1500
//     },
//     {
//       "productId": "68c0aa48949b89bfd56071a5",
//       "quantity": 1,
//       "price": 800
//     }
//   ],
//   "address": "123 Main Street, Abuja",
//   "total": 3800,
//   "reference": "PAY-1234567890"
// }


// brouser url
// http://localhost:5888/api-docs