const Order =
    require("../models/orderModel");

const {
    getTrackingUrl,
    isValidShipmentStatus
} =
    require("../services/shipmentService");


// =====================================================
// CREATE SHIPMENT
// =====================================================
// ADMIN ONLY
//
// POST
// /api/shipments/:orderId
//
// Body:
//
// {
//     "courier": "Ekart",
//     "trackingNumber": "FMPC6262218117",
//     "shipmentId": "EK123456"
// }
//
// =====================================================

const createShipment = async (
    req,
    res
) => {

    try {

        const {
            orderId
        } = req.params;


        const {
            courier,
            trackingNumber,
            shipmentId
        } = req.body;


        // -------------------------------------------------
        // VALIDATE COURIER
        // -------------------------------------------------

        if (
            !courier ||
            !courier.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Courier name is required"

            });
        }


        // -------------------------------------------------
        // VALIDATE TRACKING NUMBER
        // -------------------------------------------------

        if (
            !trackingNumber ||
            !trackingNumber.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Tracking number is required"

            });
        }


        // -------------------------------------------------
        // FIND ORDER
        // -------------------------------------------------

        const order =
            await Order.findById(
                orderId
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });
        }


        // -------------------------------------------------
        // PAYMENT MUST BE PAID
        // -------------------------------------------------

        if (
            order.paymentStatus !==
            "paid"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Cannot create shipment for an unpaid order"

            });
        }


        // -------------------------------------------------
        // ORDER MUST BE READY
        // -------------------------------------------------

        if (
            order.orderStatus !==
            "ready_to_ship"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Order must be ready_to_ship before creating shipment"

            });
        }


        // -------------------------------------------------
        // PREVENT DUPLICATE SHIPMENT
        // -------------------------------------------------

        if (
            order.shipment &&
            order.shipment.trackingNumber
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Shipment already exists for this order"

            });
        }


        // -------------------------------------------------
        // CREATE SHIPMENT
        // -------------------------------------------------

        order.shipment = {

            courier:
                courier.trim(),

            trackingNumber:
                trackingNumber.trim(),

            shipmentId:
                shipmentId
                    ? shipmentId.trim()
                    : "",

            status:
                "pickup_pending",

            shippedAt:
                null,

            deliveredAt:
                null

        };


        await order.save();


        // -------------------------------------------------
        // TRACKING URL
        // -------------------------------------------------

        const trackingUrl =
            getTrackingUrl(

                order.shipment.courier,

                order.shipment.trackingNumber

            );


        return res.status(201).json({

            success: true,

            message:
                "Shipment created successfully",

            shipment:
                order.shipment,

            trackingUrl,

            orderStatus:
                order.orderStatus

        });

    } catch (error) {

        console.error(
            "CREATE SHIPMENT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create shipment"

        });
    }
};


// =====================================================
// GET SHIPMENT
// =====================================================
// CUSTOMER + ADMIN
//
// GET
// /api/shipments/:orderId
//
// =====================================================

const getShipment = async (
    req,
    res
) => {

    try {

        const {
            orderId
        } = req.params;


        const order =
            await Order.findById(
                orderId
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });
        }


        // -------------------------------------------------
        // USER OWNERSHIP
        // -------------------------------------------------

        const loggedInUserId =
            req.userId?.toString();

        const orderUserId =
            order.user?.toString();


        const isOwner =
            loggedInUserId ===
            orderUserId;


        // -------------------------------------------------
        // ADMIN CHECK
        // -------------------------------------------------

        const User =
            require("../models/userModel");


        const user =
            await User.findById(
                req.userId
            );


        const isAdmin =
            user &&
            user.role === "admin";


        // -------------------------------------------------
        // AUTHORIZATION
        // -------------------------------------------------

        if (
            !isOwner &&
            !isAdmin
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to view this shipment"

            });
        }


        const shipment =
            order.shipment || {

                courier: "",

                trackingNumber: "",

                shipmentId: "",

                status:
                    "not_created",

                shippedAt: null,

                deliveredAt: null

            };


        const trackingUrl =
            getTrackingUrl(

                shipment.courier,

                shipment.trackingNumber

            );


        return res.status(200).json({

            success: true,

            shipment,

            trackingUrl,

            orderStatus:
                order.orderStatus,

            paymentStatus:
                order.paymentStatus

        });

    } catch (error) {

        console.error(
            "GET SHIPMENT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to get shipment"

        });
    }
};


// =====================================================
// UPDATE SHIPMENT STATUS
// =====================================================
// ADMIN ONLY FOR NOW
//
// PUT
// /api/shipments/:orderId/status
//
// Body:
//
// {
//     "status": "picked_up"
// }
//
// =====================================================

const updateShipmentStatus =
    async (
        req,
        res
    ) => {

        try {

            const {
                orderId
            } = req.params;


            const {
                status
            } = req.body;


            // -------------------------------------------------
            // VALIDATE STATUS
            // -------------------------------------------------

            if (!status) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Shipment status is required"

                });
            }


            if (
                !isValidShipmentStatus(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid shipment status"

                });
            }


            // -------------------------------------------------
            // FIND ORDER
            // -------------------------------------------------

            const order =
                await Order.findById(
                    orderId
                );


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found"

                });
            }


            // -------------------------------------------------
            // PAYMENT CHECK
            // -------------------------------------------------

            if (
                order.paymentStatus !==
                "paid"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Shipment cannot be updated for unpaid order"

                });
            }


            // -------------------------------------------------
            // SHIPMENT CHECK
            // -------------------------------------------------

            if (
                !order.shipment ||
                !order.shipment.trackingNumber
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Shipment has not been created yet"

                });
            }


            // -------------------------------------------------
            // STATUS TRANSITIONS
            // -------------------------------------------------

            const currentStatus =
                order.shipment.status;


            const transitions = {

                not_created: [
                    "pickup_pending"
                ],

                pickup_pending: [
                    "picked_up"
                ],

                picked_up: [
                    "in_transit"
                ],

                in_transit: [
                    "out_for_delivery"
                ],

                out_for_delivery: [
                    "delivered",
                    "delivery_failed"
                ],

                delivery_failed: [
                    "out_for_delivery",
                    "rto"
                ],

                delivered: [],

                rto: []

            };


            // Same status allowed

            if (
                currentStatus !==
                status
            ) {

                const allowedNext =
                    transitions[
                        currentStatus
                    ] || [];


                if (
                    !allowedNext.includes(
                        status
                    )
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Cannot change shipment status from "${currentStatus}" to "${status}"`

                    });
                }
            }


            // -------------------------------------------------
            // UPDATE SHIPMENT
            // -------------------------------------------------

            order.shipment.status =
                status;


            // -------------------------------------------------
            // PICKED UP
            // -------------------------------------------------

            if (
                status ===
                "picked_up"
            ) {

                order.orderStatus =
                    "shipped";

                order.shipment.shippedAt =
                    new Date();
            }


            // -------------------------------------------------
            // IN TRANSIT
            // -------------------------------------------------

            if (
                status ===
                "in_transit"
            ) {

                order.orderStatus =
                    "shipped";
            }


            // -------------------------------------------------
            // OUT FOR DELIVERY
            // -------------------------------------------------

            if (
                status ===
                "out_for_delivery"
            ) {

                order.orderStatus =
                    "shipped";
            }


            // -------------------------------------------------
            // DELIVERY FAILED
            // -------------------------------------------------

            if (
                status ===
                "delivery_failed"
            ) {

                order.orderStatus =
                    "shipped";
            }


            // -------------------------------------------------
            // DELIVERED
            // -------------------------------------------------

            if (
                status ===
                "delivered"
            ) {

                order.orderStatus =
                    "delivered";

                order.shipment.deliveredAt =
                    new Date();
            }


            // -------------------------------------------------
            // RTO
            // -------------------------------------------------

            if (
                status ===
                "rto"
            ) {

                order.orderStatus =
                    "rto";
            }


            await order.save();


            return res.status(200).json({

                success: true,

                message:
                    "Shipment status updated successfully",

                orderStatus:
                    order.orderStatus,

                shipment:
                    order.shipment

            });

        } catch (error) {

            console.error(
                "UPDATE SHIPMENT STATUS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to update shipment status"

            });
        }
    };


module.exports = {

    createShipment,

    getShipment,

    updateShipmentStatus

};