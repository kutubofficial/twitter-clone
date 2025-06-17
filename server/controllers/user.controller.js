let usercollection;

async function registerUser(req, res) {
  const user = req.body;
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

module.exports = {
  registerUser,
  getUser,
  updateUser,
  getAllUsers,
  setUserCollection: (col) => (usercollection = col),
};
