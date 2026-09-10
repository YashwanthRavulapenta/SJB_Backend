const express = require('express');

const router = express.Router();

const {
    addJewellery,
    getJewellery,
    getJewelleryById,
    updateJewellery,
    deleteJewellery
} = require('../controllers/jewelleryController');

const upload = require('../middleware/upload');


// GET ALL
router.get(
    '/',
    getJewellery
);


// GET ONE
router.get(
    '/:id',
    getJewelleryById
);


// ADD
router.post(
    '/add',
    upload.single('image'),
    addJewellery
);


// UPDATE
router.put(
    '/:id',
    upload.single('image'),
    updateJewellery
);


// DELETE
router.delete(
    '/:id',
    deleteJewellery
);


module.exports = router;