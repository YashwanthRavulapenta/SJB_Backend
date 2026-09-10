const express = require("express");

const {
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Add product
router.post("/", protect, addToCart);


// Get user's cart
router.get("/", protect, getCart);


// Update quantity
router.put("/:itemId", protect, updateQuantity);


// Remove item
router.delete("/:itemId", protect, removeFromCart);


module.exports = router;