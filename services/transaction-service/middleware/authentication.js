const axios = require("axios");
const { model } = require("mongoose");

model.export = async function authenticate(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const response = await axios.post("http://localhost:5000/user/profile");
    req.user = response.data.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
