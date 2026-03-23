const mongoose = require("mongoose");

const victimSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    gender: String,
    contactNo: String,
    address: String,
    medicalCondition: String,

    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
    },

    rescueTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RescueTeam",
    },

    imageUrl: String,

    dateRegistered: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Victim", victimSchema);