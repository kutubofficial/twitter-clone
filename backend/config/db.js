const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB_ATLAS || process.env.MONGODB_URL;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Connected");
    return {
      postcollection: client.db("database").collection("posts"),
      usercollection: client.db("database").collection("users"),
      loginhistorycollection: client.db("database").collection("loginhistory"),
    };
  } catch (err) {
    console.error("DB connection error:", err);
    throw err;
  }
}

module.exports = connectDB;
