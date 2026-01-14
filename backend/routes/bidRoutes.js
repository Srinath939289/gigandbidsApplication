const express = require("express");
const auth = require("../middleware/authMiddleware");
const bidController = require("../controllers/bidController");
const hireController = require("../controllers/hireControllers");

const router = express.Router();

// Debug sanity checks
if (typeof auth !== "function") {
  console.error("auth is not a function:", typeof auth, auth);
}
if (typeof bidController.createBid !== "function") {
  console.error("bidController.createBid is not a function:", typeof bidController.createBid);
}
if (typeof bidController.getBidsForGig !== "function") {
  console.error("bidController.getBidsForGig is not a function:", typeof bidController.getBidsForGig);
}
if (typeof hireController.hireBid !== "function") {
  console.error("hireController.hireBid is not a function:", typeof hireController.hireBid);
}

router.post("/", auth, bidController.createBid);
// Get bids for the logged-in freelancer for a gig
router.get("/me/:gigId", auth, bidController.getMyBidsForGig);
// Get all bids for a gig (owner only)
router.get("/:gigId", auth, bidController.getBidsForGig);
router.patch("/:bidId/hire", auth, hireController.hireBid);

module.exports = router;