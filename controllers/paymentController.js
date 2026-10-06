const crypto = require("crypto");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const razorpay =
    require("../config/razorpay");


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyPayment = async (req, res) => {

    try {

        // -------------------------------------------------
        // 1. GET LOGGED-IN USER
        // -------------------------------------------------

        const userId =
            req.userId;


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "User not authenticated"

            });
        }


        // -------------------------------------------------
        // 2. GET RAZORPAY PAYMENT DETAILS
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

                message:
                    "Payment details are missing"

            });
        }


        // -------------------------------------------------
        // 3. FIND OUR MONGODB ORDER
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

                message:
                    "Order not found"

            });
        }


        // -------------------------------------------------
        // 4. PREVENT DUPLICATE VERIFICATION
        // -------------------------------------------------

        if (
            order.paymentStatus ===
            "paid"
        ) {

            return res.status(200).json({

                success: true,

                message:
                    "Payment already verified",

                orderId:
                    order._id

            });
        }


        // -------------------------------------------------
        // 5. CREATE RAZORPAY SIGNATURE
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
        // 6. COMPARE SIGNATURE
        // -------------------------------------------------

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid payment signature"

            });
        }


        // -------------------------------------------------
        // 7. FETCH PAYMENT FROM RAZORPAY
        // -------------------------------------------------

        const payment =
            await razorpay.payments.fetch(
                razorpay_payment_id
            );


        // -------------------------------------------------
        // 8. VERIFY RAZORPAY ORDER ID
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
        // 9. VERIFY PAYMENT AMOUNT
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
        // 10. CHECK PAYMENT STATUS
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
        // 11. PAYMENT SUCCESS
        // -------------------------------------------------

        order.razorpayPaymentId =
            razorpay_payment_id;

        order.paymentStatus =
            "paid";

        order.orderStatus =
            "confirmed";


        // -------------------------------------------------
        // 12. INITIALIZE SHIPMENT
        // -------------------------------------------------

        if (!order.shipment) {

            order.shipment = {

                status:
                    "not_created"

            };
        }


        await order.save();


        // -------------------------------------------------
        // 13. CLEAR CART
        // -------------------------------------------------

        await Cart.findOneAndUpdate(

            {
                userId:
                    userId
            },

            {
                $set: {
                    items: []
                }
            }

        );


        // -------------------------------------------------
        // 14. SUCCESS RESPONSE
        // -------------------------------------------------

        return res.status(200).json({

            success:
                true,

            message:
                "Payment verified successfully",

            orderId:
                order._id,

            paymentId:
                razorpay_payment_id,

            paymentStatus:
                order.paymentStatus,

            orderStatus:
                order.orderStatus

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