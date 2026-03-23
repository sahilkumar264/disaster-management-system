const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtpAndRegister,
  login,
  googleAuth,
} = require("../controllers/authController");

router.post("/register", (req, res) => {
  res.status(410).json({
    msg: "Direct registration is disabled. Verify OTP before creating an account.",
  });
});
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndRegister);

module.exports = router;
