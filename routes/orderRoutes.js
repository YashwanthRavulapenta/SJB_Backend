const express = require("express");

const router = express.Router();

const {
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin
} = require("../controllers/orderController");

const protect =
    require("../middleware/authMiddleware");

const adminOnly =
    require("../middleware/adminMiddleware");

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


// =====================================================
// ADMIN - GET ALL ORDERS
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


module.exports = router;