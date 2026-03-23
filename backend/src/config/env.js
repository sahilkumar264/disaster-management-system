const getCommaSeparatedValues = (value = "") =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const hasSafeJwtSecret = () => {
  const secret = process.env.JWT_SECRET || "";
  const blockedValues = new Set(["", "change_me", "replace_with_a_long_random_secret"]);

  return !blockedValues.has(secret) && secret.length >= 16;
};

const getAllowedOrigins = () => {
  const configuredOrigins = getCommaSeparatedValues(process.env.CLIENT_URL);

  if (configuredOrigins.length > 0) {
    return configuredOrigins;
  }

  if (process.env.NODE_ENV !== "production") {
    return ["http://localhost:5173", "http://127.0.0.1:5173"];
  }

  return [];
};

const validateServerEnv = () => {
  const missing = [];

  if (!process.env.MONGO_URI) {
    missing.push("MONGO_URI");
  }

  if (!hasSafeJwtSecret()) {
    missing.push("JWT_SECRET");
  }

  if (process.env.NODE_ENV === "production") {
    ["CLIENT_URL", "EMAIL_USER", "EMAIL_PASS"].forEach((key) => {
      if (!process.env[key]) {
        missing.push(key);
      }
    });
  }

  if (missing.length > 0) {
    throw new Error(`Missing or unsafe environment variables: ${missing.join(", ")}`);
  }
};

module.exports = {
  getAllowedOrigins,
  validateServerEnv,
};
