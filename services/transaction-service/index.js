const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const transactionRoute = require("./routes/transaction.route.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/transaction", transactionRoute);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mogodb");
    app.listen(process.env.PORT || 5002, () => {
      console.log(`App listening on port ${process.env.PORT || 5002}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting to monog `, err);
  });
