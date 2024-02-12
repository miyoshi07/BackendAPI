const mongoose = require("mongoose");

const productReview = new mongoose.Schema({

    productId: {
        type: String,
        required: [true, "Product ID is required"]
    },
    userId: String,
    displayName: {
        type: String,
        default: "Anonymous"
    },
    review: {
        type: String,
        required: [true, "Review is required"]
    }, 
    rating: {
        type: Number,
        required: [true, "Rating is required"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    submittedOn: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model("ProductReview", productReview);
