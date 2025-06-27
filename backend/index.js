const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const audioRoutes = require("./routes/audio.routes");
const otpRoutes = require("./routes/otp.routes");
const authRoutes = require("./routes/auth.routes"); 

const { setUserCollection } = require("./controllers/user.controller");
const { setPostCollection } = require("./controllers/post.controller");
const { setLoginHistoryCollection } = require("./controllers/auth.controller"); 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Twiller is working");
});

connectDB().then(({ usercollection, postcollection, loginhistorycollection }) => {
  setUserCollection(usercollection);
  setPostCollection(postcollection);
  setLoginHistoryCollection(loginhistorycollection); 

  app.use(userRoutes);
  app.use(postRoutes);
  app.use(audioRoutes);
  app.use(otpRoutes);
  app.use(authRoutes); 
  app.listen(process.env.PORT, () => {
    console.log(
      `Twiller clone is running on http://localhost:${process.env.PORT}`
    );
  });
});