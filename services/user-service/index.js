const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/user.route");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`User Server is running on port ${process.env.PORT || 5000}`);
});
