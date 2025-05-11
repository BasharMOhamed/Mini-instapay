const axios = require("axios");

const authenticate = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const response = await axios.post("http://user-service:5000/user/profile");
    req.user = response.data.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
