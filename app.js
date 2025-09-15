const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const { swaggerUi, swaggerSpec } = require("./config/swagger");
multer = require("multer");
const handlebars = require("express-handlebars");
const cron = require("node-cron");
const Product = require("./models/productModel");
const { checkExpiry } = require("./utils/expiryChecker");
const hbs = require("hbs");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const url = process.env.MONGO_URL;

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

// Routes
const authroutes = require("./routes/authRoutes");
const accountroutes = require("./routes/accountRoutes");
const productroutes = require("./routes/productRoutes");
const drugRoutes = require("./routes/drugRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrdersRoutes = require("./routes/adminRoutes");

// DB connection
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB Successfully");
    cron.schedule("0 0 * * *", async () => {
      console.log("🔍 Running daily expiry check...");
      const products = await Product.find();
      for (const product of products) {
        await checkExpiry(product);
      }
    });
  })
  .catch((err) => console.log(err));

// Handlebars setup
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "hbs");

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(limiter);

// API routes
app.use("/api/v1", authroutes);
app.use("/api/v1", accountroutes);
app.use("/api/v1", productroutes);
app.use("/api/v1", drugRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", require("./routes/adminRoutes"));
app.use("/api/v1", require("./routes/orderRoutes"));
app.use("/api/admin/orders", adminOrdersRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error middleware caught:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Default route
app.get("/", (req, res) => {
  const baseurl = `${req.protocol}://${req.get("host")}`;
  console.log(baseurl);
  res.status(200).json({
    message: "Welcome to the My API",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route does not exist",
  });
});

app.listen(5888, () => console.log("Server running on http://localhost:5888"));

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
