const Medical = require("../models/MedicalRecord");

// ADD / UPDATE
exports.addMedical = async (req, res) => {
  try {
    const { victimId, disease, severity, medication, doctorAssigned } = req.body;

    const record = await Medical.findOneAndUpdate(
      { victim: victimId },
      {
        disease,
        severity,
        medication,
        doctorAssigned,
      },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET BY VICTIM
exports.getMedical = async (req, res) => {
  try {
    const record = await Medical.findOne({ victim: req.params.victimId })
      .populate("victim");

    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};