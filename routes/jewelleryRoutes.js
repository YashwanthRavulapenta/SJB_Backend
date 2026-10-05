const express = require("express");
const router = express.Router();

const multer = require("multer");

const {
    addJewellery,
    getJewellery,
    getJewelleryById,
    updateJewellery,
    deleteJewellery
} = require("../controllers/jewelleryController");

const protect =
    require("../middleware/authMiddleware");

const adminOnly =
    require("../middleware/adminMiddleware");


// ======================================================
// MULTER
// ======================================================

const storage =
    multer.memoryStorage();

const upload =
    multer({
        storage: storage
    });


// ======================================================
// GET ALL JEWELLERY
// PUBLIC
// ======================================================

router.get(
    "/",
    getJewellery
);


// ======================================================
// GET JEWELLERY BY ID
// PUBLIC
// ======================================================

router.get(
    "/:id",
    getJewelleryById
);


// ======================================================
// ADD JEWELLERY
// ADMIN ONLY
// ======================================================

router.post(
    "/add",
    protect,
    adminOnly,
    upload.single("image"),
    addJewellery
);


// ======================================================
// UPDATE JEWELLERY
// ADMIN ONLY
// ======================================================

router.put(
    "/:id",
    protect,
    adminOnly,
    upload.single("image"),
    updateJewellery
);


// ======================================================
// DELETE JEWELLERY
// ADMIN ONLY
// ======================================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteJewellery
);


module.exports = router;