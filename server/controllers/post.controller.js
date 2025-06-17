let postcollection;

async function createPost(req, res) {
  const result = await postcollection.insertOne(req.body);
  res.send(result);
}

async function getAllPosts(req, res) {
  const posts = (await postcollection.find().toArray()).reverse();
  res.send(posts);
}

async function getUserPosts(req, res) {
  const email = req.query.email;
  const posts = (await postcollection.find({ email }).toArray()).reverse();
  res.send(posts);
}

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  setPostCollection: (col) => (postcollection = col),
};
