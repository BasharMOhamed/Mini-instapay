const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  const { amount } = req.body;

  try {
    // Update the user's balance by their ID
    const updatedUser = await User.updateOne(
      { to: req.user.email },
      { $inc: { balance: amount } }
    );

    if (updatedUser.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "User not found or balance not updated" });
    }

    // Get the updated user to return the new balance
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Error in receive money controller:", error);
    res.status(500).json({ error: "Failed to update balance" });
  }
};

const sendMoney = async (req, res) => {
  const { amount } = req.body;
  const user = req.user;

  // Check if user has sufficient balance
  if (user.balance === 0 || user.balance < amount) {
    return res
      .status(400)
      .json({ message: "Balance is not enough for this transaction." });
  }

  try {
    // Update the user's balance by their ID
    const updatedUser = await User.updateOne(
      { from: user.email },
      { $inc: { balance: -amount } }
    );

    if (updatedUser.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "User not found or balance not updated" });
    }

    // Get the updated user to return the new balance
    const updatedUserData = await User.findById(user._id).select("-password");
    res.json(updatedUserData);
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
