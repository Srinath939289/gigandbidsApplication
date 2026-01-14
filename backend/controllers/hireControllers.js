const mongoose = require("mongoose");
const Bid = require("../models/Bid");
const Gig = require("../models/Gig");

exports.hireBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const gig = await Gig.findById(bid.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (String(gig.ownerId) !== String(req.userId))
      return res.status(403).json({ message: "Unauthorized" });

    if (gig.status === "assigned")
      return res.status(400).json({ message: "Gig already assigned" });

    // Atomically set gig to assigned only if it's still open and owned by requester
    const updatedGig = await Gig.findOneAndUpdate(
      { _id: gig._id, ownerId: gig.ownerId, status: "open" },
      { $set: { status: "assigned" } },
      { new: true }
    );

    if (!updatedGig) {
      return res.status(400).json({ message: "Failed to assign gig; it may already be assigned" });
    }

    // Mark selected bid as hired
    await Bid.findByIdAndUpdate(bid._id, { $set: { status: "hired" } });

    // Reject all other bids for the gig
    await Bid.updateMany({ gigId: gig._id, _id: { $ne: bid._id } }, { $set: { status: "rejected" } });

    res.json({ message: "Freelancer hired successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
