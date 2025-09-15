const baseurl = "https://api.paystack.co/transaction/initialize";
const axios = require("axios");
const cartmodel = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ordermodel = require("../models/orderModel");
const OrderService = require("../services/orderServices");
const { generateOrderID } = require("../middlewares/uniqueMeddleware");
const { scheduleLowStockChecker } = require("../utils/stockService");
const { sendEmailToAdmin } = require("../utils/emailService");

const initializePayment = async (req, res) => {
  const user = req.user;
  try {
    const { addressid } = req.params;
    const cart = await cartmodel
      .find({ addedby: req.user._id, status: "active" })
      .populate("product");

    if (cart.length === 0) {
      return res.status(400).json({
        message: "No cart available for checkout",
      });
    }

    let amount = 0;
    cart.forEach((item) => {
      amount += item.product.price * item.quantity;
    });
    const response = await axios.post(
      baseurl,
      {
        amount: amount * 100,
        email: user.email,
        callback_url: "http://localhost:5888/api/v1/web-verify",
        metadata: {
          addressid,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );

    if (response.status == 200) {
      const cartitems = await cart.map((item) => {
        return {
          _id: item._id,
          product: item.product._id,
          price: item.product.price,
          addedby: item.addedby,
          quantity: item.quantity,
        };
      });
      const data = response.data;
      const accesscode = data.data.access_code;
      const reference = data.data.reference;
      const authorization_url = data.data.authorization_url;

      const orderid = await generateOrderID();
      await ordermodel.create({
        address: addressid,
        reference: reference,
        access_code: accesscode,
        cart: cartitems,
        account: user._id,
        amount: amount,
        orderid: orderid,
      });

      res.status(200).json({
        message: "Payment Initialized",
        url: authorization_url,
      });
    } else {
      res.status(400).json({
        message: "Payment Initialization failed",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occured while initializing payment",
    });
  }
};
const verifyPayment = async (req, res) => {
  const user = req.user;
  try {
    const { trxref, reference } = req.query;
    if (!trxref && !reference) {
      return res.status(400).json({
        message: "Payment verificaton failed",
      });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );

    if (response.status == 200 && response.data.status === true) {
      const data = response.data.data;
      console.log(data);
      const ref = data.reference;
      const order = await ordermodel.findOne({ reference: ref });
      if (!order) {
        return res.status(400).json({
          message: "Order not found",
        });
      }

      order.status = data.status;
      order.domain = data.domain;
      order.fees = data.fees / 100;
      order.channel = data.channel;
      order.paid_at = data.paid_at;
      order.created_at = data.created_at;
      order.paidstatus = "paid";
      await order.save();

      await cartmodel.updateMany(
        { addedby: user._id, status: "active" },
        { $set: { status: "checked" } }
      );
      res.status(200).json({
        message: "Order payment verified",
        verified: true,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occured while verifying payment",
    });
  }
};
const verify = async (req, res) => {
  try {
    const { trxref, reference } = req.query;
    if (!trxref && !reference) {
      return res.render("index", {
        message: "Payment Verification failed",
        content:
          "Payment verification has failed due to invalid reference, please try again later",
        verified: false,
      });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );

    if (response.status == 200 && response.data.status === true) {
      const data = response.data.data;
      const ref = data.reference;
      const order = await ordermodel.findOne({ reference: ref });
      if (!order) {
        return res.render("index", {
          message: "Order not found",
          content:
            "Payment verification has failed due to order not being found, please try again later",
          verified: false,
        });
      }

      order.status = data.status;
      order.domain = data.domain;
      order.fees = data.fees / 100;
      order.channel = data.channel;
      order.paid_at = data.paid_at;
      order.created_at = data.created_at;
      order.paidstatus = "paid";
      await order.save();

      await cartmodel.updateMany(
        { addedby: order.account, status: "active" },
        { $set: { status: "checked" } }
      );

      return res.render("index", {
        message: "Order payment verified",
        content:
          "Payment verification is successful, you can click on the continue button to check your dashboard",
        verified: true,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("index", {
      message: "Error occured while verifying payment",
      content:
        "Payment verification has failed due to internal server error, please try again later",
      verified: false,
    });
  }
};
const placeOrder = async (req, res) => {
  try {
    const orderItems = req.body.items;

    if (!orderItems || !Array.isArray(orderItems)) {
      return res.status(400).json({ message: "Order items are required" });
    }

    // Create the order
    const newOrder = await Order.create({
      account: req.user._id,
      address: req.body.address,
      cart: orderItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        addedby: req.user._id,
      })),
      amount: req.body.total,
      reference: req.body.reference,
      orderid: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: "pending",
      paidstatus: "unpaid",
    });

    const alerts = await scheduleLowStockChecker(orderItems);

    for (const item of newOrder.cart) {
      const product = await Product.findById(item.product);

      if (product) {
        product.quantity -= item.quantity;
        await product.save();

        // LOW STOCK CHECK
        if (product.quantity <= product.lowStockThreshold) {
          const alertMessage = `⚠️ Product "${product.name}" is low on stock! Remaining: ${product.quantity}`;

          // Terminal alert
          console.log("\x1b[41m%s\x1b[0m", alertMessage);

          alerts.push(alertMessage);

          await sendEmailToAdmin(product);
        }
      }
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
      alerts,
    });
  } catch (err) {
    console.error("Order error:", err);
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user._id;

    const { orders, totalOrders, totalPages, currentPage } =
      await OrderService.getOrdersForUser(userId, page, limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: totalOrders,
      totalPages: totalPages,
      currentPage: currentPage,
      data: orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error fetching user orders.",
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error.message);
    if (
      error.message.includes("not found") ||
      error.message.includes("access denied")
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error fetching order.",
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const statusFilter = req.query.status || null;

    const filters = {};
    if (statusFilter) filters.status = statusFilter;

    const { orders, totalOrders, totalPages, currentPage } =
      await OrderService.getAllOrders(page, limit, filters);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: totalOrders,
      totalPages: totalPages,
      currentPage: currentPage,
      data: orders,
    });
  } catch (error) {
    console.error("Admin Get Orders Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error fetching all orders.",
    });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const updatedOrder = await OrderService.updateOrderStatus(
      req.params.id,
      status,
      note,
      req.user
    );

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status} successfully.`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error updating order status.",
    });
  }
};
module.exports = {
  initializePayment,
  verifyPayment,
  verify,
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
