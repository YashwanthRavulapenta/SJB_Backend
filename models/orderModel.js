const mongoose = require("mongoose");


// =====================================================
// ORDER ITEM SCHEMA
// =====================================================

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        productType: {
            type: String,
            required: true,
            enum: ["saree", "jewellery"]
        },

        name: {
            type: String,
            required: true
        },

        category: {
            type: String,
            default: ""
        },

        image: {
            type: String,
            default: ""
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


// =====================================================
// SHIPPING ADDRESS
// =====================================================

const shippingAddressSchema = new mongoose.Schema(
    {
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
    {
        _id: false
    }
);


// =====================================================
// SHIPMENT
// =====================================================

const shipmentSchema = new mongoose.Schema(
    {
        courier: {
            type: String,
            default: "",
            trim: true
        },

        trackingNumber: {
            type: String,
            default: "",
            trim: true
        },

        shipmentId: {
            type: String,
            default: "",
            trim: true
        },

        status: {
            type: String,

            enum: [
                "not_created",
                "pickup_pending",
                "picked_up",
                "in_transit",
                "out_for_delivery",
                "delivered",
                "delivery_failed",
                "rto"
            ],

            default: "not_created"
        },

        shippedAt: {
            type: Date,
            default: null
        },

        deliveredAt: {
            type: Date,
            default: null
        }
    },
    {
        _id: false
    }
);


// =====================================================
// ORDER SCHEMA
// =====================================================

const orderSchema = new mongoose.Schema(
    {
        // -------------------------------------------------
        // USER
        // -------------------------------------------------

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // -------------------------------------------------
        // ORDER ITEMS
        // -------------------------------------------------

        items: {
            type: [orderItemSchema],
            required: true,

            validate: {
                validator: function (items) {
                    return items && items.length > 0;
                },

                message:
                    "Order must contain at least one item"
            }
        },


        // -------------------------------------------------
        // SHIPPING ADDRESS
        // -------------------------------------------------

        shippingAddress: {
            type: shippingAddressSchema,
            required: true
        },


        // -------------------------------------------------
        // PRICE
        // -------------------------------------------------

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        deliveryCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },


        // -------------------------------------------------
        // RAZORPAY
        // -------------------------------------------------

        razorpayOrderId: {
            type: String,
            default: ""
        },

        razorpayPaymentId: {
            type: String,
            default: ""
        },


        // -------------------------------------------------
        // PAYMENT STATUS
        // -------------------------------------------------

        paymentStatus: {
            type: String,

            enum: [
                "pending",
                "paid",
                "failed"
            ],

            default: "pending"
        },


        // -------------------------------------------------
        // ORDER STATUS
        // -------------------------------------------------

        orderStatus: {
            type: String,

            enum: [
                "pending",
                "confirmed",
                "processing",
                "ready_to_ship",
                "shipped",
                "delivered",
                "rto"
            ],

            default: "pending"
        },


        // -------------------------------------------------
        // SHIPMENT
        // -------------------------------------------------

        shipment: {
            type: shipmentSchema,

            default: () => ({
                status: "not_created"
            })
        }
    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("Order", orderSchema);