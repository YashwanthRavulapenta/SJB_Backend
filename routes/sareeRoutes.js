const express = require('express');
const multer = require('multer');

const {
    createSaree,
    getSarees,
    getSareeById,
    updateSaree,
    deleteSaree
} = require('../controllers/sareeController');

const sareeRouter = express.Router();


// ================= MULTER =================

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


// ================= ROUTES =================


// GET ALL SAREES
sareeRouter.get(
    '/',
    getSarees
);


// GET ONE SAREE
sareeRouter.get(
    '/:id',
    getSareeById
);


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