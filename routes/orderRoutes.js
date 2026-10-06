const express = require("express");

const router = express.Router();


// =====================================================
// CONTROLLERS
// =====================================================

const {
    createOrder,
    getMyOrders,
    getOrderById,

    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin
} = require("../controllers/orderController");


// =====================================================
// MIDDLEWARE
// =====================================================

const protect =
    require("../middleware/authMiddleware");

const adminOnly =
    require("../middleware/adminMiddleware");


// =====================================================
// CUSTOMER - CREATE ORDER
// =====================================================

router.post(
    "/create",
    protect,
    createOrder
);


// =====================================================
// CUSTOMER - GET MY ORDERS
// =====================================================

router.get(
    "/my-orders",
    protect,
    getMyOrders
);


// =====================================================
// ADMIN - GET ALL ORDERS
//
// IMPORTANT:
// Admin routes MUST come before "/:id"
// =====================================================

router.get(
    "/admin/all",
    protect,
    adminOnly,
    getAllOrdersAdmin
);


// =====================================================
// ADMIN - GET SINGLE ORDER
// =====================================================

router.get(
    "/admin/:id",
    protect,
    adminOnly,
    getOrderByIdAdmin
);


// =====================================================
// ADMIN - UPDATE ORDER STATUS
// =====================================================

router.put(
    "/admin/:id/status",
    protect,
    adminOnly,
    updateOrderStatusAdmin
);


// =====================================================
// CUSTOMER - GET SINGLE ORDER
//
// KEEP THIS LAST
// =====================================================

router.get(
    "/:id",
    protect,
    getOrderById
);


module.exports = router;