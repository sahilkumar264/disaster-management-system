const TREATMENT_SUGGESTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionFocus: { type: "string" },
    summary: { type: "string" },
    suggestedMedicines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          purpose: { type: "string" },
          caution: { type: "string" },
        },
        required: ["name", "purpose", "caution"],
      },
    },
    supportiveCare: {
      type: "array",
      items: { type: "string" },
    },
    escalationSignals: {
      type: "array",
      items: { type: "string" },
    },
    disclaimer: { type: "string" },
  },
  required: [
    "conditionFocus",
    "summary",
    "suggestedMedicines",
    "supportiveCare",
    "escalationSignals",
    "disclaimer",
  ],
};

const DISCLAIMER =
  "Supportive suggestion only. A licensed clinician must confirm diagnosis, treatment, and dosage before medicine is given.";

const KEYWORD_RULES = [
  {
    keywords: ["fever", "viral", "temperature"],
    summary:
      "Likely fever-focused supportive care with hydration and monitoring.",
    suggestedMedicines: [
      {
        name: "Paracetamol / Acetaminophen",
        purpose: "General fever and pain relief support.",
        caution:
          "Confirm suitability, allergies, liver history, and correct dosing with a clinician.",
      },
    ],
    supportiveCare: [
      "Encourage oral fluids and rest.",
      "Monitor temperature and worsening symptoms.",
      "Keep the patient in a cool, ventilated environment.",
    ],
    escalationSignals: [
      "Very high or persistent fever",
      "Confusion, breathing difficulty, or dehydration",
      "Symptoms lasting longer than expected or rapidly worsening",
    ],
  },
  {
    keywords: ["cough", "cold", "throat", "flu"],
    summary:
      "Upper-respiratory supportive care may help while monitoring breathing status.",
    suggestedMedicines: [
      {
        name: "Paracetamol / Acetaminophen",
        purpose: "Helps with fever, body ache, or sore throat discomfort.",
        caution:
          "Check age, liver history, allergies, and clinician guidance before use.",
      },
      {
        name: "Saline nasal spray or lozenges",
        purpose: "May ease nasal congestion or throat irritation.",
        caution:
          "Use only if appropriate for the patient and avoid if a clinician advises otherwise.",
      },
    ],
    supportiveCare: [
      "Provide fluids and rest.",
      "Watch for breathing difficulty or chest pain.",
      "Use masks and hygiene precautions if infection is suspected.",
    ],
    escalationSignals: [
      "Shortness of breath",
      "Blue lips, chest pain, or low oxygen concerns",
      "Persistent high fever or inability to drink fluids",
    ],
  },
  {
    keywords: ["diarrhea", "vomiting", "dehydration"],
    summary:
      "Main priority is rehydration support and monitoring for worsening dehydration.",
    suggestedMedicines: [
      {
        name: "ORS (Oral Rehydration Solution)",
        purpose: "Replaces fluid and electrolyte losses.",
        caution:
          "Urgent clinician review is needed if vomiting is continuous or severe dehydration is suspected.",
      },
    ],
    supportiveCare: [
      "Track fluid intake and urine output if possible.",
      "Encourage small, frequent sips of clean fluids.",
      "Keep the patient under observation for weakness or dizziness.",
    ],
    escalationSignals: [
      "Very low urine output",
      "Severe weakness, fainting, or confusion",
      "Blood in stool or persistent vomiting",
    ],
  },
  {
    keywords: ["wound", "injury", "cut", "bleeding", "burn", "fracture"],
    summary:
      "Immediate first-aid support and injury assessment are the main priorities.",
    suggestedMedicines: [
      {
        name: "Paracetamol / Acetaminophen",
        purpose: "General pain relief support while awaiting professional evaluation.",
        caution:
          "Do not delay medical assessment for major trauma, heavy bleeding, or suspected fracture.",
      },
      {
        name: "Antiseptic wound cleaning support",
        purpose: "May help with basic wound cleaning if clinician-approved.",
        caution:
          "Use only for minor wounds and follow proper sterile dressing practice.",
      },
    ],
    supportiveCare: [
      "Clean and cover wounds using safe dressing practice.",
      "Immobilize suspected fractures.",
      "Monitor bleeding, swelling, and infection signs.",
    ],
    escalationSignals: [
      "Heavy bleeding or deep wound",
      "Suspected fracture or loss of movement",
      "Burn severity, pus, fever, or spreading redness",
    ],
  },
  {
    keywords: ["asthma", "wheezing", "breath", "breathing"],
    summary:
      "Airway and breathing status should be prioritized immediately.",
    suggestedMedicines: [
      {
        name: "Rescue inhaler only if already prescribed to the patient",
        purpose: "Supports known asthma symptom relief if part of the patient's existing care plan.",
        caution:
          "Urgent evaluation is needed for active breathing distress; do not improvise unknown prescriptions.",
      },
    ],
    supportiveCare: [
      "Seat the patient upright and monitor breathing closely.",
      "Reduce dust, smoke, and crowd exposure.",
      "Arrange rapid medical review if symptoms persist.",
    ],
    escalationSignals: [
      "Rapid or labored breathing",
      "Inability to speak full sentences",
      "Blue lips or visible exhaustion",
    ],
  },
];

const extractResponseText = (responseJson) => {
  if (typeof responseJson.output_text === "string" && responseJson.output_text) {
    return responseJson.output_text;
  }

  if (!Array.isArray(responseJson.output)) {
    return "";
  }

  return responseJson.output
    .flatMap((item) => item.content || [])
    .map((content) => {
      if (typeof content.text === "string") {
        return content.text;
      }

      if (content.text && typeof content.text.value === "string") {
        return content.text.value;
      }

      return "";
    })
    .join("\n")
    .trim();
};

const buildFallbackSuggestion = (victim, medicalRecord) => {
  const conditionText = [
    victim.medicalCondition,
    medicalRecord?.disease,
    medicalRecord?.severity,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchedRule =
    KEYWORD_RULES.find((rule) =>
      rule.keywords.some((keyword) => conditionText.includes(keyword))
    ) || null;

  const fallback = matchedRule || {
    summary:
      "Condition-specific details are limited, so only cautious supportive guidance is available.",
    suggestedMedicines: [
      {
        name: "Paracetamol / Acetaminophen only if clinically appropriate",
        purpose: "General pain or fever support in some cases.",
        caution:
          "Confirm age, allergies, liver history, and dosage with a clinician first.",
      },
    ],
    supportiveCare: [
      "Keep the victim hydrated and under observation.",
      "Document symptoms clearly for the medical team.",
      "Seek clinician review before giving any new medication.",
    ],
    escalationSignals: [
      "Rapid worsening of symptoms",
      "Breathing difficulty, confusion, or collapse",
      "Any symptom that appears severe or unusual",
    ],
  };

  return {
    source: "fallback",
    model: "local-support-rules",
    generatedAt: new Date().toISOString(),
    suggestion: {
      conditionFocus:
        victim.medicalCondition || medicalRecord?.disease || "General condition review",
      summary: fallback.summary,
      suggestedMedicines: fallback.suggestedMedicines,
      supportiveCare: fallback.supportiveCare,
      escalationSignals: fallback.escalationSignals,
      disclaimer: DISCLAIMER,
    },
  };
};

const buildPrompt = (victim, medicalRecord) =>
  [
    `Victim name: ${victim.name || "Unknown"}`,
    `Age: ${victim.age || "Unknown"}`,
    `Gender: ${victim.gender || "Unknown"}`,
    `Medical condition from intake: ${victim.medicalCondition || "Not provided"}`,
    `Medical record disease: ${medicalRecord?.disease || "Not provided"}`,
    `Medical record severity: ${medicalRecord?.severity || "Not provided"}`,
    `Medical record medication: ${medicalRecord?.medication || "Not provided"}`,
    `Medical record doctor assigned: ${medicalRecord?.doctorAssigned || "Not provided"}`,
  ].join("\n");

const fetchOpenAISuggestion = async (victim, medicalRecord) => {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5",
      reasoning: { effort: "low" },
      temperature: 0.2,
      max_output_tokens: 700,
      instructions:
        "You are assisting disaster-relief administrators. Provide cautious, high-level treatment support suggestions based on the victim context. Do not claim certainty, do not prescribe dosages, do not recommend controlled medicines, and emphasize when urgent clinician review is needed. Suggest only common supportive medicines by generic name when appropriate. Return valid JSON matching the requested schema.",
      input: buildPrompt(victim, medicalRecord),
      text: {
        format: {
          type: "json_schema",
          name: "treatment_suggestion",
          schema: TREATMENT_SUGGESTION_SCHEMA,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const message =
      errorJson?.error?.message || "OpenAI request failed while generating treatment guidance.";
    throw new Error(message);
  }

  const responseJson = await response.json();
  const responseText = extractResponseText(responseJson);

  if (!responseText) {
    throw new Error("OpenAI returned an empty suggestion.");
  }

  const suggestion = JSON.parse(responseText);

  return {
    source: "openai",
    model: process.env.OPENAI_MODEL || "gpt-5",
    generatedAt: new Date().toISOString(),
    suggestion: {
      ...suggestion,
      disclaimer: suggestion.disclaimer || DISCLAIMER,
    },
  };
};

const generateTreatmentSuggestion = async (victim, medicalRecord) => {
  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackSuggestion(victim, medicalRecord);
  }

  try {
    return await fetchOpenAISuggestion(victim, medicalRecord);
  } catch (error) {
    return {
      ...buildFallbackSuggestion(victim, medicalRecord),
      note: error.message,
    };
  }
};

module.exports = {
  generateTreatmentSuggestion,
};
