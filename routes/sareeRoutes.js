const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    __dirname,
    '..',
    'sareesFolder'
);


// Create sareesFolder automatically

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

        const uniqueName =
            Date.now() +
            '-' +
            file.originalname;

        cb(null, uniqueName);

    }

});


const upload = multer({
    storage
});


// ================= GET ALL =================

sareeRouter.get(
    '/',
    getSarees
);


// ================= GET ONE =================

sareeRouter.get(
    '/:id',
    getSareeById
);


// ================= CREATE =================

sareeRouter.post(
    '/',
    upload.single('image'),
    createSaree
);


// ================= UPDATE =================

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


// ================= EXPORT =================

module.exports = sareeRouter;