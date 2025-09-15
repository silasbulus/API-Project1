const jwt = require("jsonwebtoken");
const accountmodel = require("../models/accountModel");
const User = require("../models/userModel");

const verifytoken = async (req, res, next) => {
  try {
    const authheader = req.headers.authorization;
    if (!authheader || !authheader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized, please login",
      });
    }

    const token = authheader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const account = await accountmodel.findById(decoded.id).select("-password");
    if (!account) {
      return res.status(403).json({
        status: 403,
        message: "Forbidden, unauthorized user",
      });
    }

    //OTP check
    if (!account.verified) {
      return res.status(400).json({
        status: 400,
        message: "OTP not verified. Please verify first.",
      });
    }

    if (account.status === "inactive") {
      return res.status(400).json({
        status: "inactive",
        message: "Your account has been inactive. Please reset your password.",
      });
    }
    if (account.status === "disabled") {
      return res.status(400).json({
        status: "disabled",
        message: "Your account has been disabled. Contact support.",
      });
    }
    if (account.status === "deleted") {
      return res.status(400).json({
        status: "deleted",
        message: "Your account has been temporarily deleted. Contact support.",
      });
    }

    req.user = account;
    next();
  } catch (err) {
    console.error(err);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: 401, message: "Token expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ status: 401, message: "Invalid token." });
    }

    return res.status(500).json({
      status: 500,
      message: "Server error in verifytoken",
    });
  }
};

const validatetoken = async (req, res, next) => {
  try {
    const authheader = req.headers.authorization;
    if (!authheader) {
      return res.status(401).json({
        status: 401,
        message: "Bad request, please try again",
      });
    }

    if (!authheader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Bad request, please try again",
      });
    }

    const token = authheader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    const account = await accountmodel.findById(decoded.id).select("-password");
    if (!account) {
      return res.status(403).json({
        status: 403,
        message: "Invalid token verification request, please try again",
      });
    }
    req.user = account;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Invalid request, please start afresh",
    });
  }
};

const checkuser = async (req, res, next) => {
  try {
    const authheader = req.headers.authorization;
    if (!authheader) {
      return next();
    }

    if (!authheader.startsWith("Bearer ")) {
      return next();
    }

    const token = authheader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const account = await accountmodel.findById(decoded.id).select("-password");
    if (!account) {
      return next();
    }
    req.user = account;
    return next();
  } catch (err) {
    console.error(err);
    return next();
  }
};
const checkadmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - no user attached" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admins only" });
  }

  next();
};

module.exports = {
  verifytoken,
  validatetoken,
  checkuser,
  checkadmin,
};
