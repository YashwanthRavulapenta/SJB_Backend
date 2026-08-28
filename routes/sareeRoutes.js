const express = require('express');
const multer = require('multer');
const fs = require('fs');

const {
    createSaree,
    updateSaree,
    deleteSaree
} = require('../controllers/sareeController');

const sareeRouter = express.Router();


// Create uploads/sarees folder if it doesn't exist
if (!fs.existsSync('uploads/sarees')) {
    fs.mkdirSync('uploads/sarees', {
        recursive: true
    });
}


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

// POST
sareeRouter.post(
    '/',
    upload.single('image'),
    createSaree
);


// UPDATE
sareeRouter.put(
    '/:id',
    upload.single('image'),
    updateSaree
);


// DELETE
sareeRouter.delete(
    '/:id',
    deleteSaree
);


module.exports = sareeRouter;