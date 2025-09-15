const mongoose = require("mongoose");

const wishschema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
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
    isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
});

module.exports = mongoose.model("Wishlist", wishschema);
