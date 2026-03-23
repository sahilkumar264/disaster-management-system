const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: String,
    donorContact: String,

    donationType: {
      type: String,
      enum: ["Money", "Food", "Clothes"],
    },

    amount: Number,
    itemDonated: String,
    quantity: Number,

    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
    },

    victim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Victim",
    },

    dateDonated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
