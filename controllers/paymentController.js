const crypto = require("crypto");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const razorpay = require("../config/razorpay");


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyPayment = async (req, res) => {

    try {

        // -------------------------------------------------
        // 1. Get logged-in user
        // -------------------------------------------------

        const userId = req.userId;

        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });

        }


        // -------------------------------------------------
        // 2. Get Razorpay payment details
        // -------------------------------------------------

        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;


        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({
                success: false,
                message: "Payment details are missing"
            });

        }


        // -------------------------------------------------
        // 3. Find our MongoDB order
        // -------------------------------------------------

        const order =
            await Order.findOne({

                razorpayOrderId:
                    razorpay_order_id,

                user:
                    userId
            });


        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }


        // -------------------------------------------------
        // 4. Prevent duplicate verification
        // -------------------------------------------------

        if (
            order.paymentStatus === "paid"
        ) {

            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                orderId: order._id
            });

        }


        // -------------------------------------------------
        // 5. Create signature
        // -------------------------------------------------

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    order.razorpayOrderId +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");


        // -------------------------------------------------
        // 6. Compare signatures
        // -------------------------------------------------

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });

        }


        // -------------------------------------------------
        // 7. Fetch payment from Razorpay
        // -------------------------------------------------

        const payment =
            await razorpay.payments.fetch(
                razorpay_payment_id
            );


        // -------------------------------------------------
        // 8. Verify Razorpay order ID
        // -------------------------------------------------

        if (
            payment.order_id !==
            order.razorpayOrderId
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Payment does not belong to this order"
            });

        }


        // -------------------------------------------------
        // 9. Verify amount
        // -------------------------------------------------

        const expectedAmount =
            Math.round(
                order.totalAmount * 100
            );


        if (
            payment.amount !==
            expectedAmount
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Payment amount does not match order amount"
            });

        }


        // -------------------------------------------------
        // 10. Check payment status
        // -------------------------------------------------

        if (
            payment.status !==
            "captured"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Payment is not captured. Current status: ${payment.status}`
            });

        }


        // -------------------------------------------------
        // 11. Update MongoDB order
        // -------------------------------------------------

        order.razorpayPaymentId =
            razorpay_payment_id;

        order.paymentStatus =
            "paid";

        order.orderStatus =
            "confirmed";


        await order.save();


        // -------------------------------------------------
        // 12. Clear user's cart
        // -------------------------------------------------

        await Cart.findOneAndUpdate(

            {
                userId: userId
            },

            {
                $set: {
                    items: []
                }
            }

        );


        // -------------------------------------------------
        // 13. Send success response
        // -------------------------------------------------

        return res.status(200).json({

            success:
                true,

            message:
                "Payment verified successfully",

            orderId:
                order._id,

            paymentId:
                razorpay_payment_id
        });


    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to verify payment"
        });

    }

};


module.exports = {
    verifyPayment
};