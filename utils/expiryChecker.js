const { sendEmailToAdmin } = require("../utils/emailService");

async function checkExpiry(product) {
  const today = new Date();
  const thresholdDays = 30;
  const expiryThreshold = new Date(
    today.setDate(today.getDate() + thresholdDays)
  );

  // Convert expiryDate into a real JS Date
  const expiry = new Date(product.expiryDate);

  const expiryDateString = expiry.toDateString();
  console.log("Expiry date:", expiryDateString);

  return expiry < new Date();

  if (product.expiryDate && product.expiryDate <= expiryThreshold) {
    const alertMessage = `⚠️ Product "${
      product.name
    }" is expiring soon! Expiry date: ${product.expiryDate.toDateString()}`;

    // Terminal alert
    console.log("\x1b[43m%s\x1b[0m", alertMessage);

    // Send admin email
    await sendEmailToAdmin({
      name: product.name,
      quantity: product.quantity,
      expiryDate: product.expiryDate,
    });
  }
}

module.exports = { checkExpiry };
