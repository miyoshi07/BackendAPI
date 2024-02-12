const express = require("express");
const router = express.Router();

// Middleware
const productController = require("../controllers/product")
const { verify, verifyAdmin } = require("../auth");



// Routes
router.post("/", verify, verifyAdmin, productController.createProduct);

router.get("/all", productController.getAllProducts);

router.get("/active", productController.getAllActiveProducts);

router.get("/:productId", productController.getProduct)

router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

router.put("/archive/:productId", verify, verifyAdmin, productController.archiveProduct);

router.put("/activate/:productId", verify, verifyAdmin, productController.activateProduct);

router.post("/searchByName", productController.searchProductByName);

router.post("/searchByPrice", productController.searchProductByPrice);

router.get("/:productId/reviews", verify, productController.getProductReviews);

router.get("/:productId/productStatistics", productController.getProductStatistics);

module.exports = router;