const express = require("express");
const authenticate = require("../middlewares/authenticate.middleware");
const {
  getProfile,
  login,
  register,
  logout,
  recieveMoney,
  sendMoney,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authenticate, getProfile);

router.post("/logout", logout);

router.post("/recieve-money", authenticate, recieveMoney);

router.post("/send-money", authenticate, sendMoney);

module.exports = router;
