const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authentication.js");
const { transfereMoney } = require("../controllers/transaction.controller");

router.post("/transfere", authenticate, transfereMoney);

// todo --> get method for transactions history

module.exports = router;
