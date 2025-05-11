const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { sendEmail } = require("./notifier");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.post("/notify", async (req, res) => {
  const { email, subject, message, html } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Missing email or message" });
  }

  try {
    const info = await sendEmail(email, subject, message, html);

    res.json({
      success: true,
      message: "Notification sent",
      messageId: info.messageId,
      previewUrl:
        process.env.NODE_ENV !== "production"
          ? nodemailer.getTestMessageUrl(info)
          : undefined,
    });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () =>
  console.log(`Notification Service running on port ${PORT}`)
);
