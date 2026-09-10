const express = require("express");

const {
    addToCart,
    getCart
} = require("../controllers/cartController");

const protect =
    require("../middleware/authMiddleware");


const router = express.Router();


// Add product
router.post(
    "/",
    protect,
    addToCart
);


// Get user's cart
router.get(
    "/",
    protect,
    getCart
);


module.exports = router;