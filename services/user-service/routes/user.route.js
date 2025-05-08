const express = require("express");
const authenticate = require("../middlewares/authenticate.middleware");
const {
  getProfile,
  login,
  register,
  logout,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authenticate, getProfile);

router.post("/logout", logout);

module.exports = router;
