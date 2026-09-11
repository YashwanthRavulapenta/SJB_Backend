const express = require("express");

const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById
} = require("../controllers/orderController");

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================================================
// CREATE ORDER
// ==========================================================================

router.post(
    "/create",
    authMiddleware,
    createOrder
);


// ==========================================================================
// GET ALL MY ORDERS
// ==========================================================================

router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);


// ==========================================================================
// GET SINGLE ORDER
// ==========================================================================

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);


module.exports = router;