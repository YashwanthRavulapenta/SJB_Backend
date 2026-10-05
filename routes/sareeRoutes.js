const express = require("express");
const router = express.Router();

const multer = require("multer");

const {
    addSaree,
    getSarees,
    getSareeById,
    updateSaree,
    deleteSaree
} = require("../controllers/sareeController");

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
// GET ALL SAREES
// PUBLIC
// ======================================================

router.get(
    "/",
    getSarees
);


// ======================================================
// GET SAREE BY ID
// PUBLIC
// ======================================================

router.get(
    "/:id",
    getSareeById
);


// ======================================================
// ADD SAREE
// ADMIN ONLY
// ======================================================

router.post(
    "/add",
    protect,
    adminOnly,
    upload.single("image"),
    addSaree
);


// ======================================================
// UPDATE SAREE
// ADMIN ONLY
// ======================================================

router.put(
    "/:id",
    protect,
    adminOnly,
    upload.single("image"),
    updateSaree
);


// ======================================================
// DELETE SAREE
// ADMIN ONLY
// ======================================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteSaree
);


module.exports = router;