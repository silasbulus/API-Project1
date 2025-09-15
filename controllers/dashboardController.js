// controllers/dashboardController.js
const Account = require("../models/accountModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.adminStats = async (req, res) => {
  try {
    const totalUsers = await Account.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });

    // Low stock products
    const lowStockProducts = await Product.find({
      stock: { $lte: 5 },
    }).select("name stock");

    res.json({
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      lowStockProducts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin stats", error: err });
  }
};

exports.userStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalOrders = await Order.countDocuments({ account: userId });
    const pendingOrders = await Order.countDocuments({
      account: userId,
      status: "pending",
    });
    const completedOrders = await Order.countDocuments({
      account: userId,
      status: "completed",
    });

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user stats", error: err });
  }
};
