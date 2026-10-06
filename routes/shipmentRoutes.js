const express =
    require("express");

const router =
    express.Router();


const {
    createShipment,
    getShipment,
    updateShipmentStatus
} =
    require("../controllers/shipmentController");


const protect =
    require("../middleware/authMiddleware");

const adminOnly =
    require("../middleware/adminMiddleware");


// =====================================================
// ADMIN
// CREATE SHIPMENT
// =====================================================

router.post(

    "/:orderId",

    protect,

    adminOnly,

    createShipment

);


// =====================================================
// CUSTOMER + ADMIN
// GET SHIPMENT
// =====================================================

router.get(

    "/:orderId",

    protect,

    getShipment

);


// =====================================================
// ADMIN
// UPDATE SHIPMENT STATUS
// =====================================================

router.put(

    "/:orderId/status",

    protect,

    adminOnly,

    updateShipmentStatus

);


module.exports =
    router;