const mongoose = require("mongoose");
const { updateStock } = require("./services/stockService");
const Product = require("../models/productModel");

const runTest = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yourDB");

    const product = await Product.create({
      name: "Paracetamol",
      stock: 10,
      lowStockThreshold: 5,
      price: 50,
    });

    console.log("📦 Before order:", product);

    await updateStock([{ productId: product._id, quantity: 7 }]);

    const updated = await Product.findById(product._id);
    console.log("📉 After order:", updated);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

runTest();

module.exports = runTest;
