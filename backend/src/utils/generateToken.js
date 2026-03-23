const jwt = require("jsonwebtoken");
const getRoleFromEmail = require("./getRoleFromEmail");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: getRoleFromEmail(user.email),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
