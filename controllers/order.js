const Cart = require("../models/Cart");
const Order = require("../models/Order");

module.exports.checkoutUserOrder = async (req, res) => {
  const { id } = req.user;

  try {
    const userCart = await Cart.findOne({ userId: id });

    if (!userCart) {
      return res.status(404).send({ error: "User's cart not found" });
    }

    if (userCart.cartItems.length === 0) {
      return res
        .status(400)
        .send({ error: "Nothing to checkout in user's cart" });
    }

    const newOrder = new Order({
      userId: id,
      productsOrdered: userCart.cartItems,
      totalPrice: userCart.totalPrice,
    });

    await newOrder.save();

    userCart.cartItems = [];
    userCart.totalPrice = 0;

    await userCart.save();

    return res
      .status(201)
      .send({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error checking out user order: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to checkout user order" });
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    if (orders.length === 0) {
      return res.status(404).send({ message: "No orders found" });
    }

    return res.status(200).send({ orders });
  } catch (error) {
    console.error("Error retrieving orders: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Failed to retrieve orders" });
  }
};

module.exports.getUserOrders = async (req, res) => {
  const { id } = req.user;

  try {
    const orders = await Order.find({ userId: id });
    
    if (orders.length === 0) {
      return res.status(404).send({ message: "No orders found for this user" });
    }

    return res.status(200).send({ orders });
  } catch (error) {
    console.error("Error retrieving user's orders: ", error);
    return res.status(500).send({
      error: "Internal Server Error: Failed to retrieve user's orders",
    });
  }
};
