const express = require("express");
const router = express.Router();

const {
  createDonation,
  getAllDonations,
} = require("../controllers/donationController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

// user
router.post("/", createDonation);

// admin
router.get("/", auth, role("admin"), getAllDonations);

module.exports = router;