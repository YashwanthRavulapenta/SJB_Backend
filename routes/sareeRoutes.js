const express = require('express');

const router = express.Router();

const {
    addSaree,
    getSarees,
    getSareeById,
    updateSaree,
    deleteSaree
} = require('../controllers/sareeController');

const upload = require('../middleware/upload');


// GET ALL
router.get(
    '/',
    getSarees
);


// GET ONE
router.get(
    '/:id',
    getSareeById
);


// ADD
router.post(
    '/add',
    upload.single('image'),
    addSaree
);


// UPDATE
router.put(
    '/:id',
    upload.single('image'),
    updateSaree
);


// DELETE
router.delete(
    '/:id',
    deleteSaree
);


module.exports = router;