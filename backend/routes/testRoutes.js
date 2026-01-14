const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/test-user", async (req, res) => {
  const user = await User.create({
    name: "Backend User",
    email: "test@mail.com",
    password: "123456",
  });

  res.json(user);
});

module.exports = router;
