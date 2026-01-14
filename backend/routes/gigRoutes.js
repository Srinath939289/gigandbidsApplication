const express = require("express");
const { createGig, getGigs } = require("../controllers/gigController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, createGig);
router.get("/", getGigs);

module.exports = router;