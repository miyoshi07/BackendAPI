const express = require("express");

// Middleware
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();


// Routes
router.post("/", userController.createUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getUserDetails);

router.put("/:userId/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);

router.put("/update-password", verify, userController.updatePassword);

module.exports = router;
