const express = require("express");
const router = express.Router();

const { addMedical, getMedical } = require("../controllers/medicalController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

// admin
router.post("/", auth, role("admin"), addMedical);

// public
router.get("/:victimId", getMedical);

module.exports = router;