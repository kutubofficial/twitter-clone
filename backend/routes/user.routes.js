const express = require("express");
const router = express.Router();
const { registerUser, getUser, updateUser, getAllUsers } = require("../controllers/user.controller");

router.post("/register", registerUser);
router.get("/loggedinuser", getUser);
router.patch("/userupdate/:email", updateUser);
router.get("/user", getAllUsers);

module.exports = router;
