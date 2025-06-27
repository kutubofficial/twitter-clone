const express = require("express");
const router = express.Router();
const { loginUser, verifyLoginOTP, getLoginHistory } = require("../controllers/auth.controller");

router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOTP);
router.get("/login-history", getLoginHistory);

module.exports = router;