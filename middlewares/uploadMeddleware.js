const accountmodel = require("../models/accountModel");
const { validateProduct } = require("./validateMeddleware");
const { uniquename, generatesku } = require("../middlewares/uniqueMeddleware");
const multer = require("multer");
const { upload } = require("../config/cloudinary");

const uploadImages = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized, please login",
      });
    }
    if (!["admin", "manager", "user"].includes(user.role)) {
      return res.status(403).json({
        status: 403,
        message: "Forbidden, unauthorized user",
      });
    }

    let files = [];
    if (req.file) {
      files = [req.file];
    } else if (req.files && Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files && req.files.images) {
      files = req.files.images;
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "At least 1 product image is required",
      });
    }

    if (files.length < 2) {
      return res.status(400).json({
        status: 400,
        message: "At least 2 product images are required",
      });
    }

    const { error } = validateProduct.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    req.productimages = files.map((file) => file.path);
    req.productname = files.map((file) => file.filename);

    return next();
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      status: 500,
      message: "Error occurred while uploading images",
    });
  }
};
module.exports = { uploadImages, upload };
