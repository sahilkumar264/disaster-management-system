const Donation = require("../models/Donation");

// CREATE DONATION (USER)
exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.json(donation);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET ALL DONATIONS (ADMIN)
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("shelter")
      .populate("victim");

    res.json(donations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};