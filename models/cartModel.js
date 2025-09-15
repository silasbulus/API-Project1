const mongoose = require("mongoose");

const cartschema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["active", "checked", "deleted"],
    default: "active",
  },
  addedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartschema);
