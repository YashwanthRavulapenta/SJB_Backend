const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const {
    createSaree,
    getSarees,
    getSareeById,
    updateSaree,
    deleteSaree
} = require('../controllers/sareeController');

const sareeRouter = express.Router();


// ================= UPLOAD FOLDER =================

const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'sarees'
);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
        recursive: true
    });
}


// ================= MULTER =================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }

});

const upload = multer({
    storage
});


// ================= GET =================

sareeRouter.get('/', getSarees);

sareeRouter.get('/:id', getSareeById);


// ================= POST =================

sareeRouter.post(
    '/',
    upload.single('image'),
    createSaree
);


// ================= PUT =================

sareeRouter.put(
    '/:id',
    upload.single('image'),
    updateSaree
);


// ================= DELETE =================

sareeRouter.delete(
    '/:id',
    deleteSaree
);


module.exports = sareeRouter;