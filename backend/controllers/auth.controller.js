let loginhistorycollection;

const useragent = require("useragent");
const { sendOTP, verifyOTP } = require("./otp.controller");

async function loginUser(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).send({ error: "Email is required" });

  const agent = useragent.parse(req.headers["user-agent"]);
  const browser = agent.family.toLowerCase();
  const os = agent.os.family;
  const deviceType = agent.device.family.toLowerCase().includes("mobile")
    ? "mobile"
    : "desktop";
  const ipAddress = req.ip;

  //* Mobile time restriction (10 AM–1 PM IST)
  if (deviceType === "mobile") {
    const now = new Date();
    const hourIST =
      (now.getUTCHours() + 5 + (now.getUTCMinutes() + 30) / 60) % 24;
    if (hourIST < 10 || hourIST > 13) {
      return res
        .status(403)
        .send({ error: "Mobile access allowed only between 10 AM–1 PM IST" });
    }
  }

  //* Browser-based authentication
  if (browser.includes("chrome")) {
    return sendOTP(req, res); // Trigger OTP for Chrome
  } else if (browser.includes("edge")) {
    //* Direct login for Edge
    await loginhistorycollection.insertOne({
      userEmail: email,
      browser,
      os,
      deviceType,
      ipAddress,
      loginTime: new Date(),
    });
    return res.send({ success: true, message: "Login successful" });
  } else {
    return sendOTP(req, res); // Default: OTP for other browsers
  }
}

async function verifyLoginOTP(req, res) {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).send({ error: "Missing fields" });

  const agent = useragent.parse(req.headers["user-agent"]);
  const browser = agent.family;
  const os = agent.os.family;
  const deviceType = agent.device.family.toLowerCase().includes("mobile")
    ? "mobile"
    : "desktop";
  const ipAddress = req.ip;

  // Verify OTP
  const verifyResult = await new Promise((resolve) => {
    req.body = { email, otp };
    verifyOTP(req, {
      send: (data) => resolve(data),
      status: () => ({ send: resolve }),
    });
  });

  if (!verifyResult.success) {
    return res.status(401).send(verifyResult);
  }

  //* Store login history in database
  await loginhistorycollection.insertOne({
    userEmail: email,
    browser,
    os,
    deviceType,
    ipAddress,
    loginTime: new Date(),
  });

  res.send({ success: true, message: "Login successful" });
}

async function getLoginHistory(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).send({ error: "Email is required" });

  try {
    const latest = await loginhistorycollection
      .find({ userEmail: email })
      .sort({ loginTime: -1 })
      .limit(1) 
      .toArray();

    res.send(latest);
  } catch (error) {
    console.error("Error fetching login history:", error.message);
    res.status(500).send({ error: "Failed to fetch login history" });
  }
}

async function saveLoginHistory(req, res) {
  const { email, browser, os, deviceType } = req.body;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    await loginhistorycollection.insertOne({
      userEmail: email,
      browser,
      os,
      deviceType,
      ipAddress,
      loginTime: new Date(),
    });

    res.json({ success: true, message: "Login history saved" });
  } catch (err) {
    console.error("Error saving login history:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  loginUser,
  verifyLoginOTP,
  getLoginHistory,
  saveLoginHistory,
  setLoginHistoryCollection: (col) => (loginhistorycollection = col),
};
