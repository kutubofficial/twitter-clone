const otpStore = new Map(); 

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function setOTP(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, 
  });
}

function getOTP(email) {
  return otpStore.get(email);
}

function deleteOTP(email) {
  otpStore.delete(email);
}

module.exports = {
  generateOTP,
  setOTP,
  getOTP,
  deleteOTP,
};
