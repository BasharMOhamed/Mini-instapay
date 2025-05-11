const axios = require("axios");

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token from cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const response = await axios.get("http://user-service:5000/user/profile", {
      headers: {
        cookie: `token=${token}`,
      },
    });
    console.log("User service response:", response.data);
    req.user = response.data;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
