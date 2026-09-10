const mongoose = require("mongoose");


// Cart item
const cartItemSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    productType: {
        type: String,
        enum: ["saree", "jewellery"],
        required: true
    },

    quantity: {
        type: Number,
        default: 1,
        min: 1
    }

});


// Cart
const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    items: {
        type: [cartItemSchema],
        default: []
    }

}, {
    timestamps: true
});


module.exports = mongoose.model(
    "Cart",
    cartSchema
);