const express = require("express");
const router = express.Router();
const { loginUser, verifyLoginOTP, getLoginHistory, saveLoginHistory } = require("../controllers/auth.controller");

router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOTP);
router.get("/login-history", getLoginHistory);

router.post("/save-login-history", saveLoginHistory);

module.exports = router;