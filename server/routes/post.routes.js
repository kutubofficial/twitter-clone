const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getUserPosts } = require("../controllers/post.controller");

router.post("/post", createPost);
router.get("/post", getAllPosts);
router.get("/userpost", getUserPosts);

module.exports = router;
