// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  // Accept token from Authorization header OR cookie (for frontends using httpOnly cookie)
  let token = req.headers.authorization?.split(" ")[1];
  if (!token && req.cookies) token = req.cookies.token || req.cookies.Token || req.cookies.my_token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    // expose userId shorthand (controllers use req.userId in some places)
    req.userId = decoded.id || decoded._id || decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
