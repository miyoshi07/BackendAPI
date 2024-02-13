const express = require("express");
const router = express.Router();

// Middleware
const cartController = require("../controllers/cart")
const { verify } = require("../auth");

//Routes
router.get("/", verify, cartController.getUserCart);

router.post("/addToCart", verify, cartController.addItemToUserCart);

router.put("/updateQuantity", verify, cartController.updateCartItemQuantityInUserCart);

router.put("/:productId/removeFromCart", verify, cartController.removeItemFromUserCart);

router.put("/clearCart", verify, cartController.clearUserCart);

module.exports = router;
