const mongoose = require("mongoose");

const medicalSchema = new mongoose.Schema(
  {
    victim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Victim",
      unique: true,
    },
    disease: String,
    severity: {
      type: String,
      enum: ["Low", "Moderate", "High", "Severe"],
    },
    medication: String,
    doctorAssigned: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalSchema);