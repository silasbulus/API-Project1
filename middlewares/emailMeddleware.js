const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

async function MailSending(option) {
  try {
    const mailOptions = {
      from: `Medicare <${process.env.EMAIL}>`,
      to: option.email,
      subject: option.subject,
      html: option.message,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (err) {
    console.log("Error in sending mail: ", err);
    return err;
  }
}
module.exports = { MailSending };
