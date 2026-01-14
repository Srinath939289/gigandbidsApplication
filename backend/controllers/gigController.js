const Gig = require("../models/Gig");

exports.createGig = async (req, res) => {
  const gig = await Gig.create({
    ...req.body,
    ownerId: req.userId,
  });

  res.status(201).json(gig);
};

exports.getGigs = async (req, res) => {
  const query = req.query.search
    ? { title: { $regex: req.query.search, $options: "i" } }
    : {};

  const gigs = await Gig.find({ status: "open", ...query });
  res.json(gigs);
};
