const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const getRoleFromEmail = require("../utils/getRoleFromEmail");
const client = require("../config/google");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const ensureRequiredFields = (fields) =>
  Object.values(fields).every((value) => typeof value === "string" && value.trim() !== "");

const syncUserRole = async (user) => {
  const expectedRole = getRoleFromEmail(user.email);

  if (user.role !== expectedRole) {
    user.role = expectedRole;
    await user.save();
  }

  return user;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!ensureRequiredFields({ email: normalizedEmail, password })) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ msg: "Invalid creds" });

    if (!user.password) return res.status(400).json({ msg: "Invalid creds" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid creds" });

    user = await syncUserRole(user);

    res.json({
      token: generateToken(user),
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ msg: "Google token is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ msg: "Google auth is not configured" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = normalizeEmail(payload.email);
    const name = payload.name;
    const googleId = payload.sub;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        googleId,
        role: getRoleFromEmail(email),
      });
    } else {
      user.googleId = user.googleId || googleId;
      user.username = user.username || name;
      await syncUserRole(user);
      await user.save();
    }

    res.json({
      token: generateToken(user),
      user,
    });
  } catch (err) {
    res.status(401).json({ msg: "Google auth failed" });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(503).json({ msg: "Email OTP service is not configured" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      {
        email,
        otpHash,
        expiresAt,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    try {
      await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);
    } catch (error) {
      await Otp.deleteOne({ email });
      throw error;
    }

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!ensureRequiredFields({ username, email: normalizedEmail, password, otp })) {
      return res.status(400).json({
        msg: "Username, email, password, and OTP are required",
      });
    }

    const record = await Otp.findOne({ email: normalizedEmail });
    if (!record) return res.status(400).json({ msg: "OTP not found" });

    if (record.expiresAt < Date.now()) {
      await Otp.deleteOne({ email: normalizedEmail });
      return res.status(400).json({ msg: "OTP expired" });
    }

    const isOtpValid = await bcrypt.compare(otp, record.otpHash);

    if (!isOtpValid) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ msg: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashed,
      role: getRoleFromEmail(normalizedEmail),
    });

    await Otp.deleteOne({ email: normalizedEmail });

    res.json({
      token: generateToken(user),
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
