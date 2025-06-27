let usercollection;

async function registerUser(req, res) {
  const user = req.body;
  if (!user.email) return res.status(400).send({ error: "Email is required" });

  //* Check if email already exists
  const existingUser = await usercollection.findOne({ email: user.email });
  if (existingUser) return res.status(409).send({ error: "Email already registered" });

  const result = await usercollection.insertOne(user);
  res.send(result);
}

async function getUser(req, res) {
  const email = req.query.email;
  const user = await usercollection.find({ email }).toArray();
  res.send(user);
}

async function updateUser(req, res) {
  const filter = { email: req.params.email };
  const updateDoc = { $set: req.body };
  const result = await usercollection.updateOne(filter, updateDoc, {
    upsert: true,
  });
  res.send(result);
}

async function getAllUsers(req, res) {
  const users = await usercollection.find().toArray();
  res.send(users);
}

async function verifyUserExists(email) {
  const user = await usercollection.findOne({ email });
  return !!user;
}

module.exports = {
  registerUser,
  getUser,
  updateUser,
  getAllUsers,
  verifyUserExists,
  setUserCollection: (col) => (usercollection = col),
};