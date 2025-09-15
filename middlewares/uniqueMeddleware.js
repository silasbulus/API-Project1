const { v4: uuidv4 } = require("uuid");
const productmodel = require("../models/productModel");
const accountmodel = require("../models/accountModel");
const ordermodel = require("../models/orderModel");
const crypto = require("crypto");

const generateOtp = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const rand = crypto.randomInt(0, digits.length);
    otp += digits[rand];
  }
  return otp;
};
const generateOrderID = async () => {
  let orderid = "MED-";
  let unique = false;
  while (!unique) {
    orderid += generateOtp();
    const existotp = await ordermodel.findOne({ orderid: orderid });
    if (!existotp) {
      unique = true;
    }
  }

  return orderid;
};
const uniqueOTP = async () => {
  let otp;
  let unique = false;
  while (!unique) {
    otp = generateOtp();
    const existotp = await accountmodel.findOne({ otp: otp });
    if (!existotp) {
      unique = true;
    }
  }

  return otp;
};
const uniquename = (name) => {
  const imgext = name.split(".").pop();
  const newname = `${uuidv4()}.${imgext}`;
  return newname;
};
const generatesku = async () => {
  let sku;
  let exist = true;
  while (exist) {
    sku = uuidv4();
    exist = await productmodel.findOne({ sku });
  }
  return sku;
};

module.exports = {
  generateOtp,
  generateOrderID,
  uniqueOTP,
  uniquename,
  generatesku,
};
