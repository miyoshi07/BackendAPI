const Order = require("../models/Order");
const Product = require("../models/Product");
const ProductReview = require("../models/ProductReview");
const User = require("../models/User");

module.exports.addProductReview = async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;
  const { review, rating, isAnonymous } = req.body;

  try {
    if (isNaN(rating) || rating < 0) {
      return res.status(400).send({ error: "Invalid rating" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    const userOrders = await Order.find({ userId: id });

    const isProductOnUserOrders = userOrders.some((order) =>
      order.productsOrdered.some((product) => product.productId === productId)
    );

    if (userOrders.length === 0 || !isProductOnUserOrders) {
      return res
        .status(400)
        .send({ message: "User not allowed to add review to this product" });
    }

    let displayName;
    if (!isAnonymous) {
      const user = await User.findOne({ _id: id })

      if (user) {
        displayName = `${user.firstName} ${user.lastName}`;
      }
    }

    const newProductReview = new ProductReview({
      userId: isAnonymous ? undefined : id,
      productId,
      review,
      rating,
      displayName
    });

    await newProductReview.save();
    return res.status(201).send({
      message: "Review submitted successfully",
      review: newProductReview,
    });
  } catch (error) {
    console.error("Error adding product review: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to add product review" });
  }
};

module.exports.updateProductReview = async (req, res) => {
  const { id } = req.user;
  const { reviewId } = req.params;
  const { review, rating, isAnonymous } = req.body;

  try {
    if (isNaN(rating) || rating < 0) {
      return res.status(400).send({ error: "Invalid rating" });
    }

    let displayName;
    if (!isAnonymous) {
      const user = await User.findOne({ _id: id })

      if (user) {
        displayName = `${user.firstName} ${user.lastName}`;
      }
    }

    console.log(displayName);

    const updatedProductReview = await ProductReview.findOneAndUpdate(
      { _id: reviewId, isDeleted: false },
      {
        userId: isAnonymous ? undefined : id,
        review,
        rating,
        displayName
      },
      { new: true }
    );

    if (!updatedProductReview) {
      return res.status(404).send({ error: "Product review not found" });
    }

    return res.status(200).send({
      message: "Product review updated successfully",
      review: updatedProductReview,
    });
  } catch (error) {
    console.error("Error updating product review: ", error);
    return res
      .status(500)
      .send({
        error: "Internal Server Error: Failed to update product review",
      });
  }
};

module.exports.deleteProductReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const deletedProductReview = await ProductReview.findOneAndUpdate(
      { _id: reviewId, isDeleted: false },
      {
        isDeleted: true,
      },
      { new: true }
    );

    if (!deletedProductReview) {
      return res.status(404).send({ error: "Product review not found" });
    }

    return res
      .status(200)
      .send({ message: "Product review deleted successfully" });
  } catch (error) {
    console.error("Error deleting product review: ", error);
    return res
      .status(500)
      .send({
        error: "Internal Server Error: Failed to delete product review ",
      });
  }
};
                                          