const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgetPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authcontroller");
const { validatetoken } = require("../middlewares/authenticateMeddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgetpassword", forgetPassword);
router.post("/verify-otp", validatetoken, verifyOtp);
router.post("/reset-password", validatetoken, resetPassword);

/**
 * @swagger
 * tags:
 *   name: AUTH
 *   description: Authentication and user account management
 */
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /forgetpassword:
 *   post:
 *     summary: Request a password reset (send OTP to email)
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Email not found
 */

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [AUTH]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset user password after OTP verification
 *     tags: [AUTH]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/register", register);
router.post("/login", login);
router.post("/forgetpassword", forgetPassword);
router.post("/verify-otp", validatetoken, verifyOtp);
router.post("/reset-password", validatetoken, resetPassword);

module.exports = router;


// browser url
// http://localhost:5888/api-docs