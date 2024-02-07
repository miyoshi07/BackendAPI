const Cart = require("../models/Cart");
const Product = require("../models/Product");

module.exports.getUserCart = async (req, res) => {
  const { id } = req.user;

  try {
    const userCart = await Cart.findOne({ userId: id });

    if (!userCart) {
      return res.status(404).send({ error: "User's cart not found" });
    }

    return res.status(200).send({ cart: userCart });
  } catch (error) {
    console.error("Error retrieving user cart: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to retrieve user cart" });
  }
};

module.exports.addItemToUserCart = async (req, res) => {
  const { id } = req.user;
  const { productId, quantity } = req.body;

  try {

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).send({ error: "Quantity should be greater than 0" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({ error: "Product does not exist" });
    }

    let userCart = await Cart.findOne({ userId: id });

    if (!userCart) {
      userCart = new Cart({
        userId: id,
        cartItems: [],
        totalPrice: 0,
      });
    }

    const existingProductIndex = userCart.cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      const existingProduct = userCart.cartItems[existingProductIndex];
      existingProduct.quantity += quantity;
      existingProduct.subTotal = existingProduct.quantity * product.price;
    } else {
      userCart.cartItems.push({
        productId,
        quantity,
        subTotal: quantity * product.price,
      });
    }

    userCart.totalPrice = calculateTotalPrice(userCart.cartItems);

    await userCart.save();
    return res
      .status(201)
      .send({ message: "Item added to cart successfully", cart: userCart });
  } catch (error) {
    console.error("Error adding item to cart: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to add item to cart" });
  }
};

module.exports.updateCartItemQuantityInUserCart = async (req, res) => {
  const { id } = req.user;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product does not exist" });
    }

    const userCart = await Cart.findOne({ userId: id });
    if (!userCart) {
      return res.status(404).send({ error: "User's cart not found" });
    }

    const cartItemIndex = userCart.cartItems.findIndex(
      (item) => item.productId === productId
    );
    if (cartItemIndex === -1) {
      return res.status(404).send({ error: "Item not found in user's cart" });
    }

    const cartItem = userCart.cartItems[cartItemIndex];
    cartItem.quantity = quantity;
    cartItem.subTotal = quantity * product.price;

    userCart.totalPrice = calculateTotalPrice(userCart.cartItems);

    await userCart.save();
    return res.status(200).send({
      message: "User's cart item quantity updated successfully",
      cart: userCart,
    });
  } catch (error) {
    console.error("Error updating user's cart item quantity: ", error);
    return res.status(500).send({
      error: "Internal Server Error: Failed to update cart item quantity",
    });
  }
};

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.subTotal, 0);
};
