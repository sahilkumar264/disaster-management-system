const getRoleFromEmail = (email = "") => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.endsWith("@gov.in")) {
    return "admin";
  }

  return "user";
};

module.exports = getRoleFromEmail;
