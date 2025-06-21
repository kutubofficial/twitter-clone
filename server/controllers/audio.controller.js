let postcollection;
const { getOTP } = require("../utils/otpStore"); // ✅ This should return stored OTP for the user

// ✅ Time check helper: 2 PM – 7 PM IST
const isWithinAllowedTime = () => {
  const now = new Date();
  const istOffset = 330 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const hour = istNow.getUTCHours();
  return hour >= 8 && hour < 13;
};

// ✅ Final audio post controller with OTP, time, and size checks
async function createAudioPost(req, res) {
  const { audioUrl, email, duration, sizeMB, otp } = req.body;

  // 1. ✅ OTP Check
  const record = getOTP(email);
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(401).send({ error: "Invalid or expired OTP" });
  }

  // 2. ✅ Duration Check
  if (duration > 300) {
    return res.status(400).send({ error: "Audio exceeds 5 minutes" });
  }

  // 3. ✅ Size Check
  if (sizeMB > 100) {
    return res.status(400).send({ error: "Audio exceeds 100MB" });
  }

  // 4. ✅ Time Check
  if (!isWithinAllowedTime()) {
    return res.status(403).send({
      error: "Audio uploads allowed only between 2 PM and 7 PM IST",
    });
  }

  // 5. ✅ Store Audio Post
  const audioPost = {
    audioUrl,
    email,
    createdAt: new Date(),
    type: "audio",
  };

  const result = await postcollection.insertOne(audioPost);
  res.send({ message: "Audio uploaded successfully", result });
}

module.exports = {
  createAudioPost,
  setPostCollection: (col) => (postcollection = col),
};
