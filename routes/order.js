const express = require("express");

// Middleware
const orderController = require("../controllers/order");
const { verify, verifyAdmin, verifyNotAdmin } = require("../auth");

const router = express.Router();

// Routes
router.post("/checkout", verify, verifyNotAdmin, orderController.checkoutUserOrder);

router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

router.get("/my-orders", verify, verifyNotAdmin, orderController.getUserOrders)

module.exports = router;