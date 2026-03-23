const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const {
  getOverview,
  getTableList,
  getTableData,
  updateTableRecord,
  getVictimTreatmentSuggestion,
  getVictimTreatmentSuggestionHistory,
} = require("../controllers/adminController");

router.use(auth, role("admin"));

router.get("/overview", getOverview);
router.get("/tables", getTableList);
router.get("/tables/:table", getTableData);
router.put("/tables/:table/:id", updateTableRecord);
router.get("/victims/:id/treatment-suggestions", getVictimTreatmentSuggestionHistory);
router.post("/victims/:id/treatment-suggestion", getVictimTreatmentSuggestion);

module.exports = router;
