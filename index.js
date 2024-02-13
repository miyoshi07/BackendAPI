require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// const passport = require("passport");
// const session = require("express-session");
// require("./passport");
const cors = require("cors");


// Import Routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const productReviewRoutes = require("./routes/productReview");

const port = 4004;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use(
//   session({
//     secret: process.env.clientSecret,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

mongoose.connect(
  "mongodb+srv://admin:admin123@b337.es8yqvs.mongodb.net/e-commerce-api?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

// Use Backend Routes
app.use("/b4/users", userRoutes);
app.use("/b4/products", productRoutes);
app.use("/b4/carts", cartRoutes);
app.use("/b4/orders", orderRoutes);
app.use("/b4/reviews", productReviewRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`);
  });
}

module.exports = { app, mongoose };
