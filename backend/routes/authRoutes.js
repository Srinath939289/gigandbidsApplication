const express = require("express");
const auth = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

// Sanity checks — helpful while debugging
if (typeof auth !== "function") {
  console.error("auth middleware is not a function:", typeof auth, auth);
}
if (typeof authController.register !== "function") {
  console.error("authController.register is not a function:", typeof authController.register, authController.register);
}
if (typeof authController.login !== "function") {
  console.error("authController.login is not a function:", typeof authController.login, authController.login);
}
if (typeof authController.me !== "function") {
  console.error("authController.me is not a function:", typeof authController.me, authController.me);
}

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth, authController.me);

module.exports = router;