const express = require('express');
const multer = require('multer');

const {
    createSaree,
    updateSaree,
    deleteSaree
} = require('../controllers/sareeController.js');

const sareeRouter = express.Router();


// ---------------- MULTER ----------------

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/sarees/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }

});

const upload = multer({
    storage: storage
});


// ---------------- ROUTES ----------------


// CREATE SAREE
sareeRouter.post(
    '/',
    upload.single('image'),
    createSaree
);


// UPDATE SAREE
sareeRouter.put(
    '/:id',
    upload.single('image'),
    updateSaree
);


// DELETE SAREE
sareeRouter.delete(
    '/:id',
    deleteSaree
);


module.exports = sareeRouter;