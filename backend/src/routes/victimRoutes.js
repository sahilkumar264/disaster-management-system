const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");

const {
  addVictim,
  searchVictim,
  getAllVictims,
  getVictimById,
} = require("../controllers/victimController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.get("/search", searchVictim);
router.get("/:id", getVictimById);

router.get("/", auth, role("admin"), getAllVictims);
router.post("/", auth, role("admin"), upload.single("image"), addVictim);

module.exports = router;
