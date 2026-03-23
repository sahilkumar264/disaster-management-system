const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: String,
    purpose: String,
    caution: String,
  },
  { _id: false }
);

const treatmentSuggestionSchema = new mongoose.Schema(
  {
    victim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Victim",
      required: true,
      index: true,
    },
    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
      default: null,
    },
    generatedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    generatedByEmail: String,
    victimName: String,
    source: String,
    model: String,
    note: String,
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    conditionFocus: String,
    summary: String,
    suggestedMedicines: [medicineSchema],
    supportiveCare: [String],
    escalationSignals: [String],
    disclaimer: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TreatmentSuggestion", treatmentSuggestionSchema);
