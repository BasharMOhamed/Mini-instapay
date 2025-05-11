const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 1000 },
  creditCard: { type: String, unique: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
