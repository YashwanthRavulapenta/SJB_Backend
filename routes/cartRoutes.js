// routes/cartRoutes.js

const express = require("express");

const {
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart
} = require("../controllers/cartController");

const protect =
    require("../middleware/authMiddleware");


const router = express.Router();


// =========================================
// ADD PRODUCT
// =========================================

router.post(
    "/",
    protect,
    addToCart
);


// =========================================
// GET CART
// =========================================

router.get(
    "/",
    protect,
    getCart
);


// =========================================
// UPDATE QUANTITY
// =========================================

router.put(
    "/:itemId",
    protect,
    updateQuantity
);


// =========================================
// REMOVE ITEM
// =========================================

router.delete(
    "/:itemId",
    protect,
    removeFromCart
);


module.exports = router;