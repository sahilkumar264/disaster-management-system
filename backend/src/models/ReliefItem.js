const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  totalQuantity: Number,
  unit: String,
});

module.exports = mongoose.model("ReliefItem", itemSchema);