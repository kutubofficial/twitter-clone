const express = require("express");
const router = express.Router();
const { createAudioPost } = require("../controllers/audio.controller");

router.post("/audio-post", createAudioPost);

module.exports = router;
