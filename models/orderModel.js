const mongoose = require("mongoose");


// ==========================================
// ORDER ITEM
// ==========================================

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        productType: {
            type: String,
            enum: ["saree", "jewellery"],
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            default: "",
            trim: true
        },

        image: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        originalPrice: {
            type: Number,
            required: true,
            min: 0
        },

        discountedPrice: {
            type: Number,
            required: true,
            min: 0
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);


// ==========================================
// ORDER
// ==========================================

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },


        // ==================================
        // PRODUCTS
        // ==================================

        items: {
            type: [orderItemSchema],

            required: true,

            validate: {
                validator: function (items) {
                    return items.length > 0;
                },

                message:
                    "Order must contain at least one item"
            }
        },


        // ==================================
        // SHIPPING ADDRESS
        // ==================================

        shippingAddress: {

            fullName: {
                type: String,
                required: true,
                trim: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            },

            address: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            }
        },


        // ==================================
        // PRICE
        // ==================================

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            required: true,
            min: 0
        },

        deliveryCharge: {
            type: Number,
            required: true,
            default: 25,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },


        // ==================================
        // RAZORPAY
        // ==================================

        razorpayOrderId: {
            type: String,
            default: null,
            index: true
        },

        razorpayPaymentId: {
            type: String,
            default: null
        },


        // ==================================
        // PAYMENT STATUS
        // ==================================

        paymentStatus: {
            type: String,

            enum: [
                "pending",
                "paid",
                "failed"
            ],

            default: "pending"
        },


        // ==================================
        // ORDER STATUS
        // ==================================

        orderStatus: {
            type: String,

            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],

            default: "pending"
        }
    },

    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Order",
    orderSchema
);