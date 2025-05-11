const mongoose = require("mongoose");

// todo --> add note to the transaction
const transactionSchema = new mongoose.Schema({
  from: { required: true, type: String },
  to: { required: true, type: String },
  amount: { required: true, type: Number },
  date: {
    type: Date,
    default: Date.now,
  },
  note: { type: String, default: "" },
});

module.exports = mongoose.model("Transaction", transactionSchema);
