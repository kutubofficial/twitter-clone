// controllers/otp.controller.js
const axios = require("axios");
const {
  generateOTP,
  setOTP,
} = require("../utils/otpStore");

const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send({ error: "Email is required" });

  const otp = generateOTP();
  setOTP(email, otp); // Save in memory

  const templateParams = {
    user_email: email,
    otp_code: otp,
  };

  try {
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: templateParams,
    });

    res.send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("EmailJS error", error.message);
    res.status(500).send({ error: "Failed to send OTP" });
  }
};

module.exports = { sendOTP };
