const Distribution = require("../models/ResourceDistribution");
const Item = require("../models/ReliefItem");

// CREATE
exports.createDistribution = async (req, res) => {
  try {
    const { item, quantityAllocated } = req.body;

    const itemData = await Item.findById(item);

    if (itemData.totalQuantity < quantityAllocated) {
      return res.status(400).json({ msg: "Not enough stock" });
    }

    itemData.totalQuantity -= quantityAllocated;
    await itemData.save();

    const dist = await Distribution.create(req.body);

    res.json(dist);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const data = await Distribution.find()
      .populate("victim")
      .populate("item")
      .populate("shelter");

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};