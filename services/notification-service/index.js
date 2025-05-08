const express = require("express");
const cors = require("cors");
const notifier = require("./notifier");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/notify", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Missing email or message" });
  }

  try {
    await notifier.sendEmail(email, message);
    res.json({ success: true, message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () =>
  console.log(`Notification Service running on port ${PORT}`)
);
