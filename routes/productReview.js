const express = require("express");

// Middleware
const productReviewController = require("../controllers/productReview");
const { verify, verifyAdmin, verifyNotAdmin } = require("../auth");

const router = express.Router();

// Routes
router.post("/:productId/addProductReview", verify, verifyNotAdmin, productReviewController.addProductReview);

router.put("/:reviewId/updateProductReview", verify, verifyNotAdmin, productReviewController.updateProductReview);

router.put("/:reviewId/deleteProductReview", verify, verifyNotAdmin, productReviewController.deleteProductReview);

module.exports = router;