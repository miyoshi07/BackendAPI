const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();


// Routes
router.post("/", userController.registerUser);

router.post("/login", userController.loginUser);


module.exports = router;