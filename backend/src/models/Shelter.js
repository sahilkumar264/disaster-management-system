const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema({
  name: String,
  location: String,
  capacity: Number,
  occupied: {
    type: Number,
    default: 0,
  },
  inchargeName: String,
  contactNo: String,
});

module.exports = mongoose.model("Shelter", shelterSchema);