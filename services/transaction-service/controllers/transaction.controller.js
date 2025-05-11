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

    // todo --> send money & recieve money aren't used
    const sendMoney = await axios.post(`${USER_URL}/send-money`, {
      amount,
    });
    const recieveMoney = await axios.post(`${USER_URL}/recieve-money`, {
      amount,
    });

    res.json({ transaction: newTransaction });
  } catch (error) {
    console.log(`Error in creating transaction controller `, error);
  }
};

const getUserHistory = async (req, res) => {
  try {
    console.log("User email for history query:", req.user.email);

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
