const Bid = require("../models/Bid");
const Gig = require("../models/Gig");

// POST /api/bids
exports.createBid = async (req, res) => {
  const { gigId, message, price } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) return res.status(404).json({ message: "Gig not found" });

  if (gig.status !== "open")
    return res.status(400).json({ message: "Gig already assigned" });

  const bid = await Bid.create({
    gigId,
    freelancerId: req.userId,
    message,
    price,
  });

  res.status(201).json(bid);
};

// GET /api/bids/:gigId
exports.getBidsForGig = async (req, res) => {
  const gig = await Gig.findById(req.params.gigId);
  if (!gig) return res.status(404).json({ message: "Gig not found" });

  if (gig.ownerId.toString() !== req.userId)
    return res.status(403).json({ message: "Access denied" });

  const bids = await Bid.find({ gigId: gig._id });
  res.json(bids);
};

// GET /api/bids/me/:gigId - for freelancer to fetch their own bids on a gig
exports.getMyBidsForGig = async (req, res) => {
  const gig = await Gig.findById(req.params.gigId);
  if (!gig) return res.status(404).json({ message: "Gig not found" });

  const freelancerId = req.userId;
  const bids = await Bid.find({ gigId: gig._id, freelancerId });
  res.json(bids);
};
