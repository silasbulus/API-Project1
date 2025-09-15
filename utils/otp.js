const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const productmodel = require("../models/product");
const usermodel = require("../models/user");
const ordermodel = require("../models/order");

const generateOtp = () => {
  return "" + Math.floor(100000 + Math.random() * 900000);
};

const generateSecureOtp = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBytes = crypto.randomBytes(length);
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += chars[randomBytes[i] % chars.length];
  }
  return otp;
};

const uniqueotp = async () => {
  let otp = generateSecureOtp(6);
  const exists = await usermodel.findOne({ otp });
  if (exists) {
    otp = generateSecureOtp(6);
  }
  return otp;
};

const generateSKU = async () => {
  let sku = crypto.randomBytes(8).toString("hex").toUpperCase();

  const exists = await usermodel.findOne({ sku });
  if (exists) {
    sku = crypto.randomBytes(8).toString("hex").toUpperCase();
  }

  return sku;
};

module.exports = { generateOtp, generateSecureOtp, uniqueotp, generateSKU };
