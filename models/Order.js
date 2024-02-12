const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: [true, "User ID is required"]
    },
    productsOrdered: [
        {
            productId: {
                type: String,
                required: [true, "Product ID is required"]
            },
            quantity: {
                type: Number,
                required: [true, "Product quantity is required"]
            },
            subTotal: {
                type: Number,
                required: [true, "Product sub-total is required"]
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: [true, "Cart total price is required"]
    },
    orderedOn: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "Pending"
    }

});

module.exports = mongoose.model("Order", orderSchema);