const express = require("express");

const router =
    express.Router();

const multer = require("multer");

const {

    addJewellery,

    getJewellery,

    getJewelleryById,

    updateJewellery,

    deleteJewellery

} = require(
    "../controllers/jewelleryController"
);


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
// ======================================================

router.get(
    "/",
    getJewellery
);


// ======================================================
// ADD JEWELLERY
// ======================================================

router.post(
    "/add",
    upload.single("image"),
    addJewellery
);


// ======================================================
// GET JEWELLERY BY ID
// ======================================================

router.get(
    "/:id",
    getJewelleryById
);


// ======================================================
// UPDATE JEWELLERY
// ======================================================

router.put(
    "/:id",
    upload.single("image"),
    updateJewellery
);


// ======================================================
// DELETE JEWELLERY
// ======================================================

router.delete(
    "/:id",
    deleteJewellery
);


module.exports = router;