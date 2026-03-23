const express = require("express");
const router = express.Router();

const {
  createDistribution,
  getAll,
} = require("../controllers/distributionController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.post("/", auth, role("admin"), createDistribution);
router.get("/", auth, role("admin"), getAll);

module.exports = router;