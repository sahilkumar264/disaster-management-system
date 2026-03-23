const mongoose = require("mongoose");

const rescueTeamSchema = new mongoose.Schema({
  teamName: String,
  leaderName: String,
  contactNo: String,
  assignedArea: String,
});

module.exports = mongoose.model("RescueTeam", rescueTeamSchema);