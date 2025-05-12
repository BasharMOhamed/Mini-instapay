const axios = require("axios");

const Transaction = require("../models/transaction.model.js");
const USER_URL = "http://user-service:5000/user";

const transfereMoney = async (req, res) => {
  const user = req.user;
  const { to, amount, note } = req.body;
  console.log(to, amount, note);

  try {
    const newTransaction = await Transaction.create({
      from: user.email,
      to,
      amount,
      note,
    });

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const sendMoney = await axios.post(
      `${USER_URL}/send-money`,
      { amount, to },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );

    const receiveMoney = await axios.post(
      `${USER_URL}/recieve-money`,
      { amount, to },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );

    res.json({ transaction: newTransaction });
  } catch (error) {
    console.error("Error in creating transaction:", error.message);
    res.status(500).json({ error: "Failed to process transaction" });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const userHistory = await Transaction.find({
      $or: [{ from: req.user.email }, { to: req.user.email }],
    });

    res.json(userHistory);
  } catch (error) {
    console.log(`Error in get user history controller:`, error);
    res.status(500).json({ error: "Failed to retrieve transaction history" });
  }
};

module.exports = { transfereMoney, getUserHistory };
