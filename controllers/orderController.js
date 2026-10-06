const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Saree = require("../models/sareeModel");
const Jewellery = require("../models/jewelleryModel");

const razorpay = require("../config/razorpay");

const validateShippingAddress =
    require("../utils/validateOrder");

const {
    calculateDiscountedPrice,
    calculateOrderTotals,
    roundMoney
} = require("../utils/orderUtils");


// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
    try {

        // Your authMiddleware stores user ID here
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }


        // -------------------------------------------------
        // 1. Validate shipping address
        // -------------------------------------------------

        const validationError =
            validateShippingAddress(
                req.body.shippingAddress
            );

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }


        // -------------------------------------------------
        // 2. Find user's cart
        // -------------------------------------------------
        // IMPORTANT:
        // cartModel uses userId, NOT user

        const cart = await Cart.findOne({
            userId: userId
        });

        if (
            !cart ||
            !cart.items ||
            cart.items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }


        // -------------------------------------------------
        // 3. Prepare order items
        // -------------------------------------------------

        const orderItems = [];


        for (const cartItem of cart.items) {

            let product = null;


            // ---------------------------------------------
            // Get Saree
            // ---------------------------------------------

            if (
                cartItem.productType === "saree"
            ) {

                product =
                    await Saree.findById(
                        cartItem.productId
                    );
            }


            // ---------------------------------------------
            // Get Jewellery
            // ---------------------------------------------

            else if (
                cartItem.productType === "jewellery"
            ) {

                product =
                    await Jewellery.findById(
                        cartItem.productId
                    );
            }


            // ---------------------------------------------
            // Invalid product type
            // ---------------------------------------------

            else {

                return res.status(400).json({
                    success: false,
                    message: "Invalid product type"
                });
            }


            // ---------------------------------------------
            // Product does not exist
            // ---------------------------------------------

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message:
                        "One of the products in your cart no longer exists"
                });
            }


            // ---------------------------------------------
            // Check availability
            // ---------------------------------------------

            if (
                product.isAvailable === false
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `${product.name} is currently unavailable`
                });
            }


            // ---------------------------------------------
            // Get actual price from database
            // ---------------------------------------------

            const originalPrice =
                Number(product.price);


            if (
                !Number.isFinite(originalPrice) ||
                originalPrice < 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Invalid price for ${product.name}`
                });
            }


            // ---------------------------------------------
            // Calculate 10% discount
            // ---------------------------------------------

            const discountedPrice =
                calculateDiscountedPrice(
                    originalPrice
                );


            // ---------------------------------------------
            // Calculate item total
            // ---------------------------------------------

            const totalPrice =
                roundMoney(
                    discountedPrice *
                    cartItem.quantity
                );


            // ---------------------------------------------
            // Add item to order
            // ---------------------------------------------

            orderItems.push({

                productId:
                    product._id,

                productType:
                    cartItem.productType,

                name:
                    product.name,

                category:
                    product.category || "",

                image:
                    product.image,

                quantity:
                    cartItem.quantity,

                originalPrice:
                    originalPrice,

                discountedPrice:
                    discountedPrice,

                totalPrice:
                    totalPrice
            });
        }


        // -------------------------------------------------
        // 4. Calculate final order totals
        // -------------------------------------------------

        const pricing =
            calculateOrderTotals(
                orderItems.map((item) => ({
                    originalPrice:
                        item.originalPrice,

                    quantity:
                        item.quantity
                }))
            );


        // -------------------------------------------------
        // 5. Create MongoDB order
        // -------------------------------------------------

        const order =
    await Order.create({

        user: userId,

        items:
            orderItems,

        shippingAddress: {

            fullName:
                req.body.shippingAddress
                    .fullName
                    .trim(),

            phone:
                req.body.shippingAddress
                    .phone
                    .trim(),

            address:
                req.body.shippingAddress
                    .address
                    .trim(),

            city:
                req.body.shippingAddress
                    .city
                    .trim(),

            state:
                req.body.shippingAddress
                    .state
                    .trim(),

            pincode:
                req.body.shippingAddress
                    .pincode
                    .trim()
        },

        subtotal:
            pricing.subtotal,

        discount:
            pricing.discount,

        deliveryCharge:
            pricing.deliveryCharge,

        totalAmount:
            pricing.totalAmount,

        // PAYMENT STARTS AS PENDING
        paymentStatus:
            "pending",

        // ORDER STARTS AS PENDING
        orderStatus:
            "pending",

        // NEW
        shipment: {
            status: "not_created"
        }
    });

        // -------------------------------------------------
        // 6. Create Razorpay order
        // -------------------------------------------------

        const razorpayAmount =
            Math.round(
                pricing.totalAmount * 100
            );


        let razorpayOrder;


        try {

            razorpayOrder =
                await razorpay.orders.create({

                    amount:
                        razorpayAmount,

                    currency:
                        "INR",

                    receipt:
                        order._id.toString(),

                    notes: {

                        mongoOrderId:
                            order._id.toString(),

                        userId:
                            userId.toString()
                    }
                });

        } catch (razorpayError) {

            console.error(
                "Razorpay order creation failed:",
                razorpayError
            );


            // Remove MongoDB order if
            // Razorpay order creation fails

            await Order.findByIdAndDelete(
                order._id
            );


            return res.status(500).json({
                success: false,
                message:
                    "Unable to initialize payment"
            });
        }


        // -------------------------------------------------
        // 7. Save Razorpay Order ID
        // -------------------------------------------------

        order.razorpayOrderId =
            razorpayOrder.id;

        await order.save();


        // -------------------------------------------------
        // 8. Send response to frontend
        // -------------------------------------------------

        return res.status(201).json({

            success:
                true,

            message:
                "Order created successfully",

            orderId:
                order._id,

            razorpayOrderId:
                razorpayOrder.id,

            amount:
                razorpayOrder.amount,

            currency:
                razorpayOrder.currency,

            key:
                process.env.RAZORPAY_KEY_ID,

            totalAmount:
                pricing.totalAmount
        });


    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to create order"
        });
    }
};



// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {

    try {

        const userId = req.userId;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }


        const orders =
            await Order.find({
                user: userId
            })
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success:
                true,

            orders:
                orders
        });


    } catch (error) {

        console.error(
            "Get orders error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to fetch orders"
        });
    }
};



// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {

    try {

        const userId = req.userId;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }


        const order =
            await Order.findOne({

                _id:
                    req.params.id,

                user:
                    userId
            });


        if (!order) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Order not found"
            });
        }


        return res.status(200).json({

            success:
                true,

            order:
                order
        });


    } catch (error) {

        console.error(
            "Get order error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to fetch order"
        });
    }
};


// =====================================================
// ADMIN - GET ALL ORDERS
// =====================================================

const getAllOrdersAdmin = async (req, res) => {

    try {

        const orders = await Order.find()
            .populate(
                "user",
                "name phone email role"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count: orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "GET ALL ADMIN ORDERS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch admin orders"

        });
    }
};


// =====================================================
// ADMIN - GET SINGLE ORDER
// =====================================================

const getOrderByIdAdmin = async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            )
            .populate(
                "user",
                "name phone email role"
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });
        }


        return res.status(200).json({

            success: true,

            order

        });

    } catch (error) {

        console.error(
            "GET ADMIN ORDER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch order"

        });
    }
};


// =====================================================
// ADMIN - UPDATE ORDER STATUS
// =====================================================

const updateOrderStatusAdmin = async (req, res) => {

    try {

        const { id } =
            req.params;

        const { status } =
            req.body;


        const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "ready_to_ship",
            "shipped",
            "delivered",
            "rto"
        ];


        // -------------------------------------------------
        // VALIDATE STATUS
        // -------------------------------------------------

        if (!status) {

            return res.status(400).json({

                success: false,

                message:
                    "Order status is required"

            });
        }


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order status"

            });
        }


        // -------------------------------------------------
        // FIND ORDER
        // -------------------------------------------------

        const order =
            await Order.findById(id);


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });
        }


        // -------------------------------------------------
        // PAYMENT SECURITY
        // -------------------------------------------------
        // Anything after confirmation requires
        // successful payment.
        // -------------------------------------------------

        const paidRequiredStatuses = [
            "confirmed",
            "processing",
            "ready_to_ship",
            "shipped",
            "delivered"
        ];


        if (
            paidRequiredStatuses.includes(status) &&
            order.paymentStatus !== "paid"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Order cannot move forward because payment is not completed"

            });
        }


        // -------------------------------------------------
        // STATUS TRANSITIONS
        // -------------------------------------------------

        const transitions = {

            pending: [
                "confirmed"
            ],

            confirmed: [
                "processing"
            ],

            processing: [
                "ready_to_ship"
            ],

            ready_to_ship: [
                "shipped"
            ],

            shipped: [
                "delivered",
                "rto"
            ],

            delivered: [],

            rto: []
        };


        const currentStatus =
            order.orderStatus;


        // Same status is allowed

        if (
            currentStatus !== status
        ) {

            const allowedNextStatuses =
                transitions[currentStatus] || [];


            if (
                !allowedNextStatuses.includes(status)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Cannot change order status from "${currentStatus}" to "${status}"`

                });
            }
        }


        // -------------------------------------------------
        // UPDATE
        // -------------------------------------------------

        order.orderStatus =
            status;


        await order.save();


        return res.status(200).json({

            success: true,

            message:
                "Order status updated successfully",

            order

        });

    } catch (error) {

        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update order status"

        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createOrder,

    getMyOrders,

    getOrderById,

    getAllOrdersAdmin,

    getOrderByIdAdmin,

    updateOrderStatusAdmin

};