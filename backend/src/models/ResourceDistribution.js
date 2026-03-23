const mongoose = require("mongoose");

const distSchema = new mongoose.Schema(
  {
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter" },
    victim: { type: mongoose.Schema.Types.ObjectId, ref: "Victim" },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "ReliefItem" },
    quantityAllocated: Number,
    dateDistributed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResourceDistribution", distSchema);