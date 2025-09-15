const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

async function sendEmailToAdmin(product) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `⚠️ Low Stock Alert: ${product.name}`,
    text: `Product "${product.name}" is low on stock!\nRemaining: ${product.quantity}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendEmailToAdmin };
