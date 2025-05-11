const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authentication.js");
const {
  transfereMoney,
  getUserHistory,
} = require("../controllers/transaction.controller");

router.post("/transfer", authenticate, transfereMoney);
router.get("/history", authenticate, getUserHistory);

module.exports = router;
