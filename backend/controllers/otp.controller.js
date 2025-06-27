const nodemailer = require("nodemailer");
const { generateOTP, setOTP, getOTP, deleteOTP } = require("../utils/otpStore");

const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ error: "Email is required" });

  const otp = generateOTP();
  setOTP(email, otp);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: `"Twiller" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
    console.log("Nodemailer: OTP sent to", email);
    console.log("Nodemailer: OTP sent to", info.messageId);
    res.send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Nodemailer error: ", error.message);
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
