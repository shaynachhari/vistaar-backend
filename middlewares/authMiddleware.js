const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
};

const verifyUser = (req, res, next) => {
  if (req.user.role !== "User" && req.user.role !== "Admin") {
    return res.status(403).json({ error: "User or Admin access required." });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin, verifyUser };
