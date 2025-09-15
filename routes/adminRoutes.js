const express = require("express");
const router = express.Router();
const roleMiddleware = require("../middlewares/roleMeddleware");
const dashboardController = require("../controllers/dashboardController");

const {
  createProduct,
  retrieveProduct,
  updateProduct,
  filterproduct,
  productDetails,
  deleteProduct,

  addcart,
  fetchcart,
  deletecart,
  addwish,
  fetchwishlist,
  deletewish,
} = require("../controllers/productController");

const {
  viewAccounts,
  viewSingleAccount,
  updateAccountStatus,
} = require("../controllers/adminController");
const {
  verifytoken,
  validatetoken,
  checkuser,
  checkadmin,
} = require("../middlewares/authenticateMeddleware");
const {
  placeOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/ordersController");

router.get("/view-Accounts", verifytoken, checkadmin, viewAccounts);
router.get(
  "/viewSingle-Account/:id",
  verifytoken,
  checkadmin,
  viewSingleAccount
);
router.get(
  "/updateAccount-Status/:id/:status",
  verifytoken,
  checkadmin,
  updateAccountStatus
);

router.post("/product", roleMiddleware(["admin"]), createProduct);
router.get("/product", roleMiddleware(["admin"]), retrieveProduct);
router.get("/products", roleMiddleware(["admin"]), filterproduct);
router.put("/product/:sku", roleMiddleware(["admin"]), updateProduct);
router.get("/product/:sku", roleMiddleware(["admin"]), productDetails);
router.delete("/product/:sku", roleMiddleware(["admin"]), deleteProduct);

router.post("/cart/:sku", roleMiddleware(["admin"]), addcart);
router.get("/cart", roleMiddleware(["admin"]), fetchcart);
router.delete("/cart/:id", roleMiddleware(["admin"]), deletecart);

router.get("/wishlist/:sku", roleMiddleware(["admin"]), addwish);
router.get("/wishlist", roleMiddleware(["admin"]), fetchwishlist);
router.delete("/wishlist/:id", roleMiddleware(["admin"]), deletewish);

router.post(
  "/admin/place-order",
  verifytoken,
  roleMiddleware(["admin"]),
  placeOrder
);
router.get(
  "/admin/orders",
  verifytoken,
  roleMiddleware(["admin"]),
  getAllOrders
);
router.get(
  "/admin/orders/:id",
  verifytoken,
  roleMiddleware(["admin"]),
  getOrderById
);
router.put(
  "/admin/orders/:id/status",
  verifytoken,
  roleMiddleware(["admin", "user"]),
  updateOrderStatus
);
router.get(
  "/admin",
  verifytoken,
  roleMiddleware(["admin", "user"]),
  dashboardController.adminStats
);

/**
 * @swagger
 * tags:
 *   name: ADMIN
 *   description: Admin-only endpoints for managing accounts, products, orders, carts, and wishlists
 */

/**
 * @swagger
 * /updateAccount-Status/{id}/{status}:
 *   get:
 *     summary: Update account status (e.g., active, suspended)
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: New account status
 *     responses:
 *       200:
 *         description: Account status updated successfully
 *       403:
 *         description: Forbidden – admin only
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 14 Pro
 *               price:
 *                 type: number
 *                 example: 999
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       403:
 *         description: Forbidden – admin only
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Retrieve all products
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Filter products (admin only)
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filtered product list
 */

/**
 * @swagger
 * /product/{sku}:
 *   get:
 *     summary: Get product details by SKU
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Product SKU
 *     responses:
 *       200:
 *         description: Product details
 *
 *   put:
 *     summary: Update product by SKU
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Product SKU
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *
 *   delete:
 *     summary: Delete product by SKU
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Product SKU
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */

/**
 * @swagger
 * /cart/{sku}:
 *   post:
 *     summary: Add product to cart
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product added to cart
 *
 * @swagger
 * /cart:
 *   get:
 *     summary: Fetch all items in cart
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 */

/**
 * @swagger
 * /wishlist/{sku}:
 *   get:
 *     summary: Add product to wishlist
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Fetch all wishlist items
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
 *
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 */

/**
 * @swagger
 * /admin/place-order:
 *   post:
 *     summary: Place order (admin)
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 */

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     summary: Get order details by ID (admin only)
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics
 *       403:
 *         description: Forbidden – admin only
 */

router.get("/view-Accounts", verifytoken, checkadmin, viewAccounts);
router.get(
  "/viewSingle-Account/:id",
  verifytoken,
  checkadmin,
  viewSingleAccount
);
router.get(
  "/updateAccount-Status/:id/:status",
  verifytoken,
  checkadmin,
  updateAccountStatus
);

router.post("/product", roleMiddleware(["admin"]), createProduct);
router.get("/product", roleMiddleware(["admin"]), retrieveProduct);
router.get("/products", roleMiddleware(["admin"]), filterproduct);
router.put("/product/:sku", roleMiddleware(["admin"]), updateProduct);
router.get("/product/:sku", roleMiddleware(["admin"]), productDetails);
router.delete("/product/:sku", roleMiddleware(["admin"]), deleteProduct);

router.post("/cart/:sku", roleMiddleware(["admin"]), addcart);
router.get("/cart", roleMiddleware(["admin"]), fetchcart);
router.delete("/cart/:id", roleMiddleware(["admin"]), deletecart);

router.get("/wishlist/:sku", roleMiddleware(["admin"]), addwish);
router.get("/wishlist", roleMiddleware(["admin"]), fetchwishlist);
router.delete("/wishlist/:id", roleMiddleware(["admin"]), deletewish);

router.post(
  "/admin/place-order",
  verifytoken,
  roleMiddleware(["admin"]),
  placeOrder
);
router.get(
  "/admin/orders",
  verifytoken,
  roleMiddleware(["admin"]),
  getAllOrders
);
router.get(
  "/admin/orders/:id",
  verifytoken,
  roleMiddleware(["admin"]),
  getOrderById
);
router.put(
  "/admin/orders/:id/status",
  verifytoken,
  roleMiddleware(["admin"]),
  updateOrderStatus
);
router.get(
  "/admin",
  verifytoken,
  roleMiddleware(["admin"]),
  dashboardController.adminStats
);

module.exports = router;

// browser url
// http://localhost:5888/api-docs