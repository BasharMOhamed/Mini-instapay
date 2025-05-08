const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Logged in successfully" });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const recieveMoney = async (req, res) => {
  const { amount } = req.body;

  try {
    const updatedUser = await User.updateOne(
      { id: req.user.id },
      { $inc: { balance: amount } }
    );
    res.json(updatedUser);
  } catch (error) {
    console.log("Error in recieve money controller ", error);
  }
};

const sendMoney = async (req, res) => {
  const { amount } = req.body;
  const user = req.user;

  if (user.balance == 0 || user.balance < amount) {
    res
      .status(400)
      .json({ message: "Balace is not enough for this transaction." });
  }

  try {
    const updatedUser = await User.updateOne(
      { id: user.id },
      { $inc: { balance: -amount } }
    );

    res.json(updatedUser);
  } catch (error) {
    console.log("Error in send money controller ", error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  recieveMoney,
  sendMoney,
};
