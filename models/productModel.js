const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shortdescription: {
    type: String,
    required: true,
  },
  longdescription: {
    type: String,
    required: true,
  },
  description: String,
  
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },

  prescriptionRequired: {
    type: Boolean,
    default: false,
  },

  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10,
  },

  Date: {
    type: Date,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },

  addedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Number,
    require: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],

  stock: {
    type: Number,
    required: true,
  },
  displayimg: {
    type: String,
    required: true,
  },
  category: [
    {
      type: String,
      required: true,
    },
  ],

  active: {
    type: Boolean,
    default: true,
  },

  ratings: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
