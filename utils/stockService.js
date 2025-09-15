const Product = require("../models/orderModel");

// Update stock for ordered items and check low stock
const scheduleLowStockChecker = async (orderItems) => {
  const alerts = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.productId);

    if (!product) continue;

    product.quantity -= item.quantity;
    await product.save();

    if (product.quantity <= product.lowStockThreshold) {
      const alertMessage = `⚠️ Product "${product.name}" is low on stock! Remaining: ${product.quantity}`;

      if (product.quantity <= product.lowStockThreshold) {
        const alertMessage = `⚠️ Product "${product.name}" is low on stock! Remaining: ${product.quantity}`;

        console.log(alertMessage);
        alerts.push(alertMessage);
        await sendEmailToAdmin(product);
      }
      console.log(alertMessage);

      alerts.push(alertMessage);
    }
  }

  return alerts;
};

module.exports = { scheduleLowStockChecker };
