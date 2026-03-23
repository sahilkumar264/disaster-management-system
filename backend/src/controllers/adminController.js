const Donation = require("../models/Donation");
const MedicalRecord = require("../models/MedicalRecord");
const ReliefItem = require("../models/ReliefItem");
const RescueTeam = require("../models/RescueTeam");
const ResourceDistribution = require("../models/ResourceDistribution");
const Shelter = require("../models/Shelter");
const TreatmentSuggestion = require("../models/TreatmentSuggestion");
const User = require("../models/User");
const Victim = require("../models/Victim");
const {
  generateTreatmentSuggestion,
} = require("../services/treatmentSuggestionService");

const TABLE_CONFIG = {
  users: {
    label: "Users",
    columns: ["username", "email", "role", "googleId", "createdAt"],
    find: () => User.find().select("-password").lean(),
    model: User,
  },
  victims: {
    label: "Victims",
    columns: [
      "name",
      "age",
      "gender",
      "contactNo",
      "address",
      "medicalCondition",
      "shelter",
      "rescueTeam",
      "createdAt",
    ],
    find: () => Victim.find().lean(),
    model: Victim,
  },
  donations: {
    label: "Donations",
    columns: [
      "donorName",
      "donorContact",
      "donationType",
      "amount",
      "itemDonated",
      "quantity",
      "createdAt",
    ],
    find: () => Donation.find().lean(),
    model: Donation,
  },
  medicalRecords: {
    label: "Medical Records",
    columns: [
      "victim",
      "disease",
      "severity",
      "medication",
      "doctorAssigned",
      "updatedAt",
    ],
    find: () => MedicalRecord.find().lean(),
    model: MedicalRecord,
  },
  shelters: {
    label: "Shelters",
    columns: [
      "name",
      "location",
      "capacity",
      "occupied",
      "inchargeName",
      "contactNo",
    ],
    find: () => Shelter.find().lean(),
    model: Shelter,
  },
  rescueTeams: {
    label: "Rescue Teams",
    columns: ["teamName", "leaderName", "contactNo", "assignedArea"],
    find: () => RescueTeam.find().lean(),
    model: RescueTeam,
  },
  reliefItems: {
    label: "Relief Items",
    columns: ["itemName", "category", "totalQuantity", "unit"],
    find: () => ReliefItem.find().lean(),
    model: ReliefItem,
  },
  resourceDistributions: {
    label: "Resource Distributions",
    columns: ["shelter", "victim", "item", "quantityAllocated", "dateDistributed"],
    find: () => ResourceDistribution.find().lean(),
    model: ResourceDistribution,
  },
  treatmentSuggestions: {
    label: "Treatment Suggestions",
    columns: [
      "victimName",
      "generatedByEmail",
      "source",
      "model",
      "conditionFocus",
      "generatedAt",
    ],
    find: () => TreatmentSuggestion.find().lean(),
    model: TreatmentSuggestion,
  },
};

const getTableConfig = (table) => TABLE_CONFIG[table];

const sanitizePayload = (payload) => {
  const nextPayload = { ...payload };

  delete nextPayload._id;
  delete nextPayload.__v;
  delete nextPayload.createdAt;
  delete nextPayload.updatedAt;

  return nextPayload;
};

const getSafeGeneratedAt = (value) => {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Date();
  }

  return date;
};

const serializeSuggestionHistoryEntry = (entry) => ({
  _id: entry._id,
  victim: entry.victim,
  victimName: entry.victimName,
  generatedByEmail: entry.generatedByEmail,
  source: entry.source,
  model: entry.model,
  note: entry.note,
  generatedAt: entry.generatedAt,
  createdAt: entry.createdAt,
  suggestion: {
    conditionFocus: entry.conditionFocus,
    summary: entry.summary,
    suggestedMedicines: entry.suggestedMedicines || [],
    supportiveCare: entry.supportiveCare || [],
    escalationSignals: entry.escalationSignals || [],
    disclaimer: entry.disclaimer,
  },
});

const saveSuggestionHistoryEntry = async ({
  victim,
  medicalRecord,
  suggestionResult,
  adminUser,
}) => {
  const savedEntry = await TreatmentSuggestion.create({
    victim: victim._id,
    medicalRecord: medicalRecord?._id || null,
    generatedByUser: adminUser?.id || null,
    generatedByEmail: adminUser?.email || "",
    victimName: victim.name || "Unknown victim",
    source: suggestionResult.source,
    model: suggestionResult.model,
    note: suggestionResult.note,
    generatedAt: getSafeGeneratedAt(suggestionResult.generatedAt),
    conditionFocus: suggestionResult.suggestion?.conditionFocus || "",
    summary: suggestionResult.suggestion?.summary || "",
    suggestedMedicines: suggestionResult.suggestion?.suggestedMedicines || [],
    supportiveCare: suggestionResult.suggestion?.supportiveCare || [],
    escalationSignals: suggestionResult.suggestion?.escalationSignals || [],
    disclaimer: suggestionResult.suggestion?.disclaimer || "",
  });

  return serializeSuggestionHistoryEntry(savedEntry.toObject());
};

exports.getOverview = async (req, res) => {
  const entries = await Promise.all(
    Object.entries(TABLE_CONFIG).map(async ([key, config]) => ({
      key,
      label: config.label,
      count: await config.model.countDocuments(),
    }))
  );

  res.json({
    tables: entries,
    totals: {
      users: entries.find((entry) => entry.key === "users")?.count || 0,
      victims: entries.find((entry) => entry.key === "victims")?.count || 0,
      donations: entries.find((entry) => entry.key === "donations")?.count || 0,
    },
  });
};

exports.getTableList = async (req, res) => {
  res.json(
    Object.entries(TABLE_CONFIG).map(([key, config]) => ({
      key,
      label: config.label,
      columns: config.columns,
    }))
  );
};

exports.getTableData = async (req, res) => {
  const config = getTableConfig(req.params.table);

  if (!config) {
    return res.status(404).json({ msg: "Unknown table" });
  }

  const records = await config.find();

  res.json({
    key: req.params.table,
    label: config.label,
    columns: config.columns,
    records,
  });
};

exports.updateTableRecord = async (req, res) => {
  const config = getTableConfig(req.params.table);

  if (!config) {
    return res.status(404).json({ msg: "Unknown table" });
  }

  const payload = sanitizePayload(req.body);
  const record = await config.model.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    return res.status(404).json({ msg: "Record not found" });
  }

  res.json(record);
};

exports.getVictimTreatmentSuggestion = async (req, res) => {
  const victim = await Victim.findById(req.params.id).lean();

  if (!victim) {
    return res.status(404).json({ msg: "Victim not found" });
  }

  const medicalRecord = await MedicalRecord.findOne({ victim: victim._id }).lean();

  if (!victim.medicalCondition && !medicalRecord?.disease) {
    return res.status(400).json({
      msg: "Medical condition is missing for this victim. Add a condition first.",
    });
  }

  const suggestion = await generateTreatmentSuggestion(victim, medicalRecord);
  const historyEntry = await saveSuggestionHistoryEntry({
    victim,
    medicalRecord,
    suggestionResult: suggestion,
    adminUser: req.user,
  });

  res.json({
    ...suggestion,
    historyEntry,
  });
};

exports.getVictimTreatmentSuggestionHistory = async (req, res) => {
  const victim = await Victim.findById(req.params.id).select("_id");

  if (!victim) {
    return res.status(404).json({ msg: "Victim not found" });
  }

  const history = await TreatmentSuggestion.find({ victim: victim._id })
    .sort({ generatedAt: -1, createdAt: -1 })
    .lean();

  res.json(history.map(serializeSuggestionHistoryEntry));
};
