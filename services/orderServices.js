

const Order = require("../models/orderModel");

class OrderService {

  static async getOrdersForUser(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const orders = await Order.find({ account: userId })
      .populate("cart.product")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments({ account: userId });
    const totalPages = Math.ceil(totalOrders / limit);

    return { orders, totalOrders, totalPages, currentPage: page };
  }

  static async getOrderById(orderId, user) {
    const order = await Order.findById(orderId).populate("cart.product");

    if (!order) {
      throw new Error("Order not found");
    }

    if (
      order.account.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      throw new Error("Order access denied");
    }

    return order;
  }

  // Admin Get all orders
  static async getAllOrders(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const orders = await Order.find(filters)
      .populate("cart.product account")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments(filters);
    const totalPages = Math.ceil(totalOrders / limit);

    return { orders, totalOrders, totalPages, currentPage: page };
  }

  // Admin Update order status
  static async updateOrderStatus(orderId, status, note, user) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;

    // Add history note
    if (note) {
      order.history = order.history || [];
      order.history.push({
        note,
        updatedBy: user._id,
        date: new Date(),
      });
      }

  // Add to history log
  order.history.push({
    status,
    note,
    updatedBy: user._id,
    date: new Date(),
  });

  await order.save();
  return order;
}

  }

module.exports = OrderService;
