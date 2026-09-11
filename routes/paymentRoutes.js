const express = require("express");

const router = express.Router();

const {
    verifyPayment
} = require("../controllers/paymentController");

const authMiddleware =
    require("../middleware/authMiddleware");


router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);


module.exports = router;