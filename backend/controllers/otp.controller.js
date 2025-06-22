const axios = require("axios");
const { generateOTP, setOTP, getOTP, deleteOTP } = require("../utils/otpStore");

const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ error: "Email is required" });

  const otp = generateOTP();
  setOTP(email, otp);

  const templateParams = {
    user_email: email,
    otp_code: otp,
  };

  try {
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY, // Include accessToken in the body
        template_params: templateParams,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("EmailJS response:", response.data);
    res.send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("EmailJS error:", error.response?.data || error.message);
    // console.log("Full error object:", error);
    res.status(500).send({ error: "Failed to send OTP" });
  }
};

const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).send({ error: "Missing fields" });

  const record = getOTP(email);
  if (!record) return res.status(404).send({ error: "No OTP found" });
  if (Date.now() > record.expiresAt) {
    deleteOTP(email);
    return res.status(410).send({ error: "OTP expired" });
  }
  if (record.otp !== otp) return res.status(401).send({ error: "Invalid OTP" });

  deleteOTP(email);
  res.send({ success: true, message: "OTP verified successfully" });
};

module.exports = { sendOTP, verifyOTP };
