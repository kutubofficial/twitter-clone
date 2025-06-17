// const { MongoClient, ServerApiVersion } = require("mongodb");
// const express = require("express");
// const cors = require("cors");
// const url = "mongodb://localhost:27017/tweller";
// const mongodb_atlas =
//   "mongodb+srv://kutubofficial599:newAshokNagar@tweller.4lstprl.mongodb.net/?retryWrites=true&w=majority&appName=tweller";

// const port = 5000;

// const app = express();
// app.use(cors());
// app.use(express.json());

// const client = new MongoClient(url);

// async function run() {
//   try {
//     await client.connect();
//     const postcollection = client.db("database").collection("posts");
//     const usercollection = client.db("database").collection("users");
//     app.post("/register", async (req, res) => {
//       const user = req.body;
//       console.log(user);
//       const result = await usercollection.insertOne(user);
//       res.send(result);
//     });
//     app.get("/loggedinuser", async (req, res) => {
//       const email = req.query.email;
//       const user = await usercollection.find({ email: email }).toArray();
//       res.send(user);
//     });
//     app.post("/post", async (req, res) => {
//       const post = req.body;
//       const result = await postcollection.insertOne(post);
//       res.send(result);
//     });
//     app.get("/post", async (req, res) => {
//       const post = (await postcollection.find().toArray()).reverse();
//       res.send(post);
//     });
//     app.get("/userpost", async (req, res) => {
//       const email = req.query.email;
//       const post = (
//         await postcollection.find({ email: email }).toArray()
//       ).reverse();
//       res.send(post);
//     });

//     app.get("/user", async (req, res) => {
//       const user = await usercollection.find().toArray();
//       res.send(user);
//     });

//     app.patch("/userupdate/:email", async (req, res) => {
//       const filter = req.params;
//       const profile = req.body;
//       const options = { upsert: true };
//       const updateDoc = { $set: profile };
//       console.log(profile);
//       const result = await usercollection.updateOne(filter, updateDoc, options);
//       res.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Twiller is working");
// });

// app.listen(port, () => {
//   console.log(`Twiller clone is working on ${port}`);
// });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

const { setUserCollection } = require("./controllers/user.controller");
const { setPostCollection } = require("./controllers/post.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Twiller is working");
});

connectDB().then(({ usercollection, postcollection }) => {
  setUserCollection(usercollection);
  setPostCollection(postcollection);

  app.use(userRoutes);
  app.use(postRoutes);

  app.listen(process.env.PORT, () => {
    console.log(
      `Twiller clone is running on http://localhost:${process.env.PORT}`
    );
  });
});
