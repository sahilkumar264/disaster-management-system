const mongoose = require("mongoose");
require("dotenv").config({ path: "../../.env" });

const connectDB = require("../config/db");

const Shelter = require("../models/Shelter");
const RescueTeam = require("../models/RescueTeam");

// 🔥 DATA
const shelters = [
  { name: "Gurdaspur Camp A", location: "Punjab", capacity: 800, occupied: 0, inchargeName: "Mr. Singh", contactNo: "9812340001" },
  { name: "Amritsar Relief Hub", location: "Punjab", capacity: 700, occupied: 0, inchargeName: "Ms. Kaur", contactNo: "9812340002" },
  { name: "Ferozepur Camp East", location: "Punjab", capacity: 600, occupied: 0, inchargeName: "Mr. Sharma", contactNo: "9812340003" },
  { name: "Ludhiana Relief Point", location: "Punjab", capacity: 900, occupied: 0, inchargeName: "Mr. Gill", contactNo: "9812340005" }
];

const rescueTeams = [
  { teamName: "Gurdaspur Rescue Team", leaderName: "Col. Kaur", contactNo: "9811111001", assignedArea: "Gurdaspur" },
  { teamName: "Amritsar Medical Team", leaderName: "Dr. Singh", contactNo: "9811111002", assignedArea: "Amritsar" },
  { teamName: "Ludhiana Rapid Response", leaderName: "Capt. Rana", contactNo: "9811111004", assignedArea: "Ludhiana" }
];

// 🔥 IMPORT DATA
const importData = async () => {
  try {
    await connectDB();

    await Shelter.deleteMany();
    await RescueTeam.deleteMany();

    await Shelter.insertMany(shelters);
    await RescueTeam.insertMany(rescueTeams);

    console.log("✅ Data Imported");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// 🔥 RUN
importData();