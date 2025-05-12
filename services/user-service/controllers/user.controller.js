const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const NOTIFY_URL = "http://notification-service:5004/notify";

const register = async (req, res) => {
  const { name, email, password, creditCard } = req.body;
  console.log(name, email, password);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      creditCard,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(201).json(userResponse);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Server error while fetching profile" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const recieveMoney = async (req, res) => {
  const { amount, to } = req.body;
  console.log("amount ", amount, " to ", to);

  try {
    const updatedUser = await User.updateOne(
      { email: to },
      { $inc: { balance: amount } }
    );

    const notification = await axios.post(NOTIFY_URL, {
      email: to,
      subject: "Money Recieved",
      message: `You have recieved $${amount} from ${req.user.email}`,
    });

    res.status(200).json({ message: "Money received successfully" });
  } catch (error) {
    console.error("Error in receive money controller:", error);
    res.status(500).json({ error: "Failed to update balance" });
  }
};

const sendMoney = async (req, res) => {
  const { amount, to } = req.body;
  const user = req.user;

  if (user.balance === 0 || user.balance < amount) {
    return res
      .status(400)
      .json({ message: "Balance is not enough for this transaction." });
  }

  try {
    const updatedUser = await User.updateOne(
      { email: user.email },
      { $inc: { balance: -amount } }
    );
    const notify = await axios.post(NOTIFY_URL, {
      email: user.email,
      subject: "Money Sent",
      message: `You have sent $${amount} to ${to}`,
    });
    res.status(200).json({ message: "Money sent successfully" });
  } catch (error) {
    console.error("Error in send money controller:", error);
    res.status(500).json({ error: "Failed to update balance" });
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
