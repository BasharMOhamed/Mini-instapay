const mongoose = require("mongoose");

// todo --> add note to the transaction
const transactionSchema = new mongoose.Schema({
  from: { required: true, type: mongoose.Types.ObjectId },
  to: { required: true, type: mongoose.Types.ObjectId },
  amount: { required: true, type: Number },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
