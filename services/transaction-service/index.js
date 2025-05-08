const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const transactionRoute = require("./routes/transaction.route.js");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

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
