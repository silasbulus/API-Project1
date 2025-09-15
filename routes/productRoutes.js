

const express = require("express");
const router = express.Router();

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
  verifytoken,
  checkuser,
  validatetoken,
} = require("../middlewares/authenticateMeddleware");

const { uploadImages, upload } = require("../middlewares/uploadMeddleware");
const roleMiddleware = require("../middlewares/roleMeddleware"); 

router.post(
  "/product",
  verifytoken,
  roleMiddleware(["admin", "user"]), 
  upload.array("images", 5),
  uploadImages,
  createProduct
);

router.get("/product", checkuser, retrieveProduct);
router.get("/product/:sku", checkuser, productDetails);
router.get("/products", verifytoken, filterproduct);
// router.get("/product-status/:sku", verifytoken, updateProduct);
router.delete("/product/:sku", verifytoken, deleteProduct);

router.post("/cart/:sku", verifytoken, addcart);
router.get("/cart", verifytoken, fetchcart);
router.delete("/cart/:id", verifytoken, deletecart);

router.post("/wishlist/:sku", verifytoken, addwish);
router.get("/wishlist", verifytoken, fetchwishlist);
router.get("/wishlist/:sku", verifytoken, addwish);
router.delete("/wishlist/:id", verifytoken, deletewish);

module.exports = router;

//localhost:5888/api/v1/products → returns all products
//localhost:5888/api/v1/products?name=paracetamol → filters by name
//localhost:5888/api/v1/products?category=syrup → filters by category
//localhost:5888/api/v1/products?name=para&category=syrup → combined

/**
 * @swagger
 * tags:
 *   name: PRODUCT
 *   description: Product, cart, and wishlist management
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [PRODUCT]
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
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 1200
 *               sku:
 *                 type: string
 *                 example: IPH15-BLK-256
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve all products (public view)
 *     tags: [PRODUCT]
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /product/{sku}:
 *   get:
 *     summary: Get product details by SKU
 *     tags: [PRODUCT]
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
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Filter/search products (requires login)
 *     tags: [PRODUCT]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filtered list of products
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /product-status/{sku}:
 *   get:
 *     summary: Get or update product status by SKU
 *     tags: [PRODUCT]
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
 *         description: Product status updated
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /product/{sku}:
 *   delete:
 *     summary: Delete a product by SKU
 *     tags: [PRODUCT]
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
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */

router.get("/product", checkuser, retrieveProduct);
router.get("/product/:sku", checkuser, productDetails);
router.get("/products", verifytoken, filterproduct);
router.get("/product-status/:sku", verifytoken, updateProduct);
router.delete("/product/:sku", verifytoken, deleteProduct);

/**
 * @swagger
 * /cart/{sku}:
 *   post:
 *     summary: Add product to cart
 *     tags: [PRODUCT]
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
 *       201:
 *         description: Product added to cart
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Fetch all items in user's cart
 *     tags: [PRODUCT]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Delete an item from cart
 *     tags: [PRODUCT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Fetch all items in wishlist
 *     tags: [PRODUCT]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /wishlist/{sku}:
 *   get:
 *     summary: Add product to wishlist
 *     tags: [PRODUCT]
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
 *       201:
 *         description: Product added to wishlist
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [PRODUCT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wishlist item ID
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */

router.post("/cart/:sku", verifytoken, addcart);
router.get("/cart", verifytoken, fetchcart);
router.delete("/cart/:id", verifytoken, deletecart);
router.get("/wishlist", verifytoken, fetchwishlist);
router.get("/wishlist/:sku", verifytoken, addwish);
router.delete("/wishlist/:id", verifytoken, deletewish);

module.exports = router;

// browser url
// http://localhost:5888/api-docs
