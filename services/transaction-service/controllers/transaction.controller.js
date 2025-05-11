const axios = require("axios");

const Transaction = require("../models/transaction.model.js");
const USER_URL = "http://user-service:5000/user";

const transfereMoney = async (req, res) => {
  const user = req.user;
  const { to, amount } = req.body;
  console.log(to, amount);

  try {
    // todo --> add note to the transaction
    const newTransaction = await Transaction.create({
      from: user.id,
      to,
      amount,
    });

    // todo --> send money & recieve money aren't used
    const sendMoney = await axios.post(`${USER_URL}/send-money`, {
      amount,
      to,
    });
    const recieveMoney = await axios.post(`${USER_URL}/recieve-money`, {
      amount,
    });

    res.json({ transaction: newTransaction });
  } catch (error) {
    console.log(`Error in creating transaction controller `, error);
  }
};

module.exports = { transfereMoney };
