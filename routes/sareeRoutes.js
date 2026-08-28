const express = require('express');
const multer = require('multer');

const {
    createSaree,
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

// POST - Create Saree
sareeRouter.post(
    '/',
    upload.single('image'),
    createSaree
);


// PUT - Update Saree
sareeRouter.put(
    '/:id',
    upload.single('image'),
    updateSaree
);


// DELETE - Delete Saree
sareeRouter.delete(
    '/:id',
    deleteSaree
);


module.exports = sareeRouter;