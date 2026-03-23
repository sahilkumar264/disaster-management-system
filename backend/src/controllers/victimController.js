const Victim = require("../models/Victim");
const Shelter = require("../models/Shelter");
const RescueTeam = require("../models/RescueTeam");

const DEFAULT_SHELTER = {
  name: "Central Relief Camp",
  location: "Main response zone",
  capacity: 1000,
  occupied: 0,
  inchargeName: "Operations Lead",
  contactNo: "0000000000",
};

const DEFAULT_RESCUE_TEAM = {
  teamName: "Rapid Response Team",
  leaderName: "Field Coordinator",
  contactNo: "0000000000",
  assignedArea: "Primary district",
};

exports.addVictim = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      contactNo,
      address,
      medicalCondition,
    } = req.body;

    const availableShelter = await Shelter.findOne({
      $expr: { $lt: ["$occupied", "$capacity"] },
    }).sort({ occupied: 1 });

    const assignedShelter =
      availableShelter || (await Shelter.create(DEFAULT_SHELTER));

    const rescueTeamCandidates = await RescueTeam.aggregate([
      { $sample: { size: 1 } },
    ]);
    const [sampledRescueTeam] = rescueTeamCandidates;
    const assignedRescueTeam =
      sampledRescueTeam || (await RescueTeam.create(DEFAULT_RESCUE_TEAM));

    const imageUrl = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : req.body.imageUrl;

    const victim = await Victim.create({
      name,
      age,
      gender,
      contactNo,
      address,
      medicalCondition,
      shelter: assignedShelter._id,
      rescueTeam: assignedRescueTeam._id,
      imageUrl,
    });

    assignedShelter.occupied += 1;
    await assignedShelter.save();

    const populatedVictim = await Victim.findById(victim._id)
      .populate("shelter")
      .populate("rescueTeam");

    res.status(201).json(populatedVictim);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.searchVictim = async (req, res) => {
  try {
    const name = req.query.name || "";

    const victims = await Victim.find({
      name: { $regex: name, $options: "i" },
    })
      .populate("shelter")
      .populate("rescueTeam");

    res.json(victims);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllVictims = async (req, res) => {
  try {
    const victims = await Victim.find()
      .populate("shelter")
      .populate("rescueTeam");

    res.json(victims);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getVictimById = async (req, res) => {
  try {
    const victim = await Victim.findById(req.params.id)
      .populate("shelter")
      .populate("rescueTeam");

    if (!victim) {
      return res.status(404).json({ msg: "Victim not found" });
    }

    res.json(victim);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
