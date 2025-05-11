const nodemailer = require("nodemailer");

let transporter;

if (process.env.NODE_ENV === "production") {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });
} else {
  transporter = null;
}

async function init() {
  if (process.env.NODE_ENV !== "production" && !transporter) {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("Ethereal Email test account created:", {
      user: testAccount.user,
      pass: testAccount.pass,
    });
  }
}

async function sendEmail(to, subject, message, html = null) {
  if (!transporter && process.env.NODE_ENV !== "production") {
    await init();
  }

  const mailOptions = {
    from: process.env.MAIL_USER || '"Mini InstaPay" <noreply@miniinstapay.com>',
    to,
    subject: subject || "Mini InstaPay Notification",
    text: message,
  };

  if (html) {
    mailOptions.html = html;
  }

  const info = await transporter.sendMail(mailOptions);

  if (process.env.NODE_ENV !== "production") {
    console.log("Email preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}

init().catch(console.error);

module.exports = {
  sendEmail,
  init,
};
