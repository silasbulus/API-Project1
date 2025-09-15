const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const accountschema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "user"],
    default: "user",
  },
  phone: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpexpires: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otpverified: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ["active", "inactive", "deleted", "disabled"],
    default: "active",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

accountschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

accountschema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model("Account", accountschema);
