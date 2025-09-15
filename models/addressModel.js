const mongoose = require("mongoose");

const addressschema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  
  address: {
    type: String,
    trim: true,
  },
  addedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Address", addressschema);
